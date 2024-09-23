import {
    Component, EventHandler, Event, Property, setStyleAttribute, addClass, removeClass,
    isNullOrUndefined, EmitType, NotifyPropertyChanges, BaseEventArgs, INotifyPropertyChanged,
    Animation, AnimationModel, AnimationOptions, Browser, createElement
} from '@syncfusion/ej2-base';

import { Sidebar } from '../src/sidebar/sidebar';
import { profile, inMB, getMemoryProfile } from './common.spec';

describe('Sidebar', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });

describe("Sidebar DOM class Testing ", () => {
    let sidebar: any;
    beforeEach((): void => {
        let ele: HTMLElement = document.createElement("div");
        let sibin: HTMLElement = document.createElement("div");
        ele.innerHTML = "<h3>Testing of Sidebar</h3>"
        sibin.innerHTML = "Side bar";
        sibin.className = 'e-content-section';
        ele.id = "sidebar";
        ele.style.width = "300px";
        ele.style.height = "100%";
        document.body.style.margin = "0px";
        let div: any = document.createElement('div');
        let span: any = document.createElement('span');
        div.className = 'e-context-element';
        div.appendChild(span);
        document.body.appendChild(div);
        document.body.appendChild(ele);
        document.body.appendChild(sibin);
    });
    afterEach((): void => {
        if (sidebar) {
            sidebar.destroy();
        }
        document.body.innerHTML = "";
    });
    //width test case 
    it("Sidebar width test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ width: '250px' }, ele);
        sidebar.show();
        expect(document.getElementById('sidebar').style.width).toBe("250px");
    });
    it("Sidebar width px number test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ width: 250 }, ele);
        sidebar.show();
        expect(document.getElementById('sidebar').style.width).toBe("250px");
    });
    it("Sidebar width em test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ width: '10em' }, ele);
        sidebar.show();
        expect(document.getElementById('sidebar').style.width).toBe("10em");
    });
    it("Sidebar width % test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ width: '50%' }, ele);
        sidebar.show();
        expect(document.getElementById('sidebar').style.width).toBe("50%");
    });
    it("Sidebar width test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ width: '250' }, ele);
        sidebar.show();
        expect(document.getElementById('sidebar').style.width).toBe("250px");
    });
    it("Sidebar default width test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({}, ele);
        sidebar.show();
        expect(document.getElementById('sidebar').style.width).toBe("auto");
    });

    it("Sidebar width onproperty change test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({}, ele);
        sidebar.width = "500px";
        sidebar.dataBind();
        sidebar.show();
        expect(document.getElementById('sidebar').style.width).toBe("500px");
    });
    // RTL test case 
    it("Sidebar with enableRtl true test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableRtl: true }, ele);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-rtl')).toBe(true);
    });
    it("Sidebar with enableRtl false test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableRtl: false }, ele);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-rtl')).toBe(false);
    });
    // animation test case
    it("Sidebar with animation disabled test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ animate: false, type: 'Push' }, ele);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-disable-animation')).toBe(true);
    });

    it("Sidebar auto type animation test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        sidebar = new Sidebar({ type: 'Auto' }, ele);
        expect(sidebar.element.classList.contains('e-transition')).toBe(true);
        sidebar.destroy();
        expect(sidebar.element.classList.length).toBe(0);
    });
    // e-visibility test case
    it("Sidebar with e-visibility test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Push' }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-visibility')).toBe(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-visibility')).toBe(false);
    });

    //e-visibility test case
    it("Sidebar with e-visibility test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Auto' }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-visibility')).toBe(false);
    });


    //mediaQuery test case
    it("Sidebar with auto type and mediaQuery test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Auto', mediaQuery: '(min-width:1400px)' }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-visibility')).toBe(false);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(false);
    });
    it("Sidebar with auto type and mediaQuer list test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Auto', mediaQuery: window.matchMedia('min-width:1400px') }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-visibility')).toBe(false);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(false);
    });

    // animation onproperty change test case

    it("Sidebar with animation disabled test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ animate: false, type: 'Push' }, ele);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-disable-animation')).toBe(true);
        sidebar.animate = true;
        sidebar.dataBind();
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-disable-animation')).toBe(false);
        sidebar.hide();
        sidebar.dataBind();
        expect(document.getElementById('sidebar').classList.contains('e-disable-animation')).toBe(false);
    });
    // RTL tes case 
    it("enabledRtl onproperty test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({}, ele);
        sidebar.enableRtl = true;
        sidebar.dataBind();
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-rtl')).toBe(true);
        sidebar.enableRtl = false;
        sidebar.dataBind();
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-rtl')).toBe(false);
    });

    // Tab Index
    it('tab index of focus element', () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({}, ele);
        // expect(sidebar.element.getAttribute('tabindex') === '0').toBe(true);
        expect(sidebar.element.getAttribute('tabindex') === null).toBe(true);
    });
    it('while give tab index to the sidebar component', () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({}, ele);
        sidebar.element.tabIndex = '4';
        expect(sidebar.element.getAttribute('tabindex') === '4').toBe(true);
    });
    it('Tab index checking while destroy the component', () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        ele.setAttribute('tabindex', '1');
        sidebar = new Sidebar({}, ele);
        sidebar.destroy();
        expect(ele.getAttribute('tabindex') === '1').toBe(true);
    });
    it('Tab index checking while destroy the Angular component', () => {
        let element: any = createElement('ejs-sidebar', { id: 'sidebarTag' });
        element.setAttribute('tabindex', '1');
        document.body.appendChild(element);
        let sidebarEle = new Sidebar();
        sidebarEle.appendTo(element);
        sidebarEle.destroy();
        expect(element.getAttribute('tabindex') === '1').toBe(true);
    });

    it("Sidebar slide type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Slide" }, ele);
        sidebar.show();
    });
    it("Sidebar slide type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: true }, ele);
    });
    it("Sidebar main content animation class testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Slide" }, ele);
        sidebar.show();
        expect((<HTMLElement>document.querySelector('.e-content-section')).classList.contains('e-content-animation')).toBe(true);
    });

    it("Sidebar push with left position testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", width: '400px' }, ele);
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.show();
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("400px");
        sidebar.position = 'Right';
        sidebar.dataBind();
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("400px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        sidebar.hide();
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        sidebar.position = 'Left';
        sidebar.show();
        sidebar.dataBind();
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("400px");


    });

    //enableGestures test case

    it("Sidebar enableGestures test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableGestures: true, type: "Push" }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-touch')).toBe(true);
        //onProperty test case
        sidebar.enableGestures = false;
        sidebar.dataBind();
        expect(document.getElementById('sidebar').classList.contains('e-touch')).toBe(false);
    });

    it("Sidebar with swipe towards right direction test case", () => {
        let touch: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ },
            swipeDirection: 'Right',
            startX: 20,
            distanceX: 60,
            velocity: 0.5
        };
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableGestures: true, type: "Push" }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-touch')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        sidebar.enableGestureHandler(touch);
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
    });


    it("Sidebar with swipe towards left direction test case", () => {
        let touch: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ },
            swipeDirection: 'Left',
            startX: 20,
            distanceX: 60,
            velocity: 0.5
        };
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableGestures: true, type: "Push" }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-touch')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        sidebar.enableGestureHandler(touch);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
    });
    it("Sidebar with swipe towards left direction with right position  test case", () => {
        let touch: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ },
            swipeDirection: 'Left', startX: window.innerWidth - 20,
            distanceX: 60,
            velocity: 0.5
        };
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableGestures: true, position: 'Right', type: "Push" }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-touch')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.enableGestureHandler(touch);
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
    });
    it("Sidebar with swipe towards left direction with right position  test case", () => {
        let touch: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ },
            swipeDirection: 'Right', startX: 20,
            distanceX: 60,
            velocity: 0.5
        };
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableGestures: true, position: 'Right', type: "Push" }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-touch')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        sidebar.enableGestureHandler(touch);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
    });

    it("Sidebar with swipe towards right direction test case (event)", () => {
        let touch: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ },
            swipeDirection: 'Right',
            startX: 20,
            distanceX: 60,
            velocity: 0.5
        };
        let openCount:number=0;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ 
            enableGestures: true, type: "Push", 
            open: ()=>{ openCount++; }
        }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-touch')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.enableGestureHandler(touch);
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        sidebar.enableGestureHandler(touch);
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
    });

    it("Sidebar with swipe towards left direction test case (event)", () => {
        let touch: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ },
            swipeDirection: 'Left',
            startX: 20,
            distanceX: 60,
            velocity: 0.5
        };
        let openCount:number=0;
        let closeCount:number=0;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ 
            enableGestures: true, 
            type: "Push", 
            open: ()=>{ openCount++; },
            close: ()=>{ closeCount++; } 
        }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-touch')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        sidebar.enableGestureHandler(touch);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        expect(openCount).toBe(1);
        sidebar.enableGestureHandler(touch);
        expect(openCount).toBe(1);
    });
    it("Sidebar with swipe towards left direction with right position  test case (event)", () => {
        let touch: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ },
            swipeDirection: 'Left', startX: window.innerWidth - 20,
            distanceX: 60,
            velocity: 0.5
        };
        let openCount:number=0;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ 
            enableGestures: true, position: 'Right', type: "Push", 
            open: ()=>{ openCount++; }
        }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-touch')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.enableGestureHandler(touch);
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        expect(openCount).toBe(1);
        sidebar.enableGestureHandler(touch);
        expect(openCount).toBe(1);
    });
    it("Sidebar with swipe towards right direction with right position  test case (event)", () => {
        let touch: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ },
            swipeDirection: 'Right', startX: 20,
            distanceX: 60,
            velocity: 0.5
        };
        let openCount:number=0;
        let closeCount:number=0;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ 
            enableGestures: true, position: 'Right', type: "Push", 
            open: ()=>{ openCount++; },
            close: ()=>{ closeCount++; } 
        }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-touch')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        sidebar.enableGestureHandler(touch);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);        
        expect(openCount).toBe(1);
        expect(closeCount).toBe(1);
        sidebar.enableGestureHandler(touch);
        expect(closeCount).toBe(1);        
    });

    it("Sidebar Base property Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        sidebar = new Sidebar({}, ele);
        expect(sidebar.type == 'Auto').toEqual(true);
        expect(sidebar.position == 'Left').toEqual(true);
        expect(isNullOrUndefined(document.getElementById('sidebar'))).toEqual(false);
        expect(isNullOrUndefined(sidebar.height)).toEqual(false);
        expect(isNullOrUndefined(sidebar.width)).toEqual(false);
        expect(isNullOrUndefined(sidebar.showBackdrop)).toEqual(false);
        expect(sidebar.mediaQuery == null).toEqual(true);
    });
    it("Sidebar slide type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Slide" }, ele);
        sidebar.show();
    });
    it("Sidebar slide type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Slide", }, ele);
    });
    it("Sidebar push type testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push" }, ele);
        sidebar.show();
    });
    it("Sidebar over type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Over" }, ele);
        sidebar.show();
        expect(document.body.clientWidth == sibling.clientWidth).toEqual(true);
    });

    it("Sidebar over type with left position test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Auto", width: '300px' }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.hide();
        expect(document.getElementById('sidebar').classList.contains('e-push')).toBe(true);
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");

    });

    it("Sidebar over type with right position test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Auto", width: '300px', position: "Right" }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.hide();
        expect(document.getElementById('sidebar').classList.contains('e-push')).toBe(true);
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");

    });

    it("Sidebar openOnInit with push type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push" }, ele);
        expect(ele.classList.contains("e-close")).toEqual(true);
    });
    it("Sidebar openOnInit with slide type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;

        sidebar = new Sidebar({ type: "Slide" }, ele);
        // expect(new WebKitCSSMatrix(window.getComputedStyle(sibling).webkitTransform).m41 == (ele.offsetWidth)).toEqual(true);
    });
    it("Sidebar openOnInit over type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;

        sidebar = new Sidebar({ type: "Over" }, ele);
        sidebar.show();
        expect(document.body.clientWidth == sibling.clientWidth).toEqual(true);
    });
    it("Sidebar e-dock Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true }, ele);
        expect(ele.classList.contains("e-dock")).toEqual(true);
        expect(ele.style.transform).toBe("");
    });

    it("Sidebar closeOnDocumentClick test", () => {
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ }
        };
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ closeOnDocumentClick: true, type: 'Push' }, ele);
        sidebar.show();
        sidebar.documentclickHandler(mouseEventArgs);
        expect(sidebar.element.classList.contains('e-close')).toBe(true);
    });

    // IsOpen property against test cases in normal case
    it("isOpen false against auto", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: false, type: 'Auto' }, ele);
        expect(sidebar.element.classList.contains('e-open')).toBe(true);
        expect(sidebar.isOpen).toBe(true);
    });
    it("isOpen true against auto", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: true, type: 'Auto' }, ele);
        expect(sidebar.element.classList.contains('e-open')).toBe(true);
        expect(sidebar.isOpen).toBe(true);
    });
    it("isOpen false against slide", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: false, type: 'Slide' }, ele);
        expect(sidebar.element.classList.contains('e-close')).toBe(true);
        expect(sidebar.isOpen).toBe(false);
    });
    it("isOpen true against slide", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: true, type: 'Slide' }, ele);
        expect(sidebar.element.classList.contains('e-open')).toBe(true);
        expect(sidebar.isOpen).toBe(true);
    });
    it("isOpen false against push", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: false, type: 'Push' }, ele);
        expect(sidebar.element.classList.contains('e-close')).toBe(true);
        expect(sidebar.isOpen).toBe(false);
    });
    it("isOpen true against push", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: true, type: 'Push' }, ele);
        expect(sidebar.element.classList.contains('e-open')).toBe(true);
        expect(sidebar.isOpen).toBe(true);
    });
    it("isOpen false against over", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: false, type: 'Push' }, ele);
        expect(sidebar.element.classList.contains('e-close')).toBe(true);
        expect(sidebar.isOpen).toBe(false);
    });
    it("isOpen true against over", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: true, type: 'Push' }, ele);
        expect(sidebar.element.classList.contains('e-open')).toBe(true);
        expect(sidebar.isOpen).toBe(true);
    });


    // IsOpen property against test cases in dock case
    it("isOpen false against auto in dock mode", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: false, type: 'Auto', enableDock: true, dockSize: '72px' }, ele);
        expect(sidebar.element.classList.contains('e-open')).toBe(true);
        expect(sidebar.isOpen).toBe(true);
    });
    it("isOpen true against auto in dock mode", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: true, type: 'Auto', enableDock: true, dockSize: '72px' }, ele);
        expect(sidebar.element.classList.contains('e-open')).toBe(true);
        expect(sidebar.isOpen).toBe(true);
    });
    it("isOpen false against slide in dock mode", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: false, type: 'Slide', enableDock: true, dockSize: '72px' }, ele);
        expect(sidebar.element.classList.contains('e-close')).toBe(true);
        expect(sidebar.isOpen).toBe(false);
    });
    it("isOpen true against slide in dock mode", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: true, type: 'Slide', enableDock: true, dockSize: '72px' }, ele);
        expect(sidebar.element.classList.contains('e-open')).toBe(true);
        expect(sidebar.isOpen).toBe(true);
    });
    it("isOpen false against push in dock mode", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: false, type: 'Push', enableDock: true, dockSize: '72px' }, ele);
        expect(sidebar.element.classList.contains('e-close')).toBe(true);
        expect(sidebar.isOpen).toBe(false);
    });
    it("isOpen true against push in dock mode", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: true, type: 'Push', enableDock: true, dockSize: '72px' }, ele);
        expect(sidebar.element.classList.contains('e-open')).toBe(true);
        expect(sidebar.isOpen).toBe(true);
    });
    it("isOpen false against over in dock mode", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: false, type: 'Push', enableDock: true, dockSize: '72px' }, ele);
        expect(sidebar.element.classList.contains('e-close')).toBe(true);
        expect(sidebar.isOpen).toBe(false);
    });
    it("isOpen true against over in dock mode", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ isOpen: true, type: 'Push', enableDock: true, dockSize: '72px' }, ele);
        expect(sidebar.element.classList.contains('e-open')).toBe(true);
        expect(sidebar.isOpen).toBe(true);
    });

    it("Sidebar closeOnDocumentClick onproperty change test", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ closeOnDocumentClick: false, type: 'Push' }, ele);
        sidebar.show();
        sidebar.closeOnDocumentClick = true;
        sidebar.dataBind();
        triggerMouseEvent(<HTMLElement>document.querySelector('.e-content-section'), 'mousedown');
        expect(sidebar.element.classList.contains('e-close')).toBe(true);
    });

    function triggerMouseEvent(node?: any, eventType?: any) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
    }

    it("Sidebar without dock size test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true }, ele);
        expect(ele.classList.contains("e-dock")).toEqual(true);
        expect(ele.classList.contains("e-open")).toEqual(true);
        expect(ele.classList.contains("e-close")).toEqual(false);
        expect(ele.style.width).toEqual("auto");
        expect(ele.style.transform).toBe("");
    });

    it("Sidebar with dock size(250px) default test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true, dockSize: "250px", width: '500px' }, ele);
        expect(ele.classList.contains("e-dock")).toEqual(true);
        expect(ele.classList.contains("e-open")).toEqual(true);
        expect(ele.classList.contains("e-close")).toEqual(false);
        expect(ele.style.width).toEqual("500px");
        expect(ele.style.transform).toBe("");
        expect(sidebar.isOpen).toBe(true);
    });

    it("Sidebar with dock size default test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true, dockSize: '300', width: '500px' }, ele);
        expect(ele.classList.contains("e-dock")).toEqual(true);
        expect(ele.classList.contains("e-open")).toEqual(true);
        expect(ele.classList.contains("e-close")).toEqual(false);
        expect(ele.style.width).toEqual("500px");
        expect(sidebar.isOpen).toBe(true);
    });

    it("Sidebar with dock size(250px) closed test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true, dockSize: "250px", width: '300px', isOpen: false }, ele);
        expect(ele.classList.contains("e-dock")).toEqual(true);
        expect(ele.classList.contains("e-open")).toEqual(true);
        expect(ele.classList.contains("e-close")).toEqual(false);
        expect(ele.style.width).toEqual("300px");
        expect(ele.style.transform).toBe("");
        expect(sidebar.isOpen).toBe(true);
    });

    it("Sidebar with dock size closed test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true, dockSize: '150', width: '300px', isOpen: false }, ele);
        expect(ele.classList.contains("e-dock")).toEqual(true);
        expect(ele.classList.contains("e-open")).toEqual(true);
        expect(ele.classList.contains("e-close")).toEqual(false);
        expect(ele.style.width).toEqual("300px");
        expect(sidebar.isOpen).toBe(true);
    });

    it("Sidebar with dock size slide test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true, dockSize: '300', type: 'Slide' }, ele);
        expect(ele.classList.contains("e-dock")).toEqual(true);
        expect(ele.classList.contains("e-open")).toEqual(false);
        expect(ele.classList.contains("e-close")).toEqual(true);
        expect(ele.style.width).toEqual("300px");
        expect(ele.style.transform).toBe("translateX(-100%) translateX(300px)");
        expect(sidebar.isOpen).toBe(false);
    });

    it("Sidebar with dock size push test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true, dockSize: '300', type: 'Push' }, ele);
        expect(ele.classList.contains("e-dock")).toEqual(true);
        expect(ele.classList.contains("e-open")).toEqual(false);
        expect(ele.classList.contains("e-close")).toEqual(true);
        expect(ele.style.width).toEqual("300px");
        expect(ele.style.transform).toBe("translateX(-100%) translateX(300px)");
        expect(sidebar.isOpen).toBe(false);
    });

    it("Sidebar with dock size over test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true, dockSize: '300', type: 'Over' }, ele);
        expect(ele.classList.contains("e-dock")).toEqual(true);
        expect(ele.classList.contains("e-open")).toEqual(false);
        expect(ele.classList.contains("e-close")).toEqual(true);
        expect(ele.style.width).toEqual("300px");
        expect(ele.style.transform).toBe("translateX(-100%) translateX(300px)");
        expect(sidebar.isOpen).toBe(false);
    });


    //mediaQuery test case
    it("Sidebar  with mediaQuery greater than 700px test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Push', mediaQuery: window.matchMedia('(min-width:700px)') }, ele);
        expect(ele.classList.contains("e-open")).toEqual(true);
    });

    it("Sidebar  with mediaQuery less than 400px test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Push', mediaQuery: '(max-width:400px)' }, ele);
        expect(ele.classList.contains("e-close")).toEqual(true);
    });
    it("Sidebar  with mediaQuery less than 400px test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Auto', mediaQuery: '(max-width:400px)' }, ele);
        expect(ele.classList.contains("e-close")).toEqual(false);
        sidebar.mediaQuery ='(min-width:700px)';
        sidebar.dataBind();
        expect(ele.classList.contains("e-open")).toEqual(true);
    });

    it("Sidebar  with on demand open propertytest case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Auto', mediaQuery: '(max-width:400px)' }, ele);
        //expect(ele.classList.contains("e-close")).toEqual(false);
        sidebar.isOpen = true;
        sidebar.dataBind();
        //expect(ele.classList.contains("e-open")).toEqual(true);
        sidebar.isOpen = false;
        sidebar.dataBind();
        //expect(ele.classList.contains("e-open")).toEqual(false);
        //expect(ele.classList.contains("e-close")).toEqual(true);
    });

    // position Testing
    it("Sidebar position:right Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Slide", position: "Right" }, ele);

        sidebar.show();
        // expect(new WebKitCSSMatrix(window.getComputedStyle(sibling).webkitTransform).m41 == -(ele.offsetWidth)).toEqual(true);
    });
    it("Sidebar position:right push type width Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", position: "Right" }, ele);
        sidebar.show();
    });
    it("Sidebar position:right over type width Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Over", position: "Right" }, ele);
        sidebar.show();
        expect(document.body.clientWidth == sibling.clientWidth).toEqual(true);
    });

    it("Sidebar position:right inital open Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;

        sidebar = new Sidebar({ type: "Push", position: "Right" }, ele);
        expect(ele.classList.contains("e-close")).toEqual(true);
    });

    it("Sidebar position:right && openOnInit with slide type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Slide", position: "Right" }, ele);
        expect(ele.classList.contains("e-close")).toEqual(true);
    });
    it("Sidebar position:right && openOnInit , push type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", position: "Right" }, ele);
        expect(ele.classList.contains("e-close")).toEqual(true);
    });
    it("Sidebar position:right && openOnInit and over type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Over", position: "Right" }, ele);
        expect(ele.classList.contains("e-close")).toEqual(true);
        expect(document.body.clientWidth == sibling.clientWidth).toEqual(true);
    });
    //context property test case
    it("Sidebar context propert test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", position: "Right", target: <HTMLElement>document.querySelector('.e-context-element') }, ele);
        expect(document.querySelectorAll('.e-context-element .e-sidebar')[0].classList.contains('e-sidebar')).toBe(true);
        expect(document.querySelectorAll('.e-context-element')[0].classList.contains('e-sidebar-context')).toBe(true);
        expect(document.querySelectorAll('.e-context-element .e-sidebar')[0].classList.contains('e-sidebar-absolute')).toBe(true);
        expect((<HTMLElement>document.getElementById('sidebar').nextElementSibling).classList.contains('e-content-animation')).toBe(true);
        sidebar.show();
        expect((<HTMLElement>document.getElementById('sidebar').nextElementSibling).style.transform).toBe('translateX(0px)');
        expect((<HTMLElement>document.getElementById('sidebar').nextElementSibling).style.marginRight).toBe((<HTMLElement>document.getElementById('sidebar').nextElementSibling).style.marginRight);
        sidebar.hide();
        expect((<HTMLElement>document.getElementById('sidebar').nextElementSibling).style.transform).toBe('translateX(0px)');
        expect((<HTMLElement>document.getElementById('sidebar').nextElementSibling).style.marginRight).toBe('0px');
    });

    //context property test case
    it("Sidebar context with backdrop propert test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", position: "Right", target: <HTMLElement>document.querySelector('.e-context-element'), showBackdrop: true }, ele);
        expect(document.querySelectorAll('.e-context-element .e-sidebar')[0].classList.contains('e-sidebar')).toBe(true);
        expect(document.querySelectorAll('.e-context-element')[0].classList.contains('e-sidebar-context')).toBe(true);
        expect(document.querySelectorAll('.e-context-element .e-sidebar')[0].classList.contains('e-sidebar-absolute')).toBe(true);
        sidebar.show();
        expect((<HTMLElement>document.getElementById('sidebar').nextElementSibling).style.transform).toBe('translateX(0px)');
        expect((<HTMLElement>document.getElementById('sidebar').nextElementSibling).style.marginRight).toBe((<HTMLElement>document.getElementById('sidebar').nextElementSibling).style.marginRight);
        expect((document.getElementById('sidebar').nextElementSibling.classList.contains('e-backdrop'))).toBe(false);
        sidebar.hide();
        expect((<HTMLElement>document.getElementById('sidebar').nextElementSibling).style.transform).toBe('translateX(0px)');
        expect((<HTMLElement>document.getElementById('sidebar').nextElementSibling).style.marginRight).toBe('0px');
        expect((document.getElementById('sidebar').nextElementSibling.classList.contains('e-backdrop'))).toBe(false);

    });

    //BACKDROP
    it("Sidebar backdrop testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", showBackdrop: true }, ele);
        expect(sibling.classList.contains('e-overlay')).toEqual(false);
        sidebar.hide();
        expect(sibling.classList.contains('e-overlay')).toEqual(false);
        sidebar.show();
        expect((<HTMLElement>document.querySelector('.e-sidebar-overlay')).style.display).toEqual('block');
        expect(((<HTMLElement>document.querySelector('.e-sidebar-overlay')).classList.contains('e-sidebar-overlay'))).toBe(true);
        //onproperty changes
        sidebar.showBackdrop = false;
        sidebar.dataBind();
        sidebar.show();
        expect(sibling.classList.contains('e-overlay')).toEqual(false);
        sidebar.hide();
        expect(sibling.classList.contains('e-overlay')).toEqual(false);
        sidebar.show();
        sidebar.showBackdrop = true;
        sidebar.dataBind();
        expect((<HTMLElement>document.querySelector('.e-sidebar-overlay')).style.display).toEqual('block');
        sidebar.show();
        expect((<HTMLElement>document.querySelector('.e-sidebar-overlay')).style.display).toEqual('block');
        sidebar.hide();
        expect(sibling.classList.contains('e-overlay')).toEqual(false);
    });

    it("Sidebar backdrop with auto type test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", showBackdrop: true }, ele);
        expect(sibling.classList.contains('e-overlay')).toEqual(false);
        sidebar.show();
        expect((<HTMLElement>document.querySelector('.e-sidebar-overlay')).style.display).toEqual('block');
        sidebar.hide();
        expect(document.querySelector('.e-sidebar-overlay')).toBe(null);
        sidebar.type = 'Auto';
        sidebar.dataBind();
        expect((<HTMLElement>document.querySelector('.e-sidebar-overlay')).style.display).toEqual('block');
        sidebar.hide();
        expect(document.querySelector('.e-sidebar-overlay')).toBe(null);
    });

    //persisitence test case
    it("Sidebar persisitence test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Slide", enablePersistence: true }, ele);
        //onproperty change      
        sidebar.type = "Over"
        sidebar.dataBind();
        sidebar.destroy();
        sidebar = new Sidebar({ enablePersistence: true }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-over')).toBe(true);
    });

    // enableDock onproperty changes test case
    it("Sidebar zindex property test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Over', zIndex: '300' }, ele);
        sidebar.enableDock = true;
        sidebar.dataBind();
        expect(sidebar.enableDock).toEqual(true);
    })

    // zindex property test case
    it("Sidebar zindex property test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Over', zIndex: '300' }, ele);
        sidebar.show();
        expect(ele.classList.contains("e-open") && sidebar.getState()).toEqual(true);
        expect(document.getElementById('sidebar').style.zIndex).toEqual('300');
        sidebar.type = "Push";
        sidebar.dataBind();
        expect(document.getElementById('sidebar').style.zIndex).toEqual('300');
        //onproperty change test case
        sidebar.zIndex = '100';
        sidebar.dataBind();
        expect(document.getElementById('sidebar').style.zIndex).toEqual('100');

    })
    // show method testing
    it("Sidebar show with show testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;

        sidebar = new Sidebar({}, ele);
        sidebar.show();
        expect(ele.classList.contains("e-open") && sidebar.getState()).toEqual(true);
    });
    // hide method testing
    it("Sidebar hide method testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({}, ele);
        sidebar.hide();
        expect(ele.classList.contains("e-close") && !sidebar.getState()).toEqual(true);
    });

    //toggle testing
    it("Sidebar hide method testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Push' }, ele);
        sidebar.toggle()
        expect(ele.classList.contains("e-open") && sidebar.getState()).toEqual(true);
    });


    it("Sidebar hide method testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Auto' }, ele);
        sidebar.toggle();
        expect(ele.classList.contains("e-close") && !sidebar.getState()).toEqual(true);
        sidebar.toggle();
        expect(ele.classList.contains("e-open") && sidebar.getState()).toEqual(true);
        sidebar.toggle();
        expect(ele.classList.contains("e-close") && !sidebar.getState()).toEqual(true);

    });

    //toggle testing
    it("Sidebar hide method testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({}, ele);
        sidebar.toggle();
        expect(ele.classList.contains("e-close") && !sidebar.getState()).toEqual(true);
    });

    it("Sidebar hide method testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({}, ele);
        sidebar.show();
        sidebar.toggle();
        expect(ele.classList.contains("e-close") && !sidebar.getState()).toEqual(true);
    });

    it("Sidebar hide method testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Push' }, ele);
        sidebar.toggle();
        expect(ele.classList.contains("e-open")).toEqual(true);
    });
    // getState testing

    it("Sidebar getState with show testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;

        sidebar = new Sidebar({}, ele);
        sidebar.show();
        expect(ele.classList.contains("e-open") && sidebar.getState()).toEqual(true);
    });

    it("Sidebar getState with hide testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;

        sidebar = new Sidebar({}, ele);
        sidebar.hide();
        expect(!ele.classList.contains("e-open") && !sidebar.getState()).toEqual(true);
    });
    // open on init with auto close option 

    it("Sidebar getState with hide testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;

        // sidebar = new Sidebar({ mediaQuery:null},ele);
        expect(!ele.classList.contains("e-open") && !sidebar.getState()).toEqual(true);
    });
    it("Sidebar getState with mediaQuery null testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;

        sidebar = new Sidebar({ mediaQuery: null, type: 'Push' }, ele);
        expect(ele.classList.contains("e-close")).toEqual(true);
    });
    it("Sidebar getState with mediaQuery 500 to 800 string testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        let ac: string = '(min-width:500px) and (max-width:1300px)';
        sidebar = new Sidebar({ mediaQuery: ac, type: 'Push' }, ele);
        expect(ele.classList.contains("e-open")).toEqual(true);
    });
    it("Sidebar getState with mediaQuery list 500 to 800 string testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        let ac:MediaQueryList = window.matchMedia('(min-width:500px) and (max-width:1300px)');
        sidebar = new Sidebar({ mediaQuery: ac, type: 'Push' }, ele);
        expect(ele.classList.contains("e-open")).toEqual(true);
    });
    it("Sidebar getState with mediaQuery screen size testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;

        let ac: string = '(min-width:' + (screen.width - 100) + 'px) and (max-width:' + (screen.width + 100) + 'px)';
        // sidebar = new Sidebar({ mediaQuery:ac},ele);
        expect(ele.classList.contains("e-close")).toEqual(false);
    });
    it("Sidebar getState with mediaQuery maximum testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;

        let ac: string = '(min-width:' + (screen.width + 100) + 'px) and (max-width:' + (screen.width + 500) + 'px)';
        // sidebar = new Sidebar({ mediaQuery:ac},ele);
        // expect(ele.classList.contains("e-close")).toEqual(true);
    });
    // set model

    it("Sidebar  with dynamic type slide Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Slide' }, ele);
        // sidebar.type = 'Slide';
        // expect(document.body.scrollWidth == document.body.clientWidth).toEqual(false);
    });
    it("Sidebar  with dynamic type push testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({}, ele);
        sidebar.type = 'Push';
        sidebar.dataBind();
        // expect(document.body.clientWidth == sibling.clientWidth && window.getComputedStyle(sibling).getPropertyValue('padding-left') == window.getComputedStyle(ele).width).toEqual(true);
    });
    it("Sidebar dynamic over type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", }, ele);
        // expect(document.body.clientWidth == sibling.clientWidth && window.getComputedStyle(sibling).getPropertyValue('padding-left') == window.getComputedStyle(ele).width).toEqual(true);
        sidebar.type = 'Over';
        sidebar.dataBind();
        // expect(document.body.clientWidth == sibling.clientWidth).toEqual(true);
    });
    // closeOnDocumentClick property test case
    it("Sidebar closeOnDocumentClick Testing", () => {
        let sidebar: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ }
        };

        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", closeOnDocumentClick: true }, ele);
        sidebar.documentclickHandler(mouseEventArgs);
        expect(ele.classList.contains("e-close")).toEqual(true);
    });
    // enableDock property test case
    it("Sidebar push type with dock type test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", enableDock: true, dockSize: 300 }, ele);
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(-100%) translateX(300px)");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("300px");
    });
    it("without docksize with right position property test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true, width: "auto", position: 'Right' }, ele);
        expect(document.getElementById('sidebar').style.width).toEqual('auto');
        sidebar.show();
        sidebar.setTimeOut();
        sidebar.hide();
        sidebar.setTimeOut();
    });

    it("without docksize with right position property test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true, width: "auto" }, ele);
        expect(document.getElementById('sidebar').style.width).toEqual('auto');
        sidebar.show();
        sidebar.setTimeOut();
        sidebar.hide();
        sidebar.setTimeOut();
    })

    // open event test case
    it("Sidebar open event test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({
            type: "Push", open: function (args: any) {
                expect(args.name).toBe("open");
                expect(args.isInteracted).toBe(false);
                expect(args.event).toBe(null);
            }
        }, ele);
        sidebar.show();
    });
    // close event test case
    it("Sidebar close event test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({
            type: "Push", close: function (args: any) {
                expect(args.name).toBe("close");
                expect(args.isInteracted).toBe(false);
                expect(args.event).toBe(null);
            }
        }, ele);
        sidebar.hide();
    });

    // change event test case
    it("Sidebar change event test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({
            type: "Push", change: function (args: any) {
                expect(args.name).toBe("change");
            }
        }, ele);
        sidebar.show();
    });

    it("Sidebar slide type with dock type test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Slide", enableDock: true, dockSize: 300, width: "300px" }, ele);
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(-100%) translateX(300px)");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        sidebar.show();
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(300px)");
        expect(document.getElementById('sidebar').classList.contains('e-slide')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-left')).toBe(true);
    });

     //Spec for dynamically changing the type property
     it("Setting spell mistake type on on property change", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        sidebar = new Sidebar({
            change: function (args: any) {
                expect(args.name).toBe("change");
            }
        }, ele);
        sidebar.type= "Slide";
        sidebar.dataBind();
        expect(sidebar.element.classList.contains('e-slide')).toBe(true);
        sidebar.type= "abc";
        sidebar.dataBind();
        expect(sidebar.element.classList.contains('e-push')).toBe(true);
        sidebar.type= "Auto";
        sidebar.dataBind();
        expect(sidebar.element.classList.contains('e-push')).toBe(true);
        sidebar.type= "Over";
        sidebar.dataBind();
        expect(sidebar.element.classList.contains('e-over')).toBe(true);
    });

    it("Sidebar over type with dock type test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Over", enableDock: true, dockSize: 300, width: '300px' }, ele);
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(-100%) translateX(300px)");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("300px");
        sidebar.show();
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        expect(document.getElementById('sidebar').classList.contains('e-over')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-left')).toBe(true);
    });

    it("Sidebar with 'Push' type , 'Left' position and dock enabled test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", enableDock: true, dockSize: 200, width: '300px' }, ele);
        sidebar.show();
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.hide();
        sidebar.transitionEnd();
        expect(document.getElementById('sidebar').style.width).toEqual('200px');
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(-100%) translateX(200px)");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("200px");
        expect(document.getElementById('sidebar').classList.contains('e-push')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-left')).toBe(true);
    });

    it("Sidebar with 'Push' type , 'Right' position and dock enabled test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", enableDock: true, position: 'Right', dockSize: 200, width: '300px' }, ele);
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(100%) translateX(-200px)");
        expect(document.getElementById('sidebar').style.width).toEqual("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.show();
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.hide();
        sidebar.transitionEnd();
        expect(document.getElementById('sidebar').style.width).toEqual('200px');
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(100%) translateX(-200px)");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("200px");
        expect(document.getElementById('sidebar').classList.contains('e-push')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-right')).toBe(true);
    });

    it("Sidebar with 'Slide' type , 'Left' position and dock enabled test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Slide", enableDock: true, dockSize: 300, width: '300px' }, ele);
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(-100%) translateX(300px)");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(300px)");
        sidebar.show();
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(300px)");
        sidebar.hide();
        sidebar.transitionEnd();
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(-100%) translateX(300px)");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(300px)");
        expect(document.getElementById('sidebar').classList.contains('e-slide')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-left')).toBe(true);
    });
    it("Sidebar with  'Slide' type , 'Right' position and dock enabled test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Slide", enableDock: true, dockSize: 200, width: '300px', position: "Right" }, ele);
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(100%) translateX(-200px)");
        expect(document.getElementById('sidebar').style.width).toEqual("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(-200px)");
        sidebar.show();
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(-300px)");
        sidebar.hide();
        sidebar.transitionEnd();
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(100%) translateX(-200px)");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(-200px)");
        expect(document.getElementById('sidebar').classList.contains('e-slide')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-right')).toBe(true);
    });

    it("Sidebar with  'Over' type , 'Left' position and dock enabled test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Over", enableDock: true, dockSize: 200, width: '300px' }, ele);
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(-100%) translateX(200px)");
        expect(document.getElementById('sidebar').style.width).toEqual("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.show();
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.hide();
        sidebar.transitionEnd()
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(-100%) translateX(200px)");
        expect(document.getElementById('sidebar').style.width).toEqual("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        expect(document.getElementById('sidebar').classList.contains('e-over')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-left')).toBe(true);
    });

    it("Sidebar with  'Over' type , 'Right' position and dock enabled test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Over", enableDock: true, dockSize: 200, width: '300px', position: 'Right' }, ele);
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(100%) translateX(-200px)");
        expect(document.getElementById('sidebar').style.width).toEqual("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.show();
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.hide();
        sidebar.transitionEnd();
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(100%) translateX(-200px)");
        expect(document.getElementById('sidebar').style.width).toEqual("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("200px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        expect(document.getElementById('sidebar').classList.contains('e-over')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-right')).toBe(true);
    });
    function slidetypeLeftpositionShow(): void {
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(300px)");
    }
    function slidetypeLeftpositionHide(): void {
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
    }

    function pushtypeLeftpositionShow(): void {
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
    }

    function pushtypeLeftpositionHide(): void {
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
    }
    it("Sidebar push type with left position test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", position: "Left", width: "300px" }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-left')).toEqual(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        pushtypeLeftpositionShow();
        sidebar.hide();
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        pushtypeLeftpositionHide();
        //onproperty change
        sidebar.type = "Slide";
        sidebar.dataBind();
        expect(document.getElementById('sidebar').classList.contains('e-left')).toEqual(true);
        expect(document.getElementById('sidebar').classList.contains('e-slide')).toBe(true);
        sidebar.show();
        slidetypeLeftpositionShow();
        sidebar.hide();
        slidetypeLeftpositionHide();
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
    });
    it("Sidebar push type with right position test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", position: "Right", width: "300px" }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-right')).toEqual(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.hide();
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        //onproperty change
        sidebar.type = "Slide";
        sidebar.dataBind();
        sidebar.show();
        slidetypeRightpositionShow();
        sidebar.hide();
        slidetypeRightpositionHide();
    });

    it("Sidebar slide type with left position test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Slide", position: "Left", width: "300px" }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-left')).toEqual(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        slidetypeLeftpositionShow();
        sidebar.hide();
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        slidetypeLeftpositionHide();
    });

    function slidetypeRightpositionShow(): void {
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(-300px)");
    }

    function slidetypeRightpositionHide(): void {
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
    }
    it("Sidebar slide type with right position test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Slide", position: "Right", width: "300px" }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-right')).toEqual(true);
        sidebar.show();
        slidetypeRightpositionShow();
        sidebar.hide();
        slidetypeRightpositionHide();
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
    });
    function overtypeRightpositionShow(): void {
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
    }
    function overtypeRightpositionHide(): void {
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
    }

    function overtypeLeftpositionShow(): void {
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
    }
    function overtypeLeftpositionHide(): void {
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
    }
    it("Sidebar over type with left position test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Over", position: "Left", width: "300px" }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-left')).toEqual(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        overtypeLeftpositionShow();
        sidebar.hide();
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        overtypeLeftpositionHide();
        //onproperty change
        sidebar.type = "Slide";
        sidebar.dataBind();
        sidebar.show();
        slidetypeLeftpositionShow();
        sidebar.hide();
        slidetypeLeftpositionHide();
    });

    it("Sidebar over type with right position test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Over", position: "Right", width: "300px" }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-right')).toEqual(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        overtypeRightpositionShow();
        sidebar.hide();
        overtypeRightpositionHide();
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        //onproperty changes
        sidebar.position = "Left";
        sidebar.dataBind();
        sidebar.show();
        overtypeLeftpositionShow();
        sidebar.hide();
        overtypeLeftpositionHide();
        //onproperty changes
        sidebar.position = "Right";
        sidebar.dataBind();
        sidebar.show();
        overtypeRightpositionShow();
        sidebar.hide();
        overtypeRightpositionHide();
    });

    describe("Sidebar auto type in mobile test case ", () => {
        let sidebar: any;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            let sibin: HTMLElement = document.createElement("div");
            ele.innerHTML = "<h3>Testing of Sidebar</h3>";
            sibin.innerHTML = "Side bar";
            sibin.className = 'e-content-section';
            ele.id = "sidebar";
            ele.style.width = "300px";
            ele.style.height = "100%";
            document.body.style.margin = "0px";
            let div: any = document.createElement('div');
            let span: any = document.createElement('span');
            div.className = 'e-context-element';
            div.appendChild(span);
            document.body.appendChild(div);
            document.body.appendChild(ele);
            document.body.appendChild(sibin);
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;

        });
        afterEach((): void => {
            if (sidebar) {
                sidebar.destroy();
            }
            document.body.innerHTML = "";
            let androidPhoneUa: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36';
            Browser.userAgent = androidPhoneUa;

        });
        it("Sidebar type auto with left position test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ type: "Auto", position: "Left", width: "300px" }, ele);
            expect(document.getElementById('sidebar').classList.contains('e-over')).toBe(true);
            sidebar.resize();
        });

        it("Sidebar type auto with enable dock test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            sidebar = new Sidebar({ type: 'Auto', enableDock: true }, ele);
            expect(sidebar.position == 'Left').toEqual(true);
            expect(isNullOrUndefined(document.getElementById('sidebar'))).toEqual(false);
            expect(isNullOrUndefined(sidebar.height)).toEqual(false);
            expect(isNullOrUndefined(sidebar.width)).toEqual(false);
            expect(isNullOrUndefined(sidebar.showBackdrop)).toEqual(false);
        });

        it("Sidebar type slide with overflow-x hidden class test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            sidebar = new Sidebar({ type: 'Slide' }, ele);
            sidebar.show();
            expect(document.body.classList.contains('e-sidebar-overflow')).toBe(true);
            sidebar.hide();
            expect(document.body.classList.contains('e-sidebar-overflow')).toBe(false);
        });

        it("Sidebar type auto in mobile  test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            sidebar = new Sidebar({ type: 'Auto', enableDock: true, dockSize: '300px' }, ele);
            expect(sidebar.position == 'Left').toEqual(true);
            expect(isNullOrUndefined(document.getElementById('sidebar'))).toEqual(false);
            expect(isNullOrUndefined(sidebar.height)).toEqual(false);
            expect(isNullOrUndefined(sidebar.width)).toEqual(false);
            expect(isNullOrUndefined(sidebar.showBackdrop)).toEqual(false);
            expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("300px");
            sidebar.show();
            expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("300px");
            sidebar.hide();
            expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("300px");
        });
        it("Sidebar default destroy test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            sidebar = new Sidebar({}, ele);
            sidebar.destroy();
            expect(sidebar.element.classList.length).toBe(0);
        });
        it("Sidebar target destroy test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            sidebar = new Sidebar({ target: <HTMLElement>document.querySelector('.e-context-element') }, ele);
            sidebar.destroy();
            expect(sidebar.element.classList.length).toBe(0);
        });

        // IsOpen property against test cases in normal case
        it("isOpen false against auto", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: false, type: 'Auto' }, ele);
            expect(sidebar.element.classList.contains('e-close')).toBe(true);
            expect(sidebar.isOpen).toBe(false);
        });
        it("isOpen true against auto", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: true, type: 'Auto' }, ele);
            expect(sidebar.element.classList.contains('e-open')).toBe(true);
            expect(sidebar.isOpen).toBe(true);
        });
        it("isOpen false against slide", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: false, type: 'Slide' }, ele);
            expect(sidebar.element.classList.contains('e-close')).toBe(true);
            expect(sidebar.isOpen).toBe(false);
        });
        it("isOpen true against slide", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: true, type: 'Slide' }, ele);
            expect(sidebar.element.classList.contains('e-open')).toBe(true);
            expect(sidebar.isOpen).toBe(true);
        });
        it("isOpen false against push", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: false, type: 'Push' }, ele);
            expect(sidebar.element.classList.contains('e-close')).toBe(true);
            expect(sidebar.isOpen).toBe(false);
        });
        it("isOpen true against push", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: true, type: 'Push' }, ele);
            expect(sidebar.element.classList.contains('e-open')).toBe(true);
            expect(sidebar.isOpen).toBe(true);
        });
        it("isOpen false against over", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: false, type: 'Push' }, ele);
            expect(sidebar.element.classList.contains('e-close')).toBe(true);
            expect(sidebar.isOpen).toBe(false);
        });
        it("isOpen true against over", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: true, type: 'Push' }, ele);
            expect(sidebar.element.classList.contains('e-open')).toBe(true);
            expect(sidebar.isOpen).toBe(true);
        });

        // IsOpen property against test cases in dock case
        it("isOpen false against auto in dock mode", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: false, type: 'Auto', enableDock: true, dockSize: '72px' }, ele);
            expect(sidebar.element.classList.contains('e-close')).toBe(true);
            expect(sidebar.isOpen).toBe(false);
        });
        it("isOpen true against auto in dock mode", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: true, type: 'Auto', enableDock: true, dockSize: '72px' }, ele);
            expect(sidebar.element.classList.contains('e-open')).toBe(true);
            expect(sidebar.isOpen).toBe(true);
        });
        it("isOpen false against slide in dock mode", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: false, type: 'Slide', enableDock: true, dockSize: '72px' }, ele);
            expect(sidebar.element.classList.contains('e-close')).toBe(true);
            expect(sidebar.isOpen).toBe(false);
        });
        it("isOpen true against slide in dock mode", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: true, type: 'Slide', enableDock: true, dockSize: '72px' }, ele);
            expect(sidebar.element.classList.contains('e-open')).toBe(true);
            expect(sidebar.isOpen).toBe(true);
        });
        it("isOpen false against push in dock mode", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: false, type: 'Push', enableDock: true, dockSize: '72px' }, ele);
            expect(sidebar.element.classList.contains('e-close')).toBe(true);
            expect(sidebar.isOpen).toBe(false);
        });
        it("isOpen true against push in dock mode", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: true, type: 'Push', enableDock: true, dockSize: '72px' }, ele);
            expect(sidebar.element.classList.contains('e-open')).toBe(true);
            expect(sidebar.isOpen).toBe(true);
        });
        it("isOpen false against over in dock mode", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: false, type: 'Push', enableDock: true, dockSize: '72px' }, ele);
            expect(sidebar.element.classList.contains('e-close')).toBe(true);
            expect(sidebar.isOpen).toBe(false);
        });
        it("isOpen true against over in dock mode", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: true, type: 'Push', enableDock: true, dockSize: '72px' }, ele);
            expect(sidebar.element.classList.contains('e-open')).toBe(true);
            expect(sidebar.isOpen).toBe(true);
        });

        it("Sidebar with dock size slide test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ enableDock: true, dockSize: '300' }, ele);
            expect(ele.classList.contains("e-dock")).toEqual(true);
            expect(ele.classList.contains("e-open")).toEqual(false);
            expect(ele.classList.contains("e-close")).toEqual(true);
            expect(ele.style.width).toEqual("300px");
            expect(sidebar.isOpen).toBe(false);
        });

        it("Sidebar with dock size slide test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ enableDock: true, dockSize: '300', type: 'Slide' }, ele);
            expect(ele.classList.contains("e-dock")).toEqual(true);
            expect(ele.classList.contains("e-open")).toEqual(false);
            expect(ele.classList.contains("e-close")).toEqual(true);
            expect(ele.style.width).toEqual("300px");
            expect(sidebar.isOpen).toBe(false);
        });

        it("Sidebar with dock size push test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ enableDock: true, dockSize: '300', type: 'Push' }, ele);
            expect(ele.classList.contains("e-dock")).toEqual(true);
            expect(ele.classList.contains("e-open")).toEqual(false);
            expect(ele.classList.contains("e-close")).toEqual(true);
            expect(ele.style.width).toEqual("300px");
            expect(sidebar.isOpen).toBe(false);
        });

        it("Sidebar with dock size over test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ enableDock: true, dockSize: '300', type: 'Over' }, ele);
            expect(ele.classList.contains("e-dock")).toEqual(true);
            expect(ele.classList.contains("e-open")).toEqual(false);
            expect(ele.classList.contains("e-close")).toEqual(true);
            expect(ele.style.width).toEqual("300px");
            expect(sidebar.isOpen).toBe(false);
        });


        it("Sidebar with dock size test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ enableDock: true, dockSize: '300', isOpen: true, width: '500px' }, ele);
            expect(ele.classList.contains("e-dock")).toEqual(true);
            expect(ele.classList.contains("e-open")).toEqual(true);
            expect(ele.classList.contains("e-close")).toEqual(false);
            expect(ele.style.width).toEqual("500px");
            expect(sidebar.isOpen).toBe(true);
        });

        it("Sidebar with dock size slide test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ enableDock: true, dockSize: '300', type: 'Slide', isOpen: true, width: '500px' }, ele);
            expect(ele.classList.contains("e-dock")).toEqual(true);
            expect(ele.classList.contains("e-open")).toEqual(true);
            expect(ele.classList.contains("e-close")).toEqual(false);
            expect(ele.style.width).toEqual("500px");
            expect(sidebar.isOpen).toBe(true);
        });

        it("Sidebar with dock size push test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ enableDock: true, dockSize: '300', type: 'Push', isOpen: true, width: '500px' }, ele);
            expect(ele.classList.contains("e-dock")).toEqual(true);
            expect(ele.classList.contains("e-open")).toEqual(true);
            expect(ele.classList.contains("e-close")).toEqual(false);
            expect(ele.style.width).toEqual("500px");
            expect(sidebar.isOpen).toBe(true);
        });

        it("Sidebar with dock size over test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ enableDock: true, dockSize: '300', type: 'Over', isOpen: true, width: '500px' }, ele);
            expect(ele.classList.contains("e-dock")).toEqual(true);
            expect(ele.classList.contains("e-open")).toEqual(true);
            expect(ele.classList.contains("e-close")).toEqual(false);
            expect(ele.style.width).toEqual("500px");
            expect(sidebar.isOpen).toBe(true);
        });

        it("Sidebar target property onproperty change test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            sidebar = new Sidebar({}, ele);
            sidebar.target = <HTMLElement>document.querySelector('.e-context-element');
            sidebar.dataBind();
            expect(sidebar.element.parentElement.classList.contains('e-sidebar-context')).toBe(true);
            expect(sidebar.element.classList.contains('e-sidebar-absolute')).toBe(true);
            sidebar.target = null;
            sidebar.dataBind();
            expect(sidebar.element.parentElement.classList.contains('e-sidebar-context')).toBe(false);
            expect(sidebar.element.classList.contains('e-sidebar-absolute')).toBe(false);
        });
        it("Sidebar target  string type test case", () => {
            let ele: HTMLElement = document.getElementById("sidebar");
            sidebar = new Sidebar({}, ele);
            sidebar.target = '.e-context-element';
            sidebar.dataBind();
            expect(sidebar.element.parentElement.classList.contains('e-sidebar-context')).toBe(true);
            expect(sidebar.element.classList.contains('e-sidebar-absolute')).toBe(true);
            sidebar.target = null;
            sidebar.dataBind();
            expect(sidebar.element.parentElement.classList.contains('e-sidebar-context')).toBe(false);
            expect(sidebar.element.classList.contains('e-sidebar-absolute')).toBe(false);
        });
    });
});

describe('Null or undefined value testing', () => {
        let sidebar: any;
        beforeEach((): void => {
            const ele: HTMLElement = document.createElement('div');
            const sibin: HTMLElement = document.createElement('div');
            ele.innerHTML = '<h3>Testing of Sidebar</h3>';
            sibin.innerHTML = 'Side bar';
            sibin.className = 'e-content-section';
            ele.id = 'sidebar';
            ele.style.width = '300px';
            ele.style.height = '100%';
            document.body.style.margin = '0px';
            const div: any = document.createElement('div');
            const span: any = document.createElement('span');
            div.className = 'e-context-element';
            div.appendChild(span);
            document.body.appendChild(div);
            document.body.appendChild(ele);
            document.body.appendChild(sibin);
        });
        afterEach((): void => {
            if (sidebar) {
                sidebar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('dockSize', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ dockSize: null }, ele);
            expect(sidebar.dockSize).toBe(null);
            sidebar.destroy();
            sidebar = new Sidebar({ dockSize: undefined }, ele);
            expect(sidebar.dockSize).toBe('auto');
            sidebar.destroy();
        });
        it('enableDock', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ enableDock: null }, ele);
            expect(sidebar.enableDock).toBe(null);
            sidebar.destroy();
            sidebar = new Sidebar({ enableDock: undefined }, ele);
            expect(sidebar.enableDock).toBe(false);
            sidebar.destroy();
        });
        it('isOpen', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ isOpen: null }, ele);
            expect(sidebar.isOpen).toBe(true);
            sidebar.destroy();
            sidebar = new Sidebar({ isOpen: undefined }, ele);
            expect(sidebar.isOpen).toBe(true);
            sidebar.destroy();
        });
        it('type', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ type: null }, ele);
            expect(sidebar.type).toBe('Auto');
            sidebar.destroy();
            sidebar = new Sidebar({ type: undefined }, ele);
            expect(sidebar.type).toBe('Auto');
            sidebar.destroy();
        });
        it('position', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ position: null }, ele);
            expect(sidebar.position).toBe(null);
            sidebar.destroy();
            sidebar = new Sidebar({ position: undefined }, ele);
            expect(sidebar.position).toBe('Left');
            sidebar.destroy();
        });
        it('showBackdrop', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ showBackdrop: null }, ele);
            expect(sidebar.showBackdrop).toBe(null);
            sidebar.destroy();
            sidebar = new Sidebar({ showBackdrop: undefined }, ele);
            expect(sidebar.showBackdrop).toBe(false);
            sidebar.destroy();
        });
        it('width', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ width: null }, ele);
            expect(sidebar.width).toBe(null);
            sidebar.destroy();
            sidebar = new Sidebar({ width: undefined }, ele);
            expect(sidebar.width).toBe('auto');
            sidebar.destroy();
        });
        it('target', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ target: null }, ele);
            expect(sidebar.target).toBe(null);
            sidebar.destroy();
            sidebar = new Sidebar({ target: undefined }, ele);
            expect(sidebar.target).toBe(null);
            sidebar.destroy();
        });
        it('height', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ height: null }, ele);
            expect(sidebar.height).toBe(null);
            sidebar.destroy();
            sidebar = new Sidebar({ height: undefined }, ele);
            expect(sidebar.height).toBe('auto');
            sidebar.destroy();
        });
        it('zIndex', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ zIndex: null }, ele);
            expect(sidebar.zIndex).toBe(null);
            sidebar.destroy();
            sidebar = new Sidebar({ zIndex: undefined }, ele);
            expect(sidebar.zIndex).toBe(1000);
            sidebar.destroy();
        });
        it('closeOnDocumentClick', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ closeOnDocumentClick: null }, ele);
            expect(sidebar.closeOnDocumentClick).toBe(null);
            sidebar.destroy();
            sidebar = new Sidebar({ closeOnDocumentClick: undefined }, ele);
            expect(sidebar.closeOnDocumentClick).toBe(false);
            sidebar.destroy();
        });
        it('mediaQuery', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ mediaQuery: null }, ele);
            expect(sidebar.mediaQuery).toBe(null);
            sidebar.destroy();
            sidebar = new Sidebar({ mediaQuery: undefined }, ele);
            expect(sidebar.mediaQuery).toBe(null);
            sidebar.destroy();
        });
        it('enableGestures', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ enableGestures: null }, ele);
            expect(sidebar.enableGestures).toBe(null);
            sidebar.destroy();
            sidebar = new Sidebar({ enableGestures: undefined }, ele);
            expect(sidebar.enableGestures).toBe(true);
            sidebar.destroy();
        });
        it('enablePersistence', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ enablePersistence: null }, ele);
            expect(sidebar.enablePersistence).toBe(null);
            sidebar.destroy();
            sidebar = new Sidebar({ enablePersistence: undefined }, ele);
            expect(sidebar.enablePersistence).toBe(false);
            sidebar.destroy();
        });
        it('enableRtl', () => {
            const ele: HTMLElement = document.getElementById('sidebar');
            const sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
            sidebar = new Sidebar({ enableRtl: null }, ele);
            expect(sidebar.enableRtl).toBe(false);
            sidebar.destroy();
            sidebar = new Sidebar({ enableRtl: undefined }, ele);
            expect(sidebar.enableRtl).toBe(false);
            sidebar.destroy();
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
describe("Sidebar testing ", () => {
    let sidebar: any;
    let sidebar1: any;
    beforeEach((): void => {
        let ele: HTMLElement = document.createElement("div");
        let ele1: HTMLElement = document.createElement("div");
        let target: HTMLElement = document.createElement("div");
        let sibin: HTMLElement = document.createElement("div");
        ele.innerHTML = "<h3>Testing of Sidebar</h3>";
        ele1.innerHTML = "<h3>Testing of Sidebar1</h3>";
        sibin.innerHTML = "Side bar";
        sibin.className = "sibling";
        target.className = 'maincontent';
        ele.style.height = "300px";
        ele.id = "sidebar";
        ele1.id = "sidebar1";
        document.body.style.margin = "0px";
        target.appendChild(sibin);
        document.body.appendChild(ele);
        document.body.appendChild(ele1);
        document.body.appendChild(target);
    });
    afterEach((): void => {
        if (sidebar) {
            sidebar.destroy();
        }
        if (sidebar1) {
            sidebar1.destroy();
        }
        document.body.innerHTML = "";
    });
    it("two Sidebar with same target test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        sidebar = new Sidebar({ type: 'Push', target: '.maincontent', width: '250px' }, ele);
        let ele1: HTMLElement = document.getElementById("sidebar1");
        sidebar1 = new Sidebar({ type: 'Push', position: 'Right', target: '.maincontent', width: '300px' }, ele1);
        let aniEle: any = document.getElementsByClassName('e-content-animation');
        expect(aniEle.length).toBe(1);
        expect(aniEle[0].classList.contains('sibling')).toBe(true);
        expect(aniEle[0].style.marginLeft).toBe('0px');
        expect(aniEle[0].style.marginRight).toBe('0px');
        sidebar.show();
        sidebar1.show();
        let aniEle1: any = document.getElementsByClassName('e-content-animation');
        expect(aniEle1.length).toBe(1);
        expect(aniEle1[0].classList.contains('sibling')).toBe(true);
        expect(aniEle1[0].style.marginLeft).toBe('250px');
        expect(aniEle1[0].style.marginRight).toBe('300px');
    });
    it("two Sidebars with closeOnDocumentClick property", () => {
        let sidebar: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ }
        };
        let ele: HTMLElement = document.getElementById("sidebar");
        sidebar = new Sidebar({ type: "Auto", closeOnDocumentClick: true }, ele);
        let ele1: HTMLElement = document.getElementById("sidebar1");
        sidebar1 = new Sidebar({ type: 'Push', position: 'Right', target: '.maincontent', width: '300px' }, ele1);
        expect(sidebar.isOpen).toBe(true);
        sidebar.documentclickHandler(mouseEventArgs);
        expect(ele.classList.contains("e-close")).toEqual(true);
        expect(sidebar.isOpen).toBe(false);
        sidebar1.show();
        sidebar1.closeOnDocumentClick = true;
        expect(sidebar1.isOpen).toBe(true);
        sidebar1.documentclickHandler(mouseEventArgs);
        expect(ele1.classList.contains("e-close")).toEqual(true);
        expect(sidebar1.isOpen).toBe(false);
    });
});

describe("Sidebar enableGestures testing with SwipeEventArgs in the close event ", () => {
    let sidebar: any;
    beforeEach((): void => {
        let ele: HTMLElement = document.createElement("div");
        let sibin: HTMLElement = document.createElement("div");
        ele.innerHTML = "<h3>Testing of Sidebar</h3>"
        sibin.innerHTML = "Side bar";
        sibin.className = 'e-content-section';
        ele.id = "sidebar";
        ele.style.width = "300px";
        ele.style.height = "100%";
        document.body.style.margin = "0px";
        let div: any = document.createElement('div');
        let span: any = document.createElement('span');
        div.className = 'e-context-element';
        div.appendChild(span);
        document.body.appendChild(div);
        document.body.appendChild(ele);
        document.body.appendChild(sibin);
    });
    afterEach((): void => {
        if (sidebar) {
            sidebar.destroy();
        }
        document.body.innerHTML = "";
    });

    it("Performing a swipe in desktop mode", () => {
        let mouse: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ },
            swipeDirection: 'Left',
            startX: 20,
            distanceX: 60,
            velocity: 0.5,
            originalEvent: {
                isTrusted: true,
                altKey: false,
                button: 0,
                type: "mouseup"
            }
        };
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableGestures: true, type: 'Push', 
            close: function(args) {
                expect(args.event).not.toBe(null);
            }
        }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-touch')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        sidebar.enableGestureHandler(mouse);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
    });

});

describe("Sidebar enableGestures testing with SwipeEventArgs in the close event ", () => {
    let sidebar: any;
    beforeEach((): void => {
        let ele: HTMLElement = document.createElement("div");
        let sibin: HTMLElement = document.createElement("div");
        ele.innerHTML = "<h3>Testing of Sidebar</h3>";
        sibin.innerHTML = "Side bar";
        sibin.className = 'e-content-section';
        ele.id = "sidebar";
        ele.style.width = "300px";
        ele.style.height = "100%";
        document.body.style.margin = "0px";
        let div: any = document.createElement('div');
        let span: any = document.createElement('span');
        div.className = 'e-context-element';
        div.appendChild(span);
        document.body.appendChild(div);
        document.body.appendChild(ele);
        document.body.appendChild(sibin);
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        Browser.userAgent = androidPhoneUa;

    });
    afterEach((): void => {
        if (sidebar) {
            sidebar.destroy();
        }
        document.body.innerHTML = "";
        let androidPhoneUa: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36';
        Browser.userAgent = androidPhoneUa;

    });

    it("Performing a swipe in mobile mode", () => {
        let touch: any = {
            preventDefault: (): void => { /** NO Code */ },
            currentTarget: null,
            target: document.body,
            stopPropagation: (): void => { /** NO Code */ },
            swipeDirection: 'Left',
            startX: 20,
            distanceX: 60,
            velocity: 0.5,
            originalEvent: {
                isTrusted: true,
                altKey: false,
                button: 0,
                type: "touchend"
            }
        };
        let ele: HTMLElement = document.getElementById("sidebar");
        sidebar = new Sidebar({ enableGestures: true, type: "Auto",
            close: function(args) {
                expect(args.event).not.toBe(null);
            }
        }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-touch')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
        sidebar.show();
        expect(document.getElementById('sidebar').classList.contains('e-open')).toBe(true);
        sidebar.enableGestureHandler(touch);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
    });

});
