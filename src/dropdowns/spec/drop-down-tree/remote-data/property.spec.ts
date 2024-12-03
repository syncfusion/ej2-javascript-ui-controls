import { Browser, createElement, setCulture } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { remoteData, remoteData2, remoteData2_1, remoteData1_1, remoteData3_1 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

xdescribe('DropDown Tree control Remote datasource', () => {
    describe('property testing', () => {
        describe('enableRtl', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    enableRtl: true,
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
            });
            it('functionality testing', (done: Function) => {
                expect(ddtreeObj.treeObj.element.classList.contains('e-rtl')).toBe(true);
                done();
            }, 100);
        });
        describe('enabled', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    enabled: false,
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
            });
            it('functionality testing', (done: Function) => {
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
                done();
            }, 100);
        });
        describe('readonly', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    readonly: true,
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
            });
            it('functionality testing', (done: Function) => {
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
                done();
            }, 100);
        });
        describe('cssClass', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    cssClass: 'custom-dropdowntree',
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
            });
            /**
         * cssclass property
         */
            it('with valid value', () => {
                var ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect((ddtreeObj as any).element.parentElement.classList.contains('custom-dropdowntree')).toBe(true);
                expect((ddtreeObj as any).popupObj.element.classList.contains('custom-dropdowntree')).toBe(true);
            });

        });
        describe('cssClass', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    cssClass: undefined,
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
            });
            /**
             * cssclass property
             */
            it('with undefined', () => {
                var ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect((ddtreeObj as any).element.parentElement.classList.contains('custom-dropdowntree')).toBe(false);
                expect((ddtreeObj as any).popupObj.element.classList.contains('custom-dropdowntree')).toBe(false);
                expect((ddtreeObj as any).element.parentElement.classList.contains(null)).toBe(false);
            });

        });
        describe('cssClass', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    cssClass: null,
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
            });
            /**
             * cssclass property
             */
            it('with null', () => {
                var ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect((ddtreeObj as any).element.parentElement.classList.contains('custom-dropdowntree')).toBe(false);
                expect((ddtreeObj as any).popupObj.element.classList.contains('custom-dropdowntree')).toBe(false);
                expect((ddtreeObj as any).element.parentElement.classList.contains(null)).toBe(false);
            });
        });
        describe('enablePersistence', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip',
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
            });
            /**
             * enablePersistence
             */
            it('functionality testing', () => {
                let persisData: any = JSON.parse(ddtreeObj.getPersistData());
                expect(persisData.value).toBe(null);
                ddtreeObj.showPopup();
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                let seItems: any = JSON.parse(ddtreeObj.getPersistData());
                expect(seItems.value).toContain('01');
            });
        });
        describe('floatLableType', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    placeholder: 'Select any',
                    floatLabelType: 'Auto'
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
            });
            /**
             * floatLableType
             */
            it('functionality testing', () => {
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
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    placeholder: 'Select any',
                    floatLabelType: 'Always'
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                mouseEventArgs.target = document.body;
                let floatElement1 = (ddtreeObj as any).inputWrapper.querySelector('.e-float-text')
                var ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                expect(floatElement1.classList.contains('e-label-top')).toBe(true);

            });
        });
        describe('placeholder', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    placeholder: 'Select a value'
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
            });
            /**
             * placeholder
             */
            it('functionality testing', () => {
                expect(ddtreeObj.element.getAttribute('placeholder')).toEqual('Select a value');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    placeholder: ''
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.element.getAttribute('placeholder')).toEqual(null);
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    placeholder: null,
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.element.getAttribute('placeholder')).toEqual(null);
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    placeholder: undefined
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.element.getAttribute('placeholder')).toEqual(null);
            });
        });
        describe('htmlAttributes', () => {
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

            let ele: HTMLElement = createElement('input', { id: 'tree1' });
            ele.setAttribute('data-required', 'name');
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
            let originalTimeout: any;
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    htmlAttributes: { 'data-msg-container-id': 'msgid' }
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
            });
            /**
             * htmlAttributes
             */
            it('functionality testing', () => {
                expect(ddtreeObj.hiddenElement.getAttribute('data-msg-container-id')).not.toBeNull();
                expect(ddtreeObj.hiddenElement.getAttribute('data-required')).toBe('name');
                expect(ddtreeObj.htmlAttributes['data-required']).toBe('name');
                ddtreeObj.destroy();
            });
        });
        describe('Width', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    width: '30em',
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
            });
            /**
             * Width
             */
            it('functionality testing', () => {
                expect(ddtreeObj.element.parentElement.style.width).toEqual('30em');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    width: '80%',
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.element.parentElement.style.width).toEqual('80%');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    width: '450px',
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.element.parentElement.style.width).toEqual('450px');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    width: 800,
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.element.parentElement.style.width).toEqual('800px');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    width: null,
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.element.parentElement.style.width).toEqual('');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    width: undefined,
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.element.parentElement.style.width).toEqual('100%');
            });
        });
        describe('popupWidth', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    popupWidth: "450px",
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
            });
            /**
             * popupWidth
             */
            it('functionality testing', () => {
                ddtreeObj.showPopup();
                expect((ddtreeObj as any).popupObj.element.style.width).toEqual('450px');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    popupWidth: 800,
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                ddtreeObj.showPopup();
                expect((ddtreeObj as any).popupObj.element.style.width).toEqual('800px')
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    popupWidth: null,
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                ddtreeObj.showPopup();
                expect((ddtreeObj as any).popupObj.element.style.width).toEqual('');
            });
        });
        describe('popupHeight', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    popupHeight: "30em",
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
            });
            /**
             * popupHeight
             */
            it('functionality testing', () => {
                ddtreeObj.showPopup();
                expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('30em');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    popupHeight: '450px',
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                ddtreeObj.showPopup();
                expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('450px');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    popupHeight: 800,
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                ddtreeObj.showPopup();
                expect((ddtreeObj as any).popupObj.element.style.maxHeight).toEqual('800px');
            });
        });
        describe('zIndex', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    zIndex: 1233
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
            });
            it('functionality testing', (done: Function) => {
                ddtreeObj.showPopup();
                expect((ddtreeObj as any).popupObj.element.style.zIndex === '1233').toBe(true);
                done();
            }, 100);
        });
        describe('showDropDownIcon', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    showDropDownIcon: false
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
            });
            it('functionality testing', (done: Function) => {
                expect((ddtreeObj as any).element.parentElement.lastElementChild.classList.contains('e-ddt-icon')).toBe(false);
                expect(ddtreeObj.element.parentElement.lastElementChild.classList.contains('e-clear-icon')).toBe(true);
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    showDropDownIcon: true
                });
                ddtreeObj.appendTo(ele);
                expect((ddtreeObj as any).element.parentElement.lastElementChild.classList.contains('e-ddt-icon')).toBe(true);
                expect(ddtreeObj.element.parentElement.lastElementChild.classList.contains('e-clear-icon')).toBe(false);
                done();
            }, 100);
        });
        describe('showClearIcon', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    showClearButton: false
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
            });
            it('functionality testing', (done: Function) => {
                expect((ddtreeObj).element.nextElementSibling.classList.contains('e-clear-icon')).toBe(false);
                done();
            }, 100);
        });
        describe('value', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    value: ['01'],
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
            it('functionality testing', (done: Function) => {
                expect(ddtreeObj.value).not.toBe(null);
                expect(ddtreeObj.text).toBe('Music')
                var hiddenElement = ddtreeObj.inputWrapper.querySelector('option');
                expect(hiddenElement).not.toBe(null);
                expect(hiddenElement.getAttribute('value')).toBe('01');
                expect(hiddenElement.text).toBe('Music');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    value: null
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.value).toBe(null);
                expect(ddtreeObj.text).toBe(null);
                var hiddenElement_1 = ddtreeObj.inputWrapper.querySelector('option');
                expect(hiddenElement_1).toBe(null);
                done();
            }, 100);
        });
        describe('text', () => {
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
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip'
                    },
                    text: 'Music',
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
            });
            it('functionality testing', (done: Function) => {
                expect(ddtreeObj.value).not.toBe(null);
                expect(ddtreeObj.text).toBe('Music')
                var hiddenElement = ddtreeObj.inputWrapper.querySelector('option');
                expect(hiddenElement).not.toBe(null);
                expect(hiddenElement.getAttribute('value')).toBe('01');
                expect(hiddenElement.text).toBe('Music');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    text: null
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.value).toBe(null);
                expect(ddtreeObj.text).toBe(null);
                var hiddenElement_1 = ddtreeObj.inputWrapper.querySelector('option');
                expect(hiddenElement_1).toBe(null);
                done();
            }, 100);
        });
        describe('sortOrder', () => {
            let ddtreeObj: any;
            let originalTimeout: any;
            let ele: HTMLElement = createElement('input', { id: 'tree1' });
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
            beforeEach((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected'
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
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('functionality testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(2);
                    expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                    expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                    done();
                }, 100);
            });
        });
        describe('itemTemplate', () => {
            let ddtreeObj: any;
            let originalTimeout: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
            beforeEach((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    itemTemplate: '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}',
                    valueTemplate: '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}',
                });
                ddtreeObj.appendTo(ele);
                setTimeout(function () { done(); });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('as string', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-text-content');
                expect(li[0].querySelector('i')).not.toBe(null);
                expect(li[0].querySelector('b')).toBe(null);
                expect(li[1].querySelector('b')).not.toBe(null);
                expect(li[1].querySelector('i')).toBe(null);
                done();
            }, 450);
        });
        describe('headerTemplate', () => {
            let ddtreeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
            let originalTimeout: any;
            beforeEach((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    headerTemplate: '<div class="header"><span >HEADER VIA STRING</span></div>',
                });
                ddtreeObj.appendTo(ele);
                setTimeout(function () { done(); });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('as string', (done: Function) => {
                ddtreeObj.showPopup();
                expect(ddtreeObj.headerTemplate).not.toBe(null);
                expect(ddtreeObj.popupObj.element.firstChild.classList.contains('e-ddt-header')).toBe(true);
                expect(ddtreeObj.popupObj.element.firstChild.innerText).toEqual("HEADER VIA STRING");
                ddtreeObj.hidePopup();
                done();
            }, 450);
        });
        describe('footerTemplate', () => {
            let ddtreeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
            let originalTimeout: any;
            beforeEach((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    footerTemplate: '<div class="header"><span >FOOTER VIA STRING</span></div>',
                });
                ddtreeObj.appendTo(ele);
                setTimeout(function () { done(); });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('as string', (done: Function) => {
                ddtreeObj.showPopup();
                expect(ddtreeObj.footerTemplate).not.toBe(null);
                expect(ddtreeObj.popupObj.element.lastElementChild.classList.contains('e-ddt-footer')).toBe(true);
                expect(ddtreeObj.popupObj.element.lastElementChild.innerText).toEqual("FOOTER VIA STRING");
                ddtreeObj.hidePopup();
                done();
            }, 450);
        });
        describe('itemTemplate', () => {
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
            let originalTimeout: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
            beforeEach((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                let template: Element = createElement('div', { id: 'template' });
                template.innerHTML = '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                document.body.appendChild(template);
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected',
                        child: { dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", }
                    },
                    itemTemplate: '#template',
                    valueTemplate: '#template'
                });
                ddtreeObj.appendTo(ele);
                setTimeout(function () { done(); });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('as script', (done: Function) => {
                let txt: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-text-content');
                expect(txt[0].querySelector('i')).not.toBe(null);
                expect(txt[0].querySelector('b')).toBe(null);
                expect(txt[1].querySelector('b')).not.toBe(null);
                expect(txt[1].querySelector('i')).toBe(null);
                done();
            }, 450);
        });
        describe('headerTemplate', () => {
            let ddtreeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
            let originalTimeout: any;
            beforeEach((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                let headerTemplate: Element = createElement('div', { id: 'headerTemplate' });
                headerTemplate.innerHTML = '<div class="header"><span >HEADER Via SCRIPT</span></div>';
                document.body.appendChild(headerTemplate);
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    headerTemplate: '#headerTemplate',
                });
                ddtreeObj.appendTo(ele);
                setTimeout(function () { done(); });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('as script', (done: Function) => {
                ddtreeObj.showPopup();
                expect(ddtreeObj.headerTemplate).not.toBe(null);
                expect(ddtreeObj.popupObj.element.firstChild.classList.contains('e-ddt-header')).toBe(true);
                expect(ddtreeObj.popupObj.element.firstChild.innerText).toEqual("HEADER Via SCRIPT");
                ddtreeObj.hidePopup();
                done();
            }, 450);
        });
        describe('footerTemplate', () => {
            let ddtreeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
            let originalTimeout: any;
            beforeEach((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                let footerTemplate: Element = createElement('div', { id: 'footerTemplate' });
                footerTemplate.innerHTML = '<div class="header"><span >FOOTER Via SCRIPT</span></div>';
                document.body.appendChild(footerTemplate);
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    footerTemplate: '#footerTemplate',
                });
                ddtreeObj.appendTo(ele);
                setTimeout(function () { done(); });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('as script', (done: Function) => {
                ddtreeObj.showPopup();
                expect(ddtreeObj.footerTemplate).not.toBe(null);
                expect(ddtreeObj.popupObj.element.lastElementChild.classList.contains('e-ddt-footer')).toBe(true);
                expect(ddtreeObj.popupObj.element.lastElementChild.innerText).toEqual("FOOTER Via SCRIPT");
                ddtreeObj.hidePopup();
                done();
            }, 450);
        });
        describe('action Failure', () => {
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData11111' });
            let originalTimeout: any;

            let ddtreeObj: any;
            beforeEach((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setCulture('en-US')
                jasmine.Ajax.install();
                let ele: HTMLElement = createElement('input', { id: 'tree1' });
                document.body.appendChild(ele);
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                });
                ddtreeObj.appendTo(ele);
                setTimeout(function () { done(); });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    'status': 404,
                    'contentType': 'application/json',
                    'responseText': 'Page not found'
                });
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            });
            afterEach(() => {
                if (ddtreeObj)
                    ddtreeObj.destroy();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('with default value', () => {
                ddtreeObj.showPopup();
                expect(ddtreeObj.popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(true);
                expect(ddtreeObj.popupObj.element.firstElementChild.innerText).toBe('The Request Failed');
            });
        });
        describe('actionFailureTemplate', () => {
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData11111' });
            let originalTimeout: any;

            let ddtreeObj: any;
            beforeEach((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                jasmine.Ajax.install();
                let ele: HTMLElement = createElement('input', { id: 'tree1' });
                document.body.appendChild(ele);
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    actionFailureTemplate: '<div><span>Server exception: 404 Not found</span></div>'
                });
                ddtreeObj.appendTo(ele);
                setTimeout(function () { done(); });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    'status': 404,
                    'contentType': 'application/json',
                    'responseText': 'Page not found'
                });
            });
            afterEach(() => {
                if (ddtreeObj)
                    ddtreeObj.destroy();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('with custom value', () => {
                ddtreeObj.showPopup();
                expect(ddtreeObj.popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(true);
                expect(ddtreeObj.popupObj.element.firstElementChild.innerText).toBe('Server exception: 404 Not found');
            });
        });
        describe('noRecordsTemplate', () => {
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
                        dataSource: [], value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    width: '30em',
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
            /**
             * noRecordsTemplate
             */
            it('functionality testing', () => {
                ddtreeObj.showPopup();
                expect((ddtreeObj as any).popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(true);
                expect((ddtreeObj as any).popupObj.element.firstElementChild.innerText).toBe('No Records Found');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: [], value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    noRecordsTemplate: '<div> There is no records to rendering the list items</div>'
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                ddtreeObj.showPopup();
                expect((ddtreeObj as any).popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(true);
                expect((ddtreeObj as any).popupObj.element.firstElementChild.innerText).toBe('There is no records to rendering the list items');
                ddtreeObj.destroy();
                let noRecordTemplate: Element = createElement('div', { id: 'noRecordTemplate' });
                noRecordTemplate.innerHTML = '<div><span>There is no record found</span></div>';
                document.body.appendChild(noRecordTemplate);
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: [], value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    noRecordsTemplate: '#noRecordTemplate'
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                ddtreeObj.showPopup();
                expect((ddtreeObj as any).popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(true);
                expect((ddtreeObj as any).popupObj.element.firstElementChild.innerText).toBe('There is no record found');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    width: 800,
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.element.parentElement.style.width).toEqual('800px');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    width: null,
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.element.parentElement.style.width).toEqual('');
                ddtreeObj.destroy();
                ddtreeObj = new DropDownTree({
                    fields: {
                        dataSource: dataManager1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    width: undefined,
                });
                ddtreeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                expect(ddtreeObj.element.parentElement.style.width).toEqual('100%');
            });
        });
        describe('allowMultiSelection true', () => {
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
                    allowMultiSelection: true,
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
            afterEach(() => {
                if (ddtreeObj)
                    ddtreeObj.destroy();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('With Default Mode', () => {
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(2);
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(ddtreeObj.text).toBe('Music');
                expect(ddtreeObj.value[0]).toBe('01');
                var chipElement = ddtreeObj.element.parentElement.firstElementChild;
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
                var chips = chipElement.querySelectorAll('.e-chips');
                expect(chips.length).toBe(1);
                expect(chips[0].getAttribute("data-value")).toBe("01");
                expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Music");
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(ddtreeObj.value.length).toBe(2);
                var nchips = chipElement.querySelectorAll('.e-chips');
                expect(nchips.length).toBe(2);
                ddtreeObj.hidePopup();
                ddtreeObj.onFocusOut();
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            });
        });
        describe('allowMultiSelection true', () => {
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
                    allowMultiSelection: true,
                    treeSettings: { loadOnDemand: true },
                    mode: 'Delimiter'
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
            it('With Delimiter Mode', () => {
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(2);
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(ddtreeObj.text).toBe('Music');
                expect(ddtreeObj.value[0]).toBe('01');
                var chipElement = ddtreeObj.element.parentElement.firstElementChild;
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(false);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(ddtreeObj.value.length).toBe(2);
                ddtreeObj.hidePopup();
                ddtreeObj.onFocusOut();
                expect(ddtreeObj.text).toBe('Music,Downloads');
            });
        });
        describe('allowMultiSelection true', () => {
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
                    allowMultiSelection: true,
                    treeSettings: { loadOnDemand: true },
                    wrapText: true,
                    mode: 'Box'
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
            it('With Box Mode', () => {
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(2);
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(ddtreeObj.text).toBe('Music');
                expect(ddtreeObj.value[0]).toBe('01');
                var chipElement = ddtreeObj.element.parentElement.firstElementChild;
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
                var chips = chipElement.querySelectorAll('.e-chips');
                expect(chips.length).toBe(1);
                expect(chips[0].getAttribute("data-value")).toBe("01");
                expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Music");
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(ddtreeObj.value.length).toBe(2);
                var nchips = chipElement.querySelectorAll('.e-chips');
                expect(nchips.length).toBe(2);
                ddtreeObj.hidePopup();
                ddtreeObj.onFocusOut();
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            });
        });
        describe('allowMultiSelection true', () => {
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
                    allowMultiSelection: true,
                    treeSettings: { loadOnDemand: true },
                    mode: 'Delimiter',
                    delimiterChar: '*'
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
            it('With Delimiterchar', () => {
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
                expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(2);
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(ddtreeObj.text).toBe('Music');
                expect(ddtreeObj.value[0]).toBe('01');
                var chipElement = ddtreeObj.element.parentElement.firstElementChild;
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(false);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(ddtreeObj.element.value).toBe('Music* Downloads');
                expect(ddtreeObj.value.length).toBe(2);
                ddtreeObj.hidePopup();
                ddtreeObj.onFocusOut();
            });
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
                    showCheckBox: true
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
            it('With Default Mode', () => {
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
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
                expect(chips[0].getAttribute("data-value")).toBe("01");
                expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Music");
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle[1].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle[1].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle[1].querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle[1].getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(ddtreeObj.value.length).toBe(2);
                var nchips = chipElement.querySelectorAll('.e-chips');
                expect(nchips.length).toBe(2);
                ddtreeObj.hidePopup();
                ddtreeObj.onFocusOut();
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            });
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
                    mode: 'Delimiter'
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
            it('With Delimiter Mode', () => {
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
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
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(false);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle[1].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle[1].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle[1].querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle[1].getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(ddtreeObj.value.length).toBe(2);
                ddtreeObj.onFocusOut();
                expect(ddtreeObj.text).toBe('Music,Downloads');
            });
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
                    mode: 'Box',
                    wrapText: true
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
            it('With Box Mode', () => {
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
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
                expect(chips[0].getAttribute("data-value")).toBe("01");
                expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Music");
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle[1].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle[1].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle[1].querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle[1].getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(ddtreeObj.value.length).toBe(2);
                var nchips = chipElement.querySelectorAll('.e-chips');
                expect(nchips.length).toBe(2);
                ddtreeObj.onFocusOut();
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            });
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
                    mode: 'Delimiter',
                    delimiterChar: '*'
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
            it('With Delimiter Mode', () => {
                let ele = ddtreeObj.element;
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ele.dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
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
                expect(chipElement.classList.contains('e-chips-wrapper')).toBe(false);
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle[1].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle[1].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                checkEle[1].querySelector('.e-frame').dispatchEvent(e);
                expect(checkEle[1].getAttribute('aria-checked')).toBe('true');
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(ddtreeObj.value.length).toBe(2);
                ddtreeObj.onFocusOut();
                expect(ddtreeObj.text).toBe('Music,Downloads');
                expect(ddtreeObj.element.value).toBe('Music* Downloads');
            });
        });
    });
});
