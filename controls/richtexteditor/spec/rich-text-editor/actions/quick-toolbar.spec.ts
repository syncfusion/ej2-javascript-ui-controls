/**
 * RTE - Quick Toolbar action spec
 */
import { Browser, select, isNullOrUndefined } from "@syncfusion/ej2-base";
import { RichTextEditor, IRenderer, QuickToolbar, ToolbarRenderer } from "../../../src/rich-text-editor/index";
import { BaseToolbar, pageYOffset } from "../../../src/rich-text-editor/index";
import { renderRTE, destroy, removeStyleElements, androidUA, iPhoneUA, currentBrowserUA, clickImage,setCursorPoint } from "./../render.spec";
import { CLS_RTE_RES_HANDLE } from "../../../src/rich-text-editor/base/classes";
import { TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT } from "../../constant.spec";

function getQTBarModule(rteObj: RichTextEditor): QuickToolbar {
    return rteObj.quickToolbarModule;
}

describe("Quick Toolbar - Actions Module", () => {

    let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
    let defaultUA: string = navigator.userAgent;

    beforeAll(() => {
        removeStyleElements(document.head.querySelectorAll('style'));
        let css: string = ".e-richtexteditor { margin-top: 100px; height: 500px; position: relative; }" +
            ".e-toolbar { display: block; white-space: nowrap; position: relative; }" +
            ".e-rte-quick-popup .e-toolbar-items { display: inline-block; }" +
            ".e-rte-quick-popup .e-toolbar-item { display: inline-block; }" +
            ".e-toolbar-item { display: inline-block; } .e-rte-quick-popup { position: absolute; }";
        let style: HTMLStyleElement = document.createElement('style');
        style.type = "text/css";
        style.id = "toolbar-style";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    });

    afterAll(() => {
        document.head.getElementsByClassName('toolbar-style')[0].remove();
        removeStyleElements(document.head.querySelectorAll('style'));
    });

    describe("Default value with render testing", () => {
        let trg: HTMLElement;
        let rteEle: HTMLElement;
        let rteObj: any;
        let QTBarModule: IRenderer;

        beforeAll((done) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    text: ['Cut', 'Copy', 'Paste']
                }
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            QTBarModule.linkQTBar.showPopup(0, 0, trg);
            QTBarModule.textQTBar.showPopup(0, 0, trg);
            QTBarModule.imageQTBar.showPopup(0, 0, trg);
            done();
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it("Availability testing", () => {
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(3);
            expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
            expect(document.querySelectorAll('.e-rte-quick-popup')[1].id.indexOf('Text_Quick_Popup') >= 0).toBe(true);
            expect(document.querySelectorAll('.e-rte-quick-popup')[2].id.indexOf('Image_Quick_Popup') >= 0).toBe(true);
        });

        it("Default toolbar items count testing", () => {
            expect(rteObj.quickToolbarSettings.link.length).toBe(3);
            expect(rteObj.quickToolbarSettings.image.length).toBe(12);
            expect(rteObj.quickToolbarSettings.text.length).toBe(3);
        });

        it("Link quick popup - toolbar and default items testing", () => {
            let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            let linkTBItems: NodeList = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            expect(linkTBItems.length).toBe(3);
            expect((<HTMLElement>linkTBItems.item(0)).title).toBe('Open Link');
            expect((<HTMLElement>linkTBItems.item(1)).title).toBe('Edit Link');
            expect((<HTMLElement>linkTBItems.item(2)).title).toBe('Remove Link');
        });

        it("Text quick popup - toolbar and default items testing", () => {
            let textPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[1];
            let textTBItems: NodeList = textPop.querySelectorAll('.e-toolbar-item');
            expect(textPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            expect(textTBItems.length).toBe(3);
            expect((<HTMLElement>textTBItems.item(0)).title).toBe('Cut (Ctrl+X)');
            expect((<HTMLElement>textTBItems.item(1)).title).toBe('Copy (Ctrl+C)');
            expect((<HTMLElement>textTBItems.item(2)).title).toBe('Paste (Ctrl+V)');
        });

        it("Image quick popup - toolbar and default items testing", () => {
            let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[2];
            let imgTBItems: NodeList = imgPop.querySelectorAll('.e-toolbar-item');
            expect(imgPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            expect(imgTBItems.length).toBe(12);
            expect((<HTMLElement>imgTBItems.item(0)).title).toBe('Replace');
            expect((<HTMLElement>imgTBItems.item(1)).title).toBe('Align');
            expect((<HTMLElement>imgTBItems.item(2)).title).toBe('Caption');
            expect((<HTMLElement>imgTBItems.item(3)).title).toBe('Remove');
            expect((<HTMLElement>imgTBItems.item(4)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>imgTBItems.item(5)).title).toBe('Insert Link');
            expect((<HTMLElement>imgTBItems.item(6)).title).toBe('Open Link');
            expect((<HTMLElement>imgTBItems.item(7)).title).toBe('Edit Link');
            expect((<HTMLElement>imgTBItems.item(8)).title).toBe('Remove Link');
            expect((<HTMLElement>imgTBItems.item(9)).title).toBe('Display');
            expect((<HTMLElement>imgTBItems.item(10)).title).toBe('Alternate Text');
            expect((<HTMLElement>imgTBItems.item(11)).title).toBe('Change Size');
            rteObj.quickToolbarModule.imageQTBar.removeQTBarItem(11);
        });
        it("Image quick popup remove while press the backspace testing", () => {
            let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[2];
            let imgTBItems: NodeList = imgPop.querySelectorAll('.e-toolbar-item');
            expect(imgPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            expect((<HTMLElement>imgTBItems.item(0)).title).toBe('Replace');
            expect((<HTMLElement>imgTBItems.item(1)).title).toBe('Align');
            expect((<HTMLElement>imgTBItems.item(2)).title).toBe('Caption');
            expect((<HTMLElement>imgTBItems.item(3)).title).toBe('Remove');
            expect((<HTMLElement>imgTBItems.item(4)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>imgTBItems.item(5)).title).toBe('Insert Link');
            expect((<HTMLElement>imgTBItems.item(6)).title).toBe('Open Link');
            expect((<HTMLElement>imgTBItems.item(7)).title).toBe('Edit Link');
            expect((<HTMLElement>imgTBItems.item(8)).title).toBe('Remove Link');
            expect((<HTMLElement>imgTBItems.item(9)).title).toBe('Display');
            expect((<HTMLElement>imgTBItems.item(10)).title).toBe('Alternate Text');
            (rteObj as any).keyDown({ which: 8, preventDefault: () => { }, action: null });
            document.getElementById('Image_Quick_Popup_4')
            expect(document.getElementById('Image_Quick_Popup_3')).toBe(null);
        });
    });

    describe("EJ2-59865 - css class dependency component", () => {
        let trg: HTMLElement;
        let rteEle: HTMLElement;
        let rteObj: any;
        let QTBarModule: IRenderer;

        beforeAll((done) => {
            rteObj = renderRTE({
                cssClass: 'customClass',
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                }
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            QTBarModule.linkQTBar.showPopup(0, 0, trg);
            QTBarModule.textQTBar.showPopup(0, 0, trg);
            QTBarModule.imageQTBar.showPopup(0, 0, trg);
            done();
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it("css class dependency initial load and dynamic change", () => {
            let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            let textPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[1];
            let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[2];
            expect(linkPop.classList.contains('customClass')).toBe(true);
            expect(textPop.classList.contains('customClass')).toBe(true);
            expect(imgPop.classList.contains('customClass')).toBe(true);
            QTBarModule.linkQTBar.hidePopup();
            QTBarModule.textQTBar.hidePopup();
            QTBarModule.imageQTBar.hidePopup();
            rteObj.cssClass = 'changedClass';
            rteObj.dataBind();
            QTBarModule.linkQTBar.showPopup(0, 0, trg);
            QTBarModule.textQTBar.showPopup(0, 0, trg);
            QTBarModule.imageQTBar.showPopup(0, 0, trg);
            let linkPop2: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            let textPop2: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[1];
            let imgPop2: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[2];
            expect(linkPop2.classList.contains('changedClass')).toBe(true);
            expect(textPop2.classList.contains('changedClass')).toBe(true);
            expect(imgPop2.classList.contains('changedClass')).toBe(true);
        });
    });

    describe("Dynamic quicktoolbar disable testing", () => {
        let trg: HTMLElement;
        let rteEle: HTMLElement;
        let rteObj: any;
        let QTBarModule: IRenderer;

        beforeAll((done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                }
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            QTBarModule.linkQTBar.showPopup(0, 0, trg);
            QTBarModule.textQTBar.showPopup(0, 0, trg);
            QTBarModule.imageQTBar.showPopup(0, 0, trg);
            done();
        });

        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        it("Availability testing", (done: Function) => {
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(3);
            expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
            expect(document.querySelectorAll('.e-rte-quick-popup')[1].id.indexOf('Text_Quick_Popup') >= 0).toBe(true);
            expect(document.querySelectorAll('.e-rte-quick-popup')[2].id.indexOf('Image_Quick_Popup') >= 0).toBe(true);
            rteObj.quickToolbarSettings.enable = false;
            rteObj.dataBind();
            done();
        });
        it("enable as false with quick toolbar availability testing", (done: Function) => {
            QTBarModule = getQTBarModule(rteObj);
            expect(isNullOrUndefined(QTBarModule)).toEqual(true);
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(0);
            done();
        });
    });

    describe("Empty QuickToolbar items value change with render testing", () => {
        let trg: HTMLElement;
        let rteEle: HTMLElement;
        let rteObj: any;
        let QTBarModule: IRenderer;

        beforeAll((done: DoneFn) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    link: [{ template: '' }],
                    text: ['Copy', 'Paste'],
                    image: []
                }
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            QTBarModule.textQTBar.showPopup(0, 0, trg);
            done();
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it("Availability testing", () => {
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
            expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Text_Quick_Popup') >= 0).toBe(true);
        });

        it("Toolbar items count testing", () => {
            expect(rteObj.quickToolbarSettings.link.length).toBe(1);
            expect(rteObj.quickToolbarSettings.image.length).toBe(0);
            expect(rteObj.quickToolbarSettings.text.length).toBe(2);
        });

        it("Text quick popup - toolbar and items testing", () => {
            let textPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            let textTBItems: NodeList = textPop.querySelectorAll('.e-toolbar-item');
            expect(textPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            expect(textTBItems.length).toBe(2);
            expect((<HTMLElement>textTBItems.item(0)).title).toBe('Copy (Ctrl+C)');
            expect((<HTMLElement>textTBItems.item(1)).title).toBe('Paste (Ctrl+V)');
        });
    });

    describe("QuickToolbar items value change with render testing", () => {
        let trg: HTMLElement;
        let rteEle: HTMLElement;
        let rteObj: any;
        let QTBarModule: IRenderer;

        beforeAll((done: DoneFn) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    link: ['Open', 'UnLink'],
                    text: ['Copy', 'Paste'],
                    image: ['InsertLink', 'Remove']
                }
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            QTBarModule.linkQTBar.showPopup(0, 0, trg);
            QTBarModule.textQTBar.showPopup(0, 0, trg);
            QTBarModule.imageQTBar.showPopup(0, 0, trg);
            done();
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it("Availability testing", () => {
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(3);
            expect(document.querySelectorAll('.e-rte-quick-popup')[0].id.indexOf('Link_Quick_Popup') >= 0).toBe(true);
            expect(document.querySelectorAll('.e-rte-quick-popup')[1].id.indexOf('Text_Quick_Popup') >= 0).toBe(true);
            expect(document.querySelectorAll('.e-rte-quick-popup')[2].id.indexOf('Image_Quick_Popup') >= 0).toBe(true);
        });

        it("Toolbar items count testing", () => {
            expect(rteObj.quickToolbarSettings.link.length).toBe(2);
            expect(rteObj.quickToolbarSettings.image.length).toBe(2);
            expect(rteObj.quickToolbarSettings.text.length).toBe(2);
        });

        it("Link quick popup - toolbar and items testing", () => {
            let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            let linkTBItems: NodeList = linkPop.querySelectorAll('.e-toolbar-item');
            expect(linkPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            expect(linkTBItems.length).toBe(2);
            expect((<HTMLElement>linkTBItems.item(0)).title).toBe('Open Link');
            expect((<HTMLElement>linkTBItems.item(1)).title).toBe('Remove Link');
        });

        it("Text quick popup - toolbar and items testing", () => {
            let textPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[1];
            let textTBItems: NodeList = textPop.querySelectorAll('.e-toolbar-item');
            expect(textPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            expect(textTBItems.length).toBe(2);
            expect((<HTMLElement>textTBItems.item(0)).title).toBe('Copy (Ctrl+C)');
            expect((<HTMLElement>textTBItems.item(1)).title).toBe('Paste (Ctrl+V)');
        });

        it("Image quick popup - toolbar and items testing", () => {
            let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[2];
            let imgTBItems: NodeList = imgPop.querySelectorAll('.e-toolbar-item');
            expect(imgPop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
            expect(imgTBItems.length).toBe(2);
            expect((<HTMLElement>imgTBItems.item(0)).title).toBe('Insert Link');
            expect((<HTMLElement>imgTBItems.item(1)).title).toBe('Remove');
        });
    });

    describe("Quick toolbar - showPopup method with popup open testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;
        let QTBarModule: IRenderer;

        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode', 'Undo', 'Redo']
                }
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            done();
        });

        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        it("Popup open testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(100, 1, trg);
            setTimeout(() => {
                let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(linkPop.classList.contains('e-popup-close')).toBe(false);
                expect(linkPop.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 100);
        });

        it("Popup open with undo/redo disable testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(100, 1, trg);
            setTimeout(() => {
                let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(linkPop.classList.contains('e-popup-close')).toBe(false);
                expect(linkPop.classList.contains('e-popup-open')).toBe(true);
                let tbItems: NodeList = rteEle.querySelectorAll(".e-toolbar-item");
                expect((<HTMLElement>tbItems.item(1)).classList.contains('e-overlay')).toBe(true);
                expect((<HTMLElement>tbItems.item(2)).classList.contains('e-overlay')).toBe(true);
                done();
            }, 100);
        });

        it("Bottom collision testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(100, 2150, trg);
            setTimeout(() => {
                let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(linkPop.classList.contains('e-popup-close')).toBe(false);
                expect(linkPop.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 100);
        });

        it("Left collision testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(-500, 1, trg);
            setTimeout(() => {
                let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(linkPop.classList.contains('e-popup-close')).toBe(false);
                expect(linkPop.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 100);
        });

        it("Right collision testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(2250, 1, trg);
            setTimeout(() => {
                let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(linkPop.classList.contains('e-popup-close')).toBe(false);
                expect(linkPop.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 100);
        });

        it("Page scroll with popup hide testing", (done: Function) => {
            document.body.style.height = '1400px';
            let trg: HTMLElement = <HTMLElement>rteObj.element.querySelector('.e-toolbar-item > button');
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            trg.click();
            window.scrollTo(0, 100);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(0);
                expect(rteObj.element.querySelector('.e-toolbar-item').classList.contains('e-overlay')).toBe(false);
                document.body.style.height = '';
                done();
            }, 100);
        });

        it("Popup hide testing", () => {
            QTBarModule.linkQTBar.hidePopup();
            expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(0);
        });
    });

    describe("Desktop DIV - Quick toolbar - Position testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;
        let imgEle: HTMLElement;
        let linkEle: HTMLElement;
        let QTBarModule: any;
        let htmlStr: string = "<img id='imgTag' style='width: 200px' alt='Logo'" +
            " src='http://cdn.syncfusion.com/content/images/sales/buynow/Character-opt.png' /> <br/>" +
            "<a id='linkTag' href='http://www.syncfusion.com'>Syncfusion</a>" +
            "<p> Paragraph </p>";

        beforeAll((done: Function) => {
            rteObj = renderRTE({
                value: htmlStr,
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                }
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            imgEle = select('#imgTag', trg) as HTMLElement;
            linkEle = select('#linkTag', trg) as HTMLElement;
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            done();
        });

        afterEach((done: Function) => {
            QTBarModule.textQTBar.hidePopup();
            QTBarModule.linkQTBar.hidePopup();
            QTBarModule.imageQTBar.hidePopup();
            done();
        });

        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        it("Text toolbar open testing", (done: Function) => {
            QTBarModule.textQTBar.showPopup(100, 1, trg);
            setTimeout(() => {
                let textPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(textPop.offsetLeft >= 120).toBe(true);
                expect((textPop.offsetTop + textPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                QTBarModule.hideQuickToolbars();
                done();
            }, 100);
        });

        it("Image toolbar open testing", (done: Function) => {
            QTBarModule.imageQTBar.showPopup(100, 1, trg);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 120).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                QTBarModule.hideQuickToolbars();
                done();
            }, 100);
        });

        it("Link toolbar open testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(100, 1, trg);
            setTimeout(() => {
                let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(linkPop.offsetLeft >= 120).toBe(true);
                expect((linkPop.offsetTop + linkPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                QTBarModule.hideQuickToolbars();
                done();
            }, 100);
        });

        it("Image element click testing", (done: Function) => {
            QTBarModule.imageQTBar.showPopup(10, 131, trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect(imgPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Image element full view space occupy with click testing", (done: Function) => {
            imgEle.style.width = '100%';
            imgEle.style.height = '500px';
            QTBarModule.imageQTBar.showPopup(10, 131, trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect(imgPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                imgEle.style.width = '200px';
                imgEle.style.height = '300px';
                done();
            }, 100);
        });

        it("Image element 'Right' align with click testing", (done: Function) => {
            imgEle.setAttribute('align', 'right');
            QTBarModule.imageQTBar.showPopup(10, 131, trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                // expect(imgPop.offsetLeft >= 10).toBe(true);
                expect((imgPop.offsetLeft + imgPop.offsetWidth) <= (rteEle.offsetLeft + rteEle.offsetWidth)).toBe(true);
                imgEle.setAttribute('align', 'left');
                done();
            }, 100);
        });

        it("Image element bottom section click testing", (done: Function) => {
            rteEle.style.marginTop = '500px';
            QTBarModule.imageQTBar.showPopup(10, (imgEle.offsetTop + imgEle.offsetHeight - 10), trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) <= (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                rteEle.style.marginTop = '100px';
                done();
            }, 100);
        });

        it("Anchor element click testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(10, 244, trg.children[0].children[2]);
            setTimeout(() => {
                let anchorPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(anchorPop.offsetLeft >= 10).toBe(true);
                expect(anchorPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((anchorPop.offsetTop + anchorPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Anchor element 'Right' align with click testing", (done: Function) => {
            linkEle.style.cssFloat = 'right';
            QTBarModule.linkQTBar.showPopup(10, 131, trg.children[0].children[2]);
            setTimeout(() => {
                let anchorPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(anchorPop.offsetLeft >= 10).toBe(true);
                expect(anchorPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((anchorPop.offsetTop + anchorPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                linkEle.style.cssFloat = 'left';
                done();
            }, 100);
        });

        it("Element bottom section click testing", (done: Function) => {
            rteEle.style.marginTop = '500px';
            QTBarModule.linkQTBar.showPopup(10, (linkEle.offsetTop + linkEle.offsetHeight - 5), trg.children[0]);
            setTimeout(() => {
                let anchorPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(anchorPop.offsetLeft >= 10).toBe(true);
                expect((anchorPop.offsetTop + anchorPop.offsetHeight) <= (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                rteEle.style.marginTop = '100px';
                done();
            }, 100);
        });

        it("Paragraph element click with text toolbar testing", (done: Function) => {
            QTBarModule.textQTBar.showPopup(10, 244, trg.children[1]);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop.offsetLeft >= 30).toBe(true);
                expect(pop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((pop.offsetTop + pop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });
    });

    describe("Desktop IFrame - Quick toolbar - Position testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;
        let imgEle: HTMLElement;
        let linkEle: HTMLElement;
        let QTBarModule: IRenderer;
        let pageY: number;
        let htmlStr: string = "<img id='imgTag' style='width: 200px; float: none' alt='Logo'" +
            " src='http://cdn.syncfusion.com/content/images/sales/buynow/Character-opt.png' /> <br/>" +
            "<a id='linkTag' href='http://www.syncfusion.com'>Syncfusion</a>" +
            "<p> Paragraph </p>";

        beforeAll((done: Function) => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                },
                value: htmlStr
            });
            rteEle = rteObj.element;
            let iframe: HTMLIFrameElement = <HTMLIFrameElement>document.querySelector("iframe.e-rte-content");
            trg = <HTMLElement>iframe.contentDocument.body;
            imgEle = <HTMLElement>trg.children[0];
            linkEle = <HTMLElement>trg.children[0].children[2];
            pageY = window.scrollY + rteEle.getBoundingClientRect().top;
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            done();
        });

        afterEach((done: DoneFn) => {
            QTBarModule.textQTBar.hidePopup();
            QTBarModule.linkQTBar.hidePopup();
            QTBarModule.imageQTBar.hidePopup();
            done();
        });

        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        it("Text toolbar open testing", (done: Function) => {
            QTBarModule.textQTBar.showPopup(100, pageY + 1, trg);
            setTimeout(() => {
                let textPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(textPop.offsetLeft >= 120).toBe(true);
                expect(textPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((textPop.offsetTop + textPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Image toolbar open testing", (done: Function) => {
            QTBarModule.imageQTBar.showPopup(100, pageY + 1, trg);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 120).toBe(true);
                expect(imgPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Link toolbar open testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(100, pageY + 1, trg);
            setTimeout(() => {
                let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(linkPop.offsetLeft >= 120).toBe(true);
                expect(linkPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((linkPop.offsetTop + linkPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Image element click testing", (done: Function) => {
            QTBarModule.imageQTBar.showPopup(10, pageY + 131, trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect(imgPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Image element full view space occupy with click testing", (done: Function) => {
            imgEle.style.marginTop = '200px';
            imgEle.style.width = '100%';
            imgEle.style.height = '500px';
            QTBarModule.imageQTBar.showPopup(10, pageY + 131, trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect(imgPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                imgEle.style.width = '200px';
                imgEle.style.height = '300px';
                imgEle.style.marginTop = '200px';
                done();
            }, 100);
        });

        it("Image element 'Right' align with click testing", (done: Function) => {
            imgEle.setAttribute('align', 'right');
            QTBarModule.imageQTBar.showPopup(10, pageY + 131, trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect(imgPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                imgEle.setAttribute('align', 'left');
                done();
            }, 100);
        });

        it("Image element bottom section click testing", (done: Function) => {
            rteEle.style.marginTop = '500px';
            QTBarModule.imageQTBar.showPopup(10, (imgEle.offsetTop + imgEle.offsetHeight - 10), trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                rteEle.style.marginTop = '100px';
                done();
            }, 100);
        });

        it("Anchor element click testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(10, pageY + 47, trg.children[0].children[2]);
            setTimeout(() => {
                let anchorPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(anchorPop.offsetLeft >= 10).toBe(true);
                expect(anchorPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((anchorPop.offsetTop + anchorPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Anchor element 'Right' align with click testing", (done: Function) => {
            linkEle.style.cssFloat = 'right';
            pageYOffset({ clientY: 10 } as MouseEvent, rteObj.element, true);
            QTBarModule.linkQTBar.showPopup(210, pageY + 47, trg.children[0].children[2]);
            setTimeout(() => {
                let anchorPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(anchorPop.offsetLeft >= 10).toBe(true);
                expect(anchorPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((anchorPop.offsetTop + anchorPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                linkEle.style.cssFloat = 'left';
                done();
            }, 100);
        });

        it("Element bottom section click testing", (done: Function) => {
            rteEle.style.marginTop = '500px';
            QTBarModule.linkQTBar.showPopup(10, (linkEle.offsetTop + linkEle.offsetHeight - 5), trg.children[0]);
            setTimeout(() => {
                let anchorPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(anchorPop.offsetLeft >= 10).toBe(true);
                expect((anchorPop.offsetTop + anchorPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                rteEle.style.marginTop = '100px';
                done();
            }, 100);
        });

        it("Paragraph element click with text toolbar testing", (done: Function) => {
            QTBarModule.textQTBar.showPopup(10, pageY + 244, trg.children[1]);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop.offsetLeft >= 30).toBe(true);
                expect(pop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((pop.offsetTop + pop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });
    });

    describe("Mobile DIV - Quick toolbar - Position testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;
        let imgEle: HTMLElement;
        let linkEle: HTMLElement;
        let QTBarModule: IRenderer;
        let clickEvent: MouseEvent;
        let htmlStr: string = "<img id='imgTag' style='width: 200px' alt='Logo'" +
            " src='http://cdn.syncfusion.com/content/images/sales/buynow/Character-opt.png' /> <br/>" +
            "<a id='linkTag' href='http://www.syncfusion.com'>Syncfusion</a>" +
            "<p> Paragraph </p>";

        beforeAll((done: Function) => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                value: htmlStr,
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                }
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            imgEle = document.getElementById('imgTag');
            linkEle = document.getElementById('linkTag');
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            done();
        });

        afterEach((done: DoneFn) => {
            QTBarModule.textQTBar.hidePopup();
            QTBarModule.linkQTBar.hidePopup();
            QTBarModule.imageQTBar.hidePopup();
            done();
        });

        afterAll((done: DoneFn) => {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
            done();
        });

        it("Text toolbar open testing", (done: Function) => {
            QTBarModule.textQTBar.showPopup(100, 1, trg);
            setTimeout(() => {
                let textPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(textPop.offsetLeft >= 120).toBe(true);
                expect((textPop.offsetTop + textPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Image toolbar open testing", (done: Function) => {
            clickEvent.initEvent("mouseup", true, true);
            imgEle.dispatchEvent(clickEvent);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= rteEle.offsetLeft).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Link toolbar open testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(100, 1, trg);
            setTimeout(() => {
                let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(linkPop.offsetLeft >= 120).toBe(true);
                expect((linkPop.offsetTop + linkPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Image element click testing", (done: Function) => {
            QTBarModule.imageQTBar.showPopup(10, 131, trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect(imgPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Image element full view space occupy with click testing", (done: Function) => {
            imgEle.style.width = '100%';
            imgEle.style.height = '500px';
            QTBarModule.imageQTBar.showPopup(10, 131, trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect(imgPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                imgEle.style.width = '200px';
                imgEle.style.height = '300px';
                done();
            }, 100);
        });

        it("Image element 'Right' align with click testing", (done: Function) => {
            imgEle.setAttribute('align', 'right');
            QTBarModule.imageQTBar.showPopup(10, 131, trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                // expect(imgPop.offsetLeft >= 10).toBe(true);
                // expect(imgPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                imgEle.setAttribute('align', 'left');
                done();
            }, 100);
        });

        it("Image element bottom section click testing", (done: Function) => {
            rteEle.style.marginTop = '500px';
            QTBarModule.imageQTBar.showPopup(10, (imgEle.offsetTop + imgEle.offsetHeight - 10), trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                rteEle.style.marginTop = '100px';
                done();
            }, 100);
        });

        it("Anchor element click testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(10, 244, trg.children[0].children[2]);
            setTimeout(() => {
                let anchorPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(anchorPop.offsetLeft >= 10).toBe(true);
                expect(anchorPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((anchorPop.offsetTop + anchorPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Anchor element 'Right' align with click testing", (done: Function) => {
            linkEle.style.cssFloat = 'right';
            QTBarModule.linkQTBar.showPopup(10, 131, trg.children[0].children[2]);
            setTimeout(() => {
                let anchorPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(anchorPop.offsetLeft >= 10).toBe(true);
                expect((anchorPop.offsetTop + anchorPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                linkEle.style.cssFloat = 'left';
                done();
            }, 100);
        });

        it("Element bottom section click testing", (done: Function) => {
            rteEle.style.marginTop = '500px';
            QTBarModule.linkQTBar.showPopup(10, (linkEle.offsetTop + linkEle.offsetHeight - 5), trg.children[0]);
            setTimeout(() => {
                let anchorPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(anchorPop.offsetLeft >= 10).toBe(true);
                expect((anchorPop.offsetTop + anchorPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                rteEle.style.marginTop = '100px';
                done();
            }, 100);
        });

        it("Paragraph element click with text toolbar testing", (done: Function) => {
            QTBarModule.textQTBar.showPopup(10, 244, trg.children[1]);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop.offsetLeft >= 30).toBe(true);
                expect(pop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((pop.offsetTop + pop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });
    });

    describe("Mobile IFrame - Quick toolbar - Position testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;
        let imgEle: HTMLElement;
        let linkEle: HTMLElement;
        let QTBarModule: IRenderer;
        let clickEvent: MouseEvent;
        let pageY: number;
        let htmlStr: string = "<img id='imgTag' class='e-rte-image' style='width: 200px; float: none' alt='Logo'" +
            " src='http://cdn.syncfusion.com/content/images/sales/buynow/Character-opt.png' /> <br/>" +
            "<a id='linkTag' href='http://www.syncfusion.com'>Syncfusion</a>" +
            "<p> Paragraph </p>";

        beforeAll((done: Function) => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                },
                value: htmlStr
            });
            rteEle = rteObj.element;
            let iframe: HTMLIFrameElement = <HTMLIFrameElement>document.querySelector("iframe.e-rte-content");
            trg = <HTMLElement>iframe.contentDocument.body;
            imgEle = <HTMLElement>trg.children[0].children[0];
            linkEle = <HTMLElement>trg.children[0].children[2];
            pageY = window.scrollY + rteEle.getBoundingClientRect().top;
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            done();
        });

        afterEach((done: DoneFn) => {
            QTBarModule.textQTBar.hidePopup();
            QTBarModule.linkQTBar.hidePopup();
            QTBarModule.imageQTBar.hidePopup();
            rteObj.getRange().delete
            done();
        });

        afterAll((done: DoneFn) => {
            destroy(rteObj);
            Browser.userAgent = defaultUA;
            done();
        });

        it("Text toolbar open testing", (done: Function) => {
            QTBarModule.textQTBar.showPopup(100, pageY + 1, trg);
            setTimeout(() => {
                let textPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(textPop.offsetLeft >= 120).toBe(true);
                expect(textPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((textPop.offsetTop + textPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Image toolbar open testing", (done: Function) => {
            clickEvent.initEvent("mouseup", true, true);
            imgEle.dispatchEvent(clickEvent);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= rteEle.offsetLeft).toBe(true);
                expect(imgPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Link toolbar open testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(100, pageY + 1, trg);
            setTimeout(() => {
                let linkPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(linkPop.offsetLeft >= 120).toBe(true);
                expect(linkPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((linkPop.offsetTop + linkPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Image element click testing", (done: Function) => {
            QTBarModule.imageQTBar.showPopup(10, pageY + 131, trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect(imgPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Image element full view space occupy with click testing", (done: Function) => {
            imgEle.style.marginTop = '200px';
            imgEle.style.width = '100%';
            imgEle.style.height = '500px';
            QTBarModule.imageQTBar.showPopup(10, pageY + 131, trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect(imgPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                imgEle.style.width = '200px';
                imgEle.style.height = '300px';
                imgEle.style.marginTop = '200px';
                done();
            }, 100);
        });

        it("Image element 'Right' align with click testing", (done: Function) => {
            imgEle.setAttribute('align', 'right');
            //this.parent.formatter.editorManager.nodeSelection.setSelectionNode(document, document.querySelector('.e-rte-content').contentDocument.querySelector('.e-rte-image'))
            rteObj.formatter.editorManager.nodeSelection.setSelectionText((document.querySelector('.e-rte-content') as any).contentDocument, (document.querySelector('.e-rte-content') as any).contentDocument.querySelector('.e-rte-image'),
                (document.querySelector('.e-rte-content') as any).contentDocument.querySelector('.e-rte-image'), 0, 0);
            rteObj.notify('selection-save', {});
            clickEvent.initEvent("mouseup", true, true);
            imgEle.dispatchEvent(clickEvent);
            let toolbarRenderer: ToolbarRenderer = new ToolbarRenderer(rteObj);
            (toolbarRenderer as any).dropDownSelected({item:{command:'Images'}});
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                imgEle.setAttribute('align', 'left');
                done();
            }, 100);
        });

        it("Image element bottom section click testing", (done: Function) => {
            rteEle.style.marginTop = '500px';
            QTBarModule.imageQTBar.showPopup(10, (imgEle.offsetTop + imgEle.offsetHeight - 10), trg.children[0]);
            setTimeout(() => {
                let imgPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(imgPop.offsetLeft >= 10).toBe(true);
                expect((imgPop.offsetTop + imgPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                rteEle.style.marginTop = '100px';
                done();
            }, 100);
        });

        it("Anchor element click testing", (done: Function) => {
            QTBarModule.linkQTBar.showPopup(10, pageY + 47, trg.children[0].children[2]);
            setTimeout(() => {
                let anchorPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(anchorPop.offsetLeft >= 10).toBe(true);
                expect(anchorPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((anchorPop.offsetTop + anchorPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });

        it("Anchor element 'Right' align with click testing", (done: Function) => {
            linkEle.style.cssFloat = 'right';
            QTBarModule.linkQTBar.showPopup(210, pageY + 47, trg.children[0].children[2]);
            setTimeout(() => {
                let anchorPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(anchorPop.offsetLeft >= 10).toBe(true);
                expect(anchorPop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((anchorPop.offsetTop + anchorPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                linkEle.style.cssFloat = 'left';
                done();
            }, 100);
        });

        it("Element bottom section click testing", (done: Function) => {
            rteEle.style.marginTop = '500px';
            QTBarModule.linkQTBar.showPopup(10, (linkEle.offsetTop + linkEle.offsetHeight - 5), trg.children[0]);
            setTimeout(() => {
                let anchorPop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(anchorPop.offsetLeft >= 10).toBe(true);
                expect((anchorPop.offsetTop + anchorPop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                rteEle.style.marginTop = '100px';
                done();
            }, 100);
        });

        it("Paragraph element click with text toolbar testing", (done: Function) => {
            QTBarModule.textQTBar.showPopup(10, pageY + 244, trg.children[1]);
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop.offsetLeft >= 30).toBe(true);
                expect(pop.offsetTop > rteEle.offsetTop).toBe(true);
                expect((pop.offsetTop + pop.offsetHeight) < (rteEle.offsetTop + rteEle.offsetHeight)).toBe(true);
                done();
            }, 100);
        });
    });

    describe("Inline Quick toolbar - showPopup method with popup open testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;
        let args: any;
        let QTBarModule: IRenderer;

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode', 'Bold']
                },
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div>Syncfusion</div>"
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            QTBarModule = getQTBarModule(rteObj);
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        it('KeyUp handler testing', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'moveRight',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                (<HTMLElement>pop.querySelector('.e-toolbar-item button')).click();
                expect((<HTMLElement>pop.querySelectorAll('.e-toolbar-item')[1]).classList.contains('e-overlay')).toBe(true);
                rteObj.quickToolbarModule.hideInlineQTBar();
                trg = <HTMLElement>rteObj.element.querySelectorAll(".e-rte-srctextarea")[0];
                let clickEvent: MouseEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("mousedown", true, true);
                trg.dispatchEvent(clickEvent);
                pop = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                done();
            }, 100);
        });

        it('Formatter enableUndo testing', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'moveRight',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                rteObj.formatter.enableUndo(rteObj);
                done();
            }, 100);
        });

        it('onSelection - "true" with KeyUp handler testing', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'moveRight',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                rteObj.inlineMode.onSelection = true;
                rteObj.dataBind();
                rteObj.quickToolbarModule.keyUpHandler({ args: args });
                setTimeout(() => {
                    expect(pop).not.toBe(undefined);
                    done();
                }, 100);
            }, 100);
        });
        
        it('show inline popup on CTRL + A action', (done: Function) => {
            args = {
                preventDefault: function () { },
                target: trg,
                x: 10, y: 200,
                keyCode: 65, ctrlKey: true
            };
            rteObj.inlineMode.onSelection = true;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 0, 4);
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                expect(<HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(undefined);
                done();
            }, 100);
        });

        it('show inline popup on shift + pageUp action', (done: Function) => {
            args = {
                preventDefault: function () { },
                target: trg,
                x: 10, y: 200,
                keyCode: 33, shiftKey: true
            };
            rteObj.inlineMode.onSelection = true;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 0, 4);
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                expect(<HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(undefined);
                done();
            }, 100);
        });

        it('show inline popup on shift + pageDown action', (done: Function) => {
            args = {
                preventDefault: function () { },
                target: trg,
                x: 10, y: 200,
                keyCode: 34, shiftKey: true
            };
            rteObj.inlineMode.onSelection = true;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 0, 4);
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                expect(<HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(undefined);
                done();
            }, 100);
        });

        it('show inline popup on shift + end action', (done: Function) => {
            args = {
                preventDefault: function () { },
                target: trg,
                x: 10, y: 200,
                keyCode: 35, shiftKey: true
            };
            rteObj.inlineMode.onSelection = true;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 0, 4);
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                expect(<HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(undefined);
                done();
            }, 100);
        });

        it('show inline popup on shift + home action', (done: Function) => {
            args = {
                preventDefault: function () { },
                target: trg,
                x: 10, y: 200,
                keyCode: 36, shiftKey: true
            };
            rteObj.inlineMode.onSelection = true;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 0, 4);
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                expect(<HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(undefined);
                done();
            }, 100);
        });

        it('show inline popup on shift + leftArrow action', (done: Function) => {
            args = {
                preventDefault: function () { },
                target: trg,
                x: 10, y: 200,
                keyCode: 37, shiftKey: true
            };
            rteObj.inlineMode.onSelection = true;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 0, 4);
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                expect(<HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(undefined);
                done();
            }, 100);
        });

        it('show inline popup on shift + upArrow action', (done: Function) => {
            args = {
                preventDefault: function () { },
                target: trg,
                x: 10, y: 200,
                keyCode: 38, shiftKey: true
            };
            rteObj.inlineMode.onSelection = true;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 0, 4);
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                expect(<HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(undefined);
                done();
            }, 100);
        });

        it('show inline popup on shift + rightArrow action', (done: Function) => {
            args = {
                preventDefault: function () { },
                target: trg,
                x: 10, y: 200,
                keyCode: 39, shiftKey: true
            };
            rteObj.inlineMode.onSelection = true;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 0, 4);
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                expect(<HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(undefined);
                done();
            }, 100);
        });

        it('show inline popup on shift + upArrow action', (done: Function) => {
            args = {
                preventDefault: function () { },
                target: trg,
                x: 10, y: 200,
                keyCode: 40, shiftKey: true
            };
            rteObj.inlineMode.onSelection = true;
            rteObj.dataBind();
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.childNodes[0].childNodes[0], rteObj.inputElement.childNodes[0].childNodes[0], 0, 4);
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                expect(<HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0]).not.toBe(undefined);
                done();
            }, 100);
        });

        it('onSelection - "false" with KeyUp handler testing', (done: Function) => {
            args = {
                preventDefault: function () { },
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                rteObj.inlineMode.onSelection = false;
                rteObj.dataBind();
                rteObj.keyUp({ args: args, key: 'd', which: 9, shiftKey: true, ctrlKey: true });
                rteObj.quickToolbarModule.keyUpHandler({ args: args });
                setTimeout(() => {
                    expect(pop).not.toBe(undefined);
                    done();
                }, 100);
            }, 100);
        });

        it('KeyDown handler testing', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'moveRight',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.keyDownHandler({ args: args });
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).toBe(undefined);
                rteObj.quickToolbarModule.hideQuickToolbars();
                rteObj.quickToolbarModule.hideInlineQTBar();
                rteObj.quickToolbarModule.keyDownHandler({ args: args });
                done();
            }, 100);
        });

        it('mouseUp handler testing', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'moveRight',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.mouseUpHandler({ args: args });
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                (QTBarModule as any).hideInlineQTBar();
                expect(rteObj.getBaseToolbarObject()).not.toBe(undefined);
                done();
            }, 100);
        });

        it('hideInlineQTBar method testing', () => {
            (QTBarModule as any).hideInlineQTBar();
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            expect(pop).toBe(undefined);
        });

        it("Page scroll with popup hide testing", (done: Function) => {
            document.body.style.height = '1400px';
            args = {
                preventDefault: function () { },
                action: 'moveRight',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(1);
                window.scrollTo(0, 100);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-rte-quick-popup').length).toBe(0);
                    document.body.style.height = '';
                    done();
                }, 400);
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
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;
        let args: any;

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor']
                },
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div>Syncfusion</div>"
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

        it('KeyUp handler testing', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'moveRight',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                expect(pop.querySelectorAll('.e-toolbar-item .e-rte-fontcolor-dropdown')[0]).not.toBe(null);
                expect(pop.querySelectorAll('.e-rte-backgroundcolor-dropdown')[0]).not.toBe(null);                
                rteObj.quickToolbarModule.hideInlineQTBar();
                done();
            }, 100);
        });
    });
    describe("EJ2-18674 - RTE Inline toolbar items are not changed dynamically", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;
        let args: any;

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor']
                },
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div>Syncfusion</div>"
            });
            rteObj.toolbarSettings.items = ['Undo', 'Redo', 'Bold'];
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

        it('KeyUp handler testing', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'moveRight',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                expect(pop.querySelectorAll('.e-toolbar-item .e-undo')[0]).not.toBe(null);              
                rteObj.quickToolbarModule.hideInlineQTBar();
                done();
            }, 100);
        });
    });
    describe("EJ2-18675 - RTE removeToolbarItem and addToolbarItem method does not work in inline toolbar", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;
        let args: any;

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo', 'Bold']
                },
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div>Syncfusion</div>"
            });
            rteObj.removeToolbarItem('Undo');
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

        it('KeyUp handler testing', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'moveRight',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                expect(pop.querySelectorAll('.e-toolbar-item .e-undo')[0]).toBe(undefined);              
                rteObj.quickToolbarModule.hideInlineQTBar();
                done();
            }, 100);
        });
    });
    describe("Desktop - Inline quick toolbar testing", () => {
        let args: any;
        let rteObj: any;
        let trg: HTMLElement;
        let rteEle: HTMLElement;
        let trgNode: HTMLElement;
        let clickEvent: MouseEvent;
        let QTBarModule: IRenderer;
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
                expect(rteObj.getToolbar()).toBe(null);
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
            rteObj.quickToolbarModule.mouseUpHandler({ args: args });
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
            rteObj.quickToolbarModule.mouseUpHandler({ args: args });
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(1);
                done();
            }, 100);
        });

        it('KeyDown handler testing', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'moveRight',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.keyDownHandler({ args: args });
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).toBe(undefined);
                rteObj.quickToolbarModule.hideQuickToolbars();
                rteObj.quickToolbarModule.hideInlineQTBar();
                rteObj.quickToolbarModule.keyDownHandler({ args: args });
                done();
            }, 100);
        });

        it('hideInlineQTBar method testing', () => {
            (QTBarModule as any).hideInlineQTBar();
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
        let QTBarModule: IRenderer;
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
            clickEvent.initEvent("mouseup", true, true);
            trgNode.dispatchEvent(clickEvent);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(0);
                expect(document.querySelectorAll('.e-rte-tb-mobile').length).toBe(1);
                expect(document.querySelectorAll('.e-rte-tb-fixed.e-rte-tb-mobile').length).toBe(1);
                expect(document.querySelectorAll('.e-rte-tb-fixed.e-rte-tb-mobile')[0].classList.contains('e-show')).toBe(true);
                done();
            }, 100);
        });

        it('getToolbar public method with toolbar testing', (done: Function) => {
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
            rteObj.quickToolbarModule.mouseUpHandler({ args: args });
            setTimeout(() => {
                expect(document.querySelectorAll('.e-rte-tb-fixed.e-rte-tb-mobile').length).toBe(1);
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
        let QTBarModule: IRenderer;
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
                expect(rteObj.getToolbar()).toBe(null);
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
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(1);
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
                expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(1);
                rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.childNodes[0], pEle.childNodes[0], 0, 1);
                rteObj.quickToolbarModule.selectionChangeHandler(args);
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-rte-inline-popup').length).toBe(1);
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

        beforeEach((done: Function) => {
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
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        it('mouseUp handler testing', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            expect(pop).not.toBe(undefined);
            expect(pop.querySelectorAll('[title="Bold (Ctrl+B)"]')[0]).not.toBe(null);
            rteObj.quickToolbarModule.hideQuickToolbars();
            done();
        });
    });
    describe("817012-text selection Quick toolbar", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;

        beforeEach((done: Function) => {
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
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        it('check the inline mode is enabled', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0];
            expect(pop).toBe(undefined);
            rteObj.quickToolbarModule.hideQuickToolbars();
            done();
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
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0].querySelector('[title="Create Table (Ctrl+Shift+E)"]');
            pop.click();
            expect(<HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0]).toBe(undefined);
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            done();
        });
        it('Check text Quick toolbar hide while click Insert link', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0].querySelector('[title="Insert Link (Ctrl+K)"]');
            pop.click();
            expect(<HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0]).toBe(undefined);
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            done();
        });
        it('Check text Quick toolbar hide while click Insert image', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0].querySelector('[title="Insert Image (Ctrl+Shift+I)"]');
            pop.click();
            expect(<HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0]).toBe(undefined);
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            done();
        });
        it('Check text Quick toolbar hide while click Audio', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0].querySelector('[title="Insert Audio (Ctrl+Shift+A)"]');
            pop.click();
            expect(<HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0]).toBe(undefined);
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            done();
        });
        it('Check text Quick toolbar hide while click video', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('.test').childNodes[0], rteObj.element.querySelector('.test').childNodes[0], 0, 3);
            trg = <HTMLElement>rteEle.querySelectorAll(".test")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0].querySelector('[title="Insert Video (Ctrl+Alt+V)"]');
            pop.click();
            expect(<HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0]).toBe(undefined);
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            done();
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
        beforeEach( (done: Function) => {
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
            done();
        });
        afterEach( (done: DoneFn) => {
            destroy(rteObject);
            done();
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
                expect(<HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0]).toBe(undefined);
                done();
            }, 300);
        });
    });
    describe("817012-text selection Quick toolbar ", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor']
                },
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                },
                value: `<p><b>testing<a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" title="http://dggsjs" target="_blank">link<img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize" alt="RTE-IMG.png" width="auto" height="auto" style="min-width: 0px; max-width: 1456px; min-height: 0px;"></a></b></p>`
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

        it('check the text quick toolbar with link', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.children[0].childNodes[0].childNodes[0], rteObj.inputElement.children[0].childNodes[0].childNodes[1].childNodes[0], 4, 3);
            trg = <HTMLElement>rteObj.inputElement.children[0].childNodes[0].childNodes[1];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0];
            expect(pop).not.toBe(undefined);
            rteObj.quickToolbarModule.hideQuickToolbars();
            done();
        });
    });
    describe("817012-text selection Quick toolbar ", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor']
                },
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                },
                value: `<p><b>testing<a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" title="http://dggsjs" target="_blank">link</a><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-resize" alt="RTE-IMG.png" width="auto" height="auto" style="min-width: 0px; max-width: 1456px; min-height: 0px;"></b></p>`
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

        it('check the text quick toolbar with image', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.children[0].childNodes[0].childNodes[0], rteObj.inputElement.children[0].childNodes[0], 4, 3);
            trg = <HTMLElement>rteObj.inputElement.children[0].childNodes[0].childNodes[1];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0];
            expect(pop).not.toBe(undefined);
            rteObj.quickToolbarModule.hideQuickToolbars();
            done();
        });
    });
    describe("817012-text selection Quick toolbar ", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;

        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontColor', 'BackgroundColor']
                },
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                },
                value: `<p>test<span class="e-video-wrap" contenteditable="false" title="mov_bbb.mp4"><video class="e-rte-video e-video-inline" controls=""><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"></video></span>test</p>`
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

        it('check the text quick toolbar with video', (done: Function) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.inputElement.children[0].childNodes[0], rteObj.inputElement.children[0].childNodes[2], 2, 3);
            trg = <HTMLElement>rteObj.inputElement.children[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", true, true);
            trg.dispatchEvent(clickEvent);
            rteObj.mouseUp(clickEvent);
            let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-text-popup')[0];
            expect(pop).not.toBe(undefined);
            rteObj.quickToolbarModule.hideQuickToolbars();
            done();
        });
    });

    describe('848813 - When clicking on the image to open the quick toolbar, the main toolbar icon should not be in a visible state', () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let innerHTML: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th><th class="e-cell-select"><br></th></tr></thead><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""> <img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/> <br></td></tr></tbody></table><p><br></p>`;
        beforeAll((done: DoneFn) => {
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
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        it('Checking the main toolbar icon should not be in a visible state', (done: Function) => {
            let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('.e-rte-image');
            (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
            clickEvent.initEvent("mousedown", false, true);
            target.dispatchEvent(clickEvent);
            (<any>rteObj).imageModule.editAreaClickHandler({args:clickEvent});
            expect(rteEle.querySelectorAll(".e-toolbar-item")[3].classList.contains("e-overlay")).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[4].classList.contains("e-overlay")).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[6].classList.contains("e-overlay")).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[25].classList.contains("e-overlay")).toBe(false);
            done();
        });
    });

    describe('854233 - The quick format toolbar item status is not updated.', () => {
        let rteObj: RichTextEditor;
        let trg: HTMLElement;
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    text: ['Undo', 'Redo', '|', 'Bold', 'Italic', '|', 'FontName', 'FontSize', 'Formats']
                },
                value: `<p><strong><em><span class="target" style="font-size: 18pt;">Text Quick toolbar</span></em></strong></p>`
            });
            done();
        });
        
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
        
        it('Check for the toolbar status in the Text Quick Edit toolbar', (done: Function) => {
            trg = rteObj.inputElement.firstChild as HTMLElement;
            const mouseDownEvent = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
            rteObj.inputElement.dispatchEvent(mouseDownEvent);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, document.querySelector('.target').firstChild, document.querySelector('.target').firstChild, 0, 5);
            const mouseUpEvent = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
            rteObj.inputElement.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                const items: NodeListOf<Element> = document.querySelector('.e-rte-text-quicktoolbar').querySelectorAll('.e-toolbar-item');
                expect(items[0].classList.contains('e-overlay')).toBe(true);
                expect(items[1].classList.contains('e-overlay')).toBe(true);
                expect(items[3].classList.contains('e-overlay')).toBe(false);
                done();
            }, 100);
        });
    });

    describe('855892 - Quick format toolbar is not opened when the text is selected with Keyboard action.', () => {
        let editorObj: RichTextEditor;
        beforeAll((done: DoneFn) => {
            editorObj = renderRTE({
                quickToolbarSettings: {
                    text: ['Bold', 'Italic', 'Underline']
                },
            });
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(editorObj);
            done();
        });
        it('Should open the quick toolbar when the text is selected with Keyboard action.', (done: Function) => {
            editorObj.inputElement.dispatchEvent(new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true }));
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
                expect(document.querySelector('.e-rte-text-quicktoolbar').querySelectorAll('.e-toolbar-item').length).toBe(3);
                done();
            }, 100);
        });
    });

    describe('872942 - The ALT + F10  shortcut to focus the Quick Toolbar is not working properly.', () => {
        let editorObj: RichTextEditor;
        beforeAll((done: DoneFn) => {
            editorObj = renderRTE({
                value: '<img alt="image 1" src="/base/spec/content/image/RTEImage-Feather.png" style="width: 450px; height: 300px;" />'
            });
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(editorObj);
            done();
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

    describe('872307 - Tabel merge quick toolbar tooltip issues ', () => {
        let rteObj: RichTextEditor;
        beforeAll((done: DoneFn) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'TableCell', '-',
                    'BackgroundColor', 'TableRemove', 'TableCellVerticalAlign', 'Styles']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="td1" style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p><br></p>`
            });
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            if (document.querySelector('.e-quick-dropdown').id.indexOf('quick_TableRows-popup') > 0) {
                document.querySelector('.e-quick-dropdown').remove();
            }
            done();
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
            const mergeCell = document.body.querySelector('li[title="Merge cells"]') as HTMLElement;
            const horizSplit = document.body.querySelector('li[title="Horizontal split"]') as HTMLElement;
            const verriSplit = document.body.querySelector('li[title="Vertical split"]') as HTMLElement;
            expect(!isNullOrUndefined(mergeCell)).toBe(false);
            expect(!isNullOrUndefined(horizSplit)).toBe(false);
            expect(!isNullOrUndefined(verriSplit)).toBe(false);
            done();
        });
    });
});
