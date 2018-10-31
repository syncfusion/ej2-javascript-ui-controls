/**
 * Content renderer spec
 */
import { Browser, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { RichTextEditor, Toolbar, Image, IRenderer, ResizeArgs } from './../../../src/index';
import { NodeSelection } from './../../../src/selection/index';
import { renderRTE, destroy } from "./../render.spec";

import { QuickToolbar, MarkdownEditor, HtmlEditor } from "../../../src/rich-text-editor/index";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(QuickToolbar);
RichTextEditor.Inject(Image);

document.body.innerHTML = '';

function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}
describe('insert image', () => {
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
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: false }
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

    describe('image resize', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 },
                actionBegin: function (e: any) {
                    expect(!isNullOrUndefined(e.itemCollection)).toBe(true);
                    expect(!isNullOrUndefined(e.itemCollection.url)).toBe(true);
                },
                actionComplete: function (e: any) {
                    expect(e.requestType === 'Image').toBe(true);
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('image dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).imageModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            
        });
        it('resize start', () => {
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-imageboxmark').length).toBe(4);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeEnd({ target: resizeBot });
            //resize end evnet cannot remove helper element.
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).not.toBe(null);
            expect((rteObj.imageModule as any).pageX).toBe(null);
            expect(rteObj.contentModule.getDocument().body.contains(this.imgResizeDiv)).toBe(false);
        });
        it('resizing - mousemove - bottom right', () => {
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth;
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
            expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth);
        });

        it('resizing - mousemove - top right', () => {
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-topRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.topRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth;
            (<any>rteObj.imageModule).resizeBtnStat.topRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth);
            (<any>rteObj.imageModule).resizeBtnStat.topRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
            expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth);
        });
        it('resizing - mousemove - botttom Left', () => {
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botLeft') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botLeft = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth;
            (<any>rteObj.imageModule).resizeBtnStat.botLeft = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth + 200);
            (<any>rteObj.imageModule).resizeBtnStat.botLeft = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
            expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth - 200);
        });
        it('resizing - mousemove - top Left', () => {
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-topLeft') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.topLeft = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth;
            (<any>rteObj.imageModule).resizeBtnStat.topLeft = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth + 100);
            (<any>rteObj.imageModule).resizeBtnStat.topLeft = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
            expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth - 300);
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
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: true, resizeByPercent: true }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('image dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).imageModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            
        });
        it('resize start', () => {
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-imageboxmark').length).toBe(4);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeEnd({ target: resizeBot });
            //resize end evnet cannot remove helper element.
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).not.toBe(null);
            expect((rteObj.imageModule as any).pageX).toBe(null);
            expect(rteObj.contentModule.getDocument().body.contains(this.imgResizeDiv)).toBe(false);
        });
        it('resizing - mousemove - bottom right', () => {
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth;
            expect(((rteObj.element.querySelector('.e-rte-image') as HTMLElement).style.width as any).search('%')).not.toBe(-1);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth + 100);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
            expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth -100);
        });
    });
    describe('predefined set image', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        let innerHTML: string = `<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
<img src='https://ej2.syncfusion.com/demos/src/rte/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
`;
    let innerHTML1: string = `<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
<img src='https://ej2.syncfusion.com/demos/src/rte/images/RTEImage-Feather.png' style="width:200px; height: 300px"/>
`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: innerHTML,
                insertImageSettings: { resize: true}
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('resize start', () => {
            let trg = (rteObj.element.querySelector('img') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-imageboxmark').length).toBe(4);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            let trg = (rteObj.element.querySelector('img') as HTMLElement);
            (rteObj.imageModule as any).resizeEnd({ target: resizeBot });
            //resize end evnet cannot remove helper element.
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).not.toBe(null);
            expect((rteObj.imageModule as any).pageX).toBe(null);
            expect(rteObj.contentModule.getDocument().body.contains(this.imgResizeDiv)).toBe(false);
        });
        it('resizing', () => {
            let trg = (rteObj.element.querySelector('img') as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('img') as HTMLElement).offsetWidth;
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            expect(width).toEqual((rteObj.element.querySelector('img') as HTMLElement).offsetWidth + 100);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
            expect(width).toEqual((rteObj.element.querySelector('img') as HTMLElement).offsetWidth - 100);
            rteObj.value = null;
            rteObj.dataBind();
            rteObj.value = innerHTML1;
            rteObj.dataBind();
            trg = (rteObj.element.querySelector('img') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            resizeBot = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
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
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: true }
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
            let evnArg: any = { args, self: (<any>rteObj).imageModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.contentModule.getDocument().body.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).not.toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-imageboxmark').length).toBe(4);
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
             trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
             (rteObj.imageModule as any).resizeStart({target: resizeBot, preventDefault: function(){}, stopImmediatePropagation: function(){}});
             (rteObj.imageModule as any).resizing({ target: resizeBot, touches:[{ pageX: 300 }]});
             expect((rteObj.imageModule as any).pageX).toBe(300);
            (rteObj.imageModule as any).onDocumentClick({ target: rteObj.contentModule.getEditPanel() });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).toBe(null);
            expect(rteObj.contentModule.getDocument().body.contains(this.imgResizeDiv)).toBe(false);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (rteObj.imageModule as any).resizeStart({ target: resizeBot, preventDefault: function () { }, stopImmediatePropagation: function () { } });
        });
    });

    describe('image resize events', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: true },
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
        it('image dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') },
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).imageModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
        });
        it('resize start event', () => {
            let trget = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trget, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-topLeft') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).toBe(null);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-imageboxmark').length).toBe(0);
        });
        it('resize end and resizing events', () => {
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeEnd({ target: trg });
            (rteObj.imageModule as any).resizeStart({ target: trg });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth;
            expect(width).toEqual((trg as HTMLImageElement).width);
        });
    });

    describe(' Mobile image interaction', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;
        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: false },
                value: '<p class="testNode">Test node</p>'
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it(' contenteditable set as false while click on image to close the virtual keyboard', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).imageModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = document.body.querySelector('.e-rte-img-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            expect(rteObj.contentModule.getEditPanel().getAttribute('contenteditable') === 'false').toBe(true);
            (rteObj.element.querySelector('.testNode') as HTMLElement).click();
            expect(rteObj.contentModule.getEditPanel().getAttribute('contenteditable') === 'true').toBe(true);
            Browser.userAgent = defaultUA;
        });
    });

    describe('div content-rte testing', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: false },
                actionBegin: function (e: any) {
                    expect(!isNullOrUndefined(e.itemCollection)).toBe(true);
                    expect(!isNullOrUndefined(e.itemCollection.url)).toBe(true);
                },
                actionComplete: function (e: any) {
                    expect(e.requestType === 'Image').toBe(true);
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('image dialog', (done: Function) => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            expect(dialogEle.firstElementChild.querySelector('.e-dlg-header').innerHTML === 'Insert Image').toBe(true);
            expect(dialogEle.querySelector('.e-img-uploadwrap').firstElementChild.classList.contains('e-droptext')).toBe(true);
            expect(dialogEle.querySelector('.imgUrl').firstElementChild.classList.contains('e-img-url')).toBe(true);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('.e-dialog')).not.toBe(true);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let args: any = {
                item: { url: 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png', selection: save },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.imgObj.createImage(args);
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).focus();
            args = {
                item: { url: null, selection: null },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.imgObj.createImage(args);
            let evnArg: any = { args, self: (<any>rteObj).imageModule, selection: save, selectNode: [''], link: null, target: '' };
            evnArg.selectNode = [(<any>rteObj).element.querySelector('.e-rte-image')];
            let trg: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: evnArg.selectNode[0] };
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let linkPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let linkTBItems: any = linkPop.querySelectorAll('.e-toolbar-item');
                expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                (<HTMLElement>linkTBItems.item(0)).click();
                let eventArgs: any = { target: document, preventDefault: function () { } };
                (<any>rteObj).imageModule.onDocumentClick(eventArgs);
                done();
            }, 400);
        });
        it('insert image url', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).imageModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.args = { preventDefault: function () { }, originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') } };
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)];
            let trget: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: evnArg.selectNode[0], preventDefault: function () { } };
            clickEvent.initEvent("mousedown", false, true);
            trget.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
            let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            let linkTBItems: NodeList = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>linkTBItems.item(2)).click();
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption')).not.toBe(null);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-wrap')).not.toBe(null);
            expect((<any>rteObj).imageModule.captionEle.querySelector('img').classList.contains('e-rte-image')).toBe(true);
            trget.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
            let imagePop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            imagePop.style.display = 'block';
            expect(imagePop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            expect(imagePop.offsetLeft >= rteEle.offsetLeft).toBe(true);
            expect(imagePop.offsetTop > rteEle.offsetTop).toBe(true);
            let captionEle: HTMLElement = trget.querySelector('.e-img-caption') as HTMLElement;
            expect(imagePop.offsetTop > (captionEle.offsetTop + captionEle.offsetHeight)).toBe(true);
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).focus();
            evnArg.item = { command: 'Images', subCommand: 'JustifyLeft' };
            evnArg.e = args;
            (<any>rteObj).imageModule.alignmentSelect(evnArg);
            (<any>rteObj).imageModule.justifyImageLeft(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgleft')).toBe(true);
            evnArg.item = { command: 'Images', subCommand: 'JustifyRight' };
            evnArg.e = args;
            (<any>rteObj).imageModule.alignmentSelect(evnArg);
            (<any>rteObj).imageModule.justifyImageRight(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgright')).toBe(true);
            evnArg.item = { command: 'Images', subCommand: 'JustifyCenter' };
            evnArg.e = args;
            (<any>rteObj).imageModule.alignmentSelect(evnArg);
            (<any>rteObj).imageModule.justifyImageCenter(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgright')).not.toBe(true);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgleft')).not.toBe(true);
            evnArg.selectNode = [rteObj.element];
            (<any>rteObj).imageModule.break(evnArg);
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)];
            evnArg.item = { command: 'Images', subCommand: 'Break' };
            evnArg.e = args;
            (<any>rteObj).imageModule.alignmentSelect(evnArg);
            evnArg.selectNode = [rteObj.element];
            (<any>rteObj).imageModule.inline(evnArg);
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)];
            evnArg.item = { command: 'Images', subCommand: 'Inline' };
            evnArg.e = args;
            (<any>rteObj).imageModule.alignmentSelect(evnArg);
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.selectNode = [(<any>rteObj).element.querySelector('.e-rte-image')];
            let trg: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            clickEvent = document.createEvent("MouseEvents");
            eventsArg = { pageX: 50, pageY: 300, target: evnArg.selectNode[0], preventDefault: function () { } };
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('.e-rte-image'));
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
            linkPop = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            linkTBItems = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>linkTBItems.item(3)).click();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            dialogEle = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.selectNode = [(<any>rteObj).element.querySelector('.e-rte-image')];
            (<any>rteObj).imageModule.deleteImg(evnArg);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            dialogEle = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.args = { preventDefault: function () { }, originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') } };
            evnArg.selectNode = [rteObj.element];
            (<any>rteObj).imageModule.imageSize(evnArg);
            evnArg.selectNode = [(<any>rteObj).element.querySelector('.e-rte-image')];
            (<any>rteObj).imageModule.imageSize(evnArg);
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-width').value = 180;
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-height').value = 180;
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-update-size').click();
            expect((<any>rteObj).element.querySelector('.e-rte-image').width).toBe(180);
            expect((<any>rteObj).element.querySelector('.e-rte-image').height).toBe(180);
            let eventsArgs: any = { target: rteObj.element.querySelector('.e-rte-image') as HTMLElement, preventDefault: function () { } };
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('.e-rte-image'));
            (<any>rteObj).editAreaClickHandler(eventsArgs);
            linkPop = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            linkTBItems = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>linkTBItems.item(2)).click();
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption')).not.toBe(null);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-wrap')).not.toBe(null);
            expect((<any>rteObj).imageModule.captionEle.querySelector('img').classList.contains('e-rte-image')).toBe(true);
            eventsArgs = { target: rteObj.element as HTMLElement, preventDefault: function () { } };
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('.e-rte-image'));
            (<any>rteObj).mouseUp(eventsArgs);
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.selectNode = [rteObj.element];
            eventsArgs = { target: rteObj.element.querySelector('.e-rte-image') as HTMLElement, preventDefault: function () { } };
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('.e-rte-image'));
            (<any>rteObj).editAreaClickHandler(eventsArgs);
            linkPop = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            linkTBItems = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>linkTBItems.item(2)).click();
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)];
            eventsArgs = { target: rteObj.element.querySelector('.e-rte-image') as HTMLElement, preventDefault: function () { } };
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('.e-rte-image'));
            (<any>rteObj).editAreaClickHandler(eventsArgs);
            linkPop = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            linkTBItems = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>linkTBItems.item(2)).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            expect((<any>rteObj).element.querySelector('.e-rte-image').closest('.e-content')).not.toBe(null);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let eventArgs: any = { target: document, preventDefault: function () { } };
            (<any>rteObj).imageModule.onDocumentClick(eventArgs);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0]).classList.remove('e-overlay');
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            (document.querySelector('.e-cancel') as HTMLElement).click();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            eventsArgs = { target: rteObj.element.querySelector('.e-rte-image') as HTMLElement, preventDefault: function () { } };
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('.e-rte-image'));
            (<any>rteObj).editAreaClickHandler(eventsArgs);
            linkPop = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            linkTBItems = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>linkTBItems.item(7)).click();
            (<any>rteObj).mouseUp(eventsArgs);
            (<HTMLElement>linkTBItems.item(5)).click();
            (<any>rteObj).mouseUp(eventsArgs);
            evnArg.item = { command: 'Images', subCommand: 'JustifyCenter' };
            evnArg.e = args;
            (<any>rteObj).imageModule.alignmentSelect(evnArg);
            eventArgs = { target: document, preventDefault: function () { } };
            (<any>rteObj).imageModule.onDocumentClick(eventArgs);
        });

        it('image insert link', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<any>rteObj).element.querySelector('.e-rte-image').click();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, selfImage: (<any>rteObj).imageModule, selection: save, selectNode: [(<any>rteObj).element.querySelector('.e-rte-image')], link: null, target: '' };
            (<any>rteObj).imageModule.justifyImageLeft(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgleft')).toBe(true);
            (<any>rteObj).imageModule.justifyImageRight(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgright')).toBe(true);
            (<any>rteObj).imageModule.justifyImageCenter(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgright')).not.toBe(true);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgleft')).not.toBe(true);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-rte-image')).toBe(true);
            (<any>rteObj).imageModule.break(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imginline')).not.toBe(true);
            (<any>rteObj).imageModule.inline(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imginline')).toBe(true);
            (<any>rteObj).imageModule.insertImgLink(evnArg);
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-rte-linkTarget').click();
            expect((<any>rteObj).imageModule.checkBoxObj.checked).toBe(false);
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-rte-linkTarget').click();
            expect((<any>rteObj).imageModule.checkBoxObj.checked).toBe(true);
            expect((<any>rteObj).imageModule.dialogObj.element.classList.contains('e-rte-img-dialog')).toBe(true);
            expect((<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link')).not.toBe(null);
            (<any>rteObj).imageModule.insertImgLink(evnArg);
            expect((<any>rteObj).imageModule.dialogObj).toBe(null);
            (<any>rteObj).element.querySelector('.e-rte-image').click();
            evnArg.selectNode = [rteObj.element];
            (<any>rteObj).imageModule.insertImgLink(evnArg);
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)];
            (<any>rteObj).imageModule.insertImgLink(evnArg);
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link').value = 'http://www.goole.com';
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-update-link').click();
            (<any>rteObj).imageModule.insertImgLink(evnArg);
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-update-link').click();
            expect((<any>rteObj).imageModule.dialogObj.element.classList.contains('e-rte-img-dialog')).toBe(true);
            expect((<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link')).not.toBe(null);
            ((<any>rteObj).imageModule.dialogObj.element.querySelector('.e-img-linkwrap .e-img-link') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            evnArg.link = (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-img-linkwrap .e-img-link') as HTMLInputElement;
            evnArg.target = '';
            (<any>rteObj).imageModule.insertlink(evnArg);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('a')).not.toBe(null);
            (<any>rteObj).imageModule.justifyImageLeft(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').parentElement.classList.contains('e-imgleft')).toBe(true);
            (<any>rteObj).imageModule.justifyImageRight(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').parentElement.classList.contains('e-imgright')).toBe(true);
            (<any>rteObj).imageModule.justifyImageCenter(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgright')).not.toBe(true);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgleft')).not.toBe(true);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-rte-image')).toBe(true);
            (<any>rteObj).imageModule.break(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imginline')).not.toBe(true);
            (<any>rteObj).imageModule.inline(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imginline')).toBe(true);
            let eventsArgs = { target: rteObj.element.querySelector('.e-rte-image') as HTMLElement, preventDefault: function () { } };
            (<any>rteObj).editAreaClickHandler(eventsArgs);
            let linkPop = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            let linkTBItems = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<any>rteObj).mouseUp(eventsArgs);
            (<HTMLElement>linkTBItems.item(3)).click();
            let eventArgs = { target: document, preventDefault: function () { } };
            (<any>rteObj).imageModule.onDocumentClick(eventArgs);
            (<any>rteObj).imageModule.insertAlt(evnArg);
        });
        it('insert image upload', (done) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            (document.querySelector('.e-insertImage') as HTMLElement).click();
            setTimeout(() => {
                expect((<any>rteObj).imageModule.uploadObj.fileList.length).toEqual(1);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).imageModule.deleteImg(evnArg);
                (<any>rteObj).imageModule.uploadObj.upload((<any>rteObj).imageModule.uploadObj.filesData[0]);
                done();
            }, 4000);
        });
        it('image alternative text', () => {
            let eventArgs = { target: document, preventDefault: function () { } };
            (<any>rteObj).imageModule.onDocumentClick(eventArgs);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, alt: '', selectNode: new Array(), };
            rteObj.quickToolbarModule.imageQTBar.hidePopup();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.selectNode = [rteObj.element];
            (<any>rteObj).imageModule.insertAltText(evnArg);
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)];
            (<any>rteObj).imageModule.insertAltText(evnArg);
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-update-alt').click();
            let eventsArgs: any = { target: document, preventDefault: function () { } };
            (<any>rteObj).imageModule.onDocumentClick(eventsArgs);
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)];
            (<any>rteObj).imageModule.insertAltText(evnArg);
            expect((<any>rteObj).imageModule.dialogObj.element.classList.contains('e-rte-img-dialog')).toBe(true);
            expect((<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-alt')).not.toBe(null);
            ((<any>rteObj).imageModule.dialogObj.element.querySelector('.e-img-altwrap .e-img-alt') as HTMLInputElement).value = 'image';
            (evnArg.alt as any) = (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-img-altwrap .e-img-alt') as HTMLInputElement;
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)];
            (<any>rteObj).imageModule.insertAlt(evnArg);
            expect((rteObj.element.querySelector('.e-rte-image') as HTMLImageElement).alt === 'image').toBe(true);
        });
    });
    describe('div content-rte testing', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: {
                    allowedTypes: ['jpeg', 'jpg', 'png'],
                    display: 'inline',
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
        it('upload the image while use save url', (done) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                expect((<any>rteObj).imageModule.uploadObj.fileList.length).toEqual(1);
                (document.getElementsByClassName('e-browsebtn')[0] as HTMLElement).click()
                done();
            }, 4500);
        });
    });

    describe('image dialog - Short cut key', () => {
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
                    items: ['Image', 'Bold']
                },
                insertImageSettings: {
                    allowedTypes: ['jpeg', 'jpg', 'png'],
                    display: 'inline',
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

        it('close image dialog - escape', () => {
            keyboardEventArgs.action = 'escape';
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(isNullOrUndefined((<any>rteObj).imageModule.dialogObj)).toBe(false);
            (<any>rteObj).imageModule.onKeyDown({ args: keyboardEventArgs });
            expect(isNullOrUndefined((<any>rteObj).imageModule.dialogObj)).toBe(true);
        });
    });
    describe('quick toolbar', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: false }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('image dialog', () => {
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (document.querySelector('.e-insertImage') as HTMLElement).click();
            (<any>rteObj).element.querySelector('.e-rte-image').click();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, selfImage: (<any>rteObj).imageModule, selection: save, selectNode: [(<any>rteObj).element.querySelector('.e-rte-image')], link: null, target: '' };
            (<any>rteObj).imageModule.insertImgLink(evnArg);
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link').value = 'http://www.goole.com';
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-update-link').click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).focus();
            let selectNode = [(<any>rteObj).element.querySelector('.e-rte-image')];
            let trg: any = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: selectNode[0] };
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
            let linkPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            let linkTBItems: any = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>linkTBItems.item(4)).click();
            (<HTMLElement>linkTBItems.item(6)).click();
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-update-link').click();
            (<HTMLElement>linkTBItems.item(7)).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).focus();
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
        });
    });

    describe('image dialog - documentClick', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            action: 'insert-image',
            key: 's'
        };
        beforeAll(() => {
            rteObj = renderRTE({ insertImageSettings: { resize: false } });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('open image dialog - click on image item in toolbar', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<any>rteObj).imageModule.onKeyDown({ args: keyboardEventArgs });
            expect(document.body.contains((<any>rteObj).imageModule.dialogObj.element)).toBe(true);

            let eventsArgs: any = { target: rteObj.element.querySelector('.e-image'), preventDefault: function () { } };
            (<any>rteObj).imageModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).imageModule.dialogObj.element)).toBe(true);

            eventsArgs = { target: document.querySelector('[title="Insert Image"]'), preventDefault: function () { } };
            (<any>rteObj).imageModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).imageModule.dialogObj.element)).toBe(true);

            eventsArgs = { target: document.querySelector('[title="Insert Image"]').parentElement, preventDefault: function () { } };
            (<any>rteObj).imageModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).imageModule.dialogObj.element)).toBe(true);

        });
        it('close image dialog - while click on document', () => {
            let eventsArgs = { target: document, preventDefault: function () { } };
            (<any>rteObj).imageModule.onDocumentClick(eventsArgs);
            expect((<any>rteObj).imageModule.dialogObj).toBe(null);
        });
    });
    describe('image edit', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            action: '',
            key: 's'
        };
        let QTBarModule: IRenderer;
        let curDocument: Document;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: false },
                value: `<p>rte sample</p>`
            });
            rteEle = rteObj.element;
            QTBarModule = getQTBarModule(rteObj);
            curDocument = rteObj.contentModule.getDocument();
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('edit image', () => {
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            let nodObj: NodeSelection = new NodeSelection();
            var range = nodObj.getRange(document);
            var save = nodObj.save(range, document);
            var args = {
                item: { url: 'https://gitlab.syncfusion.com/uploads/-/system/appearance/header_logo/1/Syncfusion_logo_plain.jpg', selection: save, selectParent: [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)] },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.imgObj.createImage(args);
            expect(((rteObj.element.querySelector('.e-rte-image') as HTMLImageElement).src === 'https://gitlab.syncfusion.com/uploads/-/system/appearance/header_logo/1/Syncfusion_logo_plain.jpg')).toBe(true);
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            (<any>QTBarModule).renderQuickToolbars();
            QTBarModule.imageQTBar.showPopup(10, 131, (rteObj.element.querySelector('.e-rte-image') as HTMLElement));
            let imgPop: HTMLElement = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            let imgTBItems: NodeList = imgPop.querySelectorAll('.e-toolbar-item');
            expect(imgPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            expect((<HTMLElement>imgTBItems.item(1)).title).toBe('Align');
            ((<HTMLElement>imgTBItems.item(1)).firstElementChild as HTMLElement).click();
            let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
            let mouseEventArgs = {
                item: { command: 'Images', subCommand: 'JustifyLeft' }
            };
            (<any>rteObj).imageModule.alignmentSelect(mouseEventArgs);
            let img: HTMLElement = rteObj.element.querySelector('.e-rte-image') as HTMLElement;
            expect(img.classList.contains('e-imgleft')).toBe(true);
            mouseEventArgs.item.subCommand = 'JustifyCenter';
            (<any>rteObj).imageModule.alignmentSelect(mouseEventArgs);
            expect(img.classList.contains('e-imgcenter')).toBe(true);
            mouseEventArgs.item.subCommand = 'JustifyRight';
            (<any>rteObj).imageModule.alignmentSelect(mouseEventArgs);
            expect(img.classList.contains('e-imgright')).toBe(true);
            ((<HTMLElement>imgTBItems.item(9)).firstElementChild as HTMLElement).click();
            popupElement = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[1];
            mouseEventArgs.item.subCommand = 'Inline';
            (<any>rteObj).imageModule.alignmentSelect(mouseEventArgs);
            expect(img.classList.contains('e-imginline')).toBe(true);
            mouseEventArgs.item.subCommand = 'Break';
            (<any>rteObj).imageModule.alignmentSelect(mouseEventArgs);
            expect(img.classList.contains('e-imgbreak')).toBe(true);
            QTBarModule.imageQTBar.hidePopup();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            (<any>rteObj).imageModule.onKeyDown({ args: keyboardEventArgs });
        });
    });

    describe('image with cimbination', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: false }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('image insert', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).imageModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
        });
        it('quicktoobar actions', (done: Function) => {
            let target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('img');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                quickTBItem.item(5).click();
                (document.querySelector('.e-img-link') as any).value = 'https://www.syncfusion.com';
                (document.querySelector('.e-update-link') as any).click();
                target = rteObj.contentModule.getEditPanel().querySelector('img');
                expect(closest(target, 'a')).not.toBe(null);
                (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
                quickTBItem.item(10).click();
                (document.querySelector('.e-img-alt') as any).value = 'syncfusion.png';
                (document.querySelector('.e-update-alt') as any).click();
                target = rteObj.contentModule.getEditPanel().querySelector('img');
                expect(target.getAttribute('alt') === 'syncfusion.png').toBe(true);
                (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
                quickTBItem.item(6).click();
                target = rteObj.contentModule.getEditPanel().querySelector('img');
                (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
                quickTBItem.item(8).click();
                expect(closest(target, 'a')).toBe(null);
                quickTBItem.item(11).click();
                done();
            }, 200);

        });
    });
    describe('image resize with undo redo', () => {
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
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('image dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).imageModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();

        });
        it('resizing - mousemove - bottom right', () => {
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            let width = (rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth;
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 300 });
            width += 100;
            expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth);
            (rteObj.imageModule as any).resizeEnd({ target: resizeBot });
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 90;
            keyboardEventArgs.action = 'undo';
            (<any>rteObj).imageModule.onKeyDown({ args: keyboardEventArgs });
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
            keyboardEventArgs.ctrlKey = true;
            keyboardEventArgs.keyCode = 89;
            keyboardEventArgs.action = 'redo';
            (<any>rteObj).imageModule.onKeyDown({ args: keyboardEventArgs });
            (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
            trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            expect(trg.style.outline ==='').toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).toBe(null);
        });
    });
    describe('initial load image undo redo', () => {
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
        let innerHTML1: string = ` 
            <img src='https://ej2.syncfusion.com/demos/src/rte/images/RTEImage-Feather.png' style="width:200px; height: 300px"/>
            `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: innerHTML1,
                insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('link element check', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('img');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            eventsArg = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                quickTBItem.item(5).click();
                (document.querySelector('.e-img-link') as any).value = 'https://www.syncfusion.com';
                (document.querySelector('.e-update-link') as any).click();
                target = rteObj.contentModule.getEditPanel().querySelector('img');
                expect(closest(target, 'a')).not.toBe(null);
                keyboardEventArgs.ctrlKey = true;
                keyboardEventArgs.keyCode = 90;
                keyboardEventArgs.action = 'undo';
                (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
                expect(rteObj.contentModule.getEditPanel().querySelector('a')).toBe(null);
                done();
            }, 200);
        });
        it('caption check', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('img');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            eventsArg = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                quickTBItem.item(2).click();
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption')).not.toBe(null);
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-wrap')).not.toBe(null);
                expect((<any>rteObj).imageModule.captionEle.querySelector('img').classList.contains('e-rte-image')).toBe(true);
                keyboardEventArgs.ctrlKey = true;
                keyboardEventArgs.keyCode = 90;
                keyboardEventArgs.action = 'undo';
                (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption')).toBe(null);
                keyboardEventArgs.ctrlKey = true;
                keyboardEventArgs.keyCode = 89;
                keyboardEventArgs.action = 'redo';
                (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption')).not.toBe(null);
                done();
            }, 200);
        });
        it('alt check', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('img');
            expect(target.getAttribute('alt')).toBe(null);
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            eventsArg = { pageX: 50, pageY: 300, target: target };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                quickTBItem.item(10).click();
                (document.querySelector('.e-img-alt') as any).value = 'syncfusion.png';
                (document.querySelector('.e-update-alt') as any).click();
                target = rteObj.contentModule.getEditPanel().querySelector('img');
                expect(target.getAttribute('alt') === 'syncfusion.png').toBe(true);
                keyboardEventArgs.ctrlKey = true;
                keyboardEventArgs.keyCode = 90;
                keyboardEventArgs.action = 'undo';
                (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
                target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('img');
                expect(target.getAttribute('alt')).toBe(null);
                done();
            }, 200);
        });
    });
});