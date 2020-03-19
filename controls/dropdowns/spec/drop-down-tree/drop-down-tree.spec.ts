import { Browser, createElement, L10n, setCulture } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../src/drop-down-tree/drop-down-tree';
import { listData } from '../../spec/drop-down-tree/dataSource.spec'
import '../../node_modules/es6-promise/dist/es6-promise';

L10n.load({
    'fr': {
        'dropdowntree': {
            noRecordsTemplate: "Pas de modèle d'enregistrement"
        }
    },
    'es': {
        'dropdowntree': {
            noRecordsTemplate: "Pas de",
            actionFailureTemplate: "Pas de"
        }
    }
});


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
        /**
        * Width
        */
        it('Width validation', () => {
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
        /**
           * cssclass property
           */
        it('cssClass testing with valid class name', () => {
            ddtreeObj = new DropDownTree({ cssClass: 'custom-dropdowntree' }, '#ddtree');
            expect(ddtreeObj.element.parentElement.classList.contains('custom-dropdowntree')).toBe(true);
            ddtreeObj.cssClass = 'demo-dropdowntree';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.classList.contains('custom-dropdowntree')).toBe(false);
            expect(ddtreeObj.element.parentElement.classList.contains('demo-dropdowntree')).toBe(true);
        });
        it('cssClass testing with class name as null', () => {
            ddtreeObj = new DropDownTree({ cssClass: null }, '#ddtree');
            expect(ddtreeObj.element.parentElement.classList.contains('custom-dropdowntree')).toBe(false);
            expect(ddtreeObj.element.parentElement.classList.contains('e-ddt')).toBe(true);
            ddtreeObj.cssClass = 'custom-dropdowntree';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.classList.contains('custom-dropdowntree')).toBe(true);
        });
        it('cssClass testing with class name as undefined', () => {
            ddtreeObj = new DropDownTree({ cssClass: undefined }, '#ddtree');
            expect(ddtreeObj.element.parentElement.classList.contains('custom-dropdowntree')).toBe(false);
            expect(ddtreeObj.element.parentElement.classList.contains('e-ddt')).toBe(true);
            ddtreeObj.cssClass = 'custom-dropdowntree';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.classList.contains('custom-dropdowntree')).toBe(true);
        });
        it('cssClass testing with class name as empty string', () => {
            ddtreeObj = new DropDownTree({ cssClass: '' }, '#ddtree');
            expect(ddtreeObj.element.parentElement.classList.contains('custom-dropdowntree')).toBe(false);
            expect(ddtreeObj.element.parentElement.classList.contains('e-ddt')).toBe(true);
            ddtreeObj.cssClass = 'custom-dropdowntree';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.classList.contains('custom-dropdowntree')).toBe(true);
        });

        /**
         * enableRtl property
         */
        it('enableRtl ', () => {
            ddtreeObj = new DropDownTree({ enableRtl: true }, '#ddtree');
            expect(ddtreeObj.element.parentElement.classList.contains('e-rtl')).toEqual(true);
            ddtreeObj.enableRtl = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.classList.contains('e-rtl')).toEqual(false);
            ddtreeObj.enableRtl = true;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.classList.contains('e-rtl')).toEqual(true);
        });
        it('enableRtl with value as false ', () => {
            ddtreeObj = new DropDownTree({ enableRtl: false }, '#ddtree');
            expect(ddtreeObj.element.parentElement.classList.contains('e-rtl')).toEqual(false);
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var ele = document.body;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            ddtreeObj.enableRtl = true;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.classList.contains('e-rtl')).toEqual(true);
            ddtreeObj.enableRtl = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.classList.contains('e-rtl')).toEqual(false);
        });

        /**
         * Width property with unit as em
         */

        it('Set the width to unit em', () => {
            ddtreeObj = new DropDownTree({ width: "30em" }, '#ddtree');
            ddtreeObj.width = '400px';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('400px');
            ddtreeObj.width = '50em';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('50em');
            ddtreeObj.width = '20%';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('20%');
            ddtreeObj.width = '30';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('30px');
            ddtreeObj.width = 60;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('60px');
        });

        /**
        * Width property with unit as em
        */

        it('Set the width to unit em', () => {
            ddtreeObj = new DropDownTree({ width: "30em" }, '#ddtree');
            expect(ddtreeObj.element.parentElement.style.width).toEqual('30em');
            ddtreeObj.width = '400px';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('400px');
            ddtreeObj.width = '50em';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('50em');
            ddtreeObj.width = '20%';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('20%');
            ddtreeObj.width = '30';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('30px');
            ddtreeObj.width = 60;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('60px');
        });
        /**
        * Width property with unit as px
        */
        it('Set the width to unit px', () => {
            ddtreeObj = new DropDownTree({ width: "100px" }, '#ddtree');
            expect(ddtreeObj.element.parentElement.style.width).toEqual('100px');
            ddtreeObj.width = '30em';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('30em');
            ddtreeObj.width = '200px';
            ddtreeObj.popupWidth = '300px';
            ddtreeObj.showPopup();
            ddtreeObj.popupHeight = '300px';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('200px');
            expect((ddtreeObj as any).popupObj.element.style.width).toEqual('300px');
            expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('300px');

        });
        /**
         * Width property with unit as %
         */
        it('Set the width to unit %', () => {
            ddtreeObj = new DropDownTree({ width: "100%" }, '#ddtree');
            expect(ddtreeObj.element.parentElement.style.width).toEqual('100%');
            ddtreeObj.width = '200px';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('200px');
            ddtreeObj.width = '30em';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('30em');
            ddtreeObj.width = undefined;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('30em');
            ddtreeObj.width = '30em';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('30em');
        });
         /**
         * Width property with unit as %
         */
        it('Set the popupHeight', () => {
            ddtreeObj = new DropDownTree({ width: "100%", popupHeight: '300px', popupWidth: '300px' }, '#ddtree');
            expect(ddtreeObj.element.parentElement.style.width).toEqual('100%');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.width).toEqual('300px');
            expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('300px');
            ddtreeObj.width = '200px';
            ddtreeObj.popupHeight = '100px';
            ddtreeObj.popupWidth = '100px';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('200px');
            expect((ddtreeObj as any).popupObj.element.style.width).toEqual('100px');
            expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('100px');
            ddtreeObj.width = '30em';
            ddtreeObj.popupHeight = '10em';
            ddtreeObj.popupWidth = '20em';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('30em');
            expect((ddtreeObj as any).popupObj.element.style.width).toEqual('20em');
            expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('10em');
            ddtreeObj.width = undefined;
            ddtreeObj.popupHeight = undefined;
            ddtreeObj.popupWidth = undefined
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('30em');
            expect((ddtreeObj as any).popupObj.element.style.width).toEqual('20em');
            expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('10em');
            ddtreeObj.width = '30em';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('30em');
        });

        it('Set the width to  null value', () => {
            ddtreeObj = new DropDownTree({ width: null }, '#ddtree');
            expect(ddtreeObj.element.parentElement.style.width).toEqual('');
            ddtreeObj.width = 200;
            ddtreeObj.popupHeight = 300;
            ddtreeObj.popupWidth = 300;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('200px');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.width).toEqual('300px');
            expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('300px');

            ddtreeObj.width = undefined;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('200px');
        });
        it('Set the width to  undefined', () => {
            ddtreeObj = new DropDownTree({}, '#ddtree');
            expect(ddtreeObj.element.parentElement.style.width).toEqual('100%');
            ddtreeObj.width = undefined;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('100%');
            ddtreeObj.width = null;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('100%');
            ddtreeObj.width = 60;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('60px');
        });
        /**
         * place holder property 
         */
        it('placeholder with valid name ', () => {
            ddtreeObj = new DropDownTree({ placeholder: 'Placeholder' }, '#ddtree');
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual('Placeholder');
            ddtreeObj.placeholder = 'Enter text';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual('Enter text');
        });
        it('placeholder with empty value', () => {
            ddtreeObj = new DropDownTree({ placeholder: '' }, '#ddtree');
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual(null);
            ddtreeObj.placeholder = 'Enter text';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual('Enter text');
        });
        it('placeholder with null value', () => {
            ddtreeObj = new DropDownTree({ placeholder: null }, '#ddtree');
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual(null);
            ddtreeObj.placeholder = 'Enter text';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual('Enter text');
            ddtreeObj.placeholder = undefined;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual(null);
            ddtreeObj.placeholder = 'Enter text';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual('Enter text');
        });

        it('Persistence testing', () => {
            ddtreeObj = new DropDownTree({}, '#ddtree');
            ddtreeObj.getPersistData();
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
        /**
            * showClearButton property
            */
        it('showClearButton disabled ', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showClearButton: false }, '#ddtree');
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-clear-icon')).toBe(false);
            ddtreeObj.showClearButton = true;
            ddtreeObj.dataBind();
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-clear-icon')).toBe(true);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
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
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            var ele: HTMLElement = (ddtreeObj as any).element.nextElementSibling;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect((ddtreeObj as any).element.value).toBe("");
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
        });
        it('showClearButton Enabled ', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showClearButton: true }, '#ddtree');
            expect((ddtreeObj as any).element.nextElementSibling.classList.contains('e-clear-icon')).toBe(true);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
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
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            var ele: HTMLElement = (ddtreeObj as any).element.nextElementSibling;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect((ddtreeObj as any).element.value).toBe("");
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.showClearButton = false;
            ddtreeObj.dataBind();
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.hidePopup();
            ddtreeObj.showClearButton = true;
            ddtreeObj.dataBind();
            ddtreeObj.showPopup();
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
        });

        /**
         * showDropDownIcon 
         */

        it('ShowDropDownIcon disabled ', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showDropDownIcon: false }, '#ddtree');
            expect((ddtreeObj as any).element.parentElement.lastElementChild.classList.contains('e-ddt-icon')).toBe(false);
            expect(ddtreeObj.element.parentElement.lastElementChild.classList.contains('e-clear-icon')).toBe(true);
            ddtreeObj.showDropDownIcon = true;
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).element.parentElement.lastElementChild.classList.contains('e-ddt-icon')).toBe(true);
            expect(ddtreeObj.element.parentElement.lastElementChild.classList.contains('e-clear-icon')).toBe(false);
            ddtreeObj.showDropDownIcon = false;
            ddtreeObj.dataBind();
            expect((ddtreeObj).element.parentElement.lastElementChild.classList.contains('e-icon-hide')).toBe(true);

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
        it('check zIndex on popup open', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }}, '#ddtree');
            ddtreeObj.zIndex = 1333;
            ddtreeObj.dataBind();
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.zIndex === '1333').toBe(true);
        });
    });

    describe('htmlAttributes testing', () => {
        let ddTreeObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdowntree' });
        element.setAttribute('data-required', 'name');
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            ddTreeObj = new DropDownTree({ fields: { dataSource: listData, value: 'id', parentValue: 'pid', hasChildren: 'hasChild', text: 'name' }, htmlAttributes: { 'data-msg-container-id': 'msgid' } });
            ddTreeObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('functionaliy testing', () => {
            expect(ddTreeObj.hiddenElement.getAttribute('data-msg-container-id')).not.toBeNull();
            expect(ddTreeObj.hiddenElement.getAttribute('data-required')).toBe('name');
            expect(ddTreeObj.htmlAttributes['data-required']).toBe('name');
        });
    });
    describe('Floating label', () => {
        let listObj: DropDownTree;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdowntree' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new DropDownTree({ fields: { dataSource: listData, value: 'id', parentValue: 'pid', hasChildren: 'hasChild', text: 'name' }, floatLabelType: 'Auto' });
            listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });

        it('floating-Auto', () => {
            mouseEventArgs.target = document.body;
            let floatElement = (listObj as any).inputWrapper.querySelector('.e-float-text')
            var ele = listObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
        });

        it('floating-Always', () => {
            listObj.floatLabelType = 'Always';
            listObj.dataBind();
            mouseEventArgs.target = document.body;
            let floatElement = (listObj as any).inputWrapper.querySelector('.e-float-text')
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
        });
    });
    describe('noRecordTemplate testing', () => {
        let ddtreeObj: DropDownTree;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdowntree' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            setCulture('en-US')
            document.body.appendChild(element);
            ddtreeObj = new DropDownTree({ fields: { dataSource: [], value: 'id', parentValue: 'pid', hasChildren: 'hasChild', text: 'name' } });
            ddtreeObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('with default value', () => {
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(true);
            expect((ddtreeObj as any).popupObj.element.firstElementChild.innerText).toBe('No Records Found');

        });
    });
    describe('noRecordTemplate testing', () => {
        let ddtreeObj: DropDownTree;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdowntree' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            setCulture('en-US')
            document.body.appendChild(element);
            ddtreeObj = new DropDownTree({
                fields: { dataSource: [], value: 'id', parentValue: 'pid', hasChildren: 'hasChild', text: 'name' },
                noRecordsTemplate: '<div> There is no records to rendering the list items</div>'
            });
            ddtreeObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });

        it('with custom value', () => {
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(true);
            expect((ddtreeObj as any).popupObj.element.firstElementChild.innerText).toBe('There is no records to rendering the list items');
            ddtreeObj.hidePopup();
            ddtreeObj.noRecordsTemplate = 'Record not found';
            ddtreeObj.dataBind();
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.firstElementChild.innerText).toBe('Record not found');
        });
    });
    describe('noRecordTemplate testing', () => {
        let ddtreeObj: DropDownTree;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdowntree' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            setCulture('en-US')
            document.body.appendChild(element);
            let noRecordTemplate: Element = createElement('div', { id: 'noRecordTemplate' });
            noRecordTemplate.innerHTML = '<div><span>There is no record found</span></div>';
            document.body.appendChild(noRecordTemplate);
            ddtreeObj = new DropDownTree({
                fields: { dataSource: [], value: 'id', parentValue: 'pid', hasChildren: 'hasChild', text: 'name' },
                noRecordsTemplate: '#noRecordTemplate'
            });
            ddtreeObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });

        it('with script', () => {
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(true);
            expect((ddtreeObj as any).popupObj.element.firstElementChild.innerText).toBe('There is no record found');
        });
    });
 /**
     * changeOnBlur testing
     */
    describe('changeOnBlur testing', () => {
        let mouseEventArgs: any;
        let ddtreeObj: any;
        let tapEvent: any;
        let keyboardEventArgs: any = {
            preventDefault: (): void => { },
            action: null,
            target: null,
            stopImmediatePropagation: (): void => { },
        };
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
                ctrlKey: false
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            i = 0, j = 0;
            ddtreeObj = undefined;
            let ele: HTMLElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (ddtreeObj)
                ddtreeObj.destroy();
            document.body.innerHTML = '';
        });
        it('change event should not be triggered at initial rendering', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                changeOnBlur: false,
                value: ['1'],
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(i).toBe(0);
            ddtreeObj.value= null;
            ddtreeObj.dataBind();
            expect(i).toBe(1);
            ddtreeObj.onFocusOut();
        });
        it('change event should be triggered while changing the value', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                changeOnBlur: false,
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(i).toBe(1);
            ddtreeObj.onFocusOut();
        });
        it('change event should be triggered while clearing the value', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                changeOnBlur: false,
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(i).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            var ele: HTMLElement = (ddtreeObj as any).element.nextElementSibling;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toBe(2);
            expect(ddtreeObj.text).toBe(null);
            ddtreeObj.onFocusOut();
        });
        it('change event should be triggered while enabling the multiSelection and selecting multiple values', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                changeOnBlur: false,
                allowMultiSelection: true,
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.text).toBe('Australia');
            expect(i).toBe(1);
            expect(ddtreeObj.value[0]).toBe('1');
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(i).toBe(2);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            ddtreeObj.onFocusOut();
        });
        it('change event should be triggered while enabling the checkbox and selection multiple values', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                changeOnBlur: false,
                showCheckBox: true,
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(i).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales');
            expect(i).toBe(2);
            ddtreeObj.onFocusOut();
        });
        it('change event should be triggered while deleting the chip', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                changeOnBlur: false,
                showCheckBox: true,
                mode: 'Box',
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(i).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            var chipDelete = chips_1[0].querySelector('.e-chips-close');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            expect(i).toBe(2);
            expect(ddtreeObj.text).toBe(null);
            ddtreeObj.onFocusOut();
        });
        it('ShowSelectAll testing', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                changeOnBlur: false,
                showCheckBox: true,
                showSelectAll: true,
                mode: 'Box',
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            var selectAllElement = ddtreeObj.popupDiv.firstElementChild;
            expect(i).toBe(0);
            expect(selectAllElement.classList.contains('e-selectall-parent')).toBe(true);
            expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Select All');
            let checkEle: Element = <Element & NodeListOf<Element>>selectAllElement.querySelector('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle.querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle.querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle.querySelector('.e-frame').dispatchEvent(e);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(ddtreeObj.value.length).toBe(24);
                expect(i).toBe(1);
                expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Unselect All');
                let ncheckEle: Element = <Element & NodeListOf<Element>>selectAllElement.querySelector('.e-checkbox-wrapper');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ncheckEle.querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ncheckEle.querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ncheckEle.querySelector('.e-frame').dispatchEvent(e);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(ddtreeObj.value.length).toBe(0);
                    expect(i).toBe(2);
                    expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Select All');
                    done();
                }, 400);
            }, 400);
        });
    });
   
    describe('Method testing', () => {
        let ddtreeObj: any;
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
        it('showPopup testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true } }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.inputWrapper.getAttribute("aria-expanded")).toBe('true');
            expect(document.querySelector('.e-popup').querySelector('.e-treeview')).not.toBe(null);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect(ddtreeObj.element.value).toBe("Australia")
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.inputWrapper.getAttribute("aria-expanded")).toBe('false');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('.e-popup').length).toBe(1);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(false);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(li[0].classList.contains('e-active')).toBe(true);
            ddtreeObj.hidePopup();
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.inputWrapper.getAttribute("aria-expanded")).toBe('false');
        });
        it('hidePopup testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true } }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.inputWrapper.getAttribute("aria-expanded")).toBe('true');
            expect(document.querySelector('.e-popup').querySelector('.e-treeview')).not.toBe(null);
            ddtreeObj.hidePopup();
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.inputWrapper.getAttribute("aria-expanded")).toBe('false');
            ddtreeObj.showPopup();
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect(ddtreeObj.element.value).toBe("Australia")
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.inputWrapper.getAttribute("aria-expanded")).toBe('false');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('.e-popup').length).toBe(1);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(false);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(li[0].classList.contains('e-active')).toBe(true);
            ddtreeObj.hidePopup();
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.inputWrapper.getAttribute("aria-expanded")).toBe('false');
        });
        it('clear testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true } }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelector('.e-popup').querySelector('.e-treeview')).not.toBe(null);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect(ddtreeObj.element.value).toBe("Australia")
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            ddtreeObj.clear();
            expect(ddtreeObj.value.length).toBe(0);
            expect(ddtreeObj.text).toBe(null);
            ddtreeObj.onFocusOut();
            ddtreeObj.clear();
            ddtreeObj.allowMultiSelection = true;
            ddtreeObj.value = ['1', '21'];
            ddtreeObj.dataBind();
            ddtreeObj.clear();
            expect(ddtreeObj.value.length).toBe(0);
            expect(ddtreeObj.text).toBe(null);
        });
        it('getData testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            expect(ddtreeObj.getData().length).toBe(24);
            expect(ddtreeObj.getData('0').length).toBe(0);
            expect(ddtreeObj.getData('1').length).toBe(1);
            expect(ddtreeObj.getData('1')[0].name).toBe('Australia');
        });
        it('ensureVisible', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            ddtreeObj.ensureVisible('22');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(li[19].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                expect(li[19].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                ddtreeObj.ensureVisible(li[12]);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(li[9].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    done();
                }, 450);
            }, 450);
        });
        it('Change Event testing with default value after popup open and close', () => {
            let changed: boolean = false;
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                value: ['1'],
                change: function (args: any) {
                    changed = true;
                }
            }, '#ddtree');
            ddtreeObj.showPopup();
            ddtreeObj.hidePopup();
            ddtreeObj.onFocusOut();
            expect(changed).toBe(false);
        });
        it('Enabling multiselect and using selectAll method and check for the select all checkbox state', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                value: ['1'],
                showCheckBox: true,
                showSelectAll: true,
                allowMultiSelection: true
            }, '#ddtree');
            ddtreeObj.selectAll(true);
            ddtreeObj.showPopup();
            expect(ddtreeObj.popupDiv.querySelectorAll('.e-selectall-parent .e-checkbox-wrapper[aria-checked=true]').length === 1).toBe(true);
            ddtreeObj.hidePopup();
            ddtreeObj.onFocusOut();
        });
        it('Default value select all and remove all check case', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                value: ['1'],
                showCheckBox: true,
                showSelectAll: true,
                allowMultiSelection: true
            }, '#ddtree');
            ddtreeObj.selectAll(true);
            ddtreeObj.selectAll(false);
            expect(ddtreeObj.value.length === 0).toBe(true);
        });
    });
    describe(' Destroy Method testing', () => {
        let ddtreeObj: any;
        let mouseEventArgs: any;
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
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('destroy', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, destroyed: clickFn }, '#ddtree');
            ddtreeObj.destroy();
            expect(ddtreeObj.element.className).toBe('');
            expect(ddtreeObj.element.childElementCount).toBe(0);
        });
        it('destroy after popup click', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, destroyed: clickFn }, '#ddtree');
            ddtreeObj.showPopup();
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect(ddtreeObj.element.value).toBe("Australia")
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            ddtreeObj.destroy();
            expect(ddtreeObj.element.className).toBe('');
            expect(ddtreeObj.element.childElementCount).toBe(0);
            expect(ddtreeObj.value.length).toBe(0);
            expect(ddtreeObj.text).toBe(null);
        });
    });
    describe('DropdownTree events testing', () => {
        let mouseEventArgs: any;
        let ddTreeObj: any;
        let tapEvent: any;
        let keyboardEventArgs: any = {
            preventDefault: (): void => { },
            action: null,
            target: null,
            stopImmediatePropagation: (): void => { },
        };
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
                ctrlKey: false
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            i = 0, j = 0;
            ddTreeObj = undefined;
            let ele: HTMLElement = <HTMLInputElement>createElement('input', { id: 'tree1' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (ddTreeObj)
                ddTreeObj.destroy();
            document.body.innerHTML = '';
        });
        it('created event', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: listData, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected'
                },
                treeSettings: { loadOnDemand: true },
                created: clickFn
            }, '#tree1');
            expect(i).toEqual(1);
        });
        it('dataBond event', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: listData, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected'
                },
                treeSettings: { loadOnDemand: true },
                dataBound: clickFn
            }, '#tree1');
            expect(i).toEqual(1);
        });
        it('beforeOpen event is triggered', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded'
                },
                beforeOpen: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            expect(i).toEqual(0);
            let ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toEqual(1);
            ddTreeObj.hidePopup();
            ddTreeObj.showPopup();
            expect(i).toEqual(2);
        });
        it('open event is triggered', () => {
            ddTreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                open: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            expect(i).toEqual(0);
            let ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toEqual(1);
            ddTreeObj.hidePopup();
            ddTreeObj.showPopup();
            expect(i).toEqual(2);
        });
        it('close event is triggered', () => {
            ddTreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                close: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            expect(i).toEqual(0);
            let ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toEqual(0);
            ddTreeObj.hidePopup();
            expect(i).toEqual(1);
        });
        it('change event is triggered', () => {
            ddTreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                change: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            expect(i).toEqual(0);
            let ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toEqual(0);
            var li = (ddTreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddTreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddTreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect(ddTreeObj.element.value).toBe("Australia");
            (ddTreeObj as any).onFocusOut();
            expect(i).toEqual(1);
        });
        it('beforeOpen event is cancelled', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded'
                },
                beforeOpen: function (args) {
                    args.cancel = true;
                },
                open: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            let ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toEqual(0);
            ddTreeObj.hidePopup();
            expect(i).toEqual(0);
            expect(ddTreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("false");
            expect(ddTreeObj.element.parentElement.getAttribute("aria-haspopup")).toEqual("true");
            expect(document.querySelector('.e-popup')).toBe(null);
        });
        it('select event testing', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded'
                },
                select: clickFn,
            }, '#tree1');
            let ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toEqual(0);
            var li = (ddTreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddTreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddTreeObj.text).toBe("Australia");
            expect(i).toEqual(1);
        });
        it('focus event testing', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded'
                },
                focus: clickFn,
            }, '#tree1');
            expect(i).toEqual(0);
            ddTreeObj.showPopup();
            expect(i).toEqual(1);
        });
        it('blur event testing', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded'
                },
                blur: clickFn,
            }, '#tree1');
            expect(i).toEqual(0);
            ddTreeObj.showPopup();
            var li = (ddTreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddTreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddTreeObj.text).toBe("Australia");
            ddTreeObj.onFocusOut();
            expect(i).toEqual(1);
        });
    });

});