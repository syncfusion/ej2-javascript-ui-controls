/**
 * Vertical scroll spec
 */
import { ScrollEventArgs, TouchEventArgs, Browser, isNullOrUndefined, setStyleAttribute } from '@syncfusion/ej2-base';
import { VScroll } from '../src/common/v-scroll';
import { profile, inMB, getMemoryProfile } from './common.spec';

const CLS_DISABLE: string = 'e-overlay';
const CLS_OVERLAY: string = 'e-scroll-overlay';
const CLS_UPOVERLAY: string = 'e-scroll-up-overlay';
const CLS_DOWNOVERLAY: string = 'e-scroll-down-overlay';
const CLS_NAVUPARROW: string = 'e-nav-up-arrow';
const CLS_NAVDOWNARROW: string = 'e-nav-down-arrow';

let firefoxUa: string = 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0';

let windowsPhoneUa: string = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; ' +
    'Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)';

let edgeUa: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240';

let ieUa: string = 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; .NET4.0E; .NET4.0C; ' +
    'Tablet PC 2.0; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; InfoPath.3; rv:11.0) like Gecko';

let iosChromeUa: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) ' +
    'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';

let innerItemsHTMLString: string = "<div id= 'innerItems' style='display: block;'><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div></div>";

describe('Vertical ScrollBar Base', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    let css: string = " button {font-family:Arial; font-size: 14px; padding: 1px 6px;} .e-rtl { direction: rtl; } .e-vscroll > * { height: inherit; } .e-scroll-nav { height: 3px; } ";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);

    describe('Base Testing', () => {
        let scroll: any;
        let targetEle: HTMLElement;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.id = 'Sample';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
            targetEle = document.getElementById('innerItems');
            scroll = new VScroll({}, targetEle);
        });
        afterEach((): void => {
            if (scroll)
                scroll.destroy();
            document.body.innerHTML = '';
        });
        it('Root and device class test', () => {
            expect(targetEle.classList.contains("e-vscroll")).toEqual(true);
            expect(scroll.element.classList.contains('e-scroll-device')).toBe(false);
        });
        it('Touch class test', () => {
            expect(targetEle.classList.contains("e-touch")).toEqual(true);
        });
        it('Content class test', () => {
            expect((<HTMLElement>targetEle.querySelector('.e-vscroll-content')).childElementCount == 6).toEqual(true);
        });
        it('Nav element id test', () => {
            expect((<HTMLElement>targetEle.querySelector('.e-vscroll-content')).childElementCount == 6).toEqual(true);
            expect(targetEle.childElementCount).toBe(3);
            expect(targetEle.children[0].id).toBe("innerItems_nav_up");
            expect(targetEle.children[2].id).toBe("innerItems_nav_down");
        });
    });
    describe('Persistance Testing', () => {
        let scroll: VScroll;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.id = 'Sample';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (scroll)
                scroll.destroy();
            document.body.innerHTML = '';
        });
        it('Persisted ScrollTop value testing', () => {
            window.localStorage.setItem('vScrollinnerItems', JSON.stringify({ scrollStep: 50 }));
            let ele: HTMLElement = document.getElementById('innerItems');
            scroll = new VScroll({
                enablePersistence: true,
            }, ele);
            expect(scroll.scrollStep).toEqual(50);
        });
    });
    describe('Unique id testing', () => {
        let scroll: VScroll;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.id = 'Sample';
            ele.innerHTML = "<div class= 'innerItems' style='display: block;'><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div></div>";
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('ID testing', () => {
            let ele: HTMLElement = document.getElementsByClassName('innerItems')[0] as HTMLElement;
            scroll = new VScroll({
            }, ele);
            let uniqueId: string = ele.getAttribute('id');
            expect(uniqueId.length > 0).toEqual(true);
            scroll.scrollStep = 50;
            scroll.dataBind();
            expect(scroll.scrollStep).toEqual(50);
            scroll.destroy();
            uniqueId = ele.getAttribute('id');
            expect(isNullOrUndefined(uniqueId)).toEqual(true);
        });
    });
    describe('OnProperty Change Testing', () => {
        let scroll: VScroll;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.id = 'Sample';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (scroll)
                scroll.destroy();
            document.body.innerHTML = '';
        });
        it('ScrollStep value Testing', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            scroll = new VScroll({
            }, ele);
            scroll.scrollStep = 50;
            scroll.dataBind();
            expect(scroll.scrollStep).toEqual(50);
        });
    });
    describe('Scroll position Testing', () => {
        let scroll: any;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            ele.innerHTML = "<div id= 'innerItems' style='display: block;'><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' style='display: block;'><button> Btn_style</button></div></div>	";
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (scroll)
                scroll.destroy();
            document.body.innerHTML = '';
        });
        it('ScrollTop Testing', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            scroll = new VScroll({ scrollStep: 40 });
            scroll.appendTo('#Sample');
            let scrollEle: HTMLElement = scroll.element.children[1];
            let tchEvent: TouchEventArgs;
            let navEle: HTMLElement = scroll.element.children[2].lastChild;
            let scrollEvent: Event = document.createEvent('MouseEvents');
            scrollEvent.initEvent('scroll', false, false);
            let event: ScrollEventArgs = {
                scrollDirection: 'Up',
                name: 'scroll',
                distanceX: 0,
                distanceY: 30, originalEvent: tchEvent, startEvents: tchEvent, startX: 0, startY: 30, velocity: 4
            };
            expect(scrollEle.scrollTop).toEqual(0);
            scroll.touchHandler(event);
            expect(scrollEle.scrollTop).toEqual(30);
            event.scrollDirection = 'Down'; event.name = 'scroll'; event.distanceY = 30;
            scroll.touchHandler(event);
            event.scrollDirection = 'Up'; event.name = 'scroll'; event.distanceY = 30;
            scroll.touchHandler(event);
            expect(scrollEle.scrollTop).toEqual(30);
            event.scrollDirection = 'Up'; event.name = 'scroll'; event.distanceY = 40;
            scroll.touchHandler(event);
            expect(scrollEle.scrollTop).toEqual(70);
            event.scrollDirection = 'Up'; event.name = 'scroll'; event.distanceY = 10;
            scroll.touchHandler(event);
            scrollEle.dispatchEvent(scrollEvent);
            expect(scrollEle.scrollTop).toEqual(80);
            scrollEle.scrollTop = 500;
            scrollEle.dispatchEvent(scrollEvent);
            scrollEle.scrollTop = 0;
            scrollEvent.initEvent('scroll', false, false);
            scrollEle.dispatchEvent(scrollEvent);
            expect(navEle.classList.contains('e-nav-down-arrow')).toEqual(true);
            navEle.parentElement.click();
            scrollEle.dispatchEvent(scrollEvent);
            expect(scrollEle.scrollTop).toEqual(10);
            scrollEle.scrollTop = 160;
            navEle.click();
            scrollEle.dispatchEvent(scrollEvent);
            navEle.click();
            navEle.remove();
            scrollEle.dispatchEvent(scrollEvent);
            event.name = 'swipe';
            scroll.touchHandler(event);
        });
    });
    describe('RTL property Testing', () => {
        let scroll: any;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('EnableRTL Property Testing', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            scroll = new VScroll({ enableRtl: true }, ele);
            expect(scroll.element.classList.contains('e-rtl')).toEqual(true);
            let navEle: HTMLElement = scroll.element.firstChild.lastChild;
            navEle.click();
        });
    });
    describe('RTL Testing in onPropertyChange', () => {
        let scroll: any;
        beforeEach((): void => {
            document.body.innerHTML = '';
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('EnableRTL Property Testing using dataBind', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            scroll = new VScroll({}, ele);
            scroll.enableRtl = true;
            scroll.dataBind();
            expect(scroll.element.classList.contains('e-rtl')).toEqual(true);
        });
    });
    describe('RTL Testing in onPropertyChange', () => {
        let scroll: any;
        beforeEach((): void => {
            document.body.innerHTML = '';
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('EnableRTL Property Testing using dataBind', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            scroll = new VScroll({ enableRtl: true }, ele);
            expect(scroll.element.classList.contains('e-rtl')).toEqual(true);
            scroll.enableRtl = false;
            scroll.dataBind();
            expect(scroll.element.classList.contains('e-rtl')).toEqual(false);
        });
    });
    describe('RTL with overlay Testing', () => {
        let scroll: any;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            ele.innerHTML = "<div id= 'innerItems' style='display: block;'><div id='item' style='display: block;'><button> Btn_style</button></div><div id='item' class='e-overlay' style='display: block;'><button> Stylllllle</button></div><div id='item' class='e-overlay' style='display: block;'><button> Stylllllle</button></div></div>";
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (scroll) {
                scroll.destroy();
            }
            document.body.innerHTML = '';
        });
        it('RTL Testing', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            ele.style.height = 'inherit';
            scroll = new VScroll({}, ele);
            scroll.element.classList.add('e-rtl');
            let navEle: HTMLElement = <HTMLElement>ele.firstChild.firstChild;
            let navEleDown: HTMLElement = ele.children[2].firstChild as HTMLElement;
            let scrollEle: HTMLElement = scroll.element.children[1];
            let scrollEvent: Event = document.createEvent('MouseEvents');
            scrollEvent.initEvent('scroll', false, false);
            expect(navEle.parentElement.classList.contains('e-overlay')).toBe(true);
            expect(navEle.parentElement.getAttribute('aria-disabled')).toBe('true');
            expect(navEle.parentElement.getAttribute('tabindex')).toBe(null);
            navEleDown.click();
            scrollEle.dispatchEvent(scrollEvent);
            expect(navEle.parentElement.classList.contains('e-overlay')).toBe(false);
            expect(scrollEle.firstElementChild.children[2].classList.contains('e-overlay')).toBe(true);
            expect(scrollEle.firstElementChild.children[1].classList.contains('e-overlay')).toBe(true);
            expect(scrollEle.firstElementChild.children[0].classList.contains('e-overlay')).toBe(false);
            expect(navEle.parentElement.getAttribute('aria-disabled')).toBe('false');
            expect(navEle.parentElement.getAttribute('tabindex')).toBe('0');
            scrollEle.dispatchEvent(scrollEvent);
            navEle.click();
            scrollEle.dispatchEvent(scrollEvent);
            expect(scrollEle.firstElementChild.children[2].classList.contains('e-overlay')).toBe(true);
            expect(scrollEle.firstElementChild.children[1].classList.contains('e-overlay')).toBe(true);
            expect(scrollEle.firstElementChild.children[0].classList.contains('e-overlay')).toBe(false);
            expect(navEle.parentElement.classList.contains('e-overlay')).toBe(true);
            expect(navEle.parentElement.getAttribute('aria-disabled')).toBe('true');
            expect(navEle.parentElement.getAttribute('tabindex')).toBe(null);
            navEleDown.click();
            scrollEle.dispatchEvent(scrollEvent);
            expect(navEle.parentElement.classList.contains('e-overlay')).toBe(false);
            expect(navEle.parentElement.getAttribute('aria-disabled')).toBe('false');
            expect(navEle.parentElement.getAttribute('tabindex')).toBe('0');
            navEleDown.click();
            navEleDown.click();
            navEleDown.click();
            scroll.scrollEle.scrollTop = 0;
            scrollEle.dispatchEvent(scrollEvent);
            expect(scrollEle.firstElementChild.children[2].classList.contains('e-overlay')).toBe(true);
            expect(scrollEle.firstElementChild.children[1].classList.contains('e-overlay')).toBe(true);
            expect(scrollEle.firstElementChild.children[0].classList.contains('e-overlay')).toBe(false);
            expect(navEle.parentElement.classList.contains('e-overlay')).toBe(true);
            expect(navEle.parentElement.getAttribute('aria-disabled')).toBe('true');
            expect(navEle.parentElement.getAttribute('tabindex')).toBe(null);
            navEleDown.click();
            scrollEle.dispatchEvent(scrollEvent);
            expect(navEleDown.parentElement.classList.contains('e-overlay')).toBe(false);
            expect(navEleDown.parentElement.getAttribute('aria-disabled')).toBe('false');
            expect(navEleDown.parentElement.getAttribute('tabindex')).toBe('0');
            navEle.click();
            navEle.click();
            navEle.click(); navEle.click();
            scroll.scrollEle.scrollTop = 190;
            scrollEle.dispatchEvent(scrollEvent);
            expect(scrollEle.firstElementChild.children[2].classList.contains('e-overlay')).toBe(true);
            expect(scrollEle.firstElementChild.children[1].classList.contains('e-overlay')).toBe(true);
            expect(scrollEle.firstElementChild.children[0].classList.contains('e-overlay')).toBe(false);
            expect(navEleDown.parentElement.classList.contains('e-overlay')).toBe(true);
            expect(navEleDown.parentElement.getAttribute('aria-disabled')).toBe('true');
            expect(navEleDown.parentElement.getAttribute('tabindex')).toBe(null);
        });
    });
    describe('Key long press Testing', () => {
        let scroll: any;
        beforeEach((done: Function) => {
            document.body.innerHTML = '';
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
            scroll = new VScroll({ scrollStep: 40 }, ele);
            let scrollEle: HTMLElement = scroll.element.children[1];
            let navEle1: HTMLElement = <HTMLElement>ele.children[2];
            let e: any = {}; e.key = "Enter";
            e.target = navEle1;
            scroll.onKeyPress(e);
            e.key = "Shift";
            scroll.onKeyPress(e);
            scroll.onKeyUp(e);
            e.key = "Enter";
            scroll.onKeyPress(e);
            scroll.onKeyPress(e);
            scroll.onKeyPress(e);
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Key long press Testing with continous moving', () => {
            let scroll: HTMLElement = <HTMLElement>document.querySelector('.e-vscroll-bar');
            expect(scroll.scrollTop).toBe(40);
        });
    });
    describe('Key long press Testing with key release', () => {
        let scroll: any;
        beforeEach((done: Function) => {
            document.body.innerHTML = '';
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
            scroll = new VScroll({}, ele);
            let scrollEle: HTMLElement = scroll.element.children[1];
            let navEle1: HTMLElement = <HTMLElement>ele.children[2];
            let e: any = {}; e.key = "Enter";
            e.target = navEle1;
            scroll.onKeyPress(e);
            scroll.onKeyPress(e);
            scroll.onKeyPress(e);
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Key long press Testing with contious moving in key release', () => {
            let scrollEle: HTMLElement = <HTMLElement>document.querySelector('.e-vscroll-bar');
            let e: any = {}; e.key = "Enter";
            scroll.onKeyUp(e);
            expect(scrollEle.scrollTop).toBe(30);
        });
    });
    describe('Tab Hold Testing', () => {
        let scroll: any;
        beforeEach((): void => {
            document.body.innerHTML = '';
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Tab Hold Testing with continous moving', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            scroll = new VScroll({}, ele);
            let scrollEle: HTMLElement = scroll.element.children[1];
            let navEle: HTMLElement = <HTMLElement>ele.firstChild;
            let navEle1: HTMLElement = <HTMLElement>ele.children[2];
            let navIcon: HTMLElement = navEle.firstChild as HTMLElement;
            expect(navEle.classList.contains('e-touch')).toEqual(true);
            let e: any = {}; e.originalEvent = {};
            e.originalEvent.target = navEle.firstChild;
            scroll.tabHoldHandler(e);
            let scrollEvent: Event = document.createEvent('MouseEvents');
            let scrollEventContext: Event = document.createEvent('MouseEvents');
            scrollEvent.initEvent('mouseup', false, false);
            scrollEventContext.initEvent('contextmenu', false, false);
            navEle.dispatchEvent(scrollEventContext);
            navEle1.dispatchEvent(scrollEventContext);
            scroll.element.dispatchEvent(scrollEventContext);
            navEle.dispatchEvent(scrollEvent);
            navEle1.dispatchEvent(scrollEvent);
            e.originalEvent.target = navEle;
            scroll.tabHoldHandler(e);
        });
    });
    describe('VScroll Public Method testing', () => {
        let scroll: VScroll;
        beforeEach((): void => {
            document.body.innerHTML = '';
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Disable Method Testing', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            scroll = new VScroll({}, ele);
            let scrollEle: HTMLElement = <HTMLElement>scroll.element.children[1];
            let navEle: HTMLElement = <HTMLElement>ele.firstChild;
            let navEle1: HTMLElement = <HTMLElement>ele.children[2];
            scroll.disable(true);
            expect(scroll.element.classList.contains(CLS_DISABLE)).toBe(true);
            expect(navEle1.getAttribute('tabindex')).toBe('-1');
            scroll.disable(false);
            expect(scroll.element.classList.contains(CLS_DISABLE)).toBe(false);
            expect(navEle1.getAttribute('tabindex')).toBe('0');
        });
    });

    describe('MouseWheel testing', () => {
        let scroll: any;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.id = 'Sample';
            ele.style.overflowX = 'hidden';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            (<HTMLElement>ele.firstElementChild).style.height = 'inherit';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (scroll)
                scroll.destroy();
            document.body.innerHTML = '';
        });
        it('Mouse scroll testing', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            scroll = new VScroll({}, ele);
            let scrollEle = scroll.element.children[1];
            expect(scrollEle.scrollTop).toBe(0);
            let scrollEvent = document.createEvent('MouseEvents');
            scrollEvent.initEvent('wheel', false, false);
            let wheelArgs = {
                preventDefault: function () { },
                deltaY: 70
            };
            scroll.wheelEventHandler(wheelArgs);
            scrollEle.dispatchEvent(scrollEvent);
            expect(scrollEle.scrollTop > 0).toBe(true);
            wheelArgs = {
                preventDefault: function () { },
                deltaY: 0
            };
            scroll.wheelEventHandler(wheelArgs);
            scrollEle.dispatchEvent(scrollEvent);
            expect(scrollEle.scrollTop).toBe(0);
        });
    });

    describe('Swipe Handling testing', () => {
        let scroll: any;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.id = 'Sample';
            ele.style.overflowX = 'hidden';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (scroll)
                scroll.destroy();
            document.body.innerHTML = '';
        });
        it('VScrollBase scrollTop Testing in chrome device', (done: Function) => {
            let ele: HTMLElement = document.getElementById('innerItems');
            Browser.userAgent = iosChromeUa;
            scroll = new VScroll({}, ele);
            let scrollEvent = document.createEvent('MouseEvents');
            let iconEle = scroll.element.lastElementChild.firstElementChild;
            scrollEvent.initEvent('scroll', false, false);
            let scrollEle = scroll.element.children[1];
            expect(iconEle.classList.contains(CLS_NAVUPARROW)).toBe(false);
            expect(iconEle.classList.contains(CLS_NAVDOWNARROW)).toBe(true);
            let swipeArgs = { velocity: 50, distanceY: 300, swipeDirection: 'Up' };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 5, swipeDirection: 'Up', distanceY: 1000, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            expect(iconEle.classList.contains(CLS_NAVUPARROW)).toBe(false);
            expect(iconEle.classList.contains(CLS_NAVDOWNARROW)).toBe(true);
            swipeArgs = { velocity: 5, swipeDirection: 'Down', distanceY: 1000, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 5, swipeDirection: 'Down', distanceY: 1000, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 5, swipeDirection: 'Up', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            swipeArgs = { velocity: 0.6, swipeDirection: 'Up', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            setTimeout(() => { done(); }, 800);
            Browser.userAgent = '';
        });
        it('VScrollBase scrollTop Testing in chrome device', (done: Function) => {
            let ele: HTMLElement = document.getElementById('Sample');
            Browser.userAgent = iosChromeUa;
            scroll = new VScroll({
                enableRtl: true,
            }, ele);
            let scrollEvent = document.createEvent('MouseEvents');
            scrollEvent.initEvent('scroll', false, false);
            let scrollEle = scroll.element.children[1];
            let swipeArgs = { velocity: 50, distanceY: 300, swipeDirection: 'Up' };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 5, swipeDirection: 'Down', distanceY: 1000, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 5, swipeDirection: 'Up', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            swipeArgs = { velocity: 0.6, swipeDirection: 'Up', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            setTimeout(() => { done(); }, 800);
            Browser.userAgent = '';
        });
    });

    describe('Swipe Handling testing in IE ', () => {
        let scroll: any;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.id = 'Sample';
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (scroll)
                scroll.destroy();
            document.body.innerHTML = '';
        });
        it('VScrollBase scrollTop Testing in IE device', (done: Function) => {
            let ele: HTMLElement = document.getElementById('innerItems');
            Browser.userAgent = windowsPhoneUa;
            scroll = new VScroll({
            }, ele);
            let scrollEvent = document.createEvent('MouseEvents');
            scrollEvent.initEvent('scroll', false, false);
            let scrollEle = scroll.element.children[1];
            let swipeArgs = { velocity: 50, distanceY: 300, swipeDirection: 'Up' };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 50, swipeDirection: 'Up', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 50, swipeDirection: 'Up', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 50, swipeDirection: 'Down', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 50, swipeDirection: 'Down', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 50, swipeDirection: 'Down', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 50, swipeDirection: 'Up', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            setTimeout(() => { done(); }, 800);
            Browser.userAgent = '';
        });
        it('VScrollBase scrollTop Testing in IE device', (done: Function) => {
            let ele: HTMLElement = document.getElementById('innerItems');
            Browser.userAgent = windowsPhoneUa;
            scroll = new VScroll({
                enableRtl: true
            }, ele);
            let scrollEvent = document.createEvent('MouseEvents');
            scrollEvent.initEvent('scroll', false, false);
            let scrollEle = scroll.element.children[1];
            let swipeArgs = { velocity: 50, distanceY: 300, swipeDirection: 'Up' };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 50, swipeDirection: 'Up', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 50, swipeDirection: 'Up', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 50, swipeDirection: 'Down', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 50, swipeDirection: 'Down', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 50, swipeDirection: 'Down', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            swipeArgs = { velocity: 50, swipeDirection: 'Up', distanceY: 800, };
            scroll.swipeHandler(swipeArgs);
            scrollEle.dispatchEvent(scrollEvent);
            setTimeout(() => { done(); }, 800);
            Browser.userAgent = '';
        });
    });
    describe('Cross Browser Mozilla Testing for Scrolling in RTL mode', () => {
        let scroll: any;
        beforeEach((): void => {
            document.body.innerHTML = '';
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            let css: string = ".e-rtl { direction: rtl; } ";
            let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
            let styleNode: Node = style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
            Browser.userAgent = firefoxUa;
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('EnableRTL Property Testing using dataBind', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            scroll = new VScroll({ enableRtl: true, scrollStep: 50 }, ele);
            expect(scroll.element.classList.contains('e-rtl')).toEqual(true);
            let scrollEle: HTMLElement = scroll.element.children[1];
            let navEle: HTMLElement = <HTMLElement>ele.firstChild;
            let navIcon: HTMLElement = navEle.firstChild as HTMLElement;
            let scrollEvent: Event = document.createEvent('MouseEvents');
            scrollEvent.initEvent('scroll', false, false);
            navEle.click();
            navEle.click();
            navEle.click();
        });
    });
    describe('Cross Browser Edge Testing for Scrolling in RTL mode', () => {
        let scroll: any;
        beforeEach((): void => {
            document.body.innerHTML = '';
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            let css: string = ".e-rtl { direction: rtl; } ";
            let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
            let styleNode: Node = style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
            Browser.userAgent = edgeUa;
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Cross browser testing with EDGE', () => {
            Browser.userAgent = edgeUa;
            let tchEvent: TouchEventArgs;
            let ele: HTMLElement = document.getElementById('innerItems');
            scroll = new VScroll({ enableRtl: true, scrollStep: 50 }, ele);
            expect(scroll.element.classList.contains('e-rtl')).toEqual(true);
            let scrollEle: HTMLElement = scroll.element.children[1];
            let navEle: HTMLElement = <HTMLElement>ele.firstChild;
            let navIcon: HTMLElement = navEle.firstChild as HTMLElement;
            let scrollEvent: Event = document.createEvent('MouseEvents');
            scrollEvent.initEvent('scroll', false, false);
            navEle.click();
            navEle.click();
            navEle.click();
            scrollEle.dispatchEvent(scrollEvent);
            let event: ScrollEventArgs = {
                scrollDirection: 'Up',
                name: 'scroll',
                distanceX: 0,
                distanceY: 30, originalEvent: tchEvent, startEvents: tchEvent, startX: 0, startY: 30, velocity: 4
            };
            scroll.touchHandler(event);
        });
    });
    describe('Cross Browser Edge Testing for Scrolling in RTL mode', () => {
        let scroll: any;
        beforeEach((): void => {
            document.body.innerHTML = '';
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            let css: string = ".e-rtl { direction: rtl; } ";
            let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
            let styleNode: Node = style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Cross browser testing with IE', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            Browser.userAgent = ieUa;
            scroll = new VScroll({ enableRtl: true, scrollStep: 50 }, ele);
            expect(scroll.element.classList.contains('e-rtl')).toEqual(true);
            let scrollEle: HTMLElement = scroll.element.children[1];
            let navEle: HTMLElement = <HTMLElement>ele.firstChild;
            expect(navEle.classList.contains('e-ie-align')).toEqual(true);
            Browser.userAgent = '';
        });
    });
    describe('Device Testing', () => {
        let scroll: any;
        beforeEach((): void => {
            document.body.innerHTML = '';
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflowX = 'hidden';
            ele.id = 'Sample';
            let css: string = ".e-rtl { direction: rtl; } ";
            let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
            let styleNode: Node = style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            ele.innerHTML = innerItemsHTMLString;
            setStyleAttribute(ele, { width: '100px', height: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (scroll)
                scroll.destroy();
            document.body.innerHTML = '';
        });
        it('Cross browser Device Arrow and overlay testing', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            Browser.userAgent = iosChromeUa;
            scroll = new VScroll({ scrollStep: 50 }, ele);
            expect(scroll.element.classList.contains('e-scroll-device')).toBe(true);
            expect(scroll.element.children.length).toBe(4);
            expect(scroll.element.children[0].classList.contains(CLS_OVERLAY)).toBe(true);
            expect(scroll.element.children[2].classList.contains(CLS_OVERLAY)).toBe(true);
            expect(scroll.element.children[2].classList.contains(CLS_DOWNOVERLAY)).toBe(true);
            expect(scroll.element.children[0].classList.contains(CLS_UPOVERLAY)).toBe(true);
            let navEle: HTMLElement = <HTMLElement>ele.children[3];
            scroll.destroy();
            expect(scroll.element.classList.contains('e-scroll-device')).toBe(false);
            expect(scroll.element.querySelectorAll('.' + CLS_OVERLAY).length).toBe(0);
            scroll = new VScroll({ scrollStep: 50 }, ele);
            Browser.userAgent = '';
        });
        it('Cross browser Device with default scrollStep', () => {
            let ele: HTMLElement = document.getElementById('innerItems');
            Browser.userAgent = iosChromeUa;
            scroll = new VScroll({}, ele);
            expect(scroll.element.classList.contains('e-scroll-device')).toBe(true);
            expect(scroll.element.children.length).toBe(4);
            expect(scroll.element.children[0].classList.contains(CLS_OVERLAY)).toBe(true);
            expect(scroll.element.children[2].classList.contains(CLS_OVERLAY)).toBe(true);
            expect(scroll.element.children[2].classList.contains(CLS_DOWNOVERLAY)).toBe(true);
            expect(scroll.element.children[0].classList.contains(CLS_UPOVERLAY)).toBe(true);
            let navEle: HTMLElement = <HTMLElement>ele.children[3];
            navEle.click();
            Browser.userAgent = '';
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});