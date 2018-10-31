import {
    Component, EventHandler, Event, Property, setStyleAttribute, addClass, removeClass,
    isNullOrUndefined, EmitType, NotifyPropertyChanges, BaseEventArgs, INotifyPropertyChanged,
    Animation, AnimationModel, AnimationOptions, Browser
} from '@syncfusion/ej2-base';

import { Sidebar } from '../src/sidebar/sidebar';

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
        sidebar = new Sidebar({ type: 'Auto', mediaQuery: window.matchMedia(('min-width:1400px')) }, ele);
        expect(document.getElementById('sidebar').classList.contains('e-visibility')).toBe(false);
        expect(document.getElementById('sidebar').classList.contains('e-close')).toBe(true);
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
            swipeDirection: 'Left', startX: 20,
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
        sidebar.show();
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
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ closeOnDocumentClick: true, type: 'Push' }, ele);
        sidebar.show();
        triggerMouseEvent(<HTMLElement>document.querySelector('.e-content-section'), 'mousedown');
        expect(sidebar.element.classList.contains('e-close')).toBe(true);
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
        expect(ele.style.width).toEqual("auto");
        expect(ele.style.transform).toBe("");
    });

    it("Sidebar with dock size(250px) test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true, dockSize: "250px" }, ele);
        expect(ele.classList.contains("e-dock")).toEqual(true);
        expect(ele.style.width).toEqual("250px");
        expect(ele.style.transform).toBe("translateX(-100%) translateX(250px)");
    });

    it("Sidebar with dock size test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ enableDock: true, dockSize: '300' }, ele);
        expect(ele.classList.contains("e-dock")).toEqual(true);
        expect(ele.style.width).toEqual("300px");
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
        sidebar = new Sidebar({ type: 'Push', mediaQuery: window.matchMedia('(max-width:400px)') }, ele);
        expect(ele.classList.contains("e-close")).toEqual(true);
    });
    it("Sidebar  with mediaQuery less than 400px test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Auto', mediaQuery: window.matchMedia('(max-width:400px)') }, ele);
        expect(ele.classList.contains("e-close")).toEqual(true);
        sidebar.mediaQuery = window.matchMedia('(min-width:700px)');
        sidebar.dataBind();
        expect(ele.classList.contains("e-open")).toEqual(true);
    });

    it("Sidebar  with on demand open propertytest case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: 'Auto', mediaQuery: window.matchMedia('(max-width:400px)') }, ele);
        expect(ele.classList.contains("e-close")).toEqual(true);
        sidebar.isOpen = true;
        sidebar.dataBind();
        //expect(ele.classList.contains("e-open")).toEqual(true);
        sidebar.isOpen = false;
        sidebar.dataBind();
        expect(ele.classList.contains("e-open")).toEqual(false);
        expect(ele.classList.contains("e-close")).toEqual(true);
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
    });
    it("Sidebar position:right && openOnInit , push type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", position: "Right" }, ele);
    });
    it("Sidebar position:right && openOnInit and over type Testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Over", position: "Right" }, ele);
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
        expect((document.getElementById('sidebar').nextElementSibling.classList.contains('e-backdrop'))).toBe(true);
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
        let ac: MediaQueryList = window.matchMedia('(min-width:500px) and (max-width:1300px)');
        sidebar = new Sidebar({ mediaQuery: ac, type: 'Push' }, ele);
        expect(ele.classList.contains("e-open")).toEqual(true);
    });
    it("Sidebar getState with mediaQuery screen size testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;

        let ac: MediaQueryList = window.matchMedia('(min-width:' + (screen.width - 100) + 'px) and (max-width:' + (screen.width + 100) + 'px)');
        // sidebar = new Sidebar({ mediaQuery:ac},ele);
        expect(ele.classList.contains("e-close")).toEqual(false);
    });
    it("Sidebar getState with mediaQuery maximum testing", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;

        let ac: MediaQueryList = window.matchMedia('(min-width:' + (screen.width + 100) + 'px) and (max-width:' + (screen.width + 500) + 'px)');
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


    // open event test case
    it("Sidebar open event test case", () => {
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({
            type: "Push", open: function (args: any) {
                expect(args.name).toBe("open");
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
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        expect(document.getElementById('sidebar').classList.contains('e-over')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-left')).toBe(true);
    });

    it("Sidebar with 'Push' type , 'Left' position and dock enabled test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", enableDock: true, dockSize: 300, width: '300px' }, ele);
        sidebar.show();
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.hide();
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(-100%) translateX(300px)");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("300px");
        expect(document.getElementById('sidebar').classList.contains('e-push')).toBe(true);
        expect(document.getElementById('sidebar').classList.contains('e-left')).toBe(true);
    });

    it("Sidebar with 'Push' type , 'Right' position and dock enabled test case", () => {
        let sidebar: any;
        let ele: HTMLElement = document.getElementById("sidebar");
        let sibling: HTMLElement = <HTMLElement>ele.nextElementSibling;
        sidebar = new Sidebar({ type: "Push", enableDock: true, position: 'Right', dockSize: 300, width: '300px' }, ele);
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(100%) translateX(-300px)");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.show();
        expect(document.getElementById('sidebar').style.transform).toEqual("");
        expect(document.getElementById('sidebar').style.width).toEqual("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("300px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.hide();
        expect(document.getElementById('sidebar').style.width).toEqual('300px');
        expect(document.getElementById('sidebar').style.transform).toEqual("translateX(100%) translateX(-300px)");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("300px");
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
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginLeft).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.hide();
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
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.marginRight).toBe("0px");
        expect((<HTMLElement>document.querySelector('.e-content-section')).style.transform).toBe("translateX(0px)");
        sidebar.hide();
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
