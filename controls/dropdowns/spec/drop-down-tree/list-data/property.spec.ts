import { createElement, L10n, setCulture } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { listData_1, listData, localData1, localDataString } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';


describe('DropDown Tree control List datasource', () => {
    describe('Property testing', () => {
        let originalTimeout: any;
        let ddtreeObj: any;
        let mouseEventArgs: any;
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
        it('for enableRtl true', () => {
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
        });

        it('for enableRtl false', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, enableRtl: false }, '#ddtree');
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
        });

        /**
        * cssclass property
        */
        it('for cssClass with popup', () => {
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
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, cssClass: null }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).element.parentElement.classList.contains('custom-dropdowntree')).toBe(false);
            expect((ddtreeObj as any).popupObj.element.classList.contains('custom-dropdowntree')).toBe(false);
            expect((ddtreeObj as any).element.parentElement.classList.contains(null)).toBe(false);
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, cssClass: undefined }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).element.parentElement.classList.contains('custom-dropdowntree')).toBe(false);
            expect((ddtreeObj as any).popupObj.element.classList.contains('custom-dropdowntree')).toBe(false);
            expect((ddtreeObj as any).element.parentElement.classList.contains(undefined)).toBe(false);
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, cssClass: '' }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).element.parentElement.classList.contains('custom-dropdowntree')).toBe(false);
            expect((ddtreeObj as any).popupObj.element.classList.contains('custom-dropdowntree')).toBe(false);
            expect((ddtreeObj as any).element.parentElement.classList.contains('')).toBe(false);
        });

        /**
        * enabled property
        */

        it('for enabled false', () => {
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
            expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("false");
            ddtreeObj.showPopup();
            expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("false");
        });

        /**
         * enablePersistence property
         */

        it('for enablePersistence', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, enablePersistence: true }, '#ddtree');
            let persisData: any = JSON.parse(ddtreeObj.getPersistData());
            ddtreeObj.showPopup();
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[0].querySelector('.e-icons');
            ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                let seItems: any = JSON.parse(ddtreeObj.getPersistData());
                expect(seItems.value.length).toBe(1);
                expect(seItems.value).toContain('1');
                done();
            }, 450);

        });

        /**
        * readonly property
        */
        it('for readonly true', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, readonly: true }, '#ddtree');
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("false");
            ddtreeObj.showPopup();
            expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("false");
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, readonly: false }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('.e-popup').length).toBe(1);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("true");
        });

        /**
         * Width
         */

        it('for width', () => {
            // Width as em
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, width: "30em" }, '#ddtree');
            expect(ddtreeObj.element.parentElement.style.width).toEqual('30em');
            ddtreeObj.destroy();
            // Width as %
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, width: "80%" }, '#ddtree');
            expect(ddtreeObj.element.parentElement.style.width).toEqual('80%');
            ddtreeObj.destroy();
            // Width as px
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, width: "450px" }, '#ddtree');
            expect(ddtreeObj.element.parentElement.style.width).toEqual('450px');
            ddtreeObj.destroy();
            // Width as number
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, width: 800 }, '#ddtree');
            expect(ddtreeObj.element.parentElement.style.width).toEqual('800px');
            ddtreeObj.destroy();
            // Width as null
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, width: null }, '#ddtree');
            expect(ddtreeObj.element.parentElement.style.width).toEqual('');
            ddtreeObj.destroy()
            // Width as undefined
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, width: undefined }, '#ddtree');
            expect(ddtreeObj.element.parentElement.style.width).toEqual('100%');
        });

        /**
         * popupWidth
         */

        it('for popupWidth', () => {
            // popupWidth as px
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, popupWidth: "450px" }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.width).toEqual('450px');
            ddtreeObj.destroy();
            // popupWidth as number
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, popupWidth: 800 }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.width).toEqual('800px');
            ddtreeObj.destroy();
            // popupWidth as string
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, popupWidth: '800' }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.width).toEqual('800px');
            ddtreeObj.destroy();
            // popupWidth as null
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, popupWidth: null }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.width).toEqual('');
        });

        /**
         * popupHeight
         */
        it('for popupHeight', () => {
            // popupHeight as em
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, popupHeight: "30em" }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('30em');
            ddtreeObj.destroy();
            // popupHeight as px
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, popupHeight: "450px" }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('450px');
            ddtreeObj.destroy();
            // popupHeight as number
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, popupHeight: 800 }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('800px');
            ddtreeObj.destroy();
            // popupWidth as string
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, popupHeight: '800' }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('800px');
            ddtreeObj.destroy();
            // popupHeight as null
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, popupHeight: null }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('');
            ddtreeObj.destroy()
            // popupHeight as undefined
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, popupHeight: undefined }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('300px');
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, popupHeight: '30%' }, '#ddtree');
            ddtreeObj.showPopup();
        });

        /**
         * zIndex
         */

        it('for zIndex', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, zIndex: 2000 }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.style.zIndex === '2000').toBe(true);
        });

        /**
         * sort order property
         */

        it('for sortOrder - Ascending', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: localData1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected'
                },
                sortOrder: 'Ascending'
            }, '#ddtree');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                ddtreeObj.showPopup();
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Documents');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('03');
                done();
            }, 100);
        });
        it('for sortOrder - Descending', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: localData1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected'
                },
                sortOrder: 'Descending'
            }, '#ddtree');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                ddtreeObj.showPopup();
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Videos');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('02');
                done();
            }, 100);
        });

        /**
         * placeholder
         */

        it('for placeholder', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, placeholder: 'Select a Country' }, '#ddtree');
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual('Select a Country');
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, placeholder: '' }, '#ddtree');
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual(null);
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, placeholder: null }, '#ddtree');
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual(null);
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, placeholder: undefined }, '#ddtree');
            expect(ddtreeObj.element.getAttribute('placeholder')).toEqual(null);
        });
        /**
         * FloatLabelType property
         */

        it('for floatLabelType - Auto', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, floatLabelType: 'Auto', placeholder: 'Select a Country' }, '#ddtree');
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
        });

        it('for floatLabelType - Always', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, floatLabelType: 'Always', placeholder: 'Select a Country' }, '#ddtree');
            mouseEventArgs.target = document.body;
            let floatElement = (ddtreeObj as any).inputWrapper.querySelector('.e-float-text')
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
        });

        /**
         * expandOn
         */

        it('for expandOn- None', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { expandOn: 'None' } }, '#ddtree');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                ddtreeObj.showPopup();
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                tapEvent.tapCount = 1;
                mouseEventArgs.target = li[5].querySelector('.e-list-text');
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                tapEvent.tapCount = 2;
                mouseEventArgs.target = li[5].querySelector('.e-list-text');
                expect(li[5].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[5].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[5].childElementCount).toBe(3);
                expect(li[5].querySelector('.e-list-text').childElementCount).toBe(0);
                ddtreeObj.showPopup();
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(li[5].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[5].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    done();
                }, 450);
            }, 100);
        });

        it('for expandOn - Click', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { expandOn: 'Click' }
            }, '#ddtree');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                ddtreeObj.showPopup();
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[5].querySelector('.e-list-text');
                expect(li[5].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[5].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[5].childElementCount).toBe(3);
                expect(li[5].querySelector('.e-list-text').childElementCount).toBe(0);
                ddtreeObj.showPopup();
                ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(li[5].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                    expect(li[5].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    done();
                }, 450);
            }, 100);
        });

        it('for expandOn - DblClick', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { expandOn: 'DblClick' }
            }, '#ddtree');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                ddtreeObj.showPopup();
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[5].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                expect(li[5].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[5].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[5].childElementCount).toBe(3);
                expect(li[5].querySelector('.e-list-text').childElementCount).toBe(0);
                ddtreeObj.showPopup();
                tapEvent.tapCount = 2;
                ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(li[5].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                    expect(li[5].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    done();
                }, 450);
            }, 100);
        });


        /**
         * showDropDownIcon 
         */

        it('for ShowDropDownIcon', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showDropDownIcon: false }, '#ddtree');
            expect((ddtreeObj as any).element.parentElement.lastElementChild.classList.contains('e-ddt-icon')).toBe(false);
            expect(ddtreeObj.element.parentElement.lastElementChild.classList.contains('e-clear-icon')).toBe(true);
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showDropDownIcon: true }, '#ddtree');
            expect((ddtreeObj as any).element.parentElement.lastElementChild.classList.contains('e-ddt-icon')).toBe(true);
            expect(ddtreeObj.element.parentElement.lastElementChild.classList.contains('e-clear-icon')).toBe(false);
        });

        /**
         * showClearButton
         */

        it('for showClearButton', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showClearButton: false }, '#ddtree');
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-clear-icon')).toBe(false);
            ddtreeObj.destroy();
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
            let ele1: HTMLElement = (ddtreeObj as any).element.nextElementSibling;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            expect((ddtreeObj as any).element.value).toBe("");
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
        });

        /**
         * fields
         */

        it('with null fields', () => {
            ddtreeObj = new DropDownTree({ fields: null }, '#ddtree');
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(0);
        });
        it('with empty fields', () => {
            ddtreeObj = new DropDownTree({ fields: {} }, '#ddtree');
            expect(ddtreeObj.element.querySelectorAll('li').length).toBe(0);
        });
        it('with null datasource', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: null } }, '#ddtree');
            expect(ddtreeObj.element.querySelectorAll('li').length).toBe(0);
        });
        it('with empty datasource', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: [] } }, '#ddtree');
            expect(ddtreeObj.element.querySelectorAll('li').length).toBe(0);
        });

        it('without mapping fields', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData_1 }, treeSettings: { loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(10);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Artwork');
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe("1");
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('This is Artwork node');
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            let newli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(newli[2].childElementCount).toBe(3);
            expect((newli[2].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
            expect((newli[2].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
            expect(newli[2].getAttribute('aria-expanded')).toBe('true');
            expect(newli[3].childElementCount).toBe(3);
            expect((newli[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
            expect((newli[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
            expect(newli[3].getAttribute('aria-expanded')).toBe('true');
        });
        it('with mapping fields and value as string', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: localDataString, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChildren" }, treeSettings: { loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(9);
        });
        it('with mapping fields and value as id', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" }, treeSettings: { loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(9);
        });

        /**
         * allowMultiSelection property
         */
        it('for allowMultiSelection with selected attribute provided in datasource', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded', selected: 'isSelected' }, allowMultiSelection: true }, '#ddtree');
            expect(ddtreeObj.text).toBe('New South Wales,Ceará');
            expect(ddtreeObj.value.length).toBe(2)
        });
        it('for allowMultiSelection', () => {
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
        });

        /**
         * mode
         */
        it('for Delimiter mode with allowMultiSelection', () => {
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
        });
        it('for Box mode with allowMultiSelection', () => {
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
        });

        /**
         * Delimiter char
         */
        it('for delimiterChar', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true }, allowMultiSelection: true, mode: 'Delimiter', delimiterChar: '*' }, '#ddtree');
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
            expect(ddtreeObj.element.value).toBe('Australia* Victoria');
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true }, delimiterChar: ':', allowMultiSelection: true, mode: 'Delimiter', value: ['1', '3'] }, '#ddtree');
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            expect(ddtreeObj.element.value).toBe('Australia: Victoria');
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true }, delimiterChar: ';', allowMultiSelection: true, mode: 'Delimiter', value: ['1', '3'] }, '#ddtree');
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            expect(ddtreeObj.element.value).toBe('Australia; Victoria');
        });
        /**
         * showCheckBox enabled
         */
        it('for showCheckBox with single selected value provided in dataSource', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData_1 }, treeSettings: { loadOnDemand: true }, showCheckBox: true }, '#ddtree');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.text).toBe('Artwork');
        });

        it('for showCheckBox with multiple selected attribute provided in datasource', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded', selected: 'isSelected' }, showCheckBox: true }, '#ddtree');
            expect(ddtreeObj.text).toBe('New South Wales,Ceará');
            expect(ddtreeObj.value.length).toBe(2)
        });

        it('for showCheckBox with Default mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true }, '#ddtree');
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
            let ele1 = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.onFocusOut();
        });
        /**
         * mode
         */
        it('for Delimiter mode with showCheckBox', () => {
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
            let ele1 = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.onFocusOut();
        });

        it('for Box mode with showCheckBox', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, mode: 'Box' }, '#ddtree');
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
            let ele1 = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.onFocusOut();
        });

        /**
         * Delimiter char
         */
        it('for Delimiter char with showCheckBox', () => {
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
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true }, showCheckBox: true, mode: 'Delimiter', delimiterChar: ':', value: ['1', '3'] }, '#ddtree');
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            expect(ddtreeObj.element.value).toBe('Australia: Victoria');
        });

        /**
         * showSelectAll testing
         */
        it('for ShowSelectAll', (done: Function) => {
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
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
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
                    expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 400);
            }, 400);
        });

        /**
         * selectAllText and unSelectAllText
         */
        it('for selectAllText and unSelectAllText', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showSelectAll: true, showCheckBox: true, mode: 'Delimiter', selectAllText: 'check All Nodes', unSelectAllText: 'unCheck All Nodes' }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var selectAllElement = ddtreeObj.popupEle.firstElementChild;
            expect(selectAllElement.classList.contains('e-selectall-parent')).toBe(true);
            expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('check All Nodes');
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
                expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('unCheck All Nodes');
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
                    expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('check All Nodes');
                    done();
                }, 400);
            }, 400);
        });

        /**
         * autoCheck
         */

        it('for autocheck', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, mode: 'Delimiter', treeSettings: { autoCheck: true } }, '#ddtree');
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
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia');
            expect(ddtreeObj.value.length).toBe(5);
            expect(ddtreeObj.value[2]).toBe('3');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
            expect(ddtreeObj.value.length).toBe(9);
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, mode: 'Delimiter', treeSettings: { autoCheck: false } }, '#ddtree');
            ddtreeObj.showPopup();
            let checkEle1: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle1[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle1[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle1[0].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle1[0].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle1[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle1[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle1[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,Brazil');
            expect(ddtreeObj.value.length).toBe(2);
        });

        /**
         * headerTemplate
         */
        it('for headerTemplate support with string', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, headerTemplate: '<div class="new headerString"><span>HEADER VIA STRING</span></div>' }, '#ddtree');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                ddtreeObj.showPopup();
                expect(ddtreeObj.headerTemplate).not.toBe(null);
                expect(ddtreeObj.popupObj.element.firstChild.classList.contains('e-ddt-header')).toBe(true);
                expect(ddtreeObj.popupObj.element.firstChild.innerText).toEqual("HEADER VIA STRING");
                ddtreeObj.hidePopup();
                done();
            }, 400);
        });

        it('for headerTemplate support with script', (done: Function) => {
            let headerTemplate: Element = createElement('div', { id: 'headerTemplate' });
            headerTemplate.innerHTML = '<div class="header"><span >HEADER Via SCRIPT</span></div>';
            document.body.appendChild(headerTemplate);
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, headerTemplate: '#headerTemplate' }, '#ddtree');
            setTimeout(function () {
                ddtreeObj.showPopup();
                expect(ddtreeObj.headerTemplate).not.toBe(null);
                expect(ddtreeObj.popupObj.element.firstChild.classList.contains('e-ddt-header')).toBe(true);
                expect(ddtreeObj.popupObj.element.firstChild.innerText).toEqual("HEADER Via SCRIPT");
                ddtreeObj.hidePopup();
                done();
            }, 400);
        });

        /**
         * footerTemplate
         */
        it('for footerTemplate support with string', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, footerTemplate: '<div class="new headerString"><span>FOOTER VIA STRING</span></div>' }, '#ddtree');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                ddtreeObj.showPopup();
                expect(ddtreeObj.footerTemplate).not.toBe(null);
                expect(ddtreeObj.popupObj.element.lastElementChild.classList.contains('e-ddt-footer')).toBe(true);
                expect(ddtreeObj.popupObj.element.lastElementChild.innerText).toEqual("FOOTER VIA STRING");
                ddtreeObj.hidePopup();
                done();
            }, 400);
        });
        it('for footerTemplate support with script', (done: Function) => {
            let footerTemplate: Element = createElement('div', { id: 'footerTemplate' });
            footerTemplate.innerHTML = '<div class="header"><span >FOOTER Via SCRIPT</span></div>';
            document.body.appendChild(footerTemplate);
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, footerTemplate: '#footerTemplate' }, '#ddtree');
            setTimeout(function () {
                ddtreeObj.showPopup();
                expect(ddtreeObj.footerTemplate).not.toBe(null);
                expect(ddtreeObj.popupObj.element.lastElementChild.classList.contains('e-ddt-footer')).toBe(true);
                expect(ddtreeObj.popupObj.element.lastElementChild.innerText).toEqual("FOOTER Via SCRIPT");
                ddtreeObj.hidePopup();
                done();
            }, 400);
        });

        /**
         * itemTemplate
         */
        it('for itemTemplate support with string', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: localData1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild", expanded: 'nodeExpanded1' }, itemTemplate: '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}' }, '#ddtree');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                ddtreeObj.showPopup();
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-text-content');
                expect(li[0].querySelector('i')).not.toBe(null);
                expect(li[0].querySelector('b')).toBe(null);
                expect(li[1].querySelector('b')).not.toBe(null);
                expect(li[1].querySelector('i')).toBe(null);
                ddtreeObj.hidePopup();
                done();
            }, 400);
        });
        it('for itemTemplate support with script', (done: Function) => {
            let template: Element = createElement('div', { id: 'template' });
            template.innerHTML = '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
            document.body.appendChild(template);
            ddtreeObj = new DropDownTree({ fields: { dataSource: localData1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild", expanded: 'nodeExpanded1' }, itemTemplate: '#template' }, '#ddtree');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                ddtreeObj.showPopup();
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-text-content');
                expect(li[0].querySelector('i')).not.toBe(null);
                expect(li[0].querySelector('b')).toBe(null);
                expect(li[1].querySelector('b')).not.toBe(null);
                expect(li[1].querySelector('i')).toBe(null);
                ddtreeObj.hidePopup();
                done();
            }, 400);
        });

        /**
         * loadOnDemand true
         */

        it('for loadOnDemand', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true } }, '#ddtree');
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            expect(li.length).toBe(9);
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: false } }, '#ddtree');
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            expect(li.length).toBe(24);
        });

        /*
         *value 
        */
        it('for value as string type', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: localDataString, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" }, value: ['1'], treeSettings: { loadOnDemand: true } }, '#ddtree');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: localDataString, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" }, value: ['21'], treeSettings: { loadOnDemand: true } }, '#ddtree');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.text).not.toBe('Australia');
            expect(ddtreeObj.text).toBe('India');
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: localDataString, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" }, value: null, treeSettings: { loadOnDemand: true } }, '#ddtree');
            expect(ddtreeObj.value).toBe(null);
            expect(ddtreeObj.text).toBe(null);
        });

        /**
         * text
         */
        it('for text', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" }, text: 'Australia', treeSettings: { loadOnDemand: true } }, '#ddtree');
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(9);
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.value[0]).toBe('1');
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" }, text: 'India', treeSettings: { loadOnDemand: true } }, '#ddtree');
            expect(ddtreeObj.text).toBe('India');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.value[0]).toBe('21');
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" }, text: 'aaaaa', treeSettings: { loadOnDemand: true } }, '#ddtree');
            expect(ddtreeObj.value).toBe(null);
            expect(ddtreeObj.text).toBe(null);
            ddtreeObj.destroy();
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" }, text: null, treeSettings: { loadOnDemand: true } }, '#ddtree');
            expect(ddtreeObj.value).toBe(null);
            expect(ddtreeObj.text).toBe(null);
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
            ddTreeObj.destroy();
            ddTreeObj = new DropDownTree({ fields: { dataSource: listData, value: 'id', parentValue: 'pid', hasChildren: 'hasChild', text: 'name' }, htmlAttributes: { 'class': 'myTree' } });
            ddTreeObj.appendTo(element);
            expect(ddTreeObj.element.parentElement.classList.contains('myTree')).toBe(true);
            ddTreeObj.destroy();
            ddTreeObj = new DropDownTree({ fields: { dataSource: listData, value: 'id', parentValue: 'pid', hasChildren: 'hasChild', text: 'name' }, htmlAttributes: { readonly: 'readonly' } });
            ddTreeObj.appendTo(element);
            var ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(ddTreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("false");
            ddTreeObj.showPopup();
            expect(ddTreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("false");
            ddTreeObj.destroy();
            ddTreeObj = new DropDownTree({ fields: { dataSource: listData, value: 'id', parentValue: 'pid', hasChildren: 'hasChild', text: 'name' }, htmlAttributes: { style: 'background: red' } });
            ddTreeObj.appendTo(element);
            expect(ddTreeObj.element.parentElement.style.background).toBe('red');
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
});
