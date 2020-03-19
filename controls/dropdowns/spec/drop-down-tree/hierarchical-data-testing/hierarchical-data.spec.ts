import { Browser, createElement } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { hierarchicalData, hierarchicalData1, hierarchicalDataString, hierarchicalData2, hierarchicalData3 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('DropDownTree control', () => {

    describe('DropDownTree with hierarchical datasource functionality testing', () => {
        describe('hierarchical databinding testing', () => {
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
                ddtreeObj.text = 'aaa';
                ddtreeObj.dataBind();
                expect(ddtreeObj.text).toBe(null);
            });
            it('with empty datasource', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: [] } }, '#ddtree');
                expect(ddtreeObj.element.querySelectorAll('li').length).toBe(0);
            });

            it('without mapping fields', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData }, treeSettings: { loadOnDemand: true } }, '#ddtree');
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
            it('without child mapping', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalDataString, value: "id", text: "name", child: null }, treeSettings: { loadOnDemand: true } }, '#ddtree');
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(3);
            });
            it('with mapping fields and value as string', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalDataString, value: "id", text: "name", child: "subChild" }, treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData2, value: "nodeId", text: "nodeText", child: 'nodeChild' }, treeSettings: { loadOnDemand: true } }, '#ddtree');
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(2);
            });
        });
        describe('List popup-open testing', () => {
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

                let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
                document.body.appendChild(ele);
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, treeSettings: { loadOnDemand: true } });
                ddtreeObj.appendTo(ele);
            });
            afterEach((): void => {
                if (ddtreeObj)
                    ddtreeObj.destroy();
                document.body.innerHTML = '';
            });
            it('dropdown tree click', () => {
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toBe('true');
                expect(document.querySelector('.e-popup').querySelector('.e-treeview')).not.toBe(null);
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
                expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toBe('false');
            });
            it('dropdown treeview node click', () => {
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toBe('true');
                expect(document.querySelector('.e-popup').querySelector('.e-treeview')).not.toBe(null);
                var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect((ddtreeObj as any).element.nextElementSibling.style.display).toBe('');
                expect(ddtreeObj.element.value).toBe("Australia")
                expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
                expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toBe('false');
            });
        });
        describe('hierarchical data property testing', () => {
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

                let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
                document.body.appendChild(ele);
                ddtreeObj = undefined;
            });
            afterEach((): void => {
                if (ddtreeObj)
                    ddtreeObj.destroy();
                document.body.innerHTML = '';
            });

            /**
            * enableRtl property
            */
            it('enableRtl with popup ', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, enableRtl: true, treeSettings: { loadOnDemand: true } }, '#ddtree');
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
            it('cssClass testing with popup', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, cssClass: 'custom-dropdowntree' }, '#ddtree');
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

            it('enabled false', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, enabled: false, treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                ddtreeObj.enabled = true;
                ddtreeObj.dataBind();
                expect(ddtreeObj.element.parentElement.classList.contains('e-disabled')).toBe(false);
                expect(ddtreeObj.element.classList.contains('e-disabled')).toBe(false);
                expect(ddtreeObj.element.getAttribute('aria-disabled')).toBe('false');
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
            });
            /**
            * readonly property
            */
            it('readonly true', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, readonly: true, treeSettings: { loadOnDemand: true } }, '#ddtree');
                var ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("false");
                ddtreeObj.showPopup();
                ddtreeObj.dataBind();
                expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("false");
                ddtreeObj.readonly = false;
                ddtreeObj.showPopup();
                ddtreeObj.dataBind();
                expect(document.querySelectorAll('.e-popup').length).toBe(1);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("true");
            });
            it('allowMultiSelection enabled ', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, allowMultiSelection: true, treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            });

            it('sortOrder property testing', (done: Function) => {
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild",
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

            it('expandOn property testing with None', (done: Function) => {
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip',
                    },
                    treeSettings: { expandOn: "None" }
                }, '#ddtree');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    ddtreeObj.showPopup();
                    let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(3);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    ddtreeObj.showPopup();
                    ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        done();
                    }, 450);
                }, 100);
            });
            it('expandOn property testing with Click', (done: Function) => {
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip',
                    },
                    treeSettings: { expandOn: "Click" }
                }, '#ddtree');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    ddtreeObj.showPopup();
                    let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(3);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    ddtreeObj.showPopup();
                    ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        done();
                    }, 450);
                }, 100);
            });

            it('expandOn property testing with Click (right Click)', (done: Function) => {
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip',
                    },
                    treeSettings: { expandOn: "Click" }
                }, '#ddtree');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    ddtreeObj.showPopup();
                    let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(3);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    ddtreeObj.showPopup();
                    tapEvent.originalEvent.which = 3;
                    ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        done();
                    }, 450);
                }, 100);
            });
            it('expandOn property testing with DblClick', (done: Function) => {
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip',
                    },
                    treeSettings: { expandOn: "DblClick" }
                }, '#ddtree');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    ddtreeObj.showPopup();
                    let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(3);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    ddtreeObj.showPopup();
                    tapEvent.tapCount = 2;
                    ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        done();
                    }, 450);
                }, 100);
            });
            it('expandOn property testing with DblClick (right Click)', (done: Function) => {
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip',
                    },
                    treeSettings: { expandOn: "DblClick" }
                }, '#ddtree');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    ddtreeObj.showPopup();
                    let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(3);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    ddtreeObj.showPopup();
                    tapEvent.tapCount = 2;
                    tapEvent.originalEvent.which = 3;
                    ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        done();
                    }, 450);
                }, 100);
            });
        });

        describe('Template property testing', () => {
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
            it('headerTemplate support with string', (done: Function) => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, headerTemplate: '<div class="new headerString"><span>HEADER VIA STRING</span></div>' }, '#ddtree');
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
            it('headerTemplate support with script', (done: Function) => {
                let headerTemplate: Element = createElement('div', { id: 'headerTemplate' });
                headerTemplate.innerHTML = '<div class="header"><span >HEADER Via SCRIPT</span></div>';
                document.body.appendChild(headerTemplate);
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, headerTemplate: '#headerTemplate' }, '#ddtree');
                setTimeout(function () {
                    ddtreeObj.showPopup();
                    expect(ddtreeObj.headerTemplate).not.toBe(null);
                    expect(ddtreeObj.popupObj.element.firstChild.classList.contains('e-ddt-header')).toBe(true);
                    expect(ddtreeObj.popupObj.element.firstChild.innerText).toEqual("HEADER Via SCRIPT");
                    ddtreeObj.hidePopup();
                    done();
                }, 400);
            });
            it('footerTemplate support with string', (done: Function) => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, footerTemplate: '<div class="new headerString"><span>FOOTER VIA STRING</span></div>' }, '#ddtree');
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
            it('footerTemplate support with script', (done: Function) => {
                let footerTemplate: Element = createElement('div', { id: 'footerTemplate' });
                footerTemplate.innerHTML = '<div class="header"><span >FOOTER Via SCRIPT</span></div>';
                document.body.appendChild(footerTemplate);
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, footerTemplate: '#footerTemplate' }, '#ddtree');
                setTimeout(function () {
                    ddtreeObj.showPopup();
                    expect(ddtreeObj.footerTemplate).not.toBe(null);
                    expect(ddtreeObj.popupObj.element.lastElementChild.classList.contains('e-ddt-footer')).toBe(true);
                    expect(ddtreeObj.popupObj.element.lastElementChild.innerText).toEqual("FOOTER Via SCRIPT");
                    ddtreeObj.hidePopup();
                    done();
                }, 400);
            });
            it('itemTemplate support with string', (done: Function) => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' }, itemTemplate: '${if(nodeChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}' }, '#ddtree');
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
                }, 450);
            });
            it('itemTemplate support with script', (done: Function) => {
                let template: Element = createElement('div', { id: 'template' });
                template.innerHTML = '${if(nodeChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                document.body.appendChild(template);
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' }, itemTemplate: '#template' }, '#ddtree');
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
                }, 450);
            });
        });

        describe('Template property testing via set model change', () => {
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
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' } }, '#ddtree');
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
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' } }, '#ddtree');
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
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' } }, '#ddtree');
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
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' } }, '#ddtree');
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
            it('itemTemplate property testing', () => {
                let template: Element = createElement('div', { id: 'template' });
                template.innerHTML = '${if(nodeChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                document.body.appendChild(template);
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' } }, '#ddtree');
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
                ddtreeObj.itemTemplate = '${if(nodeChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                ddtreeObj.dataBind();
                let bli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-text-content');
                expect(bli[0].querySelector('i')).not.toBe(null);
                expect(bli[0].querySelector('b')).toBe(null);
            });
        });

        describe('DropDownTree fields property change testing', () => {
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
                        dataSource: hierarchicalData2, value: "nodeId", text: "nodeText",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected', child: 'nodeChild',
                    },
                    treeSettings: { loadOnDemand: true }
                });
                ddtreeObj.appendTo(ele);
            });
            afterEach(() => {
                if (ddtreeObj)
                    ddtreeObj.destroy();
                document.body.innerHTML = '';
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
                ddtreeObj.fields.dataSource = hierarchicalData1;
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
            it('fields child property', () => {
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
                ddtreeObj.fields = { child: "subChild" };
                ddtreeObj.dataBind();
                let newli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = newli[0].querySelector('.e-icons');
                expect(newli[0].childElementCount).toBe(2);
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                expect(newli[0].childElementCount).toBe(3);
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(newli[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Gouttes.jpg');
                expect(newli[0].querySelector('.e-list-parent').querySelector('.e-list-item').getAttribute('data-uid')).toBe('21-01');
                let dli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                expect(dli[1].childElementCount).toBe(2);
                mouseEventArgs.target = dli[1].querySelector('.e-icons');
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                expect(dli[1].childElementCount).toBe(2);
                expect(cli[1].querySelector('.e-icons')).toBe(null);
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
            it('sortOrder property testing', (done: Function) => {
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

            it('expandOn property testing', (done: Function) => {
                ddtreeObj.showPopup();
                ddtreeObj.treeSettings.expandOn = 'Click';
                ddtreeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                expect(ddtreeObj.text).toBe('Music');
                expect(li[0].childElementCount).toBe(2);
                ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[0].childElementCount).toBe(3);
                    expect(li[0].getAttribute('aria-expanded')).toBe('true');
                    ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                        expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[0].getAttribute('aria-expanded')).toBe('false');
                        expect((li[0]).classList.contains('e-node-collapsed')).toBe(true);
                        ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                            expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                            expect(li[0].getAttribute('aria-expanded')).toBe('true');                    
                            expect((li[0]).classList.contains('e-node-collapsed')).toBe(false);                  
                            let newli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                            expect(newli[1].querySelector('.e-icons')).toBe(null);
                            expect(newli[1].childElementCount).toBe(2);
                            expect(newli[1].getAttribute('aria-expanded')).toBe(null);
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('expandOn property testing', (done: Function) => {
                ddtreeObj.showPopup();
                ddtreeObj.treeSettings.expandOn = 'None';
                ddtreeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
                setTimeout(function() {
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                    done();
                 }, 100);
            });


        });
        describe('value property testing', () => {
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
            it('with value as string type', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalDataString, value: "id", text: "name", child: "subChild" }, treeSettings: { loadOnDemand: true }, value: ['01'] }, '#ddtree');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(9);
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.text).toBe('Local Disk (C:)');
                ddtreeObj.showPopup();
                ddtreeObj.value = ['02-01'];
                ddtreeObj.dataBind();
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.text).not.toBe('Local Disk (C:)');
                expect(ddtreeObj.text).toBe('Personals');
                ddtreeObj.value = ['444'];
                ddtreeObj.dataBind();
                expect(ddtreeObj.value[0]).not.toBe('444')
                expect(ddtreeObj.text).toBe('Personals');
                ddtreeObj.value = null;
                ddtreeObj.dataBind();
                expect(ddtreeObj.value.length).toBe(0);
                expect(ddtreeObj.text).toBe(null);
            });
        });
        describe('text property testing', () => {
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
            it('with valid text', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, text: 'Australia', treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                ddtreeObj.text = null;
                ddtreeObj.dataBind();
                expect(ddtreeObj.value.length).toBe(0);
                expect(ddtreeObj.text).toBe(null);
            });
        });
        describe(' value and text property together', () => {
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
            it('with valid text', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, text: 'Australia', value: ['21'], treeSettings: { loadOnDemand: true } }, '#ddtree');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(9);
                expect(ddtreeObj.text).toBe('India');
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value[0]).toBe('21');
                ddtreeObj.showPopup();
                ddtreeObj.text = 'Australia';
                ddtreeObj.dataBind();
                expect(ddtreeObj.text).toBe('Australia');
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value[0]).toBe('1');
                ddtreeObj.text = 'aaaaa';
                ddtreeObj.dataBind();
                expect(ddtreeObj.text).toBe('Australia');
                expect(ddtreeObj.value.length).toBe(1);
                expect(ddtreeObj.value[0]).toBe('1');
            });
        });
        describe('allowMulitiSelection property testing', () => {
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

                let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
                document.body.appendChild(ele);
                ddtreeObj = undefined
            });
            afterEach((): void => {
                if (ddtreeObj)
                    ddtreeObj.destroy();
                document.body.innerHTML = '';
            });
            it('allowMultiSelection enabled with Delimiter mode', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, allowMultiSelection: true, mode: 'Delimiter', treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            });
            it('allowMultiSelection enabled with Box mode', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, allowMultiSelection: true, mode: 'Box', treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                ddtreeObj.showPopup();
                ddtreeObj.dataBind();
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            });
            it('allowMultiSelection enabled with Default mode', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, allowMultiSelection: true, mode: 'Default', treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, treeSettings: { loadOnDemand: true } }, '#ddtree');
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
            it('Switching between various mode', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                ddtreeObj.dataBind();
                expect(ddtreeObj.text).toBe('Australia');
                expect(ddtreeObj.value[0]).toBe('1');
                expect(ddtreeObj.value.length).toBe(1);
                let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
                let chips_4 = chipElement_1.querySelectorAll('.e-chips');
                expect(chips_4.length).toBe(0);
            });
            it('Chip Delete testing', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, allowMultiSelection: true, mode: 'Box', treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
                expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[2].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(li[2].classList.contains('e-active')).toBe(true);
                expect(ddtreeObj.text).toBe('Australia,Victoria');
                let chips_1 = chipElement.querySelectorAll('.e-chips');
                expect(chips_1.length).toBe(2);
                var chipDelete = chips_1[1].querySelector('.e-chips-close');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                chipDelete.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                chipDelete.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                chipDelete.dispatchEvent(e);
                expect(ddtreeObj.text).toBe('Australia');
            });
            it('Chip Delete dynamically changed', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, allowMultiSelection: true, mode: 'Box', treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
                expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[2].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(li[2].classList.contains('e-active')).toBe(true);
                expect(ddtreeObj.text).toBe('Australia,Victoria');
                let chips_1 = chipElement.querySelectorAll('.e-chips');
                expect(chips_1.length).toBe(2);
                ddtreeObj.showClearButton = false;
                ddtreeObj.dataBind();
                var chipDelete = chips_1[0].querySelector('.e-chips-close');
                expect(chipDelete.classList.contains('e-icon-hide')).toBe(true);
            });
            it('Delimiter char testing', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, allowMultiSelection: true, mode: 'Delimiter', treeSettings: { loadOnDemand: true } }, '#ddtree');
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

            });
        });
        describe('Showcheckbox property testing', () => {
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

                let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
                document.body.appendChild(ele);
                ddtreeObj = undefined
            });
            afterEach((): void => {
                if (ddtreeObj)
                    ddtreeObj.destroy();
                document.body.innerHTML = '';
            });
            it('showCheckBox enabled with Delimiter mode', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Delimiter' }, '#ddtree');
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
                ddtreeObj.showCheckBox = true;
                ddtreeObj.dataBind();
                ddtreeObj.showPopup();
                expect(ddtreeObj.text).toBe('Australia');
            });
            it('showCheckBox enabled with Delimiter mode and autocheck enabled', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Delimiter', treeSettings: { autoCheck: true } }, '#ddtree');
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
                ddtreeObj.treeSettings.autoCheck = false;
                ddtreeObj.dataBind();
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle[9].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle[9].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle[9].querySelector('.e-frame').dispatchEvent(e);
                expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre,China');
                expect(ddtreeObj.value.length).toBe(10);
                ddtreeObj.showCheckBox = false;
                ddtreeObj.dataBind();
                expect(ddtreeObj.text).toBe('Australia');
                expect(ddtreeObj.value.length).toBe(1);
            });
            it('showCheckBox enabled with Delimiter mode autocheck enabled and loadOnDemand enabled', (done: Function) => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Delimiter', treeSettings: { autoCheck: true, loadOnDemand: true } }, '#ddtree');
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
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[5].querySelector('.e-icons');
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
                    expect(ddtreeObj.value.length).toBe(9);
                    ddtreeObj.treeSettings.autoCheck = false;
                    ddtreeObj.dataBind();
                    var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    let ncheckEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                    expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre,China');
                    expect(ddtreeObj.value.length).toBe(10);
                    ddtreeObj.showCheckBox = false;
                    ddtreeObj.dataBind();
                    expect(ddtreeObj.text).toBe('Australia');
                    expect(ddtreeObj.value.length).toBe(1);
                    done();
                }, 450);
            });
            it('showCheckBox enabled with Box mode', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Box' }, '#ddtree');
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
            it('showCheckBox enabled with Box mode with autoCheck enabled', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Box', treeSettings: { autoCheck: true } }, '#ddtree');
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
                let chipElement = ddtreeObj.element.parentElement.firstElementChild;
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
                let chips = chipElement.querySelectorAll('.e-chips');
                expect(chips.length).toBe(5);
                expect(chips[0].getAttribute("data-value")).toBe("1");
                expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
                expect(chips[4].querySelector(".e-chipcontent").textContent).toBe("Western Australia");
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle[5].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle[5].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle[5].querySelector('.e-frame').dispatchEvent(e);
                expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
                expect(ddtreeObj.value.length).toBe(9);
                let nchips = chipElement.querySelectorAll('.e-chips');
                expect(nchips.length).toBe(9);
                expect(nchips[7].querySelector(".e-chipcontent").textContent).toBe("Ceará");
                ddtreeObj.treeSettings.autoCheck = false;
                ddtreeObj.dataBind();
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle[9].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle[9].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle[9].querySelector('.e-frame').dispatchEvent(e);
                expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre,China');
                expect(ddtreeObj.value.length).toBe(10);
                let nchips_1 = chipElement.querySelectorAll('.e-chips');
                expect(nchips_1.length).toBe(10);
                expect(nchips_1[9].querySelector(".e-chipcontent").textContent).toBe("China");
                ddtreeObj.showCheckBox = false;
                ddtreeObj.dataBind();
                expect(ddtreeObj.text).toBe('Australia');
                expect(ddtreeObj.value.length).toBe(1);
                let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
                let chips_3 = chipElement_1.querySelectorAll('.e-chips');
                expect(chips_3.length).toBe(0);
                ddtreeObj.delimiterChar = '?';
                ddtreeObj.showPopup();
                ddtreeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            });
            it('showCheckBox enabled with Box mode autocheck enabled and loadOnDemand enabled', (done: Function) => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Box', treeSettings: { autoCheck: true, loadOnDemand: true } }, '#ddtree');
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
                let chipElement = ddtreeObj.element.parentElement.firstElementChild;
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
                let chips = chipElement.querySelectorAll('.e-chips');
                expect(chips.length).toBe(5);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle[5].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle[5].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle[5].querySelector('.e-frame').dispatchEvent(e);
                expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
                expect(ddtreeObj.value.length).toBe(9);
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
                let chips_1 = chipElement.querySelectorAll('.e-chips');
                expect(chips_1.length).toBe(9);
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[5].querySelector('.e-icons');
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
                    expect(ddtreeObj.value.length).toBe(9);
                    ddtreeObj.treeSettings.autoCheck = false;
                    ddtreeObj.dataBind();
                    var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    let ncheckEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                    expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre,China');
                    expect(ddtreeObj.value.length).toBe(10);
                    ddtreeObj.showCheckBox = false;
                    ddtreeObj.dataBind();
                    expect(ddtreeObj.text).toBe('Australia');
                    expect(ddtreeObj.value.length).toBe(1);
                    let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
                    let chips_3 = chipElement_1.querySelectorAll('.e-chips');
                    expect(chips_3.length).toBe(0);
                    done();
                }, 400);
            });
            it('showCheckBox enabled with Default mode', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true }, '#ddtree');
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
            it('showCheckBox enabled with Default mode with autoCheck enabled', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, treeSettings: { autoCheck: true } }, '#ddtree');
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
            it('showCheckBox enabled with Default mode autocheck enabled and loadOnDemand enabled', (done: Function) => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, treeSettings: { autoCheck: true, loadOnDemand: true } }, '#ddtree');
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
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                (ddtreeObj as any).onFocusOut();
                expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia');
                expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
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
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
                let chips_1 = chipElement.querySelectorAll('.e-chips');
                expect(chips_1.length).toBe(9);
                (ddtreeObj as any).onFocusOut();
                expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
                ddtreeObj.showPopup();
                ddtreeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[5].querySelector('.e-icons');
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
                    expect(ddtreeObj.value.length).toBe(9);
                    ddtreeObj.treeSettings.autoCheck = false;
                    ddtreeObj.dataBind();
                    var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    let ncheckEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                    expect(ddtreeObj.value.length).toBe(10);
                    (ddtreeObj as any).onFocusOut();
                    expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre,China');
                    ddtreeObj.showPopup();
                    ddtreeObj.dataBind();
                    ddtreeObj.showCheckBox = false;
                    ddtreeObj.dataBind();
                    expect(ddtreeObj.text).toBe('Australia');
                    expect(ddtreeObj.value.length).toBe(1);
                    let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
                    let chips_3 = chipElement_1.querySelectorAll('.e-chips');
                    expect(chips_3.length).toBe(0);
                    done();
                }, 400);
            });
            it('showCheckBox enabled dynamically with Default mode', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
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
                var selectAllElement = ddtreeObj.popupDiv.firstElementChild;
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
            it('Switching between various mode', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
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
            it('Chip Delete testing', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Box', treeSettings: { loadOnDemand: true } }, '#ddtree');
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
                let chipElement = ddtreeObj.element.parentElement.firstElementChild;
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
                let chips = chipElement.querySelectorAll('.e-chips');
                expect(chips.length).toBe(1);
                expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
                expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
                var chipDelete = chips[0].querySelector('.e-chips-close');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                chipDelete.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                chipDelete.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                chipDelete.dispatchEvent(e);
                expect(ddtreeObj.text).toBe(null);
            });
            it('Chip Delete dynamically changed', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Box' }, '#ddtree');
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
                let chipElement = ddtreeObj.element.parentElement.firstElementChild;
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
                let chips = chipElement.querySelectorAll('.e-chips');
                expect(chips.length).toBe(1);
                expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
                expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
                ddtreeObj.showClearButton = false;
                ddtreeObj.dataBind();
                var chipDelete = chips[0].querySelector('.e-chips-close');
                expect(chipDelete.classList.contains('e-icon-hide')).toBe(true);
            });
            it('parent chip Deleting with autoCheck enabled', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Box', treeSettings: { autoCheck: true } }, '#ddtree');
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
                expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia');
                let chipElement = ddtreeObj.element.parentElement.firstElementChild;
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
                let chips = chipElement.querySelectorAll('.e-chips');
                expect(chips.length).toBe(5);
                expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
                expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
                var chipDelete = chips[0].querySelector('.e-chips-close');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                chipDelete.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                chipDelete.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                chipDelete.dispatchEvent(e);
                expect(ddtreeObj.text).toBe(null);
                let chips_1 = chipElement.querySelectorAll('.e-chips');
                expect(chips_1.length).toBe(0);
            });

            it('Delimiter char testing', () => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, treeSettings: { loadOnDemand: true }, showCheckBox: true, mode: 'Delimiter' }, '#ddtree');
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
                ddtreeObj.text = 'Australia;China';
                ddtreeObj.dataBind();
                expect(ddtreeObj.value.length).toBe(2);
                ddtreeObj.showCheckBox = false;
                ddtreeObj.delimiterChar = '?';
                ddtreeObj.dataBind();
                expect(ddtreeObj.text).toBe('Australia');
            });
            it('ShowSelectAll testing', (done: Function) => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showSelectAll: true, showCheckBox: true, mode: 'Delimiter' }, '#ddtree');
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var selectAllElement = ddtreeObj.popupDiv.firstElementChild;
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
                                expect(ddtreeObj.popupDiv.firstElementChild.classList.contains('e-selectall-parent')).toBe(false);
                                done();
                            }, 400);
                        }, 400);
                    }, 400);
                }, 400);
            });
        });
        describe('SelectAll method testing', () => {
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
            it('selectAll method with allowMultiSelection', (done: Function) => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, allowMultiSelection: true }, '#ddtree');
                ddtreeObj.selectAll(true);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(ddtreeObj.value.length).toBe(24);
                    ddtreeObj.selectAll(false);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(ddtreeObj.value.length).toBe(0);
                        done();
                    }, 400);
                }, 400);
            });
            it('selectAll method with showCheckBox', (done: Function) => {
                ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true }, '#ddtree');
                ddtreeObj.selectAll(true);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(ddtreeObj.value.length).toBe(24);
                    ddtreeObj.selectAll(false);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(ddtreeObj.value.length).toBe(0);
                        done();
                    }, 400);
                }, 400);
            });
        });

    });
});