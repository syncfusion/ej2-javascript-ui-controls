/**
 * Video module spec
 */
import { Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextEditor, QuickToolbar, IQuickToolbar } from './../../../src/index';
import { NodeSelection } from './../../../src/selection/index';
import { DialogType } from "../../../src/common/enum";
import { renderRTE, destroy, setCursorPoint, dispatchEvent, iPhoneUA, currentBrowserUA, setSelection } from "./../render.spec";
import { BASIC_MOUSE_EVENT_INIT, DELETE_EVENT_INIT } from '../../constant.spec';
import { MACOS_USER_AGENT } from '../user-agent.spec';

function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}

const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);

const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);

describe('Video Module ', () => {

    describe('921233: Quick toolbar fails to open and script error occurs after replacing  video in events', function () {
        let rteEle;
        let editor: RichTextEditor;
        beforeAll(function () {
            editor = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: false },
                actionBegin: function (e) {
                    if (e.item.subCommand === 'Video') {
                        expect(!isNullOrUndefined(e.itemCollection)).toBe(true);
                        expect(!isNullOrUndefined(e.itemCollection.url)).toBe(true);
                    }
                },
                actionComplete: function (e) {
                    if (e.requestType === 'Video') {
                        expect(e.requestType === 'Video').toBe(true);
                    }
                }
            });
            rteEle = editor.element;
        });
        afterAll(function () {
            destroy(editor);
        });
        it('Replace Web url using quick toolbar', function (done) {
            editor.focusIn();
            const toolbarItem: HTMLElement = editor.element.querySelector('.e-toolbar-item .e-video');
            toolbarItem.click();
            setTimeout(() => {
                const dialog: HTMLElement = editor.element.querySelector('.e-rte-video-dialog');
                const textArea: HTMLTextAreaElement = dialog.querySelector('.e-embed-video-url');
                textArea.value = '<iframe width="560" height="315" src="https://www.youtube.com/embed/IB2P1FBXjcQ?si=6ReBEsgCNdSMlQAV" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
                textArea.dispatchEvent(new Event('input'));
                const insertButton: HTMLButtonElement = dialog.querySelector('.e-insertVideo.e-primary');
                insertButton.click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelector('iframe')).not.toBe(null);
                    const target: HTMLElement = editor.inputElement.querySelector('.e-embed-video-wrap');
                    (editor as any).formatter.editorManager.nodeSelection.setSelectionNode(editor.contentModule.getDocument(), target);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickToolbar: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const replaceButton: HTMLElement = quickToolbar.querySelector('.e-video-replace');
                        replaceButton.click();
                        setTimeout(() => {
                            const dialog: HTMLElement = editor.element.querySelector('.e-rte-video-dialog');
                            const urlRadio: HTMLInputElement = dialog.querySelector('#webURL');
                            urlRadio.checked = true;
                            const changeEvent = new Event("change", { bubbles: true, cancelable: true });
                            urlRadio.dispatchEvent(changeEvent);
                            const input: HTMLInputElement = dialog.querySelector('.e-video-url');
                            input.value = 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4';
                            input.dispatchEvent(new Event('input'));
                            const insertButton: HTMLButtonElement = dialog.querySelector('.e-insertVideo.e-primary');
                            insertButton.click();
                            setTimeout(() => {
                                expect(editor.inputElement.querySelector('.e-embed-video-wrap')).toBe(null);
                                expect(editor.inputElement.querySelector('video')).not.toBe(null);
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('video resize', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let vidResizeDiv: HTMLElement;
        let clickEvent: any;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert Video here',
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: true, minHeight: 80, minWidth: 80 },
                actionBegin: function (e: any) {
                    if (e.item.subCommand === 'Video') {
                        expect(!isNullOrUndefined(e.itemCollection)).toBe(true);
                        expect(!isNullOrUndefined(e.itemCollection.url)).toBe(true);
                    }
                    if (e.item.subCommand === 'JustifyLeft') { expect(e.item.subCommand === 'JustifyLeft').toBe(true); }
                    if (e.item.subCommand === 'JustifyRight') { expect(e.item.subCommand === 'JustifyRight').toBe(true); }
                    if (e.item.subCommand === 'JustifyCenter') { expect(e.item.subCommand === 'JustifyCenter').toBe(true); }
                    if (e.item.subCommand === 'Inline') { expect(e.item.subCommand === 'Inline').toBe(true); }
                    if (e.item.subCommand === 'Break') { expect(e.item.subCommand === 'Break').toBe(true); }
                },
                actionComplete: function (e: any) {
                    if (e.requestType === 'Video') { expect(e.requestType === 'Video').toBe(true); }
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect((rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement).classList.contains('e-placeholder-enabled')).toBe(true);
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            let placeHolder: HTMLElement = (rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement);
            expect(placeHolder.classList.contains('e-placeholder-enabled')).toBe(true);
        });
        it('resize start', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            clickEvent.target.width = 120;
            clickEvent.target.height = 80;
            (rteObj.videoModule as any).resizeStart(clickEvent, clickEvent.target);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-videoboxmark').length).toBe(4);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeEnd({ target: resizeBot });
            //resize end evnet cannot remove helper element.
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect((rteObj.videoModule as any).pageX).toBe(null);
            expect(rteObj.contentModule.getDocument().body.contains(vidResizeDiv)).toBe(false);
        });
        it('resizing - mousemove - bottom right', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-video') as HTMLElement).offsetWidth;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 300 });

            width += 100;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
        });
        it('resizing - mousemove - top right', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-topRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.topRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-video') as HTMLElement).offsetWidth;
            (<any>rteObj.videoModule).resizeBtnStat.topRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            (<any>rteObj.videoModule).resizeBtnStat.topRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
        });
        it('resizing - mousemove - top Left', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-topLeft') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.topLeft = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-video') as HTMLElement).offsetWidth;
            (<any>rteObj.videoModule).resizeBtnStat.topLeft = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            (<any>rteObj.videoModule).resizeBtnStat.topLeft = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
        });

        it('resizing - mousemove - bottom Left', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botLeft') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botLeft = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
        });
    });

    describe('percentage resize', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        let vidResizeDiv: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: true, resizeByPercent: true }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();

        });
        it('resize start', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-videoboxmark').length).toBe(4);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeEnd({ target: resizeBot });
            //resize end evnet cannot remove helper element.
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect((rteObj.videoModule as any).pageX).toBe(null);
            expect(rteObj.contentModule.getDocument().body.contains(vidResizeDiv)).toBe(false);
        });
        it('resizing - mousemove - bottom right', (done) => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            setTimeout(() => {
                let width = (rteObj.element.querySelector('.e-rte-video') as HTMLElement).offsetWidth;
                (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
                (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 300 });
                setTimeout(() => {
                    width += 100;
                    (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
                    (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 100 });
                    setTimeout(() => {
                        width -= 200;
                        done();
                    }, 200);
                }, 200);
            }, 200);
        });
    });

    describe('predefined set video', () => {
        let rteObj: RichTextEditor;
        let clickEvent: any;
        let vidResizeDiv: HTMLElement;
        let innerHTML: string = `<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
<span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>
`;
        let innerHTML1: string = `<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
<span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>
`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
                insertVideoSettings: { resize: true }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('resize start', () => {
            let trg = (rteObj.element.querySelector('video') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-videoboxmark').length).toBe(4);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            let trg = (rteObj.element.querySelector('video') as HTMLElement);
            (rteObj.videoModule as any).resizeEnd({ target: resizeBot });
            //resize end evnet cannot remove helper element.
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect((rteObj.videoModule as any).pageX).toBe(null);
            expect(rteObj.contentModule.getDocument().body.contains(vidResizeDiv)).toBe(false);
        });
        it('resizing', () => {
            let trg = (rteObj.element.querySelector('video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('video') as HTMLElement).offsetWidth;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            expect(width).toEqual(width);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
            expect(width).toEqual(width);
            rteObj.value = null;
            rteObj.dataBind();
            rteObj.value = innerHTML1;
            rteObj.dataBind();
            trg = (rteObj.element.querySelector('video') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            resizeBot = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
        });
    });

    describe('848794 - Unable to resize the video when the resizeByPercent is set to true', () => {
        let rteObj: RichTextEditor;
        let clickEvent: any;
        let innerHTML: string = `<p><b>Description:</b></p>
        <p>The Rich Text Editor (RTE) control is an easy to render in
        client side. Customer easy to edit the contents and get the HTML content for
        <span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>
        `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
                insertVideoSettings: { resizeByPercent: true }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Unable to resize the video when the resizeByPercent is set to true', () => {
            let trg = (rteObj.element.querySelector('video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('video') as HTMLElement).offsetWidth;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            expect(width).toEqual(width);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
            expect(width).toEqual(width);
        });
    });

    describe('868800 - The resize was not working in the video elements while Rich Textbox Editor inside the iframe', () => {
        let rteObj: RichTextEditor;
        let clickEvent: any;
        let innerHTML: string = `<p><b>Description:</b></p>
        <p>The Rich Text Editor (RTE) control is an easy to render in
        client side. Customer easy to edit the contents and get the HTML content for
        <span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>
        `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
                insertVideoSettings: { resizeByPercent: true },
                iframeSettings: { enable: true }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('The resize was not working in the video elements while Rich Textbox Editor inside the iframe', () => {
            let trg = (rteObj.contentModule.getEditPanel().querySelector('video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.contentModule.getEditPanel().querySelector('video') as HTMLElement).offsetWidth;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            expect(width).toEqual(width);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
            expect(width).toEqual(width);
        });
    });

    describe('mobile resize', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let vidResizeDiv: HTMLElement;
        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;
        let clickEvent: any;
        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: true }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it('mobile UI', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') },
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.contentModule.getDocument().body.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-videoboxmark').length).toBe(4);
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: resizeBot, preventDefault: function () { }, stopImmediatePropagation: function () { } });
            (rteObj.videoModule as any).resizing({ target: resizeBot, touches: [{ pageX: 300 }] });
            expect((rteObj.videoModule as any).pageX).toBe(300);
            (rteObj.videoModule as any).onDocumentClick({ target: rteObj.contentModule.getEditPanel() });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).toBe(null);
            expect(rteObj.contentModule.getDocument().body.contains(vidResizeDiv)).toBe(false);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (rteObj.videoModule as any).resizeStart({ target: resizeBot, preventDefault: function () { }, stopImmediatePropagation: function () { } });
        });
    });

    describe('868583 - The resize bar not shown while Rich Textbox Editor inside the iframe', () => {
        let rteObj: RichTextEditor;
        let clickEvent: any;
        let innerHTML: string = `<p><b>Description:</b></p>
        <p>The Rich Text Editor (RTE) control is an easy to render in
        client side. Customer easy to edit the contents and get the HTML content for
        <span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>
        `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
                insertVideoSettings: { resizeByPercent: true },
                iframeSettings: { enable: true }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('The resize bar not shown while Rich Textbox Editor inside the iframe', () => {
            let trg = (rteObj.contentModule.getEditPanel().querySelector('video') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-videoboxmark').length).toBe(4);
            const styles = rteObj.contentModule.getDocument().defaultView.getComputedStyle(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-videoboxmark')[0]);
            expect(styles.width).toBe('10px');
            expect(styles.height).toBe('10px');
            expect(styles.position).toBe('absolute');
            expect(styles.display).toBe('block');
            expect(styles.background.includes('rgb(74, 144, 226)')).toBe(true);
            expect(styles.zIndex).toBe('1000');
        });
    });

    describe('video resize events', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: true },
                resizeStart: function (e: any) {
                    expect(e.name === 'resizeStart').toBe(true);
                    e.cancel = true;
                },
                resizeStop: function (e: any) {
                    expect(e.name === 'resizeStop').toBe(true);
                    e.cancel = true;
                },
                resizing: function (e: any) {
                    expect(e.name === 'resizing').toBe(true);
                    e.cancel = true;
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Video dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') },
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
        });
        it('resize start event', () => {
            let trget = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trget, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-topLeft') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-videoboxmark').length).toBe(0);
        });
        it('resize end and resizing events', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeEnd({ target: trg });
            (rteObj.videoModule as any).resizeStart({ target: trg });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-video') as HTMLElement).offsetWidth;
            expect(width).toEqual(parseInt(getComputedStyle((trg as HTMLVideoElement)).width));
        });
    });

    describe('video resize with undo redo', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
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
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: true, minHeight: 80, minWidth: 80 }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();

        });
        it('resizing - mousemove - bottom right', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-video') as HTMLElement).offsetWidth;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 300 });
            expect(width).toEqual((rteObj.element.querySelector('.e-rte-video') as HTMLElement).offsetWidth);
            (rteObj.videoModule as any).resizeEnd({ target: resizeBot });
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 90;
            keyboardEventArgs.action = 'undo';
            (<any>rteObj).videoModule.onKeyDown({ args: keyboardEventArgs });
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 89;
            keyboardEventArgs.action = 'redo';
            (<any>rteObj).videoModule.onKeyDown({ args: keyboardEventArgs });
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
            trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            expect(trg.style.outline === '').toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).toBe(null);
        });
    });

    describe('Video change aspect ratio when resized to smallest possible and back larger again - ', () => {
        let rteObj: RichTextEditor;
        let clickEvent: MouseEvent;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span></p>'
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' Resizing with offsetHeight test ', (done: Function) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let trg = (rteEle.querySelector('video') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            let vidHeight: number = trg.offsetHeight;
            (rteObj.videoModule as any).resizing({ target: document.body, pageX: 200 });
            setTimeout(() => {
                expect(vidHeight <= document.querySelector('video').offsetHeight).toBe(true);
                done();
            }, 100);
        });
    });

    describe(' Quick Toolbar open testing after selecting some text', () => {
        let rteObj: any;
        let ele: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<div id='rte'><p><b>Syncfusion</b> Software</p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video id='vidTag' class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>`
            });
        });
        it(" selecting some text and then clicking on video test ", (done: DoneFn) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 2);
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#vidTag');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('876602 - Double quick toolbar open when click the video', () => {
        let rteObj: any;
        beforeAll(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false,
                    text: ['Bold', 'Italic', 'Underline', 'StrikeThrough', 'FontColor', 'BackgroundColor', '|',
                        'FontName', 'FontSize', 'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList']
                },
                value: `<div id='rte'><p><b>Syncfusion</b> Software</p><span class=\"e-video-wrap\" contenteditable=\"false\" title=\"mov_bbb.mp4\"><span class="e-video-clickelem"><iframe width="auto" height="auto" src="https://www.youtube.com/embed/hveapZxnOFY?si=zU9QX1Vww3ZIowHA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" style="min-width: 0px; max-width: 1166px; min-height: 0px;" class="e-rte-embed-url e-resize e-video-focus"></iframe></span></span><br>`
            });
        });
        it("Double quick toolbar open when click the video", (done: DoneFn) => {
            let target = <HTMLElement>(rteObj as any).element.querySelectorAll(".e-content")[0];
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-video-clickelem');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: clickEvent });
            setTimeout(() => {
                expect(!isNullOrUndefined(document.querySelector('.e-video-wrap') as HTMLElement)).toBe(true);
                expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                expect(document.querySelectorAll('.e-rte-quick-popup').length === 1).toBe(true);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Open video dialog and click cancel', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let actionComplete: any;
        beforeAll(() => {
            actionComplete = jasmine.createSpy("actionComplete");
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Inserting video and applying heading', (done: Function) => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Insert Video').toBe(true);
            expect(dialogEle.querySelector('.e-vid-uploadwrap').firstElementChild.classList.contains('e-droptext')).toBe(true);
            (document.querySelector('.e-cancel') as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.element.lastElementChild.classList.contains('.e-dialog')).not.toBe(true);
                done();
            }, 100);
        });
    });

    describe('div content-rte testing', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video dialog Coverage', (done: Function) => {
            rteObj.value = '<p id="contentId">hello  </p>',
                rteObj.dataBind();
            let pTag: HTMLElement = rteObj.element.querySelector('#contentId') as HTMLElement;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pTag.childNodes[0], pTag.childNodes[0], 0, 5);
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Insert Video').toBe(true);
            expect(dialogEle.querySelector('.e-vid-uploadwrap').firstElementChild.classList.contains('e-droptext')).toBe(true);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('.e-dialog')).not.toBe(true);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let args: any = {
                item: { url: window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4', selection: save },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.videoObj.createVideo(args);
            (rteObj.element.querySelector('.e-rte-video') as HTMLElement).focus();
            args = {
                item: { url: null, selection: null },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.videoObj.createVideo(args);
            let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
            evnArg.selectNode = [(<any>rteObj).element.querySelector('.e-rte-video')];
            let trg: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: evnArg.selectNode[0] };
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
            done();
        });
    });
    describe('div content', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;
        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it('mobile UI', () => {
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('e-dlg-container')).toBe(false);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            Browser.userAgent = defaultUA;
        });
    });

    describe('Inserting video and applying heading', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let actionComplete: any;
        beforeAll(() => {
            actionComplete = jasmine.createSpy("actionComplete");
            rteObj = renderRTE({
                actionComplete: actionComplete,
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold', 'Formats']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Inserting video and applying heading', (done: Function) => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Insert Video').toBe(true);
            expect(dialogEle.querySelector('.e-vid-uploadwrap').firstElementChild.classList.contains('e-droptext')).toBe(true);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('.e-dialog')).not.toBe(true);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let args: any = {
                item: { url: window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4', selection: save },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.videoObj.createVideo(args);
            (rteObj.element.querySelector('.e-rte-dropdown-btn') as HTMLElement).click();
            (document.querySelector('.e-h1') as HTMLElement).click();
            setTimeout(() => {
                expect(actionComplete).toHaveBeenCalled();
                done();
            }, 100);
        });
    });

    describe('BLAZ-25388 - Inserting video in firefox', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let actionComplete: any;
        let defaultUserAgent = navigator.userAgent;
        let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
        beforeAll(() => {
            Browser.userAgent = fireFox;
            actionComplete = jasmine.createSpy("actionComplete");
            rteObj = renderRTE({
                actionComplete: actionComplete,
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold', 'Formats']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = defaultUserAgent;
        });
        it('BLAZ-25388 - Inserting video', (done: Function) => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Insert Video').toBe(true);
            expect(dialogEle.querySelector('.e-vid-uploadwrap').firstElementChild.classList.contains('e-droptext')).toBe(true);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('.e-dialog')).not.toBe(true);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let args: any = {
                item: { url: window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4', selection: save },
                preventDefault: function () { },
                selector: 'content',
                callBack: function () { }
            };
            (<any>rteObj).formatter.editorManager.videoObj.createVideo(args);
            (<any>rteObj).formatter.editorManager.videoObj.editAreaVideoClick({ callBack: function () { } });
            setTimeout(() => {
                expect(rteObj.inputElement.querySelectorAll('video').length > 0).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Inserting video and applying heading in IE11', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let actionComplete: any;
        beforeAll(() => {
            Browser.userAgent = 'msie';
            actionComplete = jasmine.createSpy("actionComplete");
            rteObj = renderRTE({
                actionComplete: actionComplete,
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold', 'Formats']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Inserting video and applying heading in IE11', (done: Function) => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Insert Video').toBe(true);
            expect(dialogEle.querySelector('.e-vid-uploadwrap').firstElementChild.classList.contains('e-droptext')).toBe(true);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('.e-dialog')).not.toBe(true);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let args: any = {
                item: { url: window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4', selection: save },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.videoObj.createVideo(args);
            (rteObj.element.querySelector('.e-rte-dropdown-btn') as HTMLElement).click();
            (document.querySelector('.e-h1') as HTMLElement).click();
            expect(actionComplete).toHaveBeenCalled();
            done();
        });
    });
    describe('div content-rte testing', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: {
                    allowedTypes: ['mp3', 'wav', 'm4a', 'wma'],
                    layoutOption: 'Inline',
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox'
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('upload the video while use save url', (done) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let fileObj: File = new File(["Nice One"], "sample.mp3", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                expect((<any>rteObj).videoModule.uploadObj.fileList.length).toEqual(1);
                (document.getElementsByClassName('e-browsebtn')[0] as HTMLElement).click()
                done();
            }, 1000);
        });
    });

    describe('dialogOpen Event- Check dialog element', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video']
                },
                dialogOpen: function (e) {
                    expect((e as any).element.querySelector('.e-upload.e-control-wrapper')).not.toBe(null);
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('Check uploader element in dialog content', function () {
            (rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        });
    });

    describe('video dialog - documentClick', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            action: 'insert-video',
            key: 's'
        };
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video']
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('open video dialog - click on video item in toolbar', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<any>rteObj).videoModule.onKeyDown({ args: keyboardEventArgs });
            expect(document.body.contains((<any>rteObj).videoModule.dialogObj.element)).toBe(true);

            let eventsArgs: any = { target: rteObj.element.querySelector('.e-video'), preventDefault: function () { } };
            (<any>rteObj).videoModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).videoModule.dialogObj.element)).toBe(true);

            eventsArgs = { target: document.querySelector('[title="Insert Video (Ctrl+Alt+V)"]'), preventDefault: function () { } };
            (<any>rteObj).videoModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).videoModule.dialogObj.element)).toBe(true);

            eventsArgs = { target: document.querySelector('[title="Insert Video (Ctrl+Alt+V)"]').parentElement, preventDefault: function () { } };
            (<any>rteObj).videoModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).videoModule.dialogObj.element)).toBe(true);
        });
        it('close video dialog - while click on document', () => {
            let eventsArgs = { target: document, preventDefault: function () { } };
            (<any>rteObj).videoModule.onDocumentClick(eventsArgs);
            expect((<any>rteObj).videoModule.dialogObj).toBe(null);
        });
    });
    describe('Removing the video', () => {
        let rteEle: HTMLElement;
        let editor: RichTextEditor;
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
        let innerHTML1: string = `<p>testing&nbsp;<video controls><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video><br></p>`;
        beforeAll(() => {
            editor = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = editor.element;
        });
        afterAll(() => {
            destroy(editor);
        });

        it('video remove with quickToolbar check', (done: Function) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('video');
            setSelection(target, 0, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                quickTBItem.item(5).click();
                expect((<any>editor).contentModule.getEditPanel().querySelector('.e-video-wrap')).toBe(null);
                done();
            }, 200);
        });
    });

    describe('Video deleting when press backspace button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML1: string = `testing
        <span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Video delete action checking using backspace key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].lastChild;
            setCursorPoint(node, 0);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect((<any>rteObj).inputElement.querySelector('.e-video-wrap')).toBe(null);
                done();
            }, 100);
        });
    });

    describe('Video deleting when press backspace button nodeType as 1', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML1: string = `testing
        <span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Video delete action checking using backspace key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].childNodes[1];
            setCursorPoint(node, 0);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect((<any>rteObj).inputElement.querySelector('.e-video-wrap')).toBe(null);
                done();
            }, 100);
        });
    });

    describe('Video deleting when press delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
        let innerHTML1: string = `testing<span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Video delete action checking using delete key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].firstChild;
            setCursorPoint(node, 7);
            keyBoardEvent.keyCode = 46;
            keyBoardEvent.code = 'Delete';
            keyBoardEvent.action = 'delete';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {

                expect((<any>rteObj).inputElement.querySelector('.e-video-wrap')).toBe(null);
                done();
            }, 100);
        });
    });

    describe('Video deleting when press delete button as nodeType 1', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
        let innerHTML1: string = `testing<span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Video delete action checking using delete key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].childNodes[1];
            setCursorPoint(node, 0);
            keyBoardEvent.keyCode = 46;
            keyBoardEvent.code = 'Delete';
            keyBoardEvent.action = 'delete';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect((<any>rteObj).inputElement.querySelector('.e-video-wrap')).toBe(null);
                done();
            }, 100);
        });
    });

    describe('Video with inline applied', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
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
        let innerHTML1: string = `
             <p>testing&nbsp;<span class="e-video-wrap" contenteditable="false" title="mov_bob.mp4"><span class="e-clickElem"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp3"></video></span></span><br></p>
             `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('classList testing for inline', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-video-wrap video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            eventsArg = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });
            (<any>rteObj).videoModule.videoEle = rteObj.contentModule.getEditPanel().querySelector('.e-video-wrap video');
            setTimeout(function () {
                let mouseEventArgs = {
                    item: { command: 'Videos', subCommand: 'Inline' }
                };
                let video: HTMLElement = rteObj.element.querySelector('.e-rte-video') as HTMLElement;
                (<any>rteObj).videoModule.alignmentSelect(mouseEventArgs);
                expect(video.classList.contains('e-video-inline')).toBe(true);
                done();
            }, 200);
        });
    });

    describe('Video with break applied ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
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
        let innerHTML1: string = `
             <p>testing&nbsp;<span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>
             `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('classList testing for break', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-video-wrap video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            eventsArg = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });
            (<any>rteObj).videoModule.videoEle = rteObj.contentModule.getEditPanel().querySelector('.e-video-wrap video');
            setTimeout(function () {
                let mouseEventArgs = {
                    item: { command: 'Videos', subCommand: 'Break' }
                };
                let video: HTMLElement = rteObj.element.querySelector('.e-rte-video') as HTMLElement;
                (<any>rteObj).videoModule.alignmentSelect(mouseEventArgs);
                expect(video.classList.contains('e-video-break')).toBe(true);
                done();
            }, 200);
        });
    });

    describe('Video with align testing -', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML1: string = `
            <p>testing&nbsp;<span class="e-video-wrap" contenteditable="false" title="mov_bob.mp4"><span class="e-clickElem"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp3"></video></span></span><br></p>
            `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('left applied', (done: Function) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('video');
            setSelection(target, 0, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                const quickToolbar: HTMLElement = document.body.querySelector('.e-video-quicktoolbar');
                const alignDropDownButton: HTMLElement = quickToolbar.querySelector('.e-justify-left').parentElement;
                alignDropDownButton.click();
                const alignDropDownPopup: HTMLElement = document.body.querySelector('.e-dropdown-popup.e-popup-open');
                (alignDropDownPopup.querySelector('.e-justify-left') as HTMLElement).click();
                setTimeout(() => {
                    let video: HTMLElement = rteObj.element.querySelector('.e-rte-video') as HTMLElement;
                    expect(video.classList.contains('e-video-left')).toBe(true);
                    done();
                }, 100);
            }, 200);
        });
        it('right applied', (done: Function) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('video');
            setSelection(target, 0, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                const quickToolbar: HTMLElement = document.body.querySelector('.e-video-quicktoolbar');
                const alignDropDownButton: HTMLElement = quickToolbar.querySelector('.e-justify-left').parentElement;
                alignDropDownButton.click();
                const alignDropDownPopup: HTMLElement = document.body.querySelector('.e-dropdown-popup.e-popup-open');
                (alignDropDownPopup.querySelector('.e-justify-right') as HTMLElement).click();
                setTimeout(() => {
                    let video: HTMLElement = rteObj.element.querySelector('.e-rte-video') as HTMLElement;
                    expect(video.classList.contains('e-video-right')).toBe(true);
                    done();
                }, 100);
            }, 200);
        });
        it('center applied', (done: Function) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('video');
            setSelection(target, 0, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                const quickToolbar: HTMLElement = document.body.querySelector('.e-video-quicktoolbar');
                const alignDropDownButton: HTMLElement = quickToolbar.querySelector('.e-justify-left').parentElement;
                alignDropDownButton.click();
                const alignDropDownPopup: HTMLElement = document.body.querySelector('.e-dropdown-popup.e-popup-open');
                (alignDropDownPopup.querySelector('.e-justify-center') as HTMLElement).click();
                setTimeout(() => {
                    let video: HTMLElement = rteObj.element.querySelector('.e-rte-video') as HTMLElement;
                    expect(video.classList.contains('e-video-center')).toBe(true);
                    done();
                }, 100);
            }, 200);
        });
    });

    describe('Video quick toolbar - iframe', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><span class="e-embed-video-wrap" contenteditable="false"><span class="e-video-clickelem"><iframe width="auto" height="auto" src="https://www.youtube.com/embed/hveapZxnOFY?si=zU9QX1Vww3ZIowHA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" style="min-width: 0px; max-width: 991px; min-height: 0px;" class="e-rte-embed-url e-resize">&ZeroWidthSpace;</iframe></span></span><br></p>`
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' Dimension dialog rendering and testing in iframe', (done: Function) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('.e-video-clickelem');
            setSelection(target, 0, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let videoBtn: HTMLElement = document.getElementById(controlId + "_quick_VideoDimension");
                videoBtn.parentElement.click();
                let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
                expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Video Size').toBe(true);
                expect(dialogEle.querySelector('.e-dlg-content').firstElementChild.classList.contains('e-video-sizewrap')).toBe(true);
                let range: any = new NodeSelection().getRange(document);
                let save: any = new NodeSelection().save(range, document);
                let args: any = {
                    item: { url: window.origin + '/base/spec/content/video/mov_bbb.mp4', selection: save },
                    preventDefault: function () { }
                };
                args.item = { width: 200, height: 200, selectNode: [(rteObj.element.querySelector('.e-video-clickelem') as HTMLElement)] };
                (<any>rteObj).formatter.editorManager.videoObj.videoDimension(args);
                (dialogEle.querySelector('.e-vid-width') as HTMLInputElement).value = "200";
                (dialogEle.querySelector('.e-vid-height') as HTMLInputElement).value = "200";
                (rteObj.element.querySelector('.e-rte-video-dialog .e-footer-content button') as HTMLButtonElement).click();
                done();
            }, 100);
        });
    });
    describe('Deleting video using the - ', () => {
        let rteObj: RichTextEditor;
        let innerHTML1: string = `
        <p>testing&nbsp;<span class="e-video-wrap" contenteditable="false" title="mov_bob.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp3"></video></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video']
                },
                insertVideoSettings: {
                    saveUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Save",
                    path: "../Videos/"
                },
                value: innerHTML1
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it(' delete audio method', (done: Function) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = { preventDefault: function () { }, originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }, item: { command: 'Videos', subCommand: 'VideoRemove' } };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg = { args: args, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
            evnArg.selectNode = [rteObj.element.querySelector('video')];
            (<any>rteObj).videoModule.deleteVideo(evnArg);
            setTimeout(() => {
                expect((rteObj as any).element.querySelector('.e-video-wrap')).toBe(null);
                done();
            }, 100);
        });
    });

    describe('video dialog - Short cut key', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            action: 'escape',
            key: 's'
        };
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: {
                    layoutOption: 'Inline',
                    width: '200px',
                    height: '200px',
                    resize: false,
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox'
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('close video dialog - escape', (done: Function) => {
            keyboardEventArgs.action = 'escape';
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(isNullOrUndefined((<any>rteObj).videoModule.dialogObj)).toBe(false);
            (<any>rteObj).videoModule.onKeyDown({ args: keyboardEventArgs });
            setTimeout(() => {
                expect(isNullOrUndefined((<any>rteObj).videoModule.dialogObj)).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Inserting - ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: {
                    layoutOption: 'Inline',
                    width: '200px',
                    height: '200px',
                    resize: false,
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox'
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Embed code as video', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = `<iframe width="560" height="315" src="https://www.youtube.com/embed/4U2ZxO7b8iM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            expect((<any>rteObj).element.querySelector('iframe')).not.toBe(null);
            // Need to enable once fix the embed quick toolbar not open issue (case for Task Bug 876597)
            // let video: HTMLElement  = rteObj.element.querySelector(".e-video-clickelem");
            // setCursorPoint(video, 0);
            // dispatchEvent(video, 'mousedown');
            // video.click();
            // dispatchEvent(video, 'mouseup');
            // setTimeout(function () {
            //     let videoBtn: HTMLElement  = document.getElementById(rteObj.element.id + "_quick_VideoReplace");
            //     videoBtn.parentElement.click();
            //     let dialog: HTMLElement  = document.getElementById(rteObj.element.id + "_video");
            //     let urlEmbedInput: HTMLInputElement = dialog.querySelector('.e-embed-video-url');
            //     expect(urlEmbedInput.value !== null && urlEmbedInput.value !== undefined && urlEmbedInput.value !== '').toBe(true);
            //     (dialog.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            //     let urlInput: HTMLInputElement = dialog.querySelector('.e-video-url');
            //     expect(urlInput.value === null || urlInput.value === undefined || urlInput.value === '').toBe(true);
            // }, 100);
            done();
        });
    });

    describe('Testing input disabled for  - ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('url input for source and embed urls disabled dynamically', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = 'https://www.youtube.com/embed/QJqNYhiHysM';
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect((dialogEle.querySelector('.e-embed-video-url') as HTMLButtonElement).hasAttribute('disabled')).toBe(false);
            // expect((dialogEle.querySelector('.e-video-url') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
            // (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            // (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            // expect((dialogEle.querySelector('.e-embed-video-url') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
            done();
        });
    });

    describe('Mouse Click for video testing when showOnRightClick enabled', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>Hi video is<span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>`,
                quickToolbarSettings: {
                    enable: true,
                    showOnRightClick: true
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(" Test - for mouse click to focus video element", (done) => {
            let target: HTMLElement = rteObj.element.querySelector(".e-video-wrap video");
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let expectElem: HTMLElement[] = (rteObj as any).formatter.editorManager.nodeSelection.getSelectedNodes(document);
                expect(expectElem[0].tagName === 'VIDEO').toBe(true);
                done();
            }, 100);
        });
    });

    describe(' quickToolbarSettings property - video quick toolbar - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' Test - Replace the video ', (done) => {
            let video: HTMLElement = rteObj.element.querySelector(".e-video-wrap video");
            setCursorPoint(video, 0);
            dispatchEvent(video, 'mousedown');
            video.click();
            dispatchEvent(video, 'mouseup');
            setTimeout(() => {
                let videoBtn: HTMLElement = document.getElementById(controlId + "_quick_VideoReplace");
                videoBtn.parentElement.click();
                let png = "http://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a";
                let dialog: HTMLElement = document.getElementById(controlId + "_video");
                (dialog.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
                let urlInput: HTMLInputElement = dialog.querySelector('.e-video-url');
                urlInput.value = png;
                let insertButton: HTMLElement = dialog.querySelector('.e-insertVideo.e-primary');
                urlInput.dispatchEvent(new Event("input"));
                insertButton.click();
                let updateVideo: HTMLSourceElement = rteObj.element.querySelector(".e-video-wrap source");
                expect(updateVideo.src === png).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Video with break applied', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
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
        let innerHTML1: string = `<p>testing&nbsp;<span class="e-embed-video-wrap" contenteditable="false" title="mov_bob.mp4"><span class="e-video-clickelem"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp3"></video></span></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('classList testing for break', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-embed-video-wrap video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            eventsArg = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });

            setTimeout(function () {
                (<any>rteObj).videoModule.videoEle = rteObj.contentModule.getEditPanel().querySelector('.e-video-wrap video');
                (<any>rteObj).videoModule.videoWrapNode = rteObj.contentModule.getEditPanel().querySelector('.e-video-wrap video');
                (<any>rteObj).videoModule.videoClickElem = rteObj.contentModule.getEditPanel().querySelector('.e-rte-video');
                let mouseEventArgs = {
                    item: { command: 'Videos', subCommand: 'Break' }
                };
                let video: HTMLElement = rteObj.element.querySelector('.e-rte-video') as HTMLElement;
                (<any>rteObj).videoModule.alignmentSelect(mouseEventArgs);
                expect(video.classList.contains('e-video-break')).toBe(true);
                done();
            }, 200);
        });
    });

    describe('Video with inline applied with embed wrapper', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
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
        let innerHTML1: string = `<p>testing&nbsp;<span class="e-embed-video-wrap" contenteditable="false" title="mov_bob.mp4"><span class="e-video-clickelem"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp3"></video></span></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('classList testing for inline with embed wrapper', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-embed-video-wrap video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            eventsArg = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(function () {
                (<any>rteObj).videoModule.videoEle = rteObj.contentModule.getEditPanel().querySelector('.e-video-wrap video');
                (<any>rteObj).videoModule.videoWrapNode = rteObj.contentModule.getEditPanel().querySelector('.e-video-wrap video');
                (<any>rteObj).videoModule.videoClickElem = rteObj.contentModule.getEditPanel().querySelector('.e-rte-video');
                let mouseEventArgs = {
                    item: { command: 'Videos', subCommand: 'Inline' }
                };
                let video: HTMLElement = rteObj.element.querySelector('.e-rte-video') as HTMLElement;
                (<any>rteObj).videoModule.alignmentSelect(mouseEventArgs);
                expect(video.classList.contains('e-video-inline')).toBe(true);
                done();
            }, 200);
        });
    });

    describe(' ActionComplete event triggered twice when replace the inserted video using quicktoolbar - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let actionCompleteCalled: boolean = true;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`,
                actionComplete: actionCompleteFun
            });
            function actionCompleteFun(args: any): void {
                actionCompleteCalled = true;
            }
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' Testing video Replace and acitonComplete triggering', (done) => {
            let video: HTMLElement = rteObj.element.querySelector(".e-video-wrap video");
            setCursorPoint(video, 0);
            dispatchEvent(video, 'mousedown');
            video.click();
            dispatchEvent(video, 'mouseup');
            setTimeout(() => {
                let videoBtn: HTMLElement = document.getElementById(controlId + "_quick_VideoReplace");
                videoBtn.parentElement.click();
                let videoFile = "http://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a";
                let dialog: HTMLElement = document.getElementById(controlId + "_video");
                (dialog.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
                let urlInput: HTMLInputElement = dialog.querySelector('.e-video-url');
                urlInput.value = videoFile;
                let insertButton: HTMLElement = dialog.querySelector('.e-insertVideo.e-primary');
                urlInput.dispatchEvent(new Event("input"));
                insertButton.click();
                let updateVideo: HTMLSourceElement = rteObj.element.querySelector(".e-video-wrap source");
                expect(updateVideo.src === videoFile).toBe(true);
                setTimeout(function () {
                    expect(actionCompleteCalled).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Disable the insert Video dialog button when the video is uploading.', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>Testing Video Dialog</p>`,
                toolbarSettings: {
                    items: ['Video']
                }
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' Initial insert video button disabled', (done) => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Video');
            item.click();
            setTimeout(() => {
                let dialog: HTMLElement = document.getElementById(controlId + "_video");
                let insertButton: HTMLElement = dialog.querySelector('.e-insertVideo.e-primary');
                expect(insertButton.hasAttribute('disabled')).toBe(true);
                done();
            }, 100);
        });
    });
    describe('Disable the insert video dialog button when the video is uploading', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                insertVideoSettings: {
                    allowedTypes: ['.mp4'],
                    saveUrl: "uploadbox/Save",
                    path: "../Videos/"
                },
                toolbarSettings: {
                    items: ['Video']
                }
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it(' Button disabled with improper file extension', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp43';
            let fileObj: File = new File(["mov_bob"], "mov_bob.mp43", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect((dialogEle.querySelector('.e-insertVideo') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Getting error while insert the video after applied the  lower case or  upper case commands in Html Editor  - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p id='insert-video'>RichTextEditor</p>`,
                toolbarSettings: {
                    items: [
                        'LowerCase', 'UpperCase', '|',
                        'Video']
                },
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(" Apply uppercase and then insert an video  ", (done) => {
            let pTag: HTMLElement = rteObj.element.querySelector('#insert-video') as HTMLElement;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pTag.childNodes[0], pTag.childNodes[0], 4, 6);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UpperCase');
            item.click();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pTag.childNodes[0], pTag.childNodes[2], 1, 2);
            item = rteObj.element.querySelector('#' + controlId + '_toolbar_Video');
            item.click();
            setTimeout(() => {
                let dialogEle: any = rteObj.element.querySelector('.e-dialog');
                (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
                (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
                (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
                let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
                expect(!isNullOrUndefined(trg)).toBe(true);
                done();
            }, 100);
        });
    });
    describe(' Quick Toolbar showOnRightClick property testing', () => {
        let rteObj: any;
        let ele: HTMLElement;
        it(" leftClick with `which` as '2' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id='vid-container'>
                     <span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>
                 </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#vid-container span');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 400);
        });
        it(" leftClick with `which` as '3' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id='vid-container'>
                     <span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>
                 </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#vid-container video');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 400);
        });
        it(" leftClick with `which` as '1' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id='vid-container'>
                     <span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>
                 </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#vid-container video');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            setCursorPoint(target, 0);
            target.click();
            dispatchEvent(target, 'mouseup');
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                done();
            }, 400);
        });
        it(" rightClick with `which` as '2' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id='vid-container'>
                     <span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>
                 </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#vid-container span');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2 };
            setCursorPoint(target, 0);
            target.click();
            dispatchEvent(target, 'mouseup');
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 400);
        });
        it(" rightClick with `which` as '1' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id='vid-container'>
                     <span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>
                 </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#vid-container span');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            setCursorPoint(target, 0);
            target.click();
            dispatchEvent(target, 'mouseup');
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 400);
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
    });

    describe('Inserting Video as Base64 - ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                insertVideoSettings: {
                    saveFormat: "Base64"
                },
                toolbarSettings: {
                    items: ['Video']
                },
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it(' Test the inserted video in the component ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            let fileObj: File = new File(["mov_bob"], "mov_bob.mp4", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
            (document.querySelector('.e-insertVideo') as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.getContent().querySelector(".e-rte-video.e-video-inline source").getAttribute("src").indexOf("blob") == -1).toBe(true);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).videoModule.deleteVideo(evnArg);
                done();
            }, 1000);
        });
    });

    describe('Inserting Video as Blob - ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                insertVideoSettings: {
                    saveFormat: "Blob"
                },
                toolbarSettings: {
                    items: ['Video']
                },
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it(' Test the inserted video in the component ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            let fileObj: File = new File(["mov_bob"], "mov_bob.mp4", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
            (document.querySelector('.e-insertVideo') as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.getContent().querySelector(".e-rte-video.e-video-inline source").getAttribute("src").indexOf("base64") == -1).toBe(true);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).videoModule.deleteVideo(evnArg);
                done();
            }, 1000);
        });
    });

    describe('Insert video mediaSelected event args cancel true - ', () => {
        let rteObj: RichTextEditor;
        let isMediaUploadSuccess: boolean = false;
        let isMediaUploadFailed: boolean = false;
        beforeAll(() => {
            rteObj = renderRTE({
                fileSelected: mediaSelectedEvent,
                fileUploadSuccess: mediaUploadSuccessEvent,
                fileUploadFailed: mediaUploadFailedEvent,
                insertVideoSettings: {
                    saveUrl: "https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
                    path: "../Videos/"
                },
                toolbarSettings: {
                    items: ['Video']
                },
            });
            function mediaSelectedEvent(e: any) {
                e.cancel = true;
            }
            function mediaUploadSuccessEvent(e: any) {
                isMediaUploadSuccess = true;
            }
            function mediaUploadFailedEvent(e: any) {
                isMediaUploadFailed = true;
            }
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it(' Test the component insert video events - case 1 ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            let fileObj: File = new File(["mov_bob"], "mov_bob.mp4", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect(isMediaUploadSuccess).toBe(false);
                expect(isMediaUploadFailed).toBe(false);
                done();
            }, 1000);
        });
    });

    describe('Insert video mediaRemoving event - ', () => {
        let rteObj: RichTextEditor;
        let mediaRemovingSpy: jasmine.Spy = jasmine.createSpy('onFileRemoving');
        beforeAll(() => {
            rteObj = renderRTE({
                fileRemoving: mediaRemovingSpy,
                toolbarSettings: {
                    items: ['Video']
                },
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it(' Test the component insert video events - case 2 ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            let fileObj: File = new File(["mov_bob"], "mov_bob.mp4", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
            (<any>rteObj).videoModule.uploadUrl = { url: "" };
            (document.querySelector('.e-icons.e-file-remove-btn') as HTMLElement).click();
            expect(mediaRemovingSpy).toHaveBeenCalled();
            setTimeout(() => {
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).videoModule.deleteVideo(evnArg);
                (<any>rteObj).videoModule.uploadObj.upload((<any>rteObj).videoModule.uploadObj.filesData[0]);
                done();
            }, 4000);
        });
    });

    describe('Insert video mediaUploadFailed event - ', () => {
        let rteObj: RichTextEditor;
        let mediaUploadFailedSpy: jasmine.Spy = jasmine.createSpy('onFileUploadFailed');
        beforeAll(() => {
            rteObj = renderRTE({
                fileUploadFailed: mediaUploadFailedSpy,
                insertVideoSettings: {
                    saveUrl: "uploadbox/Save",
                    path: "../Videos/"
                },
                toolbarSettings: {
                    items: ['Video']
                },
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it(' Test the component insert video events - case 3 ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            let fileObj: File = new File(["mov_bob"], "mov_bob.mp4", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect(mediaUploadFailedSpy).toHaveBeenCalled();
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).videoModule.deleteVideo(evnArg);
                (<any>rteObj).videoModule.uploadObj.upload((<any>rteObj).videoModule.uploadObj.filesData[0]);
                done();
            }, 4000);
        });
    });

    describe('Testing allowed extension in video upload - ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                insertVideoSettings: {
                    allowedTypes: ['.mp3'],
                    saveUrl: "uploadbox/Save",
                    path: "../Videos/"
                },
                toolbarSettings: {
                    items: ['Video']
                },
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it(' Test the component insert video with allowedExtension property', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/horse.m4a';
            let fileObj: File = new File(["mov_bob"], "horse.m4a", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect((dialogEle.querySelector('.e-insertVideo') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).videoModule.deleteVideo(evnArg);
                (<any>rteObj).videoModule.uploadObj.upload((<any>rteObj).videoModule.uploadObj.filesData[0]);
                done();
            }, 1000);
        });
    });

    describe('beforeMediaUpload event - ', () => {
        let rteObj: RichTextEditor;
        let beforeMediaUploadSpy: jasmine.Spy = jasmine.createSpy('onBeforeFileUpload');
        beforeAll(() => {
            rteObj = renderRTE({
                beforeFileUpload: beforeMediaUploadSpy,
                toolbarSettings: {
                    items: ['Video']
                },
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it(' Event and arguments test ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            let fileObj: File = new File(["Header"], "mov_bob.mp4", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect(beforeMediaUploadSpy).toHaveBeenCalled();
                done();
            }, 100);
        });
    });

    describe('BeforeDialogOpen eventArgs args.cancel testing', () => {
        let rteObj: RichTextEditor;
        let count: number = 0;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video'],
                },
                beforeDialogOpen(e: any): void {
                    e.cancel = true;
                    count = count + 1;
                },
                dialogClose(e: any): void {
                    count = count + 1;
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('dialogClose event trigger testing', (done) => {
            expect(count).toBe(0);
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                expect(count).toBe(1);
                (rteObj.element.querySelector('.e-content') as HTMLElement).click();
                expect(count).toBe(1);
                done();
            }, 100);
        });
    });
    describe('BeforeDialogOpen event is not called for second time', () => {
        let rteObj: RichTextEditor;
        let count: number = 0;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video']
                },
                beforeDialogOpen(e: any): void {
                    e.cancel = true;
                    count = count + 1;
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('beforeDialogOpen event trigger testing', (done) => {
            expect(count).toBe(0);
            (rteObj.element.querySelectorAll('.e-toolbar-item')[0].querySelector('button') as HTMLElement).click();
            setTimeout(() => {
                expect(count).toBe(1);
                done();
            }, 100);
        });
    });
    describe('Checking video replace, using the video dialog', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video']
                },
                value: `<span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>`
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video dialog', (done) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let fileObj: File = new File(["Testing"], "test.mp3", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
            (<any>rteObj).videoModule.uploadObj.upload((<any>rteObj).videoModule.uploadObj.filesData[0]);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            setTimeout(() => {
                expect((rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-video-wrap')).not.toBe(null);
                done();
            }, 100);
        });
    });
    describe('Video outline style testing, while focus other content or video', () => {
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video'],
                },
                value: '<p>Sample Text</p> <p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span></p>'
            });
            QTBarModule = getQTBarModule(rteObj);
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('first video click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            dispatchEvent(rteObj.element.querySelectorAll('.e-content video')[0] as HTMLElement, 'mousedown');
            expect((rteObj.element.querySelectorAll('.e-content .e-video-wrap video')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
            done();
        });
        it('second video click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            dispatchEvent(rteObj.element.querySelectorAll('.e-content video')[1] as HTMLElement, 'mousedown');
            expect((rteObj.element.querySelectorAll('.e-content .e-video-wrap video')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
            done();
        });
        it('first video click after p click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            dispatchEvent(rteObj.element.querySelectorAll('.e-content video')[0] as HTMLElement, 'mousedown');
            expect((rteObj.element.querySelectorAll('.e-content .e-video-wrap video')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
            done();
        });
        it('second video click after p click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            dispatchEvent(rteObj.element.querySelectorAll('.e-content video')[1] as HTMLElement, 'mousedown');
            expect((rteObj.element.querySelectorAll('.e-content .e-video-wrap video')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
            done();
        });
    });
    describe('Video focus not working after outside click then again click a video', () => {
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video'],
                },
                value: '<p>Sample Text</p> <span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span>'
            });
            QTBarModule = getQTBarModule(rteObj);
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('video click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            dispatchEvent(rteObj.element.querySelectorAll('.e-content video')[0] as HTMLElement, 'mousedown');
            expect((rteObj.element.querySelectorAll('.e-content .e-video-wrap video')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
            done();
        });
        it('Again video click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            dispatchEvent(rteObj.element.querySelectorAll('.e-content video')[0] as HTMLElement, 'mousedown');
            expect((rteObj.element.querySelectorAll('.e-content .e-video-wrap video')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
            done();
        });
    });
    describe('ShowDialog, CloseDialog method testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({});
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('show/hide dialog testing', (done) => {
            rteObj.showDialog(DialogType.InsertVideo);
            setTimeout(() => {
                expect(document.body.querySelectorAll('.e-rte-video-dialog.e-dialog').length).toBe(1);
                rteObj.closeDialog(DialogType.InsertVideo);
                setTimeout(() => {
                    expect(document.body.querySelectorAll('.e-rte-video-dialog.e-dialog').length).toBe(0);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('EJ2-65777 Not able to insert Embed video using Keyboard Shortcut', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: true,
            shiftKey: true,
            key: 'v',
            keyCode: 86,
            which: 86,
            code: 86,
            action: 'insert-video'
        };
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video'],
                }
            });
            done();
        });

        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });

        it('Should insert Embed video in the RTE content editable div', (done: Function) => {
            (rteObj as any).videoModule.onKeyDown({ args: keyboardEventArgs });
            const inputElem: HTMLElement = document.querySelector('.e-embed-video-url');
            const embedURL: string = `<iframe width="560" height="315" src="https://www.youtube.com/embed/j898RGRw0b4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            inputElem.innerHTML = embedURL;
            const insertBtn: HTMLElement = document.querySelector('.e-insertVideo');
            insertBtn.removeAttribute('disabled');
            insertBtn.click();
            setTimeout(() => {
                expect(rteObj.rootContainer.childElementCount).toEqual(3);
                done();
            }, 1000);
        });

        it('Should insert Web video in the RTE content editable div', (done: Function) => {
            (rteObj as any).videoModule.onKeyDown({ args: keyboardEventArgs });
            document.getElementById('webURL').click()
            const inputElem: HTMLElement = document.querySelector('.e-video-url');
            const embedURL: string = `https://www.w3schools.com/tags/movie.mp4`;
            inputElem.innerHTML = embedURL;
            const insertBtn: HTMLElement = document.querySelector('.e-insertVideo');
            insertBtn.removeAttribute('disabled');
            insertBtn.click();
            setTimeout(() => {
                expect(rteObj.rootContainer.childElementCount).toEqual(4);
                done();
            }, 1000);
        });
    });
    describe('836851 - Check the video quick toolbar hide, while click the enterkey ', () => {
        let rteEle: HTMLElement;
        let editor: RichTextEditor;
        let keyBoardEvent = {
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
        let innerHTML: string = `<p>Testing<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`;
        beforeAll(() => {
            editor = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = editor.element;
        });
        afterAll(() => {
            destroy(editor);
        });

        it('Check the vedio quick toolbar hide, while click the enterkey', (done: Function) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('video');
            setSelection(target, 0, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                (<any>editor).keyDown(keyBoardEvent);
                expect(document.querySelector('.e-rte-quick-popup')).toBe(null);
                done();
            }, 100);
        });
    });
    describe('836851 - Check the video quick toolbar hide', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p>Testing<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Hide the video quick toolbar', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.resizeStart(clickEvent);
            (<any>rteObj).videoModule.onDocumentClick(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: clickEvent });
            (<any>rteObj).videoModule.hideVideoQuickToolbar()
            expect(document.querySelector('.e-rte-quick-popup')).toBe(null);
            done();
        });
    });

    describe('836851 - Change the video size using video quick toolbar dimention dialog', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p>Testing<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Change the video size using video quick toolbar dimention dialog', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.resizeStart(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: clickEvent });
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
            let videoQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            (videoQTBarEle.querySelector("[title='Dimension']") as HTMLElement).click();
            let dialogEle = <HTMLElement>document.querySelector('.e-rte-video-dialog');
            (dialogEle.querySelector('.e-vid-width') as HTMLInputElement).value = '200px';
            (dialogEle.querySelector('.e-vid-width') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-vid-height') as HTMLInputElement).value = '200px';
            (dialogEle.querySelector('.e-vid-height') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-update-size') as HTMLElement).click();
            setTimeout(() => {
                expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup'))).toBe(true);
                done();
            }, 100);
        });
    });
    describe('836851 - Check the video resize while height greater than width - resizeByPercent enabled', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        let vidResizeDiv: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert Video here',
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: true, minHeight: 80, minWidth: 80, resizeByPercent: true }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect((rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement).classList.contains('e-placeholder-enabled')).toBe(true);
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            const videoElement = document.querySelector(".e-rte-video") as HTMLElement;
            videoElement.style.width = "150px";
            videoElement.style.height = "300px";
            let placeHolder: HTMLElement = (rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement);
            expect(placeHolder.classList.contains('e-placeholder-enabled')).toBe(true);
        });
        it('resize start', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-videoboxmark').length).toBe(4);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeEnd({ target: resizeBot });
            //resize end evnet cannot remove helper element.
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect((rteObj.videoModule as any).pageX).toBe(null);
            expect(rteObj.contentModule.getDocument().body.contains(vidResizeDiv)).toBe(false);
        });
        it('resizing - mousemove - bottom right', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-video') as HTMLElement).offsetWidth;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
        });
    });
    describe('836851 - Check the video resize while height greater than width - resizeByPercent disabled', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        let vidResizeDiv: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert Video here',
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: true, minHeight: 80, minWidth: 80 }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect((rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement).classList.contains('e-placeholder-enabled')).toBe(true);
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            const videoElement = document.querySelector(".e-rte-video") as HTMLElement;
            videoElement.style.width = "150px";
            videoElement.style.height = "300px";
            let placeHolder: HTMLElement = (rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement);
            expect(placeHolder.classList.contains('e-placeholder-enabled')).toBe(true);
        });
        it('resize start', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-videoboxmark').length).toBe(4);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeEnd({ target: resizeBot });
            //resize end evnet cannot remove helper element.
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect((rteObj.videoModule as any).pageX).toBe(null);
            expect(rteObj.contentModule.getDocument().body.contains(vidResizeDiv)).toBe(false);
        });
        it('resizing - mousemove - bottom right', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-video') as HTMLElement).offsetWidth;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
        });
    });
    describe('836851 - Check the video resize while height greater than width', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        let vidResizeDiv: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert Video here',
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: true, minHeight: 80, minWidth: 80, resizeByPercent: true }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video width to be zero - resizeByPercent as ture', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect((rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement).classList.contains('e-placeholder-enabled')).toBe(true);
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            const videoElement = document.querySelector(".e-rte-video") as HTMLElement;
            videoElement.style.width = "0px";
            let placeHolder: HTMLElement = (rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement);
            expect(placeHolder.classList.contains('e-placeholder-enabled')).toBe(true);
        });
        it('resize start', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-videoboxmark').length).toBe(4);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeEnd({ target: resizeBot });
            //resize end evnet cannot remove helper element.
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect((rteObj.videoModule as any).pageX).toBe(null);
            expect(rteObj.contentModule.getDocument().body.contains(vidResizeDiv)).toBe(false);
        });
        it('resizing - mousemove - bottom right', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-video') as HTMLElement).offsetWidth;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
        });
    });
    describe('836851 - Check the video resize while height greater than width', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        let vidResizeDiv: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert Video here',
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: true, minHeight: 80, minWidth: 80, resizeByPercent: true }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video width to be zero - resizeByPercent as false', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect((rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement).classList.contains('e-placeholder-enabled')).toBe(true);
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            const videoElement = document.querySelector(".e-rte-video") as HTMLElement;
            videoElement.style.width = "0px";
            let placeHolder: HTMLElement = (rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement);
            expect(placeHolder.classList.contains('e-placeholder-enabled')).toBe(true);
        });
        it('resize start', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-videoboxmark').length).toBe(4);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeEnd({ target: resizeBot });
            //resize end evnet cannot remove helper element.
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
            expect((rteObj.videoModule as any).pageX).toBe(null);
            expect(rteObj.contentModule.getDocument().body.contains(vidResizeDiv)).toBe(false);
        });
        it('resizing - mousemove - bottom right', () => {
            let trg = (rteObj.element.querySelector('.e-rte-video') as HTMLElement);
            (rteObj.videoModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.videoModule as any).resizeStart(clickEvent);
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-video') as HTMLElement).offsetWidth;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
            (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
        });
    });
    xdescribe('836851 - Check the video gets delete press the enterkey ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent = {
            type: 'keydown',
            preventDefault: function () { },
            ctrlKey: false,
            key: 'Backspace',
            code: 'Backspace',
            stopPropagation: function () { },
            shiftKey: false,
            which: 8,
            keyCode: 8,
            action: 'Backspace'
        };
        let innerHTML: string = `<p>Testing<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: {
                    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove'
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Check the video gets delete press the enterkey', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: clickEvent });
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
            (<any>rteObj).keyDown(keyBoardEvent);
        });
    });
    describe('836851 - Remove the video using video quick toolbar ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p>Testing<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { removeUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Remove" },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Remove the video using  video quick toolbar ', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: clickEvent });
            expect(!isNullOrUndefined(document.querySelector('.e-video-wrap') as HTMLElement)).toBe(true);
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
            let videoQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            (videoQTBarEle.querySelector("[title='Remove']") as HTMLElement).click();
            expect(isNullOrUndefined(document.querySelector('.e-video-wrap') as HTMLElement)).toBe(true);
            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
            done();
        });
    });
    describe('836851 - insertVideoUrl', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        var innerHTML: string = "<p>Testing</p>";
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
            QTBarModule = getQTBarModule(rteObj);
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the insertVideoUrl', (done: Function) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            (<any>rteObj).videoModule.uploadUrl = { url: "https://www.w3schools.com/html/mov_bbb.mp4" };
            (<HTMLElement>document.querySelector('[title="Insert Video (Ctrl+Alt+V)"]') as HTMLElement).click()
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            expect(!isNullOrUndefined(document.querySelector('.e-rte-video'))).toBe(true)
            done();
        });
    });
    describe('836851 - Check the insert button - without input URL', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        var innerHTML: string = "<p>Testing</p>";
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
            QTBarModule = getQTBarModule(rteObj);
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the insert button - without input URL', (done: Function) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            (<HTMLElement>document.querySelector('[title="Insert Video (Ctrl+Alt+V)"]') as HTMLElement).click()
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url-wrap input#embedURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = '';
            (dialogEle.querySelector('.e-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-video-url-wrap input#embedURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '<iframe width="560" height="315" src="https://www.youtube.com/embed/4U2ZxO7b8iM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            (dialogEle.querySelector('.e-embed-video-url') as HTMLElement).dispatchEvent(new Event("keyup"));
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '';
            (dialogEle.querySelector('.e-embed-video-url') as HTMLElement).dispatchEvent(new Event("keyup"));
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '<iframe width="560" height="315" src="https://www.youtube.com/embed/4U2ZxO7b8iM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            (dialogEle.querySelector('.e-embed-video-url') as HTMLElement).dispatchEvent(new Event("keyup"));
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            expect(!isNullOrUndefined(document.querySelector('.e-video-clickelem'))).toBe(true);
            (<HTMLElement>document.querySelectorAll('.e-toolbar-item')[0] as HTMLElement).click();
            (<HTMLElement>document.querySelectorAll('.e-browsebtn')[0] as HTMLElement).click()

            done();
        });
    });
    describe('Insert video dialog testing', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the dialog close using close icon', (done) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let fileObj: File = new File(["Nice One"], "sample.mp3", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                expect((<any>rteObj).videoModule.uploadObj.fileList.length).toEqual(1);
                (document.getElementsByClassName('e-dlg-closeicon-btn')[0] as HTMLElement).click()
                done();
            }, 100);
        });
    });
    describe(' Mobile video interaction', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;
        let innerHTML: string = `<p>Testing<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`;

        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it('check the video click', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (rteObj.element.querySelector('.e-rte-video') as HTMLElement).click();
            dispatchEvent((rteObj.element.querySelector('.e-rte-video') as HTMLElement), 'mouseup');
            let eventsArgs: any = { target: (rteObj.element.querySelector('.e-rte-video') as HTMLElement), preventDefault: function () { } };
            (<any>rteObj).videoModule.videoClick(eventsArgs);
            expect(!isNullOrUndefined(rteObj.contentModule.getEditPanel().querySelector('.e-rte-video'))).toBe(true)
            done();
        });
    });
    describe('836851 - Insert video', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        var innerHTML: string = "<p>Testing</p>";
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
            QTBarModule = getQTBarModule(rteObj);
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Close the dialog while video insert', (done: Function) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            (<any>rteObj).videoModule.uploadUrl = { url: "https://www.w3schools.com/html/mov_bbb.mp4" };
            (<HTMLElement>document.querySelector('[title="Insert Video (Ctrl+Alt+V)"]') as HTMLElement).click()
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            const mockEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
            (<any>rteObj).videoModule.onIframeMouseDown(mockEvent);
            (<HTMLElement>document.querySelectorAll('.e-toolbar-item')[0] as HTMLElement).click();
            expect(!isNullOrUndefined(document.querySelector('.e-rte-video-dialog'))).toBe(true)
            done();
        });
    });
    describe('Video outline style testing, while focus other content or video', () => {
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video'],
                },
                iframeSettings: {
                    enable: true
                },
                value: '<p>Sample Text</p> <p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span></p>'
            });
            QTBarModule = getQTBarModule(rteObj);
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('first video click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            dispatchEvent(rteObj.inputElement.ownerDocument.querySelectorAll('.e-content video')[0] as HTMLElement, 'mousedown');
            expect((rteObj.inputElement.ownerDocument.querySelectorAll('.e-content .e-video-wrap video')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
            done();
        });
        it('second video click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            dispatchEvent(rteObj.inputElement.ownerDocument.querySelectorAll('.e-content video')[1] as HTMLElement, 'mousedown');
            expect((rteObj.inputElement.ownerDocument.querySelectorAll('.e-content .e-video-wrap video')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
            done();
        });
        it('first video click after p click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            dispatchEvent(rteObj.inputElement.ownerDocument.querySelectorAll('.e-content video')[0] as HTMLElement, 'mousedown');
            expect((rteObj.inputElement.ownerDocument.querySelectorAll('.e-content .e-video-wrap video')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
            done();
        });
        it('second video click after p click with focus testing', (done) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.videoModule);
            dispatchEvent(rteObj.inputElement.ownerDocument.querySelectorAll('.e-content video')[1] as HTMLElement, 'mousedown');
            expect((rteObj.inputElement.ownerDocument.querySelectorAll('.e-content .e-video-wrap video')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
            done();
        });
    });
    describe('836851 - iOS device interaction', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p>Testing<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`;
        beforeAll(() => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { removeUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Remove" },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = currentBrowserUA;
            destroy(rteObj);
        });
        it('Remove the video using quick toolbar ', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: clickEvent });
            expect(!isNullOrUndefined(document.querySelector('.e-video-wrap') as HTMLElement)).toBe(true);
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
            let videoQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            (videoQTBarEle.querySelector("[title='Remove']") as HTMLElement).click();
            setTimeout(() => {
                expect(isNullOrUndefined(document.querySelector('.e-video-wrap') as HTMLElement)).toBe(true);
                expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                done();
            }, 100);
        });
    });
    xdescribe('836851 - Video deleting when press backspace button - without wrapper element', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML1: string = `testing
        <video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Delete video action checking using backspace key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].lastChild;
            setCursorPoint(node, 0);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect((<any>rteObj).inputElement.querySelector('.e-video-wrap')).toBe(null);
                done();
            }, 100);
        });
    });
    describe('836851 - Iframe video delete ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: {
                    layoutOption: 'Inline',
                    width: '200px',
                    height: '200px',
                    resize: false,
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox'
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Delete video using quick toolbar', (done: Function) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
                (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = `<iframe width="560" height="315" src="https://www.youtube.com/embed/4U2ZxO7b8iM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
                setTimeout(() => {
                    expect((<any>rteObj).element.querySelector('iframe')).not.toBe(null);
                    setTimeout(() => {
                        expect(!isNullOrUndefined(document.querySelector('.e-embed-video-wrap') as HTMLElement)).toBe(true);
                        expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                        let videoQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
                        (videoQTBarEle.querySelector("[title='Remove']") as HTMLElement).click();
                        setTimeout(() => {
                            expect(isNullOrUndefined(document.querySelector('.e-embed-video-wrap') as HTMLElement)).toBe(true);
                            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                            done();
                        }, 100);
                    }, 3000); // Timeout since an embed vidoe would take time to load and then a quick toolbar will be opened.
                }, 100);
            }, 100);
        });
    });

    describe('836851 - Video quick toolbar hide', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p>Testing<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Quick toolbar hide while resize', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.resizeStart(clickEvent);
            (<any>rteObj).videoModule.onDocumentClick(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: clickEvent });
            target = <HTMLElement>document.querySelector('.e-rte-botRight') as HTMLElement;
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.resizeStart(clickEvent);
            setTimeout(() => {
                expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup'))).toBe(true);
                done();
            }, 100);
        });
    });
    describe('836851 - Video resize element hide', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<p>Testing<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Check resize element hide on document click', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.resizeStart(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: clickEvent });
            target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.onDocumentClick(clickEvent);
            expect(isNullOrUndefined(document.querySelector('.e-vid-resize'))).toBe(true);
            done();
        });
    });
    describe(' Mobile video resize', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;
        let innerHTML: string = `<p>Testing<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`;

        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it('check the video resize', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.resizeStart(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: clickEvent });
            target = <HTMLElement>document.querySelector('.e-rte-botRight') as HTMLElement;
            const touch = new Touch({ identifier: 1, target: target });
            const touchEvent = new TouchEvent('touchstart', {
                touches: [touch],
                bubbles: true,
                cancelable: true
            });
            target.dispatchEvent(touchEvent);
            (<any>rteObj).videoModule.resizeStart(touchEvent);
            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup'))).toBe(true);
            done();
        });
    });
    describe('836851 - Video keyup', function () {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML: string = `<p>Testing<span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check the video keyup - backspace', function (done) {
            let startContainer = rteObj.contentModule.getEditPanel().querySelector('p').childNodes[0];
            let endContainer = rteObj.contentModule.getEditPanel().querySelector('p')
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startContainer, endContainer, 7, 2)
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (<any>rteObj).keyDown(keyBoardEvent);
            (<any>rteObj).videoModule.onKeyUp();
            expect(!isNullOrUndefined(rteObj.element.querySelector('.e-video-wrap'))).toBe(true);
            done();
        });
    });
    describe('836851 - Video keyup in iframe', function () {
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML: string = `<p>Testing<span class="e-embed-video-wrap" contenteditable="false"><span class="e-video-clickelem"><iframe width="auto" height="auto" src="https://www.youtube.com/embed/hveapZxnOFY?si=zU9QX1Vww3ZIowHA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" style="min-width: 0px; max-width: 991px; min-height: 0px;" class="e-rte-embed-url e-resize">&ZeroWidthSpace;</iframe></span></span><br></p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check the video keyup - backspace in iframe', function (done) {
            let startContainer = rteObj.contentModule.getEditPanel().querySelector('p').childNodes[0];
            let endContainer = rteObj.contentModule.getEditPanel().querySelector('p')
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, startContainer, endContainer, 7, 2)
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (<any>rteObj).keyDown(keyBoardEvent);
            (<any>rteObj).videoModule.onKeyUp();
            expect(!isNullOrUndefined(rteObj.element.querySelector('.e-embed-video-wrap'))).toBe(true);
            done();
        });
    });
    describe('850567 - Browser shortcut CTRL + SHIFT + V does not work when Video module is injected', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video']
                },
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check the browser shortcut should not open the insert dialog', () => {
            // tslint:disable-next-line
            const keyEvent = new KeyboardEvent("keydown", {
                key: "V",
                ctrlKey: true,
                shiftKey: true,
                bubbles: true,
                cancelable: true,
                code: "KeyV",
                charCode: 86,
                keyCode: 86,
                which: 86
            } as EventInit);
            rteObj.focusIn();
            rteObj.contentModule.getEditPanel().dispatchEvent(keyEvent);
            expect(rteObj.element.querySelector('.e-rte-video-dialog')).toBe(null);
        });
    });

    describe('837380: The web url is empty when trying to edit after being inserted into the Rich Text Editor', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach(function (done) {
            rteObj = renderRTE({
                value: "<p>Testing<span class=\"e-video-wrap\" contenteditable=\"false\" title=\"movie.mp4\"><video class=\"e-rte-video e-video-inline\" controls=\"\"><source src=\"https://www.w3schools.com/html/mov_bbb.mp4\" type=\"video/mp4\"></video></span><br></p>"
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach(function (done) {
            destroy(rteObj);
            done();
        });
        it('validating whether or not the video web url is present', function (done) {
            let video: HTMLElement = rteObj.element.querySelector(".e-video-wrap video");
            setCursorPoint(video, 0);
            dispatchEvent(video, 'mousedown');
            video.click();
            dispatchEvent(video, 'mouseup');
            setTimeout(function () {
                let videoBtn: HTMLElement = document.getElementById(controlId + "_quick_VideoReplace");
                videoBtn.parentElement.click();
                let dialog: HTMLElement = document.getElementById(controlId + "_video");
                (dialog.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
                let urlInput: HTMLInputElement = dialog.querySelector('.e-video-url');
                expect(urlInput.value !== null && urlInput.value !== undefined && urlInput.value !== '').toBe(true);
                done();
            }, 100);
        });
    });

    describe('876592: Video not replaced ', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach(function (done) {
            rteObj = renderRTE({
                value: "<p>Testing<span class=\"e-video-wrap\" contenteditable=\"false\" title=\"movie.mp4\"><video class=\"e-rte-video e-video-inline\" controls=\"\"><source src=\"https://www.w3schools.com/html/mov_bbb.mp4\" type=\"video/mp4\"></video></span><br></p>"
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach(function (done) {
            destroy(rteObj);
            done();
        });
        it('Replace the embeded video to web url', function (done) {
            rteObj.value = `<p><span class="e-embed-video-wrap" contenteditable="false"><span class="e-video-clickelem"><iframe width="auto" height="auto" src="https://www.youtube.com/embed/4U2ZxO7b8iM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" style="min-width: 0px; max-width: 1225px; min-height: 0px;" class="e-rte-embed-url e-video-focus">&ZeroWidthSpace;</iframe></span></span><br></p>`;
            rteObj.dataBind();
            let video: HTMLElement = rteObj.element.querySelector(".e-video-clickelem");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, video, video, 0, 1);
            dispatchEvent(video, 'mousedown');
            video.click();
            dispatchEvent(video, 'mouseup');
            setTimeout(function () {
                let videoBtn: HTMLElement = document.getElementById(controlId + "_quick_VideoReplace");
                videoBtn.click();
                let dialog: HTMLElement = document.getElementById(controlId + "_video");
                (dialog.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
                let urlInput: HTMLInputElement = dialog.querySelector('.e-video-url');
                urlInput.value = (`https://www.w3schools.com/html/mov_bbb.mp4`) as string;
                (dialog.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                (dialog.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
                setTimeout(function () {
                    let result = rteObj.inputElement.querySelector('video');
                    expect(result.querySelector('source').src === 'https://www.w3schools.com/html/mov_bbb.mp4').toBe(true);
                    done();
                }, 200);
            }, 100);
        });
        it('Replace the web url to embeded video', function (done) {

            let video: HTMLElement = rteObj.element.querySelector(".e-video-wrap video");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, video, video, 0, 1);
            dispatchEvent(video, 'mousedown');
            video.click();
            dispatchEvent(video, 'mouseup');
            setTimeout(function () {
                let videoBtn: HTMLElement = document.getElementById(controlId + "_quick_VideoReplace");
                videoBtn.click();
                let dialog: HTMLElement = document.getElementById(controlId + "_video");
                (dialog.querySelector('.e-video-url-wrap input#embedURL') as HTMLElement).click();
                let urlInput: HTMLTextAreaElement = dialog.querySelector('.e-embed-video-url');
                urlInput.value = (`<iframe width="560" height="315" src="https://www.youtube.com/embed/4U2ZxO7b8iM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`) as string
                (dialog.querySelector('.e-embed-video-url') as HTMLTextAreaElement).dispatchEvent(new Event("input"));
                (dialog.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
                setTimeout(function () {
                    let result = rteObj.inputElement.querySelector('iframe');
                    expect(!isNullOrUndefined(result)).toBe(true);
                    done();
                }, 200);
            }, 100);
        });
    });

    describe('907730: After media delete not triggered after backspace and delete action of video', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let afterMediaDeleteTiggered: boolean = false;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML1: string = `testing
        <span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1,
                afterMediaDelete: afterMediaDeletefun
            });
            function afterMediaDeletefun(args: any): void {
                afterMediaDeleteTiggered = true;
            }
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('After media delete action checking using backspace key', (done: Function) => {
            afterMediaDeleteTiggered = false;
            let node: any = (rteObj as any).inputElement.childNodes[0].lastChild;
            setCursorPoint(node, 0);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            keyBoardEvent.type = 'keydown';
            (rteObj as any).keyDown(keyBoardEvent);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            setTimeout(() => {
                expect(afterMediaDeleteTiggered).toBe(true);
                done();
            }, 100);
        });
    });

    describe('907730: After media delete not triggered after backspace and delete action of video', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let afterMediaDeleteTiggered: boolean = false;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
        let innerHTML1: string = `testing<span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1,
                afterMediaDelete: afterMediaDeletefun
            });
            function afterMediaDeletefun(args: any): void {
                afterMediaDeleteTiggered = true;
            }
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('After media delete action checking using delete key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].firstChild;
            setCursorPoint(node, 7);
            keyBoardEvent.keyCode = 46;
            keyBoardEvent.code = 'Delete';
            keyBoardEvent.action = 'delete';
            keyBoardEvent.type = 'keydown';
            (rteObj as any).keyDown(keyBoardEvent);
            keyBoardEvent.type = 'keyup';
            (rteObj as any).keyUp(keyBoardEvent);
            setTimeout(() => {
                expect(afterMediaDeleteTiggered).toBe(true);
                done();
            }, 100);
        });
    });

    
describe('962339: Script error and improper video selection removal after alignment and resizing using Video Quick Toolbar', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
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
        let innerHTML1: string = `
            <p>testing&nbsp;<span class="e-video-wrap" contenteditable="false" title="mov_bob.mp4"><span class="e-clickElem"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp3"></video></span></span><br></p>
            `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('center applied', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-video-wrap video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            eventsArg = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });
            (<any>rteObj).videoModule.videoEle = rteObj.contentModule.getEditPanel().querySelector('.e-video-wrap video');
            setTimeout(function () {
                let mouseEventArgs = {
                    item: { command: 'Videos', subCommand: 'JustifyCenter' }
                };
                let video: HTMLElement = rteObj.element.querySelector('.e-rte-video') as HTMLElement;
                (<any>rteObj).videoModule.alignmentSelect(mouseEventArgs);
                (rteObj.videoModule as any).resizeStart({ target: video, pageX: 0 });
                let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("mousedown", false, true);
                resizeBot.dispatchEvent(clickEvent);
                (rteObj.videoModule as any).resizeStart(clickEvent);
                (<any>rteObj.videoModule).resizeBtnStat.botRight = true;
                (rteObj.videoModule as any).resizing({ target: resizeBot, pageX: 200 });
                eventsArg = { pageX: 50, pageY: 300, target: rteObj.contentModule.getEditPanel().querySelector('.e-video-wrap') };
                (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });
                expect(rteObj.contentModule.getEditPanel().querySelector('.e-vid-resize')).not.toBe(null);
                done();
            }, 200);
        });
    });


    describe('Inserting Video as Embed code through pasting using the context menu', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: {
                    layoutOption: 'Inline',
                    width: '200px',
                    height: '200px',
                    resize: false,
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox'
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Inserting embed code as video', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = `<iframe width="560" height="315" src="https://www.youtube.com/embed/4U2ZxO7b8iM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            setTimeout(() => {
                expect((dialogEle.querySelector('.e-insertVideo.e-primary') as HTMLButtonElement).hasAttribute('disabled')).toBe(false);
                done();
            }, 100);
        });
    });

    describe('923371: Size Settings of First Video Apply to Second Video After Insertion and Deletion', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: {
                    layoutOption: 'Inline',
                    width: '200px',
                    height: '200px',
                    resize: false,
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    path: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox'
                }
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Delete the first video and check the size of second video', (done: Function) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let video: HTMLElement = rteObj.element.querySelector(".e-video-wrap video");
            setCursorPoint(video, 0);
            video.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let quickToolbarItem: HTMLElement = document.querySelector("#" + controlId + "_quick_VideoDimension");
                quickToolbarItem.click();
                let widthinput = document.querySelector('.e-vid-width.e-control.e-textbox.e-lib.e-input') as HTMLInputElement;
                let heightinput = document.querySelector('.e-vid-height.e-control.e-textbox.e-lib.e-input') as HTMLInputElement;
                expect(widthinput.value === "auto" && heightinput.value === "auto").toBe(true);
                done();
            }, 100);
        });
    });

    describe('Test Align center button in the video quick toolbar', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<video controls style="width: 300px; height: 200px;"><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Click on Align center button in the video quick toolbar and check its behavior', (done: Function) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                // Verify that the quick toolbar is visible
                expect(!isNullOrUndefined(document.querySelector('video') as HTMLElement)).toBe(true);
                expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                // Click on the Align button in the quick toolbar
                let videoQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
                (videoQTBarEle.querySelector("[title='Align']") as HTMLElement).click();
                // Verify the Align dropdown opens
                const alignDropdown = document.querySelectorAll('.e-quick-dropdown')[1] as HTMLElement;
                expect(!isNullOrUndefined(alignDropdown)).toBe(true);
                alignDropdown.click();
                const alignDropdownOpen = document.querySelector('.e-dropdown-popup.e-popup-open') as HTMLElement;
                // Click the second option in the Align dropdown
                const alignOptions = alignDropdownOpen.querySelectorAll('li');
                alignOptions[1].click();
                // Verify the second option has the 'e-active' class
                expect(alignOptions[0].classList.contains('e-active')).toBe(true);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                    videoQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
                    (videoQTBarEle.querySelector("[title='Align']") as HTMLElement).click();
                    setTimeout(() => {
                        // Verify the Align dropdown opens again
                        const alignDropdownAgain = document.querySelectorAll('.e-quick-dropdown')[1] as HTMLElement;
                        expect(!isNullOrUndefined(alignDropdownAgain)).toBe(true);
                        alignDropdownAgain.click();
                        const alignDropdownOpenAgain = document.querySelector('.e-dropdown-popup.e-popup-open') as HTMLElement;
                        expect(!isNullOrUndefined(alignDropdownOpenAgain)).toBe(true);
                        // Click the second option in the Align dropdown again
                        const alignOptionsAgain = alignDropdownOpenAgain.querySelectorAll('li');
                        expect(alignOptionsAgain[1].classList.contains('e-active')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });
    xdescribe('Test Align right button in the video quick toolbar', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<video controls style="width: 300px; height: 200px;"><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Click on Align right button in the video quick toolbar and check its behavior', (done: Function) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('video');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(!isNullOrUndefined(document.querySelector('video') as HTMLElement)).toBe(true);
                expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                let videoQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
                (videoQTBarEle.querySelector("[title='Align']") as HTMLElement).click();
                const alignDropdown = document.querySelectorAll('.e-quick-dropdown')[1] as HTMLElement;
                expect(!isNullOrUndefined(alignDropdown)).toBe(true);
                alignDropdown.click();
                const alignDropdownOpen = document.querySelector('.e-dropdown-popup.e-popup-open') as HTMLElement;
                const alignOptions = alignDropdownOpen.querySelectorAll('li');
                alignOptions[2].click();
                expect(alignOptions[0].classList.contains('e-active')).toBe(true);
                target.dispatchEvent(MOUSEUP_EVENT)
                setTimeout(() => {
                    expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                    videoQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
                    (videoQTBarEle.querySelector("[title='Align']") as HTMLElement).click();
                    const alignDropdownAgain = document.querySelectorAll('.e-quick-dropdown')[1] as HTMLElement;
                    expect(!isNullOrUndefined(alignDropdownAgain)).toBe(true);
                    alignDropdownAgain.click();
                    setTimeout(() => {
                        const alignDropdownOpenAgain = document.querySelector('.e-dropdown-popup.e-popup-open') as HTMLElement;
                        expect(!isNullOrUndefined(alignDropdownOpenAgain)).toBe(true);
                        const alignOptionsAgain = alignDropdownOpenAgain.querySelectorAll('li');
                        expect(alignOptionsAgain[2].classList.contains('e-active')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });


    describe('926553 - Image/video Overlaps the List After Changing Alignment to Left', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML1: string = `<p>Rich Text Editor allows inserting images from online sources as well as the local computers where you want to insert the image in your content.</p>
                        <li><span class="e-video-wrap" contenteditable="false" title="Screen Recording 2025-01-07 175543.mp4"><video controls="" width="auto" height="auto" style="min-width: 0px; max-width: 1434px; min-height: 0px; width: 200px;" class="e-rte-video e-resize"><source src="blob:http://127.0.0.1:5501/7fe46da2-7e9b-44ad-95ac-ff95e90e8c78" type="video/mp4"></video></span><br></li><li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li>`;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('926553 - Video Overlaps the List After Changing Alignment to Left', (done: Function) => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            let target: HTMLElement = rteObj.element.querySelector('.e-rte-video');
            dispatchEvent(target, 'mousedown');
            target.click();
            dispatchEvent(target, 'mouseup');
            var eventArgs = { pageX: 50, pageY: 300, target: target };
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventArgs });
            (<any>rteObj).imageModule.imgEle = rteObj.contentModule.getEditPanel().querySelector('.e-rte-video');
            setTimeout(() => {
                let mouseEventArgs = {
                    item: { command: 'Videos', subCommand: 'JustifyLeft' }
                };
                (<any>rteObj).videoModule.alignmentSelect(mouseEventArgs);
                let video: HTMLElement = rteObj.element.querySelector('.e-rte-video') as HTMLElement;
                expect(video.classList.contains('e-video-left')).toBe(true);
                expect((video.parentElement.nextElementSibling as HTMLElement).style.clear == 'left').toBe(true);
                done();
            }, 200);
        });
        it('926553 - Video Overlaps the List After Changing Alignment to Right', (done: Function) => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            let target: HTMLElement = rteObj.element.querySelector('.e-rte-video');
            dispatchEvent(target, 'mousedown');
            target.click();
            dispatchEvent(target, 'mouseup');
            var eventArgs = { pageX: 50, pageY: 300, target: target };
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventArgs });
            (<any>rteObj).imageModule.imgEle = rteObj.contentModule.getEditPanel().querySelector('.e-rte-video');
            setTimeout(() => {
                let mouseEventArgs = {
                    item: { command: 'Videos', subCommand: 'JustifyRight' }
                };
                (<any>rteObj).videoModule.alignmentSelect(mouseEventArgs);
                let video: HTMLElement = rteObj.element.querySelector('.e-rte-video') as HTMLElement;
                expect(video.classList.contains('e-video-right')).toBe(true);
                expect((video.parentElement.nextElementSibling as HTMLElement).style.clear == 'right').toBe(true);
                done();
            }, 200);
        });
    });


    describe('Bug-934076- Video is not deleted when press delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML1: string = '<ul><li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert im<span class=\"e-video-wrap\" contenteditable=\"false\" title=\"mov_bbb.mp4\"><video class=\"e-rte-video e-videoinline\" controls=\"\"><source src=\"https://www.w3schools.com/html/mov_bbb.mp4\" type=\"video/mp4\"></video></span>ages, tables, audio, and video.</li><li>Inline styles include bold, italic, underline, strikethrough, hyperlinks, and more.</li></ul>';
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Video delete action checking using delete key inside list', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].childNodes[0].childNodes[0];
            setCursorPoint(node, 101);
            const deleteKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', DELETE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(deleteKeyDownEvent);
            setTimeout(function () {
                expect((<any>rteObj).inputElement.querySelector('.e-video-wrap')).toBe(null);
                expect((<any>rteObj).inputElement.childNodes[0].childNodes[0].childElementCount === 0).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Bug-934076- Video is not deleted when press delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML1: string = `<h1><span class="e-video-wrap" contenteditable="false" title="Cursor_Error.mp4" style="cursor: auto;"><video class="e-rte-video e-video-inline" controls="" width="auto" height="auto" style="min-width: 200px; max-width: 1449px; min-height: 90px; width: 115.556px; height: 52px;"><source src="blob:null/1a2556b9-b597-4805-9b92-6e391eee4b76" type="video/mp4"></video></span> Welcome to the Syncfusion Rich Text Editor</h1>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                value: innerHTML1
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Video delete action checking using delete key in starting of H1 tag', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].childNodes[0].childNodes[0];
            setCursorPoint(node, 1);
            const deleteKeyDownEvent: KeyboardEvent = new KeyboardEvent('keydown', DELETE_EVENT_INIT);
            rteObj.inputElement.dispatchEvent(deleteKeyDownEvent);
            setTimeout(function () {
                expect((<any>rteObj).inputElement.querySelector('.e-video-wrap')).toBe(null);
                expect((<any>rteObj).inputElement.childNodes[0].childElementCount === 0).toBe(true);
                done();
            }, 100);
        });
    });

    describe('942817: IFrame - Script Error Occurs After Replacing Embedded Code with a Web URL ', function () {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(function () {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                value: "<p>Testing<span class=\"e-video-wrap\" contenteditable=\"false\" title=\"movie.mp4\"><video class=\"e-rte-video e-video-inline\" controls=\"\"><source src=\"https://www.w3schools.com/html/mov_bbb.mp4\" type=\"video/mp4\"></video></span><br></p>"
            });
            controlId = rteObj.element.id;
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('Replace the embeded video to web url inside list', function (done) {
            rteObj.value = `<p><ul><li style="margin-bottom: 10px;">Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.<p><span class="e-embed-video-wrap" style="display: inline-block;"><span class="e-video-clickelem"><iframe width="auto" height="auto" src="https://www.youtube.com/embed/IB2P1FBXjcQ?si=6ReBEsgCNdSMlQAV" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" class="e-video-inline e-rte-embed-url e-resize" style="min-width: 0px; max-width: 1108px; min-height: 0px;" data-gtm-yt-inspected-158="true">&ZeroWidthSpace;</iframe></span></span><br/></p></li><li style="margin-bottom: 10px;">The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li></ul></p>`;
            rteObj.dataBind();
            let video: HTMLElement = rteObj.contentModule.getEditPanel().querySelector(".e-video-clickelem");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, video, video, 0, 1);
            dispatchEvent(video, 'mousedown');
            video.click();
            dispatchEvent(video, 'mouseup');
            setTimeout(function () {
                let videoBtn: HTMLElement = document.querySelector('#' + controlId + "_quick_VideoReplace");
                videoBtn.click();
                let dialog: HTMLElement = document.querySelector('#' + controlId + "_video");
                (dialog.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
                let urlInput: HTMLInputElement = dialog.querySelector('.e-video-url');
                urlInput.value = (`https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4`) as string;
                (dialog.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                (dialog.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
                setTimeout(function () {
                    let result = rteObj.inputElement.querySelector('video');
                    expect(result.querySelector('source').src === 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4').toBe(true);
                    done();
                }, 200);
            }, 100);
        });
    });

    describe('917961: Users cannott interact with other elements after skipping a video as focus stays on the video player.', () => {
        let editor: RichTextEditor;
        const defaultUA: string = navigator.userAgent;
        const safari: string = MACOS_USER_AGENT.SAFARI;
        beforeAll(() => {
            Browser.userAgent = safari;
            editor = renderRTE({
                value: `<p><video controls style="width: 30%;"><source 
                    src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Ocean-Waves.mp4" type="video/mp4" /></video></p>`
            });
        });
        afterAll(() => {
            destroy(editor);
            Browser.userAgent = defaultUA;
        });

        it('Should not call the prevent default for the click of the Video SAFARI.', (done: Function) => {
            editor.focusIn();
            const videoElem: HTMLVideoElement = editor.inputElement.querySelector('video');
            const clickEvent: MouseEvent = new MouseEvent('click', BASIC_MOUSE_EVENT_INIT);
            spyOn(clickEvent, 'preventDefault');
            videoElem.dispatchEvent(clickEvent);
            setTimeout(() => {
                expect(clickEvent.preventDefault).not.toHaveBeenCalled();
                done();
            }, 100);
        });
    });

    describe('Ensure video element has specified width and height attributes', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: {
                    layoutOption: 'Inline',
                    width: '300',
                    height: '200',
                    resize: true
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Check video element width and height attributes', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));

            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();

            setTimeout(() => {
                const videoElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-video') as HTMLElement;
                expect(videoElement).not.toBeNull();
                expect(videoElement.getAttribute('width')).toBe('300px');
                expect(videoElement.getAttribute('height')).toBe('200px');
                done();
            }, 100);
        });
    });

    xdescribe('Video quick toolbar - ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`,
                inlineMode: {
                    enable: true
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' Dimension dialog rendering and testing ', (done: Function) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('video');
            setSelection(target, 0, 1);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickToolbar: HTMLElement = document.body.querySelector('.e-video-quicktoolbar');
                let videoBtn: HTMLElement = quickToolbar.querySelector('.e-video-dimension');
                videoBtn.parentElement.parentElement.click();
                setTimeout(()=> {
                    let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
                    console.log(dialogEle);
                    expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Video Size').toBe(true);
                    expect(dialogEle.querySelector('.e-dlg-content').firstElementChild.classList.contains('e-video-sizewrap')).toBe(true);
                    let range: any = new NodeSelection().getRange(document);
                    let save: any = new NodeSelection().save(range, document);
                    let args: any = {
                        item: { url: window.origin + '/base/spec/content/video/RTE-Ocean-Waves.mp4', selection: save },
                        preventDefault: function () { }
                    };
                    args.item = { width: 200, height: 200, selectNode: [(rteObj.element.querySelector('.e-rte-video') as HTMLElement)] };
                    (<any>rteObj).formatter.editorManager.videoObj.videoDimension(args);
                    (dialogEle.querySelector('.e-vid-width') as HTMLInputElement).value = "200";
                    (dialogEle.querySelector('.e-vid-height') as HTMLInputElement).value = "200";
                    (rteObj.element.querySelector('.e-rte-video-dialog .e-footer-content button') as HTMLButtonElement).click();
                    expect((<any>rteObj).element.querySelector('video').style.width).toBe("200px");
                    expect((<any>rteObj).element.querySelector('video').style.height).toBe("200px");
                    done();
                }, 300);
            }, 100);
        });
    });
});
