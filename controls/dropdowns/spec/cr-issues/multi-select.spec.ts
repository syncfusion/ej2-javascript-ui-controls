
import { createElement, isVisible, isNullOrUndefined, Browser, EmitType } from '@syncfusion/ej2-base';
import { MultiSelect } from '../../src/multi-select/index';
import { FilteringEventArgs } from '../../src/drop-down-base';
import { DataManager, Query, ODataV4Adaptor, ODataAdaptor } from '@syncfusion/ej2-data';
import { extend } from '@syncfusion/ej2-base';
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
            url: '/api/Employees',
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

    describe('EJ2-17608 - Duplicate values are listed while fetching data with remote data when allowCustom value is set to true.', () => {
        let listObj: any;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        let count: number = 0;
        beforeAll(() => {
            document.body.appendChild(mEle);
            listObj = new MultiSelect({
                dataSource: remoteData,
                allowCustomValue: true,
                allowFiltering: true,
                actionComplete: (e: any) => {
                    if (e.request) {
                        count++;
                    }
                },
                query: new Query().take(10),
                fields: { value: 'EmployeeID', text: 'FirstName' }
            });
            listObj.appendTo(mEle);
        });
        afterAll(() => {
            listObj.destroy();
            mEle.remove();
        });

        it('Two custom value select ', (done) => {
            listObj.focusIn();
            listObj.showPopup();
            setTimeout(() => {
                expect(count === 1).toBe(true);
                count = 0;
                (<any>listObj).inputElement.value = "RUBY";
                //open action validation
                keyboardEventArgs.keyCode = 113;
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).KeyUp(keyboardEventArgs);
                setTimeout(() => {
                    expect(count === 1).toBe(true);
                    mouseEventArgs.target = (<any>listObj).liCollections[0];
                    mouseEventArgs.type = 'click';
                    (<any>listObj).onMouseClick(mouseEventArgs);
                    done();
                }, 400);
            }, 400);
        });
        it(' Without duplicate items while type custom value ', (done) => {
            listObj.focusIn();
            listObj.showPopup();
            setTimeout(() => {
                expect(count === 1).toBe(true);
                count = 0;
                (<any>listObj).inputElement.value = "l";
                //open action validation
                keyboardEventArgs.keyCode = 113;
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).KeyUp(keyboardEventArgs);
                setTimeout(() => {
                    expect(count === 1).toBe(true);
                    expect((<any>listObj).liCollections.length === 2).toBe(true);
                    done();
                }, 400);
            }, 400);
        });
    });

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
            mObj.ClearAll(new Event("mousedown"));
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
            mObj.KeyUp(event);
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
                allowFiltering: true
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
            (<any>atcObj).onBlur();
            atcObj.destroy();
        });
    });
    describe('Remote data binding - allowCustomValue', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
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

        it('EJ2-9767- CR_ISSUE allowCustomValue.- remote data with filter', (done) => {
            let status: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: remoteData,
                popupHeight: "auto",
                mode: 'Box',
                fields: { value: 'EmployeeID', text: 'FirstName' },
                filtering: function (e) {
                    var query = new Query().select(['FirstName', "EmployeeID"]);
                    query = (e.text !== '') ? query.where('FirstName', 'startswith', e.text, true) : query;
                    e.updateData(remoteData, query);
                },
                customValueSelection: function () {
                    status = true;
                },
                allowCustomValue: true,
                allowFiltering: true
            });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputFocus = true;
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            setTimeout(() => {
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).KeyUp(keyboardEventArgs);
                setTimeout(() => {
                    expect((<any>listObj).liCollections.length).toBe(1);
                    expect((<any>listObj).value).toBe(null);
                    mouseEventArgs.target = (<any>listObj).liCollections[0];
                    mouseEventArgs.type = 'click';
                    (<any>listObj).onMouseClick(mouseEventArgs);
                    expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
                    listObj.destroy();
                    expect(status).toBe(true);
                    done();
                }, 2000);
            }, 800);
        });
    });
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
            }, new Query());
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
        it('EJ2-13454- pre select value', () => {
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
                allowFiltering: true
            });
            listObj.appendTo(element);
            listObj.value = ['JAVA', 'C#', 'C++'];
            listObj.dataBind();
            listObj.showPopup();
            expect((listObj as any).isPopupOpen()).not.toBe(true);
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
            }, new Query());
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
                openOnClick: true,
                floatLabelType: 'Auto',
                filtering: (args: any) => {
                    this.noRecordsTemplate = 'No Record Found';
                    args.preventDefaultAction = true;
                    let query: Query = new Query().where('CustomerID', 'startswith', args.text);
                    new DataManager(result).executeQuery(query).then((e: any) => {
                        args.updateData(<{ [key: string]: Object; }[]>e.result)
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
            (<any>listObj).KeyUp(keyboardEventArgs);
            setTimeout(function () {
                expect(document.body.contains((<any>listObj).popupObj.element)).toBe(true);
                mouseEventArgs.target = (<any>listObj).liCollections[0];
                mouseEventArgs.type = 'click';
                (<any>listObj).onMouseClick(mouseEventArgs);
                (<any>listObj).inputElement.value = "A";
                keyboardEventArgs.keyCode = 70;
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).KeyUp(keyboardEventArgs);
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
            mObj.ClearAll(new Event("mousedown"));
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
            dropDowns.ClearAll(keyboardEventArgs);
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
            { id: 'list2 ', text: 'C#' },
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
                expect(listObj.value === null).toBe(true);
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
});