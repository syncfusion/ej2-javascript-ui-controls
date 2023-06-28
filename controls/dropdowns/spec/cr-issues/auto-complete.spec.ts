/**
 * ComboBox spec document
 */
import { createElement, isVisible, isNullOrUndefined, Browser, EmitType, extend } from '@syncfusion/ej2-base';
import { AutoComplete } from '../../src/auto-complete/index';
import { FilteringEventArgs } from '../../src/drop-down-base';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';

let mouseEventArgs: any = { preventDefault: function () { }, target: null };
describe('AutoComplete', () => {
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
    // describe('EJ2-10357 -  Autocomplete (and all components with dropdown) displays the suggestions list even if the focus is lost for related component.', () => {
    //     let autoObj: any;
    //     let autoEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'auto' });
    //     let dataSource = new DataManager({
    //         url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/',
    //         crossDomain: true
    //     });
    //     beforeAll(() => {
    //         document.body.appendChild(autoEle);
    //         autoObj = new AutoComplete({
    //             dataSource: dataSource,
    //             query: new Query().from('Customers').select('ContactName').take(7),
    //             fields: { text: 'ContactName' },
    //             placeholder: 'Select a name'
    //         });
    //         autoObj.appendTo(autoEle);
    //     });
    //     afterAll(() => {
    //         autoObj.destroy();
    //         autoEle.remove();
    //     });

    //     it('check whether the autocomplete popup is shown or not', () => {
    //         autoObj.focusIn()
    //         autoObj.inputElement.value = "a";
    //         let event: any = new Event('keyup');
    //         event.keyCode = 65;
    //         event.key = "a";
    //         autoObj.isValidKey = true;
    //         autoObj.onFilterUp(event);
    //         let event2: any = new Event("blur");
    //         autoObj.filterInput.dispatchEvent(event2);
    //         expect(autoObj.isPopupOpen).toBe(false);
    //     });
    // });
    // describe('EJ2-10319 -  Autocomplete two way binding value is not properly updated for first time', () => {
    //     let autoObj: any;
    //     let autoEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'auto' });
    //     let dataSource = new DataManager({
    //         url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/',
    //         crossDomain: true
    //     });
    //     beforeAll(() => {
    //         document.body.appendChild(autoEle);
    //         autoObj = new AutoComplete({
    //             dataSource: dataSource,
    //             query: new Query().from('Customers').select('ContactName').take(7),
    //             fields: { text: 'ContactName' },
    //             placeholder: 'Select a name'
    //         });
    //         autoObj.appendTo(autoEle);
    //     });
    //     afterAll(() => {
    //         autoObj.destroy();
    //         autoEle.remove();
    //     });

    //     it('check the autocomplete value with the previous value to trigger onProperty change', () => {
    //         autoObj.focusIn();
    //         autoObj.inputElement.value = "as";
    //         autoObj.focusOut();
    //         expect(autoObj.inputElement.value === autoObj.value).toBe(true);
    //     });
    // });
    describe('EJ2-26008-The autocomplete is not focused when click the tab key at single time', () => {
        let autoObj: any;
        let autoEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'auto' });
        let dataSource = new DataManager({
            url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/',
            crossDomain: true
        });
        beforeAll(() => {
            document.body.appendChild(autoEle);
            autoObj = new AutoComplete({
                dataSource: dataSource,
                query: new Query().from('Customers').select('ContactName').take(7),
                fields: { text: 'ContactName' },
                placeholder: 'Select a name'
            });
            autoObj.appendTo(autoEle);
        });
        afterAll(() => {
            autoObj.destroy();
            autoEle.remove();
        });
        it('Remove tabindex attribute in wrapper element', () => {
            expect(autoObj.inputWrapper.container.hasAttribute('tabindex')).toBe(false);
        });
    });
    describe('EJ2-9963 - Value is not updated correctly when it contains spaces', () => {
        let autoObj: any;
        let autoEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'auto' });
        let countries: { [key: string]: Object; }[] = [
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
            document.body.appendChild(autoEle);
            autoObj = new AutoComplete({
                dataSource: countries,
                fields: { value: 'Name' }
            });
            autoObj.appendTo(autoEle);
        });
        afterAll(() => {
            autoObj.destroy();
            autoEle.remove();
        });

        it('check the autocomplete value without space added in the select element', () => {
            autoObj.value = 'Italy';
            autoObj.dataBind();
            let optEle = autoObj.hiddenElement.querySelector('option');
            expect(optEle.value === "Italy").toBe(true);
        });

        it('check the autocomplete value with space added in the select element', () => {
            autoObj.value = 'United States';
            autoObj.dataBind();
            let optEle = autoObj.hiddenElement.querySelector('option');
            expect(optEle.value === "United States").toBe(true);
        });
    });
    describe('EJ2-9168 - Initial value not set while using remote data in autocomplete', () => {
        let atcObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let dataSource = new DataManager({
            url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/',
            crossDomain: true
        });
        let query = new Query().from('Customers').select(['ContactName', 'CustomerID']).take(10);
        let result: any = [];
        beforeAll((done) => {
            document.body.appendChild(element);
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
            atcObj.destroy();
            element.remove();
            jasmine.Ajax.uninstall();
        });

        it('check the autocomplete value with allowCustom as false', () => {
            atcObj = new AutoComplete({
                dataSource: result,
                fields: { value: 'CustomerID' },
                placeholder: 'e.g. Alice Mutton',
                filterType: 'StartsWith',
                allowCustom: false,
                value: 'VINET',
            });
            atcObj.appendTo(element);
            expect(atcObj.value === 'VINET').toBe(true);
        });
        it('select the non-listed value with allowCustom as false', () => {
            atcObj.clear();
            atcObj.text = 'JavaScript';
            atcObj.dataBind();
            expect(atcObj.value === null).toBe(true);
        });
        it('select the non-listed value with allowCustom as true', (done) => {
            atcObj.allowCustom = true;
            atcObj.dataBind();
            atcObj.clear();
            atcObj.text = 'JavaScript';
            atcObj.dataBind();
            atcObj.dataBound = function () {
                expect(atcObj.value === 'JavaScript').toBe(true);
                done();
            };
            atcObj.showPopup();
        });
    });
    describe('EJ2-9763 - Value is not updated correctly when diacritics are used in AutoComplete.', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let atcObj: any;
        let activeElement: HTMLElement[];
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let data: string[] = ['TÜRKİYE', 'Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Tennis']
        beforeAll(() => {
            document.body.appendChild(element);
            atcObj = new AutoComplete({
                dataSource: data,
                ignoreAccent: true,
                allowCustom: false
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
        });

        it('search diacritics data', (done) => {
            atcObj.open = function (args: any) {
                let item: HTMLElement[] = atcObj.popupObj.element.querySelectorAll('li');
                expect(item.length === 1).toBe(true);
                atcObj.open = null;
                done();
            };
            atcObj.filterInput.value = 'türkiye';
            keyEventArgs.keyCode = 40;
            atcObj.onInput(keyEventArgs);
            atcObj.onFilterUp(keyEventArgs);
        });
        it('press tab key while hide a popup', (done) => {
            atcObj.close = function (args: any) {
                expect(atcObj.inputWrapper.container.classList.contains('e-input-focus')).toEqual(true);
                done();
            };
            e.keyCode = 9;
            atcObj.onFilterDown(e);
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            e.action = 'tab';
            atcObj.isPopupOpen = true;
            atcObj.keyActionHandler(e);
        });
        it('checking the value', (done) => {
            atcObj.blur = function (args: any) {
                expect(atcObj.value === 'TÜRKİYE').toBe(true);
                done();
            };
            mouseEventArgs.target = document.body;
            atcObj.onBlurHandler(mouseEventArgs);
        });
        describe('ignoreAccent set as false ', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let atcObj: any;
            let activeElement: HTMLElement[];
            let e: any = { preventDefault: function () { }, target: null };
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
            let data: string[] = ['TÜRKİYE', 'Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Tennis']
            beforeAll(() => {
                document.body.appendChild(element);
                atcObj = new AutoComplete({
                    dataSource: data,
                    ignoreAccent: false,
                    allowCustom: false
                });
                atcObj.appendTo(element);
            });
            afterAll(() => {
                atcObj.destroy();
                element.remove();
            });
            it('search diacritics data', (done) => {
                atcObj.open = function (args: any) {
                    let item: HTMLElement[] = atcObj.popupObj.element.querySelectorAll('li');
                    expect(item.length === 0).toBe(true);
                    atcObj.open = null;
                    done();
                };
                atcObj.filterInput.value = 'türkiye';
                keyEventArgs.keyCode = 40;
                atcObj.onInput(keyEventArgs);
                atcObj.onFilterUp(keyEventArgs);
            });
            it('press tab key while hide a popup', (done) => {
                atcObj.close = function (args: any) {
                    expect(atcObj.inputWrapper.container.classList.contains('e-input-focus')).toEqual(true);
                    done();
                };
                e.keyCode = 9;
                atcObj.onFilterDown(e);
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                e.action = 'tab';
                atcObj.isPopupOpen = true;
                atcObj.keyActionHandler(e);
            });
            it('checking the value', (done) => {
                atcObj.blur = function (args: any) {
                    expect(atcObj.value === null).toBe(true);
                    done();
                };
                mouseEventArgs.target = document.body;
                atcObj.onBlurHandler(mouseEventArgs);
            });
        });
        describe('ignoreCase set as false ', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let atcObj: any;
            let activeElement: HTMLElement[];
            let e: any = { preventDefault: function () { }, target: null };
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
            let data: string[] = ['TÜRKİYE', 'Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Tennis']
            beforeAll(() => {
                document.body.appendChild(element);
                atcObj = new AutoComplete({
                    dataSource: data,
                    ignoreAccent: true,
                    ignoreCase: false,
                    allowCustom: false
                });
                atcObj.appendTo(element);
            });
            afterAll(() => {
                atcObj.destroy();
                element.remove();
            });
            it('search diacritics data', (done) => {
                atcObj.open = function (args: any) {
                    let item: HTMLElement[] = atcObj.popupObj.element.querySelectorAll('li');
                    expect(item.length === 0).toBe(true);
                    atcObj.open = null;
                    done();
                };
                atcObj.filterInput.value = 'türkiye';
                keyEventArgs.keyCode = 40;
                atcObj.onInput(keyEventArgs);
                atcObj.onFilterUp(keyEventArgs);
            });
            it('press tab key while hide a popup', (done) => {
                atcObj.close = function (args: any) {
                    expect(atcObj.inputWrapper.container.classList.contains('e-input-focus')).toEqual(true);
                    done();
                };
                e.keyCode = 9;
                atcObj.onFilterDown(e);
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                e.action = 'tab';
                atcObj.isPopupOpen = true;
                atcObj.keyActionHandler(e);
            });
            it('checking the value', (done) => {
                atcObj.blur = function (args: any) {
                    expect(atcObj.value === null).toBe(true);
                    done();
                };
                mouseEventArgs.target = document.body;
                atcObj.onBlurHandler(mouseEventArgs);
            });
        });
        describe('ignoreCase set as false ', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let atcObj: any;
            let activeElement: HTMLElement[];
            let e: any = { preventDefault: function () { }, target: null };
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
            let data: string[] = ['TÜRKİYE', 'Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Tennis']
            beforeAll(() => {
                document.body.appendChild(element);
                atcObj = new AutoComplete({
                    dataSource: data,
                    ignoreAccent: true,
                    ignoreCase: false,
                    allowCustom: false
                });
                atcObj.appendTo(element);
            });
            afterAll(() => {
                atcObj.destroy();
                element.remove();
            });
            it('search diacritics data', (done) => {
                atcObj.open = function (args: any) {
                    let item: HTMLElement[] = atcObj.popupObj.element.querySelectorAll('li');
                    expect(item.length === 1).toBe(true);
                    atcObj.open = null;
                    done();
                };
                atcObj.filterInput.value = 'Bas';
                keyEventArgs.keyCode = 40;
                atcObj.onInput(keyEventArgs);
                atcObj.onFilterUp(keyEventArgs);
            });
            it('press tab key while hide a popup', (done) => {
                atcObj.close = function (args: any) {
                    expect(atcObj.inputWrapper.container.classList.contains('e-input-focus')).toEqual(true);
                    done();
                };
                e.keyCode = 9;
                atcObj.onFilterDown(e);
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                e.action = 'tab';
                atcObj.isPopupOpen = true;
                atcObj.keyActionHandler(e);
            });
            it('checking the value', (done) => {
                atcObj.blur = function (args: any) {
                    expect(atcObj.value === null).toBe(true);
                    atcObj.destroy();
                    done();
                };
                mouseEventArgs.target = document.body;
                atcObj.onBlurHandler(mouseEventArgs);
            });
        });
    });
    describe('template with highlight search ', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let atcObj: any;
        let activeElement: HTMLElement[];
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let empList: { [key: string]: Object }[] = [
            { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
            { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
            { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
            { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
            { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' }];
        beforeAll(() => {
            document.body.appendChild(element);
            atcObj = new AutoComplete({
                dataSource: empList,
                fields: { value: 'text' },
                itemTemplate: '<div><img class="eimg" src="./../Employees/${eimg}.png" alt="employee"/>' +
                    '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                placeholder: 'Select an employee',
                highlight: true,
                open: function (e: any) {
                    let item: HTMLElement[] = atcObj.popupObj.element.querySelectorAll('li');
                    expect(item.length === 1).toBe(true);
                }
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
        });
        it('search data', () => {
            atcObj.filterInput.value = 'sa';
            keyEventArgs.keyCode = 40;
            atcObj.onInput(keyEventArgs);
            atcObj.onFilterUp(keyEventArgs);
        });
    });
    // describe('EJ2-15393 - Multiple requests are made to server', () => {
    //     let autoObj: any;
    //     let autoEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'auto' });
    //     let dataSource = new DataManager({
    //         url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/',
    //         crossDomain: true
    //     });
    //     let result: any = [];
    //     beforeAll((done) => {
    //         document.body.appendChild(autoEle);
    //         let mAjax: MockAjaxReturn = mockAjax({
    //             data: {
    //                 d: new DataManager(data).executeLocal(new Query().take(3).select(['OrderID', 'CustomerID', 'EmployeeID']))
    //             }
    //         }, new Query());
    //         mAjax.promise.then((e: ResponseType) => {
    //             result = e.result;
    //             done();
    //         });
    //     });
    //     afterAll(() => {
    //         autoObj.destroy();
    //         autoEle.remove();
    //         jasmine.Ajax.uninstall();
    //     });
    //     it('Searching the unmatched item ', (done) => {
    //         autoObj = new AutoComplete({
    //             dataSource: result,
    //             fields: { value: 'CustomerID' },
    //             placeholder: 'Select a name'
    //         });
    //         autoObj.appendTo(autoEle);
    //         autoObj.focusIn();
    //         autoObj.inputElement.value = "asas";
    //         let event: any = new Event('keyup');
    //         event.keyCode = 72;
    //         autoObj.isValidKey = true;
    //         autoObj.onFilterUp(event);
    //         setTimeout(() => {
    //             expect(autoObj.list.classList.contains('e-nodata')).toBe(true);
    //             done();
    //         }, 400)
    //     });
    //     it('Searching the matched item ', (done) => {
    //         autoObj.focusIn();
    //         autoObj.inputElement.value = "a";
    //         let event: any = new Event('keyup');
    //         event.keyCode = 72;
    //         autoObj.isValidKey = true;
    //         autoObj.onFilterUp(event);
    //         setTimeout(() => {
    //             expect(autoObj.list.querySelectorAll('li').length > 0).toBe(true);
    //             expect(autoObj.isDataFetched).not.toBe(true);
    //             done();
    //         }, 400)
    //     });
    // });
    // describe('EJ2-16375: Form reset', () => {
    //     let element: HTMLInputElement;
    //     let data: { [key: string]: Object }[] = [
    //         { id: 'list1', text: 'JAVA', icon: 'icon' },
    //         { id: 'list2', text: 'C#' },
    //         { id: 'list3', text: 'C++' },
    //         { id: 'list4', text: '.NET', icon: 'icon' },
    //         { id: 'list5', text: 'Oracle' }
    //     ];
    //     let listObj: AutoComplete;
    //     beforeAll(() => {
    //         element = <HTMLInputElement>createElement('form', { id: 'form1' });
    //         element.innerHTML = `<input type="text" id="autoComplete">
    //         <input type="reset" id="resetForm"/>`;
    //         document.body.appendChild(element);
    //         listObj = new AutoComplete({
    //             dataSource: data,
    //             fields: { value: "id" },
    //             value: 'list1'
    //         });
    //         listObj.appendTo('#autoComplete');
    //     });
    //     afterAll(() => {
    //         document.body.innerHTML = '';
    //     });
    //     it(' reset the form', (done) => {
    //         document.getElementById('resetForm').click();
    //         setTimeout(() => {
    //             expect(listObj.value === 'list1').toBe(true);
    //             done();
    //         })
    //     });
    // });

    // describe('EJ2-16375: Form inside form reset', () => {
    //     let element: HTMLInputElement;
    //     let data: { [key: string]: Object }[] = [
    //         { id: 'list1', text: 'JAVA', icon: 'icon' },
    //         { id: 'list2', text: 'C#' },
    //         { id: 'list3', text: 'C++' },
    //         { id: 'list4', text: '.NET', icon: 'icon' },
    //         { id: 'list5', text: 'Oracle' }
    //     ];
    //     let listObj: AutoComplete;
    //     beforeAll(() => {
    //         element = <HTMLInputElement>createElement('form', { id: 'form1' });
    //         element.innerHTML = `<input type="text" id="autoComplete">
    //         <div id="dynamic"></div>`;
    //         document.body.appendChild(element);
    //         let dynamicEle: HTMLElement = document.getElementById('dynamic');
    //         let form2: Element = createElement('form');
    //         form2.id = 'form2';
    //         form2.innerHTML = '<input id="tempInput" type="text"/> <input type="reset" id="resetForm"/>';
    //         dynamicEle.appendChild(form2);
    //         listObj = new AutoComplete({
    //             dataSource: data,
    //             fields: { value: "id" },
    //             value: 'list1'
    //         });
    //         listObj.appendTo('#autoComplete');
    //     });
    //     afterAll(() => {
    //         document.body.innerHTML = '';
    //     });
    //     it(' reset the form', (done) => {
    //         let input: HTMLInputElement = document.getElementById("tempInput") as HTMLInputElement;
    //         input.value = "test";
    //         document.getElementById('resetForm').click();
    //         setTimeout(() => {
    //             expect(listObj.value === 'list1').toBe(true);
    //             expect(input.value === '').toBe(true);
    //             done();
    //         })
    //     });
    // });

    describe('EJ2-17694 - Multiple time ajax request while change the dataSource ', () => {
        let autoObj: any;
        let autoEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'auto' });
        let result: any = [];
        beforeAll((done) => {
            document.body.appendChild(autoEle);
            let mAjax: MockAjaxReturn = mockAjax({
                data: {
                    d: new DataManager(data).executeLocal(new Query().take(10).select(['OrderID', 'CustomerID', 'EmployeeID']))
                }
            }, new Query());
            mAjax.promise.then((e: ResponseType) => {
                result = e.result;
                done();
            });
        });
        afterAll(() => {
            autoObj.destroy();
            autoEle.remove();
            jasmine.Ajax.uninstall();
        });
        it('change the dataSource dynamically ', (done) => {
            let count: number = 0;
            autoObj = new AutoComplete({
                fields: { value: 'CustomerID' },
                placeholder: 'Select a name',
                actionComplete: () => {
                    count++;
                }
            });
            autoObj.appendTo(autoEle);
            autoObj.focusIn();
            autoObj.inputElement.value = "a";
            let event: any = new Event('keyup');
            event.keyCode = 72;
            autoObj.isValidKey = true;
            autoObj.onFilterUp(event);
            setTimeout(() => {
                expect(autoObj.list.classList.contains('e-nodata')).toBe(true);
                autoObj.hidePopup();
                count = 0;
                setTimeout(() => {
                    autoObj.dataSource = result;
                    autoObj.query = new Query().take(3);
                    autoObj.dataBind();
                    expect(count === 1).toBe(true);
                    done();
                }, 400);
            }, 400);
        });
    });
    describe('EJ2CORE-353-Tab Key support', () => {
        let e: any = { preventDefault: function () { }, target: null };
        let autocompleteObj: any;
        let autocompleteEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'auto' });
        let countries: { [key: string]: Object; }[] = [
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
            document.body.appendChild(autocompleteEle);
        });
        afterAll(() => {
            autocompleteObj.destroy();
            autocompleteEle.remove();
        });

        it('check the autocomplete vzalue without space added in the select element', (done) => {
            autocompleteObj = new AutoComplete({
                dataSource: countries,
                fields: { value: 'Name' }
            });
            autocompleteObj.appendTo(autocompleteEle);
            autocompleteObj.showPopup();
            setTimeout(() => {
                expect(autocompleteObj.isPopupOpen).toBe(true);
                e.keycode = "40"
                e.action="down"
                autocompleteObj.keyActionHandler(e);
                done();
            }, 400)
        });
    });
    describe('EJ2-39738', () => {
        let e: any = { preventDefault: function () { }, target: null };
        let autocompleteObj: any;
        let autocompleteEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'auto' });
        let countries: { [key: string]: Object; }[] = [
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
            document.body.appendChild(autocompleteEle);
        });
        afterAll(() => {
            autocompleteObj.destroy();
            autocompleteEle.remove();
        });

        it('Popup shows only previously selected value when clicking down icon if autofill enabled - testcase', (done) => {
            autocompleteObj = new AutoComplete({
                dataSource: countries,
                fields: { value: 'Name' },
                autofill : true,
                select: (args) => {
                    autocompleteObj.inputElement.value = '';
                    expect(autocompleteObj.inputElement.value === '').toBe(true);
                    autocompleteObj.onFilterUp(e);
                    expect(autocompleteObj.list.querySelectorAll('li').length).toBe(19);
                }
            });
            autocompleteObj.appendTo(autocompleteEle);
            e.key = 'ArrowDown';
            e.keyCode = 40;
            e.action = 'down';
            e.ctrlKey = false;
            e.altKey = false;
            e.type = 'keydown'
            autocompleteObj.onFilterUp(e);
            setTimeout(() => {
                expect(autocompleteObj.isPopupOpen).toBe(true);
                expect(autocompleteObj.list.querySelectorAll('li').length).toBe(19);
                autocompleteObj.keyActionHandler(e);
                expect(autocompleteObj.inputElement.value === 'Australia').toBe(true);
                done();
            }, 200)
        });
    });
    describe('EJ2-39738', () => {
        let e: any = { preventDefault: function () { }, target: null };
        let autocompleteObj: any;
        let autocompleteEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'auto' });
        let countries: { [key: string]: Object; }[] = [
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
            document.body.appendChild(autocompleteEle);
        });
        afterAll(() => {
            autocompleteObj.destroy();
            autocompleteEle.remove();
        });
        it('Alt+Down shows no records found issue - testcase', (done) => {
            autocompleteObj = new AutoComplete({
                dataSource: countries,
                fields: { value: 'Name' },
                autofill : true,
            });
            autocompleteObj.appendTo(autocompleteEle);
            e.key = 'ArrowDown';
            e.keyCode = 40;
            e.action = 'open';
            e.ctrlKey = false;
            e.altKey = true;
            e.type = 'keydown'
            autocompleteObj.onFilterUp(e);
            setTimeout(() => {
                expect(autocompleteObj.isPopupOpen).toBe(true);
                expect(autocompleteObj.list.querySelectorAll('li').length).toBe(19);
                done();
            }, 300)
        });
    });
    // describe('EJ2-44588', () => {
    //     let e: any = { preventDefault: function () { }, target: null };
    //     let autocompleteObj: any;
    //     let autocompleteEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'auto' });
    //     let countries: { [key: string]: Object; }[] = [
    //         { Name: 'Australia', Code: 'AU' },
    //         { Name: 'Bermuda', Code: 'BM' },
    //         { Name: 'Canada', Code: 'CA' },
    //         { Name: 'Cameroon', Code: 'CM' },
    //         { Name: 'Denmark', Code: 'DK' },
    //         { Name: 'France', Code: 'FR' },
    //         { Name: 'Finland', Code: 'FI' },
    //         { Name: 'Germany', Code: 'DE' },
    //         { Name: 'Greenland', Code: 'GL' },
    //         { Name: 'Hong Kong', Code: 'HK' },
    //         { Name: 'India', Code: 'IN' },
    //         { Name: 'Italy', Code: 'IT' },
    //         { Name: 'Japan', Code: 'JP' },
    //         { Name: 'Mexico', Code: 'MX' },
    //         { Name: 'Norway', Code: 'NO' },
    //         { Name: 'Poland', Code: 'PL' },
    //         { Name: 'Switzerland', Code: 'CH' },
    //         { Name: 'United Kingdom', Code: 'GB' },
    //         { Name: 'United States', Code: 'US' }
    //     ];
    //     beforeAll(() => {
    //         document.body.appendChild(autocompleteEle);
    //         autocompleteObj = new AutoComplete({
    //             dataSource: countries,
    //             fields: { value: 'Name' },
    //             showPopupButton: true,
    //             created  : function(){
    //                 setTimeout(() => {
    //                   (autocompleteObj as any).refresh();
    //                 }, 1000);
    //           }
    //         });
    //         autocompleteObj.appendTo(autocompleteEle);
    //     });
    //     afterAll(() => {
    //             autocompleteObj.destroy();
    //     });
    //     it('Select item from list of calling refresh method', (done: Function) => {
    //         setTimeout(() => {
    //             mouseEventArgs.target = autocompleteObj.inputWrapper.buttons[0];
    //             autocompleteObj.dropDownClick(mouseEventArgs);
    //             done();
    //         }, 1500);
    //         mouseEventArgs.target = autocompleteObj.inputWrapper.buttons[0];
    //         autocompleteObj.dropDownClick(mouseEventArgs);
    //         mouseEventArgs.target = autocompleteObj.ulElement.querySelectorAll('li')[0];
    //         autocompleteObj.onMouseClick(mouseEventArgs);
    //         expect(autocompleteObj.inputElement.value).toBe("Australia");
    //     });
    // });
    describe('EJ2-45069- Highlight search with iconcss', () => {
        let atcObj: any;
        let atcObj1: any;
        let atcObj2: any;
        let e: any = { preventDefault: function () { }, target: null, type: null, action: 'down' };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let socialMedia: { [key: string]: Object }[] = [
            { class: 'sf-icon-facebook', country: 'Facebook' }, { class: 'sf-icon-twitter', country: 'Twitter ' },
            { class: 'sf-icon-whatsapp', country: 'WhatsApp' }, { class: 'sf-icon-tumblr', country: 'Tumblr' },
            { class: 'sf-icon-google-plus', country: 'Google plus' }, { class: 'sf-icon-skype-01', country: 'Skype' },
            { class: 'sf-icon-vimeo', country: 'Vimeo' }, { class: 'sf-icon-instagram', country: 'Instagram' },
            { class: 'sf-icon-youtube1', country: 'YouTube' }, { class: 'sf-icon-reddit', country: 'Reddit' }
        ];  
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            atcObj.destroy();
            atcObj1.destroy();
            atcObj2.destroy();
            element.remove();
            document.body.innerHTML = "";
        });
        it('highlight by StartsWith', () => {
            atcObj = new AutoComplete({
                dataSource: socialMedia,
                fields: { value: 'country', iconCss: 'class' },
                highlight: true
            });
            atcObj.appendTo(element);
            atcObj.filterType = 'StartsWith';
            atcObj.dataBind()
            e.keyCode = 70;
            atcObj.inputElement.value = 'F';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            let highlight: HTMLElement[] = atcObj.liCollections[0].querySelectorAll('.e-highlight');
            expect(highlight.length === 1).toBe(true);
        });
        it('highlight by EndsWith', () => {
            atcObj1 = new AutoComplete({
                dataSource: socialMedia,
                fields: { value: 'country', iconCss: 'class' },
                highlight: true
            });
            atcObj1.appendTo(element);
            atcObj1.filterType = 'EndsWith';
            atcObj1.dataBind()
            e.keyCode = 75;
            atcObj1.inputElement.value = 'k';
            atcObj1.onInput(e);
            atcObj1.onFilterUp(e);
            let highlight: HTMLElement[] = atcObj1.liCollections[0].querySelectorAll('.e-highlight');
            expect(highlight.length === 1).toBe(true);
        });
        it('highlight by Contains', () => {
            atcObj2 = new AutoComplete({
                dataSource: socialMedia,
                fields: { value: 'country', iconCss: 'class' },
                highlight: true
            });
            atcObj2.appendTo(element);
            atcObj2.filterType = 'Contains';
            atcObj2.dataBind()
            e.keyCode = 84;
            atcObj2.inputElement.value = 't';
            atcObj2.onInput(e);
            atcObj2.onFilterUp(e);
            let highlight: HTMLElement[] = atcObj2.liCollections[0].querySelectorAll('.e-highlight');
            expect(highlight.length === 3).toBe(true);
        });
    });
});
