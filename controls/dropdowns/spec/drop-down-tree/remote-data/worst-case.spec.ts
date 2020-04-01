import { createElement } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { DataManager } from '@syncfusion/ej2-data';
import { remoteData } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';


describe('DropDown Tree control List datasource', () => {
    describe('Worst case testing', () => {
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
        it('for window resize', () => {
            ddtreeObj.showPopup();
            ddtreeObj.windowResize();
            ddtreeObj.onFocusOut();
        });
    });
});
