/**
 * Image module spec 
 */
import { Browser, isNullOrUndefined, closest, detach, createElement } from '@syncfusion/ej2-base';
import { RichTextEditor, QuickToolbar, ImageCommand, IQuickToolbar } from './../../../src/index';
import { NodeSelection } from './../../../src/selection/index';
import { DialogType } from "../../../src/common/enum";
import { ActionBeginEventArgs, ActionCompleteEventArgs, BeforeQuickToolbarOpenArgs } from '../../../src/common/interface';
import { renderRTE, destroy, setCursorPoint, dispatchEvent, androidUA, iPhoneUA, currentBrowserUA, ImageResizeGripper, clickImage, clickGripper, moveGripper, leaveGripper, setSelection, hostURL } from "./../render.spec";
import { BASIC_MOUSE_EVENT_INIT, INSRT_IMG_EVENT_INIT, ENTERKEY_EVENT_INIT, TAB_KEY_EVENT_INIT } from '../../constant.spec';import { getImageUniqueFIle } from '../online-service.spec';
import { pointInside } from '../../rich-text-editor/renderer/audio-module.spec';

function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}

const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);

const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);

const ENTER_KEY_DOWN_EVENT: KeyboardEvent = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);
const ENTER_KEY_UP_EVENT: KeyboardEvent = new KeyboardEvent('keyup', ENTERKEY_EVENT_INIT);
describe('Image Module', () => {

    describe(' Quick Toolbar open testing after selecting some text', () => {
        let rteObj: RichTextEditor;
        let ele: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: "<div id='rte'><p><b>Syncfusion</b> Software</p>" + "<img id='imgTag' style='width: 200px' alt='Logo'" +
                    " src='http://cdn.syncfusion.com/content/images/sales/buynow/Character-opt.png' />"
            });
        });
        it(" selecting some text and then clicking on image test ", (done: DoneFn) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 2);
            ele = rteObj.element;
            let target: HTMLElement = ele.querySelector('#imgTag');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
                done();
            }, 100);
        });
        afterAll(() => {
            destroy(rteObj);
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
            destroy(rteObj);
            Browser.userAgent = defaultUA;
        });
        it('mobile UI', () => {
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.lastElementChild.classList.contains('e-dlg-container')).toBe(false);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        });
    });

    describe('image resize', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let imgResizeDiv: HTMLElement;
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
                    if (e.item.subCommand === 'Image') {
                        expect(!isNullOrUndefined(e.itemCollection)).toBe(true);
                        expect(!isNullOrUndefined(e.itemCollection.url)).toBe(true);
                    }
                    if (e.item.subCommand === 'Caption') { expect(e.item.subCommand === 'Caption').toBe(true); }
                    if (e.item.subCommand === 'JustifyLeft') { expect(e.item.subCommand === 'JustifyLeft').toBe(true); }
                    if (e.item.subCommand === 'JustifyRight') { expect(e.item.subCommand === 'JustifyRight').toBe(true); }
                    if (e.item.subCommand === 'JustifyCenter') { expect(e.item.subCommand === 'JustifyCenter').toBe(true); }
                    if (e.item.subCommand === 'Inline') { expect(e.item.subCommand === 'Inline').toBe(true); }
                    if (e.item.subCommand === 'Break') { expect(e.item.subCommand === 'Break').toBe(true); }
                },
                actionComplete: function (e: any) {
                    if (e.requestType === 'Image') { expect(e.requestType === 'Image').toBe(true); }
                    if (e.requestType === 'Caption') { expect(e.requestType === 'Caption').toBe(true); }
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('image dialog', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect((rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement).classList.contains('e-placeholder-enabled')).toBe(true);
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
            let placeHolder: HTMLElement = (rteObj.element.querySelectorAll('.e-rte-placeholder')[0] as HTMLElement);
            expect(placeHolder.classList.contains('e-placeholder-enabled')).toBe(true);
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
            expect(rteObj.contentModule.getDocument().body.contains(imgResizeDiv)).toBe(false);
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
            (<any>rteObj.imageModule).parent.iframeSettings.enable = true;
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            (<any>rteObj.imageModule).parent.iframeSettings.enable = false;
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
            (rteObj.imageModule as any).removeResizeEle();
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
        let imgResizeDiv: HTMLElement;
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
            expect(rteObj.contentModule.getDocument().body.contains(imgResizeDiv)).toBe(false);
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
        let imgResizeDiv: HTMLElement;
        let innerHTML: string = `<p><b>Description:</b></p>
        let imgResizeDiv: HTMLElement;
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
            expect(rteObj.contentModule.getDocument().body.contains(imgResizeDiv)).toBe(false);
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
            expect(width).toEqual((rteObj.element.querySelector('img') as HTMLElement).offsetWidth);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 100 });
            width -= 199;
            expect(width).toEqual((rteObj.element.querySelector('img') as HTMLElement).offsetWidth);
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

    describe('982952: Dynamic Property changes for maxWidth is not being reflected in the insertImageSetting.', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image'],
                }
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it('Should insert image with the dynamic maxWidth', (done: Function) => {
            (rteObj as any).insertImageSettings.maxWidth = '400';
            rteObj.dataBind();
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.contentModule.getDocument().body.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            setTimeout(() => {
                expect((rteObj.element.querySelector('.e-rte-image') as HTMLElement).style.maxWidth).toEqual('400px');
                done();
            }, 1000);
        });
    });

    describe('mobile resize', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let imgResizeDiv: HTMLElement;
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
            expect(rteObj.contentModule.getDocument().body.contains(imgResizeDiv)).toBe(false);
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
            (<any>rteObj.imageModule).currentResizeHandler = 'botRight';
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
        beforeEach(() => {
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
        afterEach(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it(' contenteditable set as false while click on image to close the virtual keyboard', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
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
                    expect(rteObj.contentModule.getEditPanel().getAttribute('contenteditable') === 'true').toBe(true);
                    (rteObj.element.querySelector('.testNode') as HTMLElement).click();
                    (<any>rteObj).clickPoints = { clientY: 0, clientX: 0 };
                    dispatchEvent((rteObj.element.querySelector('.testNode') as HTMLElement), 'mouseup');
                    let eventsArgs: any = { target: (rteObj.element.querySelector('.testNode') as HTMLElement), preventDefault: function () { } };
                    (<any>rteObj).imageModule.imageClick(eventsArgs);
                    setTimeout(() => {
                        expect(rteObj.contentModule.getEditPanel().getAttribute('contenteditable') === 'true').toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
        it('readonly true with contenteditable set as false while click on image to close the virtual keyboard', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
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
                    expect(rteObj.contentModule.getEditPanel().getAttribute('contenteditable') === 'true').toBe(true);
                    rteObj.readonly = true;
                    rteObj.dataBind();
                    (rteObj.element.querySelector('.testNode') as HTMLElement).click();
                    (<any>rteObj).clickPoints = { clientY: 0, clientX: 0 };
                    dispatchEvent((rteObj.element.querySelector('.testNode') as HTMLElement), 'mouseup');
                    setTimeout(() => {
                        expect(rteObj.contentModule.getEditPanel().getAttribute('contenteditable') === 'false').toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
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
            rteObj.formatter.editorManager.imgObj = new ImageCommand(rteObj.formatter.editorManager);
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

    describe('917938 - Percentage values for height and width are not applied to images in the editor.', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold', 'Formats']
                },
                insertImageSettings: { height: "100%", width: "100%", resizeByPercent: true }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Percentage values for height and width are not applied to images in the editor', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            let target = <HTMLElement>rteEle.querySelectorAll(".e-rte-image")[0]
            expect(target.getAttribute('width') === '100%').toBe(true);
            expect(target.getAttribute('height') === '100%').toBe(true);
        });
    });

    describe('983874: Image resize bar not rendered after toggling caption via Quick Toolbar', () => {
        let innerHTML: string = `<p>Test</p><img id="rteImg" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width:200px; height: 300px" class="e-rte-image e-img-inline" alt="ASmall_Image.png" />`;
        let editor: RichTextEditor;
        beforeAll((done: Function) => {
            editor = renderRTE({
                value: innerHTML,
                quickToolbarSettings: {
                    enable: true,
                    image: ['Caption', 'Dimension']
                }
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(editor);
            done();
        });
        it('should have the resizer after caption is applied',(done) => {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            clickImage(target as HTMLImageElement);
            setTimeout(function () {
                const quickToolbar: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                const caption: HTMLElement = quickToolbar.querySelectorAll('.e-toolbar-item')[0].firstElementChild as HTMLElement;
                caption.click();
                clickImage(target as HTMLImageElement);
                expect(editor.element.querySelectorAll('.e-img-resize').length).toBe(1);
                expect(editor.element.querySelectorAll('.e-rte-imageboxmark').length).toBe(4);
                done();
            },400);
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
            rteObj.formatter.editorManager.imgObj = new ImageCommand(rteObj.formatter.editorManager);
        });
        afterAll(() => {
            destroy(rteObj);
            Browser.userAgent = currentBrowserUA;
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
            rteObj.formatter.editorManager.imgObj = new ImageCommand(rteObj.formatter.editorManager);
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

    describe('Link with image', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(function () {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: '<a class="e-rte-anchor" href="http://adadas">syncfu<img class="e-rte-image e-img-inline e-resize" alt="image" style="">sion</a>',
                insertImageSettings: { resize: false }
            });
            rteEle = rteObj.element;
            rteObj.formatter.editorManager.imgObj = new ImageCommand(rteObj.formatter.editorManager);
        });
        afterAll(function () {
            destroy(rteObj);
        });
        it('check link text while delete image', function () {
            let args: any = {
                item: { selectNode: [rteObj.element.querySelector('.e-rte-image')] },
                preventDefault: function () { }
            };
            expect(rteEle.getElementsByTagName('IMG').length).toBe(1);
            (rteObj.formatter.editorManager as any).imgObj.removeImage(args);
            expect(rteEle.getElementsByTagName('IMG').length).toBe(0);
            expect(rteObj.inputElement.innerText).toBe('syncfusion');
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
            rteObj.formatter.editorManager.imgObj = new ImageCommand(rteObj.formatter.editorManager);
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
        it('image dialog', (done: DoneFn) => {
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
            setCursorPoint(trg, 0);
            eventsArg.target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let linkPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let linkTBItems: any = linkPop.querySelectorAll('.e-toolbar-item');
                expect(linkPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                (<HTMLElement>linkTBItems.item(5)).click();
                (<HTMLElement>linkTBItems.item(7)).click();
                evnArg.args.item = { command: 'Images', subCommand: 'insertlink' };
                (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-update-link').click();
                (<HTMLElement>linkTBItems.item(8)).click();
                (rteObj.element.querySelector('.e-rte-image') as HTMLElement).focus();
                done();
            }, 100);
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
        let QTBarModule: IQuickToolbar;
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
            rteObj.formatter.editorManager.imgObj = new ImageCommand(rteObj.formatter.editorManager);
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
                    let image = rteObj.inputElement.querySelector('img');
                    setCursorPoint(image, 0);
                    image.dispatchEvent(MOUSEUP_EVENT);
                    let imgPop: HTMLElement = <HTMLElement>document.querySelector('.e-rte-quick-popup');
                    let imgTBItems: NodeList = imgPop.querySelectorAll('.e-toolbar-item');
                    expect(imgPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                    expect((<HTMLElement>imgTBItems.item(3)).title).toBe('Align');
                    ((<HTMLElement>imgTBItems.item(3)).firstElementChild as HTMLElement).click();
                    let popupElement: Element = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                    let mouseEventArgs = {
                        item: { command: 'Images', subCommand: 'JustifyLeft' }
                    };
                    (<any>rteObj).imageModule.alignmentSelect(mouseEventArgs);
                    let img: HTMLElement = rteObj.element.querySelector('.e-rte-image') as HTMLElement;
                    expect(img.classList.contains('e-img-left')).toBe(true);
                    let target: HTMLElement = rteObj.inputElement.querySelector('img');
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        mouseEventArgs.item.subCommand = 'JustifyCenter';
                        (<any>rteObj).imageModule.alignmentSelect(mouseEventArgs);
                        expect(img.classList.contains('e-img-center')).toBe(true);
                        target = rteObj.inputElement.querySelector('img');
                        setCursorPoint(target, 0);
                        target.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            mouseEventArgs.item.subCommand = 'JustifyRight';
                            (<any>rteObj).imageModule.alignmentSelect(mouseEventArgs);
                            target = rteObj.inputElement.querySelector('img');
                            setCursorPoint(target, 0);
                            target.dispatchEvent(MOUSEUP_EVENT);
                            setTimeout(() => {
                                expect(img.classList.contains('e-img-right')).toBe(true);
                                ((<HTMLElement>imgTBItems.item(4)).firstElementChild as HTMLElement).click();
                                popupElement = curDocument.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[1];
                                mouseEventArgs.item.subCommand = 'Inline';
                                (<any>rteObj).imageModule.alignmentSelect(mouseEventArgs);
                                target = rteObj.inputElement.querySelector('img');
                                setCursorPoint(target, 0);
                                target.dispatchEvent(MOUSEUP_EVENT);
                                setTimeout(() => {
                                    expect(img.classList.contains('e-img-inline')).toBe(true);
                                    mouseEventArgs.item.subCommand = 'Break';
                                    (<any>rteObj).imageModule.alignmentSelect(mouseEventArgs);
                                    expect(img.classList.contains('e-img-break')).toBe(true);
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
                        }, 40);
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
            eventsArg.target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                quickTBItem.item(7).click();
                (document.querySelector('.e-img-link') as any).value = 'https://www.syncfusion.com';
                (document.querySelector('.e-update-link') as any).click();
                target = rteObj.contentModule.getEditPanel().querySelector('img');
                expect(closest(target, 'a')).not.toBe(null);
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                quickTBItem.item(9).click();
                setTimeout(() => {
                    (document.querySelector('.e-img-link') as any).value = 'https://www.syncfusion.com';
                    (document.querySelector('.e-update-link') as any).click();
                    target = rteObj.contentModule.getEditPanel().querySelector('img');
                    expect(closest(target, 'a')).not.toBe(null);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    quickTBItem.item(0).click();
                    setTimeout(() => {
                        (document.querySelector('.e-img-alt') as any).value = 'syncfusion.png';
                        (document.querySelector('.e-update-alt') as any).click();
                        target = rteObj.contentModule.getEditPanel().querySelector('img');
                        expect(target.getAttribute('alt') === 'syncfusion.png').toBe(true);
                        target.dispatchEvent(MOUSEUP_EVENT);
                        quickTBItem.item(10).click();
                        expect(closest(target, 'a')).toBe(null);
                        done();
                    }, 500);
                }, 500);
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
            width = 80;
            // expect(width).toEqual((rteObj.element.querySelector('.e-rte-image') as HTMLElement).offsetWidth);
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
            // expect(trg.style.outline === '').toBe(true);
            // expect(rteObj.contentModule.getEditPanel().querySelector('.e-img-resize')).toBe(null);
        });
    });
    describe('Bug 914676: Image height and width set to auto after replacing an image ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let controlId: string;
        let clickEvent: any;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image']
                },
                value: `<p><img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px; height: 300px">`,
                insertImageSettings: { resize: true }
            });
            rteEle = rteObj.element;
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Checking after replacing the image', (done) => {
            let trg = (rteObj.element.querySelector("#image") as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 300 });
            (rteObj.imageModule as any).resizeEnd({ target: resizeBot });
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
                setTimeout(() => {
                    let updateImage: HTMLImageElement = rteObj.element.querySelector("#image");
                    expect(updateImage.getAttribute('width') as number | string !== "auto").toBe(true);
                    expect(updateImage.getAttribute('width').includes("px")).toBe(false);
                    expect(updateImage.getAttribute('height') as number | string !== "auto").toBe(true);
                    expect(updateImage.getAttribute('height').includes("px")).toBe(false);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe('Bug 924336: IFrame: Replaced Image not Highlighted ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let controlId: string;
        let clickEvent: any;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image']
                },
                value: `<p><img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px; height: 300px">`,
                insertImageSettings: { resize: true }
            });
            rteEle = rteObj.element;
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Checking quick toolbar after replacing the image', (done) => {
            let trg = (rteObj.element.querySelector("#image") as HTMLElement);
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 200 });
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (rteObj.imageModule as any).resizing({ target: resizeBot, pageX: 300 });
            (rteObj.imageModule as any).resizeEnd({ target: resizeBot });
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
                setTimeout(() => {
                    let updateImage: HTMLImageElement = document.querySelector("#image");
                    expect(updateImage.classList.contains('e-img-focus')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe('Bug 914676: Image height and width set to auto after replacing an image ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image']
                },
                insertImageSettings: { resize: true }
            });
            rteEle = rteObj.element;
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Checking after inserting the image', (done) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            expect((<any>rteObj).imageModule.uploadObj.fileList.length).toEqual(1);
            (<any>rteObj).imageModule.uploadObj.upload((<any>rteObj).imageModule.uploadObj.filesData[0]);
            (document.querySelector('.e-insertImage') as HTMLElement).click();
            setTimeout(() => {
                let updateImage: HTMLImageElement = rteObj.element.querySelector("img");
                expect(updateImage.getAttribute('width') as number | string !== "auto").toBe(true);
                expect(updateImage.getAttribute('width').includes("px")).toBe(false);
                expect(updateImage.getAttribute('height') as number | string !== "auto").toBe(true);
                expect(updateImage.getAttribute('height').includes("px")).toBe(false);
                done();
            }, 500);
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
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                quickTBItem.item(7).click();
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
                }, 100);
            }, 100);
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
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                quickTBItem.item(1).click();
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption-container')).not.toBe(null);
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-wrap')).not.toBe(null);
                expect((<any>rteObj).imageModule.captionEle.querySelector('img').classList.contains('e-rte-image')).toBe(true);
                keyboardEventArgs.ctrlKey = true;
                keyboardEventArgs.keyCode = 90;
                keyboardEventArgs.action = 'undo';
                (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption-container')).toBe(null);
                keyboardEventArgs.ctrlKey = true;
                keyboardEventArgs.keyCode = 89;
                keyboardEventArgs.action = 'redo';
                (<any>rteObj).formatter.editorManager.undoRedoManager.keyDown({ event: keyboardEventArgs });
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption-container')).not.toBe(null);
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
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                quickTBItem.item(0).click();
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
            <p>testing&nbsp;<span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><a href="http://www.google.com" contenteditable="true" target="_blank"><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/></a><span class="e-img-caption-text" contenteditable="true">Caption</span></span></span></p>
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
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                quickTBItem.item(1).click();
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption-container')).toBe(null);
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
            <p>testing&nbsp;<span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><a href="http://www.google.com" contenteditable="true" target="_blank"><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/></a><span class="e-img-caption-text" contenteditable="true">Caption</span></span></span></p>
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
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                quickTBItem.item(1).click();
                expect((<any>rteObj).contentModule.getEditPanel().querySelector('span.e-img-caption-container')).toBe(null);
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
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                quickTBItem.item(14).click();
                expect(rteObj.contentModule.getEditPanel().querySelector('.e-rte-image')).toBe(null);
                done();
            }, 200);
        });
    });

    describe('872200 - Image delete using quick toolbar with caption', () => {
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
        let innerHTML1: string = `<p>RTE content&nbsp;<span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px" class="e-rte-image" alt="ASmall_Image.png"><span class="e-img-caption-text" contenteditable="true">Caption</span></span></span> </p>`;
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

        it('Image delete using quick toolbar with caption with content in the left', (done: Function) => {
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
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                quickTBItem.item(14).click();
                expect(rteObj.contentModule.getEditPanel().querySelector('.e-rte-image')).toBe(null);
                expect(rteObj.getRange().startContainer.textContent === `RTE content `).toBe(true);
                expect(rteObj.getRange().startOffset === 12).toBe(true);
                done();
            }, 200);
        });

        it('Image delete using quick toolbar with caption with content in the right', (done: Function) => {
            rteObj.value = `<p><span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px" class="e-rte-image" alt="ASmall_Image.png"><span class="e-img-caption-text" contenteditable="true">Caption</span></span></span>RTE Content</p>`;
            rteObj.dataBind();
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
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
                expect(quickPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                quickTBItem.item(14).click();
                expect(rteObj.contentModule.getEditPanel().querySelector('.e-rte-image')).toBe(null);
                expect(rteObj.getRange().startContainer.textContent === `RTE Content`).toBe(true);
                expect(rteObj.getRange().startOffset === 0).toBe(true);
                done();
            }, 200);
        });
    });

    describe('EJ2-53661- Image is not deleted when press backspace and delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML1: string = `testing
        <span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-resize" style=""><span class="e-img-caption-text" contenteditable="true">image caption</span></span></span>testing`;
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
            expect((<any>rteObj).inputElement.querySelector('.e-img-caption-container')).toBe(null);
            done();
        });
    });

    describe('EJ2-53661- Image is not deleted when press backspace and delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
        let innerHTML1: string = `testing<span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-resize" style=""><span class="e-img-caption-text" contenteditable="true">image caption</span></span></span>testing`;
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
            expect((<any>rteObj).inputElement.querySelector('.e-img-caption-container')).toBe(null);
            done();
        });
    });

    describe('EJ2-53661- Image is not deleted when press backspace and delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML1: string = `<p><span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-resize" style=""><span class="e-img-caption-text" contenteditable="true">image caption</span></span></span></p>`;
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
            expect((<any>rteObj).inputElement.querySelector('.e-img-caption-container')).toBe(null);
            done();
        });
    });

    describe('EJ2-56517- Image with caption is not deleted when press backspace button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML1: string = `testing
        <span class="e-img-caption-container e-img-break" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" alt="test.png" width="auto" height="auto" style="min-width: 0px; max-width: 645px; min-height: 0px;" class="e-rte-image e-resize e-img-focus"><span class="e-img-caption-text" contenteditable="true">image caption</span></span></span>testing`;
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
            expect((<any>rteObj).inputElement.querySelector('.e-img-break')).not.toBe(null);
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, (rteObj as any).inputElement.childNodes[0]);
            keyBoardEvent.code = 'Backspace';
            (rteObj as any).keyDown(keyBoardEvent);
            expect((<any>rteObj).inputElement.querySelector('.e-img-break')).toBe(null);
            done();
        });
    });

    describe('EJ2-56517- Image with caption is not deleted when pressing delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'delete', stopPropagation: () => { }, shiftKey: false, which: 46 };
        let innerHTML1: string = `testing<span class="e-img-caption-container e-img-break" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" alt="test.png" width="auto" height="auto" style="min-width: 0px; max-width: 645px; min-height: 0px;" class="e-rte-image e-resize e-img-focus"><span class="e-img-caption-text" contenteditable="true">image caption</span></span></span>testing`;
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
            expect((<any>rteObj).inputElement.querySelector('.e-img-break')).not.toBe(null);
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
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>Hi image is<img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`,
                quickToolbarSettings: {
                    enable: true,
                    showOnRightClick: true
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(" Test - for mouse click to focus image element", (done) => {
            let target: HTMLElement = rteObj.element.querySelector("#image");
            let clickEvent: any = document.createEvent("MouseEvents");
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            clickEvent.initEvent("mousedown", false, true);
            setCursorPoint(target, 0);
            target.dispatchEvent(clickEvent);
            target.dispatchEvent(MOUSEUP_EVENT);
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
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
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
                setTimeout(() => {
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
                }, 500);
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

    describe(' Bug 912116: Action Begin Event request type new argument should be added when image is replaced from main toolbar ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let requestTypeBegin: string;
        let requestTypeComplete: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image']
                },
                value: `<p><img id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`,
                actionBegin: actionBeginFun,
                actionComplete: actionCompleteFun
            });
            function actionBeginFun(args: ActionBeginEventArgs): void {
                requestTypeBegin = args.requestType;
            }
            function actionCompleteFun(args: ActionCompleteEventArgs): void {
                requestTypeComplete = args.requestType;
            }
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it(' Testing actioncomplete and actionBegin event requestType after image replace', (done) => {
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            (<HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
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
                expect(requestTypeBegin).toBe('Replace');
                expect(requestTypeComplete).toBe('Replace');
                done();
            }, 40);
        });
    });

    describe('EJ2-37798 - Disable the insert image dialog button when the image is uploading.', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>Testing Image Dialog</p>`
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' Initial insert image button disabled', (done) => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Image');
            item.click();
            setTimeout(() => {
                let dialog: HTMLElement = document.getElementById(controlId + "_image");
                let insertButton: HTMLElement = dialog.querySelector('.e-insertImage.e-primary');
                expect(insertButton.hasAttribute('disabled')).toBe(true);
                done();
            }, 500);
        });
    });

    describe('EJ2-37798 - Disable the insert image dialog button when the image is uploading', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                insertImageSettings: {
                    allowedTypes: ['.png'],
                    saveUrl: "uploadbox/Save",
                    path: "../Images/"
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
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11] as HTMLElement).click();
            setTimeout(() => {
                let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
                let fileObj: File = new File(["Nice One"], "sample.jpg", { lastModified: 0, type: "overide/mimetype" });
                let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
                (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
                setTimeout(() => {
                    expect((dialogEle.querySelector('.e-insertImage') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
                    done();
                }, 100);
            }, 500);
        });
    });
    // describe('EJ2-37798 - Disable the insert image dialog button when the image is uploading', () => {
    //     let rteObj: RichTextEditor;
    //     beforeEach((done: Function) => {
    //         rteObj = renderRTE({
    //             toolbarSettings: {
    //                 items: ['Image']
    //             },
    //             insertImageSettings: {
    //                 saveUrl: "https://services.syncfusion.com/js/production/api/FileUploader/Save",
    //                 path: "../Images/"
    //             }
    //         });
    //         done();
    //     })
    //     afterEach((done: Function) => {
    //         destroy(rteObj);
    //         done();
    //     })
    //     it(' Button enabled with image upload Success', (done) => {
    //         let rteEle: HTMLElement = rteObj.element;
    //         (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
    //         let args = { preventDefault: function () { } };
    //         let range = new NodeSelection().getRange(document);
    //         let save = new NodeSelection().save(range, document);
    //         let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
    //         (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
    //         let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
    //         (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
    //         let fileObj: File = new File(["Nice One"], "sample.jpg", { lastModified: 0, type: "overide/mimetype" });
    //         let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
    //         (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
    //         setTimeout(() => {
    //             expect((dialogEle.querySelector('.e-insertImage') as HTMLButtonElement).hasAttribute('disabled')).toBe(false);
    //             done();
    //         }, 5500);
    //     });
    // });
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
                setTimeout(() => {
                    let insertButton: HTMLElement = dialog.querySelector('.e-update-link.e-primary');
                    insertButton.click();
                    let updateImage: HTMLImageElement = rteObj.element.querySelector("#image");
                    expect(updateImage.parentElement.hasAttribute("target")).toBe(false);
                    done();
                }, 100);
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
                    setTimeout(() => {
                        let insertButton: HTMLElement = dialog.querySelector('.e-update-link.e-primary');
                        insertButton.click();
                        let updateImage: HTMLImageElement = rteObj.element.querySelector("#image");
                        expect(updateImage.parentElement.hasAttribute("target")).toBe(false);
                        done();
                    }, 100);
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2, preventDefault: function () { } };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
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
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
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

    describe('Inserting Image as Base64 - ', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                insertImageSettings: {
                    saveFormat: "Base64"
                }
            });
        })
        afterEach(() => {
            destroy(rteObj);
        })
        it(' Test the inserted image in the component ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            (document.querySelector('.e-insertImage') as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.getContent().querySelector(".e-rte-image.e-img-inline").getAttribute("src").indexOf("blob") == -1).toBe(true);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).imageModule.deleteImg(evnArg);
                done();
            }, 100);
        });
    });

    describe('Inserting Image as Blob - ', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                insertImageSettings: {
                    saveFormat: "Blob"
                }
            });
        })
        afterEach(() => {
            destroy(rteObj);
        })
        it(' Test the inserted image in the component ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            (document.querySelector('.e-insertImage') as HTMLElement).click();
            setTimeout(() => {
                expect(rteObj.getContent().querySelector(".e-rte-image.e-img-inline").getAttribute("src").indexOf("base64") == -1).toBe(true);
                evnArg.selectNode = [rteObj.element];
                (<any>rteObj).imageModule.deleteImg(evnArg);
                done();
            }, 100);
        });
    });

    describe('Insert image imageSelected, imageUploading and imageUploadSuccess event - ', () => {
        let rteObj: RichTextEditor;
        let imageSelectedSpy: jasmine.Spy = jasmine.createSpy('onImageSelected');
        let imageUploadingSpy: jasmine.Spy = jasmine.createSpy('onImageUploading');
        let imageUploadSuccessSpy: jasmine.Spy = jasmine.createSpy('onImageUploadSuccess');
        beforeAll(() => {
            rteObj = renderRTE({
                imageSelected: imageSelectedSpy,
                imageUploading: imageUploadingSpy,
                imageUploadSuccess: imageUploadSuccessSpy,
                insertImageSettings: {
                    saveUrl: "https://services.syncfusion.com/js/production/api/FileUploader/Save",
                    path: "../Images/"
                }
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it(' Test the component insert image events - case 1 ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            if (dialogEle) {
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            }
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "override/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };

            if ((<any>rteObj).imageModule && (<any>rteObj).imageModule.uploadObj) {
                let uploadObj = (<any>rteObj).imageModule.uploadObj;
                uploadObj.onSelectFiles(eventArgs);
                expect(imageSelectedSpy).toHaveBeenCalled();
                expect(imageUploadingSpy).toHaveBeenCalled();
                setTimeout(() => {
                    // Mock event object
                    const mockEvent = {
                        e: new ProgressEvent('load', {
                            lengthComputable: false,
                            loaded: 25,
                            total: 0
                        }),
                        detectImageSource: 'Uploaded',
                        file: {
                            name: 'Screenshot (558).png',
                            rawFile: new File(['Dummy content'], 'Sampleimage.png', { type: 'image/png' }),
                            size: 395962,
                            status: 'File uploaded successfully',
                            type: 'png'
                        },
                        operation: 'upload',
                        response: {
                            readyState: 4,
                            statusCode: 200,
                            statusText: 'OK',
                            headers: 'content-type: text/plain; charset=utf-8\r\n',
                            withCredentials: false
                        },
                        statusText: 'File uploaded successfully'
                    };
                    if (uploadObj && typeof uploadObj.success === 'function') {
                        uploadObj.success(mockEvent);
                        uploadObj.success(mockEvent);
                        expect(imageUploadSuccessSpy).toHaveBeenCalled();
                    } else {
                        fail('uploadObj or uploadObj.success is not available');
                        done();
                    }
                    done();
                }, 100);
            } else {
                fail('uploadObj is not initialized or does not exist');
                done();
            }
        }, 500);
    });

    describe('EJ2CORE-479 - Insert image imageSelected event args cancel true - ', () => {
        let rteObj: RichTextEditor;
        let isImageUploadSuccess: boolean = false;
        let isImageUploadFailed: boolean = false;
        beforeEach(() => {
            rteObj = renderRTE({
                imageSelected: imageSelectedEvent,
                imageUploadSuccess: imageUploadSuccessEvent,
                imageUploadFailed: imageUploadFailedEvent,
                insertImageSettings: {
                    saveUrl: "https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save",
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
        })
        afterEach(() => {
            destroy(rteObj);
        })
        it(' Test the component insert image events - case 1 ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect(isImageUploadSuccess).toBe(false);
                expect(isImageUploadFailed).toBe(false);
                done();
            }, 100);

        });
    });

    describe('Insert image imageRemoving event - ', () => {
        let rteObj: RichTextEditor;
        let imageRemovingSpy: jasmine.Spy = jasmine.createSpy('onImageRemoving');
        beforeEach(() => {
            rteObj = renderRTE({
                imageRemoving: imageRemovingSpy,
            });
        })
        afterEach(() => {
            destroy(rteObj);
        })
        it(' Test the component insert image events - case 2 ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11] as HTMLElement).click();
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
            }, 100);
        });
    });

    describe('Insert image imageUploadFailed event - ', () => {
        let rteObj: RichTextEditor;
        let imageUploadFailedSpy: jasmine.Spy = jasmine.createSpy('onImageUploadFailed');
        beforeAll(() => {
            rteObj = renderRTE({
                imageUploadFailed: imageUploadFailedSpy,
                insertImageSettings: {
                    saveUrl: "uploadbox/Save",
                    path: "../Images/"
                }
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it(' Test the component insert image events - case 3 ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11] as HTMLElement).click();
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
            }, 500);
        });
    });

    describe('Testing allowed extension in image upload - ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                insertImageSettings: {
                    allowedTypes: ['.png'],
                    saveUrl: "uploadbox/Save",
                    path: "../Images/"
                }
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it(' Test the component insert image with allowedExtension property', (done) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let rteEle: HTMLElement = rteObj.element;
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11] as HTMLElement).click();
            setTimeout(() => {
                let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
                let fileObj: File = new File(["Nice One"], "sample.jpg", { lastModified: 0, type: "overide/mimetype" });
                let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
                (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
                setTimeout(() => {
                    expect((dialogEle.querySelector('.e-insertImage') as HTMLButtonElement).hasAttribute('disabled')).toBe(true);
                    done();
                }, 100);
            }, 100);
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
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('#rteImg'));
            const target = rteObj.element.querySelector('#rteImg') as HTMLElement;
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[1] as HTMLElement).click();
                rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('#rteImg'));
                dispatchEvent((rteObj.element.querySelector('#rteImg') as HTMLElement), 'mouseup');
                setTimeout(() => {
                    (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[7] as HTMLElement).click();
                    (document.querySelector('.e-img-link') as HTMLInputElement).value = 'https://www.google.com';
                    (document.querySelector('.e-update-link') as HTMLElement).click();
                    let imgEle: Element = document.querySelector('#rteImg');
                    expect(imgEle.parentElement.nodeName).toBe('A');
                    expect(imgEle.parentElement.parentElement.classList.contains('e-img-wrap')).toBe(true);
                    expect(imgEle.parentElement.parentElement.parentElement.classList.contains('e-img-caption-container')).toBe(true);
                    expect(document.querySelector('.e-content').childNodes.item(0).nodeName).toBe('P');
                    expect(document.querySelector('.e-content').childNodes.item(1).nodeName).toBe('P');
                    expect(document.querySelector('.e-content').childNodes[1].childNodes[0].nodeName).toBe('SPAN');
                    expect((document.querySelector('.e-content').childNodes[1].childNodes[0] as Element).classList.contains('e-img-caption-container')).toBe(true);
                    dispatchEvent((rteObj.element.querySelector('#rteImg') as HTMLElement), 'mouseup');
                    setTimeout(() => {
                        (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[10] as HTMLElement).click();
                        let imgEle: Element = document.querySelector('#rteImg');
                        expect(imgEle.parentElement.nodeName).not.toBe('A');
                        expect(imgEle.parentElement.classList.contains('e-img-wrap')).toBe(true);
                        expect(imgEle.parentElement.parentElement.classList.contains('e-img-caption-container')).toBe(true);
                        expect(document.querySelector('.e-content').childNodes.item(0).nodeName).toBe('P');
                        expect(document.querySelector('.e-content').childNodes.item(1).nodeName).toBe('P');
                        expect(document.querySelector('.e-content').childNodes[1].childNodes[0].nodeName).toBe('SPAN');
                        expect((document.querySelector('.e-content').childNodes[1].childNodes[0] as Element).classList.contains('e-img-caption-container')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });
    describe('Caption image with link coverage testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { resize: false },
                value: `<p>Test</p><a class="e-rte-anchor" href="http://adadas">syncfu<img id="rteImg" class="e-rte-image e-img-break e-img-left e-img-right e-img-center e-resize" alt="image" style="">sion</a>`
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Caption image with link coverage testing', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            setCursorPoint(rteObj.element.querySelector('#rteImg') as HTMLElement, 0);
            dispatchEvent((rteObj.element.querySelector('#rteImg') as HTMLElement), 'mouseup');
            rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('#rteImg'));
            setTimeout(function () {
                (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[1] as HTMLElement).click();
                rteObj.formatter.editorManager.nodeSelection.setSelectionNode(document, rteObj.element.querySelector('#rteImg'));
                dispatchEvent(rteObj.element.querySelector('#rteImg'), 'mouseup');
                expect(rteObj.element.querySelector('#rteImg').parentElement.parentElement.nodeName === 'SPAN').toBe(true);
                done();
            }, 100);
        });
    });
    describe(' EJ2-28120: IFrame - Images were not replaced when using caption to the image ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image']
                },
                iframeSettings: {
                    enable: true
                }
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
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
                    (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[1] as HTMLElement).click();
                    expect(!isNullOrUndefined(iframeBody.querySelector('.e-img-caption-container'))).toBe(true);
                    (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                    dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
                    dispatchEvent((iframeBody.querySelector('img') as HTMLElement), 'mouseup');
                    setTimeout(() => {
                        (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[13] as HTMLElement).click();
                        dialogEle = rteObj.element.querySelector('.e-dialog');
                        (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png';
                        (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                        expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                        (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
                        expect((iframeBody.querySelector('img') as HTMLImageElement).src).toBe('https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png');
                        done();
                    }, 100);
                }, 100);
            }, 500);
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
            var event = { clientX: 40, clientY: 294, target: rteObj.contentModule.getEditPanel(), preventDefault: function () { return; } };
            let result: any = (rteObj.imageModule as any).dragStart(event);
            setTimeout(function () {
                expect(isNullOrUndefined(result)).toBe(true);
                done();
            }, 200);
        });
    });
    describe('check resize icons - When readonly property enabled', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<p>rich text <img alt="image.jpg" class="e-resize" style="">editor</p>',
                readonly: true
            });
        })
        afterAll(() => {
            destroy(rteObj);
        })
        it('Check icons and quicktoolbar', (done) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let img: HTMLElement = rteObj.element.querySelector('img');
            img.click();
            setCursorPoint(img, 0);
            img.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(rteObj.element.querySelectorAll('.e-img-resize').length).toBe(0);
                expect(rteObj.element.querySelectorAll('.e-rte-quick-toolbar').length).toBe(0);
                done();
            }, 100);
        });
    });
    describe('EJ2-40774 - Deleting the image using context menu doesn’t remove the resize and borders of the image', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                value: '<p>rich text <img alt="image.jpg" class="e-resize" style="">editor</p>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Resize element availability check', (done) => {
            setCursorPoint(rteObj.element.querySelector('img') as HTMLElement, 0);
            const imageElement: HTMLElement = rteObj.element.querySelector('img') as HTMLElement;
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT)
            imageElement.dispatchEvent(mouseDownEvent);
            setTimeout(() => {
                expect(rteObj.element.querySelectorAll('.e-img-resize').length).toBe(1);
                done();
            }, 100);
        });
        it('Cut with resize element availability check', (done) => {
            setCursorPoint(rteObj.element.querySelector('img') as HTMLElement, 0);
            const imageElement: HTMLElement = rteObj.element.querySelector('img') as HTMLElement;
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT)
            imageElement.dispatchEvent(mouseDownEvent);
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
                toolbarSettings: {
                    items: ['Image']
                },
                insertImageSettings: {
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                },
                value: `<div><p>First p node-0</p></div>`,
                placeholder: 'Type something',
                imageUploading: function (args) {
                    expect(rteObj.toolbarModule.baseToolbar.toolbarObj.element.classList.contains('e-overlay')).toBe(true);
                    imgSize = size;
                    sizeInBytes = args.fileData.size;
                    if (imgSize < sizeInBytes) {
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
            detach(document.querySelector('.e-img-inline'))
            done();
        });
        it(" Check image after drop", function () {
            rteObj.focusIn();
            const {x, y} = pointInside(rteObj.contentModule.getEditPanel());
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            let event: any = { clientX: x, clientY: y, target: rteObj.contentModule.getEditPanel(), dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            (rteObj.imageModule as any).getDropRange(event.clientX, event.clientY);
            (rteObj.imageModule as any).dragDrop(event);
            ele = rteObj.element.getElementsByTagName('img')[0];
            expect(rteObj.element.getElementsByTagName('img').length).toBe(1);
            expect(ele.classList.contains('e-rte-image')).toBe(true);
            expect(ele.classList.contains('e-img-inline')).toBe(true);
            expect(ele.classList.contains('e-resize')).toBe(true);

        });
        it("Check image being removed with args.cancel as true", (done: Function) => {
            rteObj.focusIn();
            const {x, y} = pointInside(rteObj.contentModule.getEditPanel());
            size = 7;
            const fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(fileObj);
            const dropEvent: DragEvent = new DragEvent('drop', {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                dataTransfer
            } as DragEventInit);
            rteObj.contentModule.getEditPanel().dispatchEvent(dropEvent);
            setTimeout(() => {
                const img = rteObj.inputElement.querySelector('img') as HTMLImageElement;
                if (img) {
                    expect(img.classList.contains('e-rte-image')).toBe(false);
                } else {
                    expect(img).toBeNull();
                }
                done();
            }, 1000);
        });
    });

    describe('EJ2-39317 - beforeImageUpload event - ', () => {
        let rteObj: RichTextEditor;
        let beforeImageUploadSpy: jasmine.Spy = jasmine.createSpy('onBeforeImageUpload');
        beforeEach(() => {
            rteObj = renderRTE({
                beforeImageUpload: beforeImageUploadSpy,
            });
        })
        afterEach(() => {
            destroy(rteObj);
        })
        it(' Event and arguments test ', (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[11] as HTMLElement).click();
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
                value: '<p><img id="rteImageID" style="width: 300px; height: 300px; transform: rotate(0deg);" alt="Logo" src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline e-resize"></p>'
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
            (rteObj.imageModule as any).resizeStart({ target: trg, pageX: 0, pageY: 0 });
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            resizeBot.dispatchEvent(clickEvent);
            (rteObj.imageModule as any).resizeStart(clickEvent);
            (<any>rteObj.imageModule).resizeBtnStat.botRight = true;
            (<any>rteObj.imageModule).currentResizeHandler = 'botRight';
            let imgHeight: number = trg.offsetHeight;
            (rteObj.imageModule as any).resizing({ target: document.body, pageX: 200, pageY: 500 });
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
            (rteObj.element.querySelector('.e-toolbar-item') as HTMLElement).click();
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
            detach(document.querySelector('.e-img-inline'))
            done();
        });
        it(" imageDrop event args.cancel as `true` check", function () {
            rteObj.focusIn();
            const {x, y} = pointInside(rteObj.contentModule.getEditPanel());
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            let event: any = { clientX: x, clientY: y, target: rteObj.contentModule.getEditPanel(), dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
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
            }, 100);
        });
        it('second image click with focus testing', (done) => {
            dispatchEvent(rteObj.element.querySelectorAll('.e-content img')[1] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
                expect((rteObj.element.querySelectorAll('.e-content img')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                done();
            }, 100);
        });
        it('first image click after p click with focus testing', (done) => {
            dispatchEvent(rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                dispatchEvent(rteObj.element.querySelector('.e-content p') as HTMLElement, 'mousedown');
                setTimeout(() => {
                    expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
                    done();
                }, 100);
            }, 100);
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
                }, 100);
            }, 100);
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
            }, 100);
        });
        it('outside click with focus', (done) => {
            dispatchEvent(document.body, 'mousedown');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
                done();
            }, 100);
        });
        it('Again image click with focus testing', (done) => {
            dispatchEvent(rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.element.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                done();
            }, 100);
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
                    '<img _ngcontent-knh-c4="" alt="Tiny_Image.PNG" class="e-rte-image e-img-center e-resize e-rte-drag-image e-img-inline" height="77" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6hN7we0H3G7EKNkbPvZOioGzcm5nR46b63w&amp;usqp=CAU"' +
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
            rteObj = renderRTE({});
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
                let dialog = (<any>rteObj).imageModule.dialogObj;
                (<any>rteObj).imageModule.dialogObj = null;
                rteObj.closeDialog(DialogType.InsertImage);
                expect(document.body.querySelectorAll('.e-rte-img-dialog.e-dialog').length).toBe(1);
                (<any>rteObj).imageModule.dialogObj = dialog;
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
            detach(document.querySelector('.e-img-inline'))
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

    describe('941896 - Checking resize icon when drag and drop', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                insertImageSettings: {
                    resize: false
                },
                value: `<div><p>First p node-0</p></div>`,
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it("When resize is disabled checking after drag and drop if resize icon is present", function () {
            let image: HTMLElement = createElement("IMG");
            image.classList.add('e-rte-drag-image');
            image.setAttribute('src', 'https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            rteObj.inputElement.appendChild(image);
            let event: any = { clientX: 40, clientY: 294, dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            rteObj.focusIn();
            (rteObj.imageModule as any).insertDragImage(event);
            expect(rteObj.inputElement.querySelectorAll('img').length === 1).toBe(true);
            expect(rteObj.inputElement.querySelectorAll('.e-rte-imageboxmark').length).toBe(0);
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
            expect(((rteObj as any).imageModule as any).isDestroyed).toBe(true);
            rteObj.element.style.display = 'block';
            done();
        });
        afterAll(() => {
            detach(rteObj.element);
            let allDropDownPopups: NodeListOf<Element> = document.querySelectorAll('.e-dropdown-popup');
            expect(allDropDownPopups.length).toBe(0);
        });
    });

    describe('BLAZ-25362: In RTE image the image border and resize icons are unevenly aligned', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p>Rich Text Editor allows inserting images from online sources as well as the local computers where you want to insert the image in your content.</p>
                        <img alt="Logo" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 300px;"/>`
                ,
                toolbarSettings: {
                    items: ['Image']
                },
                width: '400',
                height: '600'
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(('checking left top posistion and alignment of the resize icon'), (done: Function) => {
            setTimeout(() => {
                let imgElem: HTMLElement = rteObj.element.querySelector('.e-rte-image');
                clickImage(imgElem as HTMLImageElement);
                setTimeout(() => {
                    expect(parseFloat((rteObj.element.querySelector('.e-rte-topLeft') as HTMLElement).style.left)).toBeLessThan(0);
                    expect(parseFloat((rteObj.element.querySelector('.e-rte-topLeft') as HTMLElement).style.top)).toBeGreaterThan(50);
                    expect(parseFloat((rteObj.element.querySelector('.e-rte-topRight') as HTMLElement).style.left)).toBeGreaterThan(250);
                    expect(parseFloat((rteObj.element.querySelector('.e-rte-topRight') as HTMLElement).style.top)).toBeGreaterThan(50);
                    expect(parseFloat((rteObj.element.querySelector('.e-rte-botLeft') as HTMLElement).style.left)).toBeLessThan(0);
                    expect(parseFloat((rteObj.element.querySelector('.e-rte-botLeft') as HTMLElement).style.top)).toBeGreaterThan(200);
                    expect(parseFloat((rteObj.element.querySelector('.e-rte-botRight') as HTMLElement).style.left)).toBeGreaterThan(250);
                    expect(parseFloat((rteObj.element.querySelector('.e-rte-botRight') as HTMLElement).style.top)).toBeGreaterThan(200);
                    done();
                }, 100);
            }, 1000);
        });
    });

    describe('EJ2-66350: DisplayLayout option checking in image quicktoolbar', () => {
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
        it("DisplayLayout option checking in image quicktoolbar", (done: DoneFn) => {
            let target: HTMLElement = rteEle.querySelector('#imgTag');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            setCursorPoint(target, 0);
            rteObj.mouseUp(eventsArg);
            (<any>QTBarModule).renderQuickToolbars();
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
                let imgPop: HTMLElement = <HTMLElement>document.querySelector('.e-rte-quick-popup');
                expect(imgPop.querySelectorAll('.e-rte-quick-toolbar').length).toBe(1);
                (<HTMLElement>document.querySelectorAll(".e-rte-dropdown-btn")[1]).click();
                expect(document.querySelectorAll('li')[0].innerHTML === "Inline");
                expect(document.querySelectorAll('li')[1].innerHTML === "Break");
                done();
            }, 100);
        });
    });
    describe('942010 - Image Link Is Lost When Dragging and Dropping the Image in the Editor', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                insertImageSettings: {
                    resize: false
                },
                value: `<div><p>First p node-0</p><a href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window"></a></div>`,
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it("Image Link Is Lost When Dragging and Dropping the Image in the Editor", function () {
            let image: HTMLElement = createElement("IMG");
            image.classList.add('e-rte-drag-image');
            image.setAttribute('src', 'https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');
            let fileObj: File = new File(["Nice One"], "sample.png", { lastModified: 0, type: "image/png" });
            rteObj.inputElement.querySelector('a').appendChild(image);
            let event: any = { clientX: 40, clientY: 294, dataTransfer: { files: [fileObj] }, preventDefault: function () { return; } };
            rteObj.focusIn();
            (rteObj.imageModule as any).insertDragImage(event);
            expect(rteObj.inputElement.querySelectorAll('img').length === 1).toBe(true);
            expect(rteObj.inputElement.querySelector('img').parentElement.tagName === 'A').toBe(true);
        });
    });
    describe('EJ2-53661- Image is not deleted when press backspace and delete button', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        let innerHTML1: string = `testing
        <span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/javascript/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-resize" style=""><span class="e-img-caption-text" contenteditable="true">image caption</span></span></span>testing`;
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
            expect((<any>rteObj).inputElement.querySelector('.e-img-caption-container')).toBe(null);
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
            target.dispatchEvent(MOUSEUP_EVENT);
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
                insertImageSettings: { removeUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Remove" },
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
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                let imageQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
                (imageQTBarEle.querySelector("[title='Remove']") as HTMLElement).click();
                expect(isNullOrUndefined(document.querySelector('.e-rte-image') as HTMLElement)).toBe(true);
                expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                done();
            }, 100);
        });
    });
    describe('836851 - iOS device interaction', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        let innerHTML: string = `<img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/>`;
        beforeEach(() => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                insertImageSettings: { removeUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Remove" },
                value: innerHTML,
            });
            rteEle = rteObj.element;
            QTBarModule = getQTBarModule(rteObj);
        });
        afterEach(() => {
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
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(!isNullOrUndefined(document.querySelector('.e-rte-image') as HTMLElement)).toBe(true);
                expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                let imageQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
                (imageQTBarEle.querySelector("[title='Remove']") as HTMLElement).click();
                expect(isNullOrUndefined(document.querySelector('.e-rte-image') as HTMLElement)).toBe(true);
                expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup') as HTMLElement)).toBe(true);
                done();
            }, 100);
        });
        it('1018162: Open quick toolbar, close it, then reopen quick toolbar', (done: Function) => {
            let contentTarget = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: any = document.createEvent("MouseEvents");
            // Step 1: Initial mousedown on content area
            clickEvent.initEvent("mousedown", false, true);
            contentTarget.dispatchEvent(clickEvent);
            // Step 2: Get the image element and set selection
            let imageTarget = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-image');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), imageTarget);
            // Step 3: Trigger mousedown on image to open quick toolbar
            clickEvent.initEvent("mousedown", false, true);
            imageTarget.dispatchEvent(clickEvent);
            imageTarget.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                // Verify quick toolbar is open
                expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup'))).toBe(true);
                QTBarModule.imageQTBar.hidePopup();
                setTimeout(() => {
                    debugger;
                    // Verify quick toolbar is closed
                    expect(isNullOrUndefined(document.querySelector('.e-rte-quick-popup'))).toBe(true);
                    // Step 5: Select the image again to reopen quick toolbar
                    let contentTarget = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
                    let clickEvent: any = document.createEvent("MouseEvents");
                    // Step 1: Initial mousedown on content area
                    clickEvent.initEvent("mousedown", false, true);
                    contentTarget.dispatchEvent(clickEvent);
                    // Step 2: Get the image element and set selection
                    let imageTarget = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-image');
                    (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), imageTarget);
                    // Step 3: Trigger mousedown on image to open quick toolbar
                    clickEvent.initEvent("mousedown", false, true);
                    imageTarget.dispatchEvent(clickEvent);
                    imageTarget.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        // Verify quick toolbar is open again
                        expect(!isNullOrUndefined(document.querySelector('.e-rte-quick-popup'))).toBe(true);
                        let imageQTBarEle = <HTMLElement>document.querySelector('.e-rte-quick-popup');
                        expect(!isNullOrUndefined(imageQTBarEle)).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });
    describe('836851 - Insert image', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
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
            const mockEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
            (<any>rteObj).imageModule.onIframeMouseDown(mockEvent);
            expect(!isNullOrUndefined(document.querySelector('.e-insertImage.e-primary') as HTMLElement)).toBe(false);
            done();
        });
    });
    describe('Image outline style is not removed properly, while focus other content or image', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image'],
                },
                iframeSettings: {
                    enable: true
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
            dispatchEvent(rteObj.inputElement.ownerDocument.querySelectorAll('.e-content img')[0] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.inputElement.ownerDocument.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                done();
            }, 100);
        });
        it('second image click with focus testing', (done) => {
            dispatchEvent(rteObj.inputElement.ownerDocument.querySelectorAll('.e-content img')[1] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.inputElement.ownerDocument.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
                expect((rteObj.inputElement.ownerDocument.querySelectorAll('.e-content img')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                done();
            }, 100);
        });
        it('first image click after p click with focus testing', (done) => {
            dispatchEvent(rteObj.inputElement.ownerDocument.querySelectorAll('.e-content img')[0] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.inputElement.ownerDocument.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                dispatchEvent(rteObj.inputElement.ownerDocument.querySelector('.e-content p') as HTMLElement, 'mousedown');
                setTimeout(() => {
                    expect((rteObj.inputElement.ownerDocument.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
                    done();
                }, 100);
            }, 100);
        });
        it('second image click after p click with focus testing', (done) => {
            dispatchEvent(rteObj.inputElement.ownerDocument.querySelectorAll('.e-content img')[1] as HTMLElement, 'mousedown');
            setTimeout(() => {
                expect((rteObj.inputElement.ownerDocument.querySelectorAll('.e-content img')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(true);
                dispatchEvent(rteObj.inputElement.ownerDocument.querySelector('.e-content p') as HTMLElement, 'mousedown');
                setTimeout(() => {
                    expect((rteObj.inputElement.ownerDocument.querySelectorAll('.e-content img')[0] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
                    expect((rteObj.inputElement.ownerDocument.querySelectorAll('.e-content img')[1] as HTMLElement).style.outline === 'rgb(74, 144, 226) solid 2px').toBe(false);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe('936059 - Insert image and cancel button error check', function () {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let QTBarModule: IQuickToolbar;
        let errorSpy: jasmine.Spy;
        let originalConsoleError: { (...data: any[]): void; };

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
            originalConsoleError = console.error;
            errorSpy = jasmine.createSpy('error');
            console.error = errorSpy;
        });

        afterAll(() => {
            console.error = originalConsoleError;
            destroy(rteObj);
        });

        it('Should not throw console error when clicking cancel button in insert image dialog', (done: Function) => {
            (<any>QTBarModule).renderQuickToolbars(rteObj.imageModule);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0]).click();
            let dialogEle: HTMLElement = rteObj.element.querySelector('.e-dialog');
            expect(dialogEle).not.toBeNull();
            let cancelButton = dialogEle.querySelector('.e-btn.e-flat') as HTMLElement;
            cancelButton.click();
            expect(rteObj.element.querySelector('.e-dialog')).toBeNull();
            expect(errorSpy).not.toHaveBeenCalled();
            done();
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
                value: `<p><img class='e-rte-image e-img-center' id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`
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
                expect((<any>rteObj).element.querySelector('.e-rte-image').classList.contains('e-img-center')).toBe(true);
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
                value: `<ol><li>Rich Text Editor<img id="rteImageID" style="width:300px; height:300px;transform: rotate(0deg);" alt="Logo" src="./src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-img-inline"></li></ol>`,
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
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({});
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        it('Should remove the image on delete key press', (done: DoneFn) => {
            let innerHTMLL: string = `
            
                <span class="e-img-caption-container e-img-inline" draggable="false" style="width:auto">
                    <span class="e-img-wrap">
                        <img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;" class="e-rte-image">
                        <span class="e-img-caption-text" contenteditable="true">
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
                expect(rteObj.inputElement.querySelector('.e-img-caption-container')).toBe(null);
                done();
            }, 100);
        });
        it('Should remove the image on delete key press and have focus on the Paragraph', (done: DoneFn) => {
            let innerHTMLL: string = `
            <p>The Rich Text Editor component is a WYSIWYG ("what you see is what you get") editor that provides the best
            user experience to create and update the content. Users can format their content using standard toolbar commands.
            </p>
            <p><span class="e-img-caption-container e-img-inline" contenteditable="true" draggable="false"
                    style="width:auto"><span class="e-img-wrap"><img alt="Logo"
                            src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png"
                            style="width: 300px;" class="e-rte-image"><span class="e-img-caption-text"
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
            document.getSelection().addRange(range); element.dispatchEvent(deleteKeyDown);
            element.dispatchEvent(deleteKeyUp);
            setTimeout(() => {
                expect(rteObj.inputElement.querySelector('.e-img-caption-container')).toBe(null);
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName).toBe('P');
                done();
            }, 100);
        });
    });

    describe('846359 - Need to allow to insertion of empty hyperlink/images in the markdown', () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                editorMode: 'Markdown',
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Checking the insertion of empty images in the markdown', () => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = '';
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            expect(rteObj.inputElement.value === `![](http://)`).toBe(true);
        });
    });

    describe('850034 - Content scrolls to the top, when we apply formats to the image caption', () => {
        let rteObj: RichTextEditor;
        let scrollSpy: jasmine.Spy;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p><p><b>Functional
                Specifications/Requirements:</b></p><ol><li><p>Provide
                the tool bar support, it’s also customizable.</p></li><li><p>Options
                to get the HTML elements with styles.</p></li><li><p>Support
                to insert image from a defined path.</p></li><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                the editor support.</p></li><li><p>Provide
                efficient public methods and client side events.</p></li><li><p>Keyboard
                navigation support.</p></li></ol><p><span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="w3-round-large e-rte-image" alt="Norway" style=""><span class="e-img-caption-text" contenteditable="true">Caption</span></span></span></p>`
            });
            scrollSpy = jasmine.createSpy('scrollhandler');
            window.addEventListener('scroll', scrollSpy);
            done();
        });
        afterAll((done: Function) => {
            window.removeEventListener('scroll', scrollSpy);
            destroy(rteObj);
            done();
        });
        it("The content scrolls to the top when contenteditable is set to false in the Rich Text Editor.", (done) => {
            rteObj.focusIn();
            const imageCaption = rteObj.element.querySelector(".e-img-caption-container .e-img-caption-text");
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(rteObj.contentModule.getDocument(), imageCaption.firstChild, imageCaption.firstChild, 0, 7);
            (rteObj.toolbarModule.getToolbarElement().querySelectorAll(".e-toolbar-wrapper .e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                expect(scrollSpy).not.toHaveBeenCalled();
                done();
            }, 100);
        });
    });

    describe('Image module code coverage', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        let QTBarModule: IQuickToolbar;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                client side. Customer easy to edit the contents and get the HTML content for
                the displayed content. A rich text editor control provides users with a toolbar
                that helps them to apply rich text formats to the text entered in the text
                area. </p><p><b>Functional
                Specifications/Requirements:</b></p><ol><li><p>Provide
                the tool bar support, it’s also customizable.</p></li><li><p>Options
                to get the HTML elements with styles.</p></li><li><p>Support
                to insert image from a defined path.</p></li><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size
                the editor support.</p></li><li><p>Provide
                efficient public methods and client side events.</p></li><li><p>Keyboard
                navigation support.</p></li></ol><p><span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" class="w3-round-large e-rte-image" alt="Norway" style="width: 300px;"><span class="e-img-caption-text" contenteditable="true">Caption</span></span></span></p>`
            });
            controlId = (rteObj as any).element.id;
            QTBarModule = getQTBarModule(rteObj);
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it("image module code coverage", (done) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let myObj: any = {
                oldCssClass: 'imageOldClass',
                cssClass: 'imageOldClass_imageNewClass',
                setProperties: function (value: any) {
                    this.oldCssClass = value.cssClass;
                }
            };
            (rteObj as any).imageModule.updateCss(myObj, { oldCssClass: 'imageOldClass', cssClass: 'imageUpdatedClass' });
            expect(myObj.oldCssClass === '_imageNewClass imageUpdatedClass').toBe(true);
            (rteObj as any).imageModule.updateCss(myObj, { oldCssClass: null, cssClass: 'imageUpdatedClass' });
            expect(myObj.oldCssClass === 'imageOldClass_imageNewClass imageUpdatedClass').toBe(true);
            (rteObj as any).imageModule.popupObj = rteObj;
            (rteObj as any).imageModule.setCssClass({ oldCssClass: 'imageOldClass', cssClass: 'imageUpdatedClass' });
            expect((rteObj as any).element.classList.contains('imageUpdatedClass')).toBe(true);
            (rteObj as any).imageModule.setCssClass({ oldCssClass: null, cssClass: 'imageUpdatedClassNew' });
            expect((rteObj as any).element.classList.contains('imageUpdatedClassNew')).toBe(true);
            (rteObj as any).imageModule.popupObj = null;
            let undoCount: number = (rteObj as any).formatter.getUndoRedoStack().length;
            (rteObj as any).imageModule.undoStack({ subCommand: "image" });
            expect((rteObj as any).formatter.getUndoRedoStack().length === undoCount).toBe(true);
            let image: any = (rteObj as any).element.querySelector('.e-rte-image');
            image.parentElement.parentElement.draggable = true;
            image.parentElement.parentElement.contentEditable = true;
            image.classList.add('e-rte-imageboxmark');
            let eventsArg: any = { pageX: 50, pageY: 300, target: image, which: 1, preventDefault: function () { }, stopImmediatePropagation: function () { } };
            setCursorPoint(image, 0);
            image.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
                (rteObj as any).imageModule.quickToolObj = (rteObj as any).quickToolbarModule;
                (rteObj as any).imageModule.resizeStart(eventsArg);
                expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(0);
                (rteObj as any).imageModule.imgResizeDiv = null;
                (rteObj as any).imageModule.onCutHandler();
                (rteObj as any).imageModule.parent = null;
                (rteObj as any).imageModule.resizing({});
                (rteObj as any).imageModule.parent = rteObj;
                expect((rteObj as any).imageModule.imgEle.style.outline !== '').toBe(true);
                let imageWidth: number = image.width;
                let imageHeight: number = image.height;
                (rteObj as any).imageModule.setAspectRatio({ width: null }, 100, 99);
                (rteObj as any).imageModule.resizing({});
                expect(image.width === imageWidth).toBe(true);
                expect(image.height === imageHeight).toBe(true);
                (rteObj as any).insertImageSettings.resizeByPercent = true;
                setTimeout(() => {
                    (rteObj as any).imageModule.setImageHeight(image, 200, 'px');
                    expect(image.style.height === '').toBe(true);
                    (rteObj as any).insertImageSettings.resizeByPercent = false;
                    setTimeout(() => {
                        image.classList.add('e-rte-botRight');
                        (rteObj as any).imageModule.resizeStart(eventsArg);
                        (rteObj as any).imageModule.pageX = 51;
                        (rteObj as any).imageModule.resizing(eventsArg);
                        expect(image.style.width).toBe('298px');
                        //Need to check the caption element width when image is applied with caption.
                        expect(image.parentElement.parentElement.style.width).toBe('298px');
                        // The below cases needs ensure manullay not able to check it expect - start.
                        (rteObj as any).isDestroyed = true;
                        (rteObj as any).imageModule.addEventListener();
                        (rteObj as any).isDestroyed = false;
                        (rteObj as any).imageModule.contentModule = null;
                        (rteObj as any).imageModule.removeEventListener();
                        (rteObj as any).imageModule.contentModule = (rteObj as any).contentModule;
                        (rteObj as any).readonly = true;
                        (rteObj as any).imageModule.resizeStart({}, {});
                        (rteObj as any).readonly = false;
                        // The above cases needs ensure manullay not able to check it expect - end.
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });

        it("image module code coverage", (done) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let image: any = (rteObj as any).element.querySelector('.e-rte-image');
            let eventsArg: any = { pageX: 50, pageY: 300, target: image, which: 1, preventDefault: function () { }, stopImmediatePropagation: function () { } };
            (rteObj as any).imageModule.resizeStart(eventsArg);
            (rteObj as any).imageModule.pageX = 51;
            (rteObj as any).imageModule.resizing(eventsArg);
            (rteObj as any).imageModule.resizeEnd(eventsArg);
            (rteObj as any).imageModule.uploadCancelTime = setTimeout(() => { }, 0);
            (rteObj as any).imageModule.uploadFailureTime = setTimeout(() => { }, 0);
            (rteObj as any).imageModule.uploadSuccessTime = setTimeout(() => { }, 0);
            (rteObj as any).imageModule.destroy();
            done();
        });
    });

    describe('837380: The web url is empty when trying to edit after being inserted into the Rich Text Editor', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><img class='e-rte-image e-img-center' id="image" alt="Logo" src="https://cdn.syncfusion.com/content/images/home-v1/home/home-banner-v4.png" style="width: 300px;">`
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('validating whether or not the image web url is present', (done) => {
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            setTimeout(() => {
                let imageBtn: HTMLElement = document.getElementById(controlId + "_quick_Replace");
                imageBtn.parentElement.click();
                let dialog: HTMLElement = document.getElementById(controlId + "_image");
                let urlInput: HTMLInputElement = dialog.querySelector('.e-img-url');
                expect(urlInput.value !== null && urlInput.value !== undefined && urlInput.value !== '').toBe(true);
                done();
            }, 100);
        });
    });

    describe('820211 - Quick toolbar is not rendered while pasting only an image in the Rich Text Editor', () => {
        let editor: RichTextEditor;
        beforeAll((done: DoneFn) => {
            editor = renderRTE({});
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it('Should render a quick toolbar and then start the resize action.', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new Event('mousedown'));
            const clipBoardData: string = `<html>
            <body>
            <!--StartFragment--><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" alt="Logo"/><!--EndFragment-->
            </body>
            </html>`;
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.onPaste(pasteEvent);
            setTimeout(() => {
                expect(document.querySelector('.e-rte-quick-toolbar')).toBe(null);
                expect(document.querySelector('.e-img-resize')).toBe(null);
                done();
            }, 600);
        });
    });

    describe('878796 - The cursor is not set properly when pasting paragraphs with images in the Rich Text Editor.', () => {
        let editor: RichTextEditor;
        beforeAll((done) => {
            editor = renderRTE({});
            done();
        });
        afterAll((done) => {
            destroy(editor);
            done();
        });
        it('The cursor is set next to the image when you paste it into the editor.', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new Event('mousedown'));
            const clipBoardData: string = `<html>
            <body>
            <!--StartFragment--><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" alt="Logo"/><!--EndFragment-->
            </body>
            </html>`;
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.onPaste(pasteEvent);
            setTimeout(() => {
                expect(window.getSelection().getRangeAt(0).startContainer.previousSibling.nodeName === 'IMG').toBe(true);
                done();
            }, 600);
        });
    });

    describe('837486 - Image gets flickered while resize the cell - ', () => {
        let rteObj: RichTextEditor;
        let rteEle: Element
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="td1" style="width: 25%;"><br></td><td class="td2" style="width: 25%;" class=""><br></td><td class="td3" style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it('Test the image flicker while click the table cell', (done) => {
            let tdEle: HTMLElement = rteObj.element.querySelector(".td2");
            setCursorPoint(tdEle, 0);
            let range: Range = new NodeSelection().getRange(document);
            rteObj.formatter.editorManager.nodeSelection.save(range, document);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            setTimeout(() => {
                let tdWidth = document.querySelector('table td').getBoundingClientRect().width;
                let imgWidth = document.querySelector('.e-rte-image').getBoundingClientRect().width;
                expect(tdWidth > imgWidth).toBe(true);
                done();
            }, 200);
        });
    });

    describe('871139 - when image removing event API is used argument is null', () => {
        let rteObj: RichTextEditor;
        let propertyCheck: boolean;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image']
                },
                insertImageSettings: {
                    saveUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Save",
                    path: "../Images/"
                },
                imageRemoving: function (args) {
                    if (args.cancel != null && args.customFormData != null && args.filesData != null && args.postRawFile != null) {
                        propertyCheck = true;
                    }
                },
            });
            done();
        })
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        })
        it("The imageRemiving event doesn't have the args property.", (done) => {
            let rteEle: HTMLElement = rteObj.element;
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            let args = { preventDefault: function () { } };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg = { args: MouseEvent, self: (<any>rteObj).imageModule, selection: save, selectNode: new Array(), };
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let dialogEle: Element = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
            let fileObj: File = new File(["Nice One"], "sample.jpg", { lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: { files: [fileObj] }, preventDefault: (): void => { } };
            (<any>rteObj).imageModule.uploadObj.onSelectFiles(eventArgs);
            (document.querySelector(".e-dlg-closeicon-btn.e-control.e-btn.e-lib.e-flat.e-icon-btn") as any).click();
            setTimeout(() => {
                expect(propertyCheck).toBe(true);
                done();
            }, 300);
        });
    });

    describe('832079 - Not able to resize the image propely', () => {
        let editor: RichTextEditor;
        beforeAll((done: DoneFn) => {
            let link = document.createElement('link');
            link.href = '/base/demos/themes/material.css';
            link.rel = 'stylesheet';
            link.id = 'materialTheme';
            document.head.appendChild(link);
            setTimeout(() => {
                done();
            }, 200);
        });
        afterAll((done: DoneFn) => {
            document.getElementById('materialTheme').remove();
            done();
        });
        beforeEach((done: Function) => {
            editor = renderRTE({
                value: `
                <p>Image with Width and Height</p>
                <p>
                <img alt="image 1" src="/base/spec/content/image/RTEImage-Feather.png" style="width: 450px; height: 300px;" />                </p>`
            });
            done();
        });
        afterEach((done: Function) => {
            destroy(editor);
            done();
        });
        it('Should resize the image properly Case 1 Top Right Increase size', (done: DoneFn) => {
            const image: HTMLImageElement = editor.element.querySelector('img');
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 500, 100);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width > width);
                done();
            }, 150);
        });
        it('Should resize the image properly Case 1 Top Right Decrease size', (done: DoneFn) => {
            const image: HTMLImageElement = editor.element.querySelector('img');
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 400, 60);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width < width);
                done();
            }, 150);
        });
        it('Should resize the image properly Case 1 Top Right Increase size', (done: DoneFn) => {
            editor.insertImageSettings.resizeByPercent = true;
            editor.dataBind();
            const image: HTMLImageElement = editor.element.querySelector('img');
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 500, 100);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width > width);
                done();
            }, 150);
        });
        it('Should resize the image properly Case 1 Top Right Decrease size', (done: DoneFn) => {
            editor.insertImageSettings.resizeByPercent = true;
            editor.dataBind();
            const image: HTMLImageElement = editor.element.querySelector('img');
            clickImage(image);
            const gripper: ImageResizeGripper = 'e-rte-topRight';
            const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
            clickGripper(gripperElement);
            const width = image.width;
            // Start position x: 481 y: 86
            moveGripper(gripperElement, 400, 60);
            leaveGripper(gripperElement);
            setTimeout(() => {
                expect(image.width < width);
                done();
            }, 150);
        });
    });

    describe('Pasting image into editor with the Insert image setting display set to block', () => {
        let editor: RichTextEditor;
        beforeAll((done) => {
            editor = renderRTE({
                insertImageSettings: {
                    display: 'Break'
                }
            });
            done();
        });
        afterAll((done) => {
            destroy(editor);
            done();
        });
        it('The cursor is set next to the image when you paste it into the editor.', (done: DoneFn) => {
            editor.focusIn();
            const clipBoardData: string = `<html>
            <body>
            <!--StartFragment--><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" alt="Logo"/><!--EndFragment-->
            </body>
            </html>`;
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.onPaste(pasteEvent);
            setTimeout(() => {
                expect(window.getSelection().getRangeAt(0).startContainer.previousSibling.nodeName === 'IMG').toBe(true);
                done();
            }, 100);
        });
    });

    describe('Pasting image into editor with the Insert image setting display set to block and save url configured', () => {
        let editor: RichTextEditor;
        beforeAll((done) => {
            editor = renderRTE({
                insertImageSettings: {
                    display: 'Break',
                    saveUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/SaveFile',
                    path: 'https://ej2services.syncfusion.com/js/development/RichTextEditor/'
                }
            });
            done();
        });
        afterAll((done) => {
            destroy(editor);
            done();
        });
        it('Should close the quick toolbar on the method call', (done: DoneFn) => {
            editor.focusIn();
            const clipBoardData: string = `<html>
            <body>
            <!--StartFragment--><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" alt="Logo"/><!--EndFragment-->
            </body>
            </html>`;
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.onPaste(pasteEvent);
            setTimeout(() => {
                (editor.imageModule as any).hideImageQuickToolbar()
                expect(document.body.querySelector('.e-image-quicktoolbar')).toBe(null);
                done();
            }, 100);
        });
        it('Should close the quick toolbar on the method call', (done: DoneFn) => {
            editor.focusIn();
            editor.value = null;
            editor.cssClass = 'random-class';
            const clipBoardData: string = `<html>
            <body>
            <!--StartFragment--><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" alt="Logo"/><!--EndFragment-->
            </body>
            </html>`;
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.onPaste(pasteEvent);
            setTimeout(() => {
                (editor.imageModule as any).hideImageQuickToolbar()
                expect(document.body.querySelector('.e-image-quicktoolbar')).toBe(null);
                done();
            }, 100);
        });
    });

    describe('Insert link on image with image quick toolbar with targe set to self', () => {
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
        let editor: RichTextEditor;
        beforeEach((done) => {
            editor = renderRTE({
                value: `<p><img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;" class="e-rte-image e-img-inline"></p>`
            });
            done();
        });
        afterEach((done) => {
            destroy(editor);
            done();
        });
        it('Should have proper target attribute.', (done: DoneFn) => {
            editor.focusIn();
            const imageElement: HTMLElement = editor.inputElement.querySelector('img');
            imageElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            imageElement.dispatchEvent(new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT));
            setTimeout(() => {
                ((document.body.querySelector('.e-image-quicktoolbar').querySelector('.e-insert-link')) as HTMLElement).click();
                setTimeout(() => {
                    (document.body.querySelector('.e-rte-img-dialog').querySelector('.e-checkbox') as HTMLElement).click();
                    (editor.element.querySelector('.e-img-link') as HTMLInputElement).value = 'https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html';
                    (editor.element.querySelector('.e-img-link') as HTMLInputElement).dispatchEvent(new Event('input'));
                    (document.body.querySelector('.e-rte-img-dialog').querySelector('.e-update-link') as HTMLElement).click();
                    setTimeout(() => {
                        expect((editor.inputElement.querySelector('img').parentElement as HTMLLinkElement).target).toBe('');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
        it('Should have proper target attribute. CASE 2 Edit the link', (done: DoneFn) => {
            const imageElement: HTMLElement = editor.inputElement.querySelector('img');
            imageElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
            imageElement.dispatchEvent(new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT));
            setTimeout(() => {
                ((document.body.querySelector('.e-image-quicktoolbar').querySelector('.e-edit-link')) as HTMLElement).click();
                setTimeout(() => {
                    expect(document.body.querySelector('.e-rte-img-dialog').querySelector('.e-checkbox').querySelector('.e-check')).toBe(null);
                    done();
                }, 100);
            }, 100);
        });
    });

    xdescribe('Dropping images into the editor area ', () => {
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
        let editor: RichTextEditor;
        let success: boolean = false;
        let removeSuccess: boolean = false;
        beforeEach((done) => {

            editor = renderRTE({
                insertImageSettings: {
                    display: 'Break',
                    saveUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/SaveFile',
                    removeUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/DeleteFile',
                    path: 'https://ej2services.syncfusion.com/js/development/RichTextEditor/'
                },
                imageUploadSuccess: (e: any) => {
                    if (editor.inputElement.querySelector('img').src === 'RTE-Landscape.png') {
                        success = true;
                    }
                },
                imageUploadFailed: (e: any) => {
                    success = null;
                },
                afterImageDelete: (e: any) => {
                    removeSuccess = true;
                },
                cssClass: 'initial-class'
            });
            done();
        });
        afterEach((done) => {
            destroy(editor);
            done();
        });

        it('Should insert the image into the editor.', (done: DoneFn) => {
            editor.focusIn();
            fetch('/base/spec/content/image/RTE-Landscape.png')
                .then((response) => response.blob())
                .then((blob) => {
                    const file: File = new File([blob], 'RTE-Landscape.png', { type: 'image/png' });
                    const dataTransfer: DataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    const dropEvent: DragEvent = new DragEvent('drop', {
                        dataTransfer: dataTransfer,
                        view: window, bubbles: true, cancelable: true, clientX: 25, clientY: 85
                    } as MouseEventInit);
                    editor.inputElement.dispatchEvent(dropEvent);
                    setTimeout(() => {
                        if (success) {
                            expect(success).toBe(true);
                        } else if (success === null) {
                            console.warn('Image upload failed');
                        }
                        const imageElement: HTMLElement = editor.inputElement.querySelector('img');
                        imageElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
                        imageElement.dispatchEvent(new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT));
                        setTimeout(() => {
                            ((document.body.querySelector('.e-image-quicktoolbar').querySelector('.e-remove')) as HTMLElement).click();
                            setTimeout(() => {
                                if (removeSuccess) {
                                    expect(removeSuccess).toBe(true);
                                } else {
                                    console.warn('Image remove failed');
                                }
                                done();
                            }, 1000);
                        }, 150);
                    }, 1500); // Higher set timeout since calling server POST.
                });
        }, 7000);

        it('Should insert the image into the editor. CASE 2 Updating the cssclass', (done: DoneFn) => {
            editor.focusIn();
            editor.cssClass = 'random-class';
            fetch('/base/spec/content/image/RTE-Landscape.png')
                .then((response) => response.blob())
                .then((blob) => {
                    const file: File = new File([blob], 'RTE-Landscape.png', { type: 'image/png' });
                    const dataTransfer: DataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    const dropEvent: DragEvent = new DragEvent('drop', {
                        dataTransfer: dataTransfer,
                        view: window, bubbles: true, cancelable: true, clientX: 25, clientY: 85
                    } as MouseEventInit);
                    editor.inputElement.dispatchEvent(dropEvent);
                    setTimeout(() => {
                        if (success) {
                            expect(success).toBe(true);
                        } else if (success === null) {
                            console.warn('Image upload failed');
                        }
                        editor.cssClass = 'random-class';
                        done();
                    }, 1500); // Higher set timeout since calling server POST.
                });
        }, 3000);
    });

    describe("945310: Image Selection Removed After Updating Alternate Text, Cursor Moves to Editor", () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><b>Description:</b></p><p><img class='e-rte-image e-img-center' id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
        it('Dynamically modify the quick toolbar position in the beforeQuickToolbarOpen event.', (done) => {
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            setTimeout(() => {
                const imageBtn: HTMLElement = document.getElementById(controlId + "_quick_AltText");
                imageBtn.parentElement.click();
                const altBtn: HTMLElement = document.querySelector('.e-update-alt');
                altBtn.click();
                const range: any = new NodeSelection().getRange(document);
                expect(range.startContainer.querySelector('img')).not.toBe(null);
                done();
            }, 100);
        });
    });

    describe('874686 - Image Size pop up has more empty space at below before update buttom. Can reduce the size of pop up.', () => {
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
        it("Check the image popup size", (done) => {
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            setTimeout(() => {
                let imageBtn: HTMLElement = document.getElementById(controlId + "_quick_Dimension");
                imageBtn.click();
                expect(rteObj.element.querySelector(".e-rte-img-size-dialog").hasAttribute("height")).toBe(false);
                done();
            }, 100);
        });
    });

    describe('Insert image with display set to break', () => {
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
        let editor: RichTextEditor;
        beforeEach((done) => {
            editor = renderRTE({
                insertImageSettings: {
                    display: 'Break'
                }
            }
            );
            done();
        });
        afterEach((done) => {
            destroy(editor);
            done();
        });
        it('Case 1: Insert by using the image url', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_IMG_EVENT_INIT));
            editor.inputElement.dispatchEvent(new KeyboardEvent('keyup', INSRT_IMG_EVENT_INIT));
            setTimeout(() => {
                (editor.element.querySelector('.e-img-url') as HTMLInputElement).value = 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png';
                editor.element.querySelector('.e-img-url').dispatchEvent(new Event('input'));
                (editor.element.querySelector('.e-insertImage') as HTMLButtonElement).click();
                setTimeout(() => {
                    expect(editor.inputElement.querySelector('img').classList.contains('e-rte-image'));
                    done();
                }, 100);
            }, 100);
        });
        it('Case 2: Insert by paste action', (done: DoneFn) => {
            editor.focusIn();
            const clipBoardData: string = '<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%;" class="e-rte-image e-img-inline" /></p>';
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', clipBoardData);
            const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer } as ClipboardEventInit);
            editor.onPaste(pasteEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelector('img').classList.contains('e-rte-image'));
                done();
            }, 100);
        });
    });

    describe('896793 - Facing some issues while pasting an image into the RichTextEditor in Firefox', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: '<p>Rich Text Editor</p>'
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Paste the image into the Rich Text Editor', (done: DoneFn) => {
            const imageUrl = 'https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Portrait.png';
            fetch(imageUrl)
                .then(response => response.blob())
                .then(blob => {
                    const file = new File([blob], "image.png", {
                        type: "image/png",
                        lastModified: Date.now()
                    });
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                        clipboardData: dataTransfer,
                        bubbles: true,
                        cancelable: true
                    } as ClipboardEventInit);
                    setCursorPoint((editor as any).inputElement.querySelector('p').childNodes[0], 3);
                    editor.contentModule.getEditPanel().dispatchEvent(pasteEvent);
                    setTimeout(function () {
                        expect(editor.inputElement.querySelectorAll("img").length > 0).toBe(true);
                        done();
                    }, 1000);
                })
                .catch((error) => {
                    console.error('Fetch failed for the URL: ', imageUrl, error);
                    done();
                });
        });
    });
    describe('924317 -Both oroiginal and the replaced image displayed while replacing the image && Incorrect display style after applying the break style to the image ', function () {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image']
                },
                iframeSettings: {
                    enable: true
                }
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(" insert image , caption and Display break and replace the image", (done: DoneFn) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
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
                (rteObj.contentModule.getPanel() as HTMLElement).focus();
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[1] as HTMLElement).click();
                    expect(!isNullOrUndefined(iframeBody.querySelector('.e-img-caption-container'))).toBe(true);
                    const target: HTMLElement = rteObj.inputElement.querySelector('img');
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[4].firstElementChild as HTMLElement).click();
                        (document.querySelector('.e-break') as HTMLElement).click();
                        const target: HTMLElement = rteObj.inputElement.querySelector('img');
                        setCursorPoint(target, 0);
                        target.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[13] as HTMLElement).click();
                            dialogEle = rteObj.element.querySelector('.e-dialog');
                            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png';
                            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                            expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
                            setTimeout(() => {
                                expect((iframeBody.querySelector('img') as HTMLImageElement).src).toBe('https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png');
                                expect((iframeBody.querySelectorAll('img').length)).toBe(1);
                                expect(!isNullOrUndefined(iframeBody.querySelector('.e-img-caption-container.e-img-break'))).toBe(true);
                                expect(!isNullOrUndefined(iframeBody.querySelector('.e-rte-image.e-img-break'))).toBe(false);
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });
    describe('940236 - Adding validation to the image link when the values are empty and Removing it when the values are entered ', () => {
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
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link').value = ' ';
            evnArg.args.item = { command: 'Images', subCommand: 'insertlink' };
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-update-link').click();
            (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link').focus();
            expect((<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link').classList.contains('e-error')).toBe(true);
            let inputElement = (<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link');
            inputElement.value = 'h';
            let inputChangeEvent = new Event('input', {
                bubbles: true,
                cancelable: true
            });
            inputElement.dispatchEvent(inputChangeEvent);
            expect((<any>rteObj).imageModule.dialogObj.element.querySelector('.e-input.e-img-link').classList.contains('e-error')).toBe(false);
        });
    });
    describe('942858 -EnableAutoUrl does not apply for the links added with inserted image in the RichTextEditor ', function () {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                enableAutoUrl: true,
                toolbarSettings: {
                    items: ['Image']
                },
                iframeSettings: {
                    enable: true
                }
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(" insert image  and add link value to it", (done: DoneFn) => {
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
                (rteObj.contentModule.getPanel() as HTMLElement).focus();
                dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
                dispatchEvent((iframeBody.querySelector('img') as HTMLElement), 'mouseup');
                setTimeout(() => {
                    let imageBtn: HTMLElement = document.getElementById(controlId + "_quick_InsertLink");
                    imageBtn.parentElement.click();
                    let dialog: HTMLElement = document.getElementById(controlId + "_image");
                    let urlInput: HTMLInputElement = dialog.querySelector(".e-input.e-img-link");
                    urlInput.value = "defaultimage";
                    let insertButton: HTMLElement = dialog.querySelector('.e-update-link.e-primary');
                    insertButton.click();
                    expect((iframeBody.querySelector('a').getAttribute('href') === 'defaultimage')).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('944693 - Image Alignment Dropdown Displays Incorrect Selection After Changing Alignment ', () => {
        let rteEle: HTMLElement;
        let controlId: string;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<ul> <li style="cursor: auto;"><img src="https://services.syncfusion.com/js/production/RichTextEditor/Screenshot 2024-12-03 115549.png" class="e-rte-image e-img-inline" alt="Screenshot 2024-12-03 115549" width="262" height="31" style="min-width: 0px; max-width: 1106px; min-height: 0px; width: 262px; height: 31px;" /> Basic features include headings, block quotes, <img id="target-img" src="https://services.syncfusion.com/js/production/RichTextEditor/Screenshot 2024-12-05 130431.png" class="e-rte-image e-img-inline" alt="Screenshot 2024-12-05 130431" width="180" height="38" style="min-width: 0px; max-width: 1106px; min-height: 0px; width: 180px; height: 38px;" /> numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li></ul>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                value: innerHTML,
            });
            rteEle = rteObj.element,
                controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Apply align right and check the e-active class addition ', (done: Function) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                const quickToolbar: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                const alignment: HTMLElement = quickToolbar.querySelectorAll('.e-toolbar-item')[3].firstElementChild as HTMLElement;
                alignment.click();
                const dropDownPopup: HTMLElement = document.body.querySelector('.e-dropdown-popup.e-popup-open');
                (dropDownPopup.querySelectorAll('.e-item')[2] as HTMLElement).click();
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelector('img').classList.contains('e-img-right')).toBe(true);
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(function () {
                        var imageQTBarEle = document.querySelector('.e-rte-quick-popup');
                        (imageQTBarEle.querySelector("[title='Align']").firstChild as HTMLElement).click();
                        setTimeout(() => {
                            expect((document.getElementById(controlId + '_quick_Align-popup').firstChild.childNodes[2] as HTMLElement).classList.contains('e-active')).toBe(true);
                            (imageQTBarEle.querySelector('.e-icon-right') as HTMLElement).click();
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('944693 - Image Alignment Dropdown Displays Incorrect Selection After Changing Alignment - Iframe ', () => {
        let rteEle: HTMLElement;
        let controlId: string;
        let rteObj: RichTextEditor;
        let innerHTML: string = `<ul> <li style="cursor: auto;"><img src="https://services.syncfusion.com/js/production/RichTextEditor/Screenshot 2024-12-03 115549.png" class="e-rte-image e-img-inline" alt="Screenshot 2024-12-03 115549" width="262" height="31" style="min-width: 0px; max-width: 1106px; min-height: 0px; width: 262px; height: 31px;" /> Basic features include headings, block quotes, <img id="target-img" src="https://services.syncfusion.com/js/production/RichTextEditor/Screenshot 2024-12-05 130431.png" class="e-rte-image e-img-inline" alt="Screenshot 2024-12-05 130431" width="180" height="38" style="min-width: 0px; max-width: 1106px; min-height: 0px; width: 180px; height: 38px;" /> numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li></ul>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image', 'Bold']
                },
                iframeSettings: {
                    enable: true
                },
                value: innerHTML,
            });
            rteEle = rteObj.element,
                controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Apply align right and check the e-active class addition ', (done: Function) => {
            let iframeBody = (document.querySelector('iframe')).contentWindow.document.body;
            let target: HTMLElement = (iframeBody.firstChild as HTMLElement).querySelector('#target-img');
            let args = {
                preventDefault: function () { },
                originalEvent: { currentTarget: document.getElementById('rte_toolbarItems') },
                item: {},
            };
            let range = new NodeSelection().getRange(document);
            let save = new NodeSelection().save(range, document);
            let evnArg: any = { args, self: (<any>rteObj).imageModule, selection: save, selectNode: [target], link: null, target: '' };
            evnArg.item = { command: 'Images', subCommand: 'JustifyRight' };
            evnArg.e = args;
            (<any>rteObj).imageModule.alignmentSelect(evnArg);
            evnArg.args.item = { command: 'Images', subCommand: 'JustifyRight' };
            (<any>rteObj).imageModule.alignImage(evnArg, 'JustifyRight');
            setTimeout(function () {
                expect((iframeBody.firstChild as HTMLElement).querySelector('#target-img').classList.contains('e-img-right')).toBe(true);
                setCursorPoint(target, 0);
                dispatchEvent(target, 'mousedown');
                target.click();
                dispatchEvent(target, 'mouseup');
                setTimeout(function () {
                    var imageQTBarEle = document.querySelector('.e-rte-quick-popup');
                    (imageQTBarEle.querySelector("[title='Align']").firstChild as HTMLElement).click();
                    setTimeout(() => {
                        expect((document.getElementById(controlId + '_quick_Align-popup').firstChild.childNodes[2] as HTMLElement).classList.contains('e-active')).toBe(true);
                        (imageQTBarEle.querySelector('.e-icon-right') as HTMLElement).click();
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    xdescribe("867960 - beforeQuickToolbarOpen event args positionX and positionY doesn't change the position of image quicktoolbar in RichTextEditor.", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<p><img class='e-rte-image e-img-center' id="image" alt="Logo" src="https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png" style="width: 300px;">`,
                beforeQuickToolbarOpen: function (args) {
                    args.positionX = 200;
                    args.positionY = 200;
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Dynamically modify the quick toolbar position in the beforeQuickToolbarOpen event.', (done) => {
            let image: HTMLElement = rteObj.element.querySelector("#image");
            setCursorPoint(image, 0);
            dispatchEvent(image, 'mousedown');
            image.click();
            dispatchEvent(image, 'mouseup');
            setTimeout(() => {
                expect(parseInt((document.querySelector(".e-image-quicktoolbar.e-rte-elements.e-rte-quick-popup") as any).style.left) < 250).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Changing Alignment to the Image.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>`
            })
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should change the alignment from left to center to right.', (done: DoneFn) => {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                (dropDownBtn.firstElementChild as HTMLElement).click();
                const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                (alignDropDown.querySelector('.e-justify-center') as HTMLElement).click();
                expect(target.classList.contains('e-img-center')).toBe(true);
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-right') as HTMLElement).click();
                    expect(target.classList.contains('e-img-right')).toBe(true);
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                        (dropDownBtn.firstElementChild as HTMLElement).click();
                        const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (alignDropDown.querySelector('.e-justify-left') as HTMLElement).click();
                        expect(target.classList.contains('e-img-left')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('Image inserting link.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should insert the link to the image element.', (done: DoneFn) => {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                const imageButton: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[7] as HTMLElement;
                imageButton.click();
                setTimeout(() => {
                    const dialog: HTMLElement = document.querySelector('.e-dialog');
                    const inputElem: HTMLInputElement = dialog.querySelector('.e-input');
                    inputElem.value = 'https://ej2.syncfusion.com/demos/#/tailwind3/rich-text-editor/tools.html';
                    inputElem.dispatchEvent(new Event('input'));
                    const primaryButton: HTMLElement = dialog.querySelector('.e-rte-img-link-dialog');
                    primaryButton.click();
                    setTimeout(() => {
                        expect((target.parentElement as HTMLAnchorElement).href).toBe('https://ej2.syncfusion.com/demos/#/tailwind3/rich-text-editor/tools.html');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
        it('Should add the class name and then remove class name.', (done: DoneFn) => {
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                const toolbar: HTMLElement = quickPopup.querySelector('.e-toolbar');
                expect(toolbar.classList.contains('e-link-enabled')).toBe(true);
                const removeLink: HTMLElement = document.querySelectorAll('.e-link-groups')[2] as HTMLElement;
                removeLink.click();
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    expect(toolbar.classList.contains('e-link-enabled')).not.toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Image drag and drop from outside the editor to inside the editor.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<p>This is a text content.</p>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should insert the element in to the editor when the image is dropped into the editor.', (done: DoneFn) => {
            const file: File = getImageUniqueFIle();
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const eventInit: DragEventInit = {
                dataTransfer: dataTransfer,
                bubbles: true
            };
            const dropEvent: DragEvent = new DragEvent('drop', eventInit);
            editor.inputElement.querySelector('p').dispatchEvent(dropEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('img').length).toBe(1);
                done();
            }, 100);
        });
    });

    describe('Image drag and drop from paragraph to heading element inside the editor.', () => {
        let editor: RichTextEditor;
        beforeEach(() => {
            editor = renderRTE({
                value: `<p><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/></p><h1>This is a heading</h1>`
            });
        });
        afterEach(() => {
            destroy(editor);
        });
        it('Should insert the element in to the editor when the image is dropped into the editor.', (done: DoneFn) => {
            editor.focusIn();
            const heading: HTMLElement = editor.inputElement.querySelector('h1');
            heading.scrollIntoView();
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.items.add(editor.inputElement.innerHTML, 'text/html');
            const eventInit: DragEventInit = {
                dataTransfer: dataTransfer,
                bubbles: true
            };
            const dragStartEvent: DragEvent = new DragEvent('dragstart', eventInit);
            editor.inputElement.querySelector('img').dispatchEvent(dragStartEvent);
            const dragOverEvent: DragEvent = new DragEvent('dragover', eventInit);
            editor.inputElement.querySelector('img').dispatchEvent(dragOverEvent);
            const dragEnterEvent: DragEvent = new DragEvent('dragend', eventInit);
            editor.inputElement.querySelector('h1').dispatchEvent(dragEnterEvent);
            const clientRect: DOMRect = heading.getBoundingClientRect() as DOMRect;
            const dropEvent: DragEvent = new DragEvent('drop', {
                dataTransfer: dataTransfer,
                clientX: clientRect.x + 100,
                clientY: clientRect.y,
                bubbles: true
            });
            heading.dispatchEvent(dropEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('h1 img').length).toBe(1);
                done();
            }, 100);
        });

        it('Should not insert the element in to the editor when the image is dropped into the toolbar.', (done: DoneFn) => {
            editor.focusIn();
            const heading: HTMLElement = editor.inputElement.querySelector('h1');
            heading.scrollIntoView();
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.items.add(editor.inputElement.innerHTML, 'text/html');
            const eventInit: DragEventInit = {
                dataTransfer: dataTransfer,
            };
            const dragStartEvent: DragEvent = new DragEvent('dragstart', eventInit);
            editor.inputElement.querySelector('img').dispatchEvent(dragStartEvent);
            const dragOverEvent: DragEvent = new DragEvent('dragover', eventInit);
            editor.inputElement.querySelector('img').dispatchEvent(dragOverEvent);
            const dragEnterEvent: DragEvent = new DragEvent('dragend', eventInit);
            editor.inputElement.querySelector('h1').dispatchEvent(dragEnterEvent);
            const toolbar: HTMLElement = editor.element.querySelector('.e-toolbar');
            const clientRect: DOMRect = toolbar.getBoundingClientRect() as DOMRect;
            const dropEvent: DragEvent = new DragEvent('drop', {
                dataTransfer: dataTransfer,
                clientX: clientRect.x,
                clientY: clientRect.y
            });
            toolbar.dispatchEvent(dropEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('h1 img').length).not.toBe(1);
                done();
            }, 100);
        });
    });

    describe('Use quick toolbar to change the Image size. CASE 1: 100px value', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<p><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/></p>`,
                quickToolbarSettings: {
                    image: ['Dimension']
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should change the image width and height value using image size.', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                const sizeButton: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[0] as HTMLElement;
                sizeButton.click();
                setTimeout(() => {
                    const imageDialog: HTMLElement = editor.element.querySelector('.e-rte-img-dialog');
                    const widthInput: HTMLInputElement = imageDialog.querySelector('#imgwidth');
                    const heightInput: HTMLInputElement = imageDialog.querySelector('#imgheight');
                    widthInput.value = '100px';
                    heightInput.value = '100px';
                    const inputEvent: Event = new Event('input');
                    widthInput.dispatchEvent(inputEvent);
                    heightInput.dispatchEvent(inputEvent);
                    const primaryButton: HTMLButtonElement = imageDialog.querySelector('.e-footer-content .e-primary');
                    primaryButton.click();
                    setTimeout(() => {
                        expect(editor.inputElement.querySelector('img').style.width).toBe('100px');
                        expect(editor.inputElement.querySelector('img').style.height).toBe('100px');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('Use quick toolbar to change the Image size. CASE 2: Auto value', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<p><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/></p>`,
                quickToolbarSettings: {
                    image: ['Dimension']
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should change the image width and height value using image size.', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                const sizeButton: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[0] as HTMLElement;
                sizeButton.click();
                setTimeout(() => {
                    const imageDialog: HTMLElement = editor.element.querySelector('.e-rte-img-dialog');
                    const widthInput: HTMLInputElement = imageDialog.querySelector('#imgwidth');
                    const heightInput: HTMLInputElement = imageDialog.querySelector('#imgheight');
                    widthInput.value = 'auto';
                    heightInput.value = 'auto';
                    const inputEvent: Event = new Event('input');
                    widthInput.dispatchEvent(inputEvent);
                    heightInput.dispatchEvent(inputEvent);
                    const primaryButton: HTMLButtonElement = imageDialog.querySelector('.e-footer-content .e-primary');
                    primaryButton.click();
                    setTimeout(() => {
                        expect(editor.inputElement.querySelector('img').style.width).toBe('');
                        expect(editor.inputElement.querySelector('img').style.height).toBe('');
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('960605 - Image captions contentEditable attribute is not set to false when reusing extracted HTML content in the RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: `<div style="display: inline-block; width: 60%; vertical-align: top; cursor: auto;"><span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" width="309" style="min-width: 10px; min-height: 10px; width: 309px; height: 174px;" class="e-rte-image" height="174"><span class="e-img-caption-text" contenteditable="false">Test</span></span></span></div>`
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it("The contentEditable attribute of the image caption element is correctly set to true when loading content into the RichTextEdito.", (done) => {
            const imageCaption = rteObj.element.querySelector(".e-img-caption-container .e-img-caption-text");
             setTimeout(function () {
                expect(imageCaption.getAttribute('contenteditable') === 'true').toBe(true);
                done();
            }, 100);
        });
    });

    xdescribe('Quick toolbar multiple images one by one testing.', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<p><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/></p><p><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:300px; height: 200px"/></p>`,
                quickToolbarSettings: {
                    image: ['Dimension']
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should close the current quick toolbar and then open other quick toolbar..', (done: DoneFn) => {
            editor.focusIn();
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                expect(quickPopup.classList.contains('e-popup-open')).toBe(true);
                const target: HTMLElement = editor.inputElement.querySelectorAll('img')[1];
                target.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    expect(quickPopup).toBe(null);
                    const target: HTMLElement = editor.inputElement.querySelectorAll('img')[1];
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        expect(quickPopup.classList.contains('e-popup-open')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('960605 - Deleting image using quick toolbar and then press enter key was not working in RichTextEditor', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: `<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-img-inline"></p>`
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
        it("The deleting image using the quick toolbar and then pressing the enter key was not working in RichTextEditor.", (done) => {
            rteObj.focusIn();
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
             setTimeout(function () {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                const deleteButton: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[14] as HTMLElement;
                deleteButton.click();
                expect(rteObj.inputElement.innerHTML === '<p><br></p>').toBe(true);
                done();
            }, 100);
        });
    });

    describe('Image Alignment, Caption and Wrap apply use cases ', () => {
        describe('988805: caption and alignment apply and caption text restore use cases', () => {
            let rteObj: RichTextEditor;
            beforeEach(() => {
                rteObj = renderRTE({
                    value: `<h1>Welcome to the Syncfusion Rich Text Editor</h1>
                    <p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user inter<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 15%" class="e-rte-image e-img-inline"/> face that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>`
                });
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it(" - Should apply the image caption and inline image.", (done: DoneFn) => {
                    let inputElement: HTMLElement = rteObj.inputElement;
                    inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    const target: HTMLElement = rteObj.inputElement.querySelector('img');
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[1] as HTMLElement).click();
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-img-caption-container.e-img-inline'))).toBe(true);
                        done();
                    }, 100);
                });
            it(" - should apply image inline class to the image element when inline is applied on caption image", (done: DoneFn) => {
                let inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                    captionBtn.click();
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-img-caption-container.e-img-break'))).toBe(false);
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-img-inline .e-rte-image'))).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(" - should apply image break class to the image element and maintain image caption to the wrapper span element after applying break", (done: DoneFn) => {
                let inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                    captionBtn.click();
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-img-caption-container.e-img-break'))).toBe(true);
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-img-break .e-rte-image'))).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(" - should apply image inline when inline is applied on the left aligned image", (done: DoneFn) => {
                let inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-left') as HTMLElement).click();
                    expect(!isNullOrUndefined(inputElement.querySelector('.e-rte-image.e-img-left'))).toBe(true);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-rte-image.e-img-left'))).toBe(false);
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-rte-image.e-img-inline'))).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(" - should apply image inline when inline is applied to right aligned image", (done: DoneFn) => {
                let inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-right') as HTMLElement).click();
                    expect(!isNullOrUndefined(inputElement.querySelector('.e-rte-image.e-img-right'))).toBe(true);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-rte-image.e-img-right'))).toBe(false);
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-rte-image.e-img-inline'))).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(" - should maintain old caption content when applying inline to already captioned image and again applying caption", (done: DoneFn) => {
                let inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                    captionBtn.click();
                    expect(inputElement.querySelector('.e-img-caption-text').textContent === 'Caption').toBe(true);
                    inputElement.querySelector('.e-img-caption-text').textContent = 'Updated Caption';
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                        captionBtn.click();
                        target.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                            const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                            captionBtn.click();
                            expect(!isNullOrUndefined(inputElement.querySelector('.e-img-caption-container.e-img-inline'))).toBe(true);
                            expect(!isNullOrUndefined(inputElement.querySelector('.e-img-caption-text'))).toBe(true);
                            expect(inputElement.querySelector('.e-img-caption-text').textContent === 'Updated Caption').toBe(true);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            });
            it(" - should maintain old caption content when caption is applied to already applied captioned image to revert it and again applying caption", (done: DoneFn) => {
                let inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                    captionBtn.click();
                    inputElement.querySelector('.e-img-caption-text').textContent = 'Updated Caption';
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                        captionBtn.click();
                        target.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                            const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                            captionBtn.click();
                            expect(inputElement.querySelector('.e-img-caption-text').textContent === 'Updated Caption').toBe(true);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            });
        });

        describe('988805: check display and alignment dropdown e-active states', () => {
            let editor: RichTextEditor;
            beforeEach(() => {
                editor = renderRTE({
                    value: `<p>The Ri<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 15%;" class="e-rte-image e-img-inline"/> ch Text Editor.</p>`
                })
            });
            afterEach(() => {
                destroy(editor);
            });
            it(' - Should check the active state in quick toolbar alignment and display dropdown buttons', (done: DoneFn) => {
                const inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let imgEle: HTMLElement;
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    expect((displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).classList.contains('e-active')).toBe(true);
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-center') as HTMLElement).click();
                    imgEle = inputElement.querySelector('.e-rte-image.e-img-center');
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        expect((displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).classList.contains('e-active')).toBe(true);
                        const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                        (dropDownBtn.firstElementChild as HTMLElement).click();
                        const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        expect((alignDropDown.querySelector('ul').childNodes[1] as HTMLElement).classList.contains('e-active')).toBe(true);
                        (alignDropDown.querySelector('.e-justify-right') as HTMLElement).click();
                        imgEle = inputElement.querySelector('.e-rte-image.e-img-right');
                        setCursorPoint(target, 0);
                        target.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                            const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                            (displayDropDownBtn.firstElementChild as HTMLElement).click();
                            const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                            expect((displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).classList.contains('e-active')).toBe(true);
                            const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                            (dropDownBtn.firstElementChild as HTMLElement).click();
                            const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                            expect((alignDropDown.querySelector('ul').childNodes[2] as HTMLElement).classList.contains('e-active')).toBe(true);
                            (alignDropDown.querySelector('.e-justify-left') as HTMLElement).click();
                            imgEle = inputElement.querySelector('.e-rte-image.e-img-left');
                            setCursorPoint(target, 0);
                            target.dispatchEvent(MOUSEUP_EVENT);
                            setTimeout(() => {
                                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                                const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                                (displayDropDownBtn.firstElementChild as HTMLElement).click();
                                const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                                expect((displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).classList.contains('e-active')).toBe(true);
                                const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                                (dropDownBtn.firstElementChild as HTMLElement).click();
                                const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                                expect((alignDropDown.querySelector('ul').childNodes[0] as HTMLElement).classList.contains('e-active')).toBe(true);
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            });
            it(' - Should check the active state in quick toolbar display dropdown buttons for wrap behavior', (done: DoneFn) => {
                const inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let imgEle: HTMLElement;
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    expect((displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).classList.contains('e-active')).toBe(true);
                    const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                    (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                    const wrapDropDownPopup: Element = document.querySelectorAll('.e-dropdown-popup.e-popup-open')[1];
                    (wrapDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                    imgEle = inputElement.querySelector('.e-rte-image.e-img-left-wrap');
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        expect((displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).classList.contains('e-active')).toBe(true);
                        const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                        (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                        const wrapDropDownPopup: Element = document.querySelectorAll('.e-dropdown-popup.e-popup-open')[1];
                        (wrapDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                        imgEle = inputElement.querySelector('.e-rte-image.e-img-right-wrap');
                        setCursorPoint(target, 0);
                        target.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                            const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                            (displayDropDownBtn.firstElementChild as HTMLElement).click();
                            const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                            expect((displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).classList.contains('e-active')).toBe(true);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            });
        });

        describe('988805: apply alignment and check styling', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    value: `<p>The Ri<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 15%;" class="e-rte-image e-img-inline"/> ch Text Editor.</p>`
                })
            });
            afterAll(() => {
                destroy(editor);
            });
            it(' - Should check the styling in each alignment mode', (done: DoneFn) => {
                const inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let computedStyle: CSSStyleDeclaration;
                let imgEle: HTMLElement;
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-center') as HTMLElement).click();
                    imgEle = inputElement.querySelector('.e-rte-image.e-img-center');
                    expect(!isNullOrUndefined(imgEle)).toBe(true);
                    computedStyle = window.getComputedStyle(imgEle);
                    expect(computedStyle.getPropertyValue('float')).toBe('none');
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                        (dropDownBtn.firstElementChild as HTMLElement).click();
                        const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (alignDropDown.querySelector('.e-justify-right') as HTMLElement).click();
                        imgEle = inputElement.querySelector('.e-rte-image.e-img-right');
                        expect(!isNullOrUndefined(imgEle)).toBe(true);
                        computedStyle = window.getComputedStyle(imgEle);
                        expect(computedStyle.getPropertyValue('float')).toBe('none');
                        setCursorPoint(target, 0);
                        target.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                            const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                            (dropDownBtn.firstElementChild as HTMLElement).click();
                            const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                            (alignDropDown.querySelector('.e-justify-left') as HTMLElement).click();
                            imgEle = inputElement.querySelector('.e-rte-image.e-img-left');
                            expect(!isNullOrUndefined(imgEle)).toBe(true);
                            computedStyle = window.getComputedStyle(imgEle);
                            expect(computedStyle.getPropertyValue('float')).toBe('none');
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            });
        });

        describe('988805: apply alignment to a captioned image', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    value: `<p>The Ri<span class="e-img-caption-container e-img-break" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 15%;" class="e-rte-image"/><span class="e-img-caption-text" contenteditable="false">Caption</span></span></span> ch Text Editor.</p>`
                })
            });
            afterAll(() => {
                destroy(editor);
            });
            it(' - Should apply center and then right and then left to the captioned image', (done: DoneFn) => {
                let inputElement: HTMLElement = editor.inputElement;
                let imgEle: HTMLElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-center') as HTMLElement).click();
                    imgEle = inputElement.querySelector('.e-img-center .e-rte-image');
                    expect(!isNullOrUndefined(imgEle)).toBe(true);
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                        (dropDownBtn.firstElementChild as HTMLElement).click();
                        const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (alignDropDown.querySelector('.e-justify-right') as HTMLElement).click();
                        imgEle = inputElement.querySelector('.e-img-right .e-rte-image');
                        expect(!isNullOrUndefined(imgEle)).toBe(true);
                        setCursorPoint(target, 0);
                        target.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                            const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                            (dropDownBtn.firstElementChild as HTMLElement).click();
                            const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                            (alignDropDown.querySelector('.e-justify-left') as HTMLElement).click();
                            imgEle = inputElement.querySelector('.e-img-left .e-rte-image');
                            expect(!isNullOrUndefined(imgEle)).toBe(true);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            });
        });

        describe('970452: apply inline to image', () => {
            let editor: RichTextEditor;
            beforeEach(() => {
                editor = renderRTE({
                    value: `<h1>Welcome to the Syncfusion Rich Text Editor</h1>
                    <p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user inter<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 15%" class="e-rte-image e-img-inline"/> face that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>`
                });
            });
            afterEach(() => {
                destroy(editor);
            });
            it(' - should apply image inline class to image element when inline is applied', (done: DoneFn) => {
                const inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                    expect(!isNullOrUndefined(inputElement.querySelector('.e-rte-image.e-img-inline'))).toBe(true);
                    done();
                }, 100);
            });
        });

        describe('970452: apply break to image', () => {
            let editor: RichTextEditor;
            beforeEach(() => {
                editor = renderRTE({
                    value: `<h1>Welcome to the Syncfusion Rich Text Editor</h1>
                    <p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user inter<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 15%" class="e-rte-image e-img-break"/> face that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>`
                });
            });
            afterEach(() => {
                destroy(editor);
            });
            it(' - should apply image break class to image element when break is applied', (done: DoneFn) => {
                const inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                    expect(!isNullOrUndefined(inputElement.querySelector('.e-rte-image.e-img-break'))).toBe(true);
                    done();
                }, 100);
            });
            it(' - should apply image break to image element when break is applied to captioned image', (done: DoneFn) => {
                const inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let imgEle: HTMLElement;
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[1] as HTMLElement).click();
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-img-break .e-rte-image'))).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
        });

        describe('970452: left and right wrap apply to images in different modes', () => {
            let editor: RichTextEditor;
            beforeEach(() => {
                editor = renderRTE({
                    value: `<h1>Welcome to the Syncfusion Rich Text Editor</h1>
                    <p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user inter<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 15%" class="e-rte-image e-img-inline"/> face that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>
                    <h2>Welcome to the Syncfusion Rich Text Editor</h2>`
                });
            });
            afterEach(() => {
                destroy(editor);
            });
            it(' - Should apply image left wrap class to image element when left wrap is applied and should check e-active state in quick toolbar dropdown', (done: DoneFn) => {
                const inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let computedStyle: CSSStyleDeclaration;
                let imgEle: HTMLElement;
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                    (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                    const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (wrapDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                    imgEle = inputElement.querySelector('.e-rte-image.e-img-left-wrap');
                    expect(!isNullOrUndefined(imgEle)).toBe(true);
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                        (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                        const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        expect((wrapDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).classList.contains('e-active')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(' - Should apply image right wrap class to image element when right wrap is applied and should check e-active state in quick toolbar dropdown', (done: DoneFn) => {
                const inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let computedStyle: CSSStyleDeclaration;
                let imgEle: HTMLElement;
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                    (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                    const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (wrapDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                    imgEle = inputElement.querySelector('.e-rte-image.e-img-right-wrap');
                    expect(!isNullOrUndefined(imgEle)).toBe(true);
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                        (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                        const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        expect((wrapDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).classList.contains('e-active')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(' - Should apply image left wrap class to image element when left wrap is applied to break applied image', (done: DoneFn) => {
                const inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let computedStyle: CSSStyleDeclaration;
                let imgEle: HTMLElement;
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                        (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                        const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (wrapDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                        imgEle = inputElement.querySelector('.e-rte-image.e-img-left-wrap');
                        expect(!isNullOrUndefined(imgEle)).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(' - Should apply image right wrap class to image element when right wrap is applied to break applied image', (done: DoneFn) => {
                const inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let computedStyle: CSSStyleDeclaration;
                let imgEle: HTMLElement;
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                        (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                        const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (wrapDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                        imgEle = inputElement.querySelector('.e-rte-image.e-img-right-wrap');
                        expect(!isNullOrUndefined(imgEle)).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(' - Should apply image left wrap class to image element when left wrap is applied to caption applied image', (done: DoneFn) => {
                const inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let computedStyle: CSSStyleDeclaration;
                let imgEle: HTMLElement;
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                    captionBtn.click();
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                        (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                        const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (wrapDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-img-caption-container.e-img-break'))).toBe(false);
                        imgEle = inputElement.querySelector('.e-img-left-wrap .e-rte-image');
                        expect(!isNullOrUndefined(imgEle)).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(' - Should apply image right wrap class to image element when right wrap is applied to caption applied image', (done: DoneFn) => {
                const inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let computedStyle: CSSStyleDeclaration;
                let imgEle: HTMLElement;
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                    captionBtn.click();
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                        (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                        const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (wrapDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-img-caption-container.e-img-break'))).toBe(false);
                        imgEle = inputElement.querySelector('.e-img-right-wrap .e-rte-image');
                        expect(!isNullOrUndefined(imgEle)).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(" - Should apply image left wrap class to image element when left wrap is applied to left aligned image", (done: DoneFn) => {
                let inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let imgEle: HTMLElement;
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-left') as HTMLElement).click();
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                        (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                        const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (wrapDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-img-caption-container.e-img-break'))).toBe(false);
                        imgEle = inputElement.querySelector('.e-rte-image.e-img-left-wrap');
                        expect(!isNullOrUndefined(imgEle)).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(" - Should apply image right wrap class to image element when right wrap is applied to right aligned image", (done: DoneFn) => {
                let inputElement: HTMLElement = editor.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                let imgEle: HTMLElement;
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-right') as HTMLElement).click();
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                        (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                        const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (wrapDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-img-caption-container.e-img-break'))).toBe(false);
                        imgEle = inputElement.querySelector('.e-rte-image.e-img-right-wrap');
                        expect(!isNullOrUndefined(imgEle)).toBe(true);
                        expect((imgEle.parentElement.nextElementSibling as HTMLElement).style.clear === '').toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(" - should apply image inline class to image element when inline is applied to left wrapped image", (done: DoneFn) => {
                let inputElement: HTMLElement = editor.inputElement;
                let imgEle: HTMLElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                    (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                    const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (wrapDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-rte-image.e-img-left-wrap'))).toBe(false);
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-rte-image.e-img-inline'))).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
            it(" - should apply image inline class to image element when inline is applied to right wrapped image", (done: DoneFn) => {
                let inputElement: HTMLElement = editor.inputElement;
                let imgEle: HTMLElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                    (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                    const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (wrapDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-rte-image.e-img-right-wrap'))).toBe(false);
                        expect(!isNullOrUndefined(inputElement.querySelector('.e-rte-image.e-img-inline'))).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
        });

        describe('Alignment, Caption and Wrap apply use case inside Iframe', () => {
            describe('988805: In Iframe - caption apply to image and restore caption use cases', () => {
                let rteObj: RichTextEditor;
                beforeEach(() => {
                    rteObj = renderRTE({
                        value: `<h1>Welcome to the Syncfusion Rich Text Editor</h1>
                        <p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user inter<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 15%" class="e-rte-image e-img-inline"/> face that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>`,
                        iframeSettings: {
                            enable: true
                        }
                    });
                });
                afterEach(() => {
                    destroy(rteObj);
                });
                it(" - Should apply the image caption and inline image.", (done: DoneFn) => {
                    let iframeBody: HTMLElement = (document.querySelector('iframe') as HTMLIFrameElement).contentWindow.document.body as HTMLElement;
                    iframeBody.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    let computedStyle: CSSStyleDeclaration;
                    const target: HTMLElement = rteObj.inputElement.querySelector('img');
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[1] as HTMLElement).click();
                        expect(!isNullOrUndefined(iframeBody.querySelector('.e-img-caption-container.e-img-inline'))).toBe(true);
                        done();
                    }, 100);
                });
                it(" - should check old caption content si restored afetr the captioned image is reverted and again applied", (done: DoneFn) => {
                    let iframeBody: HTMLElement = (document.querySelector('iframe') as HTMLIFrameElement).contentWindow.document.body as HTMLElement;
                    iframeBody.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                    let computedStyle: CSSStyleDeclaration;
                    const target: HTMLElement = rteObj.inputElement.querySelector('img');
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                        captionBtn.click();
                        expect(!isNullOrUndefined(iframeBody.querySelector('.e-img-caption-container.e-img-inline'))).toBe(true);
                        expect(!isNullOrUndefined(iframeBody.querySelector('.e-img-caption-text'))).toBe(true);
                        expect(iframeBody.querySelector('.e-img-caption-text').textContent === 'Caption').toBe(true);
                        iframeBody.querySelector('.e-img-caption-text').textContent = 'Updated Caption';
                        target.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                            const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                            captionBtn.click();
                            target.dispatchEvent(MOUSEUP_EVENT);
                            setTimeout(() => {
                                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                                const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                                captionBtn.click();
                                expect(!isNullOrUndefined(iframeBody.querySelector('.e-img-caption-container.e-img-inline'))).toBe(true);
                                expect(!isNullOrUndefined(iframeBody.querySelector('.e-img-caption-text'))).toBe(true);
                                expect(iframeBody.querySelector('.e-img-caption-text').textContent === 'Updated Caption').toBe(true);
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                });
            });

            // Will resolve when the editor manager caption changes are reverted
            // describe('970452: In Iframe - left and right wrap apply to images', () => {
            //     let editor: RichTextEditor;
            //     beforeEach(() => {
            //         editor = renderRTE({
            //             value: `<h1>Welcome to the Syncfusion Rich Text Editor</h1>
            //             <p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user inter<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 15%" class="e-rte-image e-img-inline"/> face that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>`,
            //             iframeSettings: {
            //                 enable: true
            //             }
            //         });
            //     });
            //     afterEach(() => {
            //         destroy(editor);
            //     });
            //     it(' - Should check image left wrap class applied to image and check e-active state in quick toolbar and check styling', (done: DoneFn) => {
            //         let iframeBody: HTMLElement = (document.querySelector('iframe') as HTMLIFrameElement).contentWindow.document.body as HTMLElement;
            //         iframeBody.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            //         let computedStyle: CSSStyleDeclaration;
            //         let imgEle: HTMLElement;
            //         const target: HTMLElement = iframeBody.querySelector('img');
            //         setCursorPoint(target, 0);
            //         target.dispatchEvent(MOUSEUP_EVENT);
            //         setTimeout(() => {
            //             const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
            //             const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
            //             (wrapDropDownBtn.firstElementChild as HTMLElement).click();
            //             const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
            //             (wrapDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
            //             imgEle = iframeBody.querySelector('.e-rte-image.e-img-left-wrap');
            //             expect(!isNullOrUndefined(imgEle)).toBe(true);
            //             computedStyle = window.getComputedStyle(imgEle);
            //             expect(computedStyle.getPropertyValue('float')).toBe('left');
            //             setCursorPoint(target, 0);
            //             target.dispatchEvent(MOUSEUP_EVENT);
            //             setTimeout(() => {
            //                 const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
            //                 const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
            //                 (wrapDropDownBtn.firstElementChild as HTMLElement).click();
            //                 const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
            //                 expect((wrapDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).classList.contains('e-active')).toBe(true);
            //                 done();
            //             }, 100);
            //         }, 100);
            //     });
            //     it(' - Should check image right wrap class applied to image and check e-active state in quick toolbar and check styling', (done: DoneFn) => {
            //         let iframeBody: HTMLElement = (document.querySelector('iframe') as HTMLIFrameElement).contentWindow.document.body as HTMLElement;
            //         iframeBody.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            //         let computedStyle: CSSStyleDeclaration;
            //         let imgEle: HTMLElement;
            //         const target: HTMLElement = iframeBody.querySelector('img');
            //         setCursorPoint(target, 0);
            //         target.dispatchEvent(MOUSEUP_EVENT);
            //         setTimeout(() => {
            //             const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
            //             const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
            //             (wrapDropDownBtn.firstElementChild as HTMLElement).click();
            //             const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
            //             (wrapDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
            //             imgEle = iframeBody.querySelector('.e-rte-image.e-img-right-wrap');
            //             expect(!isNullOrUndefined(imgEle)).toBe(true);
            //             computedStyle = window.getComputedStyle(imgEle);
            //             expect(computedStyle.getPropertyValue('float')).toBe('right');
            //             setCursorPoint(target, 0);
            //             target.dispatchEvent(MOUSEUP_EVENT);
            //             setTimeout(() => {
            //                 const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
            //                 const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
            //                 (wrapDropDownBtn.firstElementChild as HTMLElement).click();
            //                 const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
            //                 expect((wrapDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).classList.contains('e-active')).toBe(true);
            //                 done();
            //             }, 100);
            //         }, 100);
            //     });
            // });
        });

        describe('970452: Insert new image and check caption restore', function () {
            let rteObj: RichTextEditor;
            let controlId: string;
            beforeAll(() => {
                rteObj = renderRTE({
                    enableAutoUrl: true,
                    toolbarSettings: {
                        items: ['Image']
                    }
                });
                controlId = rteObj.element.id;
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it("- should check old caption is restored when newly inserted image caption is reverted and again applied", (done: DoneFn) => {
                let inputElement: HTMLElement = rteObj.inputElement;
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Image');
                item.click();
                setTimeout(() => {
                    let dialogEle: any = document.querySelector('.e-dialog');
                    (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://js.syncfusion.com/demos/web/content/images/accordion/baked-chicken-and-cheese.png';
                    (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                    expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                    (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
                    let trg = (document.querySelector('.e-rte-image') as HTMLElement);
                    expect(!isNullOrUndefined(trg)).toBe(true);
                    expect(document.querySelectorAll('img').length).toBe(1);
                    const target: HTMLElement = rteObj.inputElement.querySelector('img');
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                        captionBtn.click();
                        inputElement.querySelector('.e-img-caption-text').textContent = 'Updated Caption';
                        target.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                            const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                            captionBtn.click();
                            target.dispatchEvent(MOUSEUP_EVENT);
                            setTimeout(() => {
                                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                                const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                                captionBtn.click();
                                expect(inputElement.querySelector('.e-img-caption-text').textContent === 'Updated Caption').toBe(true);
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            });
        });

        describe('970452: Apply left wrap to an image inside ancher tag', () => {
            let rteEle: HTMLElement;
            let rteObj: RichTextEditor;
            let innerHTML1: string = `
                <p>testing&nbsp;<span class="e-img-caption-container e-img-break" contenteditable="false" draggable="false" style="width:auto"><span class="e-img-wrap"><a href="http://www.google.com" contenteditable="true" target="_blank"><img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:20%;" class="e-rte-image"/></a><span class="e-img-caption-text" contenteditable="true">Caption</span></span></span></p>
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
            it(' - should apply image left wrap class to image inside anchor tag', (done: Function) => {
                let inputElement: HTMLElement = rteObj.inputElement;
                let imgEle: HTMLElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(function () {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                    (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                    const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (wrapDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                    imgEle = inputElement.querySelector('.e-img-left-wrap .e-rte-image');
                    expect(!isNullOrUndefined(imgEle)).toBe(true);
                    done();
                }, 100);
            });
            it('should apply image right wrap class to image inside anchor tag', (done: Function) => {
                let inputElement: HTMLElement = rteObj.inputElement;
                let imgEle: HTMLElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(function () {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                    (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                    const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (wrapDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                    imgEle = inputElement.querySelector('.e-img-right-wrap .e-rte-image');
                    expect(!isNullOrUndefined(imgEle)).toBe(true);
                    done();
                }, 100);
            });
        });
    });

     describe('Should maintain cursor position when image caption is applied before setting dimensions', () => {
        let innerHTML: string = `<h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-img-inline" /></p>`;
        let editor: RichTextEditor;
        beforeAll((done: Function) => {
            editor = renderRTE({
                value: innerHTML,
                quickToolbarSettings: {
                    enable: true,
                    image: ['Caption', 'Dimension']
                }
            });
            done();
        });
        afterAll((done: Function) => {
            destroy(editor);
            done();
        });
        it('should prevent cursor from jumping to the start when image caption is applied before setting dimensions',(done) => {
            editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(function () {
                const quickToolbar: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                const caption: HTMLElement = quickToolbar.querySelectorAll('.e-toolbar-item')[0].firstElementChild as HTMLElement;
                caption.click();
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName).toBe('#text');
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                const dimension: HTMLElement = quickToolbar.querySelectorAll('.e-toolbar-item')[1].firstElementChild as HTMLElement;
                dimension.click();
                (document.querySelector('.e-update-size') as any).click();
                expect(window.getSelection().getRangeAt(0).startContainer.nodeName).toBe('IMG');
                done();
            },400);
        });
    });

    describe('977306: Resize Bar for Image in Syncfusion Rich Text Editor Renders With RTL enabled', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: `<h1>Welcome to the Syncfusion Rich Text Editor</h1>
                    <p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>
                    <h2>Do you know the key features of the editor?</h2>
                    <blockquote>
                    <p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p>
                    </blockquote>
                    <h2>Unlock the Power of Tables</h2>
                    <p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p>
                    <h2>Elevating Your Content with Images</h2>
                    <p>Images can be added to the<p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p> editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p>
                    <p>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p>
                    <p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-img-inline" /></p>`
                ,
                toolbarSettings: {
                    items: ['Image']
                },
                height: 400,
                enableRtl: true
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(('checking resize bar in Image'), (done: Function) => {
            let imgElem: HTMLElement = rteObj.element.querySelector('.e-rte-image');
            clickImage(imgElem as HTMLImageElement);
            setTimeout(() => {
                expect(rteObj.element.querySelectorAll('.e-img-resize').length).toBe(1);
                expect(rteObj.element.querySelectorAll('.e-rte-imageboxmark').length).toBe(4);
                done();
            }, 100);
        });
    });

    describe('986631: Image in checklist causing resize icon misalignment', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<h1>Welcome to the Syncfusion Rich Text Editor</h1>
<p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>
<h2>Do you know the key features of the editor?</h2>
<ul class="e-rte-checklist">
   <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li>
   <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li>
   <li>The toolbar has multi-row, expandable, <img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 15%;" class="e-rte-image e-img-inline"/> and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li>
   <li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li>
   <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li>
   <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li>
</ul>
<blockquote>
   <p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p>
</blockquote>
<h2>Unlock the Power of Tables</h2>
<p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p>`,
                toolbarSettings: {
                    items: ['Image']
                },
                height: 400
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it(('checking resize bar in Image in checklist'), (done: Function) => {
            let imgElem: HTMLElement = rteObj.element.querySelector('.e-rte-image');
            clickImage(imgElem as HTMLImageElement);
            setTimeout(() => {
                expect(rteObj.element.querySelectorAll('.e-img-resize').length).toBe(1);
                const imgBoxMarkEle: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-imageboxmark');
                expect(imgBoxMarkEle.length).toBe(4);
                expect(parseFloat(imgBoxMarkEle[0].style.top)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[0].style.left)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[1].style.top)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[1].style.left)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[2].style.top)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[2].style.left)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[3].style.top)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[3].style.left)).toBeGreaterThan(100);
                done();
            }, 100);
        });
        it(('checking resize bar in Image in checklist in rtl mode'), (done: Function) => {
            rteObj.enableRtl = true;
            rteObj.dataBind();
            expect(rteObj.element.classList.contains('e-rtl')).toBe(true);
            let imgElem: HTMLElement = rteObj.element.querySelector('.e-rte-image');
            clickImage(imgElem as HTMLImageElement);
            setTimeout(() => {
                expect(rteObj.element.querySelectorAll('.e-img-resize').length).toBe(1);
                const imgBoxMarkEle: NodeListOf<HTMLElement> = rteObj.element.querySelectorAll('.e-rte-imageboxmark');
                expect(imgBoxMarkEle.length).toBe(4);
                expect(parseFloat(imgBoxMarkEle[0].style.top)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[0].style.left)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[1].style.top)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[1].style.left)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[2].style.top)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[2].style.left)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[3].style.top)).toBeGreaterThan(100);
                expect(parseFloat(imgBoxMarkEle[3].style.left)).toBeGreaterThan(100);
                done();
            }, 100);
        });
    });

    describe('995183: Quick Toolbar Events Triggered Multiple Times During Image Drag and Drop', () => {
        let editor: RichTextEditor;
        let beforeQuicktoolbaropenCount: number = 0;
        let quicktoolbaropenCount: number = 0;
        beforeAll(() => {
            editor = renderRTE({
                value: `<p>This is a text content.</p>`,
                beforeQuickToolbarOpen: (args: BeforeQuickToolbarOpenArgs) => {
                    beforeQuicktoolbaropenCount++;
                },
                quickToolbarOpen: (args) => {
                    quicktoolbaropenCount++;
                }
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Should beforeQuickToolbarOpen and quickToolbarOpen event trigger only once when drop an image in to the editor', (done: DoneFn) => {
            const file: File = getImageUniqueFIle();
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const eventInit: DragEventInit = {
                dataTransfer: dataTransfer,
                bubbles: true,
                clientX: 40,
                clientY: 294,
            };
            const dropEvent: DragEvent = new DragEvent('drop', eventInit);
            editor.inputElement.querySelector('p').dispatchEvent(dropEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('img').length).toBe(1);
                expect(beforeQuicktoolbaropenCount).toBe(1);
                expect(quicktoolbaropenCount).toBe(1);
                done();
            }, 100);
        });
    });

    describe('997311: Editor gets broken when we continuously drag and drop the images and delete them in the RichTextEditor', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<p>This is a text content.</p>`,
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it(' - should check the resize gripper size change after the image is resized', (done: DoneFn) => {
            const file: File = getImageUniqueFIle();
            const dataTransfer: DataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const eventInit: DragEventInit = {
                dataTransfer: dataTransfer,
                bubbles: true,
                clientX: 40,
                clientY: 294,
            };
            const dropEvent: DragEvent = new DragEvent('drop', eventInit);
            editor.inputElement.querySelector('p').dispatchEvent(dropEvent);
            setTimeout(() => {
                const image = editor.inputElement.querySelectorAll('img');
                expect(image.length).toBe(1);
                const gripper: ImageResizeGripper = 'e-rte-topRight';
                const gripperElement: HTMLElement = document.querySelector(`.${gripper}`);
                clickGripper(gripperElement);
                const gripperElementLeftSize = gripperElement.style.left;
                moveGripper(gripperElement, 300, 100);
                leaveGripper(gripperElement);
                setTimeout(() => {
                    expect(gripperElement.style.left > gripperElementLeftSize).toBe(true);
                    done();
                }, 150);
            }, 100);
        });
    });

    describe('1001154: Multi‑Image Paste Support in Rich Text Editor', () => {
        describe('Paste multiple images at cursor position', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    value: `<p>This is a text content.</p>`
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it('Should insert multiple images at the cursor position', (done: DoneFn) => {
                editor.focusIn();
                const p: HTMLElement = editor.inputElement.querySelector('p');
                const textNode: Text = p.firstChild as Text;
                setCursorPoint(textNode, 2);
                const clipboardData: DataTransfer = new DataTransfer();
                const file1: File = getImageUniqueFIle();
                const file2: File = getImageUniqueFIle();
                clipboardData.items.add(file1);
                clipboardData.items.add(file2);
                const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                    clipboardData: clipboardData,
                    bubbles: true,
                    cancelable: true
                } as ClipboardEventInit);
                editor.inputElement.dispatchEvent(pasteEvent);
                setTimeout(() => {
                    const imgs: NodeListOf<HTMLImageElement> = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBe(2);
                    done();
                }, 200);
            });
        });
        describe('Paste multiple images over selection', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    value: `<p>This is a text content.</p>`
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it('Should replace the selection with multiple images', (done: DoneFn) => {
                editor.focusIn();
                const p: HTMLElement = editor.inputElement.querySelector('p');
                const textNode: Text = p.firstChild as Text;
                editor.formatter.editorManager.nodeSelection.setSelectionText(editor.contentModule.getDocument(), textNode, textNode, 5, 9);
                const clipboardData: DataTransfer = new DataTransfer();
                const file1: File = getImageUniqueFIle();
                const file2: File = getImageUniqueFIle();
                clipboardData.items.add(file1);
                clipboardData.items.add(file2);
                const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                    clipboardData: clipboardData,
                    bubbles: true,
                    cancelable: true
                } as ClipboardEventInit);
                editor.inputElement.dispatchEvent(pasteEvent);

                setTimeout(() => {
                    const imgs: NodeListOf<HTMLImageElement> = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBe(2);
                    done();
                }, 200);
            });
        });
        describe('Multi‑Image paste with PasteCleanup prompt enabled', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    pasteCleanupSettings: {
                        prompt: true,
                    },
                    value: '<p>Sample content</p>'
                });
            });
            afterAll(() => {
                destroy(editor);
            });

            it('Should insert multiple images at the cursor position and place cursor after the last image', (done: DoneFn) => {
                editor.focusIn();
                const p: HTMLElement = editor.inputElement.querySelector('p');
                const textNode: Text = p.firstChild as Text;
                setCursorPoint(textNode, 6);
                const clipboardData: DataTransfer = new DataTransfer();
                const file1: File = getImageUniqueFIle();
                const file2: File = getImageUniqueFIle();
                clipboardData.items.add(file1);
                clipboardData.items.add(file2);
                const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                    clipboardData: clipboardData,
                    bubbles: true,
                    cancelable: true
                } as ClipboardEventInit);
                editor.inputElement.dispatchEvent(pasteEvent);
                setTimeout(() => {
                    if (editor.pasteCleanupSettings.prompt) {
                        let keepFormat: any = document.getElementById(editor.getID() + '_pasteCleanupDialog').getElementsByClassName('e-rte-keepformat');
                        keepFormat[0].click();
                        let pasteOK: any = document.getElementById(editor.getID() + '_pasteCleanupDialog').getElementsByClassName('e-rte-pasteok');
                        pasteOK[0].click();
                    }
                    const imgs: NodeListOf<HTMLImageElement> = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBe(2);
                    done();
                }, 200);
            });

            it('Should replace selection with multiple images when pasting over a selection', (done: DoneFn) => {
                editor.value = '<p>This is a text content.</p>';
                editor.dataBind();
                editor.focusIn();
                const p: HTMLElement = editor.inputElement.querySelector('p');
                const textNode: Text = p.firstChild as Text;
                editor.formatter.editorManager.nodeSelection.setSelectionText(
                    editor.contentModule.getDocument(),
                    textNode, textNode, 10, 14
                );
                const clipboardData: DataTransfer = new DataTransfer();
                const file1: File = getImageUniqueFIle();
                const file2: File = getImageUniqueFIle();
                clipboardData.items.add(file1);
                clipboardData.items.add(file2);
                const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                    clipboardData: clipboardData,
                    bubbles: true,
                    cancelable: true
                } as ClipboardEventInit);
                editor.inputElement.dispatchEvent(pasteEvent);
                setTimeout(() => {
                    if (editor.pasteCleanupSettings.prompt) {
                        let keepFormat: any = document.getElementById(editor.getID() + '_pasteCleanupDialog').getElementsByClassName('e-rte-keepformat');
                        keepFormat[0].click();
                        let pasteOK: any = document.getElementById(editor.getID() + '_pasteCleanupDialog').getElementsByClassName('e-rte-pasteok');
                        pasteOK[0].click();
                    }
                    const imgs: NodeListOf<HTMLImageElement> = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBe(2);
                    done();
                }, 200);
            });
        });
        describe('Drag and Drop - Multiple Images', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    value: '<p>Drop here</p>'
                });
            });
            afterAll(() => {
                destroy(editor);
            });

            it('Should insert multiple images when dropping more than one file', (done: DoneFn) => {
                const file1: File = getImageUniqueFIle();
                const file2: File = getImageUniqueFIle();
                const dataTransfer: DataTransfer = new DataTransfer();
                dataTransfer.items.add(file1);
                dataTransfer.items.add(file2);
                const eventInit: DragEventInit = {
                    dataTransfer: dataTransfer,
                    bubbles: true,
                    clientX: 40,
                    clientY: 294,
                };
                const dropEvent: DragEvent = new DragEvent('drop', eventInit);
                editor.inputElement.querySelector('p').dispatchEvent(dropEvent);
                setTimeout(() => {
                    const imgs: NodeListOf<HTMLImageElement> = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBe(2);
                    done();
                }, 200);
            });
        });
        describe('Multiple images drag and drop - QuickToolbar Event', () => {
            let editor: RichTextEditor;
            let beforeQuickToolbarOpenCount: number = 0;
            let quickToolbarOpenCount: number = 0;
            beforeAll(() => {
                editor = renderRTE({
                    value: '<p>Drop images here</p>',
                    beforeQuickToolbarOpen: () => { beforeQuickToolbarOpenCount++; },
                    quickToolbarOpen: () => { quickToolbarOpenCount++; },
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it('Should trigger quick toolbar open events only once for multiple dropped images', (done: DoneFn) => {
                editor.focusIn();
                const file1 = getImageUniqueFIle();
                const file2 = getImageUniqueFIle();
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file1);
                dataTransfer.items.add(file2);
                const editPanel = editor.contentModule.getEditPanel() as HTMLElement;
                const rect = editPanel.getBoundingClientRect();
                const clientX = Math.round(rect.left + rect.width * 0.5);
                const clientY = Math.round(rect.top + rect.height * 0.5);
                const dropEvent = new DragEvent('drop', {
                    bubbles: true,
                    cancelable: true,
                    dataTransfer,
                    clientX,
                    clientY,
                    screenX: clientX + window.screenX,
                    screenY: clientY + window.screenY
                });
                editPanel.dispatchEvent(dropEvent);
                setTimeout(() => {
                    const imgs: NodeListOf<HTMLImageElement> = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBeGreaterThanOrEqual(2);
                    const qtpops: NodeListOf<Element> = document.querySelectorAll('.e-rte-quick-popup');
                    expect(qtpops.length).toBe(1);
                    expect(beforeQuickToolbarOpenCount).toBe(1);
                    expect(quickToolbarOpenCount).toBe(1);
                    done();
                }, 1500);
            });
        });
        describe('Multiple images drag and drop when saveUrl is configured', () => {
            let editor: RichTextEditor;
            let beforeQuickToolbarOpenCount: number = 0;
            let quickToolbarOpenCount: number = 0;
            beforeAll(() => {
                editor = renderRTE({
                    value: '<p>Drop images here</p>',
                    insertImageSettings: {
                        saveUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/SaveFile',
                        path: 'https://ej2services.syncfusion.com/js/development/RichTextEditor/',
                    },
                    beforeQuickToolbarOpen: () => { beforeQuickToolbarOpenCount++; },
                    quickToolbarOpen: () => { quickToolbarOpenCount++; },
                });
            });

            afterAll(() => {
                destroy(editor);
            });
            it('Should insert two images when multiple files are dropped', (done: DoneFn) => {
                editor.focusIn();
                const file1 = getImageUniqueFIle();
                const file2 = getImageUniqueFIle();
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file1);
                dataTransfer.items.add(file2);
                const editPanel = editor.contentModule.getEditPanel() as HTMLElement;
                const rect = editPanel.getBoundingClientRect();
                const clientX = Math.round(rect.left + rect.width * 0.5);
                const clientY = Math.round(rect.top + rect.height * 0.5);
                const dropEvent = new DragEvent('drop', {
                    bubbles: true,
                    cancelable: true,
                    dataTransfer,
                    clientX,
                    clientY,
                    screenX: clientX + window.screenX,
                    screenY: clientY + window.screenY
                });
                // Dispatch on the edit panel itself → most reliable
                editPanel.dispatchEvent(dropEvent);
                setTimeout(() => {
                    const imgs = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBe(2);
                    done();
                }, 800);
            });
        });
        describe('Pasting multiple images with saveUrl configured should create uploader per image', () => {
            let editor: RichTextEditor;
            let uploadingCalls = 0;

            beforeAll(() => {
                editor = renderRTE({
                    value: `<p>Paste images here</p>`,
                    insertImageSettings: {
                        saveUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/SaveFile',
                        path: 'https://ej2services.syncfusion.com/js/development/RichTextEditor/'
                    },
                    imageUploading: () => { uploadingCalls++; },
                });
            });

            afterAll(() => {
                destroy(editor);
            });

            it('Should trigger imageUploading once for each pasted image', (done: DoneFn) => {
                editor.focusIn();
                const p: HTMLElement = editor.inputElement.querySelector('p');
                const textNode: Text = p.firstChild as Text;
                setCursorPoint(textNode, 4);
                const clipboardData: DataTransfer = new DataTransfer();
                const file1: File = getImageUniqueFIle();
                const file2: File = getImageUniqueFIle();
                clipboardData.items.add(file1);
                clipboardData.items.add(file2);
                const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                    clipboardData,
                    bubbles: true,
                    cancelable: true
                } as ClipboardEventInit);
                editor.inputElement.dispatchEvent(pasteEvent);
                setTimeout(() => {
                    expect(uploadingCalls).toBe(2);
                    const imgs: NodeListOf<HTMLImageElement> = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBeGreaterThanOrEqual(2);
                    done();
                }, 300);
            });
        });
        describe('Drag and drop multiple images with saveUrl configured should create uploader per image', () => {
            let editor: RichTextEditor;
            let uploadingCalls = 0;

            beforeAll(() => {
                editor = renderRTE({
                    value: `<p>Drop images here</p>`,
                    insertImageSettings: {
                        saveUrl: 'https://ej2services.syncfusion.com/js/development/api/RichTextEditor/SaveFile',
                        path: 'https://ej2services.syncfusion.com/js/development/RichTextEditor/'
                    },
                    imageUploading: () => { uploadingCalls++; },
                });
            });

            afterAll(() => {
                destroy(editor);
            });

            it('Should trigger imageUploading once for each dropped image', (done: DoneFn) => {
                editor.focusIn();
                const file1 = getImageUniqueFIle();
                const file2 = getImageUniqueFIle();
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file1);
                dataTransfer.items.add(file2);
                const editPanel = editor.contentModule.getEditPanel() as HTMLElement;
                const rect = editPanel.getBoundingClientRect();
                const clientX = Math.round(rect.left + rect.width * 0.5);
                const clientY = Math.round(rect.top + rect.height * 0.5);
                const dropEvent = new DragEvent('drop', {
                    bubbles: true,
                    cancelable: true,
                    dataTransfer,
                    clientX,
                    clientY,
                    screenX: clientX + window.screenX,
                    screenY: clientY + window.screenY
                });
                editPanel.dispatchEvent(dropEvent);
                setTimeout(() => {
                    expect(uploadingCalls).toBe(2);
                    const imgs: NodeListOf<HTMLImageElement> = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBeGreaterThanOrEqual(2);
                    done();
                }, 300);
            });
        });
        describe('Multi-Image Paste - PlainText setting', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    value: '<p>Start</p>',
                    pasteCleanupSettings: {
                        prompt: false,
                        plainText: true
                    }
                });
            });
            afterAll(() => {
                destroy(editor);
            });

            it('Should not insert images when plainText is true (clipboard with only files)', (done: DoneFn) => {
                editor.focusIn();
                const p: HTMLElement = editor.inputElement.querySelector('p');
                const textNode: Text = p.firstChild as Text;
                setCursorPoint(textNode, 5);
                const clipboardData: DataTransfer = new DataTransfer();
                const file1: File = getImageUniqueFIle();
                const file2: File = getImageUniqueFIle();
                clipboardData.items.add(file1);
                clipboardData.items.add(file2);
                const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                    clipboardData, bubbles: true, cancelable: true
                } as ClipboardEventInit);
                editor.inputElement.dispatchEvent(pasteEvent);
                setTimeout(() => {
                    const imgs = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBe(0);
                    expect(editor.inputElement.textContent.indexOf('Start') > -1).toBe(true);
                    done();
                }, 200);
            });
        });
        describe('Multi-Image Paste - Keep Format setting', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    value: '<p>Keep</p>',
                    pasteCleanupSettings: {
                        prompt: false,
                        keepFormat: true
                    }
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it('Should insert multiple images (keep format)', (done: DoneFn) => {
                editor.focusIn();
                const p: HTMLElement = editor.inputElement.querySelector('p');
                const textNode: Text = p.firstChild as Text;
                setCursorPoint(textNode, 2);
                const clipboardData: DataTransfer = new DataTransfer();
                const file1: File = getImageUniqueFIle();
                const file2: File = getImageUniqueFIle();
                clipboardData.items.add(file1);
                clipboardData.items.add(file2);
                const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                    clipboardData, bubbles: true, cancelable: true
                } as ClipboardEventInit);
                editor.inputElement.dispatchEvent(pasteEvent);
                setTimeout(() => {
                    const imgs: NodeListOf<HTMLImageElement> = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBe(2);
                    done();
                }, 200);
            });
        });
        describe('Multi-Image Paste - Keep Format setting', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    value: '<p>Keep</p>',
                    pasteCleanupSettings: {
                        prompt: false,
                        keepFormat: false
                    }
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it('Should insert multiple images (keep format)', (done: DoneFn) => {
                editor.focusIn();
                const p: HTMLElement = editor.inputElement.querySelector('p');
                const textNode: Text = p.firstChild as Text;
                setCursorPoint(textNode, 2);
                const clipboardData: DataTransfer = new DataTransfer();
                const file1: File = getImageUniqueFIle();
                const file2: File = getImageUniqueFIle();
                clipboardData.items.add(file1);
                clipboardData.items.add(file2);
                const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                    clipboardData, bubbles: true, cancelable: true
                } as ClipboardEventInit);
                editor.inputElement.dispatchEvent(pasteEvent);
                setTimeout(() => {
                    const imgs: NodeListOf<HTMLImageElement> = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBe(2);
                    done();
                }, 200);
            });
        });
        describe('Undo after multi-image paste via toolbar button', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    value: '<p>Initial content</p>',
                    toolbarSettings: { items: ['Undo', 'Image'] },
                    pasteCleanupSettings: { prompt: false }
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it('Should undo paste of multiple images using the Undo toolbar button', (done: DoneFn) => {
                editor.focusIn();
                const initialHtml: string = editor.inputElement.innerHTML;
                const p: HTMLElement = editor.inputElement.querySelector('p');
                const textNode: Text = p.firstChild as Text;
                setSelection(textNode, 0, textNode.length - 1);
                const data: DataTransfer = new DataTransfer();
                data.items.add(getImageUniqueFIle());
                data.items.add(getImageUniqueFIle());
                const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                    clipboardData: data,
                    bubbles: true,
                    cancelable: true
                } as ClipboardEventInit);
                editor.inputElement.dispatchEvent(pasteEvent);
                setTimeout(() => {
                    const imgs = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBe(2);
                    const undoBtn = editor.element.querySelector('#' + editor.element.id + '_toolbar_Undo') as HTMLElement;
                    expect(undoBtn).not.toBeNull();
                    undoBtn.click();
                    setTimeout(() => {
                        const imgsAfterUndo = editor.inputElement.querySelectorAll('img');
                        expect(imgsAfterUndo.length).toBe(0);
                        expect(editor.inputElement.innerHTML).toBe(initialHtml);
                        done();
                    }, 100);
                }, 200);
            });
        });
        describe('1003857: Redo after multi-image paste via toolbar button', () => {
            let editor: RichTextEditor;
            beforeAll(() => {
                editor = renderRTE({
                    value: '<p>Initial content</p>',
                    toolbarSettings: { items: ['Undo', 'Image', 'Redo'] },
                    pasteCleanupSettings: { prompt: false }
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it('Should undo paste of multiple images using the Undo toolbar button', (done: DoneFn) => {
                editor.focusIn();
                const initialHtml: string = editor.inputElement.innerHTML;
                const p: HTMLElement = editor.inputElement.querySelector('p');
                const textNode: Text = p.firstChild as Text;
                setSelection(textNode, 0, textNode.length - 1);
                const data: DataTransfer = new DataTransfer();
                data.items.add(getImageUniqueFIle());
                data.items.add(getImageUniqueFIle());
                const pasteEvent: ClipboardEvent = new ClipboardEvent('paste', {
                    clipboardData: data,
                    bubbles: true,
                    cancelable: true
                } as ClipboardEventInit);
                editor.inputElement.dispatchEvent(pasteEvent);
                setTimeout(() => {
                    const imgs = editor.inputElement.querySelectorAll('img');
                    expect(imgs.length).toBe(2);
                    const undoBtn = editor.element.querySelector('#' + editor.element.id + '_toolbar_Undo') as HTMLElement;
                    expect(undoBtn).not.toBeNull();
                    undoBtn.click();
                    setTimeout(() => {
                        const imgsAfterUndo = editor.inputElement.querySelectorAll('img');
                        expect(imgsAfterUndo.length).toBe(0);
                        expect(editor.inputElement.innerHTML).toBe(initialHtml);
                        const redoBtn = editor.element.querySelector('#' + editor.element.id + '_toolbar_Redo') as HTMLElement;
                        redoBtn.click();
                        setTimeout(() => {
                            const imgsAfterRedo = editor.inputElement.querySelectorAll('img');
                            expect(imgsAfterRedo.length).toBe(2);
                            done();
                        }, 100);
                    }, 100);
                }, 200);
            });
        });
    });

    describe('1011766 - Caption misaligned when image is resized to a smaller size', () => {
        let editor: RichTextEditor;
        let controlId: string;
        const htmlValue: string = `<h2>Welcome to the Syncfusion<sup>®</sup> Rich Text Editor</h2>
<p> The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here. </p>
<p style="cursor: auto;"> Images can be added to the editor by pasting or dragging into the editing area, us<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 208px;" class="e-rte-image e-img-inline" width="208"/>ing the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p>
<p> The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>. </p>`;
        beforeEach(() => {
            editor = renderRTE({
                value: htmlValue,
                insertImageSettings: { resize: true }
            });
            controlId = editor.element.id;
        });
        afterEach(() => {
            destroy(editor);
        });
        it('Should keep caption width in sync with the image width after resizing the captioned image by 2px', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement;
            inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                captionBtn.click();
                const imgEle: HTMLImageElement = editor.inputElement.querySelector('img') as HTMLImageElement;
                clickImage(imgEle);
                setTimeout(() => {
                    const resizeBot: HTMLElement = editor.contentModule.getEditPanel().querySelector('.e-rte-botRight') as HTMLElement;
                    clickGripper(resizeBot);
                    moveGripper(resizeBot, -2, 0);
                    leaveGripper(resizeBot);
                    setTimeout(() => {
                        const captionEle: HTMLElement = editor.inputElement.querySelector('.e-img-caption-container') as HTMLElement;
                        const resizedImg: HTMLImageElement = editor.inputElement.querySelector('img') as HTMLImageElement;
                        const captionWidth: number = parseFloat(captionEle.style.width);
                        const imageWidth: number = parseFloat(resizedImg.style.width);
                        expect(captionWidth).toBe(imageWidth);
                        expect(imageWidth === 206);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('1011499: Left wrap is not applying properly on captioned image - Rich Text Editor', () => {
        let editor: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            editor = renderRTE({
                enableAutoUrl: true,
                toolbarSettings: {
                    items: ['Image']
                }
            });
            controlId = editor.element.id;
        });
        afterAll(() => {
            destroy(editor);
        });
        it(' - Should apply left wrap to captioned image and image root block next sibling should not have clear property', (done: DoneFn) => {
            const inputElement: HTMLElement = editor.inputElement;
            // set the html value with caption applied and left image
            editor.inputElement.innerHTML = `<h1>Welcome to the Syncfusion Rich Text Editor</h1>
                <p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user inter<span class="e-img-caption-container e-img-left" contenteditable="false" draggable="false" style="width:232.419px"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: inherit;" class="e-rte-image"/><span class="e-img-caption-text" contenteditable="false">Caption</span></span></span>face that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>
                <h2>Do you know the key features of the editor?</h2>`;
            inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = editor.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                const wrapDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                (wrapDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                const imgEle: HTMLElement = inputElement.querySelector('.e-img-left-wrap .e-rte-image');
                expect(!isNullOrUndefined(imgEle)).toBe(true);
                expect(editor.inputElement.querySelector('h2').style.clear === '').toBe(true);
                done();
            }, 100);
        });
    });

    describe('1012644: Need to apply alignment, inline and break.', () => {
        describe(' For the images inside anchor tag', () => {
            let rteObj: RichTextEditor;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: { items: ['Image'] }
                });
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it(' - apply imageJustifyLeft to image', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<a href="http://www.google.com" target="_blank" aria-label="Open in new window"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-img-inline"></a>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-left') as HTMLElement).click();
                    expect(rteObj.inputElement.querySelector('a').classList.contains('e-img-left')).toBe(true);
                    done();
                }, 100);
            });
            it(' - apply imageJustifyCenter to image)', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<a href="http://www.google.com" target="_blank" aria-label="Open in new window"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-img-inline"></a>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-center') as HTMLElement).click();
                    expect(rteObj.inputElement.querySelector('a').classList.contains('e-img-center')).toBe(true);
                    done();
                }, 100);
            });
            it(' - apply imageJustifyRight to image', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<a href="http://www.google.com" target="_blank" aria-label="Open in new window"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-img-inline"></a>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-right') as HTMLElement).click();
                    expect(rteObj.inputElement.querySelector('a').classList.contains('e-img-right')).toBe(true);
                    done();
                }, 100);
            });
            it(' - apply imageInline to image', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<a href="http://www.google.com" target="_blank" aria-label="Open in new window"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-img-break"></a>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                    expect(rteObj.inputElement.querySelector('a').classList.contains('e-img-inline')).toBe(true);
                    done();
                }, 100);
            });
            it(' - apply imageBreak to image', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<a href="http://www.google.com" target="_blank" aria-label="Open in new window"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-img-inline"></a>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                    expect(rteObj.inputElement.querySelector('a').classList.contains('e-img-break')).toBe(true);
                    done();
                }, 100);
            });
        });
        describe(' For code coverage', () => {
            let rteObj: RichTextEditor;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: { items: ['Image'] }
                });
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it(' - apply imageJustifyLeft to image', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<a href="http://www.google.com" target="_blank" aria-label="Open in new window"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-img-left"></a>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-left') as HTMLElement).click();
                    done();
                }, 100);
            });
            it(' - apply imageJustifyCenter to image)', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<a href="http://www.google.com" target="_blank" aria-label="Open in new window"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-img-center"></a>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-center') as HTMLElement).click();
                    done();
                }, 100);
            });
            it(' - apply imageJustifyRight to image', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<a href="http://www.google.com" target="_blank" aria-label="Open in new window"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-img-right"></a>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-right') as HTMLElement).click();
                    done();
                }, 100);
            });
            it(' - apply imageInline to image', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<a href="http://www.google.com" target="_blank" aria-label="Open in new window"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-img-inline"></a>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                    done();
                }, 100);
            });
            it(' - apply imageBreak to image', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<a href="http://www.google.com" target="_blank" aria-label="Open in new window"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-img-break"></a>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                    done();
                }, 100);
            });
        });
    });

    describe('1014483: Alignment dropdown active state not maintained when caption is applied', () => {
        let rteObj: RichTextEditor;
        const innerHTML: string = `<p> Images can be added to the editor by pasting or dragging into the editing ar<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px;" class="e-rte-image e-img-inline"/>ea, using the toolbar to insert one as a URL, or uploading directly from the File Browser. </p>`;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Image']
                },
                value: innerHTML,
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Image caption + Inline and Break display preselects correct item', (done: DoneFn) => {
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('img');
            // Apply caption through quick toolbar (use existing quick-toolbar flow)
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickToolbar: HTMLElement = document.body.querySelector('.e-rte-quick-popup');
                const captionBtn: HTMLElement = quickToolbar.querySelectorAll('.e-toolbar-item')[1].firstElementChild as HTMLElement;
                captionBtn.click();
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup1: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup1.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup1: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup1.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        expect((displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).classList.contains('e-active')).toBe(true);
                        (displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                        setCursorPoint(target, 0);
                        target.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            const quickPopup1: HTMLElement = document.querySelector('.e-rte-quick-popup');
                            const displayDropDownBtn: HTMLElement = quickPopup1.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                            (displayDropDownBtn.firstElementChild as HTMLElement).click();
                            const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                            expect((displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).classList.contains('e-active')).toBe(true);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Image caption + Alignment left, center and right preselects correct items', (done: DoneFn) => {
            const target: HTMLElement = rteObj.inputElement.querySelector('img');
            // Test left, center and right alignment using the Align dropdown (matches other tests)
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const imageQTBarEle = document.querySelector('.e-rte-quick-popup');
                const alignBtn: HTMLElement = imageQTBarEle.querySelectorAll('.e-toolbar-item')[3].firstElementChild as HTMLElement;
                (alignBtn as HTMLElement).click();
                const dropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                // left
                (dropDownPopup.querySelectorAll('.e-item')[0] as HTMLElement).click();
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const imageQTBarEle2 = document.querySelector('.e-rte-quick-popup');
                    (imageQTBarEle2.querySelector("[title='Align']").firstChild as HTMLElement).click();
                    const popup2: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    expect((popup2.querySelectorAll('.e-item')[0] as HTMLElement).classList.contains('e-active')).toBe(true);
                    // center
                    (popup2.querySelectorAll('.e-item')[1] as HTMLElement).click();
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const imageQTBarEle3 = document.querySelector('.e-rte-quick-popup');
                        (imageQTBarEle3.querySelector("[title='Align']").firstChild as HTMLElement).click();
                        const popup3: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        expect((popup3.querySelectorAll('.e-item')[1] as HTMLElement).classList.contains('e-active')).toBe(true);
                        // right
                        (popup3.querySelectorAll('.e-item')[2] as HTMLElement).click();
                        setCursorPoint(target, 0);
                        target.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            const imageQTBarEle4 = document.querySelector('.e-rte-quick-popup');
                            (imageQTBarEle4.querySelector("[title='Align']").firstChild as HTMLElement).click();
                            const popup4: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                            expect((popup4.querySelectorAll('.e-item')[2] as HTMLElement).classList.contains('e-active')).toBe(true);
                            (imageQTBarEle4.querySelector('.e-icon-right') as HTMLElement).click();
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        it('Image caption + Wrap left and right preselects correct items', (done: DoneFn) => {
            const target: HTMLElement = rteObj.inputElement.querySelector('img');
            // left wrap: open wrap dropdown and click first item
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const imageQTBarEle = document.querySelector('.e-rte-quick-popup');
                const wrapDropDownBtn: HTMLElement = imageQTBarEle.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                (wrapDropDownBtn.firstElementChild as HTMLElement).click();
                const wrapDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                (wrapDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const imageQTBarEle2 = document.querySelector('.e-rte-quick-popup');
                    const wrapDropDownBtn2: HTMLElement = imageQTBarEle2.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                    (wrapDropDownBtn2.firstElementChild as HTMLElement).click();
                    const wrapDropDownPopup2: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    expect((wrapDropDownPopup2.querySelector('ul').childNodes[0] as HTMLElement).classList.contains('e-active')).toBe(true);
                    // right wrap
                    (wrapDropDownPopup2.querySelector('ul').childNodes[1] as HTMLElement).click();
                    setCursorPoint(target, 0);
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const imageQTBarEle3 = document.querySelector('.e-rte-quick-popup');
                        const wrapDropDownBtn3: HTMLElement = imageQTBarEle3.querySelectorAll('.e-toolbar-item')[5] as HTMLElement;
                        (wrapDropDownBtn3.firstElementChild as HTMLElement).click();
                        const wrapDropDownPopup3: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        expect((wrapDropDownPopup3.querySelector('ul').childNodes[1] as HTMLElement).classList.contains('e-active')).toBe(true);
                        (imageQTBarEle3.querySelector('.e-icon-right') as HTMLElement).click();
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('1014733: Caption breaks image width is a percentage (also occurs when setting % via size dialog)', function () {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableAutoUrl: true,
                toolbarSettings: {
                    items: ['Image']
                },
                quickToolbarSettings: {
                    image: ['Caption', 'Dimension']
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' Apply caption to inline image and check the width value for both image and caption container', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = '<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-imginline"></p>'
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                const captionBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[0] as HTMLElement;
                captionBtn.click();
                const captionWidthValue: string = (rteObj.inputElement.querySelector('.e-img-caption-container') as HTMLElement).style.width;
                const imageWidthValue: string = (rteObj.inputElement.querySelector('.e-rte-image') as HTMLElement).style.width;
                expect(captionWidthValue.indexOf('%') === -1).toBe(true);
                expect(imageWidthValue.indexOf('%') === -1).toBe(true);
                done();
            }, 100);
        });
        it('Should change the image width of % value using image change size toolbar action.', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p><span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width: 150px"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px; height: 200px" class="e-rte-image e-imginline"><span class="e-img-inner" contenteditable="true">Caption</span></span></span></p>`;
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                const sizeButton: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                sizeButton.click();
                setTimeout(() => {
                    const imageDialog: HTMLElement = rteObj.element.querySelector('.e-rte-img-dialog');
                    const widthInput: HTMLInputElement = imageDialog.querySelector('#imgwidth');
                    widthInput.value = '50%';
                    const inputEvent: Event = new Event('input');
                    widthInput.dispatchEvent(inputEvent);
                    const primaryButton: HTMLButtonElement = imageDialog.querySelector('.e-footer-content .e-primary');
                    primaryButton.click();
                    setTimeout(() => {
                        const captionWidthValue: string = (rteObj.inputElement.querySelector('.e-img-caption-container') as HTMLElement).style.width;
                        const imageWidthValue: string = (rteObj.inputElement.querySelector('.e-rte-image') as HTMLElement).style.width;
                        expect(captionWidthValue.indexOf('%') === -1).toBe(true);
                        expect(imageWidthValue.indexOf('%') === -1).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
        it('Should change the image width of auto value using image change size toolbar action.', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p><span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width: 150px"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px; height: 200px" class="e-rte-image e-imginline"><span class="e-img-inner" contenteditable="true">Caption</span></span></span></p>`;
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            const target: HTMLElement = rteObj.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                const sizeButton: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                sizeButton.click();
                setTimeout(() => {
                    const imageDialog: HTMLElement = rteObj.element.querySelector('.e-rte-img-dialog');
                    const widthInput: HTMLInputElement = imageDialog.querySelector('#imgwidth');
                    widthInput.value = 'auto';
                    const inputEvent: Event = new Event('input');
                    widthInput.dispatchEvent(inputEvent);
                    const primaryButton: HTMLButtonElement = imageDialog.querySelector('.e-footer-content .e-primary');
                    primaryButton.click();
                    setTimeout(() => {
                        const captionWidthValue: string = (rteObj.inputElement.querySelector('.e-img-caption-container') as HTMLElement).style.width;
                        const imageWidthValue: string = (rteObj.inputElement.querySelector('.e-rte-image') as HTMLElement).style.width;
                        expect(captionWidthValue === '').toBe(true);
                        expect(imageWidthValue === '').toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('1012644: Mock test case coverage for Blazor-mode: image command else-branches', () => {
        describe(' with only image', () => {
            let rteObj: RichTextEditor;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: { items: ['Image'] }
                });
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it(' - cover imageJustifyLeft else branch (Blazor)', (done: DoneFn) => {
                // Enable Blazor mode on the editor manager
                rteObj.formatter.editorManager.isBlazor = true;
                // set caption DOM
                rteObj.inputElement.innerHTML = `<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px" class="e-rte-image e-imginline">`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-left') as HTMLElement).click();
                    // Trigger display dropdown to convert left aligned to inline
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup2: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup2.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                        done();
                    }, 100);
                }, 100);
            });
            it(' - cover imageJustifyCenter else branch (Blazor)', (done: DoneFn) => {
                rteObj.formatter.editorManager.isBlazor = true;
                rteObj.inputElement.innerHTML = `<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px" class="e-rte-image e-imginline">`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-center') as HTMLElement).click();
                    done();
                }, 100);
            });
            it(' - cover imageJustifyRight else branch (Blazor)', (done: DoneFn) => {
                rteObj.formatter.editorManager.isBlazor = true;
                rteObj.inputElement.innerHTML = `<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px" class="e-rte-image e-imginline">`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-right') as HTMLElement).click();
                    // convert right aligned to inline
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup2: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup2.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                        done();
                    }, 100);
                }, 100);
            });
            it(' - cover imageInline else branch (Blazor)', (done: DoneFn) => {
                rteObj.formatter.editorManager.isBlazor = true;
                rteObj.inputElement.innerHTML = `<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px" class="e-rte-image e-imginline">`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    // choose inline option
                    (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                    done();
                }, 100);
            });
            it(' - cover imageBreak else branch (Blazor)', (done: DoneFn) => {
                rteObj.formatter.editorManager.isBlazor = true;
                // use caption dom
                rteObj.inputElement.innerHTML = `<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px" class="e-rte-image e-imginline">`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    // choose break option
                    (displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                    done();
                }, 100);
            });
        });
        describe(' with only caption', () => {
            let rteObj: RichTextEditor;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: { items: ['Image'] }
                });
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it(' - cover imageJustifyLeft else branch (Blazor)', (done: DoneFn) => {
                // Enable Blazor mode on the editor manager
                rteObj.formatter.editorManager.isBlazor = true;
                // set caption DOM
                rteObj.inputElement.innerHTML = `<span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width: 150px"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-imginline"><span class="e-img-inner" contenteditable="true">Caption</span></span></span>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-left') as HTMLElement).click();
                    // Trigger display dropdown to convert left aligned to inline
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup2: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup2.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                        done();
                    }, 100);
                }, 100);
            });
            it(' - cover imageJustifyCenter else branch (Blazor)', (done: DoneFn) => {
                rteObj.formatter.editorManager.isBlazor = true;
                rteObj.inputElement.innerHTML = `<span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width: 150px"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-imginline"><span class="e-img-inner" contenteditable="true">Caption</span></span></span>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-center') as HTMLElement).click();
                    done();
                }, 100);
            });
            it(' - cover imageJustifyRight else branch (Blazor)', (done: DoneFn) => {
                rteObj.formatter.editorManager.isBlazor = true;
                rteObj.inputElement.innerHTML = `<span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width: 150px"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-imginline"><span class="e-img-inner" contenteditable="true">Caption</span></span></span>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const dropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[3] as HTMLElement;
                    (dropDownBtn.firstElementChild as HTMLElement).click();
                    const alignDropDown: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    (alignDropDown.querySelector('.e-justify-right') as HTMLElement).click();
                    // convert right aligned to inline
                    target.dispatchEvent(MOUSEUP_EVENT);
                    setTimeout(() => {
                        const quickPopup2: HTMLElement = document.querySelector('.e-rte-quick-popup');
                        const displayDropDownBtn: HTMLElement = quickPopup2.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                        (displayDropDownBtn.firstElementChild as HTMLElement).click();
                        const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                        (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                        done();
                    }, 100);
                }, 100);
            });
            it(' - cover imageInline else branch (Blazor)', (done: DoneFn) => {
                rteObj.formatter.editorManager.isBlazor = true;
                rteObj.inputElement.innerHTML = `<span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width: 150px"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-imginline"><span class="e-img-inner" contenteditable="true">Caption</span></span></span>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    // choose inline option
                    (displayDropDownPopup.querySelector('ul').childNodes[0] as HTMLElement).click();
                    done();
                }, 100);
            });
            it(' - cover imageBreak else branch (Blazor)', (done: DoneFn) => {
                rteObj.formatter.editorManager.isBlazor = true;
                // use caption dom
                rteObj.inputElement.innerHTML = `<span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width: 150px"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px;" class="e-rte-image e-imginline"><span class="e-img-inner" contenteditable="true">Caption</span></span></span>`;
                const inputElement: HTMLElement = rteObj.inputElement;
                inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const displayDropDownBtn: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    (displayDropDownBtn.firstElementChild as HTMLElement).click();
                    const displayDropDownPopup: HTMLElement = document.querySelector('.e-dropdown-popup.e-popup-open');
                    // choose break option
                    (displayDropDownPopup.querySelector('ul').childNodes[1] as HTMLElement).click();
                    done();
                }, 100);
            });
        });
        describe('1014733: Caption breaks image width is a percentage (also occurs when setting % via size dialog)', function () {
            let rteObj: RichTextEditor;
            beforeAll(() => {
                rteObj = renderRTE({
                    enableAutoUrl: true,
                    toolbarSettings: {
                        items: ['Image']
                    },
                    quickToolbarSettings: {
                        image: ['Caption', 'Dimension']
                    }
                });
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it('Should change the image width and height using image change size toolbar action.', (done: DoneFn) => {
                rteObj.formatter.editorManager.isBlazor = true;
                rteObj.inputElement.innerHTML = `<p><span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width: 150px"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px; height: 200px" class="e-rte-image e-imginline"><span class="e-img-inner" contenteditable="true">Caption</span></span></span></p>`;
                rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const sizeButton: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                    sizeButton.click();
                    setTimeout(() => {
                        const imageDialog: HTMLElement = rteObj.element.querySelector('.e-rte-img-dialog');
                        const widthInput: HTMLInputElement = imageDialog.querySelector('#imgwidth');
                        const heightInput: HTMLInputElement = imageDialog.querySelector('#imgheight');
                        widthInput.value = 'auto';
                        heightInput.value = 'auto';
                        const inputEvent: Event = new Event('input');
                        widthInput.dispatchEvent(inputEvent);
                        heightInput.dispatchEvent(inputEvent);
                        const primaryButton: HTMLButtonElement = imageDialog.querySelector('.e-footer-content .e-primary');
                        primaryButton.click();
                        done();
                    }, 100);
                }, 100);
            });
            it('Should change the image width and height using image change size toolbar action.', (done: DoneFn) => {
                rteObj.formatter.editorManager.isBlazor = true;
                rteObj.inputElement.innerHTML = `<p><span class="e-img-caption e-rte-img-caption e-caption-inline" contenteditable="false" draggable="false" style="width: 150px"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px; height: 200px" class="e-rte-image e-imginline"><span class="e-img-inner" contenteditable="true">Caption</span></span></span></p>`;
                rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const sizeButton: HTMLElement = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                    sizeButton.click();
                    setTimeout(() => {
                        const imageDialog: HTMLElement = rteObj.element.querySelector('.e-rte-img-dialog');
                        const widthInput: HTMLInputElement = imageDialog.querySelector('#imgwidth');
                        const heightInput: HTMLInputElement = imageDialog.querySelector('#imgheight');
                        widthInput.value = '50px';
                        heightInput.value = '50px';
                        const inputEvent: Event = new Event('input');
                        widthInput.dispatchEvent(inputEvent);
                        heightInput.dispatchEvent(inputEvent);
                        const primaryButton: HTMLButtonElement = imageDialog.querySelector('.e-footer-content .e-primary');
                        primaryButton.click();
                        done();
                    }, 100);
                }, 100);
            });
        });
        describe('1014616: Replacing an image resets its display from “Break” to “Inline”', () => {
            let editor: RichTextEditor;
            function onActionBegin(e: ActionBeginEventArgs) {
                if (e.requestType === 'Replace') {
                    const url: string = e.itemCollection.url;
                    if (url.indexOf('?path') > -1) {
                        const newURL: string = url.replace('?path=', '');
                        e.itemCollection.url = newURL;
                    }
                }
            }
            beforeAll(() => {
                editor = renderRTE({
                    fileManagerSettings: {
                        enable: true,
                        path: '/Pictures/Employees',
                        ajaxSettings: {
                            url: hostURL + 'api/RichTextEditor/FileOperations',
                            getImageUrl: hostURL + 'api/RichTextEditor/GetImage',
                            uploadUrl: hostURL + 'api/RichTextEditor/Upload'
                        }
                    },
                    actionBegin: onActionBegin,
                });
            });
            afterAll(() => {
                destroy(editor);
            });
            it('Check the image src when replace image', (done: DoneFn) => {
                editor.formatter.editorManager.isBlazor = true;
                editor.inputElement.innerHTML = '<p><img src="https://ej2services.syncfusion.com/js/development/api/RichTextEditor/GetImage/Pictures/Employees/Adam.png" class="e-rte-image e-imgbreak" style="width: 150px; height: 400px;"/></p>';
                const INIT_MOUSEDOWN_EVENT: MouseEvent = new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT);
                editor.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
                const target: HTMLElement = editor.inputElement.querySelector('img');
                const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
                setCursorPoint(target, 0);
                target.dispatchEvent(MOUSEUP_EVENT);
                setTimeout(() => {
                    let pop: Element = document.body.querySelector('.e-rte-quick-popup');
                    (pop.querySelectorAll('.e-toolbar-item')[13].firstElementChild as HTMLElement).click();
                    setTimeout(() => {
                        (editor.fileManagerModule as any).fileObj.trigger('fileSelect', { fileDetails: { filterPath: '\\Pictures\\Employees\\', name: 'Andrew.png', isFile: true, type: '.png' } });
                        let insertBtn: HTMLButtonElement = document.body.querySelector('.e-rte-file-manager-dialog button.e-primary');
                        insertBtn.click();
                            done();
                    }, 100);
                }, 500);
            });
        });
    });

    describe('1014427: Image class normalization in SourceCode -> Preview', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: { items: ['SourceCode', 'Image'] }
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Use case 1 - caption wrapper classes normalized after switching from code view to preview', (done: DoneFn) => {
            const innerHTML = `<h3>Elevating Your Content with Images</h3>
<p> Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p>
<p> The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>. </p>
<p><span class="e-img-caption e-rte-img-caption e-imgbreak e-imgleft" draggable="false" style="width:auto"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px" class="e-rte-image e-imgleft"/><span class="e-img-inner" contenteditable="false">Caption</span></span></span></p>
<blockquote>
   <p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p>
</blockquote>`;
            const controlId = rteObj.element.id;
            (rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode') as HTMLElement).click();
            const src = rteObj.element.querySelector('.e-rte-srctextarea') as HTMLTextAreaElement;
            src.value = innerHTML;
            (rteObj.element.querySelector('#' + controlId + '_toolbar_Preview') as HTMLElement).click();
            setTimeout(() => {
                const caption = rteObj.inputElement.querySelector('.e-img-caption-container') as HTMLElement;
                expect(!isNullOrUndefined(caption)).toBe(true);
                expect(!isNullOrUndefined(caption.querySelector('.e-img-caption-text'))).toBe(true);
                expect(caption.classList.contains('e-img-left')).toBe(true);
                const img = rteObj.inputElement.querySelector('img') as HTMLImageElement;
                expect(img.classList.contains('e-rte-image')).toBe(true);
                // old/legacy classes should not be present
                expect(img.classList.contains('e-imgleft')).toBe(false);
                expect(caption.classList.contains('e-img-caption')).toBe(false);
                expect(caption.classList.contains('e-imgbreak')).toBe(false);
                done();
            }, 100);
        });
        it('Use case 2 - standalone image without caption normalized after switching from code view to preview', (done: DoneFn) => {
            const innerHTML = `<h3>Elevating Your Content with Images</h3>
<p> Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them. </p>
<p> The Editor can integrate with the Syncfusion<sup>®</sup> Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>. </p>
<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px;" class="e-imgbreak e-rte-image"/></p>
<blockquote>
   <p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p>
</blockquote>`;
            const controlId = rteObj.element.id;
            (rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode') as HTMLElement).click();
            const src = rteObj.element.querySelector('.e-rte-srctextarea') as HTMLTextAreaElement;
            src.value = innerHTML;
            (rteObj.element.querySelector('#' + controlId + '_toolbar_Preview') as HTMLElement).click();
            setTimeout(() => {
                const img = rteObj.inputElement.querySelector('img') as HTMLImageElement;
                expect(img.classList.contains('e-rte-image')).toBe(true);
                expect(img.classList.contains('e-img-break')).toBe(true);
                // legacy class should be removed
                expect(img.classList.contains('e-imgbreak')).toBe(false);
                done();
            }, 100);
        });
    });

    describe('1014616 Replacing an image resets its display from “Break” to “Inline”', function () {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Image']
                },
                iframeSettings: {
                    enable: true
                }
            });
            controlId = rteObj.element.id;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(" replace the image and check the custom class name maintaining with image alone", (done: DoneFn) => {
            rteObj.inputElement.innerHTML = '<p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 440px;" class="e-rte-image e-custom-class"/></p>';
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let iframeBody: HTMLElement = (document.querySelector('iframe') as HTMLIFrameElement).contentWindow.document.body as HTMLElement;
            const target: HTMLElement = rteObj.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[13] as HTMLElement).click();
                const dialogEle: HTMLElement = rteObj.element.querySelector('.e-dialog');
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png';
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
                setTimeout(() => {
                    expect(!isNullOrUndefined(iframeBody.querySelector('.e-rte-image.e-img-inline.e-custom-class'))).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
        it(" replace the image and check the custom class name maintaining with caption", (done: DoneFn) => {
            rteObj.inputElement.innerHTML = '<p><span class="e-img-caption-container" contenteditable="false" draggable="false" style="width: 150px"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 150px; height: 200px" class="e-rte-image e-custom-class"><span class="e-img-inner" contenteditable="true">Caption</span></span></span></p>';
            rteObj.inputElement.dispatchEvent(INIT_MOUSEDOWN_EVENT);
            let iframeBody: HTMLElement = (document.querySelector('iframe') as HTMLIFrameElement).contentWindow.document.body as HTMLElement;
            const target: HTMLElement = rteObj.inputElement.querySelector('img');
            setCursorPoint(target, 0);
            target.dispatchEvent(MOUSEUP_EVENT);
            setTimeout(() => {
                (document.querySelectorAll('.e-image-quicktoolbar .e-toolbar-item')[13] as HTMLElement).click();
                const dialogEle: HTMLElement = rteObj.element.querySelector('.e-dialog');
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png';
                (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event("input"));
                expect(rteObj.element.lastElementChild.classList.contains('e-dialog')).toBe(true);
                (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
                setTimeout(() => {
                    expect(!isNullOrUndefined(iframeBody.querySelector('.e-img-caption-container.e-img-inline'))).toBe(true);
                    expect(!isNullOrUndefined(iframeBody.querySelector('.e-rte-image.e-custom-class'))).toBe(true);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('1011644: Enter and Shift+Enter press after the image do not work in the Editor.', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: { items: ['Image'] }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('should create a new paragraph after image caption when Enter is pressed', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            (<HTMLElement>rteEle.querySelectorAll('.e-toolbar-item')[0] as HTMLElement).click();
            let dialogEle: any = rteObj.element.querySelector('.e-dialog');
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).value = 'https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png';
            (dialogEle.querySelector('.e-img-url') as HTMLInputElement).dispatchEvent(new Event('input'));
            (document.querySelector('.e-insertImage.e-primary') as HTMLElement).click();
            setTimeout(() => {
                const target: HTMLElement = rteObj.inputElement.querySelector('img');
                clickImage(target as HTMLImageElement);
                setTimeout(() => {
                    const quickPopup: HTMLElement = document.querySelector('.e-rte-quick-popup');
                    const captionBtn = quickPopup.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
                    captionBtn.click();
                    setTimeout(() => {
                        const caption = rteObj.contentModule.getEditPanel().querySelector('span.e-img-caption-container') as HTMLElement;
                        expect(caption).not.toBe(null);
                        const textNode = caption.nextSibling as HTMLElement;
                        setCursorPoint(textNode, 1);
                        rteObj.inputElement.dispatchEvent(ENTER_KEY_DOWN_EVENT);
                        rteObj.inputElement.dispatchEvent(ENTER_KEY_UP_EVENT);
                        setTimeout(() => {
                            const next = caption.parentElement.nextSibling as HTMLElement;
                            expect(next && next.nodeName === 'P').toBe(true);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });

    describe('1014738: Image becomes hidden after pressing Tab twice after inserting image in RichTextEditor', () => {
        describe('Image alone - Tab key while image selected', () => {
            let rteObj: RichTextEditor;
            let tabDown: KeyboardEvent;
            beforeAll(() => {
                rteObj = renderRTE({
                    enableTabKey: true,
                    value: `<p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user inter<img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 20%" class="e-rte-image e-img-inline"/>face that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>`
                });
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it('should handle Tab when image is selected', (done: DoneFn) => {
                rteObj.focusIn();
                const imageElement: HTMLElement = rteObj.inputElement.querySelector('img.e-rte-image');
                imageElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
                imageElement.dispatchEvent(new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT));
                setTimeout(() => {
                    tabDown = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
                    rteObj.inputElement.dispatchEvent(tabDown);
                    setTimeout(() => {
                        expect(tabDown.defaultPrevented).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
        });
        describe('Caption image - Tab key while caption image selected', () => {
            let rteObj: RichTextEditor;
            let tabDown: KeyboardEvent;
            beforeAll(() => {
                rteObj = renderRTE({
                    enableTabKey: true,
                    value: `<p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user inter<span class="e-img-caption-container e-img-inline" contenteditable="false" draggable="false" style="width: 306.867px"><span class="e-img-wrap"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 306.867px;" class="e-rte-image"/><span class="e-img-caption-text" contenteditable="false">Caption</span></span></span>face that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>`
                });
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it('should handle Tab when caption image is selected', (done: DoneFn) => {
                rteObj.focusIn();
                const captionImg: HTMLElement = rteObj.inputElement.querySelector('.e-img-caption-container img');
                captionImg.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
                captionImg.dispatchEvent(new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT));
                setTimeout(() => {
                    tabDown = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
                    rteObj.inputElement.dispatchEvent(tabDown);
                    setTimeout(() => {
                        expect(tabDown.defaultPrevented).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
        });
        describe('Normal video - Tab key while video selected', () => {
            let rteObj: RichTextEditor;
            let tabDown: KeyboardEvent;
            beforeAll(() => {
                rteObj = renderRTE({
                    enableTabKey: true,
                    value: `<p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user inter<span class="e-video-wrap" contenteditable="false" title="Video.mp4" style="cursor: pointer;"><video class="e-rte-video e-video-inline" controls width="auto" height="auto" style="min-width: 200px; max-width: 1535px; min-height: 90px; width: 1558.32px; height: 408px; max-height: 313px;"><source src="blob:http://127.0.0.1:5501/73c017e4-be1c-4848-8027-de3b08028e97" type="video/mp4"/></video></span> face that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>`
                });
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it('should handle Tab when video is selected', (done: DoneFn) => {
                rteObj.focusIn();
                const videoElement: HTMLElement = rteObj.inputElement.querySelector('video.e-rte-video');
                videoElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
                videoElement.dispatchEvent(new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT));
                setTimeout(() => {
                    tabDown = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
                    rteObj.inputElement.dispatchEvent(tabDown);
                    setTimeout(() => {
                        expect(tabDown.defaultPrevented).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
        });
        describe('Embed video (iframe) - Tab key while embed selected', () => {
            let rteObj: RichTextEditor;
            let tabDown: KeyboardEvent;
            beforeAll(() => {
                rteObj = renderRTE({
                    enableTabKey: true,
                    value: `<p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user inter<span class="e-embed-video-wrap" contenteditable="false" style="display: inline-block;"><span class="e-video-clickelem"><iframe width="auto" height="auto" src="https://www.youtube.com/embed/N7CAo5lWS8c?si=44NxG9au9zbZ9oxM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen class="e-video-inline e-rte-embed-url" style="min-width: 0px; max-width: 1535px; min-height: 0px;">&amp;ZeroWidthSpace;</iframe></span></span> face that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p>`
                });
            });
            afterAll(() => {
                destroy(rteObj);
            });
            it('should handle Tab when embed video is selected', (done: DoneFn) => {
                rteObj.focusIn();
                const iframeEl: HTMLElement = rteObj.inputElement.querySelector('iframe.e-rte-embed-url');
                const clickableWrap: HTMLElement = iframeEl.closest('.e-embed-video-wrap') as HTMLElement;
                setSelection(clickableWrap, 0, 1);
                tabDown = new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(tabDown);
                setTimeout(() => {
                    expect(tabDown.defaultPrevented).toBe(true);
                    done();
                }, 100);
            });
        });
    });
});
