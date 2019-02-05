import { Toast, ToastClickEventArgs, ToastOpenArgs, ToastBeforeOpenArgs } from "../../src/index";
import { isNullOrUndefined as isNOU, MouseEventArgs } from "@syncfusion/ej2-base";
import { isVisible, classList, TouchEventArgs, SwipeEventArgs, Browser } from "@syncfusion/ej2-base";

const ROOT: string = 'e-toast';
const ROOTCONTAINER: string = 'e-toast';
const WIDTHFULL: string = 'e-toast-full-width';
const CONTAINER: string = 'e-toast-container';
const TITLE: string = 'e-toast-title';
const CONTENT: string = 'e-toast-content';
const MESSAGE: string = 'e-toast-message';
const ICON: string = 'e-toast-icon';
const PROGRESS: string = 'e-toast-progress';
const ACTIOBUTTONS: string = 'e-toast-actions';
const CLOSEBTN: string = 'e-toast-close-icon';
const RTL: string = 'e-rtl';

// Testcase delay
const TIME_DELAY: number = 800;

//Positioning
const BOTTOMLEFT: string = 'e-toast-bottom-left';
const BOTTOMRIGHT: string = 'e-toast-bottom-right';
const BOTTOMCENTER: string = 'e-toast-bottom-center';
const TOPLEFT: string = 'e-toast-top-left';
const TOPRIGHT: string = 'e-toast-top-right';
const TOPCENTER: string = 'e-toast-top-center';

let iosChromeUa: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) ' +
    'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';

describe("Toast Testing", () => {
    let css: string = "";
    let style: HTMLStyleElement = document.createElement("style"); style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);

    function clone(obj: any): any {
        if (null == obj || "object" != typeof obj) { return obj; }
        let copy: any = obj.constructor();
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) { copy[attr] = obj[attr]; }
        }
        return copy;
    }
    describe("Toast Class Testing ", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            toast = new Toast({}, ele);
        });
        afterEach((): void => {
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast Base class testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.classList.contains(ROOTCONTAINER)).toEqual(true);
            expect(ele.classList.contains("e-control")).toEqual(true);
        });
    });
    describe("Toast default property testing ", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast property default value testing with constructor", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({ }, ele);
            toast.show();
            expect(toast.newestOnTop).toEqual(true);
            expect(toast.showCloseButton).toEqual(false);
            expect(toast.showProgressBar).toEqual(false);
            expect(toast.width).toEqual('300px');
            expect(toast.height).toEqual('auto');
            expect((<HTMLElement>ele.firstElementChild).style.width).toEqual('300px');
            expect((<HTMLElement>ele.firstElementChild).style.height).toEqual('auto');
            expect(toast.title).toEqual(null);
            expect(toast.content).toEqual(null);
            expect(toast.icon).toEqual(null);
            expect(toast.cssClass).toEqual(null);
            expect(toast.template).toEqual(null);
            expect(toast.buttons[0].model).toEqual(null);
            expect(toast.buttons[0].click).toEqual(null);
            expect(toast.buttons.length).toEqual(1);
            expect(toast.target).toEqual(document.body);
            expect(toast.animation.show.duration).toEqual(600);
            expect(toast.animation.show.easing).toEqual('ease');
            expect(toast.animation.show.effect).toEqual('FadeIn');
            expect(toast.animation.hide.duration).toEqual(600);
            expect(toast.animation.hide.easing).toEqual('ease');
            expect(toast.animation.hide.effect).toEqual('FadeOut');
            expect(toast.timeOut).toEqual(5000);
            expect(toast.extendedTimeout).toEqual(1000);
            expect(toast.position.X).toEqual('Left');
            expect(toast.position.Y).toEqual('Top');
            toast.hide();
        });
    });

    describe("Toast Title property testing ", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast property default value testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                title: 'Sample',
                timeOut: 0,
                newestOnTop: false,
            }, ele);
            toast.show();
            let toastEle: HTMLElement = ele.firstElementChild as HTMLElement;
            expect(toastEle.classList.contains(ROOT)).toEqual(true);
            expect(toastEle.firstElementChild.classList.contains(MESSAGE)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.classList.contains(TITLE)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.textContent).toEqual('Sample');
            toast.show();
            expect(ele.childElementCount).toBe(2);
            toastEle = ele.children[1] as HTMLElement;
            expect(toastEle.firstElementChild.classList.contains(MESSAGE)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.classList.contains(TITLE)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.textContent).toEqual('Sample');
            toast.show({ title: 'SampleToast' });
            expect(ele.childElementCount).toBe(3);
            toastEle = ele.children[2] as HTMLElement;
            expect(toastEle.firstElementChild.classList.contains(MESSAGE)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.classList.contains(TITLE)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.textContent).toEqual('SampleToast');
        });
    });

    describe("Toast Content property testing ", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast Content property default value testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                content: 'Sample_Content',
                timeOut: -1,
                newestOnTop: false,
            }, ele);
            toast.show();
            let toastEle: HTMLElement = ele.firstElementChild as HTMLElement;
            expect(toastEle.classList.contains(ROOT)).toEqual(true);
            expect(toastEle.firstElementChild.classList.contains(MESSAGE)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.classList.contains(CONTENT)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.textContent).toEqual('Sample_Content');
            toast.show();
            expect(ele.childElementCount).toBe(2);
            toastEle = ele.children[1] as HTMLElement;
            expect(toastEle.firstElementChild.classList.contains(MESSAGE)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.classList.contains(CONTENT)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.textContent).toEqual('Sample_Content');
            toast.show({ content: 'SampleToast' })
            expect(ele.childElementCount).toBe(3);
            toastEle = ele.children[2] as HTMLElement;
            expect(toastEle.firstElementChild.classList.contains(MESSAGE)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.classList.contains(CONTENT)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.textContent).toEqual('SampleToast');
        });
    });
    describe("Toast Title & Content property testing ", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast Title & Content property default value testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                title: 'Sample',
                content: 'Sample_Content',
                timeOut: 0,
                newestOnTop: false,
            }, ele);
            toast.show();
            let toastEle: HTMLElement = ele.firstElementChild as HTMLElement;
            expect(toastEle.classList.contains(ROOT)).toEqual(true);
            expect(toastEle.firstElementChild.classList.contains(MESSAGE)).toEqual(true);
            expect(toastEle.firstElementChild.childElementCount).toEqual(2);
            expect(toastEle.firstElementChild.firstElementChild.classList.contains(TITLE)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.textContent).toEqual('Sample');
            expect(toastEle.firstElementChild.children[0].classList.contains(TITLE)).toEqual(true);
            expect(toastEle.firstElementChild.children[1].textContent).toEqual('Sample_Content');
            toast.show();
            expect(ele.childElementCount).toBe(2);
            toastEle = ele.children[1] as HTMLElement;
            expect(toastEle.firstElementChild.classList.contains(MESSAGE)).toEqual(true);
            expect(toastEle.firstElementChild.childElementCount).toEqual(2);
            expect(toastEle.firstElementChild.firstElementChild.classList.contains(TITLE)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.textContent).toEqual('Sample');
            expect(toastEle.firstElementChild.children[0].classList.contains(TITLE)).toEqual(true);
            expect(toastEle.firstElementChild.children[1].textContent).toEqual('Sample_Content');
            toast.show({ title: 'sampleTitle', content: 'SampleToast_content' });
            expect(ele.childElementCount).toBe(3);
            toastEle = ele.children[2] as HTMLElement;
            expect(toastEle.firstElementChild.classList.contains(MESSAGE)).toEqual(true);
            expect(toastEle.firstElementChild.childElementCount).toEqual(2);
            expect(toastEle.firstElementChild.firstElementChild.classList.contains(TITLE)).toEqual(true);
            expect(toastEle.firstElementChild.firstElementChild.textContent).toEqual('sampleTitle');
            expect(toastEle.firstElementChild.children[0].classList.contains(TITLE)).toEqual(true);
            expect(toastEle.firstElementChild.children[1].textContent).toEqual('SampleToast_content');
        });
    });

    describe("Toast Icon property testing ", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast icon  value testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                icon: 'e-info',
                timeOut: 0
            }, ele);
            toast.show();
            let toastEle: HTMLElement = ele.firstElementChild as HTMLElement;
            expect(toastEle.childElementCount).toBe(1);
            let iconEle: HTMLElement = toastEle.firstElementChild as HTMLElement;
            expect(iconEle.classList.contains(ICON)).toBe(true);
            expect(iconEle.classList.contains('e-icons')).toBe(true);
        });
    });

    describe("Toast width and height property testing ", () => {
        let toast: Toast;
        let testCaseflowCount: number = 0;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((done: Function): void => {
            let ele: HTMLElement = document.getElementById("toast");
            if (toast) {
                toast.destroy();
            }
            if (testCaseflowCount === 1) {
            expect(ele.classList.contains(WIDTHFULL)).toBe(false);
            expect(ele.classList.contains(TOPLEFT)).toBe(false); }
            document.body.innerHTML = "";
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast width and height value testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                width: 100,
                height: 200,
                timeOut: 0,
                newestOnTop: false,
            }, ele);
            toast.show();
            expect((<HTMLElement>ele.firstElementChild).style.width).toBe('100px');
            expect((<HTMLElement>ele.firstElementChild).style.height).toBe('200px');
            toast.show({ width: 250, height: 100 });
            expect((<HTMLElement>ele.children[1]).style.width).toBe('250px');
            expect((<HTMLElement>ele.children[1]).style.height).toBe('100px');
        });
        it("Toast width and height value testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                width: '100%',
                height: 200,
                timeOut: 0,
                newestOnTop: false,
            }, ele);
            toast.show();
            expect(ele.classList.contains(WIDTHFULL)).toBe(true);
            toast.show({ width: 250});
            expect((<HTMLElement>ele.children[1]).style.width).toBe('250px');
            expect(ele.classList.contains(WIDTHFULL)).toBe(false);
        });
        it("Toast Full width testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                width: '100%',
                height: 200,
                timeOut: 0,
                position: {X: 'Left', Y: 'Top'}
            }, ele);
            toast.show();
            expect(ele.classList.contains(TOPLEFT)).toBe(true);
            expect(ele.classList.contains(WIDTHFULL)).toBe(true);
            testCaseflowCount = 1;
            toast.hide();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });

    describe("Toast Target property testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            let targetEle: HTMLElement = document.createElement("div");
            targetEle.id = 'toast_target';
            document.body.appendChild(targetEle);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            toast.show({ title: 'Sample_title', timeOut: 0, content: 'Sample_content', target: document.body });
            expect(ele.parentElement.tagName).toEqual('BODY');
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast Target value testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({}, ele);
            toast.show({ title: 'Sample_title', timeOut: 0, content: 'Sample_content', target: '#toast_target' });
            expect(ele.parentElement.tagName).toEqual('DIV');
            expect(ele.parentElement).toEqual(document.getElementById('toast_target'));
            toast.hide();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });

    describe("Toast Target property testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            let targetEle: HTMLElement = document.createElement("div");
            targetEle.id = 'toast_target';
            document.body.appendChild(targetEle);
        });
        afterEach((): void => {
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast Target empty value testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({}, ele);
            toast.show({ title: 'Sample_title', timeOut: 0, content: 'Sample_content', target: '#toast_targt' });
            expect(ele.childElementCount).toBe(0);
            toast.hide();
        });
    });

    describe("Toast CSSClass property testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast CSSClass property value testing",  () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                cssClass: 'e-info',
                timeOut: 0,
                newestOnTop: false,
            }, ele);
            toast.show();
            expect(ele.firstElementChild.classList.contains('e-info')).toEqual(true);
            expect(ele.firstElementChild.classList.contains('e-icons')).toEqual(false);
            toast.show({cssClass: 'e-success'});
            expect(ele.firstElementChild.classList.contains('e-info')).toEqual(true);
            expect(ele.firstElementChild.classList.contains('e-icons')).toEqual(false);
            expect(ele.children[1].classList.contains('e-success')).toEqual(true);
            expect(ele.children[1].classList.contains('e-icons')).toEqual(false);
            toast.show({cssClass: 'e-failure'});
            expect(ele.firstElementChild.classList.contains('e-info')).toEqual(true);
            expect(ele.children[1].classList.contains('e-success')).toEqual(true);
            expect(ele.children[2].classList.contains('e-failure')).toEqual(true);
            toast.show({cssClass: 'e-primary e-icons'});
            expect(ele.firstElementChild.classList.contains('e-info')).toEqual(true);
            expect(ele.children[1].classList.contains('e-success')).toEqual(true);
            expect(ele.children[2].classList.contains('e-failure')).toEqual(true);
            expect(ele.children[3].classList.contains('e-primary') && ele.children[3].classList.contains('e-icons')).toEqual(true);
            toast.show({cssClass: 'e-primary,e-icons'});
            expect(ele.children[4].classList.contains('e-primary') && ele.children[4].classList.contains('e-icons')).toEqual(true);
        });
    });
    describe("Toast ShowCloseButton property testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast ShowCloseButton property value testing",  () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                showCloseButton: true,
                timeOut: 0,
                newestOnTop: false,
            }, ele);
            toast.show();
            expect(ele.firstElementChild.lastElementChild.classList.contains(CLOSEBTN)).toBe(true);
            expect(ele.firstElementChild.lastElementChild.classList.contains('e-icons')).toBe(true);
            expect(ele.firstElementChild.childElementCount).toBe(1);
            toast.show({icon: 'e-icon', title: 'hello'});
            toast.show();
            expect(ele.children[1].children[2].classList.contains(CLOSEBTN)).toBe(true);
            expect(ele.children[1].childElementCount).toBe(3);
        });
    });
    describe("Toast ProgressBar property testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast ProgressBar property value testing",  () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                showProgressBar: true,
                newestOnTop: false,
            }, ele);
            toast.show();
            expect(ele.firstElementChild.firstElementChild.classList.contains(PROGRESS)).toBe(true);
            expect(ele.firstElementChild.childElementCount).toBe(1);
            toast.show({icon: 'e-icon', title: 'hello'});
            expect(ele.children[1].children[0].classList.contains(PROGRESS)).toBe(true);
            expect(ele.children[1].childElementCount).toBe(3);
            toast.show({timeOut: 0});
            expect(ele.children[2].children[0].classList.contains(PROGRESS)).toBe(false);
            expect(ele.children[2].childElementCount).toBe(2);
        });
    });
    describe("Toast NewestOnTop property testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast NewestOnTop property value testing",  () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({}, ele);
            toast.show();
            expect(ele.firstElementChild.childElementCount).toBe(0);
            toast.show({title: 'hello'});
            expect(ele.firstElementChild.childElementCount).toBe(1);
            toast.show({icon: 'e-info'});
            expect(ele.firstElementChild.childElementCount).toBe(2);
            expect(ele.firstElementChild.firstElementChild.classList.contains('e-info')).toBe(true);
            toast.show({icon: 'e-success', newestOnTop: false});
            expect(ele.firstElementChild.firstElementChild.classList.contains('e-info')).toBe(true);
            expect(ele.lastElementChild.firstElementChild.classList.contains('e-success')).toBe(true);
            expect(ele.firstElementChild.childElementCount).toBe(2);
            expect(ele.children[3].childElementCount).toBe(2);
        });
    });
    describe("Toast Position property testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            document.body.innerHTML = "";
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            toast.show({position: {X: 'Center', Y: 'Top' }});
            expect(ele.classList.contains(TOPCENTER)).toBe(true);
        });
        it("Toast Position value testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({ timeOut: 50,
                newestOnTop: false}, ele);
            toast.show();
            expect(ele.classList.contains(TOPLEFT)).toBe(true);
            toast.show();
            expect(ele.classList.contains(TOPLEFT)).toBe(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Toast Position property testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            document.body.innerHTML = "";
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(0);
            toast.show({position: {X: 'Center', Y: 'Top' }});
            expect(ele.classList.contains(TOPCENTER)).toBe(true);
        });
        it("Toast Position value testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({ timeOut: 50,
                newestOnTop: false}, ele);
            toast.show();
            expect(ele.classList.contains(TOPLEFT)).toBe(true);
            toast.show();
            expect(ele.classList.contains(TOPLEFT)).toBe(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Toast Position with destroyed property testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            document.body.innerHTML = "";
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(0);
            toast.show({position: {X: 'Center', Y: 'Top' }});
            expect(ele.classList.contains(TOPCENTER)).toBe(true);
        });
        it("Toast Position value testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({position: {X: 'Center', Y: 'Bottom' },  timeOut: 50,
            newestOnTop: false}, ele);
            toast.show();
            expect(ele.classList.contains(BOTTOMCENTER)).toBe(true);
            toast.show();
            expect(ele.classList.contains(BOTTOMCENTER)).toBe(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Toast Position property All possibility testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            document.body.innerHTML = "";
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
        });
        it("Toast Position LEFT-TOP testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({ timeOut: 50}, ele);
            toast.show();
            expect(ele.classList.contains(TOPLEFT)).toBe(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast Position RIGHT-TOP testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({ timeOut: 50, position : {X: 'Right', Y: 'Top' }}, ele);
            toast.show();
            expect(ele.classList.contains(TOPRIGHT)).toBe(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast Position CENTER-TOP testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({ timeOut: 50, position : {X: 'Center', Y: 'Top' }}, ele);
            toast.show();
            expect(ele.classList.contains(TOPCENTER)).toBe(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast Position LEFT-BOTTOM testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({ timeOut: 50, position : {X: 'Left', Y: 'Bottom' }}, ele);
            toast.show();
            expect(ele.classList.contains(BOTTOMLEFT)).toBe(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast Position RIGHT-BOTTOM testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({ timeOut: 50, position : {X: 'Right', Y: 'Bottom' }}, ele);
            toast.show();
            expect(ele.classList.contains(BOTTOMRIGHT)).toBe(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast Position CENTER-BOTTOM testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({ timeOut: 50, position : {X: 'Center', Y: 'Bottom' }}, ele);
            toast.show();
            expect(ele.classList.contains(BOTTOMCENTER)).toBe(true);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Toast Position Custom possibility testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = "";
        });
        it("Toast Position Custom testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({ timeOut: 50, position: {X : 30, Y: 50 }}, ele);
            toast.show();
            expect(ele.style.top).toBe('50px');
            expect(ele.style.left).toBe('30px');
        });
        it("Toast Position Custom percentage value testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({ timeOut: 50, position: {X : '30%', Y: '50%' }}, ele);
            toast.show();
            expect(ele.style.top).toBe('50%');
            expect(ele.style.left).toBe('30%');
        });
    });
    describe("Toast template Property testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            let templateEle: HTMLElement = document.createElement('div');
            templateEle.id = 'templateEle';
            templateEle.innerHTML = 'Hello this is Template Element';
            document.body.appendChild(templateEle);

        });
        afterEach((): void => {
            document.body.innerHTML = "";
        });
        it("Toast template property testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast( {template: '#templateEle' } , ele);
            toast.show();
            expect(ele.firstElementChild.childElementCount).toBe(1);
            expect(ele.firstElementChild.firstElementChild.textContent).toBe('Hello this is Template Element');
        });
        it("Toast template property value with string element testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast( {template: '<div id ="templateString">TemplateString</div>' } , ele);
            toast.show();
            expect(ele.firstElementChild.childElementCount).toBe(1);
            expect(ele.firstElementChild.firstElementChild.textContent).toBe('TemplateString');
            expect(ele.firstElementChild.firstElementChild.id).toBe('templateString');
        });
        it("Toast template property with spacing string element testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast( {template: ' <div id ="templateString">TemplateString</div>' } , ele);
            toast.show();
            expect(ele.firstElementChild.childElementCount).toBe(1);
            expect(ele.firstElementChild.firstElementChild.textContent).toBe('TemplateString');
            expect(ele.firstElementChild.firstElementChild.id).toBe('templateString');
        });
    });
    describe("Toast template Engine testing for title, content and template property", () => {
        let toast: Toast;
        let testflow: boolean = false;
        beforeEach((): void => {
            testflow = true;
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            let templateEle: HTMLElement = document.createElement('div');
            templateEle.id = 'templateEle';
            templateEle.innerHTML = 'Hello this is Template Element';
            document.body.appendChild(templateEle);
            let titleEle: HTMLElement = document.createElement('div');
            titleEle.id = 'titleEle';
            titleEle.innerHTML = 'Hello this is Title Element';
            document.body.appendChild(titleEle);
            let contentEle: HTMLElement = document.createElement('div');
            contentEle.id = 'contentEle';
            contentEle.innerHTML = 'Hello this is Content Element';
            document.body.appendChild(contentEle);

        });
        afterEach((): void => {
            if (!testflow) {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(0);
            expect(document.querySelectorAll('#templateEle').length).toBe(1);
            expect(document.querySelectorAll('#titleEle').length).toBe(1);
            expect(document.querySelectorAll('#contentEle').length).toBe(1); }
            document.body.innerHTML = "";
        });
        it("Toast template Engine testing", ( done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast( {title: '#titleEle',
            newestOnTop: false, } , ele);
            toast.show();
            expect(ele.firstElementChild.querySelector('.' + MESSAGE).childElementCount).toBe(1);
            expect(ele.firstElementChild.querySelector('.' + TITLE).textContent).toBe('Hello this is Title Element');
            toast.show( {title: null, content: '#contentEle' });
            expect(ele.children[1].children[0].childElementCount).toBe(1);
            expect(ele.children[1].querySelector('.' + CONTENT).firstElementChild.textContent).toBe('Hello this is Content Element');
            expect(ele.firstElementChild.querySelector('.' + MESSAGE).childElementCount).toBe(1);
            expect(ele.firstElementChild.querySelector('.' + TITLE).textContent).toBe('Hello this is Title Element');
            toast.show( { title: '#titleEle', content: null });
            expect(ele.children[2].querySelector('.' + TITLE).firstElementChild.textContent).toBe('Hello this is Title Element');
            expect(ele.children[2].childElementCount).toBe(1);
            toast.hide('All');
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast template Engine testing", ( done: Function) => {
            testflow= false;
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast( {template: '#templateEle',
            newestOnTop: false, } , ele);
            toast.show();
            expect(ele.firstElementChild.childElementCount).toBe(1);
            expect(ele.firstElementChild.firstElementChild.textContent).toBe('Hello this is Template Element');
            toast.show( { template: null, title: '#titleEle', content: '#contentEle' });
            expect(ele.children[1].childElementCount).toBe(1);
            expect(ele.children[1].children[0].childElementCount).toBe(2);
            expect(ele.children[1].querySelector('.' + TITLE).firstElementChild.textContent).toBe('Hello this is Title Element');
            expect(ele.children[1].querySelector('.' + CONTENT).firstElementChild.textContent).toBe('Hello this is Content Element');

            expect(ele.firstElementChild.childElementCount).toBe(1);
            expect(ele.firstElementChild.firstElementChild.textContent).toBe('Hello this is Template Element');
            toast.show( { template: null, title: '#titleEle', content: '#contentEle' });
            expect(ele.children[1].childElementCount).toBe(1);
            expect(ele.children[1].children[0].childElementCount).toBe(2);
            expect(ele.children[1].querySelector('.' + TITLE).firstElementChild.textContent).toBe('Hello this is Title Element');
            expect(ele.children[1].querySelector('.' + CONTENT).firstElementChild.textContent).toBe('Hello this is Content Element');
            expect(ele.children[2].childElementCount).toBe(1);
            expect(ele.children[2].children[0].childElementCount).toBe(2);
            expect(ele.children[2].querySelector('.' + TITLE).firstElementChild.textContent).toBe('Hello this is Title Element');
            expect(ele.children[2].querySelector('.' + CONTENT).firstElementChild.textContent).toBe('Hello this is Content Element');
            toast.hide('All');
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });

    describe("Toast RTL testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = "";
        });
        it("Toast RTL testing in property", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({ timeOut: 50, position: {X : 30, Y: 50 }, enableRtl: true,
                newestOnTop: false,}, ele);
            expect(ele.classList.contains(RTL)).toBe(true);
            toast.show();
            toast.show();
            toast.enableRtl = false;
            toast.dataBind();
            expect(ele.classList.contains(RTL)).toBe(false);
            toast.enableRtl = true;
            toast.dataBind();
            expect(ele.classList.contains(RTL)).toBe(true); 
        });
    });
    describe("Toast Buttons Property testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);

        });
        afterEach((): void => {
            document.body.innerHTML = "";
        });
        it("Action Button property testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast( { buttons: [{ model: {content : 'btn0'} }] } , ele);
            toast.show();
            expect(ele.firstElementChild.childElementCount).toBe(1);
            expect(ele.firstElementChild.firstElementChild.childElementCount).toBe(1);
            expect(ele.firstElementChild.firstElementChild.firstElementChild.classList.contains(ACTIOBUTTONS)).toBe(true);
            expect(ele.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('btn0');
            expect(ele.firstElementChild.firstElementChild.firstElementChild.firstElementChild.classList.contains('e-btn')).toBe(true);
            expect(ele.firstElementChild.firstElementChild.firstElementChild.firstElementChild.classList.contains('e-primary')).toBe(true);
        });
        it("Toast template property value with string element testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast( {template: '<div id ="templateString">TemplateString</div>' } , ele);
            toast.show();
            expect(ele.firstElementChild.childElementCount).toBe(1);
            expect(ele.firstElementChild.firstElementChild.textContent).toBe('TemplateString');
            expect(ele.firstElementChild.firstElementChild.id).toBe('templateString');
        });
    });
    describe("Toast Buttons Click event testing", () => {
        let toast: Toast;
        let i: number = 0;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);

        });
        afterEach((): void => {
            document.body.innerHTML = "";
        });
        function btnClickEvent(): void {
          i++;
        }
        it("Action Click Event testing", () => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast( { buttons: [{ model: {content : 'btn0'}, click: btnClickEvent }],
            newestOnTop: false, } , ele);
            toast.show();
            expect(ele.firstElementChild.firstElementChild.firstElementChild.classList.contains(ACTIOBUTTONS)).toBe(true);
            expect(ele.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('btn0');
            (<HTMLElement>ele.querySelector('.e-btn')).click();
            expect(i).toBe(1);
            toast.show( { buttons: [{ model: {content : 'btn0', cssClass:'e-info'}, click: btnClickEvent }, {model: { content: 'btn1' }, click: btnClickEvent}] } );
            (<HTMLElement>ele.children[1].querySelectorAll('.e-btn')[0]).click();
            expect((<HTMLElement>ele.children[1].querySelectorAll('.e-btn')[0]).classList.contains('e-info')).toBe(true);
            expect((<HTMLElement>ele.children[1].querySelectorAll('.e-btn')[0]).classList.contains('e-primary')).toBe(false);
            expect(i).toBe(2);
            (<HTMLElement>ele.children[1].querySelectorAll('.e-btn')[1]).click();
            expect(i).toBe(3);

        });
    });
    
    describe("Toast TimeOut Property testing", () => {
        let toast: Toast;
        beforeEach((done: Function): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            toast = new Toast( { title: 'SampleToast', content: 'Sample Content',
            newestOnTop: false, } , ele);
            toast.show({animation : {show : {duration: 10}, hide : {duration: 10}}, timeOut: 10});
            expect(ele.childElementCount).toBe(1);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(0);
            document.body.innerHTML = "";
        });
        it("timeout property value testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(0);
            toast.show( {timeOut: 500});
            expect(ele.childElementCount).toBe(1);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Toast TimeOut Property testing", () => {
        let toast: Toast;
        beforeEach((done: Function): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            toast = new Toast( { title: 'SampleToast', content: 'Sample Content',
            newestOnTop: false, } , ele);
            toast.show({animation : {show : {duration: 10}, hide : {duration: 10}}, timeOut: 10});
            expect(ele.childElementCount).toBe(1);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(1);
            document.body.innerHTML = "";
        });
        it("timeout property value exceed testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(0);
            toast.show( {timeOut: 800});
            expect(ele.childElementCount).toBe(1);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Toast TimeOut Property testing", () => {
        let toast: any;
        let testcaseFlowCount: number = 0;
        beforeEach((done: Function): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            toast = new Toast( { title: 'SampleToast', content: 'Sample Content',
            newestOnTop: false, } , ele);
            testcaseFlowCount === 0 ? toast.showProgressBar = true: toast.showProgressBar = false; 
            toast.show({animation : {show : {duration: 10}, hide : {duration: 10}}, timeOut: 800, extendedTimeout: 80});
            expect(ele.childElementCount).toBe(1);
            if (testcaseFlowCount === 1) {
                toast.show();
                toast.show({ showProgressBar: false })
            }
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(0);
            document.body.innerHTML = "";
        });
        it("timeout property value exceed testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(1);
            let id = parseInt(ele.firstElementChild.id.split('toast_')[1], 10);
            toast.toastHoverAction(id);
            toast.delayedToastProgress(id);
            ++testcaseFlowCount;
            setTimeout(() => { done(); }, 100);
        });
        it("timeout property value with progressBar exceed testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(3);
            let id1 = parseInt(ele.firstElementChild.id.split('toast_')[1], 10);
            let id2 = parseInt(ele.children[1].id.split('toast_')[1], 10);
            let id3 = parseInt(ele.children[2].id.split('toast_')[1], 10);
            toast.toastHoverAction(id1);
            toast.delayedToastProgress(id1);
            toast.toastHoverAction(id2);
            toast.delayedToastProgress(id2);
            toast.toastHoverAction(id3);
            toast.delayedToastProgress(id3);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });

    describe("Toast TimeOut Property worst case testing", () => {
        let toast: any;
        let testcaseFlowCount: number = 0;
        beforeEach((done: Function): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            toast = new Toast( { title: 'SampleToast', content: 'Sample Content',
            newestOnTop: false, } , ele);
            testcaseFlowCount === 0 ? toast.showProgressBar = true: toast.showProgressBar = false; 
            toast.show({animation : {show : {duration: 10}, hide : {duration: 10}}, timeOut: 800, extendedTimeout: testcaseFlowCount ===0 ? 0 : -30});
            expect(ele.childElementCount).toBe(1);
            if (testcaseFlowCount === 1) {
                toast.show();
                toast.show({ showProgressBar: false })
            }
            setTimeout(() => { done(); }, 300);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            if (testcaseFlowCount === 1)  {
                expect(ele.childElementCount).toBe(1);
            } else {
            expect(ele.childElementCount).toBe(3); }
            document.body.innerHTML = "";
        });
        it("extendedTimeout property value zero testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(1);
            let id = parseInt(ele.firstElementChild.id.split('toast_')[1], 10);
            ++testcaseFlowCount;
            setTimeout(() => { done(); }, 100);
        });
        it("extendedTimeout property value with nagative value testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(3);
            let id1 = parseInt(ele.firstElementChild.id.split('toast_')[1], 10);
            let id2 = parseInt(ele.children[1].id.split('toast_')[1], 10);
            let id3 = parseInt(ele.children[2].id.split('toast_')[1], 10);
            ++testcaseFlowCount;
            setTimeout(() => { done(); }, 100);
        });
    });

    describe("Toast TimeOut with extended timeout Property with zero testing", () => {
        let toast: any;
        beforeEach((done: Function): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            toast = new Toast( { title: 'SampleToast', content: 'Sample Content' } , ele);
            toast.show({animation : {show : {duration: 10}, hide : {duration: 10}}, extendedTimeout: 0, showProgressBar: true});
            expect(ele.childElementCount).toBe(1);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(1);
            document.body.innerHTML = "";
        });
        it("extended timeout property value zero testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(1);
            let id = parseInt(ele.firstElementChild.id.split('toast_')[1], 10);
            setTimeout(() => { done(); }, 100);
        });
    });
    describe("Toast ShowCloseButton property with click testing", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(0);
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast ShowCloseButton property value close toast testing",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                showCloseButton: true,
                timeOut: 0
            }, ele);
            toast.show();
            expect(ele.childElementCount).toBe(1);
            (<HTMLElement>ele.querySelector('.' + CLOSEBTN)).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });

    describe("Toast Destroy method Testing ", () => {
        let toast: Toast;
        beforeEach((done: Function): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            toast = new Toast({ title: 'hello', content: 'toast content' }, ele);
            toast.show();
            toast.show();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(0);
            expect(ele.classList.contains(ROOT)).toBe(false);
            expect(ele.classList.contains(CONTAINER)).toBe(false);
            document.body.innerHTML = "";
        });
        it("Toast destroy method testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(2);
            toast.destroy();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });

    describe("Toast beforeOpen cancel argument testing ", () => {
        let toast: Toast;
        function onBeforeEvent(e:ToastBeforeOpenArgs) {
         e.cancel = true;
        }
        beforeEach((done: Function): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            toast = new Toast({ title: 'hello', content: 'toast content', beforeOpen: onBeforeEvent }, ele);
            toast.show();
            toast.show();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(0);
            expect(ele.classList.contains(ROOT)).toBe(true);
            expect(ele.classList.contains(CONTAINER)).toBe(true);
            document.body.innerHTML = "";
        });
        it("Toast beforeOpen cancel argument testing ",  () => {});
    });

    describe("Toast beforeOpen and Open event testing with arguments ", () => {
        let toast: Toast;
        function beforeEvent(e: ToastBeforeOpenArgs):void {
            let ele: HTMLElement = document.getElementById("toast");
            let element: HTMLElement = e.element;
          expect(ele.childElementCount).toBe(0);
          expect(isNOU(element)).toBe(false);
          expect(element.querySelector('.' + TITLE).innerHTML).toBe('hello');
          expect(element.querySelector('.' + CONTENT).innerHTML).toBe('toast content');
          expect(isNOU(element.querySelector('.' + ICON))).toBe(true);
          expect(element.querySelectorAll('.' + PROGRESS).length).toBe(1);
        }
        function openEvent(e: ToastOpenArgs): void {
            let ele: HTMLElement = document.getElementById("toast");
            let element: HTMLElement = ele.firstElementChild as HTMLElement;
            expect(ele.childElementCount).toBe(1);
            expect(isNOU(element)).toBe(false);
            expect(element.querySelector('.' + TITLE).innerHTML).toBe('hello');
            expect(element.querySelector('.' + CONTENT).innerHTML).toBe('toast content');
            expect(isNOU(element.querySelector('.' + ICON))).toBe(true);
            expect(element.querySelectorAll('.' + PROGRESS).length).toBe(1);
        }
        beforeEach((done: Function): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            toast = new Toast(
                { 
                    title: 'hello', content: 'toast content', beforeOpen: beforeEvent, open: openEvent, showCloseButton: true, showProgressBar: true,
                 }, ele);
            toast.show();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.childElementCount).toBe(0);
            expect(ele.classList.contains(ROOT)).toBe(false);
            expect(ele.classList.contains(CONTAINER)).toBe(false);
            expect(ele.classList.contains('e-control')).toBe(false);
            document.body.innerHTML = "";
        });
        it("Toast beforeOpen and Open event testing with arguments testing",  (done: Function) => {
            toast.destroy();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });




    describe("Toast public method testing", () => {
        let toast: Toast;
        let testcaseFlowCount: number = 0;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((done: Function): void => {
            let ele: HTMLElement = document.getElementById("toast");
            if (testcaseFlowCount === 0) {
                expect(ele.childElementCount).toBe(0);
            } else if (testcaseFlowCount === 1) {
                expect(isVisible(ele.firstElementChild)).toBe(true);
                expect(ele.children[0].querySelector('.' + TITLE).textContent).toBe('toast02');
                expect(ele.children[2].querySelector('.' + TITLE).textContent).toBe('toast04');
            }  else if (testcaseFlowCount === 2) {
                expect(ele.children[0].querySelector('.' + TITLE).textContent).toBe('toast06');
                expect(ele.children[2].querySelector('.' + TITLE).textContent).toBe('toast03');
            }   else if (testcaseFlowCount === 3) {
                expect(ele.childElementCount).toBe(0);
            }
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast show Method testing",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                timeOut: 0,
                newestOnTop: false,
            }, ele);
            toast.show();
            expect(ele.childElementCount).toBe(1);
            toast.hide();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast hide Method testing",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                timeOut: 0,
                newestOnTop: false,
                animation : { show: {duration: 0}, hide: {duration: 0}}
            }, ele);
            toast.show( { title: 'toast01' });
            toast.show( { title: 'toast02' });
            toast.show( { title: 'toast03' });
            toast.show( { title: 'toast04' });
            toast.show( { title: 'toast05' });
            expect(ele.childElementCount).toBe(5);
            toast.hide();
            toast.newestOnTop = true;
            toast.hide();
            ++testcaseFlowCount;
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast hide Method with Element argument testing",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                timeOut: 0,
                animation : { show: {duration: 0}, hide: {duration: 0}},
            }, ele);
            toast.show( { title: 'toast01' });
            toast.show( { title: 'toast02' });
            toast.show( { title: 'toast03' });
            toast.show( { title: 'toast04' });
            toast.show( { title: 'toast05' });
            toast.show( { title: 'toast06' });
            expect(ele.childElementCount).toBe(6);
            toast.hide(toast.element.children[2]);
            ++testcaseFlowCount;
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast hide Method with hiding all toaster",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                timeOut: 0,
                animation : { show: {duration: 0}, hide: {duration: 0}},
            }, ele);
            toast.show( { title: 'toast01' });
            toast.show( { title: 'toast02' });
            toast.show( { title: 'toast03' });
            toast.show( { title: 'toast04' });
            toast.show( { title: 'toast05' });
            toast.show( { title: 'toast06' });
            expect(ele.childElementCount).toBe(6);
            toast.hide('All');
            ++testcaseFlowCount;
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });



    describe("Toast Events testing", () => {
        let toast: Toast;
        let clickCount: number = 0;
        let openCount: number = 0;
        let closeCount: number = 0;
        let destroyCount: number = 0;
        let onCreateCount: number = 0;
        let testcaseFlowCount: number = 0;
        function clickFnEvent(e: ToastClickEventArgs): void {
            e.cancel = true;  
            e.clickToClose = true; 
            ++clickCount; }
        function clickFn(e: ToastClickEventArgs): void {
         e.cancel = true;   
         ++clickCount; }
        function openFn(): void {
         ++openCount; }
        function closeFn(): void {
            ++closeCount; }   
        function oncreate(): void {
            ++onCreateCount; }
        function destroyedFn(): void {
            ++destroyCount; }    
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
        });
        afterEach((done: Function): void => {
            let ele: HTMLElement = document.getElementById("toast");
            switch(testcaseFlowCount) {
                case 0 :{
                  expect(openCount).toBe(2);
                  expect(isVisible(ele.firstElementChild)).toBe(true);
                  break; }
                case 1 : {
                  expect(openCount).toBe(4);
                  expect(closeCount).toBe(1);
                  break; }
                case 2 : {
                  expect(openCount).toBe(2);
                  expect(isVisible(ele.firstElementChild)).toBe(true);
                  break; }  
                case 3 : {
                  expect(openCount).toBe(2);
                  expect(ele.childElementCount).toBe(0);
                  break; } 
            }
            if (toast) {
                toast.destroy();
            }
            if (testcaseFlowCount ==0) expect(destroyCount > 0).toBe(true);
            destroyCount = 0;
            document.body.innerHTML = "";
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast Event value testing",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                showCloseButton: true,
                beforeOpen: openFn,
                open: openFn,
                close: closeFn,
                destroyed: destroyedFn,
                created: oncreate
            }, ele);
            toast.show();
            expect(onCreateCount).toBe(1);
            expect(ele.childElementCount).toBe(1);
            expect(openCount).toBe(1);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast Event value testing",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                showCloseButton: true,
                beforeOpen: openFn,
                open: openFn,
                close: closeFn,
            }, ele);
            toast.show();
            expect(ele.childElementCount).toBe(1);
            expect(openCount).toBe(3);
            toast.hide();
            ++testcaseFlowCount;
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast Event value testing",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                showCloseButton: true,
                click: clickFn,
                beforeOpen: openFn,
                open: openFn,
            }, ele);
            openCount = 0;
            toast.show();
            ++testcaseFlowCount;
            (<HTMLElement>ele.querySelector('.' + CLOSEBTN)).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast click event clickToClose value testing",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            toast = new Toast({
                showCloseButton: true,
                click: clickFnEvent,
                beforeOpen: openFn,
                open: openFn,
                title: 'SampleToaste',
            }, ele);
            openCount = 0;
            toast.show();
            ++testcaseFlowCount;
            (<HTMLElement>ele.querySelector('.' + TITLE)).click();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
    describe("Toast Enable persistance testing", () => {
        let toast: any;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            toast = new Toast( { title: 'SampleToast', content: 'Sample Content', enablePersistence: true } , ele);
            expect(toast.getPersistData()).toBe("{}")    // For Code Coverage only
            toast.show();
        });
        afterEach((): void => {
            document.body.innerHTML = "";
        });
        it("Persistance property value zero testing", () => {
        });
    });

    describe("Toast device mode swipe functionalities testing ", () => {
        let toast: any;
        let count: number = 0;
        beforeEach((done: Function): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            toast = new Toast({ timeOut: 0 }, ele);
            toast.show();
            toast.show();
            toast.show();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            if (count === 1) {
              expect(toast.element.childElementCount).toBe(2);
              expect(toast.animation.hide.effect).toBe('FadeOut');
            }
            if (count === 2) {
                expect(toast.element.childElementCount).toBe(2);
                expect(toast.animation.hide.effect).toBe('FadeOut');
            }
            if (count === 3) {
                expect(toast.element.childElementCount).toBe(3);
                expect(toast.animation.hide.effect).toBe('FadeOut');
            }
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast swipe left direction testing",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            let tchEvent: any = {};
            tchEvent.target = <EventTarget>ele.firstElementChild;
            ++count;
            expect(toast.element.childElementCount).toBe(3);
            let event: SwipeEventArgs = {
                swipeDirection: 'Left',
                name: 'swipe',
                distanceX: 30,
                distanceY: 0, originalEvent: tchEvent, startEvents: tchEvent, startX: 30, startY: 0, velocity: 4
            };
            toast.swipeHandler(event);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast swipe Right direction testing",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            let tchEvent: any = {};
            tchEvent.target = <EventTarget>ele.firstElementChild;
            ++count;
            expect(toast.element.childElementCount).toBe(3);
            let event: SwipeEventArgs = {
                swipeDirection: 'Right',
                name: 'swipe',
                distanceX: 30,
                distanceY: 0, originalEvent: tchEvent, startEvents: tchEvent, startX: 30, startY: 0, velocity: 4
            };
            toast.swipeHandler(event);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        it("Toast swipe Top direction testing",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            let tchEvent: any = {};
            tchEvent.target = <EventTarget>ele.firstElementChild;
            ++count;
            expect(toast.element.childElementCount).toBe(3);
            let event: SwipeEventArgs = {
                swipeDirection: 'Top',
                name: 'swipe',
                distanceX: 30,
                distanceY: 0, originalEvent: tchEvent, startEvents: tchEvent, startX: 30, startY: 0, velocity: 4
            };
            toast.swipeHandler(event);
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });

    describe("Toast device mode swipe functionalities testing ", () => {
        let toast: any;
        let count: number = 0;
        beforeEach((done: Function): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            Browser.userAgent = iosChromeUa;
            toast = new Toast({ timeOut: 0, animation: {
                hide: {
                    effect: "FlipLeftUpIn"
                }
            } }, ele);
            toast.show();
            toast.show();
            toast.show();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            expect(toast.element.childElementCount).toBe(3);
            expect(toast.animation.hide.effect).toBe('FlipLeftUpIn');
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast swipe animation testing",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            let tchEvent: any = {};
            tchEvent.target = <EventTarget>ele.firstElementChild;
            ++count;
            expect(toast.element.childElementCount).toBe(3);
            let event: SwipeEventArgs = {
                swipeDirection: 'Top',
                name: 'swipe',
                distanceX: 30,
                distanceY: 0, originalEvent: tchEvent, startEvents: tchEvent, startX: 30, startY: 0, velocity: 4
            };
            toast.swipeHandler(event);
            Browser.userAgent = '';
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });

    describe("Toast Inline template support ", () => {
        let toast: Toast;
        beforeEach((): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            let innerEl: HTMLElement = document.createElement("div");
            innerEl.innerHTML = "Inner Element";
            ele.appendChild(innerEl);
            document.body.appendChild(ele);
            toast = new Toast({}, ele);
            toast.show();
            toast.show();
        });
        afterEach((): void => {
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast Base class testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            expect(ele.querySelectorAll('.e-toast-message .e-toast-content').length).toBe(2);
            expect(ele.querySelectorAll('.e-toast-message .e-toast-content')[0].innerHTML).toBe("<div><div>Inner Element</div></div>");
            expect(ele.querySelectorAll('.e-toast-message .e-toast-content')[1].innerHTML).toBe("<div>Inner Element</div>");
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });

    describe("Toast device mode swipe functionalities testing ", () => {
        let toast: any;
        let count: number = 0;
        beforeEach((done: Function): void => {
            let ele: HTMLElement = document.createElement("div");
            ele.id = "toast";
            document.body.appendChild(ele);
            Browser.userAgent = iosChromeUa;
            toast = new Toast({ timeOut: 0, animation: {
                hide: {
                    effect: "FlipLeftUpIn"
                }
            } }, ele);
            toast.show();
            toast.show();
            toast.show();
            setTimeout(() => { done(); }, TIME_DELAY);
        });
        afterEach((): void => {
            expect(toast.element.childElementCount).toBe(3);
            expect(toast.animation.hide.effect).toBe('FlipLeftUpIn');
            if (toast) {
                toast.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toast swipe without Elemenet",  (done: Function) => {
            let ele: HTMLElement = document.getElementById("toast");
            let tchEvent: any = {};
            tchEvent.target = <EventTarget>ele;
            ++count;
            expect(toast.element.childElementCount).toBe(3);
            let event: SwipeEventArgs = {
                swipeDirection: 'Left',
                name: 'swipe',
                distanceX: 30,
                distanceY: 0, originalEvent: tchEvent, startEvents: tchEvent, startX: 30, startY: 0, velocity: 4
            };
            toast.swipeHandler(event);
            Browser.userAgent = '';
            setTimeout(() => { done(); }, TIME_DELAY);
        });
    });
});