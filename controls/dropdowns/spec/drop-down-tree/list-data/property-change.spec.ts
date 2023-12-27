import { setCulture, createElement } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { listData, localData1, localData2, localDataString } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('DropDownTree control', () => {
    describe('List datasource property-change testing', () => {
        let ddtreeObj: any;
        let mouseEventArgs: any;
        let originalTimeout: any;
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
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };

            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(ele);
            ddtreeObj = undefined
        });
        afterEach((): void => {
            if (ddtreeObj)
                ddtreeObj.destroy();
            document.body.innerHTML = '';
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        /**
         * enableRtl property
         */
        it('enableRtl', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, enableRtl: true }, '#ddtree');
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(ddtreeObj.element.parentElement.classList.contains('e-rtl')).toEqual(true);
            expect((ddtreeObj as any).popupObj.element.classList.contains('e-rtl')).toBe(true);
            expect((ddtreeObj as any).popupObj.enableRtl).toEqual(true);
            expect((ddtreeObj as any).treeObj.element.classList.contains('e-rtl')).toBe(true);
            expect((ddtreeObj as any).treeObj.enableRtl).toEqual(true);
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            ddtreeObj.enableRtl = false;
            ddtreeObj.dataBind();
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect((ddtreeObj as any).element.parentElement.classList.contains('e-rtl')).toEqual(false);
            expect((ddtreeObj as any).popupObj.element.classList.contains('e-rtl')).toBe(false);
            expect((ddtreeObj as any).popupObj.enableRtl).toEqual(false);
            expect((ddtreeObj as any).treeObj.element.classList.contains('e-rtl')).toBe(false);
            expect((ddtreeObj as any).treeObj.enableRtl).toEqual(false);
            ddtreeObj.enableRtl = true;
            ddtreeObj.dataBind();
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect((ddtreeObj as any).element.parentElement.classList.contains('e-rtl')).toEqual(true);
            expect((ddtreeObj as any).popupObj.element.classList.contains('e-rtl')).toBe(true);
            expect((ddtreeObj as any).popupObj.enableRtl).toEqual(true);
            expect((ddtreeObj as any).treeObj.element.classList.contains('e-rtl')).toBe(true);
            expect((ddtreeObj as any).treeObj.enableRtl).toEqual(true);
        });
        /**
         * cssclass property
         */
        it('cssClass', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, cssClass: 'custom-dropdowntree' }, '#ddtree');
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect((ddtreeObj as any).element.parentElement.classList.contains('custom-dropdowntree')).toBe(true);
            expect((ddtreeObj as any).popupObj.element.classList.contains('custom-dropdowntree')).toBe(true);
            ddtreeObj.cssClass = 'demo-dropdowntree';
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).element.parentElement.classList.contains('custom-dropdowntree')).toBe(false);
            expect((ddtreeObj as any).popupObj.element.classList.contains('custom-dropdowntree')).toBe(false);
            expect((ddtreeObj as any).element.parentElement.classList.contains('demo-dropdowntree')).toBe(true);
            expect((ddtreeObj as any).popupObj.element.classList.contains('demo-dropdowntree')).toBe(true);
        });

        /**
         * enabled property
         */

        it('enabled', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, enabled: false }, '#ddtree');
            expect(ddtreeObj.element.parentElement.classList.contains('e-disabled')).toBe(true);
            expect(ddtreeObj.element.classList.contains('e-disabled')).toBe(true);
            expect(ddtreeObj.element.getAttribute('aria-disabled')).toBe('true');
            expect(ddtreeObj.element.parentElement.getAttribute('aria-disabled')).toBe('true');
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toEqual("false");
            ddtreeObj.showPopup();
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toEqual("false");
            ddtreeObj.enabled = true;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.classList.contains('e-disabled')).toBe(false);
            expect(ddtreeObj.element.classList.contains('e-disabled')).toBe(false);
            expect(ddtreeObj.element.getAttribute('aria-disabled')).toBe('false');
            ddtreeObj.value = ['21'];
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe("India");
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(document.querySelectorAll('.e-popup').length).toBe(1);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            ddtreeObj.hidePopup();
            ddtreeObj.enabled = false;
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(false);
            expect(ddtreeObj.element.parentElement.classList.contains('e-disabled')).toBe(true);
            expect(ddtreeObj.element.classList.contains('e-disabled')).toBe(true);
            expect(ddtreeObj.element.getAttribute('aria-disabled')).toBe('true');
            (ddtreeObj as any).mouseIn(mouseEventArgs);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            var ele1: HTMLElement = (ddtreeObj as any).element.nextElementSibling;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            expect((ddtreeObj as any).element.value).not.toBe("");
            (ddtreeObj as any).onMouseLeave(mouseEventArgs);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
        });

        /**
         * htmlAttributes
         */

        it('htmlAttributes', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            ddtreeObj.htmlAttributes = { disabled: 'disabled' };
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.classList.contains('e-disabled')).toBe(true);
            expect(ddtreeObj.element.classList.contains('e-disabled')).toBe(true);
            expect(ddtreeObj.element.getAttribute('aria-disabled')).toBe('true');
            expect(ddtreeObj.element.parentElement.getAttribute('aria-disabled')).toBe('true');

        });

        /**
         * readonly property
         */
        it('readonly', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, readonly: true }, '#ddtree');
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toEqual("false");
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toEqual("false");
            ddtreeObj.readonly = false;
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            expect(document.querySelectorAll('.e-popup').length).toBe(1);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toEqual("true");
        });

        /**
         * text
         */

        it('text', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" }, text: 'Australia', treeSettings: { loadOnDemand: true } }, '#ddtree');
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(9);
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.value[0]).toBe('1');
            ddtreeObj.showPopup();
            ddtreeObj.text = 'India';
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('India');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.value[0]).toBe('21');
            ddtreeObj.text = 'aaaaa';
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('India');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.value[0]).toBe('21');
        });

        /**
         * value
         */

        it('value', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: localDataString, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" }, value: ['1'], treeSettings: { loadOnDemand: true } }, '#ddtree');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            ddtreeObj.showPopup();
            ddtreeObj.value = ['21'];
            ddtreeObj.dataBind();
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.text).not.toBe('Australia');
            expect(ddtreeObj.text).toBe('India');
        });

        /**
         * autocheck
         */

        it('dynamic autocheck', () => {
            ddtreeObj = new DropDownTree({width: "600px", fields: { dataSource: localDataString, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" }, value: ['2','3', '4', '6'], allowMultiSelection: true, mode: 'Box' }, '#ddtree');
            ddtreeObj.treeSettings.autoCheck = true;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.querySelector(".e-chips-wrapper").classList.contains("e-icon-hide")).toBe(true);
            expect(ddtreeObj.value.length).toBe(4);
        });

        /**
        * Width property
        */

        it('width', () => {
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
            ddtreeObj.width = undefined;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('60px');
            ddtreeObj.width = null;
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.style.width).toEqual('60px');
        });


        /**
        * popupHeight and popupWidth
        */
        it('popupHeight and popupWidth', () => {
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

        /**
         * zIndex
         */
        it('zIndex', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            ddtreeObj.zIndex = 1333;
            ddtreeObj.dataBind();
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.zIndex === '1333').toBe(true);
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

        /**
         * floatLabelType
         */
        it('floatLabelType', () => {
            ddtreeObj = new DropDownTree({ placeholder: null }, '#ddtree');
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual(null);
            ddtreeObj.placeholder = 'Enter text';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual('Enter text');
            ddtreeObj.floatLabelType = 'Auto';
            ddtreeObj.dataBind();
            mouseEventArgs.target = document.body;
            let floatElement = (ddtreeObj as any).inputWrapper.querySelector('.e-float-text')
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
            ddtreeObj.onFocusOut();
            ddtreeObj.floatLabelType = 'Always';
            ddtreeObj.dataBind();
            mouseEventArgs.target = document.body;
            let floatElement1 = (ddtreeObj as any).inputWrapper.querySelector('.e-float-text')
            expect(floatElement1.classList.contains('e-label-top')).toBe(true);
            ddtreeObj.onFocusOut();
            ddtreeObj.floatLabelType = 'Never';
            ddtreeObj.dataBind();
            mouseEventArgs.target = document.body;
            let floatElement2 = (ddtreeObj as any).inputWrapper.querySelector('.e-float-text')
            expect(floatElement2).toBe(null);
            ddtreeObj.onFocusOut();
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
            ddtreeObj.showDropDownIcon = true;
            ddtreeObj.dataBind();
            expect((ddtreeObj).element.parentElement.lastElementChild.classList.contains('e-icon-hide')).toBe(false);
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
            var ele1: HTMLElement = (ddtreeObj as any).element.nextElementSibling;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
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
            var ele1: HTMLElement = (ddtreeObj as any).element.nextElementSibling;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
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
         * allowMultiSelection
         */

        it('allowMultiSelection enabled with Delimiter mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true }, allowMultiSelection: true, mode: 'Delimiter' }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            // ctrl key pressed
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[0].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            expect(ddtreeObj.element.previousElementSibling.firstElementChild.getAttribute('value')).toBe('1');
            expect(ddtreeObj.element.previousElementSibling.firstElementChild.nextElementSibling.getAttribute('value')).toBe('3');
            // checking shift key
            mouseEventArgs.ctrlKey = false;
            mouseEventArgs.shiftKey = true;
            mouseEventArgs.target = li[5].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.text).toBe('Victoria,South Australia,Western Australia,Brazil');
            expect(ddtreeObj.value.length).toBe(4);
            expect(ddtreeObj.value[3]).toBe('7');
            let ele1 = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.allowMultiSelection = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Victoria');
            expect(ddtreeObj.value[0]).toBe('3');
            expect(ddtreeObj.value.length).toBe(1);
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            ddtreeObj.mode = 'Box';
            ddtreeObj.dataBind();
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
        });
        it('allowMultiSelection enabled with Box mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true }, allowMultiSelection: true, mode: 'Box' }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            // ctrl key pressed
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[0].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].getAttribute("data-value")).toBe("1");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(ddtreeObj.value[0]).toBe('1');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(2);
            expect(chips_1[1].getAttribute("data-value")).toBe("3");
            expect(chips_1[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chips_1[1].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            // checking shift key
            mouseEventArgs.ctrlKey = false;
            mouseEventArgs.shiftKey = true;
            mouseEventArgs.target = li[5].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.text).toBe('Victoria,South Australia,Western Australia,Brazil');
            expect(ddtreeObj.value.length).toBe(4);
            expect(ddtreeObj.value[3]).toBe('7');
            let chips_2 = chipElement.querySelectorAll('.e-chips');
            expect(chips_2.length).toBe(4);
            expect(chips_2[0].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(chips_2[1].querySelector(".e-chipcontent").textContent).toBe("South Australia");
            expect(chips_2[2].querySelector(".e-chipcontent").textContent).toBe("Western Australia");
            expect(chips_2[3].querySelector(".e-chipcontent").textContent).toBe("Brazil");
            let ele1 = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.allowMultiSelection = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Victoria');
            expect(ddtreeObj.value[0]).toBe('3');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_3 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(0);
            ddtreeObj.delimiterChar = '?';
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
        });
        it('allowMultiSelection enabled with Default mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, allowMultiSelection: true, mode: 'Default', treeSettings: { loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            // ctrl key pressed
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[0].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].getAttribute("data-value")).toBe("1");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(ddtreeObj.value[0]).toBe('1');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(2);
            expect(chips_1[1].getAttribute("data-value")).toBe("3");
            expect(chips_1[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chips_1[1].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            // checking shift key
            mouseEventArgs.ctrlKey = false;
            mouseEventArgs.shiftKey = true;
            mouseEventArgs.target = li[5].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.text).toBe('Victoria,South Australia,Western Australia,Brazil');
            expect(ddtreeObj.value.length).toBe(4);
            expect(ddtreeObj.value[3]).toBe('7');
            let chips_2 = chipElement.querySelectorAll('.e-chips');
            expect(chips_2.length).toBe(4);
            expect(chips_2[0].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(chips_2[1].querySelector(".e-chipcontent").textContent).toBe("South Australia");
            expect(chips_2[2].querySelector(".e-chipcontent").textContent).toBe("Western Australia");
            expect(chips_2[3].querySelector(".e-chipcontent").textContent).toBe("Brazil");
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.allowMultiSelection = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Victoria');
            expect(ddtreeObj.value[0]).toBe('3');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_3 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(0);
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
        });
        it('allowMultiSelection enabled dynamically with Default mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true },wrapText: true }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            // ctrl key pressed
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[0].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.allowMultiSelection = true;
            ddtreeObj.dataBind();
            ddtreeObj.onFocusOut();
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].getAttribute("data-value")).toBe("1");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.showPopup();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(2);
            expect(chips_1[1].getAttribute("data-value")).toBe("3");
            expect(chips_1[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chips_1[1].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.allowMultiSelection = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_3 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(0);
        });
        it('allowMultiSelection enabled dynamically with Box mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, wrapText: true, treeSettings: { loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            // ctrl key pressed
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[0].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.allowMultiSelection = true;
            ddtreeObj.mode = 'Box';
            ddtreeObj.dataBind();
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].getAttribute("data-value")).toBe("1");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(2);
            expect(chips_1[1].getAttribute("data-value")).toBe("3");
            expect(chips_1[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chips_1[1].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.allowMultiSelection = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_3 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(0);
        });
        it('allowMultiSelection enabled dynamically with Delimiter mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            // ctrl key pressed
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[0].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.allowMultiSelection = true;
            ddtreeObj.mode = 'Delimiter';
            ddtreeObj.dataBind();
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(false);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            ddtreeObj.allowMultiSelection = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_3 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(0);
        });

        /**
         * mode
         */
        it('Switching between various mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, wrapText: true, treeSettings: { loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            // ctrl key pressed
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[0].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.allowMultiSelection = true;
            ddtreeObj.dataBind();
            ddtreeObj.onFocusOut();
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].getAttribute("data-value")).toBe("1");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.showPopup();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(2);
            expect(chips_1[1].getAttribute("data-value")).toBe("3");
            expect(chips_1[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chips_1[1].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.mode = 'Delimiter';
            ddtreeObj.dataBind();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            var chips_2 = nchipElement.querySelectorAll('.e-chips');
            expect(chips_2.length).toBe(0);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[5].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[5].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria,Brazil');
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(chips_2.length).toBe(0);
            (ddtreeObj as any).onFocusOut();
            ddtreeObj.mode = 'Box';
            ddtreeObj.dataBind();
            var newchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            var chips_3 = newchipElement.querySelectorAll('.e-chips');
            expect(chips_3[1].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(chips_3.length).toBe(3);
            ddtreeObj.allowMultiSelection = false;
            ddtreeObj.mode = 'Box';
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_4 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_4.length).toBe(0);
        });

        /**
         * delimiterChar
         */
        it('Delimiter char', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true }, allowMultiSelection: true, mode: 'Delimiter' }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            // ctrl key pressed
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[0].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            ddtreeObj.delimiterChar = ':';
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            expect(ddtreeObj.element.value).toBe('Australia: Victoria');
            ddtreeObj.delimiterChar = ';';
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            expect(ddtreeObj.element.value).toBe('Australia; Victoria');
            ddtreeObj.value = ['21', '7']
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('India,Brazil');
            expect(ddtreeObj.element.value).toBe('India; Brazil');
            ddtreeObj.text = 'Australia;China';
            ddtreeObj.dataBind();
            expect(ddtreeObj.value.length).toBe(2);
            ddtreeObj.allowMultiSelection = false;
            ddtreeObj.delimiterChar = '?';
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
        });
        /**
         * showCheckBox
         */
        it('showCheckBox enabled with Delimiter mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, mode: 'Delimiter' }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
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
            expect(ddtreeObj.value[1]).toBe('2');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Brazil');
            expect(ddtreeObj.value[2]).toBe('7');
            ddtreeObj.showCheckBox = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
            ddtreeObj.showCheckBox = true;
            ddtreeObj.dataBind();
            ddtreeObj.showPopup();
            expect(ddtreeObj.text).toBe('Australia');
        });

        it('showCheckBox enabled with Box mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },wrapText: true, showCheckBox: true, mode: 'Box' }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].getAttribute("data-value")).toBe("1");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales');
            expect(ddtreeObj.value[1]).toBe('2');
            let nchips = chipElement.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(2);
            expect(nchips[1].getAttribute("data-value")).toBe("2");
            expect(nchips[1].querySelector(".e-chipcontent").textContent).toBe("New South Wales");
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Brazil');
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(3);
            expect(chips_1[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chips_1[1].querySelector(".e-chipcontent").textContent).toBe("New South Wales");
            expect(chips_1[2].querySelector(".e-chipcontent").textContent).toBe("Brazil");
            expect(ddtreeObj.value[2]).toBe('7');
            ddtreeObj.showCheckBox = false;
            ddtreeObj.dataBind();
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_3 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(0);
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
            ddtreeObj.delimiterChar = '?';
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
        });

        it('showCheckBox enabled with Default mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, wrapText: true }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.value[0]).toBe('1');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            (ddtreeObj as any).onFocusOut();
            expect(ddtreeObj.text).toBe('Australia');
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.value[1]).toBe('2');
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(2);
            (ddtreeObj as any).onFocusOut();
            expect(ddtreeObj.text).toBe('Australia,New South Wales');
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Brazil');
            expect(ddtreeObj.value[2]).toBe('7');
            let chips_2 = chipElement.querySelectorAll('.e-chips');
            expect(chips_2.length).toBe(3);
            ddtreeObj.showCheckBox = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_3 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(0);
        });

        /**
         * loadOnDemand
         */
        it('loadOnDemand dynamically disabled', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, treeSettings: { autoCheck: true, loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle[2].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.value[0]).toBe('3');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].getAttribute("data-value")).toBe("3");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(ddtreeObj.text).toBe('Victoria');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.value.length).toBe(5);
            let nchips = chipElement.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(5);
            expect(nchips[1].querySelector(".e-chipcontent").textContent).toBe("Brazil");
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(ddtreeObj.text).toBe('Victoria,Brazil,Paraná,Ceará,Acre');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.showPopup();
            ddtreeObj.treeSettings.loadOnDemand = false;
            ddtreeObj.dataBind();
            let nchips_1 = chipElement.querySelectorAll('.e-chips');
            expect(nchips_1.length).toBe(5);
            expect(nchips_1[4].querySelector(".e-chipcontent").textContent).toBe("Acre");
            (ddtreeObj as any).onFocusOut();
            expect(ddtreeObj.text).toBe('Victoria,Brazil,Paraná,Ceará,Acre');
            ddtreeObj.showPopup();
            ddtreeObj.showCheckBox = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Victoria');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_3 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(0);
        });
        it('showCheckBox enabled dynamically with Default mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true }, wrapText: true }, '#ddtree');
            let ele = ddtreeObj.element;
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            ddtreeObj.showCheckBox = true;
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].getAttribute("data-value")).toBe("1");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(2);
            expect(chips_1[1].getAttribute("data-value")).toBe("3");
            expect(chips_1[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chips_1[1].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.showCheckBox = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_3 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(0);
        });
        it('showCheckBox enabled dynamically with Delimiter mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            ddtreeObj.showCheckBox = true;
            ddtreeObj.showPopup();
            ddtreeObj.mode = 'Delimiter';
            ddtreeObj.dataBind();
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(false);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,Brazil');
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('7');
            ddtreeObj.showSelectAll = true;
            ddtreeObj.dataBind();
            var selectAllElement = ddtreeObj.popupEle.firstElementChild;
            expect(selectAllElement.classList.contains('e-selectall-parent')).toBe(true);
            expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Select All');
            ddtreeObj.showCheckBox = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_3 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(0);
        });

        it('autoCheck enabled', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, treeSettings: { autoCheck: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.value.length).toBe(5);
            expect(ddtreeObj.value[2]).toBe('3');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(5);
            expect(chips[0].getAttribute("data-value")).toBe("1");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chips[4].querySelector(".e-chipcontent").textContent).toBe("Western Australia");
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.value.length).toBe(9);
            let nchips = chipElement.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(9);
            expect(nchips[7].querySelector(".e-chipcontent").textContent).toBe("Ceará");
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.showPopup();
            ddtreeObj.treeSettings.autoCheck = false;
            ddtreeObj.dataBind();
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[9].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[9].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[9].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.value.length).toBe(10);
            let nchips_1 = chipElement.querySelectorAll('.e-chips');
            expect(nchips_1.length).toBe(10);
            expect(nchips_1[9].querySelector(".e-chipcontent").textContent).toBe("China");
            (ddtreeObj as any).onFocusOut();
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre,China');
            ddtreeObj.showPopup();
            ddtreeObj.showCheckBox = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_3 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(0);
        });

        it('Switching between various mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },wrapText: true }, '#ddtree');
            let ele = ddtreeObj.element;
            ddtreeObj.showCheckBox = true;
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].getAttribute("data-value")).toBe("1");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            ddtreeObj.onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(2);
            expect(chips_1[1].getAttribute("data-value")).toBe("3");
            expect(chips_1[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chips_1[1].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.mode = 'Delimiter';
            ddtreeObj.dataBind();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            var chips_2 = nchipElement.querySelectorAll('.e-chips');
            expect(chips_2.length).toBe(0);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,Victoria,Brazil');
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(chips_2.length).toBe(0);
            (ddtreeObj as any).onFocusOut();
            ddtreeObj.mode = 'Box';
            ddtreeObj.dataBind();
            var newchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            var chips_3 = newchipElement.querySelectorAll('.e-chips');
            expect(chips_3[1].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(chips_3.length).toBe(3);
            ddtreeObj.showCheckBox = false;
            ddtreeObj.mode = 'Box';
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_4 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_4.length).toBe(0);
        });

        it('Delimiter char testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true }, showCheckBox: true, mode: 'Delimiter' }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            ddtreeObj.delimiterChar = ':';
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            expect(ddtreeObj.element.value).toBe('Australia: Victoria');
            ddtreeObj.delimiterChar = ';';
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            expect(ddtreeObj.element.value).toBe('Australia; Victoria');
            ddtreeObj.value = ['21', '7']
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('India,Brazil');
            expect(ddtreeObj.element.value).toBe('India; Brazil');
            ddtreeObj.text = 'Australia;China';
            ddtreeObj.dataBind();
            expect(ddtreeObj.value.length).toBe(2);
            ddtreeObj.showCheckBox = false;
            ddtreeObj.delimiterChar = '?';
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
        });

        /**
         * showSelectAll
         */
        it('ShowSelectAll testing', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showSelectAll: true, showCheckBox: true, mode: 'Delimiter' }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var selectAllElement = ddtreeObj.popupEle.firstElementChild;
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
                    expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Select All');
                    ddtreeObj.selectAllText = 'checkAll';
                    ddtreeObj.unSelectAllText = 'unCheckAll';
                    ddtreeObj.dataBind();
                    expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('checkAll');
                    let nwcheckEle: Element = <Element & NodeListOf<Element>>selectAllElement.querySelector('.e-checkbox-wrapper');
                    var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    nwcheckEle.querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    nwcheckEle.querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    nwcheckEle.querySelector('.e-frame').dispatchEvent(e);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(ddtreeObj.value.length).toBe(24);
                        expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('unCheckAll');
                        ddtreeObj.clear();
                        setTimeout(function () {
                            expect(ddtreeObj.value.length).toBe(0);
                            expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('checkAll');
                            ddtreeObj.showSelectAll = false;
                            ddtreeObj.dataBind();
                            expect(ddtreeObj.popupEle.firstElementChild.classList.contains('e-selectall-parent')).toBe(false);
                            done();
                        }, 400);
                    }, 400);
                }, 400);
            }, 400);
        });

        describe('Template', () => {
            let ddtreeObj: any;
            let mouseEventArgs: any;
            let originalTimeout: any;
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
                let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
                document.body.appendChild(ele);
                ddtreeObj = undefined;
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

            });
            afterEach((): void => {
                if (ddtreeObj)
                    ddtreeObj.destroy();
                document.body.innerHTML = '';
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('headerTemplate support with string', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
                expect(ddtreeObj.headerTemplate).toBe(null);
                ddtreeObj.headerTemplate = '<div class="new headerString"><span>HEADER VIA STRING</span></div>'
                ddtreeObj.dataBind();
                ddtreeObj.showPopup();
                expect(ddtreeObj.headerTemplate).not.toBe(null);
                expect(ddtreeObj.popupObj.element.firstChild.classList.contains('e-ddt-header')).toBe(true);
                expect(ddtreeObj.popupObj.element.firstChild.innerText).toEqual("HEADER VIA STRING");
                ddtreeObj.hidePopup();
                ddtreeObj.headerTemplate = null;
                ddtreeObj.dataBind();
                ddtreeObj.showPopup();
                expect(ddtreeObj.headerTemplate).toBe(null);
                expect(ddtreeObj.popupObj.element.firstChild.classList.contains('e-ddt-header')).toBe(false);
            });
            it('headerTemplate support with script', () => {
                let headerTemplate: Element = createElement('div', { id: 'headerTemplate' });
                headerTemplate.innerHTML = '<div class="header"><span >HEADER Via SCRIPT</span></div>';
                document.body.appendChild(headerTemplate);
                ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
                expect(ddtreeObj.headerTemplate).toBe(null);
                ddtreeObj.headerTemplate = '#headerTemplate';
                ddtreeObj.dataBind();
                ddtreeObj.showPopup();
                expect(ddtreeObj.headerTemplate).not.toBe(null);
                expect(ddtreeObj.popupObj.element.firstChild.classList.contains('e-ddt-header')).toBe(true);
                expect(ddtreeObj.popupObj.element.firstChild.innerText).toEqual("HEADER Via SCRIPT");
                ddtreeObj.hidePopup();
                ddtreeObj.headerTemplate = null;
                ddtreeObj.dataBind();
                ddtreeObj.showPopup();
                expect(ddtreeObj.headerTemplate).toBe(null);
                expect(ddtreeObj.popupObj.element.firstChild.classList.contains('e-ddt-header')).toBe(false);
            });
            it('footerTemplate support with string', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
                expect(ddtreeObj.footerTemplate).toBe(null);
                ddtreeObj.footerTemplate = '<div class="new headerString"><span>FOOTER VIA STRING</span></div>'
                ddtreeObj.dataBind();
                ddtreeObj.showPopup();
                expect(ddtreeObj.footerTemplate).not.toBe(null);
                expect(ddtreeObj.popupObj.element.lastElementChild.classList.contains('e-ddt-footer')).toBe(true);
                expect(ddtreeObj.popupObj.element.lastElementChild.innerText).toEqual("FOOTER VIA STRING");
                ddtreeObj.hidePopup();
                ddtreeObj.footerTemplate = null;
                ddtreeObj.dataBind();
                ddtreeObj.showPopup();
                expect(ddtreeObj.footerTemplate).toBe(null);
                expect(ddtreeObj.popupObj.element.lastElementChild.classList.contains('e-ddt-footer')).toBe(false);
            });
            it('footerTemplate support with script', () => {
                let footerTemplate: Element = createElement('div', { id: 'footerTemplate' });
                footerTemplate.innerHTML = '<div class="footer"><span >FOOTER Via SCRIPT</span></div>';
                document.body.appendChild(footerTemplate);
                ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
                expect(ddtreeObj.footerTemplate).toBe(null);
                ddtreeObj.footerTemplate = '#footerTemplate';
                ddtreeObj.dataBind();
                ddtreeObj.showPopup();
                expect(ddtreeObj.footerTemplate).not.toBe(null);
                expect(ddtreeObj.popupObj.element.lastElementChild.classList.contains('e-ddt-footer')).toBe(true);
                expect(ddtreeObj.popupObj.element.lastElementChild.innerText).toEqual("FOOTER Via SCRIPT");
                ddtreeObj.hidePopup();
                ddtreeObj.footerTemplate = null;
                ddtreeObj.dataBind();
                ddtreeObj.showPopup();
                expect(ddtreeObj.footerTemplate).toBe(null);
                expect(ddtreeObj.popupObj.element.lastElementChild.classList.contains('e-ddt-footer')).toBe(false);
            });
            it('itemtemplate', () => {
                let template: Element = createElement('div', { id: 'template' });
                template.innerHTML = '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                document.body.appendChild(template);
                ddtreeObj = new DropDownTree({ fields: { dataSource: localData1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild", expanded: 'nodeExpanded1' } }, '#ddtree');
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-text-content');
                expect(li[0].querySelector('i')).toBe(null);
                expect(li[0].querySelector('b')).toBe(null);
                ddtreeObj.itemTemplate = 'template';
                ddtreeObj.dataBind();
                let nli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-text-content');
                expect(nli[0].querySelector('i')).toBe(null);
                expect(nli[0].querySelector('b')).toBe(null);
                ddtreeObj.itemTemplate = null;
                ddtreeObj.dataBind();
                let mli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-text-content');
                expect(mli[0].querySelector('i')).toBe(null);
                expect(mli[0].querySelector('b')).toBe(null);
                ddtreeObj.itemTemplate = '#template';
                ddtreeObj.dataBind();
                let ali: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-text-content');
                expect(ali[0].querySelector('i')).not.toBe(null);
                expect(ali[0].querySelector('b')).toBe(null);
                ddtreeObj.itemTemplate = '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                ddtreeObj.dataBind();
                let bli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-text-content');
                expect(bli[0].querySelector('i')).not.toBe(null);
                expect(bli[0].querySelector('b')).toBe(null);
            });
        });
        describe('- noRecordTemplate', () => {
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

        describe('- fields', () => {
            let originalTimeout: any;
            let ddtreeObj: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            let keyboardEventArgs: any = {
                preventDefault: (): void => { },
                action: null,
                target: null,
                stopImmediatePropagation: (): void => { },
            };
            beforeEach((): void => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
                document.body.appendChild(ele);
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: localData2, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected'
                    },
                    treeSettings: { loadOnDemand: true }
                });
                ddtreeObj.appendTo(ele);
            });
            afterEach(() => {
                if (ddtreeObj)
                    ddtreeObj.destroy();
                document.body.innerHTML = '';
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('dataSource property', () => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                ddtreeObj.fields.dataSource = localData1;
                ddtreeObj.dataBind();
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(5);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields text property', () => {
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                ddtreeObj.fields = { text: 'subText' };
                ddtreeObj.dataBind();
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Pictures');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields value property', () => {
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                ddtreeObj.fields = { value: 'subId' };
                ddtreeObj.dataBind();
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('21');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields parentValue property', () => {
                var ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                expect(li[0].childElementCount).toBe(2);
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                expect(li[0].childElementCount).toBe(3);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(li[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Wind.jpg');
                expect(li[0].querySelector('.e-list-parent').querySelector('.e-list-item').getAttribute('data-uid')).toBe('01-01');
                let cli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                expect(cli[1].childElementCount).toBe(2);
                mouseEventArgs.target = cli[1].querySelector('.e-icons');
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                expect(cli[1].childElementCount).toBe(2);
                expect(cli[1].querySelector('.e-icons')).toBe(null);
                ddtreeObj.fields = { value: 'subId', parentValue: "subPid" };
                ddtreeObj.dataBind();
                let newli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = newli[0].querySelector('.e-icons');
                expect(newli[0].childElementCount).toBe(2);
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                expect(newli[0].childElementCount).toBe(3);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('21');
                expect(newli[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Wind.jpg');
                expect(newli[0].querySelector('.e-list-parent').querySelector('.e-list-item').getAttribute('data-uid')).toBe('21-01');
                let dli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                expect(dli[1].childElementCount).toBe(2);
                expect(cli[1].querySelector('.e-icons')).toBe(null);
            });
            it('fields hasChildren property', () => {
                var ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                expect(li[0].childElementCount).toBe(2);
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                expect(li[0].childElementCount).toBe(3);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(li[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Wind.jpg');
                expect(li[0].querySelector('.e-list-parent').querySelector('.e-list-item').getAttribute('data-uid')).toBe('01-01');
                let cli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                expect(cli[1].childElementCount).toBe(2);
                mouseEventArgs.target = cli[1].querySelector('.e-icons');
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                expect(cli[1].childElementCount).toBe(2);
                expect(cli[1].querySelector('.e-icons')).toBe(null);
                ddtreeObj.fields = { hasChildren: 'subHasChild' };
                ddtreeObj.dataBind();
                let newli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = newli[0].querySelector('.e-icons');
                expect(newli[0].childElementCount).toBe(2);
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                expect(newli[0].childElementCount).toBe(2);
                expect(newli[0].querySelector('.e-icons')).toBe(null);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
            });
            it('fields iconCss property', () => {
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                ddtreeObj.fields = { iconCss: 'subIcon' };
                ddtreeObj.dataBind();
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields imageUrl property', () => {
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                ddtreeObj.fields = { imageUrl: 'subImage' };
                ddtreeObj.dataBind();
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Cricket.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields tooltip property', () => {
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                ddtreeObj.fields = { tooltip: 'subTooltip' };
                ddtreeObj.dataBind();
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Pictures node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields htmlAttributes property', () => {
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                ddtreeObj.fields = { htmlAttributes: 'subHtmlAttr' };
                ddtreeObj.dataBind();
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('customnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('blue');
            });
            it('fields expanded property', () => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                ddtreeObj.fields = { expanded: 'subExpanded' };
                ddtreeObj.dataBind();
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(3);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[0].childElementCount).toBe(3);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[2].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[2].style.backgroundColor).toBe('red');
            });
            it('fields selected property', () => {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(false);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                ddtreeObj.fields = { selected: 'subSelected' };
                ddtreeObj.dataBind();
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(false);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });

            /**
             * sortOrder property
             */
            it('sortOrder', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                expect(li.length).toBe(2);
                expect(li[0].querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(li[0].getAttribute('data-uid')).toBe('01');
                ddtreeObj.sortOrder = 'Ascending';
                ddtreeObj.dataBind();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    let li1: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                    expect(li1.length).toBe(2);
                    expect(li1[0].querySelector('.e-list-text').innerHTML).toBe('Downloads');
                    expect(li1[0].getAttribute('data-uid')).toBe('02');
                    ddtreeObj.sortOrder = 'Descending';
                    ddtreeObj.dataBind();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let li2: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                        expect(li2.length).toBe(2);
                        expect(li2[0].querySelector('.e-list-text').innerHTML).toBe('Music');
                        expect(li2[0].getAttribute('data-uid')).toBe('01');
                        ddtreeObj.sortOrder = 'Ascending';
                        ddtreeObj.dataBind();
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function () {
                            let li3: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                            expect(li3.length).toBe(2);
                            expect(li3[0].querySelector('.e-list-text').innerHTML).toBe('Downloads');
                            expect(li3[0].getAttribute('data-uid')).toBe('02');
                            ddtreeObj.sortOrder = 'None';
                            ddtreeObj.dataBind();
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function () {
                                let li4: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                                expect(li4.length).toBe(2);
                                expect(li4[0].querySelector('.e-list-text').innerHTML).toBe('Music');
                                expect(li4[0].getAttribute('data-uid')).toBe('01');
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            });

            it('click', (done: Function) => {
                ddtreeObj.showPopup();
                ddtreeObj.treeSettings.expandOn = 'Click';
                ddtreeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(2);
                ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                setTimeout(function () {
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[0].childElementCount).toBe(3);
                    expect(li[0].getAttribute('aria-expanded')).toBe('true');
                    ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                    setTimeout(function () {
                        expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                        expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[0].getAttribute('aria-expanded')).toBe('false');
                        expect((li[0]).classList.contains('e-node-collapsed')).toBe(true);
                        ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                        setTimeout(function () {
                            expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                            expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                            expect(li[0].getAttribute('aria-expanded')).toBe('true');
                            expect((li[0]).classList.contains('e-node-collapsed')).toBe(false);
                            let newli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                            expect(newli[1].querySelector('.e-icons')).not.toBe(null);
                            expect(newli[1].childElementCount).toBe(2);
                            mouseEventArgs.target = newli[1].querySelector('.e-list-text');
                            ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                            setTimeout(function() {
                                expect(newli[1].querySelector('.e-icons')).toBe(null);
                                expect(newli[1].getAttribute('aria-expanded')).toBe(null);
                                done();
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('None', (done: Function) => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: localData1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild" } }, '#ddtree');
                ddtreeObj.showPopup();
                ddtreeObj.treeSettings.expandOn = 'None';
                ddtreeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                setTimeout(function () {
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                    done();
                }, 100);
            });
        });
    });
});