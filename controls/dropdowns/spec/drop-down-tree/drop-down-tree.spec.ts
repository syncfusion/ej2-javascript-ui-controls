import { Browser, createElement, detach } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../src/drop-down-tree/drop-down-tree';
import { Dialog } from '@syncfusion/ej2-popups';
import { listData } from '../../spec/drop-down-tree/dataSource.spec'
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
            expect(ddTreeObj.element.getAttribute("role")).toEqual("textbox");
            expect(ddTreeObj.element.getAttribute("type")).toEqual("text");
            expect(ddTreeObj.element.parentElement.getAttribute("aria-disabled")).toEqual("false");
            expect(ddTreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("false");
            expect(ddTreeObj.element.parentElement.getAttribute("aria-haspopup")).toEqual("true");
            expect(ddTreeObj.element.parentElement.getAttribute("role")).toEqual("listbox");
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

        it('dropdown treeview mouse hover and mouse leave testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect((ddtreeObj as any).inputWrapper.getAttribute("aria-expanded")).toBe('true');
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
            expect((ddtreeObj as any).inputWrapper.getAttribute("aria-expanded")).toBe('false');
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
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }}, '#ddtree');
            ddtreeObj.showPopup();
            scrollBy({top: 500, behavior: 'smooth'});
            (ddtreeObj as any).popupObj.trigger('targetExitViewport');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
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
            ddTreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#default');
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