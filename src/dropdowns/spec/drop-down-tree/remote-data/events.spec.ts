import { Browser, createElement, setCulture } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { remoteData, remoteData2, remoteData2_1, remoteData1_1, remoteData3_1 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('DropDown Tree control remote datasource', () => {
    describe('Events testing', () => {
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
        let ddtreeObj: any;
        let ele: HTMLElement;
        let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
        let originalTimeout: any;
        let i: number = 0, j: number = 0;
        function clickFn(): void {
            i++;
        }
        beforeEach(() => {
            jasmine.Ajax.install();
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            ele = createElement('input', { id: 'tree1' });
            document.body.appendChild(ele);
            i = 0, j = 0;
            ddtreeObj = undefined;
        });
        afterEach(() => {
            if(ddtreeObj)
                ddtreeObj.destroy();
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('created event', (done) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip', selected: 'nodeSelected'
                },
                created: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
            setTimeout(function () { 
                expect(i).toEqual(1);
                done() 
            },200);
        });
        it('dataBound event', (done) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip', selected: 'nodeSelected'
                },
                dataBound: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
            setTimeout(function () { 
                expect(i).toEqual(1);
                done() 
            },500);
        });
        it('beforeOpen event is triggered', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip', selected: 'nodeSelected'
                },
                beforeOpen: function (args) {
                    i++;
                },
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
            setTimeout(function () {
                expect(i).toEqual(0);
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(i).toEqual(1);
                ddtreeObj.hidePopup();
                ddtreeObj.showPopup();
                expect(i).toEqual(2);
                done();
            }, 200)
        });
        it('open event is triggered', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip', selected: 'nodeSelected'
                },
                open: function (args) {
                    i++;
                },
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
            setTimeout(function () {
                expect(i).toEqual(0);
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(i).toEqual(1);
                ddtreeObj.hidePopup();
                ddtreeObj.showPopup();
                expect(i).toEqual(2);
                done();
            }, 200);
        });
        it('close event is triggered', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip', selected: 'nodeSelected'
                },
                close: function (args) {
                    i++;
                },
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
            setTimeout(function () {
                expect(i).toEqual(0);
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(i).toEqual(0);
                ddtreeObj.hidePopup();
                expect(i).toEqual(1);
                done();
            }, 200);
        });
        it('change event is triggered', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip'
                },
                change: function (args) {
                    i++;
                },
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
            setTimeout(function () {
                expect(i).toEqual(0);
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(i).toEqual(0);
                var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
                expect(ddtreeObj.text).toBe("Music");
                (ddtreeObj as any).onFocusOut();
                expect(i).toEqual(1);
                done();
            }, 200);
        });
        it('beforeOpen event is cancelled', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip', selected: 'nodeSelected'
                },
                beforeOpen: function (args) {
                    args.cancel = true;
                },
                open: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
            setTimeout(function () {
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(i).toEqual(0);
                ddtreeObj.hidePopup();
                expect(i).toEqual(0);
                expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("false");
                expect(ddtreeObj.element.parentElement.getAttribute("aria-haspopup")).toEqual("true");
                done();
            }, 100);
        });
        it('select event testing', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip'
                },
                select: function (args) {
                    i++;
                },
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
            setTimeout(function () {
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(i).toEqual(0);
                var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.text).toBe("Music");
                expect(i).toEqual(1);
                done();
            }, 200);
        });
        it('focus event testing', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip', selected: 'nodeSelected'
                },
                focus: function (args) {
                    i++;
                },
            }, '#tree1');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
            setTimeout(function () {
                expect(i).toEqual(0);
                ddtreeObj.showPopup();
                expect(i).toEqual(1);
                done();
            }, 100);
        });
        it('blur event testing', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip'
                },
                blur: function (args) {
                    i++;
                },
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
            setTimeout(function () {
                expect(i).toEqual(0);
                ddtreeObj.showPopup();
                var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.text).toBe("Music");
                ddtreeObj.onFocusOut();
                expect(i).toEqual(1);
                done();
            }, 200);
        });
    });
});
