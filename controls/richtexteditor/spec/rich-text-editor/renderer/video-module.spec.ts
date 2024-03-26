/**
 * Video module spec
 */
import { Browser, isNullOrUndefined, closest, detach, createElement } from '@syncfusion/ej2-base';
import { RichTextEditor, QuickToolbar, IRenderer, DialogType } from './../../../src/index';
import { NodeSelection } from './../../../src/selection/index';
import { renderRTE, destroy, setCursorPoint, dispatchEvent, androidUA, iPhoneUA, currentBrowserUA } from "./../render.spec";
import { SelectEventArgs } from '@syncfusion/ej2-navigations';

function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}

describe('Video Module ', () => {

    describe('video resize', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
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
                    if (e.item.subCommand === 'Video'){
                    expect(!isNullOrUndefined(e.itemCollection)).toBe(true);
                    expect(!isNullOrUndefined(e.itemCollection.url)).toBe(true);
                    }
                if(e.item.subCommand === 'JustifyLeft') { expect(e.item.subCommand === 'JustifyLeft').toBe(true); }
                if(e.item.subCommand === 'JustifyRight') { expect(e.item.subCommand === 'JustifyRight').toBe(true); }
                if(e.item.subCommand === 'JustifyCenter') { expect(e.item.subCommand === 'JustifyCenter').toBe(true); }
                if(e.item.subCommand === 'Inline') { expect(e.item.subCommand === 'Inline').toBe(true); }
                if(e.item.subCommand === 'Break') { expect(e.item.subCommand === 'Break').toBe(true); }
                },
                actionComplete: function (e: any) {
                    if(e.requestType === 'Video') { expect(e.requestType === 'Video').toBe(true);}
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect((rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement).style.display).toBe('block');
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
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            let placeHolder: HTMLElement = (rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement);
            expect(placeHolder.style.display).toBe('block');
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
            expect(rteObj.contentModule.getDocument().body.contains(this.vidResizeDiv)).toBe(false);
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
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
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
            expect(rteObj.contentModule.getDocument().body.contains(this.vidResizeDiv)).toBe(false);
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
            expect(rteObj.contentModule.getDocument().body.contains(this.vidResizeDiv)).toBe(false);
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
                iframeSettings: {enable: true}
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
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
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
            expect(rteObj.contentModule.getDocument().body.contains(this.vidResizeDiv)).toBe(false);
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
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
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
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
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
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: '<p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span></p>'
            });
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
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
            expect(vidHeight <= document.querySelector('video').offsetHeight).toBe(true);
            done();
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
                },
                insertVideoSettings: { resize: false },
                actionBegin: function (e: any) {
                    if(e.item.subCommand === 'Video'){
                    expect(!isNullOrUndefined(e.itemCollection)).toBe(true);
                    expect(!isNullOrUndefined(e.itemCollection.url)).toBe(true);
                    }
                },
                actionComplete: function (e: any) {
                    if(e.requestType === 'Video'){ expect(e.requestType === 'Video').toBe(true);}
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
            detach(document.querySelector('.e-video-inline'));
        });
        it('video dialog', (done: Function) => {
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
                item: { url: 'https://www.w3schools.com/html/mov_bbb.mp4', selection: save },
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
            setTimeout(() => {
                let linkPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let linkTBItems: any = linkPop.querySelectorAll('.e-toolbar-item');
                expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                (<HTMLElement>linkTBItems.item(0)).click();
                let eventArgs: any = { target: document, preventDefault: function () { } };
                (<any>rteObj).videoModule.onDocumentClick(eventArgs);
                done();
            }, 400);
        });
        it('insert video url', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') },
                item: {},
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).videoModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-video') as HTMLElement).click();
            evnArg.args = { preventDefault: function () { }, originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }, item: {} };
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-video') as HTMLElement)];
            let trget: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: evnArg.selectNode[0], preventDefault: function () { } };
            clickEvent.initEvent("mousedown", false, true);
            trget.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });
            let videoPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            videoPop.style.display = 'block';
            expect(videoPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            expect(videoPop.offsetLeft >= rteEle.offsetLeft).toBe(true);
            expect(videoPop.offsetTop > rteEle.offsetTop).toBe(true);
            (rteObj.element.querySelector('.e-rte-video') as HTMLElement).focus();
            evnArg.item = { command: 'Videos', subCommand: 'JustifyLeft' };
            evnArg.e = args;
            (<any>rteObj).videoModule.alignmentSelect(evnArg);
            evnArg.args.item = { command: 'Videos', subCommand: 'JustifyLeft' };
            (<any>rteObj).videoModule.alignVideo(evnArg, 'JustifyLeft');
            expect((<any>rteObj).element.querySelector('.e-rte-video').classList.contains('e-video-left')).toBe(true);
            evnArg.item = { command: 'Videos', subCommand: 'JustifyRight' };
            evnArg.e = args;
            (<any>rteObj).videoModule.alignmentSelect(evnArg);
            evnArg.args.item = { command: 'Videos', subCommand: 'JustifyRight' };
            (<any>rteObj).videoModule.alignVideo(evnArg, 'JustifyRight');
            expect((<any>rteObj).element.querySelector('.e-rte-video').classList.contains('e-video-right')).toBe(true);
            evnArg.item = { command: 'Videos', subCommand: 'JustifyCenter' };
            evnArg.e = args;
            (<any>rteObj).videoModule.alignmentSelect(evnArg);
            evnArg.args.item = { command: 'Videos', subCommand: 'JustifyCenter' };
            (<any>rteObj).videoModule.alignVideo(evnArg, 'JustifyCenter');
            expect((<any>rteObj).element.querySelector('.e-rte-video').classList.contains('e-video-right')).not.toBe(true);
            expect((<any>rteObj).element.querySelector('.e-rte-video').classList.contains('e-video-left')).not.toBe(true);
            evnArg.selectNode = [rteObj.element];
            (<any>rteObj).videoModule.break(evnArg);
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-video') as HTMLElement)];
            evnArg.item = { command: 'Videos', subCommand: 'Break' };
            evnArg.e = args;
            (<any>rteObj).videoModule.alignmentSelect(evnArg);
            evnArg.args.item = { command: 'Videos', subCommand: 'Break' };
            evnArg.selectNode = [rteObj.element];
            (<any>rteObj).videoModule.inline(evnArg);
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-video') as HTMLElement)];
            evnArg.item = { command: 'Videos', subCommand: 'Inline' };
            evnArg.e = args;
            (<any>rteObj).videoModule.alignmentSelect(evnArg);
            evnArg.args.item = { command: 'Videos', subCommand: 'Inline' };
            (rteObj.element.querySelector('.e-rte-video') as HTMLElement).click();
            evnArg.selectNode = [(<any>rteObj).element.querySelector('.e-rte-video')];
            let trg: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            clickEvent = document.createEvent("MouseEvents");
            eventsArg = { pageX: 50, pageY: 300, target: evnArg.selectNode[0], preventDefault: function () { } };
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('.e-rte-video'));
            (<any>rteObj).videoModule.editAreaClickHandler({ args: eventsArg });
        });
    });

    describe(' Quick Toolbar open testing after selecting some text', () => {
        let rteObj: any;
        let ele: HTMLElement;
        it(" selecting some text and then clicking on video test ", () => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<div id='rte'><p><b>Syncfusion</b> Software</p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video id='vidTag' class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>`
            });
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
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
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
            expect(rteObj.element.lastElementChild.classList.contains('.e-dialog')).not.toBe(true);
            done();
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
                item: { url: 'https://www.w3schools.com/html/mov_bbb.mp4', selection: save },
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
         beforeAll((done: Function) => {
             Browser.userAgent = mobileUA;
             rteObj = renderRTE({
                 toolbarSettings: {
                     items: ['Video', 'Bold']
                 }
             });
             rteEle = rteObj.element;
             done();
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
                 item: { url: 'https://www.w3schools.com/html/mov_bbb.mp4', selection: save },
                 preventDefault: function () { }
             };
             (<any>rteObj).formatter.editorManager.videoObj.createVideo(args);
             (rteObj.element.querySelector('.e-rte-dropdown-btn') as HTMLElement).click();
             (document.querySelector('.e-h1') as HTMLElement).click();
             expect(actionComplete).toHaveBeenCalled();
             done();
         });
     });

     describe('BLAZ-25388 - Inserting video in firefox', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let actionComplete: any;
        let defaultUserAgent= navigator.userAgent;
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
            Browser.userAgent =defaultUserAgent;
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
                item: { url: 'https://www.w3schools.com/html/mov_bbb.mp4', selection: save },
                preventDefault: function () { },
                selector: 'content',
                callBack: function () { }
            };
            (<any>rteObj).formatter.editorManager.videoObj.createVideo(args);
            (<any>rteObj).formatter.editorManager.videoObj.editAreaVideoClick({callBack: function () { }});
            expect(rteObj.inputElement.innerHTML === `<p><span class="e-video-wrap" contenteditable="false" title="undefined"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`).toBe(true);
            done();
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
                item: { url: 'https://www.w3schools.com/html/mov_bbb.mp4', selection: save },
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
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
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
            }, 4500);
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
                dialogOpen : function(e) {
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

        it('video remove with quickToolbar check', (done: Function) => {
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
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                quickTBItem.item(2).click();
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('.e-video-wrap')).toBe(null);
                done();
            }, 200);
        });
    });

    describe('Video deleting when press backspace button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
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
            expect((<any>rteObj).inputElement.querySelector('.e-video-wrap')).toBe(null);
            done();
        });
    });

    describe('Video deleting when press backspace button nodeType as 1', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
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
            expect((<any>rteObj).inputElement.querySelector('.e-video-wrap')).toBe(null);
            done();
        });
    });
 
     describe('Video deleting when press delete button', () => {
         let rteEle: HTMLElement;
         let rteObj: RichTextEditor;
         let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46};
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
             expect((<any>rteObj).inputElement.querySelector('.e-video-wrap')).toBe(null);
             done();
         });
     });
 
     describe('Video deleting when press delete button as nodeType 1', () => {
         let rteEle: HTMLElement;
         let rteObj: RichTextEditor;
         let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46};
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
             expect((<any>rteObj).inputElement.querySelector('.e-video-wrap')).toBe(null);
             done();
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

        it('left applied', (done: Function) => {
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
                    item: { command: 'Videos', subCommand: 'JustifyLeft' }
                };
                let video: HTMLElement = rteObj.element.querySelector('.e-rte-video') as HTMLElement;
                (<any>rteObj).videoModule.alignmentSelect(mouseEventArgs);
                expect(video.classList.contains('e-video-left')).toBe(true);
                done();
            }, 200);
        });
        it('right applied', (done: Function) => {
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
                    item: { command: 'Videos', subCommand: 'JustifyRight' }
                };
                let video: HTMLElement = rteObj.element.querySelector('.e-rte-video') as HTMLElement;
                (<any>rteObj).videoModule.alignmentSelect(mouseEventArgs);
                expect(video.classList.contains('e-video-right')).toBe(true);
                done();
            }, 200);
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
                expect(video.classList.contains('e-video-center')).toBe(true);
                done();
            }, 200);
        });
    });

    describe('Dimension testing', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: false },
                actionBegin: function (e: any) {
                    if(e.item.subCommand === 'Video'){
                    expect(!isNullOrUndefined(e.itemCollection)).toBe(true);
                    expect(!isNullOrUndefined(e.itemCollection.url)).toBe(true);
                    }
                },
                actionComplete: function (e: any) {
                    if(e.requestType === 'Video'){ expect(e.requestType === 'Video').toBe(true);}
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
            detach(document.querySelector('.e-video-inline'));
        });
        it('video dialog', (done: Function) => {
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
                item: { url: 'https://www.w3schools.com/html/mov_bbb.mp4', selection: save },
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
            setTimeout(() => {
                let linkPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let linkTBItems: any = linkPop.querySelectorAll('.e-toolbar-item');
                expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                (<HTMLElement>linkTBItems.item(4)).click();
                let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
                expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Video Size').toBe(true);
                expect(dialogEle.querySelector('.e-dlg-content').firstElementChild.classList.contains('e-video-sizewrap')).toBe(true);
                let save: any = new NodeSelection().save(range, document);
                let args: any = {
                    item: { url: 'https://www.w3schools.com/html/mov_bbb.mp4', selection: save },
                    preventDefault: function () { }
                };
                args.item = {width: 200, height: 200, selectNode : [(rteObj.element.querySelector('.e-rte-video') as HTMLElement)]};
                (<any>rteObj).formatter.editorManager.videoObj.videoDimension(args);
                (dialogEle.querySelector('.e-vid-width') as HTMLInputElement).value = "200";
                (dialogEle.querySelector('.e-vid-height') as HTMLInputElement).value = "200";
                (rteObj.element.querySelector('.e-rte-video-dialog .e-footer-content button') as HTMLButtonElement).click();
                expect((<any>rteObj).element.querySelector('video').style.width).toBe("200px");
                expect((<any>rteObj).element.querySelector('video').style.height).toBe("200px");
                done();
            }, 400);
        });
    });

    describe('Video quick toolbar - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(' Dimension dialog rendering and testing ', (done: Function) => {
            let video: HTMLElement = rteObj.element.querySelector(".e-video-wrap video");
            setCursorPoint(video, 0);
            dispatchEvent(video, 'mousedown');
            video.click();
            dispatchEvent(video, 'mouseup');
            setTimeout(() => {
                let videoBtn: HTMLElement = document.getElementById(controlId + "_quick_VideoDimension");
                videoBtn.parentElement.click();
                let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
                expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Video Size').toBe(true);
                expect(dialogEle.querySelector('.e-dlg-content').firstElementChild.classList.contains('e-video-sizewrap')).toBe(true);
                let range: any = new NodeSelection().getRange(document);
                let save: any = new NodeSelection().save(range, document);
                let args: any = {
                    item: { url: 'https://www.w3schools.com/html/mov_bbb.mp4', selection: save },
                    preventDefault: function () { }
                };
                args.item = {width: 200, height: 200, selectNode : [(rteObj.element.querySelector('.e-rte-video') as HTMLElement)]};
                (<any>rteObj).formatter.editorManager.videoObj.videoDimension(args);
                (dialogEle.querySelector('.e-vid-width') as HTMLInputElement).value = "200";
                (dialogEle.querySelector('.e-vid-height') as HTMLInputElement).value = "200";
                (rteObj.element.querySelector('.e-rte-video-dialog .e-footer-content button') as HTMLButtonElement).click();
                expect((<any>rteObj).element.querySelector('video').style.width).toBe("200px");
                expect((<any>rteObj).element.querySelector('video').style.height).toBe("200px");
                done();
            }, 100);
        });
    });

    describe('Deleting video using the - ', () => {
        let rteObj: RichTextEditor;
        let innerHTML1: string = `
        <p>testing&nbsp;<span class="e-video-wrap" contenteditable="false" title="mov_bob.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp3"></video></span><br></p>`;
        beforeEach((done: Function) => {
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
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' delete audio method', (done: Function) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = { preventDefault: function () { }, originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }, item : {command: 'Videos', subCommand: 'VideoRemove'}};
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg = { args: args, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
            evnArg.selectNode = [rteObj.element.querySelector('video')];
            (<any>rteObj).videoModule.deleteVideo(evnArg);
            expect((rteObj as any).element.querySelector('.e-video-wrap')).toBe(null);
            done();
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
            expect(isNullOrUndefined((<any>rteObj).videoModule.dialogObj)).toBe(true);
            done();
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
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).dispatchEvent(new Event("keyup"));
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            expect((<any>rteObj).element.querySelector('iframe')).not.toBe(null);
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
            // (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
            // (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            // expect((dialogEle.querySelector('.e-embed-video-url') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
            done();
        });
    });

     describe('Mouse Click for video testing when showOnRightClick enabled', () => {
         let rteObj: RichTextEditor;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 value: `<p>Hi video is<span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br>`,
                 quickToolbarSettings: {
                     enable: true,
                     showOnRightClick: true
                 }
             });
             done();
         });
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
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
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 value: `<p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`
             });
             controlId = rteObj.element.id;
             done();
         });
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
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
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 value: `<p><span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-videoinline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span><br></p>`,
                 actionComplete: actionCompleteFun
             });
             function actionCompleteFun(args: any): void {
                 actionCompleteCalled = true;
             }
             controlId = rteObj.element.id;
             done();
         });
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
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
                 }, 40);
                 done();
             }, 100);
         });
     });
 
     describe('Disable the insert Video dialog button when the video is uploading.', () => {
         let rteObj: RichTextEditor;
         let controlId: string;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 value: `<p>Testing Video Dialog</p>`,
                 toolbarSettings: {
                     items: ['Video']
                 }
             });
             controlId = rteObj.element.id;
             done();
         });
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
         });
         it(' Initial insert video button disabled', (done) => {
             let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Video');
             item.click();
             let dialog: HTMLElement = document.getElementById(controlId + "_video");
             let insertButton: HTMLElement = dialog.querySelector('.e-insertVideo.e-primary');
             expect(insertButton.hasAttribute('disabled')).toBe(true);
             done();
         });
     });
     describe('Disable the insert video dialog button when the video is uploading', () => {
         let rteObj: RichTextEditor;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 insertVideoSettings: {
                     allowedTypes: ['.mp4'],
                     saveUrl:"uploadbox/Save",
                     path: "../Videos/"
                 },
                 toolbarSettings: {
                     items: ['Video']
                 }
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
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
             }, 4000);
         });
     });
    //  describe('Disable the insert video dialog button when the video is uploading', () => {
    //      let rteObj: RichTextEditor;
    //      beforeEach((done: Function) => {
    //          rteObj = renderRTE({
    //              toolbarSettings: {
    //                  items: ['Video']
    //              },
    //              insertVideoSettings: {
    //                  saveUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Save",
    //                  path: "../Videos/"
    //              }
    //          });
    //          done();
    //      })
    //      afterEach((done: Function) => {
    //          destroy(rteObj);
    //          done();
    //      })
    //      it(' Button enabled with video upload Success', (done) => {
    //          let rteEle: HTMLElement = rteObj.element;
    //          (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
    //          let args = { preventDefault: function () { } };
    //          let range = new NodeSelection().getRange(document);
    //          let save = new NodeSelection().save(range, document);
    //          let evnArg = { args: MouseEvent, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
    //          (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
    //          let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
    //          (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
    //          (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
    //          let fileObj: File = new File(["mov_bob"], "horse.mp4", { lastModified: 0, type: "overide/mimetype" });
    //          let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
    //          (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
    //          setTimeout(() => {
    //              expect((dialogEle.querySelector('.e-insertVideo') as HTMLButtonElement).hasAttribute('disabled')).toBe(false);
    //              done();
    //          }, 4000);
    //      });
    //  });
     describe('Getting error while insert the video after applied the  lower case or  upper case commands in Html Editor  - ', () => {
         let rteObj: RichTextEditor;
         let controlId: string;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 value: `<p id='insert-video'>RichTextEditor</p>`,
                 toolbarSettings: {
                     items: [
                         'LowerCase', 'UpperCase', '|',
                         'Video']
                 },
             });
             controlId = rteObj.element.id;
             done();
         });
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
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
                 (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
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
 
    //  describe('Rename videos in success event- ', () => {
    //      let rteObj: RichTextEditor;
    //      beforeEach((done: Function) => {
    //          rteObj = renderRTE({
    //              fileUploadSuccess: function (args : any) {
    //                  args.file.name = 'rte_video';
    //                  var filename : any = document.querySelectorAll(".e-file-name")[0];
    //                  filename.innerHTML = args.file.name.replace(document.querySelectorAll(".e-file-type")[0].innerHTML, '');
    //                  filename.title = args.file.name;
    //              },
    //              insertVideoSettings: {
    //                  saveUrl:"https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
    //                  path: "../Videos/"
    //              },
    //              toolbarSettings: {
    //                  items: ['Video']
    //              },
    //          });
    //          done();
    //      })
    //      afterEach((done: Function) => {
    //          destroy(rteObj);
    //          done();
    //      })
    //      it('Check name after renamed', (done) => {
    //          let rteEle: HTMLElement = rteObj.element;
    //          (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
    //          let args = { preventDefault: function () { } };
    //          let range = new NodeSelection().getRange(document);
    //          let save = new NodeSelection().save(range, document);
    //          let evnArg = { args: MouseEvent, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
    //          (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
    //          let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
    //          (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
    //          (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
    //          (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
    //          let fileObj: File = new File(["mov_bob"], "mov_bob.mp4", { lastModified: 0, type: "overide/mimetype" });
    //          let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
    //          (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
    //          setTimeout(() => {
    //              expect(document.querySelectorAll(".e-file-name")[0].innerHTML).toBe('rte_video');
    //              done();
    //          }, 4500);
    //      });
    //  });
 
     describe('Inserting Video as Base64 - ', () => {
         let rteObj: RichTextEditor;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 insertVideoSettings: {
                     saveFormat: "Base64"
                 },
                 toolbarSettings: {
                     items: ['Video']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
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
             (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
             (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
             let fileObj: File = new File(["mov_bob"], "mov_bob.mp4", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
             (document.querySelector('.e-insertVideo') as HTMLElement).click();
             setTimeout(() => {
                 expect(rteObj.getContent().querySelector(".e-rte-video.e-video-inline source").getAttribute("src").indexOf("blob") == -1).toBe(true);
                 evnArg.selectNode = [rteObj.element];
                 (<any>rteObj).videoModule.deleteVideo(evnArg);
                 (<any>rteObj).videoModule.uploadObj.upload((<any>rteObj).videoModule.uploadObj.filesData[0]);
                 done();
             }, 4000);
         });
     });
 
     describe('Inserting Video as Blob - ', () => {
         let rteObj: RichTextEditor;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 insertVideoSettings: {
                     saveFormat: "Blob"
                 },
                 toolbarSettings: {
                     items: ['Video']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
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
             (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
             (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
             let fileObj: File = new File(["mov_bob"], "mov_bob.mp4", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
             (document.querySelector('.e-insertVideo') as HTMLElement).click();
             setTimeout(() => {
                 expect(rteObj.getContent().querySelector(".e-rte-video.e-video-inline source").getAttribute("src").indexOf("base64") == -1).toBe(true);
                 evnArg.selectNode = [rteObj.element];
                 (<any>rteObj).videoModule.deleteVideo(evnArg);
                 (<any>rteObj).videoModule.uploadObj.upload((<any>rteObj).videoModule.uploadObj.filesData[0]);
                 done();
             }, 4000);
         });
     });
     
    //  describe('Insert Video mediaSelected, mediaUploading and mediaUploadSuccess event - ', () => {
    //      let rteObj: RichTextEditor;
    //      let mediaSelectedSpy: jasmine.Spy = jasmine.createSpy('onFileSelected');
    //      let mediaUploadingSpy: jasmine.Spy = jasmine.createSpy('onFileUploading');
    //      let mediaUploadSuccessSpy: jasmine.Spy = jasmine.createSpy('onFileUploadSuccess');
    //      beforeEach((done: Function) => {
    //          rteObj = renderRTE({
    //              fileSelected: mediaSelectedSpy,
    //              fileUploading: mediaUploadingSpy,
    //              fileUploadSuccess: mediaUploadSuccessSpy,
    //              insertVideoSettings: {
    //                  saveUrl:"https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
    //                  path: "../Videos/"
    //              },
    //              toolbarSettings: {
    //                  items: ['Video']
    //              },
    //          });
    //          done();
    //      })
    //      afterEach((done: Function) => {
    //          destroy(rteObj);
    //          done();
    //      })
    //      it(' Test the component insert video events - case 1 ', (done) => {
    //          let rteEle: HTMLElement = rteObj.element;
    //          (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
    //          let args = { preventDefault: function () { } };
    //          let range = new NodeSelection().getRange(document);
    //          let save = new NodeSelection().save(range, document);
    //          let evnArg = { args: MouseEvent, self: (<any>rteObj).videoModule, selection: save, selectNode: new Array(), };
    //          (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
    //          let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
    //          (dialogEle.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
    //          (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
    //          (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
    //          let fileObj: File = new File(["mov_bob"], "mov_bob.mp4", { lastModified: 0, type: "overide/mimetype" });
    //          let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
    //          (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
    //          expect(mediaSelectedSpy).toHaveBeenCalled();
    //          expect(mediaUploadingSpy).toHaveBeenCalled();
    //          setTimeout(() => {
    //              expect(mediaUploadSuccessSpy).toHaveBeenCalled();
    //              evnArg.selectNode = [rteObj.element];
    //              (<any>rteObj).videoModule.deleteVideo(evnArg);
    //              (<any>rteObj).videoModule.uploadObj.upload((<any>rteObj).videoModule.uploadObj.filesData[0]);
    //              done();
    //          }, 4000);
    //      });
    //  });
 
     describe('Insert video mediaSelected event args cancel true - ', () => {
         let rteObj: RichTextEditor;
         let isMediaUploadSuccess: boolean = false;
         let isMediaUploadFailed: boolean = false;
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 fileSelected: mediaSelectedEvent,
                 fileUploadSuccess: mediaUploadSuccessEvent,
                 fileUploadFailed: mediaUploadFailedEvent,
                 insertVideoSettings: {
                     saveUrl:"https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
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
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
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
             (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
             let fileObj: File = new File(["mov_bob"], "mov_bob.mp4", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
             setTimeout(() => {
                 expect(isMediaUploadSuccess).toBe(false);
                 expect(isMediaUploadFailed).toBe(false);
                 done();
             }, 4000);
             
         });
     });
 
     describe('Insert video mediaRemoving event - ', () => {
         let rteObj: RichTextEditor;
         let mediaRemovingSpy: jasmine.Spy = jasmine.createSpy('onFileRemoving');
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 fileRemoving: mediaRemovingSpy,
                 toolbarSettings: {
                     items: ['Video']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
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
             (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
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
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 fileUploadFailed: mediaUploadFailedSpy,
                 insertVideoSettings: {
                     saveUrl:"uploadbox/Save",
                     path: "../Videos/"
                 },
                 toolbarSettings: {
                     items: ['Video']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
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
             (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
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
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 insertVideoSettings: {
                     allowedTypes: ['.mp3'],
                     saveUrl:"uploadbox/Save",
                     path: "../Videos/"
                 },
                 toolbarSettings: {
                     items: ['Video']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
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
             }, 4000);
         });
     });
 
     describe('beforeMediaUpload event - ', () => {
         let rteObj: RichTextEditor;
         let beforeMediaUploadSpy: jasmine.Spy = jasmine.createSpy('onBeforeFileUpload');
         beforeEach((done: Function) => {
             rteObj = renderRTE({
                 beforeFileUpload: beforeMediaUploadSpy,
                 toolbarSettings: {
                     items: ['Video']
                 },
             });
             done();
         })
         afterEach((done: Function) => {
             destroy(rteObj);
             done();
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
             (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
             let fileObj: File = new File(["Header"], "mov_bob.mp4", { lastModified: 0, type: "overide/mimetype" });
             let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
             (<any>rteObj).videoModule.uploadObj.onSelectFiles(eventArgs);
             expect(beforeMediaUploadSpy).toHaveBeenCalled();
             done();
         });
     });
 
     describe('BeforeDialogOpen eventArgs args.cancel testing', () => {
         let rteObj: RichTextEditor;
         let count: number = 0;
         beforeAll((done: Function) => {
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
             done();
         });
         afterAll((done: Function) => {
             destroy(rteObj);
             done();
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
         beforeAll((done: Function) => {
             rteObj = renderRTE({
                 toolbarSettings: {
                     items: ['Video']
                 },
                 beforeDialogOpen(e: any): void {
                     e.cancel = true;
                     count = count + 1;
                 }
             });
             done();
         });
         afterAll((done: Function) => {
             destroy(rteObj);
             done();
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
             expect((rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-video-wrap')).not.toBe(null);
             done();
         });
     });
     describe('Video outline style testing, while focus other content or video', () => {
         let rteObj: RichTextEditor;
         let QTBarModule: IRenderer;
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
         let QTBarModule: IRenderer;
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
         beforeAll((done: Function) => {
             rteObj = renderRTE({ });
             done();
         });
         afterAll((done: Function) => {
             destroy(rteObj);
             done();
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
    
    describe ('EJ2-65777 Not able to insert Embed video using Keyboard Shortcut', () => {
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
            action : 'insert-video'
        };
        beforeEach ( () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Video'],
                }
            });
        });

        afterEach ((done: Function)  => {
            destroy( rteObj );
            done();
        });

        it ('Should insert Embed video in the RTE content editable div', (done: Function) => {
            (rteObj as any).videoModule.onKeyDown({ args: keyboardEventArgs });
            const inputElem: HTMLElement = document.querySelector( '.e-embed-video-url' );
            const embedURL: string = `<iframe width="560" height="315" src="https://www.youtube.com/embed/j898RGRw0b4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            inputElem.innerHTML = embedURL;
            const insertBtn: HTMLElement = document.querySelector( '.e-insertVideo' );
            insertBtn.removeAttribute( 'disabled' );
            insertBtn.click();
            setTimeout ( () => {
                expect(rteObj.element.childElementCount).toEqual(3);
                done();
            }, 1000);
        });

        it ('Should insert Web video in the RTE content editable div', (done: Function) => {
            (rteObj as any).videoModule.onKeyDown({ args: keyboardEventArgs });
            document.getElementById('webURL').click()
            const inputElem: HTMLElement = document.querySelector( '.e-video-url' );
            const embedURL: string = `https://www.w3schools.com/tags/movie.mp4`;
            inputElem.innerHTML = embedURL;
            const insertBtn: HTMLElement = document.querySelector( '.e-insertVideo' );
            insertBtn.removeAttribute( 'disabled' );
            insertBtn.click();
            setTimeout ( () => {
                expect(rteObj.element.childElementCount).toEqual(5);
                done();
            }, 1000);
        });
    });
    describe('836851 - Check the video quick toolbar hide, while click the enterkey ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
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

        it('Check the vedio quick toolbar hide, while click the enterkey', (done: Function) => {
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
            expect(document.querySelector('.e-rte-quick-popup')).toBe(null);
            done();
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
            (<any>rteObj).videoModule.editAreaClickHandler({args:clickEvent});
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
            (<any>rteObj).videoModule.editAreaClickHandler({args:clickEvent});
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup')as HTMLElement)).toBe(true);
            let videoQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            (videoQTBarEle.querySelector("[title='Dimension']")as HTMLElement).click();
            let dialogEle = <HTMLElement>document.querySelector('.e-rte-video-dialog');
            (dialogEle.querySelector('.e-vid-width') as HTMLInputElement).value = '200px';
            (dialogEle.querySelector('.e-vid-width') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-vid-height') as HTMLInputElement).value = '200px';
            (dialogEle.querySelector('.e-vid-height') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-update-size') as HTMLElement).click();
            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup'))).toBe(true);
            done();
        });
    });
    describe('836851 - Check the video resize while height greater than width - resizeByPercent enabled', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert Video here',
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: true, minHeight: 80, minWidth: 80,resizeByPercent: true }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect((rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement).style.display).toBe('block');
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
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            const videoElement = document.querySelector(".e-rte-video") as HTMLElement;
            videoElement.style.width = "150px";
            videoElement.style.height = "300px";
            let placeHolder: HTMLElement = (rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement);
            expect(placeHolder.style.display).toBe('block');
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
            expect(rteObj.contentModule.getDocument().body.contains(this.vidResizeDiv)).toBe(false);
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
            expect((rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement).style.display).toBe('block');
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
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            const videoElement = document.querySelector(".e-rte-video") as HTMLElement;
            videoElement.style.width = "150px";
            videoElement.style.height = "300px";
            let placeHolder: HTMLElement = (rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement);
            expect(placeHolder.style.display).toBe('block');
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
            expect(rteObj.contentModule.getDocument().body.contains(this.vidResizeDiv)).toBe(false);
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
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert Video here',
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: true, minHeight: 80, minWidth: 80  , resizeByPercent: true}
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video width to be zero - resizeByPercent as ture', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect((rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement).style.display).toBe('block');
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
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            const videoElement = document.querySelector(".e-rte-video") as HTMLElement;
            videoElement.style.width = "0px";
            let placeHolder: HTMLElement = (rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement);
            expect(placeHolder.style.display).toBe('block');
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
            expect(rteObj.contentModule.getDocument().body.contains(this.vidResizeDiv)).toBe(false);
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
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert Video here',
                toolbarSettings: {
                    items: ['Video', 'Bold']
                },
                insertVideoSettings: { resize: true, minHeight: 80, minWidth: 80  , resizeByPercent: true}
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('video width to be zero - resizeByPercent as false', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect((rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement).style.display).toBe('block');
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
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            const videoElement = document.querySelector(".e-rte-video") as HTMLElement;
            videoElement.style.width = "0px";
            let placeHolder: HTMLElement = (rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement);
            expect(placeHolder.style.display).toBe('block');
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
            expect(rteObj.contentModule.getDocument().body.contains(this.vidResizeDiv)).toBe(false);
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
                insertVideoSettings: {removeUrl:"https://ej2.syncfusion.com/services/api/uploadbox/Remove"},
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
            (<any>rteObj).videoModule.editAreaClickHandler({args:clickEvent});
            expect(!isNullOrUndefined(document.querySelector('.e-video-wrap')as HTMLElement)).toBe(true);
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup')as HTMLElement)).toBe(true);
            let videoQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            (videoQTBarEle.querySelector("[title='Remove']")as HTMLElement).click();
            expect(isNullOrUndefined(document.querySelector('.e-video-wrap')as HTMLElement)).toBe(true);
            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup')as HTMLElement)).toBe(true);
            done();
        });
    });
    describe('836851 - insertVideoUrl', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IRenderer;
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
            (<HTMLElement>document.querySelector('[title="Insert Video (Ctrl+Alt+V)"]')as HTMLElement).click()
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL')as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertVideo.e-primary')as HTMLElement).click();
            expect(!isNullOrUndefined(document.querySelector('.e-rte-video'))).toBe(true)
            done();
        });
    });
    describe('836851 - Check the insert button - without input URL', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IRenderer;
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
            (<HTMLElement>document.querySelector('[title="Insert Video (Ctrl+Alt+V)"]')as HTMLElement).click()
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL')as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url-wrap input#embedURL')as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url-wrap input#webURL')as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = '';
            (dialogEle.querySelector('.e-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            (dialogEle.querySelector('.e-video-url-wrap input#embedURL')as HTMLElement).click();
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '<iframe width="560" height="315" src="https://www.youtube.com/embed/4U2ZxO7b8iM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            (dialogEle.querySelector('.e-embed-video-url') as HTMLElement).dispatchEvent(new Event("keyup"));
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '';
            (dialogEle.querySelector('.e-embed-video-url') as HTMLElement).dispatchEvent(new Event("keyup"));
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = '<iframe width="560" height="315" src="https://www.youtube.com/embed/4U2ZxO7b8iM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            (dialogEle.querySelector('.e-embed-video-url') as HTMLElement).dispatchEvent(new Event("keyup"));
            (document.querySelector('.e-insertVideo.e-primary')as HTMLElement).click();
            expect(!isNullOrUndefined(document.querySelector('.e-video-clickelem'))).toBe(true);
            (<HTMLElement>document.querySelectorAll('.e-toolbar-item')[0]as HTMLElement).click();
            (<HTMLElement>document.querySelectorAll('.e-browsebtn')[0]as HTMLElement).click()

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
            }, 4500);
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
        let QTBarModule: IRenderer;
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
            (<HTMLElement>document.querySelector('[title="Insert Video (Ctrl+Alt+V)"]')as HTMLElement).click()
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-video-url-wrap input#webURL')as HTMLElement).click();
            (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
            (dialogEle.querySelector('.e-video-url') as HTMLElement).dispatchEvent(new Event("input"));
            (<any>rteObj).videoModule.onIframeMouseDown();
            (<HTMLElement>document.querySelectorAll('.e-toolbar-item')[0]as HTMLElement).click();
            expect(!isNullOrUndefined(document.querySelector('.e-rte-video-dialog'))).toBe(true)
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
                insertVideoSettings: {removeUrl:"https://ej2.syncfusion.com/services/api/uploadbox/Remove"},
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
            (<any>rteObj).videoModule.editAreaClickHandler({args:clickEvent});
            expect(!isNullOrUndefined(document.querySelector('.e-video-wrap')as HTMLElement)).toBe(true);
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup')as HTMLElement)).toBe(true);
            let videoQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            (videoQTBarEle.querySelector("[title='Remove']")as HTMLElement).click();
            expect(isNullOrUndefined(document.querySelector('.e-video-wrap')as HTMLElement)).toBe(true);
            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup')as HTMLElement)).toBe(true);
            done();
        });
    });
    xdescribe('836851 - Video deleting when press backspace button - without wrapper element', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
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
            expect((<any>rteObj).inputElement.querySelector('.e-video-wrap')).toBe(null);
            done();
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
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).value = `<iframe width="560" height="315" src="https://www.youtube.com/embed/4U2ZxO7b8iM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            (dialogEle.querySelector('.e-embed-video-url') as HTMLInputElement).dispatchEvent(new Event("keyup"));
            (document.querySelector('.e-insertVideo.e-primary') as HTMLElement).click();
            expect((<any>rteObj).element.querySelector('iframe')).not.toBe(null);
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-video-clickelem');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.editAreaClickHandler({args:clickEvent});
            expect(!isNullOrUndefined(document.querySelector('.e-embed-video-wrap')as HTMLElement)).toBe(true);
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup')as HTMLElement)).toBe(true);
            let videoQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            (videoQTBarEle.querySelector("[title='Remove']")as HTMLElement).click();
            expect(isNullOrUndefined(document.querySelector('.e-embed-video-wrap')as HTMLElement)).toBe(true);
            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup')as HTMLElement)).toBe(true);
            done();
        });
    });
    // describe('836851 - Check the video quick toolbar render after the insert the video', function () {
    //     let rteObj: RichTextEditor;
    //     beforeAll((done: Function) => {
    //         rteObj = renderRTE({
    //             height: 400,
    //             toolbarSettings: {
    //                 items: ['Video', 'Bold']
    //             },
    //         });
    //         done();
    //     });
    //     afterAll((done: Function) => {
    //         destroy(rteObj);
    //         done();
    //     });
    //     it('Check the video quick toolbar render after the insert the video', (done: Function) => {
    //         (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
    //         (<HTMLElement>document.querySelector('[title="Insert Video (Ctrl+Alt+V)"]')as HTMLElement).click()
    //         let dialogEle: any = rteObj.element.querySelector('.e-dialog');
    //         (dialogEle.querySelector('.e-video-url-wrap input#webURL')as HTMLElement).click();
    //         (dialogEle.querySelector('.e-video-url') as HTMLInputElement).value = 'https://www.w3schools.com/html/mov_bbb.mp4';
    //         (dialogEle.querySelector('.e-video-url') as HTMLElement).dispatchEvent(new Event("input"));
    //         (document.querySelector('.e-insertVideo.e-primary')as HTMLElement).click();
    //         let target = (<any>rteObj).Element.querySelectorAll(".e-content")[0];
    //         let clickEvent = document.createEvent("MouseEvents");
    //         clickEvent.initEvent("mousedown", false, true);
    //         target.dispatchEvent(clickEvent);
    //     });
    // });
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
            (<any>rteObj).videoModule.editAreaClickHandler({args:clickEvent});
            target = <HTMLElement>document.querySelector('.e-rte-botRight')as HTMLElement;
            target.dispatchEvent(clickEvent);
            (<any>rteObj).videoModule.resizeStart(clickEvent);
            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup'))).toBe(true);
            done();
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
            (<any>rteObj).videoModule.editAreaClickHandler({args:clickEvent});
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
            (<any>rteObj).videoModule.editAreaClickHandler({args:clickEvent});
            target = <HTMLElement>document.querySelector('.e-rte-botRight')as HTMLElement;
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
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
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
            rteObj.formatter.editorManager.nodeSelection.setSelectionText( document, startContainer, endContainer, 7, 2 )
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (<any>rteObj).keyDown(keyBoardEvent);
            (<any>rteObj).videoModule.onKeyUp();
            expect(!isNullOrUndefined(rteObj.element.querySelector('.e-video-wrap'))).toBe(true);
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
            let video: HTMLElement  = rteObj.element.querySelector(".e-video-wrap video");
            setCursorPoint(video, 0);
            dispatchEvent(video, 'mousedown');
            video.click();
            dispatchEvent(video, 'mouseup');
            setTimeout(function () {
                let videoBtn: HTMLElement  = document.getElementById(controlId + "_quick_VideoReplace");
                videoBtn.parentElement.click();
                let dialog: HTMLElement  = document.getElementById(controlId + "_video");
                (dialog.querySelector('.e-video-url-wrap input#webURL') as HTMLElement).click();
                let urlInput: HTMLInputElement = dialog.querySelector('.e-video-url');
                expect(urlInput.value !== null && urlInput.value !== undefined && urlInput.value !== '').toBe(true);
                done();
            }, 100);
        });
    });
});
