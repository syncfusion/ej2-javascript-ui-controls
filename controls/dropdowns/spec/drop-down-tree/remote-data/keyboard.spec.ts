import { createElement } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { remoteData, remoteData2 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';


describe('DropDown Tree control Remote datasource', () => {
    /**
      * Keyboard key testing
      */
    describe('KeyBoard event testing', () => {
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
        let i = 0;
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            jasmine.Ajax.install();
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip'
                },
            });
            ddtreeObj.appendTo(ele);
            setTimeout(function () { done() });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('tab key pressed', (done: Function) => {
            keyboardEventArgs.action = 'tab';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            done();
        }, 100);
    });
    describe('KeyBoard event testing', () => {
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
        let i = 0;
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            jasmine.Ajax.install();
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip'
                },
            });
            ddtreeObj.appendTo(ele);
            setTimeout(function () { done() });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('altDown key pressed', (done: Function) => {
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toBe('true');
            done();
        }, 100);
    });
    describe('KeyBoard event testing', () => {
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
        let i = 0;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip'
                },
            });
            ddtreeObj.appendTo(ele);
            setTimeout(function () { done() });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('altUp key pressed', (done: Function) => {
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toBe('true');
            keyboardEventArgs.action = 'altUp';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toBe('false');
            ddtreeObj.onFocusOut();
            done();
        }, 100);
    });
    describe('KeyBoard event testing', () => {
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
        let i = 0;
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            jasmine.Ajax.install();
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip'
                },
            });
            ddtreeObj.appendTo(ele);
            setTimeout(function () { done() });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('escape key pressed', (done: Function) => {
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toBe('true');
            keyboardEventArgs.action = 'escape';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toBe('false');
            ddtreeObj.onFocusOut();
            done();
        }, 100);
    });
    describe('KeyBoard event testing', () => {
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
        let i = 0;
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            jasmine.Ajax.install();
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip'
                },
            });
            ddtreeObj.appendTo(ele);
            setTimeout(function () { done() });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('shiftTab key pressed', (done: Function) => {
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toBe('true');
            keyboardEventArgs.action = 'shiftTab';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.element.parentElement.getAttribute("aria-expanded")).toBe('false');
            ddtreeObj.onFocusOut();
            done();
        }, 100);
    });

    describe('KeyBoard event testing', () => {
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
        let i = 0;
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            jasmine.Ajax.install();
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip'
                },
                treeSettings: { loadOnDemand: true }
            });
            ddtreeObj.appendTo(ele);
            setTimeout(function () { done() });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData2, __count: 2 })
            });
        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('enter', (done: Function) => {
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-hover')).toBe(true);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[0].classList.contains('e-active')).toBe(false);
            keyboardEventArgs.action = 'enter';
            ddtreeObj.treeAction(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-hover')).toBe(true);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[0].classList.contains('e-active')).toBe(true);
            ddtreeObj.onFocusOut();
            done();
        }, 100);
    });
    describe('KeyBoard event testing', () => {
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
                treeSettings: { loadOnDemand: true }

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
        it('move Right', (done: Function) => {
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(15);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('VINET');
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('10248');
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('Reims')).toBe(true);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('Vins et alcools Chevalier');
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').childElementCount).toBe(2);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').querySelector('.e-icons')).not.toBe(null);
            let newli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            keyboardEventArgs.action = 'moveRight';
            ddtreeObj.treeAction(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: [], __count: 0 })
            });
            setTimeout(function () {
                expect(newli[1].childElementCount).toBe(2);
                ddtreeObj.onFocusOut();
                done();
            }, 100);
        });
    });
    describe('KeyBoard event testing', () => {
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
                treeSettings: { loadOnDemand: true }

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
        it('end', (done: Function) => {
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(15);
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            var li = ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-hover')).toBe(true);
            expect(li[14].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[14].classList.contains('e-node-focus')).toBe(false);
            keyboardEventArgs.action = 'end';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[14].classList.contains('e-hover')).toBe(true);
            expect(li[0].classList.contains('e-node-focus')).toBe(false);
            expect(li[14].classList.contains('e-node-focus')).toBe(true);
            ddtreeObj.onFocusOut();
            done();
        }, 100);
    });
    describe('KeyBoard event testing', () => {
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
                treeSettings: { loadOnDemand: true }

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

        it('home', (done: Function) => {
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(15);
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            var li = ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-hover')).toBe(true);
            expect(li[14].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[14].classList.contains('e-node-focus')).toBe(false);
            keyboardEventArgs.action = 'end';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[14].classList.contains('e-hover')).toBe(true);
            expect(li[0].classList.contains('e-node-focus')).toBe(false);
            expect(li[14].classList.contains('e-node-focus')).toBe(true);
            keyboardEventArgs.action = 'home';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-hover')).toBe(true);
            expect(li[14].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[14].classList.contains('e-node-focus')).toBe(false);
            ddtreeObj.onFocusOut();
            done();
        }, 100);
    });

    describe('KeyBoard event testing', () => {
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
                treeSettings: { loadOnDemand: true }

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

        it('moveDown', (done: Function) => {
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(15);
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            var li = ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-hover')).toBe(true);
            expect(li[5].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[5].classList.contains('e-node-focus')).toBe(false);
            keyboardEventArgs.action = 'moveDown';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[5].classList.contains('e-hover')).toBe(true);
            expect(li[0].classList.contains('e-node-focus')).toBe(false);
            expect(li[5].classList.contains('e-node-focus')).toBe(true);
            ddtreeObj.onFocusOut();
            done();
        }, 100);
    });
    describe('KeyBoard event testing', () => {
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
                treeSettings: { loadOnDemand: true }

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

        it('moveUp', (done: Function) => {
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(15);
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            var li = ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-hover')).toBe(true);
            expect(li[5].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[5].classList.contains('e-node-focus')).toBe(false);
            keyboardEventArgs.action = 'moveDown';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[5].classList.contains('e-hover')).toBe(true);
            expect(li[0].classList.contains('e-node-focus')).toBe(false);
            expect(li[5].classList.contains('e-node-focus')).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-hover')).toBe(true);
            expect(li[5].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[5].classList.contains('e-node-focus')).toBe(false);
            ddtreeObj.onFocusOut();
            done();
        }, 100);
    });
});
