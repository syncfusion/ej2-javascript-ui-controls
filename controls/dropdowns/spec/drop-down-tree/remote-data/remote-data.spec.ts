import { Browser, createElement, setCulture } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { remoteData, remoteData2, remoteData2_1, remoteData1_1, remoteData3_1 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';



describe('DropDownTree control remote datasource', () => {
    describe('with empty arguments', () => {
        let ddtreeObj: any;
        let ele: HTMLElement = createElement('input', { id: 'tree1' });
        let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
        let originalTimeout: any;
        beforeEach((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            jasmine.Ajax.install();
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: { dataSource: dataManager1, value: 'OrderID', text: 'CustomerID', iconCss: 'ShipCity', imageUrl: 'ShipCountry', tooltip: 'ShipName', hasChildren: 'Freight' },
            });
            ddtreeObj.appendTo(ele);
            setTimeout(function () { done() });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: [], __count: 0 })
            });
        });
        afterEach(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('functionality testing', () => {
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(0);
            ddtreeObj.value = ['11'];
            ddtreeObj.text = 'aaaa';
            ddtreeObj.dataBind();
            expect(ddtreeObj.value).toBe(null);
            expect(ddtreeObj.text).toBe(null);
        });
    });
    describe('without datasource', () => {
        let ddtreeObj: any;
        let ele: HTMLElement = createElement('input', { id: 'tree1' });
        let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
        let originalTimeout: any;
        beforeEach((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            jasmine.Ajax.install();
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: { dataSource: [], value: 'OrderID', text: 'CustomerID', iconCss: 'ShipCity', imageUrl: 'ShipCountry', tooltip: 'ShipName', hasChildren: 'Freight' },
            });
            ddtreeObj.appendTo(ele);
            setTimeout(function () { done() });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: [], __count: 0 })
            });
        });
        afterEach(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('functionality testing', () => {
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(0);
            ddtreeObj.value = ['11'];
            ddtreeObj.dataBind();
            expect(ddtreeObj.value).toBe(null);
        });
    });
    describe('with id as number', () => {
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
        it('functionality testing', (done: Function) => {
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(15);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('VINET');
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('10248');
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('Reims')).toBe(true);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('Vins et alcools Chevalier');
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').childElementCount).toBe(2);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').querySelector('.e-icons')).not.toBe(null);
            let newli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = newli[1].querySelector('.e-icons');
            expect(newli[1].childElementCount).toBe(2);
            ddtreeObj.treeObj.preventContextMenu(mouseEventArgs);
            ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: [], __count: 0 })
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(newli[1].childElementCount).toBe(2);
                expect(newli[1].querySelector('.e-icons')).toBe(null);
                mouseEventArgs.target = newli[0].querySelector('.e-icons');
                expect(newli[0].childElementCount).toBe(2);
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                expect(newli[0].querySelector('.e-icons').classList.contains('e-icons-spinner')).toBe(true);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData, __count: 15 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(newli[0].childElementCount).toBe(3);
                    ddtreeObj.text = 'Music';
                    ddtreeObj.dataBind();
                    expect(ddtreeObj.text).toBe(null);
                    done();
                }, 100);
            }, 100);
        });
    });
    describe('with id as string', () => {
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
                    dataSource: dataManager1, value: 'CustomerID', text: 'OrderID', iconCss: 'ShipCity', tooltip: 'ShipName', hasChildren: 'Freight', tableName: 'Employees', htmlAttributes: 'HtmlAttr', imageUrl: 'Image', selected: 'nodeSelected',
                    child: { dataSource: dataManager1, value: 'CustomerID', text: 'ShipCountry', parentValue: 'OrderID', hasChildren: 'ShipCountry' }
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
        it('functionality testing', (done: Function) => {
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(15);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('10248');
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('VINET');
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-icon').classList.contains('Reims')).toBe(true);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').title).toBe('Vins et alcools Chevalier');
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li')[2].classList.contains('firstnode')).toBe(true);
            expect(ddtreeObj.treeObj.element.querySelectorAll('li')[2].style.backgroundColor).toBe('red');
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').childElementCount).toBe(2);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-item').querySelector('.e-icons')).not.toBe(null);
            let newli: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = newli[1].querySelector('.e-icons');
            expect(newli[1].childElementCount).toBe(2);
            ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: [], __count: 0 })
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(newli[1].childElementCount).toBe(2);
                expect(newli[1].querySelector('.e-icons')).toBe(null);
                mouseEventArgs.target = newli[0].querySelector('.e-icons');
                expect(newli[0].childElementCount).toBe(2);
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData, __count: 15 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(newli[0].childElementCount).toBe(3);
                    expect(newli[0].querySelector('.e-icons')).not.toBe(null);
                    ddtreeObj.text = 'Music';
                    ddtreeObj.dataBind();
                    expect(ddtreeObj.text).toBe(null);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Remote data Offline', () => {
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
        let dataManager1: DataManager;
        let originalTimeout: any;
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            jasmine.Ajax.install();
            dataManager1 = new DataManager({ url: '/TreeView/remoteData', offline: true })
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData3_1, __count: 2 })
            }); setTimeout(function () { done() });
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: 'nodeId', text: 'nodeText', iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', child: 'nodeChild'
                },
                treeSettings: { loadOnDemand: true },
                text: 'Wild.mpeg'
            });
            ddtreeObj.appendTo('#tree1');
            setTimeout(function () { done() });
        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('functionality testing', (done: Function) => {
            expect(ddtreeObj.value.length).toBe(1);
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
            expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
            expect(li[0].childElementCount).toBe(2);
            expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
            tapEvent.tapCount = 2;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
            setTimeout(function () {
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                expect(li[0].childElementCount).toBe(3);
                expect(ddtreeObj.getData('01')[0].nodeChild[0].nodeText).toBe('Gouttes.mp3');
                done();
            }, 450);
            tapEvent.tapCount = 2;
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
            setTimeout(function () {
                expect(li[1].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                expect(li[1].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                expect(li[1].childElementCount).toBe(3);
                expect(ddtreeObj.getData('02')[0].nodeChild.length).toBe(2);
                done();
            }, 450);
        });
    });

    describe('Child nodes with checkbox enabled', () => {
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
        let dataManager1: DataManager;
        let originalTimeout: any;
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            jasmine.Ajax.install();
            dataManager1 = new DataManager({ url: '/TreeView/remoteData' })
           
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: dataManager1, value: 'nodeId', text: 'nodeText', iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', child: 'nodeChild',
                    selected: 'nodeSelected'
                },
                showCheckBox: true,
                treeSettings: { loadOnDemand: true }
            });
            ddtreeObj.appendTo('#tree1');
            setTimeout(function () { done() });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData3_1, __count: 2 })
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
            ddtreeObj.showPopup();
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
            expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
            expect(li[0].childElementCount).toBe(2);
            expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
            tapEvent.tapCount = 2;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            ddtreeObj.treeObj.touchExpandObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData3_1, __count: 2 })
            });
            setTimeout(function () {
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                expect(li[0].childElementCount).toBe(3);
                expect(ddtreeObj.getData('01')[0].nodeChild[0].nodeText).toBe('Gouttes.mp3');
                ddtreeObj.onFocusOut();
                done();
            }, 100);
        });
    });

    describe('with selected and checkedNodes attribute', () => {
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
        let ele: HTMLElement = createElement('div', { id: 'tree1' });
        let data: DataManager = new DataManager({
            url: 'https://services.odata.org/V4/Northwind/Northwind.svc',
            adaptor: new ODataV4Adaptor,
            crossDomain: true,
        });
        let query: Query = new Query().from('Employees').select('EmployeeID,FirstName,Title').take(5);
        let query1: Query = new Query().from('Orders').select('OrderID,EmployeeID,ShipName').take(5);
        beforeAll((done: Function) => {
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: data, query: query, value: 'EmployeeID', text: 'FirstName', hasChildren: 'EmployeeID',
                    child: { dataSource: data, query: query1, value: 'OrderID', parentValue: 'EmployeeID', text: 'ShipName', selected: 'isSelected' }
                },
                showCheckBox: true,
                dataBound: () => {
                    done();
                }
            });
            ddtreeObj.appendTo(ele);

        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';

        });
        it('functionality testing', () => {
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(30);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Nancy');
            expect(ddtreeObj.treeObj.element.querySelectorAll('li')[0].querySelector('ul li')).not.toBe(null);
        });
    });
    describe('with selected and checkedNodes attribute', () => {
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
        let ele: HTMLElement = createElement('div', { id: 'tree1' });
        let data: DataManager = new DataManager({
            url: 'https://services.odata.org/V4/Northwind/Northwind.svc',
            adaptor: new ODataV4Adaptor,
            crossDomain: true,
        });
        let query: Query = new Query().from('Employees').select('EmployeeID,FirstName,Title').take(5);
        let query1: Query = new Query().from('Orders').select('OrderID,EmployeeID,ShipName').take(5);
        beforeAll((done: Function) => {
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: data, query: query, value: 'EmployeeID', text: 'FirstName', hasChildren: 'EmployeeID',
                    child: { dataSource: data, query: query1, value: 'OrderID', parentValue: 'EmployeeID', text: 'ShipName', child: 'nodeChild' }
                },
                showCheckBox: true,
                dataBound: () => {
                    done();
                }
            });
            ddtreeObj.appendTo(ele);

        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
        });
        it('coverage testing', () => {
            expect(ddtreeObj.treeObj.element.querySelectorAll('li').length).toBe(30);
            expect(ddtreeObj.treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Nancy');
            expect(ddtreeObj.treeObj.element.querySelectorAll('li')[0].querySelector('ul li')).not.toBe(null);
        });
    });
    describe('overflow testing', () => {
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
        let data: DataManager = new DataManager({
            url: 'https://services.odata.org/V4/Northwind/Northwind.svc',
            adaptor: new ODataV4Adaptor,
            crossDomain: true,
        });
        let query: Query = new Query().from('Employees').select('EmployeeID,FirstName,Title').take(5);
        let query1: Query = new Query().from('Orders').select('OrderID,EmployeeID,ShipName').take(5);
        beforeAll((done: Function) => {
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: data, query: query, value: 'EmployeeID', text: 'FirstName', hasChildren: 'EmployeeID',
                    child: { dataSource: data, query: query1, value: 'OrderID', parentValue: 'EmployeeID', text: 'ShipName', child: 'nodeChild' }
                },
                showCheckBox: true,
                width: '150px',
                dataBound: () => {
                    done();
                }
            });
            ddtreeObj.appendTo(ele);

        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
        });
        it('for showCheckBox', () => {
            var li = ddtreeObj.treeObj.element.querySelectorAll('li');
            ddtreeObj.showPopup();
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            let chipElement = ddtreeObj.inputWrapper.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(3);
            let oveflowElement = ddtreeObj.inputWrapper.firstElementChild.nextElementSibling;
            expect(oveflowElement.classList.contains('e-overflow')).toBe(true);
            expect(oveflowElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.onFocusOut();
            let nchipElement = ddtreeObj.inputWrapper.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.inputWrapper.firstElementChild.nextElementSibling;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.inputWrapper.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.inputWrapper.firstElementChild.nextElementSibling;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
    });

    describe('overflow testing', () => {
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
        let data: DataManager = new DataManager({
            url: 'https://services.odata.org/V4/Northwind/Northwind.svc',
            adaptor: new ODataV4Adaptor,
            crossDomain: true,
        });
        let query: Query = new Query().from('Employees').select('EmployeeID,FirstName,Title').take(5);
        let query1: Query = new Query().from('Orders').select('OrderID,EmployeeID,ShipName').take(5);
        beforeAll((done: Function) => {
            document.body.appendChild(ele);
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: data, query: query, value: 'EmployeeID', text: 'FirstName', hasChildren: 'EmployeeID',
                    child: { dataSource: data, query: query1, value: 'OrderID', parentValue: 'EmployeeID', text: 'ShipName', child: 'nodeChild' }
                },
                allowMultiSelection: true,
                width: '150px',
                dataBound: () => {
                    done();
                }
            });
            ddtreeObj.appendTo(ele);

        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
        });
        it('for allowMultiSelection', () => {
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
           ddtreeObj.value = ['1', '2', '3']
           ddtreeObj.dataBind();
            let chipElement = ddtreeObj.inputWrapper.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(3);
            let oveflowElement = ddtreeObj.inputWrapper.firstElementChild.nextElementSibling;
            expect(oveflowElement.classList.contains('e-overflow')).toBe(true);
            ddtreeObj.onFocusOut();
            let nchipElement = ddtreeObj.inputWrapper.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.inputWrapper.firstElementChild.nextElementSibling;
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.inputWrapper.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.inputWrapper.firstElementChild.nextElementSibling;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
    });
});
