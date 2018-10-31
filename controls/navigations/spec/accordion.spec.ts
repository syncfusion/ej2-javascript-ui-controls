/**
 * Accordion scroll spec document
 */
import { Accordion, AccordionClickArgs, ExpandEventArgs } from "../src/accordion/index";
import { isNullOrUndefined as isNOU } from "@syncfusion/ej2-base";
import { isVisible, classList } from "@syncfusion/ej2-base";

type Str = string;

const CLS_ACRDN_ROOT: Str = 'e-acrdn-root';
const CLS_EXPANDSTATE: Str = 'e-expand-state';
const CLS_ROOT: Str = "e-accordion";
const CLS_ITEM: Str = "e-acrdn-item";
const CLS_HEADER: Str = "e-acrdn-header";
const CLS_ITEMHIDE: Str = "e-hide";
const CLS_HEADERICN: Str = "e-acrdn-header-icon";
const CLS_HEADERCTN: Str = 'e-acrdn-header-content';
const CLS_CONTENT: Str = "e-acrdn-panel";
const CLS_CTENT: Str = "e-acrdn-content";
const CLS_TOOGLEICN: Str = "e-toggle-icon";
const CLS_COLLAPSEICN: Str = "e-tgl-collapse-icon";
const CLS_EXPANDICN: Str = "e-expand-icon";
const CLS_RTL: Str = "e-rtl";
const CLS_CTNHIDE: Str = "e-content-hide";
const CLS_SLCT: Str = "e-select";
const CLS_SLCTED: Str = "e-selected";
const CLS_ACTIVE: Str = "e-active";
const CLS_DISABLE: Str = "e-overlay";
const CLS_TOGANIMATE: Str = "e-toggle-animation";
const TIME_DELAY: number = 800;
const CLS_NEST: Str = 'e-nested';

describe("Accordion Testing", () => {
    let css: string = ".e-content-hide,.e-hide { display: none }  ";
    let style: HTMLStyleElement = document.createElement("style"); style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
    function sleep(time: number): any {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function clone(obj: any): any {
        if (null == obj || "object" != typeof obj) { return obj; }
        let copy: any = obj.constructor();
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) { copy[attr] = obj[attr]; }
        }
        return copy;
    }
    describe("Accordion Class Testing ", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            new Accordion({}, ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Base class testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            expect(ele.classList.contains("e-accordion")).toEqual(true);
            expect(ele.classList.contains("e-control")).toEqual(true);
        });
    });

    describe("Accordion Base property Testing ", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Base property Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({}, ele);
            expect(isNOU(accordion.animation)).toEqual(false);
            expect(isNOU(accordion.element)).toEqual(false);
            expect(isNOU(accordion.height)).toEqual(false);
            expect(isNOU(accordion.width)).toEqual(false);
            expect(isNOU(accordion.expandMode)).toEqual(false);
        });
    });

    describe("Accordion Base property default value Testing ", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Base property Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({}, ele);
            expect(accordion.height).toEqual("auto");
            expect(accordion.width).toEqual("100%");
            expect(accordion.expandMode).toEqual("Multiple");
        });
    });

    describe("AccordionItem property Testing ", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Base property Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{}] }, ele);
            expect(isNOU(accordion.items[0].content)).toBe(true);
            expect(isNOU(accordion.items[0].cssClass)).toBe(true);
            expect(isNOU(accordion.items[0].expanded)).toBe(false);
            expect(isNOU(accordion.items[0].header)).toBe(true);
            expect(isNOU(accordion.items[0].iconCss)).toBe(true);
        });
    });

    describe("Accordion DOM class Testing ", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Item DOM class Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{}] }, ele);
            expect(ele.children[0].classList.contains(CLS_ITEM)).toBe(true);
        });
        it("Accordion Item Header DOM class Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{ header: "Item1" }] }, ele);
            let eleItem: HTMLElement = <HTMLElement>ele.children[0];
            expect(eleItem.children[0].classList.contains(CLS_HEADER)).toBe(true);
            expect(eleItem.classList.contains(CLS_SLCT)).toBe(false);
            (<HTMLElement>eleItem.children[0]).click();
            expect(eleItem.classList.contains(CLS_SLCTED)).toBe(false);
            expect(eleItem.classList.contains(CLS_ACTIVE)).toBe(false);
        });
        it("Accordion Item Content DOM class Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{ header: "Item1", content: "Content of Item1" }] }, ele);
            let eleItem: HTMLElement = <HTMLElement>ele.children[0];
            expect(eleItem.classList.contains(CLS_SLCT)).toBe(true);
        });
        it("Accordion Item Header with icon DOM class Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{ header: "Item1", content: "Content of Item1" }] }, ele);
            let eleItem: HTMLElement = <HTMLElement>ele.children[0].children[0];
            expect(eleItem.firstElementChild.classList.contains(CLS_HEADERCTN)).toBe(true);
            expect(eleItem.children[1].classList.contains(CLS_TOOGLEICN)).toBe(true);
            expect(eleItem.children[1].firstElementChild.classList.contains(CLS_COLLAPSEICN)).toBe(true);
            expect(eleItem.children[1].firstElementChild.classList.contains("e-icons")).toBe(true);
        });
    });
    describe("Accordion Item property behavior Testing ", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Item property Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{}] }, ele);
            expect(ele.children.length === accordion.items.length).toBe(true);
            expect(ele.querySelectorAll("." + CLS_ITEM).length === accordion.items.length).toBe(true);
        });
        it("AccordionItem Header property Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{ header: "Item1" }] }, ele);
            let headerEle: HTMLElement = <HTMLElement>ele.children[0].children[0];
            expect(ele.children.length === accordion.items.length).toBe(true);
            expect(ele.querySelectorAll("." + CLS_ITEM).length === accordion.items.length).toBe(true);
            expect(headerEle.childElementCount).toBe(1);
            expect( ele.children[0].children[0].children[1] === undefined).toBe(true);
            expect(headerEle.firstChild.textContent === "Item1").toBe(true);
        });
        it("AccordionItem  Content property  Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{ header: "Item1", content: "Content of Item1" }] }, ele);
            let headerEle: HTMLElement = <HTMLElement>ele.children[0].children[0];
            expect(headerEle.children[1] === ele.querySelector("." + CLS_TOOGLEICN)).toBe(true);
            expect(headerEle.firstChild.textContent === "Item1").toBe(true);
            expect(headerEle.nextElementSibling === ele.querySelector("." + CLS_CONTENT)).toBe(true);
        });
        it("AccordionItem  Content without header property  Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{ content: "Content of Item1" }] }, ele);
            let headerEle: HTMLElement = <HTMLElement>ele.children[0].children[0];
            expect(headerEle.childElementCount).toBe(1);
            expect(headerEle.firstElementChild === ele.querySelector("." + CLS_TOOGLEICN)).toBe(true);
            expect(headerEle.firstChild.textContent === "Item1").toBe(false);
            expect(headerEle.nextElementSibling === ele.querySelector("." + CLS_CONTENT)).toBe(true);
        });
        it("AccordionItem  iconCSS property  Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{ iconCss: "e-itemIcon" }] }, ele);
            let headerEle: HTMLElement = <HTMLElement>ele.children[0].children[0];
            expect(headerEle.childElementCount).toBe(1);
            expect(headerEle.classList.contains(CLS_HEADER)).toBe(true);
            expect((<HTMLElement>headerEle.firstChild).classList.contains(CLS_HEADERICN)).toBe(true);
            expect(headerEle.firstChild.firstChild === ele.querySelector("span.e-itemIcon")).toBe(true);
        });
        it("AccordionItem  iconCSS property  Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{ iconCss: "e-itemIcon", header: "item1" }] }, ele);
            let headerEle: HTMLElement = <HTMLElement>ele.children[0].children[0];
            expect(headerEle.childElementCount).toBe(2);
            expect(headerEle.classList.contains(CLS_HEADER)).toBe(true);
            expect((<HTMLElement>headerEle.firstChild).classList.contains(CLS_HEADERICN)).toBe(true);
            expect(headerEle.firstChild.firstChild === ele.querySelector("span.e-itemIcon")).toBe(true);
            expect(headerEle.firstChild.nextSibling.textContent === "item1").toBe(true);
        });
        it("AccordionItem  iconCSS property  Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{ cssClass: 'CustomClass' }] }, ele);
            let innerItem: Element = ele.children[0];
            expect(innerItem.classList.contains('CustomClass')).toBe(true);
        });
    });
    describe("Accordion Item expanded Property testing", () => {
        let accordion: any;
        document.body.innerHTML = "";
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            let acrdnItem1: Element = ele.children[1];
            expect(acrdnItem1.childElementCount).toBe(1);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(isVisible(itemContent)).toBe(true);
            expect(acrdnItem1.childElementCount).toBe(2);
            expect(accordion.initExpand[0]).toBe(0);
            expect(accordion.expandedItems[0]).toBe(0);
            itemContent = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(isNOU(itemContent)).toBe(false);
            expect(isVisible(itemContent)).toBe(true);
            expect(itemContent.classList.contains(CLS_CTNHIDE)).toBe(false);
            expect(acrdnItem1.classList.contains(CLS_ACTIVE)).toBe(true);
        });
    });
    describe("Accordion Item expanded Property testing with Fade animation", () => {
        let accordion: any;
        document.body.innerHTML = "";
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    animation: { expand: { effect: 'FadeZoomIn' }, collapse: { effect: 'FadeZoomOut' } },
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            let acrdnItem1: Element = ele.children[1];
            expect(acrdnItem1.childElementCount).toBe(1);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing with Fade animation", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(isVisible(itemContent)).toBe(true);
            expect(acrdnItem1.childElementCount).toBe(2);
            expect(accordion.initExpand[0]).toBe(0);
            expect(accordion.expandedItems[0]).toBe(0);
            itemContent = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(isNOU(itemContent)).toBe(false);
            expect(isVisible(itemContent)).toBe(true);
            expect(itemContent.classList.contains(CLS_CTNHIDE)).toBe(false);
            expect(acrdnItem1.classList.contains(CLS_ACTIVE)).toBe(true);
        });
    });
    describe("Accordion RTL property Testing ", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion RTL Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion({ items: [{}], enableRtl: true }, ele);
            expect(ele.classList.contains(CLS_RTL)).toBe(true);
        });
    });
    describe("Accordion Control template Testing ", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Control with header template", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnHeader: HTMLElement = document.createElement("div");
            let acrdnHcontent: HTMLElement = document.createElement("div");;
            acrdnHeader.appendChild(acrdnHcontent);
            let acrdnItemEle: HTMLElement = document.createElement("div");
            acrdnItemEle.appendChild(acrdnHeader);
            ele.appendChild(acrdnItemEle);
            accordion = new Accordion({}, ele);
            let acrdnItem: any = ele.children;
            expect((<HTMLElement>acrdnItem[0]).classList.contains(CLS_ITEM)).toBe(true);
            expect((<HTMLElement>acrdnItem[0].firstChild).classList.contains(CLS_HEADER)).toBe(true);
            expect((<HTMLElement>acrdnItem[0].firstChild.firstChild).classList.contains(CLS_HEADERCTN)).toBe(true);
            expect(acrdnItem[0].firstChild === ele.querySelector("." + CLS_HEADER)).toBe(true);
            expect((<HTMLElement>acrdnItem[0].firstChild).childElementCount).toBe(1);
        });
        it("Accordion Control with header and content template", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnHeader: HTMLElement = document.createElement("div");
            let acrdnContent: HTMLElement = document.createElement("div");
            let acrdnItemEle: HTMLElement = document.createElement("div");
            acrdnItemEle.appendChild(acrdnHeader);
            acrdnItemEle.appendChild(acrdnContent);
            ele.appendChild(acrdnItemEle);
            accordion = new Accordion({}, ele);
            let acrdnItem: Element = ele.children[0];
            let acrdnItemHder: Element = acrdnItem.firstElementChild;
            expect(acrdnItemHder.childElementCount).toBe(1);
            expect(acrdnItemHder.firstElementChild.classList.contains(CLS_TOOGLEICN)).toBe(true);
            expect(acrdnItem.childElementCount).toBe(2);
        });
        it("Accordion Control with header and content with inner Content template", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnHeader: HTMLElement = document.createElement("div");
            let acrdnContent: HTMLElement = document.createElement("div");
            let acrdnInnerContent: HTMLElement = document.createElement("div");
            let acrdnItemEle: HTMLElement = document.createElement("div");
            acrdnContent.appendChild(acrdnInnerContent);
            acrdnItemEle.appendChild(acrdnHeader);
            acrdnItemEle.appendChild(acrdnContent);
            ele.appendChild(acrdnItemEle);
            accordion = new Accordion({}, ele);
            let acrdnItem: Element = ele.children[0];
            let acrdnItemHder: Element = acrdnItem.firstElementChild;
            let acrdnInnerCtn: Element = acrdnItem.children[1].children[0];
            expect(acrdnItemHder.childElementCount).toBe(1);
            expect(acrdnInnerCtn.classList.contains(CLS_CTENT)).toBe(true);
            expect(acrdnItemHder.firstElementChild.classList.contains(CLS_TOOGLEICN)).toBe(true);
            expect(acrdnItem.childElementCount).toBe(2);
            accordion.refresh();
            acrdnItem = ele.children[0];
            acrdnItemHder = acrdnItem.firstElementChild;
            acrdnInnerCtn = acrdnItem.children[1].children[0];
            expect(acrdnItemHder.childElementCount).toBe(1);
            expect(acrdnInnerCtn.classList.contains(CLS_CTENT)).toBe(true);
            expect(acrdnItemHder.firstElementChild.classList.contains(CLS_TOOGLEICN)).toBe(true);
            expect(acrdnItem.childElementCount).toBe(2);
        });
        it("Accordion Control without header and content template", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItemEle: HTMLElement = document.createElement("div");
            ele.appendChild(acrdnItemEle);
            accordion = new Accordion({}, ele);
            let acrdnItem: Element = ele.children[0];
            expect(acrdnItem.classList.contains(CLS_ITEM)).toBe(true);
        });
    });
    describe("Accordion Item Content behavior", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content  Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(isNOU(itemContent)).toBe(true);
            expect(acrdnItem1.childElementCount).toBe(1);
        });
    });
    describe("Accordion Content behaviour with Template Testing", () => {
        let accordion: any;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            let elem: HTMLElement = document.createElement("button");
            elem.id = "ButtonEle";
            ele.innerText = "TemplateCont";
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[1];
            expect(isVisible(eleItem.children[1])).toBe(true);
            expect(ele.children[0].childElementCount).toBe(1);
            expect(eleItem.querySelector('.' + CLS_CTENT).firstElementChild.tagName).toBe('BUTTON');
            expect(accordion.isDestroy).toBe(false);
            accordion.refresh();
            expect(accordion.isDestroy).toBe(true);
            eleItem = ele.children[1];
            expect(isVisible(eleItem.children[1])).toBe(false);
            expect(ele.children[0].childElementCount).toBe(1);
            expect(eleItem.querySelector('.' + CLS_CTENT).firstElementChild.tagName).toBe('BUTTON');
            accordion.destroy();
            document.body.innerHTML = "";
        });
        it("Accordion Content behaviour eith Template Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "#ButtonEle", expanded: true }
                    ]
                }, ele);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Header behaviour with Template Testing", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            let elem: HTMLElement = document.createElement("button");
            elem.id = "ButtonEle";
            ele.innerText = "TemplateCont";
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[1];
            expect(isVisible(eleItem.children[1])).toBe(true);
            expect(ele.children[0].childElementCount).toBe(1);
            expect(eleItem.querySelector('.' + CLS_HEADER).firstElementChild.firstElementChild.tagName).toBe('BUTTON');
            accordion.destroy();
            expect(document.querySelectorAll('#ButtonEle').length).toBe(1);
            expect(accordion.element.querySelectorAll('#ButtonEle').length).toBe(0);
            document.body.innerHTML = "";
        });
        it("Accordion Content behaviour eith Template Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "#ButtonEle", content: "Content of Item2", expanded: true }
                    ]
                }, ele);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion getPersistance Testing", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[0];
            expect(isVisible(eleItem.children[1])).toBe(true);
            expect(ele.children[1].childElementCount).toBe(1);
            accordion.destroy();
            document.body.innerHTML = "";
        });
        it("Accordion getPersistance data  Testing", (done: Function) => {
            window.localStorage.setItem('accordionaccordion', JSON.stringify({ expandedItems: '[0]' }));
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    enablePersistence: true,
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Accordion getPersistance data  Testing", (done: Function) => {
            window.localStorage.setItem('accordionaccordion', JSON.stringify({ expandedItems: '[0]' }));
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    enablePersistence: true,
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion getPersistance with initial expanding", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[0];
            expect(isVisible(eleItem.children[1])).toBe(true);
            expect(ele.children[1].childElementCount).toBe(1);
            accordion.destroy();
            document.body.innerHTML = "";
        });
        it("Accordion getPersistance data  Testing", (done: Function) => {
            window.localStorage.setItem('accordionaccordion', JSON.stringify({ initExpand: '[0]' }));
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    enablePersistence: true,
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion OnProperty Change behaviour Testing", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion OnProperty Change in RTL mode", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            accordion.enableRtl = true;
            accordion.dataBind();
            expect(ele.classList.contains(CLS_RTL)).toBe(true);
        });
        it("Accordion OnProperty Change in RTL mode", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    enableRtl: true,
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.classList.contains(CLS_RTL)).toBe(true);
            accordion.enableRtl = false;
            accordion.dataBind();
            expect(ele.classList.contains(CLS_RTL)).toBe(false);
        });
        it("Accordion OnProperty Change in Height Property", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            accordion.height = 400;
            accordion.dataBind();
            expect(ele.style.height).toBe('400px');
        });
        it("Accordion OnProperty Change in Width Property", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            accordion.width = 400;
            accordion.dataBind();
            expect(ele.style.width).toBe('400px');
        });
        it("Accordion OnProperty Change in ExpandMode Property", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            accordion.expandMode = 'Single';
            accordion.dataBind();
            expect(ele.getAttribute('aria-multiselectable')).toBe('false');
        });
        it("Accordion OnProperty Change in ExpandMode Property", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: 'Single',
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.getAttribute('aria-multiselectable')).toBe('false');
            accordion.expandMode = 'Multiple';
            accordion.dataBind();
            expect(ele.getAttribute('aria-multiselectable')).toBe('true');
        });
    });
    describe("Accordion expandMode on property Change behavior", () => {
        let accordion: any;
        beforeEach((done: Function): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2", expanded: true }
                    ]
                }, ele);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[0];
            expect(isVisible(eleItem.children[1])).toBe(false);
            expect(isVisible(ele.children[1].children[1])).toBe(false);
            expect(accordion.expandedItems.length).toBe(0);
            accordion.destroy();
            document.body.innerHTML = "";
        });
        it("Accordion expandMode on property Change behavior", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            expect(accordion.expandedItems.length).toBe(2);
            accordion.expandMode = 'Single';
            accordion.dataBind();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Item Content Expand Testing with Animation", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: 'Single',
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            (<HTMLElement>ele.querySelector("." + CLS_HEADER)).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[1];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(itemContent.classList.contains(CLS_CTNHIDE)).toBe(false);
            expect(acrdnItem1.classList.contains(CLS_ACTIVE)).toBe(true);
            let acrdnItem: Element = ele.children[1];
            let itemContent0: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(itemContent0.classList.contains(CLS_CTNHIDE)).toBe(false);
            expect(acrdnItem.classList.contains(CLS_ACTIVE)).toBe(true);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(isVisible(itemContent)).toBe(true);
            expect(itemContent.classList.contains(CLS_CTNHIDE)).toBe(false);
            expect(acrdnItem1.classList.contains(CLS_ACTIVE)).toBe(true);
            (<HTMLElement>ele.querySelectorAll("." + CLS_HEADER)[1]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Item Content Expand Testing with icon switching Animation", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            (<HTMLElement>ele.querySelector("." + CLS_HEADER)).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            let toggleIcon: Element = acrdnItem1.children[0].children[1].firstElementChild;
            expect(toggleIcon.classList.contains(CLS_EXPANDICN)).toBe(true);
            expect(isVisible(itemContent)).toBe(true);
        });
    });
    describe("Accordion Item Content Expand Testing with Accordion Click", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            ele.click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            let toggleIcon: Element = acrdnItem1.children[0].firstElementChild;
            expect(toggleIcon.classList.contains(CLS_EXPANDICN)).toBe(false);
            expect(isNOU(itemContent)).toBe(true);
        });
    });
    describe("Accordion Item Content Collapse Testing with Animation", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            (<HTMLElement>ele.querySelector("." + CLS_HEADER)).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(isVisible(itemContent)).toBe(false);
            expect(itemContent.classList.contains(CLS_CTNHIDE)).toBe(true);
            expect(acrdnItem1.classList.contains(CLS_ACTIVE)).toBe(false);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(isVisible(itemContent)).toBe(true);
            expect(itemContent.classList.contains(CLS_CTNHIDE)).toBe(false);
            expect(acrdnItem1.classList.contains(CLS_ACTIVE)).toBe(true);
            (<HTMLElement>ele.querySelector("." + CLS_HEADER)).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Item Content Collapse Testing with Fade Animation", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    animation: { expand: { effect: 'FadeZoomIn' }, collapse: { effect: 'FadeZoomOut' } },
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            (<HTMLElement>ele.querySelector("." + CLS_HEADER)).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(isVisible(itemContent)).toBe(false);
            expect(itemContent.classList.contains(CLS_CTNHIDE)).toBe(true);
            expect(acrdnItem1.classList.contains(CLS_ACTIVE)).toBe(false);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing with Fade animation", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(isVisible(itemContent)).toBe(true);
            expect(itemContent.classList.contains(CLS_CTNHIDE)).toBe(false);
            expect(acrdnItem1.classList.contains(CLS_ACTIVE)).toBe(true);
            (<HTMLElement>ele.querySelector("." + CLS_HEADER)).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Item Content Collapse Testing with Animation and multiple ExpandMode", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            (<HTMLElement>ele.querySelectorAll("." + CLS_HEADER)[1]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            let acrdnItem2: Element = ele.children[1];
            let itemContent2: Element = acrdnItem2.querySelector("." + CLS_CONTENT);
            expect(accordion.element.querySelectorAll('.' + CLS_EXPANDSTATE).length).toBe(1);
            expect(isVisible(itemContent)).toBe(true);
            expect(itemContent.classList.contains(CLS_CTNHIDE)).toBe(false);
            expect(acrdnItem1.classList.contains(CLS_ACTIVE)).toBe(true);
            expect(isVisible(itemContent2)).toBe(true);
            expect(itemContent2.classList.contains(CLS_CTNHIDE)).toBe(false);
            expect(acrdnItem2.classList.contains(CLS_ACTIVE)).toBe(true);
        });
    });
    describe("Accordion Item Content Collapse Testing with expandMode", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            accordion.expandMode = 'Single'
            accordion.dataBind();
            (<HTMLElement>ele.querySelectorAll("." + CLS_HEADER)[1]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            expect(isVisible(itemContent)).toBe(true);
            expect(isVisible(ele.children[1].children[1])).toBe(true);
            expect(ele.children[1].children[1].classList.contains(CLS_CTNHIDE)).toBe(false);
            expect(ele.children[1].classList.contains(CLS_ACTIVE)).toBe(true);
            expect(itemContent.classList.contains(CLS_CTNHIDE)).toBe(false);
            expect(acrdnItem1.classList.contains(CLS_ACTIVE)).toBe(true);
        });
    });

    describe("Nested Accordion Testing expand and collapsing", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        let nestAcc: Accordion;
        function create(): void {
                nestAcc = new Accordion({
                expandMode: "Single",
                items: [{
                    header: "nestItem1", content: "nested Content"
                }
                ]
            });
            nestAcc.appendTo("#nestedAccordion");
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    created: create,
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "<div id = 'nestedAccordion'></div>", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            let accrdItem: HTMLElement = <HTMLElement>ele.children[0];
            let nestAcrdn: HTMLElement = <HTMLElement>accrdItem.children[1].children[0].children[0];
            expect(nestAcrdn.classList.contains(CLS_ROOT)).toBe(true);
            expect(accrdItem.children[1].classList.contains(CLS_NEST)).toBe(true);
            expect(nestAcrdn.classList.contains("e-control")).toBe(true);
            expect(isVisible(nestAcrdn)).toBe(false);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CTENT);
            let nestAcrdn: HTMLElement = <HTMLElement>itemContent.children[0];
            let nestAccCon: Element = nestAcrdn.children[0].children[1];
            expect(isVisible(nestAccCon)).toBe(true);
            expect(nestAccCon.parentElement.classList.contains(CLS_EXPANDSTATE)).toBe(true);
            expect(ele.querySelector('.' + CLS_EXPANDSTATE) === nestAccCon.parentElement).toBe(true);
            expect(ele.querySelectorAll('.' + CLS_EXPANDSTATE).length).toBe(1);
            if (accordion) {
                nestAcc.destroy();
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            let nestAcrdn: HTMLElement = <HTMLElement>itemContent.children[0];
            expect(ele.classList.contains(CLS_ACRDN_ROOT)).toBe(true);
            expect(isVisible(nestAcrdn)).toBe(true);
            (<HTMLElement>nestAcrdn.querySelector("." + CLS_HEADER)).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Nested Accordion Testing expand and collapsing", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        function create(): void {
            let nestAcc: Accordion = new Accordion({
                expandMode: "Single",
                items: [{
                    header: "nestItem1", content: "nested Content"
                }
                ]
            });
            nestAcc.appendTo("#nestedAccordion");
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    created: create,
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "<div id = 'nestedAccordion'></div>", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            let accrdItem: HTMLElement = <HTMLElement>ele.children[0];
            let nestAcrdn: HTMLElement = <HTMLElement>accrdItem.children[1].children[0].children[0];
            expect(nestAcrdn.classList.contains(CLS_ROOT)).toBe(true);
            expect(nestAcrdn.classList.contains("e-control")).toBe(true);
            let nestedAccItem: HTMLElement = <HTMLElement>nestAcrdn.children[0];
            (<HTMLElement>nestedAccItem.children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CTENT);
            let nestAcrdn: HTMLElement = <HTMLElement>itemContent.children[0];
            let nestedAccItem: HTMLElement = <HTMLElement>nestAcrdn.children[0];
            let nestedAccCtn: HTMLElement = <HTMLElement>nestedAccItem.children[1];
            expect(isVisible(acrdnItem1)).toBe(true);
            expect(isVisible(nestAcrdn)).toBe(true);
            expect(isVisible(nestedAccCtn)).toBe(true);
        });
    });
    describe("Nested Accordion Testing expand multiple item", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        function create(): void {
            let nestAcc: Accordion = new Accordion({
                items: [
                    { header: "nestItem1", content: "nested Content1", expanded: true },
                    { header: "nestItem2", content: "nested Content2" }
                ]
            },"#nestedAccordion");
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    created: create,
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "<div id = 'nestedAccordion'></div>", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, '#accordion');
            let accrdItem: HTMLElement = <HTMLElement>ele.children[0];
            let nestAcrdn: HTMLElement = <HTMLElement>accrdItem.children[1].children[0].children[0];
            expect(nestAcrdn.classList.contains(CLS_ROOT)).toBe(true);
            expect(nestAcrdn.classList.contains("e-control")).toBe(true);
            let nestedAccItem: HTMLElement = <HTMLElement>nestAcrdn.children[1];
            (<HTMLElement>nestedAccItem.children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CTENT);
            let nestAcrdn: HTMLElement = <HTMLElement>itemContent.children[0];
            let nestedAccItem: HTMLElement = <HTMLElement>nestAcrdn.children[0];
            let nestedAccCtn: HTMLElement = <HTMLElement>nestedAccItem.children[1];
            let nestedAccItem1: HTMLElement = <HTMLElement>nestAcrdn.children[1];
            let nestedAccCtn1: HTMLElement = <HTMLElement>nestedAccItem1.children[1];
            expect(isVisible(acrdnItem1)).toBe(true);
            expect(isVisible(nestAcrdn)).toBe(true);
            expect(isVisible(nestedAccCtn)).toBe(true);
            expect(isVisible(nestedAccCtn1)).toBe(true);
        });
    });
    describe("Nested Accordion with root accordion collapse all testing", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        function create(): void {
            let nestAcc: Accordion = new Accordion({
                items: [
                    { header: "nestItem1", content: "nested Content1", expanded: true },
                    { header: "nestItem2", content: "nested Content2" }
                ]
            },"#nestedAccordion");
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    created: create,
                    expandMode: "Single",
                    items: [
                        { header: "Item0", content: "Content of Item0" },
                        { header: "Item1", content: "<div id = 'nestedAccordion'></div>", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, '#accordion');
            let accrdItem: HTMLElement = <HTMLElement>ele.children[1];
            let nestAcrdn: HTMLElement = <HTMLElement>accrdItem.children[1].children[0].children[0];
            expect(document.body.querySelectorAll('.' + CLS_EXPANDSTATE).length).toBe(1);
            expect(nestAcrdn.classList.contains(CLS_ROOT)).toBe(true);
            expect(nestAcrdn.classList.contains("e-control")).toBe(true);
            let nestedAccItem: HTMLElement = <HTMLElement>nestAcrdn.children[1];
            (<HTMLElement>nestedAccItem.children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content collapse all Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion.expandItem(false);
            let acrdnItem1: Element = ele.children[1];
            expect(acrdnItem1.classList.contains(CLS_EXPANDSTATE)).toBe(true);
            expect(document.body.querySelectorAll('.' + CLS_EXPANDSTATE).length).toBe(1);
        });
    });
    describe("Nested Accordion with nested accordion collapse all testing", () => {
        let accordion: Accordion;
        let nestAcc1: Accordion;
        let nestAcc2: Accordion;
        let rootAccordion: HTMLElement;
        let nestedAccordion1: HTMLElement;
        let nestedAccordion2: HTMLElement;
        document.body.innerHTML = "";
        function nestedCreate(): void {
            nestAcc2 = new Accordion({
                items: [
                    { header: "nestItem11", content: "nested Content11" },
                    { header: "nestItem12", content: "nested Content12", expanded: true }
                ]
            },"#nestedAccordion2");
        }
        function create(): void {
            nestAcc1 = new Accordion({
                created: nestedCreate,
                items: [
                    { header: "nestItem1", content: "nested Content1" },
                    { header: "nestItem2", content: "<div id = 'nestedAccordion2'></div>", expanded: true }
                ]
            },"#nestedAccordion");
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    created: create,
                    expandMode: "Single",
                    items: [
                        { header: "Item0", content: "Content of Item0" },
                        { header: "Item1", content: "<div id = 'nestedAccordion'></div>", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, '#accordion');
            rootAccordion = <HTMLElement>accordion.element;
            nestedAccordion1 = <HTMLElement>nestAcc1.element;
            nestedAccordion2 = <HTMLElement>nestAcc2.element;
            expect(document.body.querySelectorAll('.' + CLS_EXPANDSTATE).length).toBe(1);
            expect(nestedAccordion1.classList.contains(CLS_ROOT)).toBe(true);
            expect(nestedAccordion1.classList.contains("e-control")).toBe(true);
            expect(nestedAccordion2.classList.contains(CLS_ROOT)).toBe(true);
            expect(nestedAccordion2.classList.contains("e-control")).toBe(true);
            let nestedAccItem: HTMLElement = <HTMLElement>nestedAccordion1.children[1];
            (<HTMLElement>nestedAccItem.children[0]).click();
            setTimeout(() => { done(); }, 1200);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content collapse all Testing", () => {
            let ele: HTMLElement = document.getElementById("nestedAccordion");
            nestAcc1.expandItem(false);
            let acrdnItem1: Element = ele.children[1];
            expect(acrdnItem1.classList.contains(CLS_EXPANDSTATE)).toBe(true);
            expect(document.body.querySelectorAll('.' + CLS_EXPANDSTATE).length).toBe(1);
        });
    });
    describe("Nested Accordion Testing expand and collapsing with cancel args", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        function create(): void {
            let nestAcc: Accordion = new Accordion({
                expandMode: "Single",
                items: [{
                    header: "nestItem1", content: "nested Content"
                }
                ]
            });
            nestAcc.appendTo("#nestedAccordion");
        }
        function expand(e: ExpandEventArgs): void {
            e.cancel = true;
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    created: create,
                    expanding: expand,
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "<div id = 'nestedAccordion'></div>", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            let accrdItem: HTMLElement = <HTMLElement>ele.children[0];
            let nestAcrdn: HTMLElement = <HTMLElement>accrdItem.children[1].children[0].children[0];
            expect(nestAcrdn.classList.contains(CLS_ROOT)).toBe(true);
            expect(nestAcrdn.classList.contains("e-control")).toBe(true);
            expect(isVisible(nestAcrdn)).toBe(false);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CTENT);
            let nestAcrdn: HTMLElement = <HTMLElement>itemContent.children[0];
            let nestAccCon: Element = nestAcrdn.children[0].children[1];
            expect(isVisible(nestAccCon)).toBe(false);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CONTENT);
            let nestAcrdn: HTMLElement = <HTMLElement>itemContent.children[0];
            expect(isVisible(nestAcrdn)).toBe(false);
            (<HTMLElement>nestAcrdn.querySelector("." + CLS_HEADER)).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Nested Accordion Testing expand and collapsing with cancel args", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        function create(): void {
            let nestAcc: Accordion = new Accordion({
                expandMode: "Single",
                items: [{
                    header: "nestItem1", content: "nested Content"
                }
                ]
            });
            nestAcc.appendTo("#nestedAccordion");
        }
        function expand(e: ExpandEventArgs): void {
            e.cancel = true;
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expanding: expand,
                    created: create,
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "<div id = 'nestedAccordion'></div>", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            let accrdItem: HTMLElement = <HTMLElement>ele.children[0];
            let nestAcrdn: HTMLElement = <HTMLElement>accrdItem.children[1].children[0].children[0];
            expect(nestAcrdn.classList.contains(CLS_ROOT)).toBe(true);
            expect(nestAcrdn.classList.contains("e-control")).toBe(true);
            let nestedAccItem: HTMLElement = <HTMLElement>nestAcrdn.children[0];
            (<HTMLElement>nestedAccItem.children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CTENT);
            let nestAcrdn: HTMLElement = <HTMLElement>itemContent.children[0];
            let nestedAccItem: HTMLElement = <HTMLElement>nestAcrdn.children[0];
            let nestedAccCtn: HTMLElement = <HTMLElement>nestedAccItem.children[1];
            expect(isVisible(acrdnItem1)).toBe(true);
            expect(isVisible(nestAcrdn)).toBe(false);
            expect(isVisible(nestedAccCtn)).toBe(false);
        });
    });
    describe("Nested Accordion Testing expand multiple item with cancel args", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        function expand(e: ExpandEventArgs): void {
            if (!e.isExpanded) {
              e.cancel = true; }
        }
        function create(): void {
            let nestAcc: Accordion = new Accordion({
                items: [
                    { header: "nestItem1", content: "nested Content1", expanded: true },
                    { header: "nestItem2", content: "nested Content2" }
                ]
            });
            nestAcc.appendTo("#nestedAccordion");
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expanding: expand,
                    created: create,
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "<div id = 'nestedAccordion'></div>", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            let accrdItem: HTMLElement = <HTMLElement>ele.children[0];
            let nestAcrdn: HTMLElement = <HTMLElement>accrdItem.children[1].children[0].children[0];
            expect(nestAcrdn.classList.contains(CLS_ROOT)).toBe(true);
            expect(nestAcrdn.classList.contains("e-control")).toBe(true);
            let nestedAccItem: HTMLElement = <HTMLElement>nestAcrdn.children[1];
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            expect(isVisible(acrdnItem1.children[1])).toBe(true);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Expand Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            let acrdnItem1: Element = ele.children[0];
            let itemContent: Element = acrdnItem1.querySelector("." + CLS_CTENT);
            let nestAcrdn: HTMLElement = <HTMLElement>itemContent.children[0];
            expect(isVisible(acrdnItem1)).toBe(true);
            expect(isVisible(nestAcrdn)).toBe(true);
            (<HTMLElement>acrdnItem1.children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Public Method with addItem Expand Testing ", () => {
        let accordion: Accordion;
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.addItem({ header: "Items_Add", content: "Content of Items_Add", expanded: true }, 1);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Public Method addItem Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let newItem: Element = ele.children[1];
            expect(isVisible(newItem.children[1])).toBe(true);
        });
    });
    describe("Accordion Public Method with ExpandItem  Testing ", () => {
        let accordion: Accordion;
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.expandItem(true, 1);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Public Method ExpandItem Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[1];
            expect(isVisible(eleItem.children[1])).toBe(true);
        });
    });
    describe("Accordion Public Method with ExpandItem and disabled item Testing ", () => {
        let accordion: Accordion;
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.enableItem(1, false);
            accordion.expandItem(true, 1);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Public Method ExpandItem Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[1];
            expect(!isNOU(eleItem.children[1]) && isVisible(eleItem.children[1])).toBe(false);
        });
    });
    describe("Accordion Public Method with Expand with disabled item  Testing ", () => {
        let accordion: Accordion;
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[0];
            expect(isVisible(eleItem.children[1])).toBe(false);
            expect(isNOU(ele.children[1].children[1])).toBe(true);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Public Method ExpandItem Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[0];
            expect(isVisible(eleItem.children[1])).toBe(true);
            expect(isNOU(ele.children[1].children[1])).toBe(true);
            accordion.enableItem(0, false);
            expect(eleItem.classList.contains(CLS_DISABLE));
            accordion.enableItem(1, false);
            expect(ele.children[1].classList.contains(CLS_DISABLE));
            accordion.expandItem(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Public Method with ExpandItem with collapse Testing ", () => {
        let accordion: Accordion;
        function afterTestCase(): void {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[0];
            expect(isVisible(eleItem.children[1])).toBe(false);
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach(() => {
            afterTestCase();
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Public Method ExpandItem Testing", (done: Function) => {
            accordion.expandItem(false, 0);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Public Method with ExpandItem with collapse and disabled Testing  ", () => {
        let accordion: Accordion;
        function afterTestCase(): void {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[0];
            expect(isVisible(eleItem.children[1])).toBe(false);
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach(() => {
            afterTestCase();
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Public Method ExpandItem Testing", (done: Function) => {
            accordion.enableItem(0, false);
            accordion.expandItem(false, 0);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion collapse with disabled item click Testing  ", () => {
        let accordion: Accordion;
        function afterTestCase(): void {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[0];
            expect(isVisible(eleItem.children[1])).toBe(false);
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach(() => {
            afterTestCase();
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion collapse with disabled item click Testing ", (done: Function) => {
            accordion.enableItem(0, false);
            (<HTMLElement>accordion.element.children[0].children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Public Method with ExpandItem for all Item Testing ", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        function afterTestCase(): void {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[1];
            expect(isVisible(eleItem.children[1])).toBe(true);
            expect(isNOU(ele.children[0].children[1])).toBe(true);
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            afterTestCase();
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Public Method ExpandItem Testing", (done: Function) => {
            accordion.expandItem(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Public Method with ExpandItem for all Item for collapse Testing ", () => {
        let accordion: Accordion;
        function afterTestCase(): void {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[1];
            expect(isVisible(eleItem.children[1])).toBe(false);
            expect(isNOU(ele.children[0].children[1])).toBe(true);
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2", expanded: true }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            afterTestCase();
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Public Method ExpandItem with collapse all Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[1];
            expect(isVisible(eleItem.children[1])).toBe(true);
            expect(isNOU(ele.children[0].children[1])).toBe(true);
            accordion.expandItem(false);
            setTimeout(() => {
                expect(ele.children[0].classList.contains('e-expand-state')).toBe(false);
                expect(ele.children[1].classList.contains('e-expand-state')).toBe(true);
                done();
            }, TIME_DELAY);
        });
    });
    describe("Accordion Public Method ExpandItem with  already expaned item  ", () => {
        let accordion: Accordion;
        function afterTestCase(): void {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[1];
            expect(isVisible(eleItem.children[1])).toBe(true);
            expect(isNOU(ele.children[0].children[1])).toBe(true);
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2", expanded: true }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            afterTestCase();
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Public Method ExpandItem Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[1];
            expect(isVisible(eleItem.children[1])).toBe(true);
            expect(isNOU(ele.children[0].children[1])).toBe(true);
            accordion.expandItem(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Content click testing", () => {
        let accordion: Accordion;
        function afterTestCase(): void {
            let ele: HTMLElement = document.getElementById("accordion");
            expect(isVisible(ele.children[1].children[1])).toBe(true);
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2", expanded: true }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            afterTestCase();
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Click Testing for expaned content", (done: Function) => {
            (<HTMLElement>accordion.element.children[1].children[1]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Content click testing", () => {
        let accordion: Accordion;
        function afterTestCase(): void {
            let ele: HTMLElement = document.getElementById("accordion");
            expect(isVisible(ele.children[0].children[1])).toBe(false);
            expect(isVisible(ele.children[1].children[1])).toBe(true);
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            afterTestCase();
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Content Click Testing for expaned content", (done: Function) => {
            let ele: HTMLElement = accordion.element;
            expect(isNOU(ele.children[1].children[1])).toBe(true);
            accordion.expandItem(true, 1);
            expect(isNOU(ele.children[1].children[1])).toBe(false);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Public Method Testing ", () => {
        let accordion: Accordion;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Public Method ExpandItem Testing with already expanded item", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            accordion.expandItem(true, 0);
            expect(isVisible(ele.children[0])).toBe(true);
        });
        it("Accordion Public Method ExpandItem Testing with no index", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            accordion.expandItem(true, 5);
            expect(isNOU(ele.children[0].children[1])).toBe(true);
        });
        it("Accordion Public Method addItem Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.addItem({ header: "Items_Add", content: "Content of Items_Add" }, 1);
            expect(ele.childElementCount).toBe(3);
            let newItem: Element = ele.children[1].querySelector("." + CLS_HEADER);
            expect(newItem.textContent).toBe("Items_Add");
        });
        it("Accordion Public Method addItem Testing without index", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.addItem({ header: "Items_Add", content: "Content of Items_Add" });
            expect(ele.childElementCount).toBe(3);
            let newItem: Element = ele.children[2].querySelector("." + CLS_HEADER);
            expect(newItem.textContent).toBe("Items_Add");
        });
        it("Accordion Public Method addItem Testing with no-possibel index", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.addItem({ header: "Items_Add", content: "Content of Items_Add" }, 4);
            expect(ele.childElementCount).toBe(2);
        });
        it("Accordion Public Method removeItem Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.removeItem(1);
            expect(ele.childElementCount).toBe(1);
        });
        it("Accordion Public Method removeItem with no possible index Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.removeItem(5);
            expect(ele.childElementCount).toBe(2);
        });
        it("Accordion Public Method HideItem Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.hideItem(1);
            expect(ele.children[1].classList.contains(CLS_ITEMHIDE)).toBe(true);
            expect(isVisible(ele.children[1])).toBe(false);
            accordion.hideItem(1, false);
            expect(ele.children[1].classList.contains(CLS_ITEMHIDE)).toBe(false);
            expect(isVisible(ele.children[1])).toBe(true);
        });
        it("Accordion Public Method HideItem Testing with no possible index", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.hideItem(3);
            expect(ele.children[1].classList.contains(CLS_ITEMHIDE)).toBe(false);
            expect(isVisible(ele.children[1])).toBe(true);
        });
        it("Accordion Public Method EnableItem Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.enableItem(1, true);
            expect(ele.children[1].classList.contains(CLS_DISABLE)).toBe(false);
            accordion.enableItem(1, false);
            expect(ele.children[1].classList.contains(CLS_DISABLE)).toBe(true);
        });
        it("Accordion Public Method EnableItem Testing with no possible index", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.enableItem(5, false);
            expect(ele.children[1].classList.contains(CLS_DISABLE)).toBe(false);
        });
        it("Accordion Public Method Select Testing", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.select(1);
            expect(document.activeElement === ele.children[1].children[0]).toBe(true);
            accordion.select(0);
            expect(document.activeElement === ele.children[0].children[0]).toBe(true);
        });
        it("Accordion Public Method Select Testing with no posible index", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            accordion.select(5);
            expect(document.activeElement.tagName === "BODY").toBe(true);
        });
    });
    describe("Expand item with disabled item click Testing", () => {
        let accordion: Accordion;
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            expect(ele.childElementCount).toBe(2);
            accordion.enableItem(1, false);
            (<HTMLElement>ele.children[1].children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Expand item with disabled item click", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            let eleItem: Element = ele.children[1];
            expect(!isNOU(eleItem.children[1]) && isVisible(eleItem.children[1])).toBe(false);
        });
    });
    describe("Nested Accordion keyboard Interaction Testing", () => {
        let accordion: any;
        let nestAcc: any;
        let keyEventArgs: any;
        document.body.innerHTML = "";
        function create(): void {
                nestAcc = new Accordion({
                expandMode: "Single",
                items: [{
                    header: "nestItem1", content: "nested Content"
                }
                ]
            });
            nestAcc.appendTo("#nestedAccordion");
        }
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    created: create,
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "<div id = 'nestedAccordion'></div>", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            let accrdItem: HTMLElement = <HTMLElement>ele.children[0];
            let nestAcrdn: HTMLElement = <HTMLElement>accrdItem.children[1].children[0].children[0];
            expect(nestAcrdn.classList.contains(CLS_ROOT)).toBe(true);
            expect(accrdItem.children[1].classList.contains(CLS_NEST)).toBe(true);
            expect(nestAcrdn.classList.contains("e-control")).toBe(true);
            expect(isVisible(nestAcrdn)).toBe(false);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion keyboard Interaction Testing", (done: Function) => {
            keyEventArgs = {
                preventDefault: function () { },
                action: "moveDown",
                target: nestAcc.element.querySelector('.' + CLS_HEADER),
            };
            accordion.element.querySelector('.' + CLS_HEADER).focus();
            accordion.keyActionHandler(keyEventArgs);
            expect(document.activeElement === accordion.element.querySelector('.' + CLS_HEADER)).toBe(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });

    describe("Accordion keyboard Interaction Testing ", () => {
        let accordion: any;
        let keyEventArgs: any;
        let clickCount: number = 0;
        function click(): void {
            clickCount++;
        }
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.removeAttribute('style');
            document.body.innerHTML = "";
        });
        it("Accordion Public keyboard Interaction will all move up and down keys", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "<div id = 'nestedAccordion'></div>" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            keyEventArgs = {
                preventDefault: function () { },
                action: "moveDown",
                target: accordion.element,
            };
            accordion.keyActionHandler(keyEventArgs);
            let eleItem: Element = ele.children[0].children[0];
            expect(document.activeElement === eleItem).toBe(true);
            keyEventArgs.target = eleItem;
            accordion.keyActionHandler(keyEventArgs);
            expect(document.activeElement === ele.children[1].children[0]).toBe(true);
            keyEventArgs.target = eleItem.children[0];
            accordion.keyActionHandler(keyEventArgs);
            expect(document.activeElement === ele.children[1].children[0]).toBe(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: "moveUp",
                target: accordion.element,
            };
            accordion.keyActionHandler(keyEventArgs);
            eleItem = ele.children[1].children[0];
            expect(document.activeElement === eleItem).toBe(true);
            keyEventArgs.target = eleItem;
            accordion.keyActionHandler(keyEventArgs);
            expect(document.activeElement === ele.children[0].children[0]).toBe(true);
            keyEventArgs.target = eleItem.children[0];
            accordion.keyActionHandler(keyEventArgs);
            expect(document.activeElement === ele.children[0].children[0]).toBe(true);
            eleItem = accordion.element.children[0].children[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: "moveUp",
                target: eleItem,
            };
            accordion.keyActionHandler(keyEventArgs);
            expect(document.activeElement === eleItem).toBe(true);
            eleItem = accordion.element.children[1].children[0];
            (<HTMLElement>eleItem).focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: "moveDown",
                target: eleItem,
            };
            accordion.keyActionHandler(keyEventArgs);
            expect(document.activeElement === eleItem).toBe(true);
        });
        it("Accordion Public keyboard Interaction will all Home and End keys", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" },
                        { header: "Item3", content: "Content of Item3" }
                    ]
                }, ele);
            let elefirst: Element = ele.children[0].children[0];
            let elelast: Element = ele.children[2].children[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: "home",
                target: accordion.element,
            };
            accordion.keyActionHandler(keyEventArgs);
            expect(document.activeElement === elefirst).toBe(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: "home",
                target: accordion.element.children[1].children[0],
            };
            accordion.keyActionHandler(keyEventArgs);
            expect(document.activeElement === elefirst).toBe(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: "end",
                target: accordion.element,
            };
            accordion.keyActionHandler(keyEventArgs);
            expect(document.activeElement === elelast).toBe(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: "end",
                target: accordion.element.children[1].children[0],
            };
            accordion.keyActionHandler(keyEventArgs);
            expect(document.activeElement === elelast).toBe(true);
        });
        it("Accordion Public keyboard Interaction will all Enter and Space keys", () => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    clicked: click,
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" },
                        { header: "Item3", content: "Content of Item3" }
                    ]
                }, ele);
            keyEventArgs = {
                preventDefault: function () { },
                action: "enter",
                target: accordion.element,
            };
            expect(clickCount === 0).toBe(true);
            accordion.keyActionHandler(keyEventArgs);
            keyEventArgs.action = "space";
            expect(clickCount === 1).toBe(true);
            accordion.keyActionHandler(keyEventArgs);
            expect(clickCount === 2).toBe(true);
            document.body.style.height = '1500px';
            let scrollVal: Number = window.scrollY;
            let e: any = new KeyboardEvent("keydown", {bubbles : true, cancelable : true, key : '32', shiftKey : true});
            Object.defineProperty(e, "keyCode", {"value" : 32});
            ele.dispatchEvent(e);
            accordion.keyActionHandler(keyEventArgs);
            expect(clickCount === 3).toBe(true);
            expect(scrollVal === window.scrollY).toBe(true);
            e = new KeyboardEvent("keydown", {bubbles : true, cancelable : true, key : '35', shiftKey : true});
            Object.defineProperty(e, "keyCode", {"value" : 35});
            ele.dispatchEvent(e);
            keyEventArgs.action = "home";
            accordion.keyActionHandler(keyEventArgs);
            expect(scrollVal === window.scrollY).toBe(true);
            expect(document.activeElement === ele.children[0].children[0]).toBe(true);
            e = new KeyboardEvent("keydown", {bubbles : true, cancelable : true, key : '36', shiftKey : true});
            Object.defineProperty(e, "keyCode", {"value" : 36});
            ele.dispatchEvent(e);
            keyEventArgs.action = "end";
            accordion.keyActionHandler(keyEventArgs);
            expect(scrollVal === window.scrollY).toBe(true);
            expect(document.activeElement === ele.children[2].children[0]).toBe(true);
            e = new KeyboardEvent("keydown", {bubbles : true, cancelable : true, key : '38', shiftKey : true});
            Object.defineProperty(e, "keyCode", {"value" : 38});
            ele.dispatchEvent(e);
            expect(scrollVal === window.scrollY).toBe(true);
            expect(document.activeElement === ele.children[2].children[0]).toBe(true);
        });
    });
    describe("Accordion Enter key long press checking ", () => {
        let accordion: any;
        let keyEventArgs: any;
        let clickCount: number = 0;
        function click(): void {
            clickCount++;
        }
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById('accordion');
            expect(clickCount).toBe(1);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    clicked: click,
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
                keyEventArgs = {
                    preventDefault: function () { },
                    action: "enter",
                    target: accordion.element.querySelector('.' + CLS_HEADER),
                };
            accordion.keyActionHandler(keyEventArgs);
            setTimeout(() => { done(); }, 200);
        });
        it("Accordion Expanding and Expand Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById('accordion');
            expect(clickCount).toBe(1);
            keyEventArgs = {
                preventDefault: function () { },
                action: "enter",
                target: accordion.element.querySelector('.' + CLS_HEADER),
            };
            accordion.keyActionHandler(keyEventArgs);
            setTimeout(() => { done(); }, 200);
        });
    });
    describe("Accordion Enter key long press checking ", () => {
        let accordion: any;
        let keyEventArgs: any;
        let clickCount: number = 0;
        function click(): void {
            clickCount++;
        }
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById('accordion');
            expect(clickCount).toBe(2);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    clicked: click,
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
                keyEventArgs = {
                    preventDefault: function () { },
                    action: "enter",
                    target: accordion.element.querySelector('.' + CLS_HEADER),
                };
            accordion.keyActionHandler(keyEventArgs);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Accordion Expanding and Expand Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById('accordion');
            expect(clickCount).toBe(1);
            keyEventArgs = {
                preventDefault: function () { },
                action: "enter",
                target: accordion.element.querySelector('.' + CLS_HEADER),
            };
            accordion.keyActionHandler(keyEventArgs);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    // Accordion Event Flow testing    
    describe("Accordion Event Flow testing ", () => {
        let accordion: any;
        function click(e: AccordionClickArgs): void {
            accordion.EventArgs = e;
        }
        beforeEach(() => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Accordion Public Method ExpandItem Testing", () => {
            let ele: HTMLElement = document.getElementById('accordion');
            accordion = new Accordion(
                {
                    clicked: click,
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            let target: HTMLElement = (<HTMLElement>ele.children[0].children[0]);
            target.click();
            expect(accordion.EventArgs.name).toBe('clicked');
            expect(accordion.EventArgs.originalEvent.target).toBe(target);
            expect(accordion.EventArgs.item.expanded).toBe(true);
            expect(ele.childElementCount).toBe(2);
        });
    });
    describe("Accordion Event Flow testing for Expanding and expand ", () => {
        let accordion: any;
        function argsPushing(e: any, curObject: any): void {
            if (curObject.EventArgs) {
                curObject.EventArgs.push(e);
            } else {
                curObject.EventArgs = [];
                curObject.EventArgs.push(e);
            }
        }
        function click(e: AccordionClickArgs): void {
            accordion.EventArgs = [];
            accordion.EventArgs.push(e);
        }
        function expanding(e: any): void {
            argsPushing(clone(e), this);
        }
        function expand(e: any): void {
            argsPushing(clone(e), this);
        }
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById('accordion');
            let curObject: any = (<any>ele).ej2_instances[0];
            expect(curObject.EventArgs[0].name).toBe('clicked');
            expect(curObject.EventArgs[1].name).toBe('expanding');
            expect(curObject.EventArgs[2].name).toBe('expanded');
            expect(curObject.EventArgs[1].isExpanded).toBe(false);
            expect(curObject.EventArgs[2].isExpanded).toBe(false);
            expect(curObject.EventArgs[1].element === curObject.EventArgs[2].element).toBe(true);
            expect(curObject.EventArgs[1].item === curObject.EventArgs[2].item).toBe(true);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    clicked: click,
                    expanding: expanding,
                    expanded: expand,
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            (<HTMLElement>ele.children[0].children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Accordion Expanding and Expand Testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById('accordion');
            let curObject: any = (<any>ele).ej2_instances[0];
            expect(curObject.EventArgs[0].name).toBe('clicked');
            expect(curObject.EventArgs[1].name).toBe('expanding');
            expect(curObject.EventArgs[2].name).toBe('expanded');
            expect(curObject.EventArgs[1].isExpanded).toBe(true);
            expect(curObject.EventArgs[2].isExpanded).toBe(true);
            expect(curObject.EventArgs[1].element === curObject.EventArgs[2].element).toBe(true);
            expect(curObject.EventArgs[1].item === curObject.EventArgs[2].item).toBe(true);
            curObject.EventArgs = null;
            (<HTMLElement>ele.children[0].children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Event Flow testing for Expanding and expand with other animations ", () => {
        let accordion: any;
        function argsPushing(e: any, curObject: any): void {
            if (curObject.EventArgs) {
                curObject.EventArgs.push(e);
            } else {
                curObject.EventArgs = [];
                curObject.EventArgs.push(e);
            }
        }
        function click(e: AccordionClickArgs): void {
            accordion.EventArgs = [];
            accordion.EventArgs.push(e);
        }
        function expanding(e: any): void {
            argsPushing(clone(e), this);
        }
        function expand(e: any): void {
            argsPushing(clone(e), this);
        }
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById('accordion');
            let curObject: any = (<any>ele).ej2_instances[0];
            expect(curObject.EventArgs[0].name).toBe('clicked');
            expect(curObject.EventArgs[1].name).toBe('expanding');
            expect(curObject.EventArgs[2].name).toBe('expanded');
            expect(curObject.EventArgs[1].isExpanded).toBe(false);
            expect(curObject.EventArgs[2].isExpanded).toBe(false);
            expect(curObject.EventArgs[1].element === curObject.EventArgs[2].element).toBe(true);
            expect(curObject.EventArgs[1].item === curObject.EventArgs[2].item).toBe(true);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    clicked: click,
                    expanding: expanding,
                    expanded: expand,
                    animation: { expand: { effect: 'FadeZoomIn' }, collapse: { effect: 'FadeZoomOut' } },
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            (<HTMLElement>ele.children[0].children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Accordion Expanding and Expand Testing with Fade animation", (done: Function) => {
            let ele: HTMLElement = document.getElementById('accordion');
            let curObject: any = (<any>ele).ej2_instances[0];
            expect(curObject.EventArgs[0].name).toBe('clicked');
            expect(curObject.EventArgs[1].name).toBe('expanding');
            expect(curObject.EventArgs[2].name).toBe('expanded');
            expect(curObject.EventArgs[1].isExpanded).toBe(true);
            expect(curObject.EventArgs[2].isExpanded).toBe(true);
            expect(curObject.EventArgs[1].element === curObject.EventArgs[2].element).toBe(true);
            expect(curObject.EventArgs[1].item === curObject.EventArgs[2].item).toBe(true);
            curObject.EventArgs = null;
            (<HTMLElement>ele.children[0].children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });

    describe("Accordion Event Flow testing for Expanding and expand with None animations ", () => {
        let accordion: any;
        function argsPushing(e: any, curObject: any): void {
            if (curObject.EventArgs) {
                curObject.EventArgs.push(e);
            } else {
                curObject.EventArgs = [];
                curObject.EventArgs.push(e);
            }
        }
        function click(e: AccordionClickArgs): void {
            accordion.EventArgs = [];
            accordion.EventArgs.push(e);
        }
        function expanding(e: any): void {
            argsPushing(clone(e), this);
        }
        function expand(e: any): void {
            argsPushing(clone(e), this);
        }
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById('accordion');
            let curObject: any = (<any>ele).ej2_instances[0];
            expect(curObject.EventArgs[0].name).toBe('clicked');
            expect(curObject.EventArgs[1].name).toBe('expanding');
            expect(curObject.EventArgs[2].name).toBe('expanded');
            expect(curObject.EventArgs[1].isExpanded).toBe(false);
            expect(curObject.EventArgs[2].isExpanded).toBe(false);
            expect(curObject.EventArgs[1].element === curObject.EventArgs[2].element).toBe(true);
            expect(curObject.EventArgs[1].item === curObject.EventArgs[2].item).toBe(true);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    clicked: click,
                    expanding: expanding,
                    expanded: expand,
                    animation: { expand: { effect: 'None' }, collapse: { effect: 'None' } },
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            (<HTMLElement>ele.children[0].children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Accordion Expanding and Expand Testing with None animation", (done: Function) => {
            let ele: HTMLElement = document.getElementById('accordion');
            let curObject: any = (<any>ele).ej2_instances[0];
            expect(curObject.EventArgs[0].name).toBe('clicked');
            expect(curObject.EventArgs[1].name).toBe('expanding');
            expect(curObject.EventArgs[2].name).toBe('expanded');
            expect(curObject.EventArgs[1].isExpanded).toBe(true);
            expect(curObject.EventArgs[2].isExpanded).toBe(true);
            expect(curObject.EventArgs[1].element === curObject.EventArgs[2].element).toBe(true);
            expect(curObject.EventArgs[1].item === curObject.EventArgs[2].item).toBe(true);
            curObject.EventArgs = null;
            (<HTMLElement>ele.children[0].children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });


    describe("Accordion Event Flow testing for Expanding and expand with public Methods ", () => {
        let accordion: any;
        function argsPushing(e: any, curObject: any): void {
            if (curObject.EventArgs) {
                curObject.EventArgs.push(e);
            } else {
                curObject.EventArgs = [];
                curObject.EventArgs.push(e);
            }
        }
        function click(e: AccordionClickArgs): void {
            accordion.EventArgs = [];
            accordion.EventArgs.push(e);
        }
        function expanding(e: any): void {
            argsPushing(clone(e), this);
        }
        function expand(e: any): void {
            argsPushing(clone(e), this);
        }
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById('accordion');
            let curObject: any = (<any>ele).ej2_instances[0];
            expect(curObject.EventArgs[0].name).toBe('expanding');
            expect(curObject.EventArgs[1].name).toBe('expanded');
            expect(curObject.EventArgs[0].isExpanded).toBe(false);
            expect(curObject.EventArgs[1].isExpanded).toBe(false);
            expect(curObject.EventArgs[0].element === curObject.EventArgs[1].element).toBe(true);
            expect(curObject.EventArgs[0].item === curObject.EventArgs[1].item).toBe(true);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    clicked: click,
                    expanding: expanding,
                    expanded: expand,
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Accordion Expanding and Expand Testing with public Methods", (done: Function) => {
            let ele: HTMLElement = document.getElementById('accordion');
            let curObject: any = (<any>ele).ej2_instances[0];
            expect(curObject.EventArgs[0].name).toBe('expanding');
            expect(curObject.EventArgs[1].name).toBe('expanded');
            expect(curObject.EventArgs[0].isExpanded).toBe(true);
            expect(curObject.EventArgs[1].isExpanded).toBe(true);
            expect(curObject.EventArgs[0].element === curObject.EventArgs[1].element).toBe(true);
            expect(curObject.EventArgs[0].item === curObject.EventArgs[1].item).toBe(true);
            curObject.EventArgs = null;
            curObject.expandItem(false, 0);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Expanded Items Testing with private variables ", () => {
        let accordion: any;
        afterEach((): void => {
            expect(accordion.expandedItems.length).toBe(1);
            expect(accordion.expandedItems[0]).toBe(1);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    expandMode: 'Single',
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" }
                    ]
                }, ele);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Accordion Expanded Items Testing with private variables", (done: Function) => {
            let ele: HTMLElement = document.getElementById('accordion');
            expect(accordion.expandedItems.length).toBe(1);
            expect(accordion.expandedItems[0]).toBe(0);
            (<HTMLElement>ele.children[1].children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion Expanded Items Testing with private variables with public methods ", () => {
        let accordion: any;
        afterEach((): void => {
            expect(accordion.expandedItems.length).toBe(2);
            expect(accordion.expandedItems[1]).toBe(1);
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2", expanded: true },
                        { header: "Item3", content: "Content of Item3" }
                    ]
                }, ele);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Accordion Expanding with  private variables and public Methods testing", () => {
            let ele: HTMLElement = document.getElementById('accordion');
            expect(accordion.expandedItems.length).toBe(2);
            expect(accordion.expandedItems[0]).toBe(0);
            expect(accordion.expandedItems[1]).toBe(1);
            let eleItem: Element = ele.children[0];
            expect(eleItem.children[0].getAttribute('aria-controls')).toBe(eleItem.children[1].id);
            expect(eleItem.children[1].getAttribute('aria-labelledby')).toBe(eleItem.children[0].id);
            let eleItem1: Element = ele.children[1];
            expect(eleItem1.children[0].getAttribute('aria-controls')).toBe(eleItem1.children[1].id);
            expect(eleItem1.children[1].getAttribute('aria-labelledby')).toBe(eleItem1.children[0].id);
            accordion.removeItem(2);
        });
    });

    // Accordion Aria-attributes Testing

    describe("Accordion Aria-Attributes Testing", () => {
        let accordion: Accordion;
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        it("Accordion Aria Attributes with default", () => {
            let ele: HTMLElement = document.getElementById('accordion');
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" },
                        { header: "Item3", content: "Content of Item3" }
                    ]
                }, ele);
            expect(ele.getAttribute('aria-disabled')).toBe('false');
            expect(ele.getAttribute('role')).toBe('presentation');
            expect(ele.getAttribute('aria-multiselectable')).toBe('true');
            expect(ele.children[0].firstElementChild.getAttribute('aria-disabled')).toBe('false');
            expect(ele.children[0].firstElementChild.getAttribute('aria-expanded')).toBe('false');
            expect(ele.children[0].firstElementChild.getAttribute('aria-selected')).toBe('false');
            expect(ele.children[0].children[0].getAttribute('role')).toBe('heading');
            expect(ele.children[1].children[0].getAttribute('role')).toBe('heading');
            expect(ele.children[1].children[0].getAttribute('aria-controls')).toBe(null);
            expect(ele.children[1].firstElementChild.getAttribute('aria-disabled')).toBe('false');
            expect(ele.children[1].firstElementChild.getAttribute('aria-expanded')).toBe('false');
            expect(ele.children[1].firstElementChild.getAttribute('aria-selected')).toBe('false');
            expect(ele.children[0].children[0].getAttribute('tabindex')).toBe('0');
            expect(ele.children[1].children[0].getAttribute('tabindex')).toBe('0');
            expect(ele.children[2].children[0].getAttribute('tabindex')).toBe('0');
        });
        it("Accordion Aria Attributes with disableItem Public method", () => {
            let ele: HTMLElement = document.getElementById('accordion');
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1" },
                        { header: "Item2", content: "Content of Item2" },
                        { header: "Item3", content: "Content of Item3" }
                    ]
                }, ele);
            let index: number = 0;
            expect(ele.children[index].firstElementChild.getAttribute('aria-disabled')).toBe('false');
            accordion.enableItem(index, false);
            expect(ele.children[index].firstElementChild.getAttribute('aria-disabled')).toBe('true');
            index = 1;
            expect(ele.children[index].firstElementChild.getAttribute('aria-disabled')).toBe('false');
            accordion.enableItem(index, false);
            expect(ele.children[index].firstElementChild.getAttribute('aria-disabled')).toBe('true');
            index = 2;
            expect(ele.children[index].firstElementChild.getAttribute('aria-disabled')).toBe('false');
            accordion.enableItem(index, false);
            expect(ele.children[index].firstElementChild.getAttribute('aria-disabled')).toBe('true');
        });
    });

    describe("Accordion Aria Attributes with ExpandItem Public method Testing", () => {
        let accordion: Accordion;
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById('accordion');
            expect(ele.children[1].firstElementChild.getAttribute('aria-expanded')).toBe('false');
            expect(ele.children[1].firstElementChild.getAttribute('aria-selected')).toBe('false');
            expect(ele.children[1].children[1].getAttribute('aria-hidden')).toBe('true');
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1", expanded: true },
                        { header: "Item2", content: "Content of Item2" },
                        { header: "Item3", content: "Content of Item3" }
                    ]
                }, ele);
            accordion.expandItem(true, 1);
            expect(ele.children[1].children[1].getAttribute('aria-hidden')).toBe('true');
            expect(ele.children[1].children[0].getAttribute('aria-controls')).toBe(ele.children[1].children[1].id);
            let eleItem: Element = ele.children[0]
            expect(eleItem.children[0].getAttribute('aria-controls')).toBe(eleItem.children[1].id);
            expect(eleItem.children[1].getAttribute('aria-labelledby')).toBe(eleItem.children[0].id);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Accordion Aria Attributes with ExpandItem Public method", (done: Function) => {
            let ele: HTMLElement = document.getElementById('accordion');
            expect(ele.children[0].firstElementChild.getAttribute('aria-expanded')).toBe('true');
            expect(ele.children[0].firstElementChild.getAttribute('aria-selected')).toBe('true');
            expect(ele.children[1].firstElementChild.getAttribute('aria-expanded')).toBe('true');
            expect(ele.children[1].firstElementChild.getAttribute('aria-selected')).toBe('true');
            expect(ele.children[1].children[1].getAttribute('aria-hidden')).toBe('false');
            expect(ele.children[0].children[1].getAttribute('aria-hidden')).toBe('false');
            (<HTMLElement>ele.children[1].children[0]).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Accordion - separate items value change", () => {
        let accordion: Accordion;
        document.body.innerHTML = "";
        beforeEach((done: Function) => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
            accordion = new Accordion(
                {
                    items: [
                        { header: "Item1", content: "Content of Item1", iconCss: 'e-icon1', cssClass: 'testClass1', expanded: true },
                        { header: "Item2", content: "Content of Item2", iconCss: 'e-icon2', cssClass: 'testClass2', expanded: false }
                    ]
                }, ele);
            (<HTMLElement>ele.querySelector("." + CLS_HEADER)).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Items property change testing", () => {
            let ele: HTMLElement = document.getElementById('accordion');
            accordion.items = [
                { header: "header1", content: "Content1", iconCss: 'e-icons1', cssClass: 'Class1', expanded: false },
                { header: "header2", content: "Content2", iconCss: 'e-icons2', cssClass: 'Class2', expanded: true }
            ];
            accordion.dataBind();
            expect(accordion.items[0].header).toEqual('header1');
            expect(accordion.items[0].content).toEqual('Content1');
            expect(accordion.items[0].iconCss).toEqual('e-icons1');
            expect(accordion.items[0].cssClass).toEqual('Class1');
            expect(accordion.items[0].expanded).toEqual(false);
            expect(accordion.items[1].header).toEqual('header2');
            expect(accordion.items[1].content).toEqual('Content2');
            expect(accordion.items[1].iconCss).toEqual('e-icons2');
            expect(accordion.items[1].cssClass).toEqual('Class2');
            expect(accordion.items[1].expanded).toEqual(true);
        });
        it("Items - cssClass property change testing", () => {
            let ele: HTMLElement = document.getElementById('accordion');
            accordion.items[0].cssClass = 'testingClass1';
            accordion.dataBind();
            expect(accordion.items[0].cssClass).toEqual('testingClass1');
            expect(ele.children[0].classList.contains('testingClass1')).toEqual(true);
            accordion.items[1].cssClass = 'testingClass2';
            accordion.dataBind();
            expect(accordion.items[1].cssClass).toEqual('testingClass2');
            expect(ele.children[1].classList.contains('testingClass2')).toEqual(true);
        });
        it("Items - iconCss property change testing", () => {
            let ele: HTMLElement = document.getElementById('accordion');
            expect((ele.children[0]).querySelector('.e-acrdn-header .e-acrdn-header-icon')).not.toEqual(undefined);
            expect((ele.children[0]).querySelector('.e-acrdn-header .e-acrdn-header-icon span').classList.contains('e-icon1')).toEqual(true);
            accordion.items[0].iconCss = 'e-test-icon1';
            accordion.dataBind();
            expect(accordion.items[0].iconCss).toEqual('e-test-icon1');
            expect((ele.children[0]).querySelector('.e-acrdn-header .e-acrdn-header-icon')).not.toEqual(undefined);
            expect((ele.children[0]).querySelector('.e-acrdn-header .e-acrdn-header-icon span').classList.contains('e-test-icon1')).toEqual(true);
            accordion.items[1].iconCss = 'e-test-icon2';
            accordion.dataBind();
            expect(accordion.items[1].iconCss).toEqual('e-test-icon2');
            expect((ele.children[1]).querySelector('.e-acrdn-header .e-acrdn-header-icon')).not.toEqual(undefined);
            expect((ele.children[1]).querySelector('.e-acrdn-header .e-acrdn-header-icon span').classList.contains('e-test-icon2')).toEqual(true);
        });
        it("Items - header property change testing", () => {
            let ele: HTMLElement = document.getElementById('accordion');
            accordion.items[0].header = 'testingItem1';
            accordion.dataBind();
            expect(accordion.items[0].header).toEqual('testingItem1');
            expect(ele.children[0].querySelectorAll('.e-acrdn-header').length).toEqual(1);
            expect(ele.children[0].querySelectorAll('.e-acrdn-header-content').length).toEqual(1);
            expect(ele.children[0].querySelectorAll('.e-acrdn-header-content')[0].innerHTML).toEqual('testingItem1');
            accordion.items[1].header = 'testingItem2';
            accordion.dataBind();
            expect(accordion.items[1].header).toEqual('testingItem2');
            expect(ele.children[1].querySelectorAll('.e-acrdn-header').length).toEqual(1);
            expect(ele.children[1].querySelectorAll('.e-acrdn-header-content').length).toEqual(1);
            expect(ele.children[1].querySelectorAll('.e-acrdn-header-content')[0].innerHTML).toEqual('testingItem2');
        });
        it("Items - expanded property change testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById('accordion');
            accordion.items[0].expanded = true;
            accordion.dataBind();
            setTimeout(function() {
                expect(accordion.items[0].expanded).toEqual(true);
                expect(ele.children[0].classList.contains('e-expand-state')).toEqual(true);
                expect(ele.children[0].classList.contains('e-selected')).toEqual(true);
                expect(ele.children[0].classList.contains('e-active')).toEqual(true);
                done();
            }, 1000);
        });
        it("Items - content property change testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById('accordion');
            accordion.items[0].content = 'Content1';
            accordion.dataBind();
            expect(accordion.items[0].content).toEqual('Content1');
            setTimeout(function() {
                expect(accordion.items[0].content).toEqual('Content1');
                (<HTMLElement>ele.children[0].children[0]).click();
                setTimeout(function() {
                    expect(ele.children[0].querySelectorAll('.e-acrdn-panel').length).toEqual(1);
                    expect(ele.children[0].querySelectorAll('.e-acrdn-content').length).toEqual(1);
                    expect(ele.children[0].querySelectorAll('.e-acrdn-content')[0].innerHTML).toEqual('Content1');
                    done();
                }, 1000);
            }, 1000);
        });
    });
    describe("Accordion keyboard testing when input component render inside the accordion", () => {
        let accordion: any;
        let keyEventArgs: any;
        let clickCount: number = 0;
        function click(): void {
            clickCount++;
        }
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "accordion";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (accordion) {
                accordion.destroy();
            }
            document.body.removeAttribute('style');
            document.body.innerHTML = "";
        });
        it("Accordion content with input element, 'home' keyboard navigation and focus testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "<input type='text' value='hello' />" },
                        { header: "Item2", content: "Content of Item2" },
                        { header: "Item3", content: "Content of Item3" }
                    ]
                }, ele);
            accordion.expandItem(true, 0);
            setTimeout(function () {
                let elefirst: HTMLInputElement = ele.querySelector('.e-acrdn-item input');
                elefirst.focus();
                let actEle1: HTMLElement = <HTMLElement> document.activeElement;
                keyEventArgs = {
                    preventDefault: function () { },
                    action: 'home',
                    target: actEle1,
                };
                accordion.keyActionHandler(keyEventArgs);
                let actEle2: HTMLElement = <HTMLElement> document.activeElement;
                expect(document.activeElement === elefirst).toBe(true);
                done();
            }, 1000);
        });
        it("Accordion content with input element, 'end' keyboard navigation and focus testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("accordion");
            accordion = new Accordion(
                {
                    expandMode: "Single",
                    items: [
                        { header: "Item1", content: "<input type='text' value='hello' />" },
                        { header: "Item2", content: "Content of Item2" },
                        { header: "Item3", content: "Content of Item3" }
                    ]
                }, ele);
            accordion.expandItem(true, 0);
            setTimeout(function () {
                let elefirst: HTMLInputElement = ele.querySelector('.e-acrdn-item input');
                elefirst.focus();
                let actEle1: HTMLElement = <HTMLElement> document.activeElement;
                keyEventArgs = {
                    preventDefault: function () { },
                    action: 'home',
                    target: actEle1,
                };
                accordion.keyActionHandler(keyEventArgs);
                let actEle2: HTMLElement = <HTMLElement> document.activeElement;
                expect(document.activeElement === elefirst).toBe(true);
                done();
            }, 1000);
        });
    });
});