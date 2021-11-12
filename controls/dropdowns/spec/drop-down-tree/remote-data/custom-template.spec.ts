import { Browser, createElement, setCulture } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { remoteData, remoteData2, remoteData2_1, remoteData1_1, remoteData3_1 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';



describe('DropDownTree control remote datasource Custom Mode testing -', () => {
    beforeAll(() => {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.id   = 'wrapper-css';
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = '/base/styles/drop-down-tree/material.css';
        link.media = 'all';
        head.appendChild(link);
    });

    afterAll(() => {
        document.head.getElementsByClassName('wrapper-css')[0].remove();
    });

    describe('showCheckBox true', () => {
        let mouseEventArgs: any;
        let tapEvent: any;
        let ddtreeObj: any;
        let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
        let originalTimeout: any;
        beforeEach((done: Function) => {
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
            jasmine.Ajax.install();
            let ele: HTMLElement = createElement('input', { id: 'tree1' });
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected'
                },
                showCheckBox: true,
                mode: "Custom"
            });
            ddtreeObj.appendTo(ele);
            setTimeout(function () { done() });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
        });
        afterEach(() => {
            if (ddtreeObj)
                ddtreeObj.destroy();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('With Custom Mode', () => {
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(2);
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[0].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Music');
            expect(ddtreeObj.value[0]).toBe('01');
            var chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            var chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("1 item(s) selected");
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle[1].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.text).toBe('Music,Downloads');
            expect(ddtreeObj.value.length).toBe(2);
            var nchips = chipElement.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("2 item(s) selected");
            ddtreeObj.hidePopup();
            ddtreeObj.onFocusOut();
            expect(ddtreeObj.text).toBe('Music,Downloads');
            expect(nchips[0].innerText).toBe("2 item(s) selected");
        });
    });
    describe('for allowMultiSelection', () => {
        let mouseEventArgs: any;
        let tapEvent: any;
        let ddtreeObj: any;
        let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
        let originalTimeout: any;
        beforeEach((done: Function) => {
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
            jasmine.Ajax.install();
            let ele: HTMLElement = createElement('input', { id: 'tree1' });
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected'
                },
                treeSettings: { loadOnDemand: true },
                allowMultiSelection: true,
                mode: "Custom"
            });
            ddtreeObj.appendTo(ele);
            setTimeout(function () { done() });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
        });
        afterEach(() => {
            if (ddtreeObj)
                ddtreeObj.destroy();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('With Custom Mode', () => {
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(2);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[0].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Music');
            expect(ddtreeObj.value[0]).toBe('01');
            var chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            var chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("1 item(s) selected");
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.text).toBe('Music,Downloads');
            expect(ddtreeObj.value.length).toBe(2);
            var nchips = chipElement.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("2 item(s) selected");
            ddtreeObj.onFocusOut();
            expect(ddtreeObj.text).toBe('Music,Downloads');
            ddtreeObj.allowMultiSelection = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Music');
            expect(ddtreeObj.value.length).toBe(1);
            var chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(false);
            ddtreeObj.showPopup();
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
        });
    });
 
    describe('Method testing', () => {
        let mouseEventArgs: any = {
            preventDefault: (): void => { },
            stopImmediatePropagation: (): void => { },
            target: null,
            type: null,
            shiftKey: false,
            ctrlKey: false
        };
        let tapEvent: any = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        let keyboardEventArgs: any = {
            preventDefault: (): void => { },
            action: null,
            target: null,
            currentTarget: null,
            stopImmediatePropagation: (): void => { },
        };
        let ddtreeObj: any;
        let ele: HTMLElement = createElement('input', { id: 'tree1' });
        let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
        let originalTimeout: any;
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            jasmine.Ajax.install();
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: 'OrderID', text: 'CustomerID', iconCss: 'ShipCity', tooltip: 'ShipName', selected: 'nodeSelected', hasChildren: 'Freight', query: new Query().from("Categories").select("CategoryID,CategoryName,Description").take(7),
                    child: { dataSource: dataManager1, value: 'CustomerID', text: 'ShipCountry', parentValue: 'OrderID' },
                },
                showCheckBox: true,
                mode: "Custom"
            });
            ddtreeObj.appendTo(ele);
            setTimeout(function () { done() });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData, __count: 15 })
            });
        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('for selectAll with showCheckBox', (done: Function) => {
            ddtreeObj.selectAll(true);
            expect(ddtreeObj.value.length).toBe(15);
            var chipElement = ddtreeObj.element.parentElement.firstElementChild;
            var nchips = chipElement.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("15 item(s) selected");
            ddtreeObj.selectAll(false);
            expect(ddtreeObj.value.length).toBe(0);
            done();
        }, 100);
    });
});
