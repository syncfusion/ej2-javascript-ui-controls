import { Browser, createElement, detach } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../src/drop-down-tree/drop-down-tree';
import { Dialog } from '@syncfusion/ej2-popups';
import { listData , hierarchicalData3 } from '../../spec/drop-down-tree/dataSource.spec'
import '../../node_modules/es6-promise/dist/es6-promise';

describe('DropDownTree control', () => {
    describe('DOM element testing', () => {
        beforeAll(() => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
        });
        let ddTreeObj: DropDownTree;
        beforeEach((): void => {
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
            ddTreeObj = undefined;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'default' });
            document.body.appendChild(element);
        });
        afterEach((): void => {
            if (ddTreeObj)
                ddTreeObj.destroy();
            document.body.innerHTML = '';
        });
        it('with base class', () => {
            ddTreeObj = new DropDownTree({}, '#default');
            expect(document.getElementById('default').classList.contains('e-control')).toEqual(true);
            expect(document.getElementById('default').classList.contains('e-dropdowntree')).toEqual(true);
        });
        it('Element Structure', () => {
            ddTreeObj = new DropDownTree({}, '#default');
            expect(ddTreeObj.element.classList.contains('e-control')).toEqual(true);
            expect(ddTreeObj.element.classList.contains('e-dropdowntree')).toEqual(true);
            expect(ddTreeObj.element.parentElement.classList.contains('e-control-wrapper')).toEqual(true);
            expect(ddTreeObj.element.parentElement.classList.contains('e-ddt')).toEqual(true);
            expect(ddTreeObj.element.previousElementSibling.classList.contains('e-ddt-hidden')).toBe(true);
            expect(ddTreeObj.element.previousElementSibling.tagName).toBe("SELECT");
            expect(ddTreeObj.element.parentElement.lastElementChild.classList.contains('e-ddt-icon')).toEqual(true);
        });
        it('get module name', () => {
            ddTreeObj = new DropDownTree({}, '#default');
            expect(ddTreeObj.getModuleName()).toBe('dropdowntree');
        });

        it('aria attributes', () => {
            ddTreeObj = new DropDownTree({}, '#default');
            expect(ddTreeObj.element.getAttribute("role")).toEqual("combobox");
            expect(ddTreeObj.element.getAttribute("type")).toEqual("text");
            expect(ddTreeObj.element.getAttribute("aria-expanded")).toEqual("false");
            expect(ddTreeObj.element.getAttribute("aria-haspopup")).toEqual("tree");
        });
    });

    describe('Dropdown tree  default property testing without popup', () => {
        let ddtreeObj: DropDownTree;
        beforeEach(() => {
            ddtreeObj = undefined;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (ddtreeObj) {
                ddtreeObj.destroy()
            }
            document.body.innerHTML = '';
        });
        /**
         * initialize
         */
        it('Default initialize', () => {
            ddtreeObj = new DropDownTree({}, '#ddtree');
            expect(ddtreeObj.element.classList.contains('e-dropdowntree')).not.toBe(null);
        });
        it('Width', () => {
            ddtreeObj = new DropDownTree({}, '#ddtree');
            expect(ddtreeObj.width).toEqual('100%');
        });
        it('showDropDownIcon', () => {
            ddtreeObj = new DropDownTree({}, '#ddtree');
            expect((ddtreeObj as any).inputObj.buttons[0].classList.contains('e-ddt-icon')).toBe(true);
        });
        it('showClearButton', () => {
            ddtreeObj = new DropDownTree({}, '#ddtree');
            expect((ddtreeObj as any).element.nextElementSibling.classList.contains('e-clear-icon')).toBe(true);
        });
        it('text', () => {
            ddtreeObj = new DropDownTree({}, '#ddtree');
            expect((ddtreeObj as any).text).toBe(null);
        });
        it('value', () => {
            ddtreeObj = new DropDownTree({}, '#ddtree');
            expect((ddtreeObj as any).value).toBe(null);
        });
        it('enableRtl ', () => {
            ddtreeObj = new DropDownTree({}, '#ddtree');
            expect(ddtreeObj.element.parentElement.classList.contains('e-rtl')).toEqual(false);
        });
        it('placeholder', () => {
            ddtreeObj = new DropDownTree({ }, '#ddtree');
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual(null);
        });

    });
    describe('List property testing', () => {
        let ddtreeObj: DropDownTree;
        let mouseEventArgs: any;
        let tapEvent: any;

        beforeEach((): void => {
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent: { target: null }
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            ddtreeObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (ddtreeObj)
                ddtreeObj.destroy();
            document.body.innerHTML = '';
        });
      
        it('Clear Button clicked after focus out', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            var icon: HTMLElement = (ddtreeObj as any).element.nextElementSibling;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            icon.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            icon.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            icon.dispatchEvent(e);
            (ddtreeObj as any).onFocusOut();
            var ele1 = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
        });

        it('mouse up on clear icon of chip element testing', () => {
            ddtreeObj = new DropDownTree({ value: ["1", "2"], showCheckBox: true,  fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            var ele = ddtreeObj.element;
            var ttTarget = (ddtreeObj as any).element.parentElement.querySelectorAll(".e-chips-close")[1];
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ttTarget.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            (ddtreeObj as any).onFocusOut();
            expect(ddtreeObj.value.length).toBe(2);
        });

        it('Selecting values using fullrow and clearing it', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true }, '#ddtree');
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-fullrow');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.text).toBe("Australia");
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            var icon: HTMLElement = (ddtreeObj as any).element.nextElementSibling;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            icon.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            icon.dispatchEvent(e);
            expect(ddtreeObj.value.length).toBe(0);
            (ddtreeObj as any).onFocusOut();
            var ele1 = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-fullrow');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.text).toBe("Australia");
            expect(ddtreeObj.value.length).toBe(1);
            let ncheckEle: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(ncheckEle[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });

        it('dropdown treeview mouse hover and mouse leave testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, destroyPopupOnHide: false }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect((ddtreeObj as any).inputEle.getAttribute("aria-expanded")).toBe('true');
            expect(document.querySelector('.e-popup').querySelector('.e-treeview')).not.toBe(null);
            expect((ddtreeObj as any).element.nextElementSibling.classList.contains('e-clear-icon')).toBe(true);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect((ddtreeObj as any).element.value).toBe("Australia")
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect((ddtreeObj as any).inputEle.getAttribute("aria-expanded")).toBe('false');
            (ddtreeObj as any).onFocusOut();
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
            (ddtreeObj as any).mouseIn(mouseEventArgs);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            (ddtreeObj as any).onMouseLeave(mouseEventArgs);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
        });
        it('Dynamic properties before first render', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }}, '#ddtree');
            ddtreeObj.showPopup();
            ddtreeObj.zIndex = 1333;
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).popupObj.element.style.zIndex === '1333').toBe(true);
        });
        it('when crosses view port', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, destroyPopupOnHide: false}, '#ddtree');
            ddtreeObj.showPopup();
            scrollBy({top: 500, behavior: 'smooth'});
            (ddtreeObj as any).popupObj.trigger('targetExitViewport');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
        });
        it('Value changed dynamically while focus in - Delimiter', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                placeholder: "Select items",
                showCheckBox: true,
                mode: 'Delimiter'
            }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect((ddtreeObj as any).element.value).toBe("Australia")
            expect((ddtreeObj as any).inputEle.classList.contains('e-chip-input')).toBe(false);
            expect((ddtreeObj as any).inputWrapper.querySelector('.e-overflow').classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.value = ['3'];
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).element.value).toBe("Victoria")
            expect((ddtreeObj as any).inputEle.classList.contains('e-chip-input')).toBe(false);
            expect((ddtreeObj as any).inputWrapper.querySelector('.e-overflow').classList.contains('e-icon-hide')).toBe(true);
        });
        it('Value changed dynamically while focus in - Default', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                placeholder: "Select items",
                showCheckBox: true,
            }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect((ddtreeObj as any).element.value).toBe("Australia")
            expect((ddtreeObj as any).inputEle.classList.contains('e-chip-input')).toBe(true);
            expect((ddtreeObj as any).inputWrapper.querySelector('.e-overflow').classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.value = ['3'];
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).element.value).toBe("Victoria")
            expect((ddtreeObj as any).inputEle.classList.contains('e-chip-input')).toBe(true);
            expect((ddtreeObj as any).inputWrapper.querySelector('.e-overflow').classList.contains('e-icon-hide')).toBe(true);
        });
        it('empty value at initial rendering - Default', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                placeholder: "Select items",
                showCheckBox: true,
                value: [],
                mode: 'Default'
            }, '#ddtree');
            var chipWrapper = (ddtreeObj as any).inputWrapper.querySelector('.e-chips-wrapper');
            expect(chipWrapper.classList.contains('e-icon-hide')).toBe(true);
            let ele = ddtreeObj.element;
            ele.focus();
            ddtreeObj.showPopup();
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(chipWrapper.classList.contains('e-icon-hide')).toBe(false);
            expect((ddtreeObj as any).element.value).toBe("Australia")
            expect((ddtreeObj as any).inputWrapper.querySelector('.e-overflow').classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.value = ['3'];
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).element.value).toBe("Victoria");
            expect(chipWrapper.classList.contains('e-icon-hide')).toBe(false);
            expect((ddtreeObj as any).inputWrapper.querySelector('.e-overflow').classList.contains('e-icon-hide')).toBe(true);
            (ddtreeObj as any).onFocusOut();
            expect(chipWrapper.classList.contains('e-icon-hide')).toBe(true);
        });
        it('empty value at initial rendering - Box', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                placeholder: "Select items",
                showCheckBox: true,
                value: [],
                mode: 'Box'
            }, '#ddtree');
            var chipWrapper = (ddtreeObj as any).inputWrapper.querySelector('.e-chips-wrapper');
            expect(chipWrapper.classList.contains('e-icon-hide')).toBe(true);
            expect(ddtreeObj.element.classList.contains('e-chip-input')).toBe(false);
            let ele = ddtreeObj.element;
            ele.focus();
            ddtreeObj.showPopup();
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(chipWrapper.classList.contains('e-icon-hide')).toBe(false);
            expect(ddtreeObj.element.classList.contains('e-chip-input')).toBe(true);
            expect((ddtreeObj as any).element.value).toBe("Australia")
            expect((ddtreeObj as any).inputWrapper.querySelector('.e-overflow').classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.value = ['3'];
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).element.value).toBe("Victoria");
            expect(chipWrapper.classList.contains('e-icon-hide')).toBe(false);
            expect((ddtreeObj as any).inputWrapper.querySelector('.e-overflow').classList.contains('e-icon-hide')).toBe(true);
            (ddtreeObj as any).onFocusOut();
            expect(chipWrapper.classList.contains('e-icon-hide')).toBe(true);
        });
    });

    describe('multiple attribute testing', () => {
        let ddtreeObj: DropDownTree;
        let mouseEventArgs: any;
        let tapEvent: any;

        beforeEach((): void => {
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent: { target: null }
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            ddtreeObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (ddtreeObj)
                ddtreeObj.destroy();
            document.body.innerHTML = '';
        });
        
        it('While enabling allowMultiselection', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded', }, allowMultiSelection: true}, '#ddtree');
            expect((ddtreeObj as any).hiddenElement.getAttribute('multiple')).toBe("");
        });
        it('While enabling showCheckBox', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded', }, showCheckBox: true}, '#ddtree');
            expect((ddtreeObj as any).hiddenElement.getAttribute('multiple')).toBe("");
        });
        it('While enabling allowMultiselection dynamically', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded', }}, '#ddtree');
            expect((ddtreeObj as any).hiddenElement.getAttribute('multiple')).toBe(null);
            ddtreeObj.allowMultiSelection = true;
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).hiddenElement.getAttribute('multiple')).toBe("");
        });
        it('While enabling showCheckBox dynamically', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded', }}, '#ddtree');
            expect((ddtreeObj as any).hiddenElement.getAttribute('multiple')).toBe(null);
            ddtreeObj.showCheckBox = true;
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).hiddenElement.getAttribute('multiple')).toBe("");
        });
        it('While disabling allowMultiselection dynamically', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded', }, allowMultiSelection: true}, '#ddtree');
            expect((ddtreeObj as any).hiddenElement.getAttribute('multiple')).toBe("");
            ddtreeObj.allowMultiSelection = false;
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).hiddenElement.getAttribute('multiple')).toBe(null);
        });
        it('While disabling showCheckBox dynamically', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded', }, showCheckBox: true}, '#ddtree');
            expect((ddtreeObj as any).hiddenElement.getAttribute('multiple')).toBe("");
            ddtreeObj.showCheckBox = false;
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).hiddenElement.getAttribute('multiple')).toBe(null);
        });
    });
});

describe('Destroy Method', () => {
    let ddtreeObj: any;
    let mouseEventArgs: any;
    let originalTimeout: any;
    let tapEvent: any;
    let i: number = 0, j: number = 0;
    function clickFn(): void {
        i++;
    }
    beforeEach((): void => {
        mouseEventArgs = {
            preventDefault: (): void => { },
            stopImmediatePropagation: (): void => { },
            target: null,
            type: null,
            shiftKey: false,
            ctrlKey: false,
            originalEvent: { target: null }
        };
        tapEvent = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        i = 0, j = 0;
        ddtreeObj = undefined;
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
        document.body.appendChild(ele);
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    afterEach((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        document.body.innerHTML = '';
    });
    xit('performance testing', (done) => {
        let hugeitems: any = [];
        let startDate:number;
        let timeTaken:number;
        for (let i = 0; i < 5; i++) {
            const topLevelId = getRandomId();
            hugeitems.push({
                id: topLevelId,
                name: 'Top Level Item ' + topLevelId,
                hasChild: true
            });

            for (let c = 0; c < 20; c++) {
                const childId = getRandomId();
                hugeitems.push({
                    id: childId,
                    pid: topLevelId,
                    name: 'Second Level Item ' + childId,
                    hasChild: true
                });

                for (let cc = 0; cc < 10; cc++) {
                    const subChildId = getRandomId();
                    hugeitems.push({
                        id: subChildId,
                        pid: childId,
                        name: 'Third Level Item ' + subChildId,
                        hasChild: true
                    });

                    for (let ccc = 0; ccc < 10; ccc++) {
                        const subSubChildId = getRandomId();
                        hugeitems.push({
                            id: subSubChildId,
                            pid: subChildId,
                            name: 'Fourth Level Item ' + subSubChildId,
                            hasChild: false
                        });
                    }
                }
            }
        }

        function getRandomId() {
            const min = Math.ceil(0);
            const max = Math.floor(9999999);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        ddtreeObj = new DropDownTree({
            fields: {
                dataSource: hugeitems, value: 'id',
                parentValue: 'pid',
                text: 'name',
                hasChildren: 'hasChild'
            },
            showCheckBox: true,
            mode: 'Delimiter',
            treeSettings: {
                expandOn: 'Auto',
                loadOnDemand: true,
                autoCheck: true
            },
            destroyed: function() {
                timeTaken = new Date().getTime() - startDate;
            }
        }, '#ddtree');
        ddtreeObj.showPopup();
        let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
        mouseEventArgs.target = li[0].querySelector('.e-checkbox-wrapper');
        ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(function() {
            startDate = new Date().getTime();
            ddtreeObj.destroy();
            setTimeout(() => {
                expect(timeTaken).toBeLessThan(100);
                done();
            },100 );  
        }, 100);
    });

    describe('Popup detached testing', () => {
        let dialog: Dialog;
        let ddTreeObj: DropDownTree;
        beforeEach((): void => {
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
            ddTreeObj = undefined;
            dialog = undefined;
            let ele: HTMLElement = createElement('div', { id: 'dialog' });
            document.body.appendChild(ele);
            let content: HTMLElement = createElement('div', { id: 'dlgContent' });
            document.body.appendChild(content);
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'default' });
            content.appendChild(element);
        });
        afterEach((): void => {
            if (dialog) {
                dialog.destroy();
                detach(dialog.element);
            }
            if (ddTreeObj)
                ddTreeObj.destroy();
            document.body.innerHTML = '';
        });
        it('dialog', () => {
            dialog = new Dialog({ header: 'Dialog',  showCloseIcon: true,  content: document.getElementById("dlgContent"),
            height: '300px',   width: '400px' });
            dialog.appendTo('#dialog');
            // Render drop-down-tree inside dialog
            ddTreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, destroyPopupOnHide: false }, '#default');
            expect(document.getElementById('dialog').querySelector("#dlgContent").children[0].classList.contains('e-ddt')).toBe(true);
            ddTreeObj.showPopup();
            // open drop-down-tree  popup
            expect(document.querySelector('.e-ddt.e-popup').classList.contains('e-popup-open')).toBe(true);
            ddTreeObj.hidePopup();
            // detached the drop-down-tree input from the dom
            detach(document.getElementsByClassName("e-ddt")[0]);
            expect(document.getElementById('dialog').querySelector("#dlgContent").childElementCount).toBe(0);
            expect(document.querySelectorAll('.e-ddt.e-popup').length).toBe(1);
            // create the drop-down-tree input and again append to dom
            var inputEle = createElement('input', { attrs: { role: 'textbox', type: 'text' } }) as HTMLInputElement;
            inputEle.id = "default";
            document.getElementById('dlgContent').appendChild(inputEle);
            ddTreeObj.appendTo('#default');
            expect(document.getElementById('dialog').querySelector("#dlgContent").children[0].classList.contains('e-ddt')).toBe(true);
            ddTreeObj.showPopup();
            expect(document.querySelectorAll('.e-ddt.e-popup').length).toBe(1);
            // open drop-down-tree  popup
            expect(document.querySelectorAll('.e-ddt.e-popup')[0].classList.contains('e-popup-open')).toBe(true);
            var li = (ddTreeObj as any).treeObj.element.querySelectorAll('li');
            expect(li.length).toBe(24);
            expect(li[0].querySelector('.e-list-text').innerText).toBe('Australia');
            ddTreeObj.hidePopup();
        });
    });
});

describe('Dropdown Tree With Id starts with number', () => {
    let ddtreeObj: DropDownTree;
    let mouseEventArgs: any;
    let tapEvent: any;

    beforeEach((): void => {
        mouseEventArgs = {
            preventDefault: (): void => { },
            stopImmediatePropagation: (): void => { },
            target: null,
            type: null,
            shiftKey: false,
            ctrlKey: false,
            originalEvent: { target: null }
        };
        tapEvent = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        ddtreeObj = undefined;
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: '11ddtree' });
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        if (ddtreeObj)
            ddtreeObj.destroy();
        document.body.innerHTML = '';
    });
    it('mouse hover and mouse leave testing', () => {
        ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, destroyPopupOnHide: false });
        ddtreeObj.appendTo( '#11ddtree');
        let ele = ddtreeObj.element;
        var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
        ele.dispatchEvent(e);
        var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
        ele.dispatchEvent(e);
        var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
        ele.dispatchEvent(e);
        expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
        expect((ddtreeObj as any).inputEle.getAttribute("aria-expanded")).toBe('true');
        expect(document.querySelector('.e-popup').querySelector('.e-treeview')).not.toBe(null);
        var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
        mouseEventArgs.target = li[0].querySelector('.e-list-text');
        tapEvent.tapCount = 1;
        (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
        expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
        expect((ddtreeObj as any).element.value).toBe("Australia")
        expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
        expect((ddtreeObj as any).inputEle.getAttribute("aria-expanded")).toBe('false');
        (ddtreeObj as any).onFocusOut();
    });
});

describe('Tab focus testing', () => {
    let ddtreeObj: any;
    let ddtreeObj1: any;
    let originalTimeout: any;
    let mouseEventArgs: any;
    let keyboardEventArgs: any
    let tapEvent: any;
    beforeEach((): void => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        mouseEventArgs = {
            preventDefault: (): void => { },
            stopImmediatePropagation: (): void => { },
            target: null,
            type: null,
            shiftKey: false,
            ctrlKey: false,
            originalEvent: { target: null }
        };
        keyboardEventArgs = {
            preventDefault: (): void => { },
            action: null,
            target: null,
            currentTarget: null,
            stopImmediatePropagation: (): void => { },
        };

        tapEvent = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };

        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
        let ele1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree1' });
        document.body.appendChild(ele);
        document.body.appendChild(ele1);
        ddtreeObj = undefined;
        ddtreeObj1 = undefined
    });
    afterEach((): void => {
        if (ddtreeObj)
            ddtreeObj.destroy();
        if (ddtreeObj1)
            ddtreeObj1.destroy();
        document.body.innerHTML = '';
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('tab key pressed', () => {
        ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
        ddtreeObj1 = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } });
        ddtreeObj1.appendTo('#ddtree1');
        const input = document.getElementsByTagName("input")[0];
        input.focus();
        input.dispatchEvent(new KeyboardEvent('keypress',  {'key':'tab'}));
        expect(ddtreeObj.inputWrapper.classList.contains('e-input-focus')).toBe(true);
        expect(ddtreeObj1.inputWrapper.classList.contains('e-input-focus')).toBe(false);
        const input_a = document.getElementsByTagName("input")[1];
        input_a.focus();
        input_a.dispatchEvent(new KeyboardEvent('keypress',  {'key':'tab'}));
        expect(ddtreeObj.inputWrapper.classList.contains('e-input-focus')).toBe(false);
        expect(ddtreeObj1.inputWrapper.classList.contains('e-input-focus')).toBe(true);
    });

    it('ensure expand nodes', () => {
        ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
        ddtreeObj.appendTo('#ddtree');
        ddtreeObj.showPopup();
        expect(document.querySelectorAll('.e-ddt.e-popup').length).toBe(1);
        expect(ddtreeObj.treeObj.expandedNodes.includes("1")).toBe(true);
        ddtreeObj.hidePopup();
        expect(document.querySelectorAll('.e-ddt.e-popup').length).toBe(0);
    });
    
    it('ensure selected nodes', () => {
        ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child", selected:"isSelected" }, showCheckBox: true }, '#ddtree');
        ddtreeObj.appendTo('#ddtree');
        ddtreeObj.showPopup();
        expect(document.querySelectorAll('.e-ddt.e-popup').length).toBe(1);
        expect(ddtreeObj.treeObj.selectedNodes.includes("2")).toBe(true);
        ddtreeObj.hidePopup();
        expect(document.querySelectorAll('.e-ddt.e-popup').length).toBe(0);
    });

    it('ensure Box mode', () => {
        ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
        showCheckBox: true, mode:'Box', value:["2", "9"] }, '#ddtree');
        ddtreeObj.appendTo('#ddtree');
        ddtreeObj.showPopup();
        expect(document.querySelectorAll('.e-chipcontent')[0].textContent).toBe("New South Wales");
        ddtreeObj.hidePopup();
    });

    it('ensure delimiter mode', () => {
        ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
        showCheckBox: true, mode: 'Delimiter', value:["2", "9"] }, '#ddtree');
        ddtreeObj.appendTo('#ddtree');
        ddtreeObj.showPopup();
        expect((ddtreeObj as any).inputEle.value).toBe("New South Wales, Ceará");
        ddtreeObj.hidePopup();
    });
});