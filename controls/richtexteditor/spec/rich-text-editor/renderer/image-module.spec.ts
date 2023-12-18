/**
 * Image module spec 
 */
import { Browser, isNullOrUndefined, closest, detach, createElement } from '@syncfusion/ej2-base';
import { RichTextEditor, QuickToolbar, IRenderer, DialogType } from './../../../src/index';
import { NodeSelection } from './../../../src/selection/index';
import { renderRTE, destroy, setCursorPoint, dispatchEvent, androidUA, iPhoneUA, currentBrowserUA, dispatchKeyEvent } from "./../render.spec";
import { SelectEventArgs } from '@syncfusion/ej2-navigations';

function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}

describe('insert image', () => {

    describe(' Quick Toolbar open testing after selecting some text', () => {
        let rteObj: any;
        let ele: HTMLElement;
        it(" selecting some text and then clicking on image test ", () => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: "<div id='rte'><p><b>Syncfusion</b> Software</p>" + "<img id='imgTag' style='width: 200px' alt='Logo'" +
                " src='http://cdn.syncfusion.com/content/images/sales/buynow/Character-opt.png' />"
            });
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 2);
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#imgTag');
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
    describe('div content-rte testing', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
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
        it('image dialog', () => {
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
                item: {url: 'https://www.syncfusion.com', selectNode : [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)]},
                selection: null,
                preventDefault: function () { }, target: '_blank'
            };
            (<any>rteObj).formatter.editorManager.imgObj.insertImageLink (args);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('a')).not.toBe(null);
            args.item = { url: 'https://www.syncfusion.com', target: '_blank', selectNode : [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)] };
            (<any>rteObj).formatter.editorManager.imgObj.editImageLink (args);
            args.item = { url: 'https://www.syncfusion.com', target: '_blank',
            insertElement:(rteObj.element.querySelector('.e-rte-image') as HTMLElement) , selectParent : [(rteObj.element.querySelector('a') as HTMLElement)] };
            (<any>rteObj).formatter.editorManager.imgObj.removeImageLink(args);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('a')).toBe(null);
            args.item= { selectNode : [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)]};
            (<any>rteObj).formatter.editorManager.imgObj.removeImage(args);
             (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
             range = new NodeSelection().getRange(document);
             save = new NodeSelection().save(range, document);
             args = {
                item: { url: 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png', selection: save },
                preventDefault: function () { }
            };
            (<any>rteObj).formatter.editorManager.imgObj.createImage(args);
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).focus();
            args.item = {altText: 'image', selectNode : [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)] };
            (<any>rteObj).formatter.editorManager.imgObj.insertAltTextImage(args);
            args.item = {width: 200, height: 200, selectNode : [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)]};
            (<any>rteObj).formatter.editorManager.imgObj.imageDimension(args);
            (<any>rteObj).formatter.editorManager.imgObj.imageJustifyLeft(args);
            (<any>rteObj).formatter.editorManager.imgObj.imageJustifyCenter(args);
            args.item = {width: 200, height: 200, selectNode : [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)]};
            (<any>rteObj).formatter.editorManager.imgObj.imageJustifyRight(args);
            args.item = {width: 200, height: 200, selectNode : [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)]};
            (<any>rteObj).formatter.editorManager.imgObj.imageInline(args);
            (<any>rteObj).formatter.editorManager.imgObj.imageBreak(args);
            args = {
                item: {url: 'https://www.syncfusion.com', selectNode : [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)]},
                preventDefault: function () { }, target: '_blank'
            };
            (<any>rteObj).formatter.editorManager.imgObj.insertImageLink (args);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('a')).not.toBe(null);
            (<any>rteObj).formatter.editorManager.imgObj.openImageLink(args);
        });
        it('image dialog Coverage', (done: Function) => {
            rteObj.value = '<p id="contentId">hello  </p>',
            rteObj.dataBind();
            let pTag: HTMLElement = rteObj.element.querySelector('#contentId') as HTMLElement;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pTag.childNodes[0], pTag.childNodes[0], 0, 5);
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
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: false }
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

    describe('image resize', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert Image here',
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 },
                actionBegin: function (e: any) {
                    if(e.item.subCommand === 'Image'){
                    expect(!isNullOrUndefined(e.itemCollection)).toBe(true);
                    expect(!isNullOrUndefined(e.itemCollection.url)).toBe(true);
                    }
                if(e.item.subCommand === 'Caption') { expect(e.item.subCommand === 'Caption').toBe(true); }
                if(e.item.subCommand === 'JustifyLeft') { expect(e.item.subCommand === 'JustifyLeft').toBe(true); }
                if(e.item.subCommand === 'JustifyRight') { expect(e.item.subCommand === 'JustifyRight').toBe(true); }
                if(e.item.subCommand === 'JustifyCenter') { expect(e.item.subCommand === 'JustifyCenter').toBe(true); }
                if(e.item.subCommand === 'Inline') { expect(e.item.subCommand === 'Inline').toBe(true); }
                if(e.item.subCommand === 'Break') { expect(e.item.subCommand === 'Break').toBe(true); }
                },
                actionComplete: function (e: any) {
                    if(e.requestType === 'Image') { expect(e.requestType === 'Image').toBe(true);}
                    if(e.requestType === 'Caption') { expect(e.requestType === 'Caption').toBe(true);}
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('image dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect((rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement).style.display).toBe('block');
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
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            let placeHolder: HTMLElement = (rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement);
            expect(placeHolder.style.display).toBe('block');
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
            //expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
            //expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth);
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
            //expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth);
            (<any>rteObj.imageModule).resizeBtnStat.topRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
            //expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth);
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
            //expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth + 100);
            (<any>rteObj.imageModule).resizeBtnStat.topLeft = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 200;
            //expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth - 300);
        });

        it('resizing - mousemove - bottom Left', () => {
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botLeft') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botLeft = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            // width += 100;
            // expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth + 100);
            // (<any>rteObj.imageModule).resizeBtnStat.botLeft = true;
            // (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 100 });
            // width -= 200;
            // expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth - 100);
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
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
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
        it('resizing - mousemove - bottom right', (done) => {
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            setTimeout(() => {
                let width = (rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth;
                //expect(((rteObj.element.querySelector('.e-rte-image') as HTMLElement).style.width as any).search('%')).not.toBe(-1);
                (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
                (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 300 });
                setTimeout(() => {
                    width += 100;
                    //expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth);
                    (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
                    (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 100 });
                    setTimeout(() => {
                        width -= 200;
                        //expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth);
                        done();
                    }, 200);
                }, 200);
            }, 200);
        });
    });
    describe('predefined set image', () => {
        let rteObj: RichTextEditor;
        let clickEvent: any;
        let innerHTML: string = `<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
<img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
`;
        let innerHTML1: string = `<p><b>Description:</b></p>
<p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
<img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/>
`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: innerHTML,
                insertImageSettings: { resize: true }
            });
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
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
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
            (rteObj.imageModule as any).resizeStart({ target: resizeBot, preventDefault: function () { }, stopImmediatePropagation: function () { } });
            (rteObj.imageModule as any).resizing({ target: resizeBot, touches: [{ pageX: 300 }] });
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
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
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
        it(' contenteditable set as false while click on image to close the virtual keyboard', (done: Function) => {
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
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            (<any>rteObj).clickPoints = { clientY: 0, clientX: 0 };
            dispatchEvent((rteObj.element.querySelector('.e-rte-image') as HTMLElement), 'mouseup');
            let eventsArgs: any = { target: (rteObj.element.querySelector('.e-rte-image') as HTMLElement), preventDefault: function () { } };
            (<any>rteObj).imageModule.imageClick(eventsArgs);
            setTimeout(() => {
                expect(rteObj.contentModule.getEditPanel().getAttribute('contenteditable') === 'false').toBe(true);
                (rteObj.element.querySelector('.testNode') as HTMLElement).click();
                (<any>rteObj).clickPoints = { clientY: 0, clientX: 0 };
                dispatchEvent((rteObj.element.querySelector('.testNode') as HTMLElement), 'mouseup');
                let eventsArgs: any = { target: (rteObj.element.querySelector('.testNode') as HTMLElement), preventDefault: function () { } };
                (<any>rteObj).imageModule.imageClick(eventsArgs);
                setTimeout(() => {
                    expect(rteObj.contentModule.getEditPanel().getAttribute('contenteditable') === 'true').toBe(true);
                    done();
                }, 1000);
            }, 400);
        });
        it('readonly true with contenteditable set as false while click on image to close the virtual keyboard', (done: Function) => {
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
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            (<any>rteObj).clickPoints = { clientY: 0, clientX: 0 };
            dispatchEvent((rteObj.element.querySelector('.e-rte-image') as HTMLElement), 'mouseup');
            let eventsArgs: any = { target: (rteObj.element.querySelector('.e-rte-image') as HTMLElement), preventDefault: function () { } };
            (<any>rteObj).imageModule.imageClick(eventsArgs);
            setTimeout(() => {
                expect(rteObj.contentModule.getEditPanel().getAttribute('contenteditable') === 'false').toBe(true);
                rteObj.readonly = true;
                rteObj.dataBind();
                (rteObj.element.querySelector('.testNode') as HTMLElement).click();
                (<any>rteObj).clickPoints = { clientY: 0, clientX: 0 };
                dispatchEvent((rteObj.element.querySelector('.testNode') as HTMLElement), 'mouseup');
                setTimeout(() => {
                    expect(rteObj.contentModule.getEditPanel().getAttribute('contenteditable') === 'false').toBe(true);
                    Browser.userAgent = defaultUA;
                    done();
                }, 1000);
            }, 400);
        });
    });

    describe('Inserting image and applying heading', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let actionComplete: any;
        beforeAll(() => {
            actionComplete = jasmine.createSpy("actionComplete");
            rteObj = renderRTE({
                actionComplete: actionComplete,
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold', 'Formats']
                },
                insertImageSettings: { resize: false }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Inserting image and applying heading', () => {
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
            (rteObj.element.querySelector('.e-rte-dropdown-btn') as HTMLElement).click();
            (document.querySelector('.e-h1') as HTMLElement).click();
            expect(actionComplete).toHaveBeenCalled();
        });
    });


    describe('Inserting image and applying heading in IE11', () => {
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
                    items: ['Image', 'Bold', 'Formats']
                },
                insertImageSettings: { resize: false }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Inserting image and applying heading in IE11', () => {
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
            (rteObj.element.querySelector('.e-rte-dropdown-btn') as HTMLElement).click();
            (document.querySelector('.e-h1') as HTMLElement).click();
            expect(actionComplete).toHaveBeenCalled();
        });
    });

    describe('Coverage improvement', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let actionComplete: any;
        beforeAll(() => {
            actionComplete = jasmine.createSpy("actionComplete");
            rteObj = renderRTE({
                actionComplete: actionComplete,
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold', 'Formats']
                },
                insertImageSettings: { resize: false }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Inserting image and applying heading in coverage', () => {
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
            (rteObj.element.querySelector('.e-rte-dropdown-btn') as HTMLElement).click();
            (document.querySelector('.e-h1') as HTMLElement).click();
            expect(actionComplete).toHaveBeenCalled();
        });
    });

    describe('Link with image', function() {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(function() {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: '<a class="e-rte-anchor" href="http://adadas">syncfu<img class="e-rte-image e-imginline e-resize" alt="image" style="">sion</a>',
                insertImageSettings: { resize: false }
            });
            rteEle = rteObj.element;
        });
        afterAll(function() {
            destroy(rteObj);
        });
        it('check link text while delete image', function() {
            let  args : any = {
                item: { selectNode: [rteObj.element.querySelector('.e-rte-image')] },
                preventDefault: function() {}
            };
            expect(rteEle.getElementsByTagName('IMG').length).toBe(1);
            (rteObj.formatter.editorManager as any).imgObj.removeImage(args);
            expect(rteEle.getElementsByTagName('IMG').length).toBe(0);
            expect(rteObj.inputElement.innerText).toBe('syncfusion');
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
                    if(e.item.subCommand === 'Image'){
                    expect(!isNullOrUndefined(e.itemCollection)).toBe(true);
                    expect(!isNullOrUndefined(e.itemCollection.url)).toBe(true);
                    }
                },
                actionComplete: function (e: any) {
                    if(e.requestType === 'Image'){ expect(e.requestType === 'Image').toBe(true);}
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
            detach(document.querySelector('.e-imginline'));
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
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') },
                item: {},
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).imageModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.args = { preventDefault: function () { }, originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }, item: {} };
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
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-rte-img-caption')).not.toBe(null);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-wrap')).not.toBe(null);
            expect((<any>rteObj).imageModule.captionEle.querySelector('img').classList.contains('e-rte-image')).toBe(true);
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('.e-rte-image'));
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
            evnArg.args.item = { command: 'Images', subCommand: 'JustifyLeft' };
            (<any>rteObj).imageModule.alignImage(evnArg, 'JustifyLeft');
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgleft')).toBe(true);
            evnArg.item = { command: 'Images', subCommand: 'JustifyRight' };
            evnArg.e = args;
            (<any>rteObj).imageModule.alignmentSelect(evnArg);
            evnArg.args.item = { command: 'Images', subCommand: 'JustifyRight' };
            (<any>rteObj).imageModule.alignImage(evnArg, 'JustifyRight');
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgright')).toBe(true);
            evnArg.item = { command: 'Images', subCommand: 'JustifyCenter' };
            evnArg.e = args;
            (<any>rteObj).imageModule.alignmentSelect(evnArg);
            evnArg.args.item = { command: 'Images', subCommand: 'JustifyCenter' };
            (<any>rteObj).imageModule.alignImage(evnArg, 'JustifyCenter');
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgright')).not.toBe(true);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgleft')).not.toBe(true);
            evnArg.selectNode = [rteObj.element];
            (<any>rteObj).imageModule.break(evnArg);
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)];
            evnArg.item = { command: 'Images', subCommand: 'Break' };
            evnArg.e = args;
            (<any>rteObj).imageModule.alignmentSelect(evnArg);
            evnArg.args.item = { command: 'Images', subCommand: 'Break' };
            evnArg.selectNode = [rteObj.element];
            (<any>rteObj).imageModule.inline(evnArg);
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)];
            evnArg.item = { command: 'Images', subCommand: 'Inline' };
            evnArg.e = args;
            (<any>rteObj).imageModule.alignmentSelect(evnArg);
            evnArg.args.item = { command: 'Images', subCommand: 'Inline' };
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
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.selectNode = [(<any>rteObj).element.querySelector('.e-rte-image')];
            evnArg.args.item = {command: 'Images', subCommand: 'Remove'};
            (<any>rteObj).imageModule.deleteImg(evnArg);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            dialogEle = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.args = { item: {}, preventDefault: function () { }, originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') } };
            evnArg.selectNode = [rteObj.element];
            evnArg.args.item = {command: 'Images', subCommand: 'Dimension'};
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
            // set and pass the click action point for check the condtion in mouseup event handler
            (<any>rteObj).clickPoints = { clientY: 100, clientX: 50 };
            eventsArgs.clientY = 100;
            eventsArgs.clientX = 50;
            (<any>rteObj).mouseUp(eventsArgs);
            linkPop = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            linkTBItems = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>linkTBItems.item(2)).click();
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption')).not.toBe(null);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-wrap')).not.toBe(null);
            expect((<any>rteObj).imageModule.captionEle.querySelector('img').classList.contains('e-rte-image')).toBe(true);
            eventsArgs = { target: rteObj.element as HTMLElement, preventDefault: function () { } };
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('.e-rte-image'));
            // set and pass the click action point for check the condtion in mouseup event handler
            (<any>rteObj).clickPoints = { clientY: 100, clientX: 50 };
            eventsArgs.clientY = 100;
            eventsArgs.clientX = 50;
            (<any>rteObj).mouseUp(eventsArgs);
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.selectNode = [rteObj.element];
            eventsArgs = { target: rteObj.element.querySelector('.e-rte-image') as HTMLElement, preventDefault: function () { } };
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('.e-rte-image'));
            // set and pass the click action point for check the condtion in mouseup event handler
            (<any>rteObj).clickPoints = { clientY: 100, clientX: 50 };
            eventsArgs.clientY = 100;
            eventsArgs.clientX = 50;
            (<any>rteObj).mouseUp(eventsArgs);
            linkPop = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            linkTBItems = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>linkTBItems.item(2)).click();
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)];
            eventsArgs = { target: rteObj.element.querySelector('.e-rte-image') as HTMLElement, preventDefault: function () { } };
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('.e-rte-image'));
            // set and pass the click action point for check the condtion in mouseup event handler
            (<any>rteObj).clickPoints = { clientY: 100, clientX: 50 };
            eventsArgs.clientY = 100;
            eventsArgs.clientX = 50;
            (<any>rteObj).mouseUp(eventsArgs);
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
            // set and pass the click action point for check the condtion in mouseup event handler
            (<any>rteObj).clickPoints = { clientY: 100, clientX: 50 };
            eventsArgs.clientY = 100;
            eventsArgs.clientX = 50;
            (<any>rteObj).mouseUp(eventsArgs);
            linkPop = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            linkTBItems = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>linkTBItems.item(7)).click();
            // set and pass the click action point for check the condtion in mouseup event handler
            (<any>rteObj).clickPoints = { clientY: 100, clientX: 50 };
            eventsArgs.clientY = 100;
            eventsArgs.clientX = 50;
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
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') },
                item: {}
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, selfImage: (<any>rteObj).imageModule, selection: save, selectNode: [(<any>rteObj).element.querySelector('.e-rte-image')], link: null, target: '' };
            evnArg.args.item = { command: 'Images', subCommand: 'JustifyLeft' };
            (<any>rteObj).imageModule.alignImage(evnArg, 'JustifyLeft');
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgleft')).toBe(true);
            evnArg.args.item = { command: 'Images', subCommand: 'JustifyRight' };
            (<any>rteObj).imageModule.alignImage(evnArg, 'JustifyRight');
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgright')).toBe(true);
            evnArg.args.item = { command: 'Images', subCommand: 'JustifyCenter' };
            (<any>rteObj).imageModule.alignImage(evnArg, 'JustifyCenter');
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgright')).not.toBe(true);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgleft')).not.toBe(true);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-rte-image')).toBe(true);
            evnArg.args.item = { command: 'Images', subCommand: 'Break' };
            (<any>rteObj).imageModule.break(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imginline')).not.toBe(true);
            evnArg.args.item = { command: 'Images', subCommand: 'Inline' };
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
            evnArg.args.item = { command: 'Images', subCommand: 'insertlink' };
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link').value = 'http://www.goole.com';
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-update-link').click();
            (<any>rteObj).imageModule.insertImgLink(evnArg);
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-update-link').click();
            expect((<any>rteObj).imageModule.dialogObj.element.classList.contains('e-rte-img-dialog')).toBe(true);
            expect((<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link')).not.toBe(null);
            ((<any>rteObj).imageModule.dialogObj.element.querySelector('.e-img-linkwrap .e-img-link') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<any>rteObj).element.querySelector('.e-rte-image').click();
            args = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') },
                item: {}
            };
            range = new NodeSelection().getRange(document);
            save = new NodeSelection().save(range, document);
            evnArg = { args, selfImage: (<any>rteObj).imageModule, selection: save, selectNode: [(<any>rteObj).element.querySelector('.e-rte-image')], link: null, target: '' };
            evnArg.link = (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-img-linkwrap .e-img-link') as HTMLInputElement;
            evnArg.target = '';
            evnArg.args.item = { command: 'Images', subCommand: 'insertlink' };
            (<any>rteObj).imageModule.insertlink(evnArg);
            expect((<any>rteObj).contentModule.getEditPanel().querySelector('a')).not.toBe(null);
            evnArg.args.item = { command: 'Images', subCommand: 'JustifyLeft' };
            (<any>rteObj).imageModule.alignImage(evnArg, 'JustifyLeft');
            expect((<any>rteObj).element.querySelector('.e-rte-image').parentElement.classList.contains('e-imgleft')).toBe(true);
            evnArg.args.item = { command: 'Images', subCommand: 'JustifyRight' };
            (<any>rteObj).imageModule.alignImage(evnArg, 'JustifyRight');
            expect((<any>rteObj).element.querySelector('.e-rte-image').parentElement.classList.contains('e-imgright')).toBe(true);
            evnArg.args.item = { command: 'Images', subCommand: 'JustifyCenter' };
            (<any>rteObj).imageModule.alignImage(evnArg, 'JustifyCenter');
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgright')).not.toBe(true);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgleft')).not.toBe(true);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-rte-image')).toBe(true);
            evnArg.args.item = { command: 'Images', subCommand: 'Break' };
            (<any>rteObj).imageModule.break(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imginline')).not.toBe(true);
            evnArg.args.item = { command: 'Images', subCommand: 'Inline' };
            (<any>rteObj).imageModule.inline(evnArg);
            expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imginline')).toBe(true);
            let eventsArgs:any = { target: rteObj.element.querySelector('.e-rte-image') as HTMLElement, preventDefault: function () { } };
             // set and pass the click action point for check the condtion in mouseup event handler
             (<any>rteObj).clickPoints = { clientY: 100, clientX: 50 };
             eventsArgs.clientY = 100;
             eventsArgs.clientX = 50;
             (<any>rteObj).mouseUp(eventsArgs);
            let linkPop = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            let linkTBItems = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<any>rteObj).mouseUp(eventsArgs);
            (<HTMLElement>linkTBItems.item(3)).click();
            let eventArgs = { target: document, preventDefault: function () { } };
            (<any>rteObj).imageModule.onDocumentClick(eventArgs);
            evnArg.args.item = { command: 'Images', subCommand: 'AltText' };
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
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
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
            let args = { preventDefault: function () { }, item: {} };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: args, self: (<any>rteObj).imageModule, selection: save, alt: '', selectNode: new Array(), };
            rteObj.quickToolbarModule.imageQTBar.hidePopup();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.selectNode = [rteObj.element];
            (<any>rteObj).imageModule.insertAltText(evnArg);
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            evnArg.selectNode = [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)];
            (<any>rteObj).imageModule.insertAltText(evnArg);
            evnArg.args.item = { command: 'Images', subCommand: 'AltText' };;
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
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
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
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertImage') as HTMLElement).click();
            (<any>rteObj).element.querySelector('.e-rte-image').click();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') },
                item: {}
            };
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, selfImage: (<any>rteObj).imageModule, selection: save, selectNode: [(<any>rteObj).element.querySelector('.e-rte-image')], link: null, target: '' };
            (<any>rteObj).imageModule.insertImgLink(evnArg);
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link').value = 'http://www.goole.com';
            evnArg.args.item = { command: 'Images', subCommand: 'insertlink' };
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
            evnArg.args.item = { command: 'Images', subCommand: 'insertlink' };
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-update-link').click();
            (<HTMLElement>linkTBItems.item(7)).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).focus();
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
        });
    });

    describe('dialogOpen Event- Check dialog element', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image']
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

    describe('image dialog - documentClick', () => {
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            action: 'insert-image',
            key: 's'
        };
        beforeAll(() => {
            rteObj = renderRTE({ insertImageSettings: { resize: false } });
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

            eventsArgs = { target: document.querySelector('[title="Insert Image (Ctrl+Shift+I)"]'), preventDefault: function () { } };
            (<any>rteObj).imageModule.onDocumentClick(eventsArgs);
            expect(document.body.contains((<any>rteObj).imageModule.dialogObj.element)).toBe(true);

            eventsArgs = { target: document.querySelector('[title="Insert Image (Ctrl+Shift+I)"]').parentElement, preventDefault: function () { } };
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

        it('edit image', (done) => {
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
            (<any>rteObj).clickPoints = { clientY: 0, clientX: 0 };
            dispatchEvent((rteObj.element.querySelector('.e-rte-image') as HTMLElement), 'mouseup');
            setTimeout(() => {
                let nodObj: NodeSelection = new NodeSelection();
                var range = nodObj.getRange(document);
                var save = nodObj.save(range, document);
                let target = rteObj.element.querySelector('.e-rte-image') as HTMLElement;
                (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
                var args = {
                    item: { url: 'https://gitlab.syncfusion.com/uploads/-/system/appearance/header_logo/1/Syncfusion_logo_plain.jpg', selection: save, selectParent: [(rteObj.element.querySelector('.e-rte-image') as HTMLElement)] },
                    preventDefault: function () { }
                };
                (<any>rteObj).formatter.editorManager.imgObj.createImage(args);
                expect(((rteObj.element.querySelector('.e-rte-image') as HTMLImageElement).src === 'https://gitlab.syncfusion.com/uploads/-/system/appearance/header_logo/1/Syncfusion_logo_plain.jpg')).toBe(true);
                (rteObj.element.querySelector('.e-rte-image') as HTMLElement).click();
                (<any>rteObj).clickPoints = { clientY: 0, clientX: 0 };
                dispatchEvent((rteObj.element.querySelector('.e-rte-image') as HTMLElement), 'mouseup');
                setTimeout(() => {
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
                    (<any>rteObj).clickPoints = { clientY: 0, clientX: 0 };
                    dispatchEvent((rteObj.element.querySelector('.e-rte-image') as HTMLElement), 'mouseup');
                    setTimeout(() => {
                        (<any>rteObj).imageModule.onKeyDown({ args: keyboardEventArgs });
                        done();
                    }, 40);
                }, 40);
            }, 40);
        });
    });

    describe('image with cimbination', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
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
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
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
                quickTBItem.item(7).click();
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
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
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
            expect(trg.style.outline === '').toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).toBe(null);
        });
    });
    describe('initial load image undo redo', () => {
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
            <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/>
            `;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: `<img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/>`,
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
            setTimeout(function () {
                expect(rteObj.contentModule.getEditPanel().querySelector('a')).toBe(null);
                done();
            }, 1000);
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
    describe('Removing the image with link and caption applied', () => {
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
            <p>testing&nbsp;<span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><a href="http://www.google.com" contenteditable="true" target="_blank"><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/></a><span class="e-img-inner" contenteditable="true">Caption</span></span></span></p>
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

        it('image remove with quickToolbar check', (done: Function) => {
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
                quickTBItem.item(3).click();
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption')).toBe(null);
                done();
            }, 200);
        });
    });
    
    describe('Removing the image with link and caption applied', () => {
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
            <p>testing&nbsp;<span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><a href="http://www.google.com" contenteditable="true" target="_blank"><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/></a><span class="e-img-inner" contenteditable="true">Caption</span></span></span></p>
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

        it('image remove with quickToolbar check', (done: Function) => {
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
                quickTBItem.item(3).click();
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption')).toBe(null);
                done();
            }, 200);
        });
    });

    describe('EJ2-53661- Image is not deleted when press backspace and delete button', () => {
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
            <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/>
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

        it('Checking image delete action being removed with no removeUrl configured', (done: Function) => {
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
                quickTBItem.item(3).click();
                expect(rteObj.contentModule.getEditPanel().querySelector('.e-rte-image')).toBe(null);
                (rteObj.imageModule as any).triggerPost();
                done();
            }, 200);
        });
    });

    describe('EJ2-53661- Image is not deleted when press backspace and delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
        let innerHTML1: string = `testing
        <span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize" style=""><span class="e-img-inner" contenteditable="true">image caption</span></span></span>testing`;
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

        it('Image delete action checking using backspace key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].lastChild;
            setCursorPoint(node, 0);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-img-caption')).toBe(null);
            done();
        });
    });

    describe('EJ2-53661- Image is not deleted when press backspace and delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46};
        let innerHTML1: string = `testing<span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize" style=""><span class="e-img-inner" contenteditable="true">image caption</span></span></span>testing`;
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

        it('Image delete action checking using delete key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].firstChild;
            setCursorPoint(node, 7);
            keyBoardEvent.keyCode = 46;
            keyBoardEvent.code = 'Delete';
            keyBoardEvent.action = 'delete';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-img-caption')).toBe(null);
            done();
        });
    });

    describe('EJ2-53661- Image is not deleted when press backspace and delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
        let innerHTML1: string = `<p><span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize" style=""><span class="e-img-inner" contenteditable="true">image caption</span></span></span></p>`;
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

        it('Image delete action checking using backspace key with nodes', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0];
            setCursorPoint(node, 1);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-img-caption')).toBe(null);
            done();
        });
    });

    describe('EJ2-56517- Image with caption is not deleted when press backspace button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
        let innerHTML1: string = `testing
        <span class="e-img-caption e-rte-img-caption e-imgbreak" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" alt="test.png" width="auto" height="auto" style="min-width: 0px; max-width: 645px; min-height: 0px;" class="e-imgbreak e-rte-image e-resize e-img-focus"><span class="e-img-inner" contenteditable="true">image caption</span></span></span>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image']
                },
                value: innerHTML1,
                insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Image delete action checking using backspace key', (done: Function) => {
            expect((<any>rteObj).inputElement.querySelector('.e-imgbreak')).not.toBe(null);
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, (rteObj as any).inputElement.childNodes[0]);
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-imgbreak')).toBe(null);
            done();
        });
    });

    describe('EJ2-56517- Image with caption is not deleted when pressing delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46};
        let innerHTML1: string = `testing<span class="e-img-caption e-rte-img-caption e-imgbreak" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" alt="test.png" width="auto" height="auto" style="min-width: 0px; max-width: 645px; min-height: 0px;" class="e-imgbreak e-rte-image e-resize e-img-focus"><span class="e-img-inner" contenteditable="true">image caption</span></span></span>testing`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image']
                },
                value: innerHTML1,
                insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Image delete action checking using delete key', (done: Function) => {
            expect((<any>rteObj).inputElement.querySelector('.e-imgbreak')).not.toBe(null);
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, (rteObj as any).inputElement.childNodes[0]);
            keyBoardEvent.keyCode = 46;
            keyBoardEvent.code = 'Delete';
            keyBoardEvent.action = 'delete';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-img-imgbreak')).toBe(null);
            done();
        });
    });
    
    describe('Mouse Click for image testing when showOnRightClick enabled', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p>Hi image is<img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`,
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
        it(" Test - for mouse click to focus image element", (done) => {
            let target: HTMLElement = rteObj.element.querySelector("#image");
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let expectElem: HTMLElement[] = (rteObj as any).formatter.editorManager.nodeSelection.getSelectedNodes(document);
                expect(expectElem[0].tagName === 'IMG').toBe(true);
                done();
            }, 100);
        });
    });
    
    describe(' quickToolbarSettings property - image quick toolbar - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(' Test - Replace the image ', (done) => {
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            setTimeout(() => {
                let imageBtn: HTMLElement = document.getElementById(controlId + "_quick_Replace");
                imageBtn.parentElement.click();
                let png = "https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png";
                let dialog: HTMLElement = document.getElementById(controlId + "_image");
                let urlInput: HTMLInputElement = dialog.querySelector('.e-img-url');
                urlInput.value = png;
                let insertButton: HTMLElement = dialog.querySelector('.e-insertImage.e-primary');
                urlInput.dispatchEvent(new Event("input"));
                insertButton.click();
                let updateImage: HTMLImageElement = rteObj.element.querySelector("#image");
                expect(updateImage.src === png).toBe(true);
                done();
            }, 100);
        });
    });

    describe(' ActionComplete event triggered twice when replace the inserted image using quicktoolbar - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let actionCompleteCalled: boolean = true;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`,
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
        it(' Testing image Replace and acitonComplete triggering', (done) => {
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            setTimeout(() => {
                let imageBtn: HTMLElement = document.getElementById(controlId + "_quick_Replace");
                imageBtn.parentElement.click();
                let png = "https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png";
                let dialog: HTMLElement = document.getElementById(controlId + "_image");
                let urlInput: HTMLInputElement = dialog.querySelector('.e-img-url');
                urlInput.value = png;
                urlInput.dispatchEvent(new Event("input"));
                let insertButton: HTMLElement = dialog.querySelector('.e-insertImage.e-primary');
                insertButton.click();
                let updateImage: HTMLImageElement = rteObj.element.querySelector("#image");
                expect(updateImage.src === png).toBe(true);
                setTimeout(function () {
                    expect(actionCompleteCalled).toBe(true);
                    done();
                }, 40);
            }, 100);
        });
    });

    describe('EJ2-37798 - Disable the insert image dialog button when the image is uploading.', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p>Testing Image Dialog</p>`
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(' Initial insert image button disabled', (done) => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Image');
            item.click();
            let dialog: HTMLElement = document.getElementById(controlId + "_image");
            let insertButton: HTMLElement = dialog.querySelector('.e-insertImage.e-primary');
            expect(insertButton.hasAttribute('disabled')).toBe(true);
            done();
        });
    });
    describe('EJ2-37798 - Disable the insert image dialog button when the image is uploading', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                insertImageSettings: {
                    allowedTypes: ['.png'],
                    saveUrl:"uploadbox/Save",
                    path: "../Images/"
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
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[8] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            let fileObj: File = new File(["Nice One"], "sample.jpg", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect((dialogEle.querySelector('.e-insertImage') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
                done();
            }, 4000);
        });
    });
    describe('EJ2-37798 - Disable the insert image dialog button when the image is uploading', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image']
                },
                insertImageSettings: {
                    saveUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Save",
                    path: "../Images/"
                }
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Button enabled with image upload Success', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            let fileObj: File = new File(["Nice One"], "sample.jpg", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect((dialogEle.querySelector('.e-insertImage') as HTMLButtonElement).hasAttribute('disabled')).toBe(false);
                done();
            }, 4500);
        });
    });
    describe(' EJ2-20297: RTE Image insert link  - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(" Test - don't set the target as _blank while insert link with disable the new window option ", (done) => {
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            setTimeout(() => {
                let imageBtn: HTMLElement = document.getElementById(controlId + "_quick_InsertLink");
                imageBtn.parentElement.click();
                let dialog: HTMLElement = document.getElementById(controlId + "_image");
                let urlInput: HTMLInputElement = dialog.querySelector(".e-input.e-img-link");
                urlInput.value = "http://www.google.com";
                let checkboxEle: HTMLInputElement = dialog.querySelector('.e-checkbox-wrapper label');
                checkboxEle.click();
                let insertButton: HTMLElement = dialog.querySelector('.e-update-link.e-primary');
                insertButton.click();
                let updateImage: HTMLImageElement = rteObj.element.querySelector("#image");
                expect(updateImage.parentElement.hasAttribute("target")).toBe(false);
                done();
            }, 100);
        });
        it(" Test - don't set the target as _blank while updating the image link with disable the new window option ", (done) => {
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            setTimeout(() => {
                let imageBtn: HTMLElement = document.getElementById(controlId + "_quick_InsertLink");
                imageBtn.parentElement.click();
                let dialog: HTMLElement = document.getElementById(controlId + "_image");
                let urlInput: HTMLInputElement = dialog.querySelector(".e-input.e-img-link");
                urlInput.value = "http://www.google.com";
                let insertButton: HTMLElement = dialog.querySelector('.e-update-link.e-primary');
                insertButton.click();
                let updateImage: HTMLImageElement = rteObj.element.querySelector("#image");
                expect(updateImage.parentElement.hasAttribute("target")).toBe(true);
                setCursorPoint(image, 0);
                dispatchEvent(image, 'mousedown');
                image.click();
                dispatchEvent(image, 'mouseup');
                setTimeout(() => {
                    let imageBtn: HTMLElement = document.getElementById(controlId + "_quick_EditImageLink");
                    imageBtn.parentElement.click();
                    let dialog: HTMLElement = document.getElementById(controlId + "_image");

                    let checkboxEle: HTMLInputElement = dialog.querySelector('.e-checkbox-wrapper label');
                    checkboxEle.click();
                    let insertButton: HTMLElement = dialog.querySelector('.e-update-link.e-primary');
                    insertButton.click();
                    let updateImage: HTMLImageElement = rteObj.element.querySelector("#image");
                    expect(updateImage.parentElement.hasAttribute("target")).toBe(false);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe(' EJ2-23213: Getting error while insert the image after applied the  lower case or  upper case commands in Html Editor  - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p id='insert-img'>RichTextEditor</p>`,
                toolbarSettings: {
                    items: [
                        'LowerCase', 'UpperCase', '|',
                        'Image']
                },
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(" Apply uppercase and then insert an image  ", (done) => {
            let pTag: HTMLElement = rteObj.element.querySelector('#insert-img') as HTMLElement;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pTag.childNodes[0], pTag.childNodes[0], 4, 6);
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UpperCase');
            item.click();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pTag.childNodes[0], pTag.childNodes[2], 1, 2);
            item = rteObj.element.querySelector('#' + controlId + '_toolbar_Image');
            item.click();
            setTimeout(() => {
                let dialogEle: any = rteObj.element.querySelector('.e-dialog');
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
                let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
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
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#img-container img');
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
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#img-container img');
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
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#img-container img');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
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
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#img-container img');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
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
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#img-container img');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 400);
        });
        it(" rightClick with `which` as '3' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#img-container img');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                done();
            }, 400);
        });
        it(" Android - 'leftClick' with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#img-container img');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" Android - 'rightClick' with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#img-container img');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('#img-container img'));
            rteObj.triggerEditArea(eventsArg);
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('#img-container img'));
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" Android - 'rightClick' with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = false;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('#img-container img');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" Android - 'leftClick' with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = true;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('#img-container img');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('#img-container img'));
            rteObj.triggerEditArea(eventsArg);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - 'leftClick' with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#img-container img');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, clientX: rteObj.clickPoints.clientX , clientY: rteObj.clickPoints.clientY };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - 'rightClick' with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('#img-container img');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3, clientX: rteObj.clickPoints.clientX , clientY: rteObj.clickPoints.clientY };
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('#img-container img'));
            rteObj.triggerEditArea(eventsArg);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - 'rightClick' with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = false;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('#img-container img');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, clientX: rteObj.clickPoints.clientX , clientY: rteObj.clickPoints.clientY };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - 'leftClick' with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<p id='img-container'>
                    <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>
                </p>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = true;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('#img-container img');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3, clientX: rteObj.clickPoints.clientX , clientY: rteObj.clickPoints.clientY };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('#img-container img'));
            rteObj.triggerEditArea(eventsArg);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
    });

    describe('Rename images in success event- ', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                imageUploadSuccess: function (args : any) {
                    args.file.name = 'rte_image';
                    var filename : any = document.querySelectorAll(".e-file-name")[0];
                    filename.innerHTML = args.file.name.replace(document.querySelectorAll(".e-file-type")[0].innerHTML, '');
                    filename.title = args.file.name;
                },
                insertImageSettings: {
                    saveUrl:"https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
                    path: "../Images/"
                }
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it('Check name after renamed', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[8] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect(document.querySelectorAll(".e-file-name")[0].innerHTML).toBe('rte_image');
                done();
            }, 4500);
        });
    });

    describe('Inserting Image as Base64 - ', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                insertImageSettings: {
                    saveFormat: "Base64"
                }
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the inserted image in the component ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[8] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            (document.querySelector('.e-insertImage') as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.getContent().querySelector(".e-rte-image.e-imginline").getAttribute("src").indexOf("blob") == -1).toBe(true);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).imageModule.deleteImg(evnArg);
                (<any>rteObj).imageModule.uploadObj.upload((<any>rteObj).imageModule.uploadObj.filesData[0]);
                done();
            }, 4000);
        });
    });

    describe('Inserting Image as Blob - ', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                insertImageSettings: {
                    saveFormat: "Blob"
                }
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the inserted image in the component ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[8] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            (document.querySelector('.e-insertImage') as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.getContent().querySelector(".e-rte-image.e-imginline").getAttribute("src").indexOf("base64") == -1).toBe(true);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).imageModule.deleteImg(evnArg);
                (<any>rteObj).imageModule.uploadObj.upload((<any>rteObj).imageModule.uploadObj.filesData[0]);
                done();
            }, 4000);
        });
    });
    
    describe('Insert image imageSelected, imageUploading and imageUploadSuccess event - ', () => {
        let rteObj: RichTextEditor;
        let imageSelectedSpy: jasmine.Spy = jasmine.createSpy('onImageSelected');
        let imageUploadingSpy: jasmine.Spy = jasmine.createSpy('onImageUploading');
        let imageUploadSuccessSpy: jasmine.Spy = jasmine.createSpy('onImageUploadSuccess');
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                imageSelected: imageSelectedSpy,
                imageUploading: imageUploadingSpy,
                imageUploadSuccess: imageUploadSuccessSpy,
                insertImageSettings: {
                    saveUrl:"https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
                    path: "../Images/"
                }
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the component insert image events - case 1 ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[8] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            expect(imageSelectedSpy).toHaveBeenCalled();
            expect(imageUploadingSpy).toHaveBeenCalled();
            setTimeout(() => {
                expect(imageUploadSuccessSpy).toHaveBeenCalled();
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).imageModule.deleteImg(evnArg);
                (<any>rteObj).imageModule.uploadObj.upload((<any>rteObj).imageModule.uploadObj.filesData[0]);
                done();
            }, 4000);
        });
    });

    describe('EJ2CORE-479 - Insert image imageSelected event args cancel true - ', () => {
        let rteObj: RichTextEditor;
        let isImageUploadSuccess: boolean = false;
        let isImageUploadFailed: boolean = false;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                imageSelected: imageSelectedEvent,
                imageUploadSuccess: imageUploadSuccessEvent,
                imageUploadFailed: imageUploadFailedEvent,
                insertImageSettings: {
                    saveUrl:"https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
                    path: "../Images/"
                }
            });
            function imageSelectedEvent(e: any) {
                e.cancel = true;
            }
            function imageUploadSuccessEvent(e: any) {
                isImageUploadSuccess = true;
            }
            function imageUploadFailedEvent(e: any) {
                isImageUploadFailed = true;
            }
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the component insert image events - case 1 ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[8] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect(isImageUploadSuccess).toBe(false);
                expect(isImageUploadFailed).toBe(false);
                done();
            }, 4000);
            
        });
    });

    describe('Insert image imageRemoving event - ', () => {
        let rteObj: RichTextEditor;
        let imageRemovingSpy: jasmine.Spy = jasmine.createSpy('onImageRemoving');
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                imageRemoving: imageRemovingSpy,
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the component insert image events - case 2 ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[8] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            (<any>rteObj).imageModule.uploadUrl = { url: "" };
            (document.querySelector('.e-icons.e-file-remove-btn') as HTMLElement).click();
            expect(imageRemovingSpy).toHaveBeenCalled();
            setTimeout(() => {
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).imageModule.deleteImg(evnArg);
                (<any>rteObj).imageModule.uploadObj.upload((<any>rteObj).imageModule.uploadObj.filesData[0]);
                done();
            }, 4000);
        });
    });

    describe('Insert image imageUploadFailed event - ', () => {
        let rteObj: RichTextEditor;
        let imageUploadFailedSpy: jasmine.Spy = jasmine.createSpy('onImageUploadFailed');
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                imageUploadFailed: imageUploadFailedSpy,
                insertImageSettings: {
                    saveUrl:"uploadbox/Save",
                    path: "../Images/"
                }
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the component insert image events - case 3 ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[8] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect(imageUploadFailedSpy).toHaveBeenCalled();
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).imageModule.deleteImg(evnArg);
                (<any>rteObj).imageModule.uploadObj.upload((<any>rteObj).imageModule.uploadObj.filesData[0]);
                done();
            }, 4000);
        });
    });

    describe('Testing allowed extension in image upload - ', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                insertImageSettings: {
                    allowedTypes: ['.png'],
                    saveUrl:"uploadbox/Save",
                    path: "../Images/"
                }
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Test the component insert image with allowedExtension property', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[8] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            let fileObj: File = new File(["Nice One"], "sample.jpg", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect((dialogEle.querySelector('.e-insertImage') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).imageModule.deleteImg(evnArg);
                (<any>rteObj).imageModule.uploadObj.upload((<any>rteObj).imageModule.uploadObj.filesData[0]);
                done();
            }, 4000);
        });
    });

    describe(' Caption image with link insert testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: false },
                value: "<p>Test</p><img id='rteImg' src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style='width:300px; height: 200px'/>"
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' insert/remove link', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            dispatchEvent((rteObj.element.querySelector('#rteImg') as HTMLElement), 'mouseup');
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('#rteImg'));
            setTimeout(() => {
                (document.querySelectorAll('.e-rte-image-popup .e-toolbar-item button')[2] as HTMLElement).click();
                rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('#rteImg'));
                dispatchEvent((rteObj.element.querySelector('#rteImg') as HTMLElement), 'mouseup');
                setTimeout(() => {
                    (document.querySelectorAll('.e-rte-image-popup .e-toolbar-item button')[4] as HTMLElement).click();
                    (document.querySelector('.e-img-link') as HTMLInputElement).value = 'https://www.google.com';
                    (document.querySelector('.e-update-link') as HTMLElement).click();
                    let imgEle: Element = document.querySelector('#rteImg');
                    expect(imgEle.parentElement.nodeName).toBe('A');
                    expect(imgEle.parentElement.parentElement.classList.contains('e-img-wrap')).toBe(true);
                    expect(imgEle.parentElement.parentElement.parentElement.classList.contains('e-img-caption')).toBe(true);
                    expect(document.querySelector('.e-content').childNodes.item(0).nodeName).toBe('P');
                    expect(document.querySelector('.e-content').childNodes.item(1).nodeName).toBe('P');
                    expect(document.querySelector('.e-content').childNodes[1].childNodes[0].nodeName).toBe('SPAN');
                    expect((document.querySelector('.e-content').childNodes[1].childNodes[0] as Element).classList.contains('e-img-caption')).toBe(true);
                    dispatchEvent((rteObj.element.querySelector('#rteImg') as HTMLElement), 'mouseup');
                    setTimeout(() => {
                        (document.querySelectorAll('.e-rte-image-popup .e-toolbar-item button')[7] as HTMLElement).click();
                        let imgEle: Element = document.querySelector('#rteImg');
                        expect(imgEle.parentElement.nodeName).not.toBe('A');
                        expect(imgEle.parentElement.classList.contains('e-img-wrap')).toBe(true);
                        expect(imgEle.parentElement.parentElement.classList.contains('e-img-caption')).toBe(true);
                        expect(document.querySelector('.e-content').childNodes.item(0).nodeName).toBe('P');
                        expect(document.querySelector('.e-content').childNodes.item(1).nodeName).toBe('P');
                        expect(document.querySelector('.e-content').childNodes[1].childNodes[0].nodeName).toBe('SPAN');
                        expect((document.querySelector('.e-content').childNodes[1].childNodes[0] as Element).classList.contains('e-img-caption')).toBe(true);
                        done();
                    }, 400);
                }, 400);
            }, 400);
        });
    });
    describe(' EJ2-28120: IFrame - Images were not replaced when using caption to the image ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image']
                },
                iframeSettings: {
                    enable: true
                }
            });
            controlId = rteObj.element.id;
            done();
        });
        afterAll((done: Function) => {
            setTimeout(() => {
                destroy(rteObj);
                done();
            }, 2000);
        });
        it(" insert image & caption", (done: Function) => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Image');
            item.click();
            setTimeout(() => {
                let iframeBody: HTMLElement = (document.querySelector('iframe') as HTMLIFrameElement).contentWindow.document.body as HTMLElement;
                let dialogEle: any = rteObj.element.querySelector('.e-dialog');
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
                let trg = (iframeBody.querySelector('.e-rte-image') as HTMLElement);
                expect(!isNullOrUndefined(trg)).toBe(true);
                expect(iframeBody.querySelectorAll('img').length).toBe(1);
                expect((iframeBody.querySelector('img') as HTMLImageElement).src).toBe('https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png');
                (iframeBody.querySelector('img') as HTMLImageElement).style.width = '100px';
                (iframeBody.querySelector('img') as HTMLImageElement).style.height = '100px';
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
                dispatchEvent((iframeBody.querySelector('img') as HTMLElement), 'mouseup');
                setTimeout(() => {
                    (document.querySelectorAll('.e-rte-image-popup .e-toolbar-item button')[2] as HTMLElement).click();
                    expect(!isNullOrUndefined(iframeBody.querySelector('.e-img-caption'))).toBe(true);
                    (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                    dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
                    dispatchEvent((iframeBody.querySelector('img') as HTMLElement), 'mouseup');
                    setTimeout(() => {
                        (document.querySelectorAll('.e-rte-image-popup .e-toolbar-item button')[0] as HTMLElement).click();
                        dialogEle = rteObj.element.querySelector('.e-dialog');
                        (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png';
                        (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                        expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                        (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
                        expect((iframeBody.querySelector('img') as HTMLImageElement).src).toBe('https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png');
                        done();  
                    }, 400);
                }, 400);
            }, 100);
        });
    });
    describe('RTE Drag and Drop Image', () => {
        let rteObj: RichTextEditor;
        let ele: HTMLElement;
        let element: HTMLElement;
        let actionCompleteContent: boolean = false;
        beforeAll((done: Function) => {
            element = createElement('form', {
                id: "form-element", innerHTML:
                    ` <div class="form-group">
                        <textarea id="defaultRTE" name="defaultRTE" required maxlength="100" minlength="20" data-msg-containerid="dateError">
                        </textarea>
                        <div id="dateError"></div>
                    </div>
                    ` });
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                insertImageSettings: {
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                },
                value: `<div><p>First p node-0</p></div>`,
                placeholder: 'Type something',
                actionComplete: actionCompleteFun
            });
            function actionCompleteFun(args: any): void {
                actionCompleteContent = true;
            }
            rteObj.appendTo('#defaultRTE');
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            detach(element);
            detach(document.querySelector('.e-imginline'))
            done();
        });
        it(" Check image after drop", function (done: Function) {
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            let event: any = { clientX: 40, clientY: 294, target: rteObj.contentModule.getEditPanel(), dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            (rteObj.imageModule as any).getDropRange(event.clientX, event.clientY);
            (rteObj.imageModule as any).dragDrop(event);
            ele = rteObj.element.getElementsByTagName('img')[0];
            setTimeout(() => {
                expect(rteObj.element.getElementsByTagName('img').length).toBe(1);
                expect(ele.classList.contains('e-rte-image')).toBe(true);
                expect(ele.classList.contains('e-imginline')).toBe(true);
                expect(ele.classList.contains('e-resize')).toBe(true);
                done();
            }, 2000);
           
        });
        it(" Check dragstart Event", function (done: Function) {
            let image: HTMLElement = createElement("img");
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            let event: any = { clientX: 40, clientY: 294, target: image , dataTransfer: { files: [fileObj] , dropEffect : '', effectAllowed : '' }, preventDefault: function () { return; } };
             (rteObj.imageModule as any).dragStart(event);
             setTimeout(() => {
                expect(image.classList.contains('e-rte-drag-image')).toBe(true);
                (rteObj.imageModule as any).dragOver(event);
                (rteObj.imageModule as any).dragEnter(event);
                done();
             }, 2000);
          
        });
        it(" Check insertDragImage method -External image", function () {
            let popupEle: HTMLElement = createElement("div");
            popupEle.classList.add('e-popup-open');
            rteObj.element.appendChild(popupEle);
            rteObj.insertImageSettings.saveUrl = null;
            rteObj.dataBind();
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            let event: any = { clientX: 40, clientY: 294, dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            detach(document.getElementsByTagName('IMG')[0]);
            (rteObj.imageModule as any).insertDragImage(event);
        });
        it(" Check insertDragImage method -Internal image", function () {
            let image: HTMLElement = createElement("IMG");
            image.classList.add('e-rte-drag-image');
            image.setAttribute('src', 'https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');
            rteObj.inputElement.appendChild(image);
            let event: any = { clientX: 40, clientY: 294, dataTransfer: { files: [] }, preventDefault: function () { return; } };
            (rteObj.imageModule as any).insertDragImage(event);
        });
        it(" Check uploadSuccess method", function (done: Function) {
            let image: HTMLElement = createElement("IMG");
            image.classList.add('upload-image');
            var popupEle = createElement('div', { className: 'e-rte-pop e-popup-open' });
            rteObj.inputElement.appendChild(popupEle);
            rteObj.inputElement.appendChild(image);
            let event: any = { clientX: 40, clientY: 294, dataTransfer: { files: [] }, preventDefault: function () { return; } };
            rteObj.notify('drop', { args: event });
            var args = { args: event, type: 'Images', isNotify: (undefined as any), elements: image };
            (rteObj.imageModule as any).uploadSuccess(image, event, args , {});
            setTimeout(() => {
                expect(document.querySelector('.e-rte-pop.e-popup-open')).not.toBe(null);
                expect(image.classList.contains('e-img-focus')).toBe(true);
                done(); 
            }, 2000);
       });
    });

    describe('RTE Drag and Drop Image - Failure Test Case', () => {
        let rteObj: RichTextEditor;
        let ele: HTMLElement;
        let element: HTMLElement;
        beforeAll((done: Function) => {
            element = createElement('form', {
                id: "form-element", innerHTML:
                    ` <div class="form-group">
                        <textarea id="defaultRTE" name="defaultRTE" required maxlength="100" minlength="20" data-msg-containerid="dateError">
                        </textarea>
                        <div id="dateError"></div>
                    </div>
                    ` });
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                insertImageSettings: {
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                },
                value: `<div><p>First p node-0</p></div>`,
                placeholder: 'Type something'
            });
            rteObj.appendTo('#defaultRTE');
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            detach(element);
            detach(document.querySelector('.e-imginline'))
            done();
        });
       it(" Check image after drop", function (done: Function) {
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            let event: any = { clientX: 40, clientY: 294, target: rteObj.contentModule.getEditPanel(), dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            (rteObj.imageModule as any).getDropRange(event.clientX, event.clientY);
            (rteObj.imageModule as any).dragDrop(event);
            ele = rteObj.element.getElementsByTagName('img')[0];
            setTimeout(() => {
                expect(rteObj.element.getElementsByTagName('img').length).toBe(1);
                expect(ele.classList.contains('e-rte-image')).toBe(true);
                expect(ele.classList.contains('e-imginline')).toBe(true);
                expect(ele.classList.contains('e-resize')).toBe(true);
                expect(document.getElementsByClassName("e-upload-files").length).toBe(0);
                done();
            }, 2000);
        
        });
       it(" Check uploadFailure method", function (done: Function) {
            let image: HTMLElement = createElement("IMG");
            image.classList.add('upload-image');
            var popupEle = createElement('div', { className: 'e-rte-pop e-popup-open' });
            rteObj.inputElement.appendChild(popupEle);
            rteObj.inputElement.appendChild(image);
            let event: any = { clientX: 40, clientY: 294, dataTransfer: { files: [] }, preventDefault: function () { return; } };
            var args = { args: event, type: 'Images', isNotify: (undefined as any), elements: image };
            (rteObj.imageModule as any).uploadFailure(image,args);
            setTimeout(() => {
                expect(document.querySelector('.e-upload-image')).toBe(null);
                done();
            }, 2000);
        });
    });
    describe('Drag and Drop - Text', () => {
        let rteObj: RichTextEditor;
        let element: HTMLElement;
        beforeAll((done: Function) => {
            element = createElement('form', {
                id: "form-element",
                innerHTML: " <div class=\"form-group\">\n                        <textarea id=\"defaultRTE\" name=\"defaultRTE\" required maxlength=\"100\" minlength=\"20\" data-msg-containerid=\"dateError\">\n                        </textarea>\n                        <div id=\"dateError\"></div>\n                    </div>\n                    "
            });
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                value: "<div><p>First p node-0</p></div>",
            });
            rteObj.appendTo('#defaultRTE');
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            detach(element);
            done();
        });
        it("dragStart event", (done: Function) => {
            var event = { clientX: 40, clientY: 294, target: rteObj.contentModule.getEditPanel(), preventDefault: function() { return; } };
            let result : any = (rteObj.imageModule as any).dragStart(event);
            setTimeout(function() {
                expect(result).toBe(true);
                done();
            }, 200);
        });
    });
    describe('check resize icons - When readonly property enabled', () => {
        let rteObj: RichTextEditor;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
               value: '<p>rich text <img alt="image.jpg" class="e-resize" style="">editor</p>',
               readonly : true
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it('Check icons and quicktoolbar', (done) => {
            let img : HTMLElement = rteObj.element.querySelector('img');
            img.click();
            setTimeout(() => {
                expect(rteObj.element.querySelectorAll('.e-img-resize').length).toBe(0);
                expect(rteObj.element.querySelectorAll('.e-rte-quick-toolbar').length).toBe(0);
                done(); 
            }, 100);
        });
    });
    describe('EJ2-40774 - Deleting the image using context menu doesn’t remove the resize and borders of the image', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
               value: '<p>rich text <img alt="image.jpg" class="e-resize" style="">editor</p>'
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('Resize element availability check', (done) => {
            dispatchEvent((rteObj.element.querySelector('img') as HTMLElement), 'mousedown');
            setTimeout(() => {
                expect(rteObj.element.querySelectorAll('.e-img-resize').length).toBe(1);
                done();
            }, 100);
        });
        it('Cut with resize element availability check', (done) => {
            (rteObj.imageModule as any).onCutHandler();
            setTimeout(() => {
                expect(rteObj.element.querySelectorAll('.e-img-resize').length).toBe(0);
                done();
            }, 100);
        });
    });

    describe('RTE Drag and Drop Image with paste restrictions', () => {
        let rteObj: RichTextEditor;
        let ele: HTMLElement;
        let element: HTMLElement;
        let imgSize: number;
        let size: number;
        let sizeInBytes: number;
        beforeAll((done: Function) => {
            element = createElement('form', {
                id: "form-element", innerHTML:
                    ` <div class="form-group">
                        <textarea id="defaultRTE" name="defaultRTE" required maxlength="100" minlength="20" data-msg-containerid="dateError">
                        </textarea>
                        <div id="dateError"></div>
                    </div>
                    ` });
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                insertImageSettings: {
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                },
                value: `<div><p>First p node-0</p></div>`,
                placeholder: 'Type something',
                imageUploading: function (args) {
                    expect(rteObj.toolbarModule.baseToolbar.toolbarObj.element.classList.contains('e-overlay')).toBe(true);
                    imgSize = size;
                    sizeInBytes = args.fileData.size;
                    if ( imgSize < sizeInBytes ) {
                        args.cancel = true;
                    }
                }
            });
            rteObj.appendTo('#defaultRTE');
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            detach(element);
            detach(document.querySelector('.e-imginline'))
            done();
        });
        it(" Check image after drop", function (done: Function) {
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            let event: any = { clientX: 40, clientY: 294, target: rteObj.contentModule.getEditPanel(), dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            (rteObj.imageModule as any).getDropRange(event.clientX, event.clientY);
            (rteObj.imageModule as any).dragDrop(event);
            ele = rteObj.element.getElementsByTagName('img')[0];
            setTimeout(() => {
                expect(rteObj.element.getElementsByTagName('img').length).toBe(1);
                expect(ele.classList.contains('e-rte-image')).toBe(true);
                expect(ele.classList.contains('e-imginline')).toBe(true);
                expect(ele.classList.contains('e-resize')).toBe(true);
                done();
            }, 2000);
           
        });
        it(" Check image being removed with args.cancel as true", function (done: Function) {
            size = 7;
            let image: HTMLElement = createElement("IMG");
            image.classList.add('upload-image');
            var popupEle = createElement('div', { className: 'e-rte-pop e-popup-open' });
            rteObj.inputElement.appendChild(popupEle);
            rteObj.inputElement.appendChild(image);
            let event: any = { clientX: 40, clientY: 294, dataTransfer: { files: [] }, preventDefault: function () { return; } };
            rteObj.notify('drop', { args: event });
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (rteObj.imageModule as any).uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect((rteObj.inputElement.querySelectorAll("img")[0] as HTMLImageElement).classList.contains('e-rte-image')).toBe(false);
                done(); 
            }, 50);
       });
    });

    describe('EJ2-39317 - beforeImageUpload event - ', () => {
        let rteObj: RichTextEditor;
        let beforeImageUploadSpy: jasmine.Spy = jasmine.createSpy('onBeforeImageUpload');
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                beforeImageUpload: beforeImageUploadSpy,
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
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[8] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            expect(beforeImageUploadSpy).toHaveBeenCalled();
            done();
        });
    });

    describe('BLAZ-5933 - Images change aspect ratio when resized to smallest possible and back larger again - ', () => {
        let rteObj: RichTextEditor;
        let clickEvent: MouseEvent;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: '<p><img id="rteImageID" style="width: 300px; height: 300px; transform: rotate(0deg);" alt="Logo" src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize"></p>'
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it(' Resizing with offsetHeight test ', (done: Function) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let trg = (rteEle.querySelector('#rteImageID') as HTMLElement);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            trg.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            let imgHeight: number = trg.offsetHeight;
            (rteObj.imageModule as any).resizing({ target: document.body, pageX: 200 });
            expect(imgHeight < document.querySelector('img').offsetHeight).toBe(true);
            done();
        });
    });
    describe('EJ2-44372 - BeforeDialogOpen eventArgs args.cancel is not working properly', () => {
        let rteObj: RichTextEditor;
        let count: number = 0;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image'],
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
    describe('EJ2-48903 - BeforeDialogOpen event is not called for second time', () => {
        let rteObj: RichTextEditor;
        let count: number = 0;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image']
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
                (rteObj.element.querySelectorAll('.e-toolbar-item')[0].querySelector('button') as HTMLElement).click();
                setTimeout(() => {
                    expect(count).toBe(2);
                    done();
                }, 100);   
            }, 100);
        });
    });
    describe('EJ2CORE-480 - Provide event to restrict the image insertion when drag and drop', () => {
        let rteObj: RichTextEditor;
        let ele: HTMLElement;
        let element: HTMLElement;
        beforeAll((done: Function) => {
            element = createElement('form', {
                id: "form-element", innerHTML:
                    ` <div class="form-group">
                        <textarea id="defaultRTE" name="defaultRTE" required maxlength="100" minlength="20" data-msg-containerid="dateError">
                        </textarea>
                        <div id="dateError"></div>
                    </div>
                    ` });
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                insertImageSettings: {
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                },
                value: `<div><p>First p node-0</p></div>`,
                placeholder: 'Type something',
                beforeImageDrop: beforeImageDropFunc
            });
            function beforeImageDropFunc(args: any): void {
                args.cancel = true;
            }
            rteObj.appendTo('#defaultRTE');
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            detach(element);
            detach(document.querySelector('.e-imginline'))
            done();
        });
        it(" imageDrop event args.cancel as `true` check", function () {
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            let event: any = { clientX: 40, clientY: 294, target: rteObj.contentModule.getEditPanel(), dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            (rteObj.imageModule as any).getDropRange(event.clientX, event.clientY);
            (rteObj.imageModule as any).dragDrop(event);
            ele = rteObj.element.getElementsByTagName('img')[0];
            expect(rteObj.element.getElementsByTagName('img').length).toBe(0);
        });
    });
    describe('BLAZ-9502 - Image outline style is not removed properly, while focus other content or image', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image'],
                },
                value: '<p>Sample Text</p> <img alt="Logo" src="https://blazor.syncfusion.com/demos/images/rich-text-editor/rte-image-feather.png" style="width: 300px" /> <img alt="Logo" src="https://blazor.syncfusion.com/demos/images/toast/map.png" style="width: 300px" />'
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('first image click with focus testing', (done) => {
            dispatchEvent(rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                done();
            }, 500);
        });
        it('second image click with focus testing', (done) => {
            dispatchEvent(rteObj.element.querySelectorAll('.e-content img')[1] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
                expect((rteObj.element.querySelectorAll('.e-content img')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                done();
            }, 500);
        });
        it('first image click after p click with focus testing', (done) => {
            dispatchEvent(rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                dispatchEvent(rteObj.element.querySelector('.e-content p') as HTMLElement, 'mousedown');
                setTimeout(() => {
                    expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
                    done();
                }, 500);
            }, 500);
        });
        it('second image click after p click with focus testing', (done) => {
            dispatchEvent(rteObj.element.querySelectorAll('.e-content img')[1] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content img')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                dispatchEvent(rteObj.element.querySelector('.e-content p') as HTMLElement, 'mousedown');
                setTimeout(() => {
                    expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
                    expect((rteObj.element.querySelectorAll('.e-content img')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
                    done();
                }, 500);
            }, 500);
        });
    });
    describe('BLAZ-9502 - Image focus not working after outside click then again click a image', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image'],
                },
                value: '<p>Sample Text</p> <img alt="Logo" src="https://blazor.syncfusion.com/demos/images/rich-text-editor/rte-image-feather.png" style="width: 300px" /> <img alt="Logo" src="https://blazor.syncfusion.com/demos/images/toast/map.png" style="width: 300px" />'
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('image click with focus testing', (done) => {
            dispatchEvent(rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                done();
            }, 500);
        });
        it('outside click with focus', (done) => {
            dispatchEvent(document.body, 'mousedown');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
                done();
            }, 500);
        });
        it('Again image click with focus testing', (done) => {
            dispatchEvent(rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                done();
            }, 500);
        });
    });
    describe('EJ2-46971- Resize icon of the image is not positioned properly, when height is set to the Rich Text Editor', () => {
        let rteObj: any;
        let Imagepos: any;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image'],
                },
                value: '<p>Rich Text Editor allows to insert images from online source as well as local computer where you want to insert the image in your' +
                'content.</p> <p><b>Get started Quick Toolbar to click on the image</b></p><p>It is possible to add custom style on the selected image inside the' +
                'Rich Text Editor through quick toolbar. </p> <p>It is possible to add custom style on the selected image inside the Rich Text Editor through quick toolbar.' +
                '</p> <p>It is possible to add custom style on the selected image inside the Rich Text Editor through quick toolbar. </p>' +
                '<p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p><p>It is possible to add custom style on the selected image inside the' +
                'Rich Text Editor through quick toolbar.<p>It is possible to add custom style on the selected image inside the' +
                'Rich Text Editor through quick toolbar.</p><p>It is possible to add custom style on the selected image inside the Rich Text Editor through quick toolbar.</p>' +
                '<p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p><p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p>' +
                '<p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p><p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p>' +
                '<p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p><p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p>' +
                '<p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p><p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p>' +
                '<p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p><p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p>' +
                '<p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p><p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p>' +
                '<p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p><p>It is possible to add custom style on the selected image inside theRich Text Editor through quick toolbar.</p>' + 
                '<img _ngcontent-knh-c4="" alt="Tiny_Image.PNG" class="e-rte-image e-imgcenter e-resize e-rte-drag-image e-imginline" height="77" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6hN7we0H3G7EKNkbPvZOioGzcm5nR46b63w&amp;usqp=CAU"' +
                'style="min-width: 0px; max-width: 940px; min-height: 0px;" width="154"/>'
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('image click with focus testing before being resized', (done) => {
            dispatchEvent(rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement, 'mousedown');
            rteObj.resizeHandler();
            expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
            expect((rteObj.element.querySelector('.e-img-resize') as HTMLElement)).toBe(null);
            done();
        });
        it('image click with focus testing after being resized', (done) => {
            rteObj.resizeHandler();
            dispatchEvent(rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement, 'mousedown');
            expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
            expect((rteObj.element.querySelector('.e-img-resize') as HTMLElement)).not.toBe(null);
            done();
        });
    });
    describe('Checking Image replace, using the Image dialog', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image']
                },
                value: "<img src='https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png'>"
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('image dialog', (done) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            (<any>rteObj).imageModule.uploadObj.upload((<any>rteObj).imageModule.uploadObj.filesData[0]);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();                
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('img')).not.toBe(null);    
            done();
        });
    });
    describe('EJ2-49981 - ShowDialog, CloseDialog method testing', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({ });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('beforeDialogOpen event trigger testing', (done) => {
            rteObj.showDialog(DialogType.InsertImage);
            setTimeout(() => {
                expect(document.body.querySelectorAll('.e-rte-img-dialog.e-dialog').length).toBe(1);
                rteObj.closeDialog(DialogType.InsertImage);
                setTimeout(() => {
                    expect(document.body.querySelectorAll('.e-rte-img-dialog.e-dialog').length).toBe(0);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe('EJ2-58062 - RTE Drag and Drop Image', () => {
        let rteObj: RichTextEditor;
        let ele: HTMLElement;
        let element: HTMLElement;
        let actionCompleteContent: boolean = false;
        beforeAll((done: Function) => {
            element = createElement('form', {
                id: "form-element", innerHTML:
                    ` <div class="form-group">
                        <textarea id="defaultRTE" name="defaultRTE" required maxlength="100" minlength="20" data-msg-containerid="dateError">
                        </textarea>
                        <div id="dateError"></div>
                    </div>
                    ` });
            document.body.appendChild(element);
            rteObj = new RichTextEditor({
                insertImageSettings: {
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                },
                value: `<div><p>First p node-0</p></div>`,
                placeholder: 'Type something',
                actionComplete: actionCompleteFun
            });
            function actionCompleteFun(args: any): void {
                actionCompleteContent = true;
            }
            rteObj.appendTo('#defaultRTE');
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            detach(element);
            detach(document.querySelector('.e-imginline'))
            done();
        });
        it("EJ2-58062 - Check insertDragImage -Internal image when File data is returned", function () {
            let image: HTMLElement = createElement("IMG");
            image.classList.add('e-rte-drag-image');
            image.setAttribute('src', 'https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            rteObj.inputElement.appendChild(image);
            let event: any = { clientX: 40, clientY: 294, dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            rteObj.focusIn();
            (rteObj.imageModule as any).insertDragImage(event);
            expect(rteObj.inputElement.querySelectorAll('img').length === 1).toBe(true);
            detach(document.getElementsByTagName('IMG')[0]);
        });
    });

    describe('EJ2-59978 - Insert image after Max char count - Image Module', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p class="focusNode">RTE Content with RTE</p>',
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                maxLength: 20,
                showCharCount: true
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Insert image after Max char count', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args: any = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') }
            };
            let focusNode: any = rteObj.inputElement.childNodes[0].childNodes[0];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), focusNode, focusNode, 0, 0);
            let range: any = new NodeSelection().getRange(document);
            let save: any = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).imageModule, selection: save, selectNode: [''], link: null, target: '' };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            expect(rteObj.inputElement.innerHTML === `<p class="focusNode">RTE Content with RTE</p>`).toBe(true);
        });
    });

    describe('EJ2-58542: Memory leak issue with Rich Text Editor component ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>Memory leak testing</p>'
            });
        });
        it('When OffsetParent is null', (done: Function) => {
            (rteObj as any).element.style.display = 'none';
            (rteObj as any).destroy();
            expect(((rteObj as any).imageModule as any).parent).toBe(null);
            rteObj.element.style.display = 'block';
            done();
        });
        afterAll(() => {
            detach(rteObj.element);
            let allDropDownPopups: NodeListOf<Element> = document.querySelectorAll('.e-dropdown-popup');
            for(let i: number = 0; i < allDropDownPopups.length; i++) {
                detach(allDropDownPopups[i]);
            }
        });
    });

    describe( "BLAZ-25362: In RTE image the image border and resize icons are unevenly aligned", () => {
        let rteObj: RichTextEditor;
        beforeAll( () => {
            rteObj = renderRTE( {
                value: `<p>Rich Text Editor allows inserting images from online sources as well as the local computers where you want to insert the image in your content.</p>
                        <img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;"/>`
                , toolbarSettings: {
                    items: [ 'Image' ]
                }
            } )
        } );
        afterAll( () => {
            destroy( rteObj );
        } );
        it( ( "checking left top posistion and alignment of the resize icon" ), (done: Function) => {
            let imgElem: HTMLElement = rteObj.element.querySelector( '.e-rte-image' );
            setTimeout( () => {
                dispatchEvent( imgElem, 'mousedown' );
                expect( ( rteObj.element.querySelector( '.e-rte-topLeft' ) as HTMLElement ).style.left ).toEqual( '-6px' );
                expect( ( rteObj.element.querySelector( '.e-rte-topLeft' ) as HTMLElement ).style.top ).toEqual( '120px' );
                expect( ( rteObj.element.querySelector( '.e-rte-topRight' ) as HTMLElement ).style.left ).toEqual( '296px' );
                expect( ( rteObj.element.querySelector( '.e-rte-topRight' ) as HTMLElement ).style.top ).toEqual( '120px' );
                expect( ( rteObj.element.querySelector( '.e-rte-botLeft' ) as HTMLElement ).style.left ).toEqual( '-6px' );
                expect( ( rteObj.element.querySelector( '.e-rte-botLeft' ) as HTMLElement ).style.top ).toEqual( '320px' );
                expect( ( rteObj.element.querySelector( '.e-rte-botRight' ) as HTMLElement ).style.left ).toEqual( '296px' );
                expect( ( rteObj.element.querySelector( '.e-rte-botRight' ) as HTMLElement ).style.top ).toEqual( '320px' );
                done();
            }, 1000);
        } );
    } );

    describe('EJ2-66350: DisplayLayout option checking in image quicktoolbar', () => {
        let rteObj: any;
        let QTBarModule: IRenderer;
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
        it("DisplayLayout option checking in image quicktoolbar", () => {
            let target: HTMLElement = rteEle.querySelector('#imgTag');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            (<any>QTBarModule).renderQuickToolbars();
            QTBarModule.imageQTBar.showPopup(10, 131, (rteObj.element.querySelector('.e-rte-image') as HTMLElement));
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
            let imgPop: HTMLElement = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            expect(imgPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>document.querySelectorAll(".e-rte-dropdown-btn")[1]).click();
            expect(document.querySelectorAll('li')[0].innerHTML === "Inline");
            expect(document.querySelectorAll('li')[1].innerHTML === "Break");
        });
    });
    describe('EJ2-53661- Image is not deleted when press backspace and delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
        let innerHTML1: string = `testing
        <span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize" style=""><span class="e-img-inner" contenteditable="true">image caption</span></span></span>testing`;
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

        it('Image delete action checking using backspace key', (done: Function) => {
            let node: any = (rteObj as any).inputElement.childNodes[0].lastChild;
            setCursorPoint(node, 0);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-img-caption')).toBe(null);
            keyBoardEvent.keyCode = 90;
            (rteObj as any).keyDown(keyBoardEvent);
            done();
        });
    });
    describe('836851 - check the image quick toolbar hide, while click the enterkey ', () => {
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
        let innerHTML1: string = ` 
            <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/>
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

        it('check the image quick toolbar hide, while click the enterkey', (done: Function) => {
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
            (<any>rteObj).keyDown(keyBoardEvent);
            expect(document.querySelector('.e-rte-quick-popup')).toBe(null);
            done();
        });
    });
    describe('836851 - Remove the image using image quick toolbar ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: {removeUrl:"https://ej2.syncfusion.com/services/api/uploadbox/Remove"},
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('Remove the image using  image quick toolbar ', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-image');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({args:clickEvent});
            expect(!isNullOrUndefined(document.querySelector('.e-rte-image')as HTMLElement)).toBe(true);
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup')as HTMLElement)).toBe(true);
            let imageQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            (imageQTBarEle.querySelector("[title='Remove']")as HTMLElement).click();
            expect(isNullOrUndefined(document.querySelector('.e-rte-image')as HTMLElement)).toBe(true);
            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup')as HTMLElement)).toBe(true);
            done();
        });
    });
    describe('836851 - iOS device interaction', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/>`;
        beforeAll(() => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: {removeUrl:"https://ej2.syncfusion.com/services/api/uploadbox/Remove"},
                value: innerHTML,
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = currentBrowserUA;
            destroy(rteObj);
        });
        it('Remove the image using quick toolbar ', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-image');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({args:clickEvent});
            expect(!isNullOrUndefined(document.querySelector('.e-rte-image')as HTMLElement)).toBe(true);
            expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup')as HTMLElement)).toBe(true);
            let imageQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            (imageQTBarEle.querySelector("[title='Remove']")as HTMLElement).click();
            expect(isNullOrUndefined(document.querySelector('.e-rte-image')as HTMLElement)).toBe(true);
            expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup')as HTMLElement)).toBe(true);
            done();
        });
    });
    describe('836851 - Insert image', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IRenderer;
        var innerHTML: string = "<p>Testing</p>";
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element;
            QTBarModule = getQTBarModule(rteObj);
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Close the dialog while image insert', (done: Function) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.imageModule);
            (<any>rteObj).imageModule.uploadUrl = { url: "https://www.w3schools.com/html/mov_bbb.mp4" };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (<any>rteObj).imageModule.onIframeMouseDown();
            expect(!isNullOrUndefined(document.querySelector('.e-insertImage.e-primary') as HTMLElement)).toBe(false);
            done();
        });
    });

   describe('EJ2-845426: Undo does not works properly after replace the image', () => {
        let rteObj: any;
        let QTBarModule: IRenderer;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Undo','Redo','Image', 'Bold']
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
        it("Check undo action after replace the image.", () => {
            let target: HTMLElement = rteEle.querySelector('#imgTag');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            (<any>QTBarModule).renderQuickToolbars();
            QTBarModule.imageQTBar.showPopup(10, 131, (rteObj.element.querySelector('.e-rte-image') as HTMLElement));
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
            let imgPop: HTMLElement = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            expect(imgPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>document.querySelectorAll("[title='Replace']")[0]).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (dialogEle.querySelector('.e-insertImage') as HTMLElement).click();
            (document.querySelector('[title="Undo (Ctrl+Z)"]') as HTMLElement).click();
            expect(rteEle.querySelector('img').src == "http://cdn.syncfusion.com/content/images/sales/buynow/Character-opt.png").toBe(true)
        });
    });
    describe('EJ2-845426: Undo does not works properly after replace the image', () => {
        let rteObj: any;
        let QTBarModule: IRenderer;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Undo','Redo','Image', 'Bold']
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
        it("Check undo action after replace the image.", () => {
            let target: HTMLElement = rteEle.querySelector('#imgTag');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            (<any>QTBarModule).renderQuickToolbars();
            QTBarModule.imageQTBar.showPopup(10, 131, (rteObj.element.querySelector('.e-rte-image') as HTMLElement));
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
            let imgPop: HTMLElement = <HTMLElement>document.querySelector('.e-rte-quick-popup');
            expect(imgPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            (<HTMLElement>document.querySelectorAll("[title='Replace']")[0]).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (dialogEle.querySelector('.e-insertImage') as HTMLElement).click();
            (document.querySelector('[title="Undo (Ctrl+Z)"]') as HTMLElement).click();
            expect(rteEle.querySelector('img').src == "http://cdn.syncfusion.com/content/images/sales/buynow/Character-opt.png").toBe(true)
        });
    });
    describe('850205 - Editor content get hidden while try to resize the image.', function () {
        let rteObj: RichTextEditor;
        let clickEvent: any;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                width: 500,
                toolbarSettings: {
                    items: ['FormatPainter', 'Bold', 'Italic', 'Underline', 'StrikeThrough',
                        'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
                        'LowerCase', 'UpperCase', 'SuperScript', 'SubScript', 'EmojiPicker', '|',
                        'Formats', 'Alignments', 'NumberFormatList', 'BulletFormatList',
                        'Outdent', 'Indent', '|', 'CreateTable', 'CreateLink', 'Image', 'Audio', 'Video', 'FileManager', '|', 'ClearFormat', 'Print',
                        'SourceCode', 'FullScreen', '|', 'Undo', 'Redo'
                    ]
                },
                value: `<p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in the
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p><b>Functional
                Specifications/Requirements:</b></p>
                <ol><li><p>Provide
                the tool bar support, it’s also customizable.</p></li><li><p>Options
                to get the HTML elements with styles.</p></li><li><p>Support
                to insert image from a defined path.</p></li><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                the editor support.</p></li><li><p>Provide
                efficient public methods and client side events.</p></li><li><p>Keyboard
                navigation support.</p></li></ol>
                <p><b>Description:</b></p>
                <p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p>
                <p><b>Functional
                Specifications/Requirements:</b></p>
                <ol><li><p>Provide
                the tool bar support, it’s also customizable.</p></li><li><p>Options
                to get the HTML elements with styles.</p></li><li><p>Support
                to insert image from a defined path.</p></li><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                the editor support.</p></li><li><p>Provide
                efficient public methods and client side events.</p></li><li><p>Keyboard
                navigation support.</p></li></ol><img class="e-rte-image" src="https://ej2.syncfusion.com/angular/demos/assets/rich-text-editor/images/RTEImage-Feather.png" alt="Flowers in Chania" />
                `,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Toolbar and content-editable area', (done: Function) => {
            (document.querySelector(".e-richtexteditor .e-toolbar-wrapper .e-expended-nav") as any).click();
            var trg = (rteObj as any).element.querySelector('.e-rte-image');
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            var resizeBot = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight');
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (rteObj.imageModule as any).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            (rteObj.imageModule as any).imgDupMouseMove();
            var toolbarEditarea = document.querySelector(".e-richtexteditor .e-toolbar-wrapper").getBoundingClientRect().bottom - 3 < document.querySelector(".e-richtexteditor .e-rte-content .e-content").getBoundingClientRect().top;
            expect(toolbarEditarea).toBe(true);
            done();
        });
    });

    describe('850052 - Images were not aligned properly after inserting the edited image.', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><img class='e-rte-image e-imgcenter' id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('checking the inserted image is aligned properly', (done) => {
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            setTimeout(() => {
                let imageBtn: HTMLElement = document.getElementById(controlId + "_quick_Replace");
                imageBtn.parentElement.click();
                let png = "https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png";
                let dialog: HTMLElement = document.getElementById(controlId + "_image");
                let urlInput: HTMLInputElement = dialog.querySelector('.e-img-url');
                urlInput.value = png;
                let insertButton: HTMLElement = dialog.querySelector('.e-insertImage.e-primary');
                urlInput.dispatchEvent(new Event("input"));
                insertButton.click();
                expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-imgcenter')).toBe(true); 
                done();
            }, 100);
        });
    });
    describe('850027 - Horizontal scrollbar enabled when we resize the image in large', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let clickEvent: any;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                value:`<ol><li>Rich Text Editor<img id="rteImageID" style="width:300px; height:300px;transform: rotate(0deg);" alt="Logo" src="./src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline"></li></ol>`,
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
        it('Calculation of the image maximum width when inside the OL or UL element', (done) => {
            let trg = (rteObj.element.querySelector('.e-rte-image') as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            expect(parseInt(trg.style.maxWidth, 10) != rteObj.getInsertImgMaxWidth()).toBe(true);
            done();
        });
    });
    describe('855616 - Need to add the aria label to the image when setting the target to "_blank."', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><img id="image" alt="Logo" src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;">`
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it("Image link with ariaLabel", (done) => {
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            setTimeout(() => {
                let imageBtn: HTMLElement = document.getElementById(controlId + "_quick_InsertLink");
                imageBtn.parentElement.click();
                let dialog: HTMLElement = document.getElementById(controlId + "_image");
                let urlInput: HTMLInputElement = dialog.querySelector(".e-input.e-img-link");
                urlInput.value = "http://www.google.com";
                let insertButton: HTMLElement = dialog.querySelector('.e-update-link.e-primary');
                insertButton.click();
                expect(rteObj.element.querySelector("#image").parentElement.hasAttribute("aria-label")).toBe(true);
                done();
            }, 100);
        });
    });

    describe('860425 - Image with caption not get deleted when we press delete or backspace key in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        const deleteKeyUp = new KeyboardEvent('keydown', {
            cancelable: true,
            bubbles: true,
            shiftKey: false,
            ctrlKey: false,
            key: 'Delete',
            which: 46,
            keyCode: 46,
            code: 'Delete',
        } as EventInit);
        const deleteKeyDown = new KeyboardEvent('keydown', {
            cancelable: true,
            bubbles: true,
            shiftKey: false,
            ctrlKey: false,
            key: 'Delete',
            which: 46,
            keyCode: 46,
            code: 'Delete',
        } as EventInit);
        beforeEach(() => {
            rteObj = renderRTE({});
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it ('Should remove the image on delete key press', (done: DoneFn) => {
            let innerHTMLL: string = `
            
                <span class="e-img-caption e-rte-img-caption e-caption-inline" draggable="false" style="width:auto">
                    <span class="e-img-wrap">
                        <img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;" class="e-rte-image e-imginline">
                        <span class="e-img-inner" contenteditable="true">
                            Feather
                        </span>
                    </span>
                </span>
            </p>`;
            rteObj.value = innerHTMLL;
            rteObj.dataBind();
            rteObj.focusIn();
            const element = rteObj.inputElement.querySelector('.e-img-wrap') as HTMLElement;
            const range = new Range();
            range.setStart(element, 0);
            range.setEnd(element, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);
            element.dispatchEvent(deleteKeyDown);
            element.dispatchEvent(deleteKeyUp);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('.e-img-caption')).toBe(null);
                done();
            }, 500);
        });
        it ('Should remove the image on delete key press and have focus on the Paragraph', (done: DoneFn) => {
            let innerHTMLL: string = `
            <p>The Rich Text Editor component is a WYSIWYG ("what you see is what you get") editor that provides the best
            user experience to create and update the content. Users can format their content using standard toolbar commands.
            </p>
            <p><span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="true" draggable="false"
                    style="width:auto"><span class="e-img-wrap"><img alt="Logo"
                            src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png"
                            style="width: 300px;" class="e-rte-image e-imginline"><span class="e-img-inner"
                            contenteditable="true">Feather</span></span></span></p>
            <p><b>Key features:</b></p>
            `;
            rteObj.value = innerHTMLL;
            rteObj.dataBind();
            rteObj.focusIn();
            const element = rteObj.inputElement.querySelector('.e-img-wrap') as HTMLElement;
            const range = new Range();
            range.setStart(element, 0);
            range.setEnd(element, 1);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(range);            element.dispatchEvent(deleteKeyDown);
            element.dispatchEvent(deleteKeyUp);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('.e-img-caption')).toBe(null);
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName).toBe('P');
                done();
            }, 500);
        });
    });
});
