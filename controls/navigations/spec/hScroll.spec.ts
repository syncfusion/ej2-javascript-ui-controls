/**
 * Horizontal scroll spec document
 */
import { ScrollEventArgs, TouchEventArgs, Browser } from '@syncfusion/ej2-base';
import { setStyleAttribute } from '@syncfusion/ej2-base';
import { HScroll } from '../src/common/h-scroll';
import { isNullOrUndefined} from '@syncfusion/ej2-base';

const CLS_DISABLE: string = 'e-overlay';
const CLS_OVERLAY: string = 'e-scroll-overlay';
const CLS_RIGHTOVERLAY: string = 'e-scroll-right-overlay';
const CLS_LEFTOVERLAY: string = 'e-scroll-left-overlay';
const CLS_NAVRIGHTARROW : string = 'e-nav-right-arrow';
const CLS_NAVLEFTARROW : string = 'e-nav-left-arrow';


let firefoxUa: string = 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0';

let windowsPhoneUa: string = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; ' +
    'Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)';

let edgeUa: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240';

let ieUa: string = 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; .NET4.0E; .NET4.0C; ' +
    'Tablet PC 2.0; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; InfoPath.3; rv:11.0) like Gecko';

let iosChromeUa: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) ' +
    'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';

describe('Horizontal scroll bar Base items', () => {
   let css: string = " button {font-family:Arial; font-size: 14px; padding: 1px 6px;} .e-rtl { direction: rtl; } ";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);

    describe(' Horizontal scroll Base Testing', () => {
        let scroll: any;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.id = 'Sample';
            ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div>	</div>";
            setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);

        });
        afterEach((): void => {
            if (scroll)
                scroll.destroy();
            document.body.innerHTML = '';
        });
        it('Horizontal scroll test', () => {
            let ele: HTMLElement = document.getElementById('inneritems');
            scroll = new HScroll({}, ele);
            expect(ele.classList.contains("e-hscroll")).toEqual(true);
            expect(scroll.element.classList.contains('e-scroll-device')).toBe(false);
        });
        it('Horizontal Touch test', () => {
            let ele: HTMLElement = document.getElementById('inneritems');
            scroll = new HScroll({}, ele);
            expect(ele.classList.contains("e-touch")).toEqual(true);
        });
        it('Horizontal Touch test', () => {
            let ele: HTMLElement = document.getElementById('inneritems');
            scroll = new HScroll({}, ele);
            expect((<HTMLElement>ele.querySelector('.e-hscroll-content')).childElementCount == 3).toEqual(true);
        });
        it('Horizontal Touch test', () => {
            let ele: HTMLElement = document.getElementById('inneritems');
            scroll = new HScroll({}, ele);
            expect((<HTMLElement>ele.querySelector('.e-hscroll-content')).childElementCount == 3).toEqual(true);
            expect(ele.childElementCount).toBe(3);
            expect(ele.children[0].id).toBe("inneritems_nav_left");
            expect(ele.children[2].id).toBe("inneritems_nav_right");
        });
    });
    describe('HSCrollbar Persistance Testing', () => {
        let scroll: HScroll;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.id = 'Sample';
            ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button>Btn_style</button></div><div id='item' style='display: inline-block;'><button>Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div>	</div>";
            setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (scroll)
                scroll.destroy();
            document.body.innerHTML = '';
        });
        it('HScrollBase Persistance scrollLeft Testing', () => {
            window.localStorage.setItem('hScrollinneritems', JSON.stringify({ scrollStep: 50 }));
            let ele: HTMLElement = document.getElementById('inneritems');
            scroll = new HScroll({
                enablePersistence: true,
            }, ele);
            expect(scroll.scrollStep).toEqual(50);
        });
    });
    describe(' Property Change Testing', () => {
        let scroll: HScroll;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.id = 'Sample';
            ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
            setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (scroll)
                scroll.destroy();
            document.body.innerHTML = '';
        });
        it('On Property Change Testing', () => {
            let ele: HTMLElement = document.getElementById('inneritems');
            scroll = new HScroll({
            }, ele);
            scroll.scrollStep = 50;
            scroll.dataBind();
            expect(scroll.scrollStep).toEqual(50);
        });
    });
    describe('Unique id testing', () => {
        let scroll: HScroll;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.id = 'Sample';
            ele.innerHTML = "<div class= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
            setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Unique id testing', () => {
            let ele: HTMLElement = document.getElementsByClassName('inneritems')[0] as HTMLElement;
            scroll = new HScroll({
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
    describe(' Property Change Testing', () => {
        let scroll: any;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflow = 'hidden';
            ele.id = 'Sample';
            ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>	";
            setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (scroll)
                scroll.destroy();
            document.body.innerHTML = '';
        });
        it('onProperty Change Testing', () => {
            let ele: HTMLElement = document.getElementById('inneritems');
            scroll = new HScroll({ scrollStep: 40 });
            scroll.appendTo('#Sample');
            let scrollEle: HTMLElement = scroll.element.children[1];
            let tchEvent: TouchEventArgs;
            let navEle: HTMLElement = scroll.element.children[2].lastChild;
            let scrollEvent: Event = document.createEvent('MouseEvents');
            scrollEvent.initEvent('scroll', false, false);
            let event: ScrollEventArgs = {
                scrollDirection: 'Left',
                name: 'scroll',
                distanceX: 30,
                distanceY: 0, originalEvent: tchEvent, startEvents: tchEvent, startX: 30, startY: 0, velocity: 4
            };
            expect(scrollEle.scrollLeft).toEqual(0);
            scroll.touchHandler(event);
            expect(scrollEle.scrollLeft).toEqual(30);
            event.scrollDirection = 'Right'; event.name = 'scroll'; event.distanceX = 30;
            scroll.touchHandler(event);
            event.scrollDirection = 'Top'; event.name = 'scroll'; event.distanceX = 30;
            scroll.touchHandler(event);
            expect(scrollEle.scrollLeft).toEqual(0);
            event.scrollDirection = 'Left'; event.name = 'scroll'; event.distanceX = 40;
            scroll.touchHandler(event);
            expect(scrollEle.scrollLeft).toEqual(40);
            event.scrollDirection = 'Left'; event.name = 'scroll'; event.distanceX = 10;
            scroll.touchHandler(event);
            scrollEle.dispatchEvent(scrollEvent);
            expect(scrollEle.scrollLeft).toEqual(50);
            event.scrollDirection = 'Left'; event.name = 'scroll'; event.distanceX = 10;
            scroll.touchHandler(event);
            expect(scrollEle.scrollLeft).toEqual(60);
            event.scrollDirection = 'Left'; event.name = 'scroll'; event.distanceX = 10;
            scroll.touchHandler(event);
            expect(scrollEle.scrollLeft).toEqual(70);
            scrollEle.scrollLeft = 500;
            scrollEle.dispatchEvent(scrollEvent);
            scrollEle.scrollLeft = 0;
            scrollEvent.initEvent('scroll', false, false);
            scrollEle.dispatchEvent(scrollEvent);
            expect(navEle.classList.contains('e-nav-right-arrow')).toEqual(true);
            navEle.parentElement.click();
            scrollEle.dispatchEvent(scrollEvent);
            expect(scrollEle.scrollLeft).toEqual(10);
            scrollEle.scrollLeft = 160;
            navEle.click();
            scrollEle.dispatchEvent(scrollEvent);
            navEle.click();
            navEle.remove();
            scrollEle.dispatchEvent(scrollEvent);
            event.name = 'swipe';
            scroll.touchHandler(event);
        });
    });

    describe(' RTL Testing', () => {
        let scroll: any;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement('div');
            ele.style.overflow = 'hidden';
            ele.id = 'Sample';
            ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Stylllllle</button></div><div id='item' class='e-overlay' style='display: inline-block;'><button> Stylllllle</button></div><div id='item' class='e-overlay' style='display: inline-block;'><button> Stylllllle</button></div></div>";
            setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (scroll) {
                scroll.destroy();
            }
            document.body.innerHTML = '';
        });
        it('RTL Testing', () => {
            let ele: HTMLElement = document.getElementById('Sample');
            scroll = new HScroll({}); scroll.appendTo('#inneritems');
            scroll.element.classList.add('e-rtl');
            let navEle: HTMLElement = <HTMLElement>ele.firstChild.firstChild.lastChild;
            let navEleRight: HTMLElement = (<HTMLElement>ele.firstChild).children[2].firstChild as HTMLElement;
            let scrollEle: HTMLElement = scroll.element.children[1];
            let scrollEvent: Event = document.createEvent('MouseEvents');
            scrollEvent.initEvent('scroll', false, false);
            expect(navEle.parentElement.classList.contains('e-overlay')).toBe(true);
            expect(navEle.parentElement.getAttribute('aria-disabled')).toBe('true');
            expect(navEle.parentElement.getAttribute('tabindex')).toBe(null);
            navEleRight.click();
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
            navEleRight.click();
            scrollEle.dispatchEvent(scrollEvent);
            expect(navEle.parentElement.classList.contains('e-overlay')).toBe(false);
            expect(navEle.parentElement.getAttribute('aria-disabled')).toBe('false');
            expect(navEle.parentElement.getAttribute('tabindex')).toBe('0');
            navEleRight.click();
            navEleRight.click();
            navEleRight.click();
            scroll.scrollEle.scrollLeft = 0;
            scrollEle.dispatchEvent(scrollEvent);
            expect(scrollEle.firstElementChild.children[2].classList.contains('e-overlay')).toBe(true);
            expect(scrollEle.firstElementChild.children[1].classList.contains('e-overlay')).toBe(true);
            expect(scrollEle.firstElementChild.children[0].classList.contains('e-overlay')).toBe(false);
            expect(navEleRight.parentElement.classList.contains('e-overlay')).toBe(true);
            expect(navEleRight.parentElement.getAttribute('aria-disabled')).toBe('true');
            expect(navEleRight.parentElement.getAttribute('tabindex')).toBe(null);
            navEleRight.click();
            scrollEle.dispatchEvent(scrollEvent);
            expect(navEleRight.parentElement.classList.contains('e-overlay')).toBe(true);
            expect(navEleRight.parentElement.getAttribute('aria-disabled')).toBe('true');
            expect(navEleRight.parentElement.getAttribute('tabindex')).toBe(null);
            navEle.click();
            navEle.click();
            navEle.click();navEle.click();
            scroll.scrollEle.scrollLeft = 190;
            scrollEle.dispatchEvent(scrollEvent);
            expect(scrollEle.firstElementChild.children[2].classList.contains('e-overlay')).toBe(true);
            expect(scrollEle.firstElementChild.children[1].classList.contains('e-overlay')).toBe(true);
            expect(scrollEle.firstElementChild.children[0].classList.contains('e-overlay')).toBe(false);
            expect(navEle.parentElement.classList.contains('e-overlay')).toBe(true);
            expect(navEle.parentElement.getAttribute('aria-disabled')).toBe('true');
            expect(navEle.parentElement.getAttribute('tabindex')).toBe(null);
        });
    });
    describe('RTL Testing', () => {
            let scroll: any;
            beforeEach((): void => {
                let ele: HTMLElement = document.createElement('div');
                ele.style.overflow = 'hidden';
                ele.id = 'Sample';
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                document.body.innerHTML = '';
            });
            it('EnableRTL Property Testing', () => {
                let ele: HTMLElement = document.getElementById('inneritems');
                scroll = new HScroll({ enableRtl: true }, ele);
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
                ele.style.overflow = 'hidden';
                ele.id = 'Sample';
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                document.body.innerHTML = '';
            });
            it('EnableRTL Property Testing using dataBind', () => {
                let ele: HTMLElement = document.getElementById('inneritems');
                scroll = new HScroll({},ele);
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
                ele.style.overflow = 'hidden';
                ele.id = 'Sample';
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                document.body.innerHTML = '';
            });
            it('EnableRTL Property Testing using dataBind', () => {
                let ele: HTMLElement = document.getElementById('inneritems');
                scroll = new HScroll({ enableRtl : true },ele);
                expect(scroll.element.classList.contains('e-rtl')).toEqual(true);
                scroll.enableRtl = false;
                scroll.dataBind();
                expect(scroll.element.classList.contains('e-rtl')).toEqual(false);
            });
        });
        describe('Key long press Testing', () => {
            let scroll: any;
            beforeEach((done: Function) => {
                document.body.innerHTML = '';
                let ele: HTMLElement = document.createElement('div');
                ele.style.overflow = 'hidden';
                ele.id = 'Sample';
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
                ele= document.getElementById('inneritems');
                scroll = new HScroll({ scrollStep: 40 }, ele);
                let scrollEle: HTMLElement = scroll.element.children[1];
                let navEle1: HTMLElement = <HTMLElement>ele.children[2];
                let e: any = {};e.key = "Enter";
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
            it('Key long press Testing with contious moving', () => {
               let scroll: HTMLElement = <HTMLElement>document.getElementById('inneritems').children[1]
               expect(scroll.scrollLeft).toBe(40);
            });
        });
        describe('Key long press Testing with key release', () => {
            let scroll: any;
            beforeEach((done: Function) => {
                document.body.innerHTML = '';
                let ele: HTMLElement = document.createElement('div');
                ele.style.overflow = 'hidden';
                ele.id = 'Sample';
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
                ele= document.getElementById('inneritems');
                scroll = new HScroll({}, ele);
                let scrollEle: HTMLElement = scroll.element.children[1];
                let navEle1: HTMLElement = <HTMLElement>ele.children[2];
                let e: any = {};e.key = "Enter";
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
               let scrollEle: HTMLElement = <HTMLElement>document.getElementById('inneritems').children[1]
               let e: any = {};e.key = "Enter"; 
               scroll.onKeyUp(e);
               expect(scrollEle.scrollLeft).toBe(30);
            });
        });
        describe('Tab Hold Testing', () => {
            let scroll: any;
            beforeEach((): void => {
                document.body.innerHTML = '';
                let ele: HTMLElement = document.createElement('div');
                ele.style.overflow = 'hidden';
                ele.id = 'Sample';
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
               document.body.innerHTML = '';
            });
            it('Tab Hold Testing with contious moving', () => {
               let ele: HTMLElement = document.getElementById('inneritems');
                scroll = new HScroll({}, ele);
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

        describe('Hscroll Public Method testing', () => {
            let scroll: HScroll;
            beforeEach((): void => {
                document.body.innerHTML = '';
                let ele: HTMLElement = document.createElement('div');
                ele.style.overflow = 'hidden';
                ele.id = 'Sample';
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
               document.body.innerHTML = '';
            });
            it('Disable Method Testing', () => {
               let ele: HTMLElement = document.getElementById('inneritems');
                scroll = new HScroll({}, ele);
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

        describe(' Swipe Handling testing', () => {
            let scroll: any;
            beforeEach((): void => {
                let ele: HTMLElement = document.createElement('div');
                ele.id = 'Sample';
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                if (scroll)
                    scroll.destroy();
                document.body.innerHTML = '';
            });
            it('HScrollBase scrollLeft Testing in chrome device', (done: Function) => {
                let ele: HTMLElement = document.getElementById('inneritems');
                Browser.userAgent = iosChromeUa;
                scroll = new HScroll({
                }, ele);
                let scrollEvent = document.createEvent('MouseEvents');
                let iconEle = scroll.element.lastElementChild.firstElementChild;
                scrollEvent.initEvent('scroll', false, false);
                let scrollEle = scroll.element.children[1];
                expect(iconEle.classList.contains(CLS_NAVRIGHTARROW)).toBe(true);
                expect(iconEle.classList.contains(CLS_NAVLEFTARROW)).toBe(false);
                let swipeArgs = { velocity : 50, distanceX: 300,  swipeDirection: 'Left' };
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 5, swipeDirection: 'Left', distanceX: 1000,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                expect(iconEle.classList.contains(CLS_NAVRIGHTARROW)).toBe(false);
                expect(iconEle.classList.contains(CLS_NAVLEFTARROW)).toBe(true);
                swipeArgs = { velocity: 5, swipeDirection: 'Right', distanceX: 1000,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 5, swipeDirection: 'Right', distanceX: 1000,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 5, swipeDirection: 'Top', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                swipeArgs = { velocity: 0.6, swipeDirection: 'Top', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                setTimeout(() => { done(); }, 800);
                Browser.userAgent = '';
            });
            it('HScrollBase scrollLeft Testing in chrome device', (done: Function) => {
                let ele: HTMLElement = document.getElementById('inneritems');
                Browser.userAgent = iosChromeUa;
                scroll = new HScroll({
                    enableRtl: true,
                }, ele);
                let scrollEvent = document.createEvent('MouseEvents');
                scrollEvent.initEvent('scroll', false, false);
                let scrollEle = scroll.element.children[1];
                let swipeArgs = { velocity : 50, distanceX: 300,  swipeDirection: 'Left' };
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 5, swipeDirection: 'Right', distanceX: 1000,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 5, swipeDirection: 'Top', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                swipeArgs = { velocity: 0.6, swipeDirection: 'Top', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                setTimeout(() => { done(); }, 800);
                Browser.userAgent = '';
            });
        });

        describe(' Swipe Handling testing in IE ', () => {
            let scroll: any;
            beforeEach((): void => {
                let ele: HTMLElement = document.createElement('div');
                ele.id = 'Sample';
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                if (scroll)
                    scroll.destroy();
                document.body.innerHTML = '';
            });
            it('HScrollBase scrollLeft Testing in IE device', (done: Function) => {
                let ele: HTMLElement = document.getElementById('inneritems');
                Browser.userAgent = windowsPhoneUa;
                scroll = new HScroll({
                }, ele);
                let scrollEvent = document.createEvent('MouseEvents');
                scrollEvent.initEvent('scroll', false, false);
                let scrollEle = scroll.element.children[1];
                let swipeArgs = { velocity : 50, distanceX: 300,  swipeDirection: 'Left' };
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 50, swipeDirection: 'Left', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 50, swipeDirection: 'Left', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 50, swipeDirection: 'Right', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 50, swipeDirection: 'Right', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 50, swipeDirection: 'Right', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 50, swipeDirection: 'Top', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                setTimeout(() => { done(); }, 800);
                Browser.userAgent = '';
            });
            it('HScrollBase scrollLeft Testing in IE device', (done: Function) => {
                let ele: HTMLElement = document.getElementById('inneritems');
                Browser.userAgent = windowsPhoneUa;
                scroll = new HScroll({
                    enableRtl: true
                }, ele);
                let scrollEvent = document.createEvent('MouseEvents');
                scrollEvent.initEvent('scroll', false, false);
                let scrollEle = scroll.element.children[1];
                let swipeArgs = { velocity : 50, distanceX: 300,  swipeDirection: 'Left' };
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 50, swipeDirection: 'Left', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 50, swipeDirection: 'Left', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 50, swipeDirection: 'Right', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 50, swipeDirection: 'Right', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 50, swipeDirection: 'Right', distanceX: 800,};
                scroll.swipeHandler(swipeArgs);
                scrollEle.dispatchEvent(scrollEvent);
                swipeArgs = { velocity: 50, swipeDirection: 'Top', distanceX: 800,};
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
                ele.style.overflow = 'hidden';
                ele.id = 'Sample';
                let css: string = ".e-rtl { direction: rtl; } ";
                let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
                let styleNode: Node = style.appendChild(document.createTextNode(css));
                document.getElementsByTagName('head')[0].appendChild(style);
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
                Browser.userAgent = firefoxUa;
            });
            afterEach((): void => {
                document.body.innerHTML = '';
            });
            it('EnableRTL Property Testing using dataBind', () => {
                let ele: HTMLElement = document.getElementById('inneritems');
                scroll = new HScroll({ enableRtl : true, scrollStep: 50 }, ele);
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
                ele.style.overflow = 'hidden';
                ele.id = 'Sample';
                let css: string = ".e-rtl { direction: rtl; } ";
                let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
                let styleNode: Node = style.appendChild(document.createTextNode(css));
                document.getElementsByTagName('head')[0].appendChild(style);
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
                Browser.userAgent = edgeUa;
            });
            afterEach((): void => {
                document.body.innerHTML = '';
            });
            it('Cross browser testing with EDGE', () => {
                Browser.userAgent = edgeUa;
                let tchEvent: TouchEventArgs; 
                let ele: HTMLElement = document.getElementById('inneritems');
                scroll = new HScroll({ enableRtl : true, scrollStep: 50 }, ele);
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
                scrollDirection: 'Left',
                name: 'scroll',
                distanceX: 30,
                distanceY: 0, originalEvent: tchEvent, startEvents: tchEvent, startX: 30, startY: 0, velocity: 4
                };
                scroll.touchHandler(event);
            });
        });

        describe('Cross Browser Edge Testing for Scrolling in RTL mode', () => {
            let scroll: any;
            beforeEach((): void => {
                document.body.innerHTML = '';
                let ele: HTMLElement = document.createElement('div');
                ele.style.overflow = 'hidden';
                ele.id = 'Sample';
                let css: string = ".e-rtl { direction: rtl; } ";
                let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
                let styleNode: Node = style.appendChild(document.createTextNode(css));
                document.getElementsByTagName('head')[0].appendChild(style);
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                document.body.innerHTML = '';
            });
            it('Cross browser testing with IE', () => {
                let ele: HTMLElement = document.getElementById('inneritems');
                Browser.userAgent = ieUa;
                scroll = new HScroll({ enableRtl : true, scrollStep: 50 }, ele);
                expect(scroll.element.classList.contains('e-rtl')).toEqual(true);
                let scrollEle: HTMLElement = scroll.element.children[1];
                let navEle: HTMLElement = <HTMLElement>ele.firstChild;
                expect (navEle.classList.contains('e-ie-align')).toEqual(true);
                Browser.userAgent = '';
            });
        });
        describe('Device Testing', () => {
            let scroll: any;
            beforeEach((): void => {
                document.body.innerHTML = '';
                let ele: HTMLElement = document.createElement('div');
                ele.style.overflow = 'hidden';
                ele.id = 'Sample';
                let css: string = ".e-rtl { direction: rtl; } ";
                let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
                let styleNode: Node = style.appendChild(document.createTextNode(css));
                document.getElementsByTagName('head')[0].appendChild(style);
                ele.innerHTML = "<div id= 'inneritems' style='display: inline-block;'><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div><div id='item' style='display: inline-block;'><button> Btn_style</button></div></div>";
                setStyleAttribute(ele, { width: '50px', 'white-space': 'nowrap' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
            if (scroll)
                scroll.destroy();
                document.body.innerHTML = '';
            });
            it('Cross browser Device Arrow and overlay testing', () => {
                let ele: HTMLElement = document.getElementById('inneritems');
                Browser.userAgent = iosChromeUa;
                scroll = new HScroll({ scrollStep: 50 }, ele);
                expect(scroll.element.classList.contains('e-scroll-device')).toBe(true);
                expect(scroll.element.children.length).toBe(4);
                expect(scroll.element.children[0].classList.contains(CLS_OVERLAY)).toBe(true);
                expect(scroll.element.children[2].classList.contains(CLS_OVERLAY)).toBe(true);
                expect(scroll.element.children[2].classList.contains(CLS_RIGHTOVERLAY)).toBe(true);
                expect(scroll.element.children[0].classList.contains(CLS_LEFTOVERLAY)).toBe(true);
                let navEle: HTMLElement = <HTMLElement>ele.children[3];
                scroll.destroy();
                expect(scroll.element.classList.contains('e-scroll-device')).toBe(false);
                expect(scroll.element.querySelectorAll('.' + CLS_OVERLAY).length).toBe(0);
                scroll = new HScroll({ scrollStep: 50 }, ele);
                Browser.userAgent = '';
            });
            it('Cross browser Device with default scrollStep', () => {
                let ele: HTMLElement = document.getElementById('inneritems');
                Browser.userAgent = iosChromeUa;
                scroll = new HScroll({ }, ele);
                expect(scroll.element.classList.contains('e-scroll-device')).toBe(true);
                expect(scroll.element.children.length).toBe(4);
                expect(scroll.element.children[0].classList.contains(CLS_OVERLAY)).toBe(true);
                expect(scroll.element.children[2].classList.contains(CLS_OVERLAY)).toBe(true);
                expect(scroll.element.children[2].classList.contains(CLS_RIGHTOVERLAY)).toBe(true);
                expect(scroll.element.children[0].classList.contains(CLS_LEFTOVERLAY)).toBe(true);
                let navEle: HTMLElement = <HTMLElement>ele.children[3];
                navEle.click();
                Browser.userAgent = '';
            });
        });
    });