import { createElement, isVisible, isNullOrUndefined, Browser, EmitType } from '@syncfusion/ej2-base';
import { MultiSelect, ISelectAllEventArgs } from '../../src/multi-select/index';
import { FilteringEventArgs } from '../../src/drop-down-base';
import { DataManager, Query, ODataV4Adaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';
import { extend } from '@syncfusion/ej2-base';
MultiSelect.Inject(CheckBoxSelection);

let mouseEventArgs: any = { preventDefault: function () { }, target: null };
let keyboardEventArgs = {
    preventDefault: function () { },
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    char: '',
    key: '',
    charCode: 22,
    keyCode: 22,
    which: 22,
    code: 22
};
describe('MultiSelect', () => {

    let data: JSON[] = ([
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 },
        { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61 },
        { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83 },
        { OrderID: 10251, CustomerID: 'TOMSP', EmployeeID: 7, Freight: 70.63 },
        { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45 }
    ] as Object) as JSON[];

    type MockAjaxReturn = { promise: Promise<Object>, request: JasmineAjaxRequest };
    type ResponseType = { result: Object[], count: number | string };

    let mockAjax: Function = (d: { data: { [o: string]: Object | Object[] } | Object[], dm?: DataManager }, query: Query | Function, response?: Object):
        MockAjaxReturn => {
        jasmine.Ajax.install();
        let dataManager = d.dm || new DataManager({
            url: 'https://services.syncfusion.com/js/production/api/Employees',
            adaptor: new WebApiAdaptor,
            crossDomain: true
        });
        let prom: Promise<Object> = dataManager.executeQuery(query);
        let request: JasmineAjaxRequest;
        let defaults: Object = {
            'status': 200,
            'contentType': 'application/json',
            'responseText': JSON.stringify(d.data)
        };
        let responses: Object = {};
        request = jasmine.Ajax.requests.mostRecent();
        extend(responses, defaults, response);
        request.respondWith(responses);
        return {
            promise: prom,
            request: request
        }
    };

    // describe('EJ2-17608 - Duplicate values are listed while fetching data with remote data when allowCustom value is set to true.', () => {
    //     let listObj: any;
    //     let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
    //     let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
    //     let count: number = 0;
    //     beforeAll(() => {
    //         document.body.appendChild(mEle);
    //         listObj = new MultiSelect({
    //             dataSource: remoteData,
    //             allowCustomValue: true,
    //             allowFiltering: true,
    //             actionComplete: (e: any) => {
    //                 if (e.request) {
    //                     count++;
    //                 }
    //             },
    //             query: new Query().take(10),
    //             fields: { value: 'EmployeeID', text: 'FirstName' }
    //         });
    //         listObj.appendTo(mEle);
    //     });
    //     afterAll(() => {
    //         listObj.destroy();
    //         mEle.remove();
    //     });

    //     it('Two custom value select ', (done) => {
    //         listObj.focusIn();
    //         listObj.showPopup();
    //         setTimeout(() => {
    //             expect(count === 1).toBe(true);
    //             count = 0;
    //             (<any>listObj).inputElement.value = "RUBY";
    //             //open action validation
    //             keyboardEventArgs.keyCode = 113;
    //             (<any>listObj).keyDownStatus = true;
    //             (<any>listObj).onInput();
    //             (<any>listObj).keyUp(keyboardEventArgs);
    //             setTimeout(() => {
    //                 expect(count === 1).toBe(true);
    //                 mouseEventArgs.target = (<any>listObj).liCollections[0];
    //                 mouseEventArgs.type = 'click';
    //                 (<any>listObj).onMouseClick(mouseEventArgs);
    //                 done();
    //             }, 400);
    //         }, 400);
    //     });
    //     it(' Without duplicate items while type custom value ', (done) => {
    //         listObj.focusIn();
    //         listObj.showPopup();
    //         setTimeout(() => {
    //             expect(count === 1).toBe(true);
    //             count = 0;
    //             (<any>listObj).inputElement.value = "l";
    //             //open action validation
    //             keyboardEventArgs.keyCode = 113;
    //             (<any>listObj).keyDownStatus = true;
    //             (<any>listObj).onInput();
    //             (<any>listObj).keyUp(keyboardEventArgs);
    //             setTimeout(() => {
    //                 expect(count === 1).toBe(true);
    //                 expect((<any>listObj).liCollections.length === 2).toBe(true);
    //                 done();
    //             }, 400);
    //         }, 400);
    //     });
    // });

    describe('EJ2-11112 - MultiSelect shows issue while setting value in rerendering', () => {
        let mObj: any;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let dataSource = new DataManager({
            url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/',
            crossDomain: true
        });
        beforeAll(() => {
            document.body.appendChild(mEle);
            mObj = new MultiSelect({
                dataSource: dataSource,
                query: new Query().from('Customers').select(['ContactName', 'CustomerID']).take(1),
                fields: { text: 'ContactName', value: 'CustomerID' },
            });
            mObj.appendTo(mEle);
        });
        afterAll(() => {
            mObj.destroy();
            mEle.remove();
        });

        it('check whether the items are selected when value not present in datasource is set after rendering', () => {
            mObj.value = ["ALFKI", "WOLZA", "BERGS"];
            mObj.dataBind();
            expect(mObj.value.length).toBe(3);
        });
    });
    describe('EJ2-10791 - Multiselct selection behaves differently on keyboard and mouse event', () => {
        let mObj: any;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let datasource: { [key: string]: Object }[] = [
            { id: 'game1', sports: 'Badminton' },
            { id: 'game2', sports: 'Football' },
            { id: 'game3', sports: 'Tennis' }
        ];
        beforeAll(() => {
            document.body.appendChild(mEle);
            mObj = new MultiSelect({
                allowCustomValue: true,
                hideSelectedItem: false,
                closePopupOnSelect: false,
                dataSource: datasource,
                fields: { text: 'sports', value: 'id' },
            });
            mObj.appendTo(mEle);
        });
        afterAll(() => {
            mObj.destroy();
            mEle.remove();
        });

        it('check whether the Multiselect popup is shown or not', () => {
            mObj.focusIn();
            mObj.inputElement.value = "a";
            let event: any = new Event('keyup');
            event.keyCode = 65;
            event.key = "a";
            mObj.isValidKey = true;
            mObj.inputElement.dispatchEvent(event);
            let event2: any = new Event("mouseup");
            let popEle: any = mObj.popupObj.element.getElementsByTagName("li");
            popEle[0].dispatchEvent(event2);
            mObj.onMouseClick(event2);
            expect(popEle.length).toBe(4);
        });
    });

    describe('EJ2-11818 - Data is not repopulated when selecting and removing all items from Multiselect', () => {
        let mObj: any;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }, { id: 'list6', text: 'GO' }, { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list8', text: 'F#' }];
        beforeAll(() => {
            document.body.appendChild(mEle);
            mObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: 'text', value: 'text' },
                value: ['JAVA', 'C#', 'C++', '.NET', 'Oracle', 'GO', 'Haskell', 'Racket', 'F#'],
            });
            mObj.appendTo(mEle);
        });
        afterAll(() => {
            mObj.destroy();
            mEle.remove();
        });

        it('check whether the popup is shown or not', () => {
            mObj.focusIn();
            mObj.clearAll(new Event("mousedown"));
            let event: any = new Event('keydown');
            event.keyCode = 40;
            mObj.onKeyDown(event);
            expect(mObj.isPopupOpen()).toBe(true);
        });
    });

    describe('EJ2-9947 -  Enable persistence is not working properly in MultiSelect', () => {
        let mObj: any;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let sportsData: string[] = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Rugby', 'Snooker', 'Tennis'];
        beforeAll(() => {
            document.body.appendChild(mEle);
            mObj = new MultiSelect({
                dataSource: sportsData
            });
            mObj.appendTo(mEle);
        });
        afterAll(() => {
            mObj.destroy();
            mEle.remove();
        });

        it('check the multiselect value in default mode', () => {
            mObj.value = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Rugby', 'Snooker', 'Tennis'];
            mObj.dataBind();
            expect(mObj.chipCollectionWrapper.childElementCount === 10).toBe(true);
        });

        it('check the multiselect value in box mode', () => {
            mObj.value = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Rugby', 'Snooker', 'Tennis'];
            mObj.mode = "Box";
            mObj.dataBind();
            expect(mObj.chipCollectionWrapper.childElementCount === 10).toBe(true);
        });
    });
    describe('EJ2-28369 - Hide the “Select All” checkbox if only one item exists in filtered state', () => {
        let listObj: any;
        let checkObj : any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            checkObj = new CheckBoxSelection();
            checkObj.destroy();
        });
        it('Select all text for after filtering', () => {
            let data: { [key: string]: Object }[] = [
                { Name: 'Australia', Code: 'AU' },
                { Name: 'Bermuda', Code: 'BM' },
                { Name: 'United States', Code: 'US' }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                showSelectAll: true, mode: 'CheckBox',
                fields: { text: 'Name', value: 'Code' }, allowFiltering: true, debounceDelay: 0,
                selectAllText: 'Check All',
                filtering: function (e) {
                    let query: Query = new Query().select(['Name', 'text']);
                    query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
                    e.updateData(data, query);
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "a"
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect(listObj.checkBoxSelectionModule.checkAllParent.style.display == "none").toBe(true);
        });
        it('Select all text for initial rendering', () => {
            let data: { [key: string]: Object }[] = [
                { Name: 'Australia', Code: 'AU' }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                showSelectAll: true, mode: 'CheckBox',
                fields: { text: 'Name', value: 'Code' }, allowFiltering: true, debounceDelay: 0,
                selectAllText: 'Check All',
                filtering: function (e) {
                    let query: Query = new Query().select(['Name', 'text']);
                    query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
                    e.updateData(data, query);
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect(listObj.checkBoxSelectionModule.checkAllParent.style.display == "none").toBe(true);
        });
        it('Select all text for initial rendering', () => {
            let data: { [key: string]: Object }[] = [
                { Name: 'Australia', Code: 'AU' },
                { Name: 'Bermuda', Code: 'BM' },
                { Name: 'United States', Code: 'US' }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                showSelectAll: true, mode: 'CheckBox',
                fields: { text: 'Name', value: 'Code' }, allowFiltering: true, debounceDelay: 0,
                selectAllText: 'Check All',
                filtering: function (e) {
                    let query: Query = new Query().select(['Name', 'text']);
                    query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
                    e.updateData(data, query);
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect(listObj.checkBoxSelectionModule.checkAllParent.style.display == "block").toBe(true);
        });
        it('Select all text for initial rendering with grouping', () => {
            let data: { [key: string]: Object }[] = [
                { vegetable: 'Cabbage', category: 'Leafy and Salad' }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                showSelectAll: true, mode: 'CheckBox',
                fields: { groupBy: 'category', text: 'vegetable' },
                selectAllText: 'Check All',
                enableGroupCheckBox: true,
                filtering: function (e) {
                    let query = new Query();
                    query = (e.text != "") ? query.where("vegetable", "startswith", e.text, true) : query;
                    e.updateData(data, query);
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect(listObj.checkBoxSelectionModule.checkAllParent.style.display == "block").toBe(false);
        });
    });
    describe('EJ2-10278 - multiselect component is not updating the popup correctly', () => {
        let mObj: any;
        let originalTimeout: number;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let searchData = new DataManager({
            url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Customers',
            adaptor: new ODataV4Adaptor,
            crossDomain: true
        });
        beforeAll(() => {
            jasmine.clock().install();

            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.body.innerHTML = '';
            document.body.appendChild(mEle);
            mObj = new MultiSelect({
                dataSource: searchData,
                query: new Query().select(['ContactName', 'CustomerID']).take(7),
                fields: { text: 'ContactName', value: 'CustomerID' },
                allowFiltering: true,
                debounceDelay: 0,
                openOnClick: false,
                filtering: (e: FilteringEventArgs) => {
                    if (e.text == '') e.updateData(searchData);
                    else {
                        let query: Query = new Query().select(['ContactName', 'CustomerID']);
                        query = (e.text !== '') ? query.where('ContactName', 'startswith', e.text, true) : query;
                        e.updateData(searchData, query);
                    }
                }
            });
            mObj.appendTo(mEle);
        });
        afterAll(() => {
            jasmine.clock().uninstall();

            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (mEle) {
                mEle.remove();
            }
            if (mObj) {
                mObj.destroy();
            }
        });
        it('check the multiselect filtered value after entering a character in initial load', () => {
            mObj.focusIn()
            mObj.inputElement.value = "c";
            let event: any = new Event('keyup');
            event.keyCode = 67;
            event.key = "c";
            mObj.isValidKey = true;
            mObj.keyUp(event);
            mObj.actionComplete = function (e: any) {
                if (e.result.length == 5) {
                    let li: any = mObj.popupObj.element.getElementsByTagName("li");
                    let arr: any = [];
                    for (var i = 0; i < li.length; i++) {
                        if (li[i].innerText.indexOf("C") == 0 || li[i].innerText.indexOf("c") == 0) {
                            arr.push(true);
                        } else {
                            arr.push(false);
                        }
                    }
                    expect(arr).not.toContain(false);
                }
            }
            jasmine.clock().tick(5000);

        });
    });
    describe('EJ2-9909 - Input is rendered again on typing while resetting value from null with remote data and allowCustom:true', () => {
        let atcObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let dataSource = new DataManager({
            url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/',
            crossDomain: true
        });
        let query = new Query().select(['ProductID', 'ProductName']);
        beforeAll(() => {
            Browser.userAgent = navigator.userAgent;
            document.body.appendChild(element);
            atcObj = new MultiSelect({
                dataSource: dataSource,
                query: new Query().from('Customers').select('ContactName').take(7),
                fields: { text: 'ContactName' },
                placeholder: 'Select a name',
                popupWidth: '250px',
                popupHeight: '200px',
                allowCustomValue: true,
                allowFiltering: true,
                debounceDelay: 0
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
        });

        it('check the autocomplete value', () => {
            atcObj.value = ["list4", "list1"];
            atcObj.dataBind();
            expect(atcObj.value[0] === 'list4').toBe(true);
            atcObj.showPopup();
        });
        it('after the item selected focus the input wrapper', (done) => {
            atcObj.dataBound = function () {
                expect((<any>atcObj).chipCollectionWrapper.style.display).toBe('');
                let elem: HTMLElement = (<any>atcObj).chipCollectionWrapper.querySelector('span[data-value="list4"]');
                expect(elem).not.toEqual(null);
                expect((<any>atcObj).chipCollectionWrapper.childElementCount).toBe(2);
            };
            atcObj.blur = function () {
                expect((<any>atcObj).chipCollectionWrapper.style.display).toBe('none');
                atcObj.dataBound = null;
                done();
            };
            (<any>atcObj).focusIn();
            (<any>atcObj).onBlurHandler();
            atcObj.destroy();
        });
    });
    // describe('Remote data binding - allowCustomValue', () => {
    //     let listObj: MultiSelect;
    //     let popupObj: any;
    //     let originalTimeout: number;
    //     let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
    //     let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
    //     beforeAll(() => {
    //         document.body.innerHTML = '';
    //         document.body.appendChild(element);
    //         originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    //     });
    //     afterAll(() => {
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    //         if (element) {
    //             element.remove();
    //         }
    //     });

    //     it('EJ2-9767- CR_ISSUE allowCustomValue.- remote data with filter', (done) => {
    //         let status: boolean = false;
    //         listObj = new MultiSelect({
    //             hideSelectedItem: false,
    //             dataSource: remoteData,
    //             popupHeight: "auto",
    //             mode: 'Box',
    //             fields: { value: 'EmployeeID', text: 'FirstName' },
    //             filtering: function (e) {
    //                 var query = new Query().select(['FirstName', "EmployeeID"]);
    //                 query = (e.text !== '') ? query.where('FirstName', 'startswith', e.text, true) : query;
    //                 e.updateData(remoteData, query);
    //             },
    //             customValueSelection: function () {
    //                 status = true;
    //             },
    //             allowCustomValue: true,
    //             allowFiltering: true
    //         });
    //         listObj.appendTo(element);
    //         listObj.showPopup();
    //         (<any>listObj).inputFocus = true;
    //         (<any>listObj).inputElement.value = "RUBY";
    //         //open action validation
    //         keyboardEventArgs.altKey = false;
    //         keyboardEventArgs.keyCode = 70;
    //         setTimeout(() => {
    //             (<any>listObj).keyDownStatus = true;
    //             (<any>listObj).onInput();
    //             (<any>listObj).keyUp(keyboardEventArgs);
    //             setTimeout(() => {
    //                 expect((<any>listObj).liCollections.length).toBe(1);
    //                 expect((<any>listObj).value).toBe(null);
    //                 mouseEventArgs.target = (<any>listObj).liCollections[0];
    //                 mouseEventArgs.type = 'click';
    //                 (<any>listObj).onMouseClick(mouseEventArgs);
    //                 expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
    //                 listObj.destroy();
    //                 expect(status).toBe(true);
    //                 done();
    //             }, 2000);
    //         }, 800);
    //     });
    // });
    describe('Remote data binding - pre select value', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let result: any = [];
        beforeAll((done) => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let mAjax: MockAjaxReturn = mockAjax({
                data: {
                    d: new DataManager(data).executeLocal(new Query().take(3).select(['OrderID', 'CustomerID', 'EmployeeID']))
                }
            }, new Query().take(3));
            mAjax.promise.then((e: ResponseType) => {
                result = e.result;
                done();
            });
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            jasmine.Ajax.uninstall();
            if (element) {
                element.remove();
            }
        });
        xit('EJ2-13454- pre select value', () => {
            listObj = new MultiSelect({
                dataSource: result,
                fields: { text: 'CustomerID', value: 'CustomerID' },
                placeholder: 'Select customer',
                sortOrder: 'Ascending',
                value: ['VINET'],
            });
            listObj.appendTo(element);
            expect((<any>listObj).liCollections.length).toBe(3);
            expect(((<any>listObj).liCollections[2].getAttribute('data-Value') === 'VINET')).toBe(true);
        });
    });
    describe('multiselect value not restore in IE', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('EJ2-14040- multiselect value not restore in IE', () => {
            let temp: any = Browser.userAgent;
            Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
            let data: any = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' }];
            listObj = new MultiSelect({
                dataSource: data,
                fields: { text: 'text', value: 'text' },
                allowFiltering: true,
                debounceDelay: 0
            });
            listObj.appendTo(element);
            listObj.value = ['JAVA', 'C#', 'C++'];
            listObj.dataBind();
            listObj.showPopup();
            expect((listObj as any).popupObj.element.querySelector('.e-nodata')).toBeNull();
            Browser.userAgent = temp;
        });
    });
    describe('EJ2-14133 -Remote data binding', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let result: any = [];
        beforeAll((done) => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let mAjax: MockAjaxReturn = mockAjax({
                data: {
                    d: new DataManager(data).executeLocal(new Query().take(3).select(['OrderID', 'CustomerID', 'EmployeeID']))
                }
            }, new Query().take(3));
            mAjax.promise.then((e: ResponseType) => {
                result = e.result;
                done();
            });
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            jasmine.Ajax.uninstall();
            if (element) {
                element.remove();
            }
        });
        it('Popup not open when update a data via updatedata', (done) => {
            listObj = new MultiSelect({
                fields: { value: 'CustomerID', text: 'CustomerID' },
                placeholder: 'Handler',
                allowFiltering: true,
                debounceDelay: 0,
                openOnClick: true,
                floatLabelType: 'Auto',
                filtering: (args: any) => {
                    this.noRecordsTemplate = 'No Record Found';
                    args.preventDefaultAction = true;
                    let query: Query = new Query().where('CustomerID', 'startswith', args.text);
                    new DataManager(result).executeQuery(query).then((e: any) => {
                        setTimeout((): void => {
                        args.updateData(<{ [key: string]: Object; }[]>e.result)
                        }, 200);
                    });
                }
            });
            listObj.appendTo(element);
            (<any>listObj).inputElement.value = "A";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            setTimeout(function () {
                expect(document.body.contains((<any>listObj).popupObj.element)).toBe(true);
                mouseEventArgs.target = (<any>listObj).liCollections[0];
                mouseEventArgs.type = 'click';
                //(<any>listObj).onMouseClick(mouseEventArgs);
                (<any>listObj).inputElement.value = "A";
                keyboardEventArgs.keyCode = 70;
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).keyUp(keyboardEventArgs);
                expect(document.body.contains((<any>listObj).popupObj.element)).toBe(true);
                done();
            }, 2000);
        });
    });

    describe('EJ2-14361 - Pre-selected item disappears from the popup list', () => {
        let mObj: any;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }, { id: 'list6', text: 'GO' }, { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list8', text: 'F#' }];
        beforeAll(() => {
            document.body.appendChild(mEle);
            mObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: 'text', value: 'text' },
                value: ['JAVA'],
            });
            mObj.appendTo(mEle);
        });
        afterAll(() => {
            mObj.destroy();
            mEle.remove();
        });

        it('when removed using clear button in MultiSelect', () => {
            mObj.focusIn();
            mObj.clearAll(new Event("mousedown"));
            let event: any = new Event('keydown');
            event.keyCode = 40;
            mObj.onKeyDown(event);
            expect(mObj.isPopupOpen()).toBe(true);
            expect(mObj.ulElement.querySelectorAll('li[data-value="JAVA"]').length).toBe(1);
            expect(mObj.ulElement.querySelector('li[data-value="JAVA"]').length).not.toBe(null);
        });
    });

    describe(' EJ2-15135- clear All value.', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
            document.body.innerHTML = '';
        });

        it(' clear the value maintain in list item', () => {
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            dropDowns = new MultiSelect({
                dataSource: ['JavaScript', 'AS.NET'],
                value: ['JavaScript']

            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            dropDowns.clearAll(keyboardEventArgs);
            expect(dropDowns.list.querySelector('li').getAttribute('data-value') === 'JavaScript').toBe(true);
        });
    });
    describe('EJ2-15629:change event is not triggered when focused out', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        let ischanged: boolean = false;
        beforeAll(() => {
            document.body.appendChild(element);
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC', 'Java', 'C#'],
                showSelectAll: true,
                allowFiltering: true,
                debounceDelay: 0,
                mode: 'CheckBox',
                change: function (e: any) {
                    ischanged = true;
                    expect(e.name === 'change').toBe(true);
                    expect(e.value.length > 0).toBe(true);
                }
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' select item and click wrapper ', () => {
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).toBe(true);
            let list: Array<HTMLElement> = (<any>dropDowns).ulElement.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>dropDowns).onMouseClick(mouseEventArgs);
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            expect(ischanged).not.toBe(true);
            mouseEventArgs.target = document.body;
            dropDowns.checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).not.toBe(true);
            setTimeout(() => {
                expect(ischanged).toBe(true);
            }, 200);
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).toBe(true);
            list = (<any>dropDowns).ulElement.querySelectorAll('li');
            mouseEventArgs.target = list[2];
            mouseEventArgs.type = 'click';
            (<any>dropDowns).onMouseClick(mouseEventArgs);
            mouseEventArgs.target = document.body;
            dropDowns.checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).not.toBe(true);
        });
    });

    describe('EJ2-16375: Form reset', () => {
        let element: HTMLInputElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' }
        ];
        let listObj: MultiSelect;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('form', { id: 'form1' });
            element.innerHTML = `<input type="text" id="multiSelect1">
            <input type="reset" id="resetForm"/>`;
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: data,
                fields: { text: "text", value: "id" },
                value: ['list2'],
                hideSelectedItem: true
            });
            listObj.appendTo('#multiSelect1');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it(' reset the child form', (done) => {
            document.getElementById('resetForm').click();
            setTimeout(() => {
                expect(listObj.value[0] === 'list2').toBe(true);
                done();
            })
        });
    });

    describe('EJ2-16375: Form inside form reset', () => {
        let element: HTMLInputElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' }
        ];
        let listObj: MultiSelect;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('form', { id: 'form1' });
            element.innerHTML = `<input type="text" id="MultiSelect">
            <div id="dynamic"></div>`;
            document.body.appendChild(element);
            let dynamicEle: HTMLElement = document.getElementById('dynamic');
            let form2: Element = createElement('form');
            form2.id = 'form2';
            form2.innerHTML = '<input id="tempInput" type="text"/> <input type="reset" id="resetForm"/>';
            dynamicEle.appendChild(form2);
            listObj = new MultiSelect({
                dataSource: data,
                fields: { text: "text", value: "id" },
                value: ['list1']
            });
            listObj.appendTo('#MultiSelect');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it(' reset the form', (done) => {
            let input: HTMLInputElement = document.getElementById("tempInput") as HTMLInputElement;
            input.value = "test";
            document.getElementById('resetForm').click();
            setTimeout(() => {
                expect(listObj.value[0] === 'list1').toBe(true);
                expect(input.value === '').toBe(true);
                done();
            })
        });
    });
    describe('EJ2-16410: Item disappears from avaible values if removed using backspace', () => {
        let element: HTMLInputElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' }
        ];
        let listObj: MultiSelect;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect1' });
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: data,
                fields: { text: "text", value: "id" },
                value: ['list1'],
                hideSelectedItem: true
            });
            listObj.appendTo('#multiSelect1');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });

        it(' show the preselected value in popuplist while press the backspace', (done) => {
            (<any>listObj).focusIn();
            listObj.showPopup();
            setTimeout(() => {
                keyboardEventArgs.keyCode = 8;
                let removeEle: HTMLElement = (<any>listObj).list.querySelector('li[data-value="list1"]');
                expect(removeEle.classList.contains('e-hide-listitem')).toBe(true);
                (<any>listObj).onKeyDown(keyboardEventArgs);
                expect(removeEle.classList.contains('e-hide-listitem')).toBe(false);
                done();
            }, 400);
        });
    });
    describe('focus event', () => {
        let listObj: any;
        let popupObj: any;
        let data: string[] = ['JAVA', 'C#']
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: data,
                focus: function (e) {
                    expect((e as any).isInteracted).toBe(true);
                }
            });
            listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('focus the multiselect', () => {
            expect(listObj.componentWrapper).not.toBe(null);
            mouseEventArgs.target = listObj.componentWrapper;
            listObj.wrapperClick(mouseEventArgs);
        });
    });

    describe('EJ2-18072: multiselect popup width set to 0, when set value initial loading.', () => {
        let element: HTMLInputElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' }
        ];
        let listObj: MultiSelect;
        let divContainer: HTMLElement;
        beforeAll(() => {
            divContainer = createElement('dvi', { id: 'container-ele', styles: "display:none" });
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect1' });
            divContainer.appendChild(element);
            document.body.appendChild(divContainer);
            listObj = new MultiSelect({
                dataSource: data,
                fields: { text: "text", value: "id" },
                value: ['list1'],
                hideSelectedItem: true
            });
            listObj.appendTo('#multiSelect1');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });

        it(' popup width and component width same', (done) => {
            divContainer.style.display = 'block';
            (<any>listObj).focusIn();
            listObj.showPopup();
            setTimeout(() => {
                expect((listObj as any).overAllWrapper.offsetWidth === (listObj as any).popupObj.element.offsetWidth).toBe(true);
                done();
            }, 400);
        });
    });

    describe('EJ2-32393 - Filtering not working with multiselect ', () => {
        let element: HTMLInputElement;
        let selectElement: HTMLDivElement; 
        let ddl: MultiSelect;
        let isSeleted: boolean = true;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiselect1' });
            selectElement = <HTMLDivElement>createElement('div', { id: 'multiselect2' });
            selectElement.innerHTML = `<select id="list"> 
                <option value="0">American Football</option>
                <option value="1 ">Badminton</option>
                <option value="2">Basketball</option>
                <option value="3">Cricket</option>
                <option value="4">Football</option>
                <option value="5">Golf</option>
                <option value="6">Hockey</option>
                <option value="7">Rugby</option>
                <option value="8">Snooker</option>
                <option value="9">Tennis</option>
            </select>`;
            document.body.appendChild(selectElement);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        }); 
        it('when render the component using select element', () => {
            ddl = new MultiSelect({ 
                allowFiltering: true,
                debounceDelay: 0,
                open: function(e) {
                    let len: number = (<any>ddl).ulElement.querySelectorAll('li').length;
                    expect(len !==0 ).toBe(true);
                }
            });
            ddl.appendTo(selectElement.querySelector('#list') as HTMLElement);
            ddl.showPopup();
            (<any>ddl).inputFocus = true;
            (<any>ddl).inputElement.value = "a";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 65;
            (<any>ddl).keyDownStatus = true;
            (<any>ddl).onInput();
            (<any>ddl).keyUp(keyboardEventArgs);
            expect((<any>ddl).liCollections.length).toBe(1);
        });
    });

    describe(' EJ2-18283 - selectAll eventArgs', () => {
        let listObj: any;
        let popupObj: any;
        let data: string[] = ['JAVA', 'C#']
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let selectEle: HTMLElement;
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: data,
                selectedAll: (e: any) => {
                    selectEle = e.event.target;
                },
                mode: 'CheckBox', fields: { text: "text", value: "text" }, value: ["JAVA"], showSelectAll: true
            });
            listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });

        it(' click on selectAll element', (done) => {
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.classList.contains('e-selectall-parent')).toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.innerText === "Select All").toBe(true);
                expect(listObj.checkBoxSelectionModule.checkAllParent.lastElementChild.classList.contains('e-all-text')).toBe(true);
                listObj.dispatchEvent(listObj.checkBoxSelectionModule.checkAllParent, "mousedown");
                expect(!isNullOrUndefined(selectEle)).toBe(true);
                done();
            }, 400);
        });
    });
    describe('EJ2-31766:Performance issue arise while clearing larger number of selected items using clear button', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        let ischanged: boolean = false;
        let data: any = [];
        for(let i: number = 0; i< 100; i++) {
            data.push({text: 'Java Script'+ i, value: 1 });
        }
        beforeAll(() => {
            document.body.appendChild(element);
            dropDowns = new MultiSelect({
                dataSource: data,
                showSelectAll: true,
                allowFiltering: true,
                debounceDelay: 0,
                mode: 'CheckBox',
                change: function (e: any) {
                    ischanged = true;
                    expect(e.name === 'change').toBe(true);
                }
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' select item and clear the value using icon ', () => {
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).toBe(true);
            (<any>dropDowns).checkBoxSelectionModule.clickHandler({
                preventDefault: () => { }, currentTarget: (<any>dropDowns).checkBoxSelectionModule.checkAllParent
            });
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            expect(ischanged).not.toBe(true);
            mouseEventArgs.target = document.body;
            dropDowns.checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).not.toBe(true);
            expect(ischanged).toBe(true);
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            mouseEventArgs.target = dropDowns.componentWrapper.querySelector('.e-chips-close.e-close-hooker');
            mouseEventArgs.type = 'mouseup';
            dropDowns.clearAll(mouseEventArgs);
            expect(dropDowns.value && dropDowns.value.length === 0).toBe(true);
        });
    });
    describe('EJ2-18758 - UnSelectAll issue', () => {
        let listObj: MultiSelect;
        let data: string[] = ['JAVA', 'C#']
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'CheckBox',
                fields: { text: "text", value: "text" },
                showSelectAll: true
            });
            listObj.appendTo(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });

        it(' click on unselectAll element', (done) => {
            listObj.selectAll(true);
            listObj.open = (): void => {
                (<any>listObj).dispatchEvent((<any>listObj).checkBoxSelectionModule.checkAllParent, "mousedown");
            };
            listObj.selectedAll = (args: ISelectAllEventArgs): void => {
                expect(isNullOrUndefined(args.items[0].querySelector('.e-check'))).toBe(true);
                done();
            };
            listObj.showPopup();
        });
    });
    describe('EJ2-22853 - insert special character', () => {
        let listObj: MultiSelect;
        let data: string[] = ['JAVA', 'C#']
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: data,
                fields: { text: "text", value: "text" }
            });
            listObj.appendTo(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });

        it(' check the Alt key with popup interaction', () => {
            keyboardEventArgs.altKey = true;
            keyboardEventArgs.keyCode = 40;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).not.toBe(null);
            //close action validation
            keyboardEventArgs.keyCode = 38;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            keyboardEventArgs.altKey = false;
        });
    });
    describe('EJ2-24251 - placeholder', () => {
        let listObj: MultiSelect;
        let data: string[] = ['JAVA', 'C#']
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        beforeAll(() => { 
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: data,
                placeholder: 'select the value',
                fields: { text: "text", value: "text" }
            });
            listObj.appendTo(element);
        });
        afterAll(() => { 
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });

        it(' select and unselect all placeholder update', () => { 
            expect((listObj as any).inputElement.placeholder === listObj.placeholder).toBe(true);
            listObj.selectAll(true);
            expect((listObj as any).inputElement.placeholder === '').toBe(true);
            listObj.selectAll(false);
            expect((listObj as any).inputElement.placeholder === listObj.placeholder).toBe(true);
        });
    });
    describe('EJ2-25259- browser freeze when click the clear all.', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
            document.body.innerHTML = '';
        });

        it(' clear the value maintain in list item', () => {
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            dropDowns = new MultiSelect({
                dataSource: ['JavaScript', 'AS.NET'],
                value: ['JavaScript'],
                removing: function(args: any) {
                    args.cancel = true;
                }

            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            dropDowns.clearAll(keyboardEventArgs);
            expect(dropDowns.componentWrapper.querySelector('.e-delim-view.e-delim-values').innerText === 'JavaScript').toBe(true);
        });
    });
    describe('EJ2-25259- clear all.', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
            document.body.innerHTML = '';
        });

        it(' clear the value maintain in list item', () => {
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            dropDowns = new MultiSelect({
                dataSource: ['JavaScript', 'AS.NET'],
                value: ['JavaScript'],
                removing: function(args: any) {
                    if (args.itemData === 'JavaScript'){
                        args.cancel = true;
                    }
                }

            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            dropDowns.clearAll(keyboardEventArgs);
            expect(dropDowns.componentWrapper.querySelector('.e-delim-view.e-delim-values').innerText === 'JavaScript').toBe(true);
        });
    });
    describe('EJ2-25134 - popup open downward', () => {
        let listObj: any;
        let data: string[] = ['JAVA', 'C#', 'C++', '.NET', 'Oracle'];
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let divEle = createElement('div', {id:'parent', styles: 'height: 1000px; overflow: auto;'});
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        divEle.appendChild(element);
        beforeAll(() => { 
            document.body.appendChild(divEle);
            listObj = new MultiSelect({
                dataSource: data,
                placeholder: 'select the value'
            });
            listObj.appendTo(element); 
            listObj.componentWrapper.style.paddingTop = '700px';
        });
        afterAll(() => { 
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });

        it(' when select the items', () => {  
            window.scrollTo(0, document.body.scrollHeight);
            mouseEventArgs.target = listObj.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect(listObj.isPopupOpen()).toBe(true);
            let list: Array<HTMLElement> = (<any>listObj).ulElement.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            window.scrollTo(0, document.body.scrollHeight);
            mouseEventArgs.target = document.body;
            listObj.onBlurHandler(mouseEventArgs);
            mouseEventArgs.target = listObj.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect(listObj.isPopupOpen()).toBe(true);
        });
    });
    describe('EJ2-24839- custom value with pre select not working', () => {
        let listObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        beforeAll(() => { 
            document.body.appendChild(element);
            listObj = new MultiSelect({ 
                value: ['JAVA'],
                allowCustomValue: true,
                placeholder: 'select the value'
            });
            listObj.appendTo(element); 
            listObj.componentWrapper.style.paddingTop = '700px';
        });
        afterAll(() => { 
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });

        it('when set empty data source.', () => {  
            expect(listObj.componentWrapper.querySelector('.e-delim-view.e-delim-values').innerText === 'JAVA').toBe(true);
            expect(listObj.ulElement.querySelectorAll('li').length === 1).toBe(true);
        });
    });
    describe('EJ2-25818 -Grouping template text not updated ', () => {
        let listObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let data: any = [
            { text: '1st item', value: 1, groups: true, selectable: true },
            { text: '2nd item', value: 2, groups: false, selectable: true },
            { text: '3rd item', value: 3, groups: false, selectable: true },
            { text: '4th item', value: 4, groups: true, selectable: true },
            { text: '5th item', value: 5, groups: true, selectable: false }
          ]
        beforeAll(() => { 
            document.body.appendChild(element);
            listObj = new MultiSelect({ 
                dataSource: data,
                fields: { groupBy: 'groups', text: 'text', value: 'value' },
                allowFiltering: true,
                debounceDelay: 0,
                groupTemplate: "${if(groups==='false')}<span>Foo</span> ${else}<span>Bar</span>${/if}"
            });
            listObj.appendTo(element); 
            listObj.componentWrapper.style.paddingTop = '700px';
        });
        afterAll(() => { 
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });

        it('while enable the allow filtering', (done) => {  
            listObj.showPopup();
            setTimeout(()=>{
            var groupEle = listObj.list.querySelectorAll('.e-list-group-item');
            //expect(groupEle[0].innerText === 'Bar').toBe(true);
            //expect(groupEle[1].innerText === 'Foo').toBe(true);  
            done();
            }, 200)
        });
    });
    describe("EJ2-29373- Selected values are maintaining after deselecting it", () => {
        let multiSelect: any;
        let element: HTMLElement = createElement('input', { id: 'multiselect' });
        let data: { [key: string]: Object }[] = [
            { Name: 'Australia', Code: 'AU' },
            { Name: 'Bermuda', Code: 'BM' },
            { Name: 'United States', Code: 'US' }
        ];
        beforeAll(() => {
            document.body.appendChild(element);
            multiSelect = new MultiSelect({
                dataSource: data,
                fields: { text: 'Name', value: 'Code' },
                value: ['AU'],
                mode: 'CheckBox',
                allowFiltering: false,
                debounceDelay: 0,
            });
            multiSelect.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it("Selection Testing", () => {
            multiSelect.showPopup();
            let target: HTMLElement = multiSelect.list.querySelector('.e-list-item');
            mouseEventArgs.target = target;
            mouseEventArgs.type = 'Click';
            multiSelect.onMouseClick(mouseEventArgs);
            mouseEventArgs.target = multiSelect.overAllWrapper;
            multiSelect.onMouseClick(mouseEventArgs);
            setTimeout(() => {
                expect(multiSelect.isPopupOpen()).toBe(false);
                if (!multiSelect.isPopupOpen()) {
                    multiSelect.showPopup();
                    expect(multiSelect.list.querySelectorAll('.e-active').length).toBe(0);
                }
            }, 200);
        })
    })

    describe('BLAZ-888:change event is not triggered when clear the item', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        let ischanged: boolean = false;
        beforeAll(() => {
            document.body.appendChild(element);
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC', 'Java', 'C#'],
                showSelectAll: true,
                value: ['Java'],
                allowFiltering: true,
                debounceDelay: 0,
                mode: 'CheckBox',
                change: function (e: any) {
                    ischanged = true;
                    expect(e.name === 'change').toBe(true);
                }
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' select item and clear the value using icon ', () => {
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).toBe(true);
            let list: Array<HTMLElement> = (<any>dropDowns).ulElement.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>dropDowns).onMouseClick(mouseEventArgs);
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            expect(ischanged).not.toBe(true);
            mouseEventArgs.target = document.body;
            dropDowns.checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).not.toBe(true);
            expect(ischanged).toBe(true);
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            mouseEventArgs.target = dropDowns.componentWrapper.querySelector('.e-chips-close.e-close-hooker');
            mouseEventArgs.type = 'mouseup';
            dropDowns.clearAll(mouseEventArgs);
            expect(ischanged).toBe(true);
        });
    });

    describe('EJ2-34885 - add item ', () => {
        let listObj: MultiSelect;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('with empty datasource', () => {
            listObj = new MultiSelect({
                fields: { text: 'Game', value: 'Game' },
            });
            listObj.appendTo(element);
            listObj.showPopup();
            listObj.hidePopup();
            listObj.addItem({ Id: 'Game1', Game: 'American Football' });
            listObj.showPopup();
            expect((<any>listObj).liCollections.length).toBe(1);
            listObj.hidePopup();
        });
    });

    describe('BLAZ-888:change event is not triggered when clear the item', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        let ischanged: boolean = false;
        beforeAll(() => {
            document.body.appendChild(element);
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC', 'Java', 'C#'],
                mode: 'Box',
                value: ['Java'],
                change: function (e: any) {
                    ischanged = true;
                    expect(e.name === 'change').toBe(true);
                }
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' select item and click wrapper ', () => {
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).toBe(true);
            let list: Array<HTMLElement> = (<any>dropDowns).ulElement.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>dropDowns).onMouseClick(mouseEventArgs);
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            expect(ischanged).not.toBe(true);
            mouseEventArgs.target = document.body;
            dropDowns.onBlurHandler(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).not.toBe(true);
            expect(ischanged).toBe(true);
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            mouseEventArgs.target = dropDowns.componentWrapper.querySelector('.e-chips-close.e-close-hooker');
            mouseEventArgs.type = 'mouseup';
            dropDowns.clearAll(mouseEventArgs);
            mouseEventArgs.target = document.body;
            dropDowns.onBlurHandler(mouseEventArgs);
            expect(ischanged).toBe(true);
        });
    });

    describe('EJ2-35417 - Filtering not working after select item ', () => {
        let listObj: MultiSelect;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let sportsData: any[] =  [
            { Id: 'Game1', Game: 'American Football' },
            { Id: 'Game2', Game: 'Badminton' },
            { Id: 'Game3', Game: 'Basketball' },
            { Id: 'Game4', Game: 'Cricket' },
            { Id: 'Game5', Game: 'Football' },
            { Id: 'Game6', Game: 'Golf' },
            { Id: 'Game7', Game: 'Hockey' },
            { Id: 'Game8', Game: 'Rugby' },
            { Id: 'Game9', Game: 'Snooker' },
            { Id: 'Game10', Game: 'Tennis' }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('filtering and select item', () => {
            listObj = new MultiSelect({
                dataSource: sportsData,
                fields: { text: 'Game', value: 'Game' },
                allowFiltering: true,
                debounceDelay: 0,
            });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputFocus = true;
            (<any>listObj).inputElement.value = "a";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 65;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(1);
            expect((<any>listObj).value).toBe(null);
            mouseEventArgs.target = (<any>listObj).liCollections[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();

            (<any>listObj).inputFocus = true;
            (<any>listObj).inputElement.value = "b";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 65;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(2);
        });
    });
    describe('EJ2-31766 - Performance issue arises while clearing ', () => {
        let listObj: MultiSelect;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });

        let sportsData: any[] =  [
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            for (let i: number =0; i < 100; i++) {
                sportsData.push({Game: "Cricket" + i, Id: "Game" + i });
            }
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('larger number of selected items using a clear button', () => {
            listObj = new MultiSelect({
                dataSource: sportsData,
                fields: { text: 'Game', value: 'Game' },
                mode: 'CheckBox', 
                showSelectAll: true,
                showDropDownIcon: true
            });
            listObj.appendTo(element);
            listObj.showPopup();
            listObj.hidePopup();
            listObj.selectAll(true);
            mouseEventArgs.target = (listObj as any).componentWrapper.querySelector('.e-chips-close.e-close-hooker');
            (<any>listObj).clearAll(mouseEventArgs);
            expect((<any>listObj).value.length).toBe(0);
        });
    });
    describe('EJ2-35010 - Maximum call stack size exceeded issue occurs when setting custom value with no datasource ', () => {
        let listObj: MultiSelect;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('with empty datasource', (done) => {
            listObj = new MultiSelect({
                allowCustomValue: true,
            });
            listObj.appendTo(element);
            listObj.value = ['fkfnmfmnsdfmn'];
            listObj.dataBind();
            listObj.showPopup();
            setTimeout(() => {
                listObj.hidePopup();
                listObj.clear();
                listObj.showPopup();
                setTimeout(() => {
                    expect((<any>listObj).liCollections.length).toBe(1);
                    listObj.hidePopup();
                    done();
                },110);
            },110);
        });
    });

    // describe('EJ2-29649 - filtering with allowCustomValue ', () => {
    //     let listObj: MultiSelect;
    //     let originalTimeout: number;
    //     let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
    //     let sportsData: any[] =  [
    //         { Id: 'Game1', Game: 'American Football' },
    //         { Id: 'Game2', Game: 'Badminton' },
    //         { Id: 'Game3', Game: 'Basketball' },
    //         { Id: 'Game4', Game: 'Cricket' },
    //         { Id: 'Game5', Game: 'Football' },
    //         { Id: 'Game6', Game: 'Golf' },
    //         { Id: 'Game7', Game: 'Hockey' },
    //         { Id: 'Game8', Game: 'Rugby' },
    //         { Id: 'Game9', Game: 'Snooker' },
    //         { Id: 'Game10', Game: 'Tennis' }
    //     ];
    //     beforeAll(() => {
    //         document.body.innerHTML = '';
    //         document.body.appendChild(element);
    //         originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    //     });
    //     afterAll(() => {
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    //         if (element) {
    //             element.remove();
    //         }
    //     });
    //     it('EJ2-9767- CR_ISSUE allowCustomValue.- remote data with filter', (done) => {
    //         listObj = new MultiSelect({
    //             dataSource: sportsData,
    //             popupHeight: "auto",
    //             fields: { text: 'Game', value: 'Game' },
    //             filtering: function (e: FilteringEventArgs) {
    //                 var query = new Query();
    //                 query = (e.text !== '') ? query.where('Game', 'startswith', e.text, true) : query;
    //                 e.updateData(sportsData, query);
    //             },
    //             allowCustomValue: true,
    //             allowFiltering: true
    //         });
    //         listObj.appendTo(element);
    //         listObj.showPopup();
    //         (<any>listObj).inputFocus = true;
    //         (<any>listObj).inputElement.value = "a";
    //         keyboardEventArgs.altKey = false;
    //         keyboardEventArgs.keyCode = 65;
    //         setTimeout(() => {
    //             (<any>listObj).keyDownStatus = true;
    //             (<any>listObj).onInput();
    //             (<any>listObj).keyUp(keyboardEventArgs);
    //             expect((<any>listObj).liCollections.length).toBe(2);
    //             expect((<any>listObj).value).toBe(null);
    //             mouseEventArgs.target = (<any>listObj).liCollections[0];
    //             mouseEventArgs.type = 'click';
    //             (<any>listObj).onMouseClick(mouseEventArgs);
    //             expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
    //             done();
    //         }, 800);
    //     });
    // });
    describe('EJ2-36388', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        let ischanged: boolean = false;
        let originalTimeout: number;
        beforeAll(() => {
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC', 'Java', 'C#'],
                allowFiltering: true,
                debounceDelay: 0,
                mode: 'CheckBox',
                change: function (e: any) {
                    ischanged = true;
                    expect(e.name === 'change').toBe(true);
                    expect(e.value.length > 0).toBe(true);
                }
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('Change event is not triggered', () => {
            let temp: any = Browser.userAgent;
            Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
            mouseEventArgs.target = dropDowns.componentWrapper;
            mouseEventArgs.type = 'mousedown';
            (<any>dropDowns).wrapperClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).toBe(true);
            let list: Array<HTMLElement> = (<any>dropDowns).ulElement.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>dropDowns).onMouseClick(mouseEventArgs);
            mouseEventArgs.target = document.body;
            dropDowns.checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
            expect(dropDowns.isPopupOpen()).not.toBe(true);
            expect(ischanged).toBe(true);
            Browser.userAgent = temp;
        });
    });
    describe('EJ2-38397', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let sportsData: any[] =  [
            { Id: 'Game1', Game: 'American Football' },
            { Id: 'Game2', Game: 'Badminton' },
            { Id: 'Game3', Game: 'Basketball' },
            { Id: 'Game4', Game: 'Cricket' },
            { Id: 'Game5', Game: 'Football' },
            { Id: 'Game6', Game: 'Golf' },
            { Id: 'Game7', Game: 'Hockey' },
            { Id: 'Game8', Game: 'Rugby' },
            { Id: 'Game9', Game: 'Snooker' },
            { Id: 'Game10', Game: 'Tennis' }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('getDataByValue returns null in Box mode testcase', () => {
            listObj = new MultiSelect({
                dataSource: sportsData,
                popupHeight: "auto",
                fields: { text: 'Game', value: 'Id' },
                mode: 'Box',
                allowFiltering: true,
                debounceDelay: 0,
                change: function(e){
                    expect(this.getDataByValue(e.value[0]) !== null).toBe(true);
                },
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            // Enter Key to select value
            keyboardEventArgs.keyCode = 13;
            keyboardEventArgs.altKey = false;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            if (!(<any>listObj).isPopupOpen()) {
                listObj.showPopup(); 
            }
            (<any>listObj).inputFocus = true;
            // Filter the popup with b
            (<any>listObj).inputElement.value = "b";
            keyboardEventArgs.keyCode = 66;
            keyboardEventArgs.altKey = false;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            // Tab key to focus out (hides popup)
            keyboardEventArgs.keyCode = 9;
            keyboardEventArgs.altKey = false;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).onKeyDown(keyboardEventArgs);
            // COntrol Focus out
            (<any>listObj).inputElement.blur();
            (<any>listObj).onBlurHandler();
        });
    });
    describe('EJ2-39000', () => {
        let mulObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let sportsData: { [key: string]: Object }[] =  [
            { Id: 'Game1', Game: 'American Football' },
            { Id: 'Game2', Game: 'Badminton' },
            { Id: 'Game3', Game: 'Basketball' },
            { Id: 'Game4', Game: 'Cricket' },
            { Id: 'Game5', Game: 'Football' },
            { Id: 'Game6', Game: 'Golf' },
            { Id: 'Game7', Game: 'Hockey' },
            { Id: 'Game8', Game: 'Rugby' },
            { Id: 'Game9', Game: 'Snooker' },
            { Id: 'Game10', Game: 'Tennis' }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('clear icon not working when filtering testcase', () => {
            mulObj = new MultiSelect({
                dataSource: sportsData,
                fields: { text: 'Game', value: 'Id' },
                mode: 'CheckBox',
                allowFiltering: true,
                debounceDelay: 0,
            });
            mulObj.appendTo(element);
            mulObj.showPopup();
            expect((<any>mulObj).isPopupOpen()).toBe(true);
            expect((<any>mulObj).list.querySelectorAll('li').length === 10).toBe(true);
            // Select value from popup
            mouseEventArgs.target =  (<any>mulObj).list.querySelectorAll('li')[3];
            mouseEventArgs.type = 'click';
            (<any>mulObj).onMouseClick(mouseEventArgs);
            expect((<any>mulObj).value.length === 1).toBe(true);
            // Filter popup by pressing key A
            (<any>mulObj).checkBoxSelectionModule.filterInput.value = "a";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 65;
            (<any>mulObj).keyDownStatus = true;
            (<any>mulObj).onInput();
            (<any>mulObj).keyUp(keyboardEventArgs);
            expect((<any>mulObj).list.querySelectorAll('li').length === 1).toBe(true);
            // Clear the value using clear button
            mouseEventArgs.target = (<any>mulObj).overAllClear;
            (<any>mulObj).clearAll(mouseEventArgs);
            expect((<any>mulObj).value.length === 0).toBe(true);
            expect((<any>mulObj).list.querySelectorAll('li').length === 10).toBe(true);
        });
    });
    describe('EJ2-39447', () => {
        let isPopupFiltered: boolean = false;
        let mulObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let sportsData: { [key: string]: Object }[] =  [
            { Id: 'Game1', Game: 'American Football' },
            { Id: 'Game2', Game: 'Badminton' },
            { Id: 'Game3', Game: 'Basketball' },
            { Id: 'Game4', Game: 'Cricket' },
            { Id: 'Game5', Game: 'Football' },
            { Id: 'Game6', Game: 'Golf' },
            { Id: 'Game7', Game: 'Hockey' },
            { Id: 'Game8', Game: 'Rugby' },
            { Id: 'Game9', Game: 'Snooker' },
            { Id: 'Game10', Game: 'Tennis' }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('Filtering popup using paste testcase', () => {
            mulObj = new MultiSelect({
                dataSource: sportsData,
                fields: { text: 'Game', value: 'Id' },
                mode: 'CheckBox',
                allowFiltering: true,
                debounceDelay: 0,
                filtering: function (e) {
                    isPopupFiltered = true;
                }
            });
            mulObj.appendTo(element);
            mulObj.showPopup();
            expect((<any>mulObj).isPopupOpen()).toBe(true);
            expect((<any>mulObj).list.querySelectorAll('li').length === 10).toBe(true);
            // Filter popup by pasting value
            (<any>mulObj).checkBoxSelectionModule.filterInput.value = "Cricket";
            keyboardEventArgs.altKey = false;
            (<any>mulObj).keyDownStatus = true;
            (<any>mulObj).pasteHandler(keyboardEventArgs);
            setTimeout (function () {
                expect((<any>mulObj).list.querySelectorAll('li').length === 1).toBe(true);
                // Checking popup is filtered when paste
                expect(isPopupFiltered).toBe(true)
            },)
        });
    });
    describe('EJ2-39642', () => {
        let mulObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let sportsData: { [key: string]: Object }[] =  [
            { Name: 'Australia', Code: 'AU' },
            { Name: 'Bermuda', Code: 'BM' },
            { Name: 'Canada', Code: 'CA' },
            { Name: 'Cameroon', Code: 'CM' },
            { Name: 'Denmark', Code: 'DK' },
            { Name: 'France', Code: 'FR' },
            { Name: 'Finland', Code: 'FI' },
            { Name: 'Germany', Code: 'DE' },
            { Name: 'Greenland', Code: 'GL' },
            { Name: 'Hong Kong', Code: 'HK' },
            { Name: 'India', Code: 'IN' },
            { Name: 'Italy', Code: 'IT' },
            { Name: 'Japan', Code: 'JP' },
            { Name: 'Mexico', Code: 'MX' },
            { Name: 'Norway', Code: 'NO' },
            { Name: 'Poland', Code: 'PL' },
            { Name: 'Switzerland', Code: 'CH' },
            { Name: 'United Kingdom', Code: 'GB' },
            { Name: 'United States', Code: 'US' }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('clear icon not working when filtering testcase', () => {
            mulObj = new MultiSelect({
                dataSource: sportsData,
                fields: { text: 'Game', value: 'Id' },
                mode: 'CheckBox',
            });
            mulObj.appendTo(element);
            mulObj.showPopup();
            expect((<any>mulObj).isPopupOpen()).toBe(true);
            expect((<any>mulObj).list.querySelectorAll('li').length === 19).toBe(true);
            mulObj.hidePopup();
            // Changing query
            (<any>mulObj).query = new Query().where('Code', 'equal', 'IN');
            (<any>mulObj).dataBind();
            // Open popup to check query updated list is present
            mulObj.showPopup();
            expect((<any>mulObj).isPopupOpen()).toBe(true);
            expect((<any>mulObj).list.querySelectorAll('li').length === 1).toBe(true);
        });
    });
    describe('EJ2-39448', () => {
        let mulInstance: MultiSelect;
        let multiselectInstance: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let sportsData: { [key: string]: Object }[] =  [
            { Name: 'Australia', Code: 'AU' },
            { Name: 'Bermuda', Code: 'BM' },
            { Name: 'Canada', Code: 'CA' },
            { Name: 'Cameroon', Code: 'CM' },
            { Name: 'Denmark', Code: 'DK' },
            { Name: 'France', Code: 'FR' },
            { Name: 'Finland', Code: 'FI' },
            { Name: 'Germany', Code: 'DE' },
            { Name: 'Greenland', Code: 'GL' },
            { Name: 'Hong Kong', Code: 'HK' },
            { Name: 'India', Code: 'IN' },
            { Name: 'Italy', Code: 'IT' },
            { Name: 'Japan', Code: 'JP' },
            { Name: 'Mexico', Code: 'MX' },
            { Name: 'Norway', Code: 'NO' },
            { Name: 'Poland', Code: 'PL' },
            { Name: 'Switzerland', Code: 'CH' },
            { Name: 'United Kingdom', Code: 'GB' },
            { Name: 'United States', Code: 'US' }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('Outline class for filter input', () => {
            mulInstance = new MultiSelect({
                dataSource: sportsData,
                fields: { text: 'Game', value: 'Id' },
                mode: 'CheckBox',
                cssClass: 'e-outline',
                headerTemplate: 'header1'
            });
            mulInstance.appendTo(element);
            mulInstance.showPopup();
            expect((<any>mulInstance).isPopupOpen()).toBe(true);
            (<any>mulInstance).showSelectAll = true;
            (<any>mulInstance).dataBind();
            expect((<any>mulInstance).checkBoxSelectionModule.filterInputObj.container.classList.contains('e-outline')).toBe(true);
        });
        it('Outline class for filter input', () => {
            multiselectInstance = new MultiSelect({
                dataSource: sportsData,
                fields: { text: 'Game', value: 'Id' },
                mode: 'CheckBox',
                cssClass: 'e-filled'
            });
            multiselectInstance.appendTo(element);
            multiselectInstance.showPopup();
            expect((<any>multiselectInstance).isPopupOpen()).toBe(true);
            expect((<any>multiselectInstance).checkBoxSelectionModule.filterInputObj.container.classList.contains('e-filled')).toBe(true);
        });
    });
    describe('EJ2-39941', () => {
        let listObj: any;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let datasource: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET' },
            { id: 'list5', text: 'Oracle' },
            { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' },
            { id: 'list8', text: 'Racket' },
            { id: 'list9', text: 'F#' }
        ];
        beforeAll(() => {
            document.body.appendChild(mEle);
            listObj = new MultiSelect({
                dataSource: datasource,
                mode: 'Default',
                allowCustomValue: true,
                fields: { value: 'id', text: 'text' }
            });
            listObj.appendTo(mEle);
        });
        afterAll(() => {
            listObj.destroy();
            mEle.remove();
        });
        it('popup shows custom entered value instead of data source values.', () => {
            listObj = new MultiSelect({
                dataSource: datasource,
                mode: 'Default',
                allowCustomValue: true,
                fields: { value: 'id', text: 'text' }
            });
            listObj.appendTo(mEle);
            keyboardEventArgs.keyCode = 9;
            keyboardEventArgs.altKey = false;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).onKeyDown(keyboardEventArgs);
            listObj.inputElement.value = 'x';
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 88;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).ulElement.querySelectorAll('li').length).toBe(10);
            listObj.onBlurHandler();
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).ulElement.querySelectorAll('li').length).toBe(9);
        });
        it('popup shows custom entered value instead of data source values with filtering.', () => {
            listObj = new MultiSelect({
                dataSource: datasource,
                mode: 'Default',
                allowCustomValue: true,
                allowFiltering: true,
                debounceDelay: 0,
                fields: { value: 'id', text: 'text' }
            });
            listObj.appendTo(mEle);
            keyboardEventArgs.keyCode = 9;
            keyboardEventArgs.altKey = false;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).onKeyDown(keyboardEventArgs);
            listObj.inputElement.value = 'x';
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 88;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).ulElement.querySelectorAll('li').length).toBe(1);
            listObj.onBlurHandler();
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).ulElement.querySelectorAll('li').length).toBe(9);
        });
    });
    describe('EJ2-42380', () => {
        let listObj: any;
        let checkObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            checkObj = new CheckBoxSelection();
            checkObj.destroy();
        });
        // it('Selection is not made using spacebar, if we close and reopen the popup again using arrow keys', () => {
        //     let data: { [key: string]: Object }[] = [
        //         { Name: 'Australia', Code: 'AU' },
        //         { Name: 'Bermuda', Code: 'BM' },
        //         { Name: 'United States', Code: 'US' }
        //     ];
        //     listObj = new MultiSelect({
        //         dataSource: data,
        //         mode: 'CheckBox',
        //         fields: { text: 'Name', value: 'Code' }, allowFiltering: true,
        //         filtering: function (e) {
        //             let query: Query = new Query().select(['Name', 'text']);
        //             query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
        //             e.updateData(data, query);
        //         }
        //     });
        //     listObj.appendTo(element);
        //     listObj.showPopup();
        //     keyboardEventArgs.keyCode = 40;
        //     listObj.onKeyDown(keyboardEventArgs);
        //     keyboardEventArgs.keyCode = 32;
        //     listObj.onKeyDown(keyboardEventArgs);
        //     keyboardEventArgs.keyCode = 9;
        //     listObj.onKeyDown(keyboardEventArgs);
        //     (<any>listObj).inputElement.blur();
        //     (<any>listObj).onBlurHandler();
        //     listObj.showPopup();
        //     keyboardEventArgs.keyCode = 40;
        //     listObj.onKeyDown(keyboardEventArgs);
        //     keyboardEventArgs.keyCode = 32;
        //     expect((<any>listObj).value[0]).toBe("AU");
        // });
    });
    describe('EJ2-44516', () => {
        let listObj: any;
        let listObj1: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let element1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect1', attrs: { type: "text" } });
        beforeAll(() => {
            document.body.appendChild(element);
            document.body.appendChild(element1);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            if (element1) {
                listObj1.destroy();
                element1.remove();
            }
        });
        it('Popup not closing when render multiple control.', () => {
            let data: { [key: string]: Object }[] = [
                { Name: 'Australia', Code: 'AU' },
                { Name: 'Bermuda', Code: 'BM' },
                { Name: 'United States', Code: 'US' }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'CheckBox',
                fields: { text: 'Name', value: 'Code' }, allowFiltering: true, debounceDelay: 0,
            });
            listObj.appendTo(element);
            listObj1 = new MultiSelect({
                dataSource: data,
                mode: 'CheckBox',
                fields: { text: 'Name', value: 'Code' }, allowFiltering: true, debounceDelay: 0,
            });
            listObj1.appendTo(element1);
            listObj.showPopup();
            keyboardEventArgs.keyCode = 40;
            listObj.onKeyDown(keyboardEventArgs);
            mouseEventArgs.target = document.body;
            listObj.checkBoxSelectionModule.onDocumentClick(mouseEventArgs);
            expect(listObj.isPopupOpen()).toBe(false);
        });
    });
    describe('EJ2-44639', () => {
        let listObj: any;
        let browserType: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        beforeAll(() => {
            browserType = Browser.userAgent;
            Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
            Browser.userAgent = browserType;
        });
        it('Arrow up not workig in firefox.', () => {
            let data: { [key: string]: Object }[] = [
                { Name: 'Australia', Code: 'AU' },
                { Name: 'Bermuda', Code: 'BM' },
                { Name: 'United States', Code: 'US' }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'CheckBox',
                fields: { text: 'Name', value: 'Code' }, allowFiltering: true, debounceDelay: 0,
            });
            listObj.appendTo(element);
            listObj.showPopup();
            listObj.checkBoxSelectionModule.filterInput.focus();
            keyboardEventArgs.keyCode = 40;
            listObj.onKeyDown(keyboardEventArgs);
            expect(listObj.popupWrapper.querySelector('.e-item-focus').innerText).toBe("Australia");
            keyboardEventArgs.keyCode = 40;
            listObj.onKeyDown(keyboardEventArgs);
            expect(listObj.popupWrapper.querySelector('.e-item-focus').innerText).toBe("Bermuda");
            keyboardEventArgs.keyCode = 40;
            listObj.onKeyDown(keyboardEventArgs);
            expect(listObj.popupWrapper.querySelector('.e-item-focus').innerText).toBe("United States");
            keyboardEventArgs.keyCode = 38;
            listObj.onKeyDown(keyboardEventArgs);
            expect(listObj.popupWrapper.querySelector('.e-item-focus').innerText).toBe("Bermuda");
            keyboardEventArgs.keyCode = 38;
            listObj.onKeyDown(keyboardEventArgs);
            expect(listObj.popupWrapper.querySelector('.e-item-focus').innerText).toBe("Australia");
        });
    });
    describe("EJ2-45073- Dropdownlist with select tag updating value wrongly when it contains Empty as inner text and “” as value", () => {
        let listObj: any;
        let element: string = "<select id='select1'><option value = '0'>option1</option><option value=''>Empty</option><option value='1'>Option3</option></select>";
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeEach(() => {
            document.body.innerHTML = element;
            let select: HTMLSelectElement = document.getElementById('select1') as HTMLSelectElement;
            document.body.appendChild(select);
            listObj = new MultiSelect();
            listObj.appendTo('#select1');
        });
        afterEach(() => {
            let select: HTMLSelectElement = document.getElementById('select1') as HTMLSelectElement;
            if (select) {
                let parent: HTMLElement = select.parentElement as HTMLElement;
                parent.remove();
            }
        });
        it('dynamically bind the empty value of the select tag', (done) => {
            listObj.value = [''];
            listObj.dataBind();
            setTimeout(() => {
                expect(listObj.viewWrapper.innerText).toBe('Empty');
                expect((listObj.value)[0]).toBe('');
                expect(listObj.text).toBe('Empty');
                done();
            }, 450);
        });
        it('open popup and select the empty value item from the list', (done) => {
            listObj.showPopup();
            mouseEventArgs.target = listObj.ulElement.querySelectorAll('li')[1];
            mouseEventArgs.type = 'click';
            listObj.onMouseClick(mouseEventArgs);
            listObj.inputElement.blur();
            listObj.onBlurHandler();
            setTimeout(() => {
                expect(listObj.viewWrapper.innerText).toBe('Empty');
                expect((listObj.value)[0]).toBe('');
                expect(listObj.text).toBe('Empty');
                done();
            }, 450);
        });
    });
    describe("EJ2-36805", () => {
        let listObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Chip not created when change value dynamically when control is in focus', () => {
            let data: { [key: string]: Object }[] = [
                { Name: 'Australia', Code: 'AU' },
                { Name: 'Bermuda', Code: 'BM' },
                { "Name": "India", "Code": "IN" },
                { Name: 'United States', Code: 'US' }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'Box',
                value: ['AU','US'],
                fields: { text: 'Name', value: 'Code' }
            });
            listObj.appendTo(element);
            expect(listObj.chipCollectionWrapper.childElementCount).toBe(2);
            listObj.focusIn();
            listObj.value = ['IN'];
            listObj.dataBind();
            expect(listObj.chipCollectionWrapper.childElementCount).toBe(1);
            expect(listObj.chipCollectionWrapper.firstElementChild.innerText).toBe("India");
        });
        
    });
    describe("EJ2-36805", () => {
        let listObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Chip not created when change value dynamically when control is in focus', () => {
            let data: { [key: string]: Object }[] = [
                { Name: 'Australia', Code: 'AU' },
                { Name: 'Bermuda', Code: 'BM' },
                { "Name": "India", "Code": "IN" },
                { Name: 'United States', Code: 'US' }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'Box',
                value: ['AU','US'],
                fields: { text: 'Name', value: 'Code' }
            });
            listObj.appendTo(element);
            expect(listObj.chipCollectionWrapper.childElementCount).toBe(2);
            listObj.focusIn();
            listObj.value = ['IN'];
            listObj.dataBind();
            expect(listObj.chipCollectionWrapper.childElementCount).toBe(1);
            expect(listObj.chipCollectionWrapper.firstElementChild.innerText).toBe("India");
        });
        it('Chip not created when change value dynamically when control is in focus - Default Mode', () => {
            let data: { [key: string]: Object }[] = [
                { Name: 'Australia', Code: 'AU' },
                { Name: 'Bermuda', Code: 'BM' },
                { "Name": "India", "Code": "IN" },
                { Name: 'United States', Code: 'US' }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                fields: { text: 'Name', value: 'Code' }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            listObj.hidePopup();
            listObj.focusIn();
            listObj.value = ['IN'];
            listObj.dataBind();
            expect(listObj.chipCollectionWrapper.style.display == "").toBe(true);
            expect(listObj.chipCollectionWrapper.childElementCount).toBe(1);
            expect(listObj.chipCollectionWrapper.firstElementChild.innerText).toBe("India");
        });
    });
    describe("Un Select all not working when integer datasource", () => {
        let listObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let mouseDownEvent : MouseEvent = document.createEvent('MouseEvent');
        mouseDownEvent.initEvent('mousedown');
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Clicking Select all and Unselect all', () => {
            let data: { [key: string]: Object }[] = [
                { Name: 'Australia', Code: 1 },
                { Name: 'Bermuda', Code: 2 },
                { "Name": "India", "Code": 3 },
                { Name: 'United States', Code: 4 }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'CheckBox',
                showSelectAll: true,
                fields: { text: 'Name', value: 'Code' }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            if (listObj.isPopupOpen()) {
                listObj.popupObj.element.querySelector('.e-selectall-parent').dispatchEvent(mouseDownEvent);
                expect(listObj.viewWrapper.innerText.length).toBeGreaterThan(0);
                listObj.popupObj.element.querySelector('.e-selectall-parent').dispatchEvent(mouseDownEvent);
                expect(listObj.viewWrapper.innerText.length).toBe(0);
            }
        });
        it('Using Select all and unselect all method', () => {
            let data: { [key: string]: Object }[] = [
                { Name: 'Australia', Code: 1 },
                { Name: 'Bermuda', Code: 2 },
                { "Name": "India", "Code": 3 },
                { Name: 'United States', Code: 4 }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'CheckBox',
                fields: { text: 'Name', value: 'Code' }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            if (listObj.isPopupOpen()) {
                listObj.selectAll(true);
                expect(listObj.viewWrapper.innerText.length).toBeGreaterThan(0);
                listObj.selectAll(false);
                expect(listObj.viewWrapper.innerText.length).toBe(0);
            }
        });
    });
    describe('EJ2-51978 - Multiselct custom value removing using backspace key', () => {
        let mObj: any;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let datasource: { [key: string]: Object }[] = [
            { id: 'game1', sports: 'Badminton' },
            { id: 'game2', sports: 'Football' },
            { id: 'game3', sports: 'Tennis' }
        ];
        beforeAll(() => {
            document.body.appendChild(mEle);
            mObj = new MultiSelect({
                allowCustomValue: true, 
            });
            mObj.appendTo(mEle);
        });
        afterAll(() => {
            mObj.destroy();
            mEle.remove();
        });

        it('check whether the Multiselect popup is shown or not', () => {
            mObj.focusIn();
            mObj.inputElement.value = "a";
            let event: any = new Event('keyup');
            event.keyCode = 65;
            event.key = "a";
            mObj.isValidKey = true;
            mObj.inputElement.dispatchEvent(event);
            let popEle: any = mObj.popupObj.element.getElementsByTagName("li");
            expect(popEle.length).toBe(1);
            expect(popEle[0].textContent.trim() === 'a').toBe(true);
            mObj.inputElement.value = "";
            event.keyCode = 8;
            event.key = "";
            mObj.isValidKey = true;
            mObj.inputElement.dispatchEvent(event);
            popEle = mObj.popupObj.element.getElementsByTagName("li");
            expect(popEle.length).toBe(0);
            expect(mObj.popupObj.element.querySelector('.e-nodata')).not.toBeNull();
            mObj.hidePopup();
            mObj.showPopup();
            expect(mObj.popupObj.element.querySelector('.e-nodata')).not.toBeNull();
        });
    });
    describe("EJ2-50033", () => {
        let listObj: any;
        let element: string = "<select id='select1'><option value = '0'>option1</option><option value=''>Empty</option><option value='1'>Option3</option></select>";
        let isOpen:  boolean = false;
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeEach(() => {
            document.body.innerHTML = element;
            let select: HTMLSelectElement = document.getElementById('select1') as HTMLSelectElement;
            document.body.appendChild(select);
            listObj = new MultiSelect({
                open: () => {
                    isOpen = true;
                }
            });
            listObj.appendTo('#select1');
        });
        afterEach(() => {
            let select: HTMLSelectElement = document.getElementById('select1') as HTMLSelectElement;
            if (select) {
                let parent: HTMLElement = select.parentElement as HTMLElement;
                parent.remove();
            }
        });
        it('dynamically change datasource', (done) => {
            listObj.datasource =[
                { value: '1', text: 'Group1 A' },
                { value: '2', text: 'Group1 B' },
                { value: '3', text: 'Group1 C' },
                { value: '4', text: 'Group1 D' }
              ];
            listObj.dataBind();
            listObj.showPopup()
            setTimeout(() => {
                expect(isOpen).toBe(true);
                done();
            }, 100);
        });
    });
    describe("EJ2-46897- Hidden element not updated properly when predefined values provided", () => {
        let listObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let mouseDownEvent : MouseEvent = document.createEvent('MouseEvent');
        mouseDownEvent.initEvent('mousedown');
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Clicking Select all and Unselect all', () => {
            let data: { [key: string]: Object }[] = [
                { Name: 'Australia', Code: 1 },
                { Name: 'Bermuda', Code: 2 },
                { Name: "India", Code: 3 },
                { Name: 'United States', Code: 4 }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'CheckBox',
                value: [1,3],
                showSelectAll: true,
                fields: { text: 'Name', value: 'Code' }
            });
            listObj.appendTo(element);
            expect(listObj.hiddenElement.options.length).toBe(2);
            listObj.showPopup();
            if (listObj.isPopupOpen()) {
                listObj.popupObj.element.querySelector('.e-selectall-parent').dispatchEvent(mouseDownEvent);
                expect(listObj.hiddenElement.options.length).toBe(4);
                listObj.popupObj.element.querySelector('.e-selectall-parent').dispatchEvent(mouseDownEvent);
                expect(listObj.viewWrapper.innerText.length).toBe(0);
            }
        });
        it('Using Select all and unselect all method', () => {
            let data: { [key: string]: Object }[] = [
                { Name: 'Australia', Code: 1 },
                { Name: 'Bermuda', Code: 2 },
                { Name: "India", Code: 3 },
                { Name: 'United States', Code: 4 }
            ];
            listObj = new MultiSelect({
                dataSource: data,
                mode: 'CheckBox',
                value: [1,3],
                showSelectAll: true,
                fields: { text: 'Name', value: 'Code' }
            });
            listObj.appendTo(element);
            expect(listObj.hiddenElement.options.length).toBe(2);
            listObj.showPopup();
            if (listObj.isPopupOpen()) {
                listObj.selectAll(true);
                expect(listObj.hiddenElement.options.length).toBe(4);
                listObj.selectAll(false);
                expect(listObj.hiddenElement.options.length).toBe(0);
            }
        });
    });
    describe('EJ2-56142', () => {
        let mulObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let sportsData: { [key: string]: Object }[] =  [
            { Id: 'Game1', Game: 'American Football' },
            { Id: 'Game2', Game: 'Badminton' },
            { Id: 'Game3', Game: 'Basketball' },
            { Id: 'Game4', Game: 'Cricket' },
            { Id: 'Game5', Game: 'Football' },
            { Id: 'Game6', Game: 'Golf' },
            { Id: 'Game7', Game: 'Hockey' },
            { Id: 'Game8', Game: 'Rugby' },
            { Id: 'Game9', Game: 'Snooker' },
            { Id: 'Game10', Game: 'Tennis' }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('The Multiselect component popup does not open while changing popupHeight dynamically in beforeOpen', () => {
            mulObj = new MultiSelect({
                dataSource: sportsData,
                fields: { text: 'Game', value: 'Id' },
                beforeOpen: function(){
                    mulObj.popupHeight = '20px';
                }
            });
            mulObj.appendTo(element);
            mulObj.showPopup();
            expect((<any>mulObj).isPopupOpen()).toBe(true);
            expect(document.body.contains((<any>mulObj).popupObj.element)).toBe(true);
        });
    });
    // describe('EJ2942122 - MultiSelect Virtualization with ValueTemplate', () => {
    //     let originalTimeout: number;		
    //     let listObj: MultiSelect;		
    //     let element: HTMLInputElement = <HTMLInputElement>document.createElement('input');		
    //     beforeAll(() => {	
    //         originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;	
    //         document.body.appendChild(element);		
    //         listObj = new MultiSelect({		
    //             dataSource: new DataManager({		
    //                 url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',		
    //                 adaptor: new ODataV4Adaptor,		
    //                 crossDomain: true		
    //             }),		
    //             fields: { text: 'ContactName', value: 'CustomerID' },		
    //             placeholder: 'Select a customer',		
    //             mode: 'Box',		
    //             allowCustomValue: false,		
    //             enableVirtualization: true,		
    //             value: ['ALFKI', 'LINOD', 'MAISD'],		
    //             sortOrder: 'Ascending',		
    //             itemTemplate: '<span><span>${CustomerID }</span><span>${ContactName}</span></span>',		
    //             valueTemplate: '<span>${ContactTitle} - ${ContactName}</span>',		
    //         });		
    //         listObj.appendTo(element);		
    //     });		
    //     afterAll(() => {		
    //         if (listObj) {		
    //             listObj.destroy();		
    //         }		
    //         element.remove();		
    //     });	
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;	
    //     it('should create MultiSelect with virtualization and apply templates correctly', (done) => {		
    //         (listObj.dataSource as DataManager).executeQuery(new Query().take(2))		
    //             .then((e: any) => {		
    //                 setTimeout(() => {		
    //                     expect(listObj.value.length).toBe(3);		
    //                     expect((<any>listObj).chipCollectionWrapper.childElementCount).toBe(3);		
    //                    let chipContents = (<any>listObj).chipCollectionWrapper.querySelectorAll('.e-chipcontent');		
    //                    // expect(chipContents[0].innerText).toContain('Sales Representative - Maria Anders');		
    //                    // expect(chipContents[1].innerText).toContain('Owner - Felipe Izquierdo');		
    //                    // expect(chipContents[2].innerText).toContain('Sales Agent - Catherine Dewey');		
    //                     done();		
    //                 }, 1700); // Allow time for virtualization loading		
    //             });		
    //     });		
    // });			
});
