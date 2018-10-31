/**
 * RTE - Toolbar action spec
 */
import { selectAll, select, Browser, createElement, detach, EventHandler } from "@syncfusion/ej2-base";
import { RichTextEditor, ToolbarType, Toolbar, HtmlEditor, MarkdownEditor } from "../../../src/rich-text-editor/index";
import { IToolbarStatus } from '../../../src/common/interface';
import { renderRTE, destroy } from "./../render.spec";

RichTextEditor.Inject(HtmlEditor, MarkdownEditor, Toolbar);

function copyObject(source: any, destination: any): Object {
    for (let prop in source) {
        destination[prop] = source[prop];
    }
    return destination;
}

function setMouseCoordinates(eventArg: any, x: number, y: number, target: Element): Object {
    eventArg.pageX = x;
    eventArg.pageY = y;
    eventArg.clientX = x;
    eventArg.clientY = y;
    eventArg.target = target;
    return eventArg;
}

function getEventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe("Toolbar - Actions Module", () => {

    beforeAll(() => {
        let css: string = ".e-richtexteditor { margin-top: 100px; height: 200px }" +
            ".e-toolbar { display: block; white-space: nowrap; position: relative; }" +
            ".e-toolbar-items { display: inline-block; }" +
            ".e-popup-open { display:block } .e-popup-close { display: none }" +
            ".e-toolbar-item { display: inline-block; }";
        let style: HTMLStyleElement = document.createElement('style');
        style.type = "text/css";
        style.id = "toolbar-style";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    });

    afterAll(() => {
        document.head.getElementsByClassName('toolbar-style')[0].remove();
    });

    describe("ToolbarSettings property testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        beforeEach(() => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("toolbarSettings property default value testing", () => {
            expect(rteObj.toolbarSettings.enable).toBe(true);
            expect(rteObj.toolbarSettings.items.length).toBe(15);
            expect(rteObj.toolbarSettings.type).toBe(ToolbarType.Expand);
        });

        it("toolbarSettings - 'items' property default value testing", () => {
            expect(rteObj.toolbarSettings.items[0]).toBe("Bold");
            expect(rteObj.toolbarSettings.items[1]).toBe("Italic");
            expect(rteObj.toolbarSettings.items[2]).toBe("Underline");
            expect(rteObj.toolbarSettings.items[3]).toBe("|");
            expect(rteObj.toolbarSettings.items[4]).toBe("Formats");
            expect(rteObj.toolbarSettings.items[5]).toBe("Alignments");
            expect(rteObj.toolbarSettings.items[6]).toBe("OrderedList");
            expect(rteObj.toolbarSettings.items[7]).toBe("UnorderedList");
            expect(rteObj.toolbarSettings.items[8]).toBe("|");
            expect(rteObj.toolbarSettings.items[9]).toBe("CreateLink");
            expect(rteObj.toolbarSettings.items[10]).toBe("Image");
            expect(rteObj.toolbarSettings.items[11]).toBe("|");
            expect(rteObj.toolbarSettings.items[12]).toBe("SourceCode");
            expect(rteObj.toolbarSettings.items[13]).toBe("Undo");
            expect(rteObj.toolbarSettings.items[14]).toBe("Redo");
        });

        it("toolbarSettings - 'items' property default value element testing", () => {
            let tbItems: NodeList = rteEle.querySelectorAll(".e-toolbar-item");
            expect((<HTMLElement>tbItems.item(0)).firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(1)).firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(2)).firstElementChild.id.indexOf("Underline") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(3)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>tbItems.item(4)).firstElementChild.id.indexOf("Formats") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(5)).firstElementChild.id.indexOf("Alignments") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(6)).firstElementChild.id.indexOf("OrderedList") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(7)).firstElementChild.id.indexOf("UnorderedList") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(8)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>tbItems.item(9)).firstElementChild.id.indexOf("CreateLink") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(10)).firstElementChild.id.indexOf("Image") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(11)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>tbItems.item(12)).firstElementChild.id.indexOf("SourceCode") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(13)).firstElementChild.id.indexOf("Undo") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(14)).firstElementChild.id.indexOf("Redo") > 0).toBe(true);
        });
    });

    describe("Toolbar availability testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        afterEach(() => {
            destroy(rteObj);
        });

        it("Default toolbarType with testing", () => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
        });

        it("ToolbarType as 'Standard' with testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    type: ToolbarType.Expand
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
        });

        it("ToolbarType as 'Floating' with testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enableFloating: true,
                    type: ToolbarType.Expand
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
        });

        it("ToolbarType as 'Expand' with testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    type: ToolbarType.Expand
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
        });

        it("ToolbarType as 'InLine' with testing", () => {
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-rte-inline-popup").length).toBe(0);
        });

        it("ToolbarSettings - 'enable' property as 'false' with testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: false
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
            //hidden textarea, so count will be 2
            expect(rteEle.children.length).toBe(2);
        });
    });

    describe("getToolbar public method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        afterEach(() => {
            destroy(rteObj);
        });

        it("DIV - toolbar element testing", () => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
            expect(rteObj.getToolbar()).not.toBe(null);
            expect(rteObj.getToolbar().classList.contains("e-toolbar")).toBe(true);
            expect(rteObj.getToolbar().classList.contains("e-control")).toBe(true);
        });

        it("IFrame - toolbar element testing", () => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteObj.getToolbar()).not.toBe(null);
            expect(rteObj.getToolbar().classList.contains("e-toolbar")).toBe(true);
            expect(rteObj.getToolbar().classList.contains("e-control")).toBe(true);
        });

        it("DIV - toolbarSettings - 'enable' property disable with toolbar element testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: false
                }
            });
            rteEle = rteObj.element;
            expect(rteObj.getToolbar()).toBe(null);
        });

        it("IFrame - toolbarSettings - 'enable' property disable with toolbar element testing", () => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    enable: false
                }
            });
            rteEle = rteObj.element;
            expect(rteObj.getToolbar()).toBe(null);
        });
    });

    describe("toolbarSettings - 'items' property customize value testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        afterEach(() => {
            destroy(rteObj);
        });

        it("Customize value as string", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "Italic", "|", "FullScreen"]
                }
            });
            rteEle = rteObj.element;
            expect(rteObj.toolbarSettings.items.length).toBe(4);
            expect(rteObj.toolbarSettings.items[0]).toBe("Bold");
            expect(rteObj.toolbarSettings.items[1]).toBe("Italic");
            expect(rteObj.toolbarSettings.items[2]).toBe("|");
            expect(rteObj.toolbarSettings.items[3]).toBe("FullScreen");
        });

        it("Customize value as string with element testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "Italic", "|", "FullScreen"]
                }
            });
            rteEle = rteObj.element;
            let tbItems: NodeList = rteEle.querySelectorAll(".e-toolbar-item");
            expect((<HTMLElement>tbItems.item(0)).firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(1)).firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(2)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>tbItems.item(3)).firstElementChild.id.indexOf("Maximize") > 0).toBe(true);
        });

        it("Object collection with items list testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [
                        { tooltipText: "CustomButton", template: "<button>Button</button>" },
                        { tooltipText: "CustomText", template: "<p></p>" }
                    ]
                }
            });
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle.length).toBe(2);
            expect(tbItemsEle[0].title).toBe("CustomButton");
            expect(tbItemsEle[1].title).toBe("CustomText");
        });

        it("Using both string and Object collection with items list testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [
                        "Bold", "Italic", "|", "FullScreen",
                        { tooltipText: "CustomButton", template: "<button>Button</button>" },
                        { tooltipText: "CustomText", template: "<p></p>" }
                    ]
                }
            });
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle.length).toBe(6);
            expect(tbItemsEle[0].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            expect(tbItemsEle[1].firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            expect(tbItemsEle[2].classList.contains("e-separator")).toBe(true);
            expect(tbItemsEle[3].firstElementChild.id.indexOf("Maximize") > 0).toBe(true);
            expect(tbItemsEle[4].title).toBe("CustomButton");
            expect(tbItemsEle[5].title).toBe("CustomText");
        });

        it("ToolbarSettings as empty object testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: []
                }
            });
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle.length).toBe(0);
        });
    });

    describe("showFullScreen public method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold"]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Class testing", () => {
            expect(rteEle.classList.contains("e-rte-full-screen")).toBe(false);
            rteObj.showFullScreen();
            expect(rteEle.classList.contains("e-rte-full-screen")).toBe(true);
            rteObj.showFullScreen();
            expect(rteEle.classList.contains("e-rte-full-screen")).toBe(true);
        });

        it("Minimize button availability testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1]).toBe(undefined);
            rteObj.showFullScreen();
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Minimize");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].querySelector("span").classList.contains("e-minimize")).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Minimize") > 0).toBe(true);
        });
    });

    describe(" Without toolbar - showFullScreen public method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: false
                }
            });
            rteEle = rteObj.element;
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it("showFullScreen", () => {
            rteObj.fullScreenModule.showFullScreen();
            expect(rteEle.classList.contains("e-rte-full-screen")).toBe(true);
        });

        it("hideFullScreen", () => {
            rteObj.fullScreenModule.hideFullScreen();
            expect(rteEle.classList.contains("e-rte-full-screen")).toBe(false);
        });
    });

    describe("Toolbar module addTBarItem private method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold"]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("addTBarItem method testing with text as empty string", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(1);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            rteObj.toolbarModule.addTBarItem({ updateItem: 'Undo', targetItem: 'Undo', baseToolbar: rteObj.getBaseToolbarObject() }, 0);
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-tbar-btn-text").length).toBe(0);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Undo") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
        });
    });

    describe("Toolbar fullscreen item with maximize/minimize testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "FullScreen"]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Maximize, minimize button click testing", () => {
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[1];
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            rteObj.fullScreenModule.hideFullScreen();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
        });

        it("Scrollable div parent element with maximize testing", () => {
            let rteElement: HTMLElement = createElement('div', { id: 'rteSample' });
            let rteWrapper: HTMLElement = createElement('div', { id: 'rteWrapper', innerHTML: rteElement.outerHTML });
            document.body.appendChild(rteWrapper);
            let sample: RichTextEditor = new RichTextEditor({
                height: 1000,
                toolbarSettings: {
                    items: ["Bold", "FullScreen"]
                }
            });
            sample.appendTo('#rteSample');
            rteEle = sample.element;
            (<HTMLElement>select('#rteWrapper', document.body)).style.height = '300px';
            (<HTMLElement>select('#rteWrapper', document.body)).style.overflow = 'auto';
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[1];
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
        });
    });

    describe("Markdown-Toolbar fullscreen item with maximize/minimize testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "FullScreen"]
                },
                editorMode: 'Markdown'
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Maximize, minimize button click testing", () => {
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[1];
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            rteObj.fullScreenModule.hideFullScreen();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
        });
    });

    describe("Fixed toolbar testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;

        beforeEach(() => {
            document.body.appendChild(createElement('input', { id: 'trgBtn', attrs: { type: 'text' } }));
        });

        afterEach(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });

        it("DIV - Class testing", () => {
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
            expect(rteEle.querySelector(".e-toolbar")).toBe(null);
            destroy(rteObj);
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
            destroy(rteObj);
            Browser.userAgent = defaultUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
            expect(rteEle.querySelector(".e-toolbar")).toBe(null);
        });

        it("DIV - Focus and blur based fixed toolbar visibility testing", () => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            let cntEle: HTMLElement = rteEle.querySelector(".e-rte-content > .e-content");
            let mouseDownEvent: MouseEvent = document.createEvent("MouseEvents");
            mouseDownEvent.initEvent("mousedown", true, true);
            cntEle.dispatchEvent(mouseDownEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
            rteObj.toolbarModule.hideFixedTBar();
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
        });

        it("DIV - Content focus after toolbar interaction with focus state testing", () => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            let cntEle: HTMLElement = rteEle.querySelector(".e-rte-content > .e-content");
            let mouseDownEvent: MouseEvent = document.createEvent("MouseEvents");
            mouseDownEvent.initEvent("mousedown", true, true);
            cntEle.dispatchEvent(mouseDownEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
            let trg: HTMLElement = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[3];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
            Browser.userAgent = defaultUA;
        });

        it("Page scroll with toolbar availability testing", (done: Function) => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                height: 700,
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
            let cntEle: HTMLElement = rteEle.querySelector(".e-rte-content > .e-content");
            let mouseDownEvent: MouseEvent = document.createEvent("MouseEvents");
            mouseDownEvent.initEvent("mousedown", true, true);
            cntEle.dispatchEvent(mouseDownEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
            window.scrollTo(0, 100);
            setTimeout(() => {
                Browser.userAgent = defaultUA;
                expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
                done();
            }, 400);
        });

        it("DIV - Maximize/Minimize testing", () => {
            let trg: HTMLElement;
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "FullScreen"]
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trg = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[1];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            trg.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trg = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[1];
            trg.dispatchEvent(clickEvent);
            trg.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
        });

        it("Mobile - inlineMode with Maximize/Minimize testing", () => {
            let trg: HTMLElement;
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "FullScreen"]
                },
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trg = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[1];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            trg.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trg = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[1];
            trg.dispatchEvent(clickEvent);
            trg.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
        });

        it("IFrame - Class testing", () => {
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
            destroy(rteObj);
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
            destroy(rteObj);
            Browser.userAgent = defaultUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
        });

        it("IFrame - Focus and blur based fixed toolbar visibility testing", () => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
            let cntEle: HTMLElement = (rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector("body");
            let mouseDownEvent: MouseEvent = document.createEvent("MouseEvents");
            mouseDownEvent.initEvent("mousedown", true, true);
            cntEle.dispatchEvent(mouseDownEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
        });

        it("IFrame - Content focus after toolbar interaction with focus state testing", () => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
            let cntEle: HTMLElement = (rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector("body");
            let mouseDownEvent: MouseEvent = document.createEvent("MouseEvents");
            mouseDownEvent.initEvent("mousedown", true, true);
            cntEle.dispatchEvent(mouseDownEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
            let trg: HTMLElement = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[3];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            Browser.userAgent = defaultUA;
        });

        it("iOS fixed toolbar state testing", () => {
            mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
            let cntEle: HTMLElement = rteEle.querySelector(".e-rte-content > .e-content");
            let mouseDownEvent: MouseEvent = document.createEvent("MouseEvents");
            mouseDownEvent.initEvent("mousedown", true, true);
            cntEle.dispatchEvent(mouseDownEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-tbar-ios-fixed")).toBe(true);
            let trg: HTMLElement = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[3];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            Browser.userAgent = defaultUA;
        });
    });

    describe("Floating toolbar testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let ele1: HTMLElement = createElement("div", { id: "div1", styles: "height: 900px" });
        let ele2: HTMLElement = createElement("div", { id: "div2", styles: "height: 400px" });

        beforeEach((done: Function) => {
            document.body.style.height = '2000px';
            rteObj = renderRTE({
                toolbarSettings: {
                    enableFloating: true,
                    type: ToolbarType.Expand
                },
                height: '800px',
                value: '<br /> <br /> <br /> <br /> <p id="trg"></p>',
            });
            rteEle = rteObj.element;
            document.body.appendChild(ele1);
            done();
        });

        afterEach(() => {
            document.body.style.height = '';
            destroy(rteObj);
        });

        it("Class testing", (done: Function) => {
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            window.scrollTo(0, 200);
            rteObj.fullScreenModule.showFullScreen();
            expect((rteObj.getToolbarElement() as HTMLElement).style.top==='0px').toBe(true);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(true);
                window.scrollTo(0, 0);
                done();
            }, 500);
        });

        it("Out of viewable area with class testing", (done: Function) => {
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            window.scrollTo(0, 1000);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
                done();
            }, 400);
        });

        it("Element as target testing", (done: Function) => {
            document.body.style.height = '';
            destroy(rteObj);
            document.body.appendChild(ele1);
            ele1.appendChild(ele2);
            ele1.style.height = '300px';
            ele1.style.overflow = 'auto';
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    enableFloating: true,
                    type: ToolbarType.Expand
                },
                height: '800px',
                value: '<br /> <br /> <br /> <br /> <p id="trg"></p>',
            }, '#div2');
            rteEle = rteObj.element;
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            ele1.scrollTo(0, 200);
            rteObj.fullScreenModule.showFullScreen();
            expect((rteObj.getToolbarElement() as HTMLElement).style.top==='0px').toBe(true);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(true);
                window.scrollTo(0, 0);
                done();
            }, 500);
        });
    });

    describe("Floating toolbar with transform element testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let ele1: HTMLElement = createElement("div", { id: "div1", styles: "height: 900px" });
        let ele2: HTMLElement = createElement("div", { id: "div2", styles: "height: 400px" });

        beforeEach((done: Function) => {
            document.body.style.height = '2000px';
            document.body.style.transform = 'translateX(0)';
            ele1.style.transform = 'translateX(0)';
            rteObj = renderRTE({
                toolbarSettings: {
                    enableFloating: true,
                    type: ToolbarType.Expand
                },
                height: '800px',
                value: '<br /> <br /> <br /> <br /> <p id="trg"></p>',
            });
            rteEle = rteObj.element;
            document.body.appendChild(ele1);
            done();
        });

        afterEach(() => {
            document.body.style.height = '';
            destroy(rteObj);
        });

        it("Class testing", (done: Function) => {
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            window.scrollTo(0, 200);
            rteObj.fullScreenModule.showFullScreen();
            expect((rteObj.getToolbarElement() as HTMLElement).style.top==='0px').toBe(true);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(true);
                window.scrollTo(0, 0);
                done();
            }, 500);
        });

        it("Out of viewable area with class testing", (done: Function) => {
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            window.scrollTo(0, 1000);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
                done();
            }, 400);
        });

        it("Element as target testing", (done: Function) => {
            document.body.style.height = '';
            destroy(rteObj);
            document.body.appendChild(ele1);
            ele1.appendChild(ele2);
            ele1.style.height = '300px';
            ele1.style.overflow = 'auto';
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    enableFloating: true,
                    type: ToolbarType.Expand
                },
                height: '800px',
                value: '<br /> <br /> <br /> <br /> <p id="trg"></p>',
            }, '#div2');
            rteEle = rteObj.element;
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            ele1.scrollTo(0, 200);
            rteObj.fullScreenModule.showFullScreen();
            expect((rteObj.getToolbarElement() as HTMLElement).style.top==='0px').toBe(true);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(true);
                window.scrollTo(0, 0);
                done();
            }, 500);
        });
    });

    describe("OnPropertyChange testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        afterEach(() => {
            destroy(rteObj);
        });

        it("toolbar element availability with OnPropertyChange testing", () => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            rteObj.toolbarSettings.type = ToolbarType.MultiRow;
            rteObj.dataBind();
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
        });

        it("Toolbar element inavailability with onPropertyChange testing", () => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            detach(rteEle.querySelector(".e-toolbar"));
            rteObj.toolbarSettings.type = ToolbarType.MultiRow;
            rteObj.dataBind();
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
        });

        it("enable/disable toolbar property testing", (done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(15);
            rteObj.toolbarSettings.enable = false;
            rteObj.dataBind();
            setTimeout(() => {
                expect(rteEle.querySelectorAll(".e-toolbar").length).not.toBe(1);
                expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
                done();
            }, 400);
        });
    });

    describe("Custom button with click event bind testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        afterEach(() => {
            destroy(rteObj);
        });

        it("Click event testing", () => {
            let count: number = 0;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [
                        { tooltipText: "CustomButton", template: "<button id='customBtn'>Button</button>" },
                        { tooltipText: "CustomText", template: "<p></p>" }
                    ]
                }
            });
            rteEle = rteObj.element;
            expect(count).toBe(0);
            document.getElementById("customBtn").addEventListener("click", function (): void {
                count++;
            });
            (<HTMLElement>select(".e-toolbar-item button", rteEle)).click();
            expect(count).toBe(1);
        });
    });

    describe("'Formats' - Dropdown button item click testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let mouseEventArgs: any;

        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;

        beforeEach(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Formats"]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });

        it("DropDownButton popup open and item click testing", () => {
            let formatDropDown: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
            formatDropDown.click();
            expect(document.querySelector(".e-dropdown-popup").classList.contains("e-popup-close")).toBe(false);
            expect(document.querySelector(".e-dropdown-popup").classList.contains("e-popup-open")).toBe(true);
            expect(document.querySelector(".e-dropdown-popup .e-item").classList.contains('e-paragraph')).toBe(true);
            let formatDropDownItem: HTMLElement = <HTMLElement>document.querySelectorAll(".e-dropdown-popup .e-item")[0];
            mouseEventArgs = {
                target: formatDropDownItem
            };
            rteObj.toolbarModule.dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            expect(document.querySelector(".e-dropdown-popup").classList.contains("e-popup-close")).toBe(true);
        });
    });

    describe("Dropdown button render testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Formats", "Alignments", "FontName", "FontSize"]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Check id of formats toolbar", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Formats") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild.id.indexOf("Alignments") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[2].firstElementChild.id.indexOf("FontName") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[3].firstElementChild.id.indexOf("FontSize") > 0).toBe(true);
        });

        it("DropDown button class testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn").length).toBe(4);
            expect(rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn.e-control").length).toBe(4);
        });

        it("DropDownButton popup availability testing", () => {
            expect(document.querySelectorAll(".e-rte-dropdown-popup.e-popup")[0].id.indexOf("Alignments") > 0).toBe(true);
            expect(document.querySelectorAll(".e-rte-dropdown-popup.e-popup")[1].id.indexOf("Formats") > 0).toBe(true);
        });

        it("DropDownButton rerender testing", () => {
            rteObj.toolbarModule.dropDownModule.renderDropDowns({
                container: select('.e-toolbar', rteEle),
                containerType: 'toolbar',
                items: ["Formats", "Alignments", "FontName", "FontSize"]
            });
            expect(rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn").length).toBe(4);
        });
    });

    describe("Expand toolbar testing", () => {
        let rteObj: any;
        let rteEle: HTMLElement;

        beforeAll(() => {
            rteObj = renderRTE({
                width: '200px',
                toolbarSettings: {
                    type: ToolbarType.Expand
                }
            });
            rteEle = rteObj.element;
            rteEle.style.height = 300 + 'px';
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it("Class testing", () => {
            expect(document.querySelector(".e-richtexteditor").classList.contains("e-rte-tb-expand")).toBe(true);
            expect(document.querySelectorAll(".e-rte-toolbar").length).toBe(1);
        });

        it("Extend popup availability testing", () => {
            expect(document.querySelectorAll(".e-toolbar-extended").length).toBe(1);
            expect(document.querySelectorAll(".e-toolbar-extended")[0].classList.contains('e-popup-close')).toBe(true);
        });

        it("Expand popup open testing", (done: Function) => {
            let trg: HTMLElement = document.querySelector('.e-hor-nav');
            trg.click();
            setTimeout(() => {
                expect(document.querySelectorAll(".e-toolbar-extended")[0].classList.contains('e-popup-close')).toBe(false);
                expect(document.querySelectorAll(".e-toolbar-extended")[0].classList.contains('e-popup-open')).toBe(true);
                done();
            }, 400);
        });

        it("Expand popup close testing", (done: Function) => {
            let trg: HTMLElement = document.querySelector('.e-hor-nav');
            trg.click();
            setTimeout(() => {
                expect(document.querySelectorAll(".e-toolbar-extended")[0].classList.contains('e-popup-close')).toBe(true);
                expect(document.querySelectorAll(".e-toolbar-extended")[0].classList.contains('e-popup-open')).toBe(false);
                done();
            }, 400);
        });

        it("resize event trigger testing", () => {
            rteObj.resizeHandler();
            expect(document.querySelector(".e-richtexteditor").classList.contains("e-rte-tb-expand")).toBe(true);
        });
    });

    describe("Toolbar status update method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', '|', 'Italic', 'SubScript', 'SuperScript', 'StrikeThrough', 'OrderedList',
                        'UnorderedList', 'UnderLine', 'Formats', 'FontName', 'FontSize', 'Alignments']
                }
            });
            rteEle = rteObj.element;
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it("Class testing", () => {
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle[0].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[1].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[2].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[3].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[4].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[5].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[6].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[7].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[8].classList.contains('e-active')).not.toBe(true);
            expect((<HTMLElement>tbItemsEle[9].firstElementChild).innerText.trim()).toBe('Paragraph');
            expect((<HTMLElement>tbItemsEle[10].firstElementChild).innerText.trim()).toBe('Segoe UI');
            expect((<HTMLElement>tbItemsEle[11].firstElementChild).innerText.trim()).toBe('10 pt');
            expect((<HTMLElement>tbItemsEle[12].firstElementChild).firstElementChild.classList.contains('e-justify-left')).toBe(true);
            expect((<HTMLElement>tbItemsEle[12].firstElementChild).firstElementChild.classList.contains('e-icons')).toBe(true);
        });

        it("Add toolbar status testing", () => {
            rteObj.toolbarModule.updateToolbarStatus({
                bold: true,
                italic: true,
                subscript: true,
                superscript: true,
                strikethrough: true,
                orderedlist: true,
                unorderedlist: true,
                underline: true,
                formats: 'Pre',
                fontname: 'Segoe UI',
                fontsize: '12pt',
                alignments: 'JustifyRight'
            } as IToolbarStatus);
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle[0].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[1].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[2].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[3].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[4].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[5].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[6].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[7].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[8].classList.contains('e-active')).toBe(true);
            expect((<HTMLElement>tbItemsEle[9].firstElementChild).innerText.trim()).toBe('Code');
            expect((<HTMLElement>tbItemsEle[10].firstElementChild).innerText.trim()).toBe('Segoe UI');
            expect((<HTMLElement>tbItemsEle[11].firstElementChild).innerText.trim()).toBe('12 pt');
            expect((<HTMLElement>tbItemsEle[12].firstElementChild).firstElementChild.classList.contains('e-justify-right')).toBe(true);
            expect((<HTMLElement>tbItemsEle[12].firstElementChild).firstElementChild.classList.contains('e-icons')).toBe(true);
        });

        it("Remove toolbar status testing", () => {
            rteObj.toolbarModule.updateToolbarStatus({
                bold: false,
                italic: false,
                subscript: false,
                superscript: false,
                strikethrough: false,
                orderedlist: false,
                unorderedlist: false,
                underline: false,
                formats: 'P',
                fontname: 'Georgia,serif',
                fontsize: '14pt',
                alignments: 'JustifyLeft'
            } as IToolbarStatus);
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle[0].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[1].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[2].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[3].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[4].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[5].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[6].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[7].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[8].classList.contains('e-active')).not.toBe(true);
            expect((<HTMLElement>tbItemsEle[9].firstElementChild).innerText.trim()).toBe('Paragraph');
            expect((<HTMLElement>tbItemsEle[10].firstElementChild).innerText.trim()).toBe('Georgia');
            expect((<HTMLElement>tbItemsEle[11].firstElementChild).innerText.trim()).toBe('14 pt');
            expect((<HTMLElement>tbItemsEle[12].firstElementChild).firstElementChild.classList.contains('e-justify-left')).toBe(true);
            expect((<HTMLElement>tbItemsEle[12].firstElementChild).firstElementChild.classList.contains('e-icons')).toBe(true);
        });
    });

    describe('Escape key from toolbar active item', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let selectNode: Element;
        let editNode: HTMLElement;
        let curDocument: Document;
        let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
        let innerHTML: string = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
        beforeAll(() => {
            rteObj = renderRTE({});
            elem = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            curDocument = rteObj.contentModule.getDocument();
            editNode.innerHTML = innerHTML;
        });

        it('focus the edit area', () => {
            (elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).focus();
            keyBoardEvent.ctrlKey = false;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'escape';
            (rteObj as any).toolbarModule.toolBarKeyDown(keyBoardEvent);
            expect(document.activeElement === editNode).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });

    });
});