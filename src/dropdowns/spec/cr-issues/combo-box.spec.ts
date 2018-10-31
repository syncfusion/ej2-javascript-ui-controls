/**
 * ComboBox spec document
 */
import { createElement, isVisible, isNullOrUndefined, Browser, EmitType, extend } from '@syncfusion/ej2-base';
import { ComboBox, CustomValueSpecifierEventArgs } from '../../src/combo-box/combo-box';
import { SelectEventArgs } from './../../src/drop-down-base/index';
import { ChangeEventArgs } from '../../src/drop-down-list/index'; 
import { FilteringEventArgs } from '../../src/drop-down-base';
import { DataManager, Query, ODataV4Adaptor, ODataAdaptor } from '@syncfusion/ej2-data';

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
describe('ComboBox', () => {
    describe('EJ2-10792 - Select and change event of angular triggers when we select or change in the combobox	', () => {
        let comboObj: any;
        let select: boolean = false;
        let change: boolean = false;
        let comboEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'combo' });
        let empList: { [key: string]: Object }[] = [
            { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
            { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
            { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
            { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
            { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
        ];
        beforeAll(() => {
            document.body.appendChild(comboEle);
            comboObj = new ComboBox({
                dataSource: empList,
                fields: { text: 'sports', value: 'id' },
            });
            comboObj.appendTo(comboEle);

            comboObj.inputElement.addEventListener("select", selectFunction);

            function selectFunction() {
                select = true;
            }

            comboObj.inputElement.addEventListener("change", changeFunction);

            function changeFunction() {
               change = true;
            }
        });
        afterAll(() => {
            comboObj.destroy();
            comboEle.remove();
        });

        it('check the select event is triggered for combobox', () => {
            var event = new Event('select');
            comboObj.inputElement.dispatchEvent(event);
            expect(select).toBe(false)
        });

        it('check the change event is triggered for combobox', () => {
            var event = new Event('change');
            comboObj.inputElement.dispatchEvent(event);
            expect(change).toBe(false);
        });
    });    
    
    describe('EJ2-12247 - Popupitems is not same as initially after filtering in combobox', () => {
        let comboObj: any;
        let comboEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'combo' });
        let originalTimeout: number;
        beforeAll(() => {

            jasmine.clock().install();
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

            document.body.appendChild(comboEle);
            comboObj = new ComboBox({
                dataSource: [],
                query: new Query().from('Customers').select(['ContactName', 'CustomerID']).take(25),
                fields: { text: 'ContactName', value: 'CustomerID' },              
                allowFiltering:true,
                filtering: (e: FilteringEventArgs) => {
                    let query: Query = new Query();
                    query = (e.text !== '') ? query.from('Customers').where('ContactName', 'startswith', e.text, true) : query;
                    e.updateData(comboObj.dataSource, query);
                }
            });
            comboObj.appendTo(comboEle);
        });
        afterAll(() => {
            jasmine.clock().uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            comboObj.destroy();
            comboEle.remove();
        });

        it('check whether the popup list is reset to initial list after clearing filtered items', () => {
            comboObj.dataSource= new DataManager({
                url: 'https://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc',
                adaptor: new ODataAdaptor,
                crossDomain: true
            });
            comboObj.dataBind();
            comboObj.actionComplete = function (e: any) {
                comboObj.focusIn();
                comboObj.showPopup();
                comboObj.inputElement.value = "a";
                let event: any = new Event('keyup');
                event.keyCode = 65;
                event.key = "a";
                comboObj.isValidKey = true;
                comboObj.onFilterUp(event);
                comboObj.inputElement.value = "";
                event.keyCode = 8;
                event.key = "Backspace";
                comboObj.isValidKey = true;
                comboObj.onFilterUp(event);
                expect(comboObj.list.querySelector("li").textContent).toBe("Ana Trujillo");
            }
            jasmine.clock().tick(3000);
        });
    });

    describe('EJ2-14483-key navigation is not working in combobox 	', () => {
        let comboObj: any;
        let select: boolean = false;
        let change: boolean = false;
        let comboEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'combo' });
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 74
        };
        let data: { [key: string]: Object }[] = [
            { text: 'Australia', id: 'AU' },
            { text: 'Bermuda', id: 'BM' },
            { text: 'Canada', id: 'CA' },
            { text: 'Cameroon', id: 'CM' },
            { text: 'Denmark', id: 'DK' },
            { text: 'France', id: 'FR' },
        ];
        beforeAll(() => {
            document.body.appendChild(comboEle);
            comboObj = new ComboBox({
                dataSource: data,
                fields: { text: 'text', value: 'id' },
                placeholder: 'Select a customer',
                popupHeight: '230px',
                allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query();
                    e.updateData(data, query, { text: 'text', value: 'id' });
                }
            });
            comboObj.appendTo(comboEle);
        });
        afterAll(() => {
            comboObj.destroy();
            comboEle.remove();
        });

        it('when passing fields in updateData', (done) => {
            comboObj.filterInput.value = "can";
            comboObj.onInput();
            comboObj.onFilterUp(keyEventArgs);
            setTimeout(() => {
                let liElement: any = comboObj.list.querySelector('[data-value="CA"]');
                expect(liElement).not.toBe(null);
                comboObj.setSelection(liElement);
                comboObj.hidePopup();
                expect(comboObj.value === 'CA').toBe(true);
                done();
            }, 800);
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
        let listObj: ComboBox;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('form', { id: 'form1' });
            element.innerHTML = `<input type="text" id="combobox">
            <input type="reset" id="resetForm"/>`;
            document.body.appendChild(element);
            listObj = new ComboBox({
                dataSource: data,
                fields: { text: "text", value: "id" },
                value: 'list1'
            });
            listObj.appendTo('#combobox');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it(' reset the form', (done) => {
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
        let listObj: ComboBox;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('form', { id: 'form1' });
            element.innerHTML = `<input type="text" id="ComboBox">
            <div id="dynamic"></div>`;
            document.body.appendChild(element);
            let dynamicEle: HTMLElement = document.getElementById('dynamic');
            let form2: Element = createElement('form');
            form2.id = 'form2';
            form2.innerHTML = '<input id="tempInput" type="text"/> <input type="reset" id="resetForm"/>';
            dynamicEle.appendChild(form2);
            listObj = new ComboBox({
                dataSource: data,
                fields: { text: "text", value: "id" },
                value: 'list1'
            });
            listObj.appendTo('#ComboBox');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it(' reset the form', (done) => {
            let input: HTMLInputElement = document.getElementById("tempInput") as HTMLInputElement;
            input.value = "test";
            document.getElementById('resetForm').click();
            setTimeout(() => {
                expect(listObj.value === 'list1').toBe(true);
                expect(input.value === '').toBe(true);
                done();
            })
        });
    });
    describe('EJ2-17694 - Multiple time ajax request while change the dataSource ', () => {
        let listObj: any;
        let controlEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'auto' });
        let result: any = [];
        beforeAll((done) => {
            document.body.appendChild(controlEle);
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
            listObj.destroy();
            controlEle.remove();
            jasmine.Ajax.uninstall();
        });
        it('change the dataSource dynamically ', (done) => {
            let count: number = 0;
            listObj = new ComboBox({
                fields: { value: 'CustomerID' },
                placeholder: 'Select a name',
                actionComplete: () => {
                    count++;
                }
            });
            listObj.appendTo(controlEle);
            listObj.focusIn();
            listObj.inputElement.value = "a";
            let event: any = new Event('keyup');
            event.keyCode = 72;
            listObj.isValidKey = true;
            listObj.onFilterUp(event);
            setTimeout(() => {
                expect(listObj.list.classList.contains('e-nodata')).toBe(true);
                listObj.hidePopup();
                count = 0;
                setTimeout(() => {
                    listObj.dataSource = result;
                    listObj.query = new Query().take(3);
                    listObj.dataBind();
                    expect(count === 1).toBe(true);
                    done();
                }, 400);
            }, 400);
        });
    });

    describe('EJ2-17113-check clear button-enabled readonly', () => {
        let comboEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ComboBox' });
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' }
        ];
        let listObj: any;
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(comboEle);
            listObj = new ComboBox({
                dataSource: data,
                fields: { text: "text", value: "id" },
                value: 'list1',
                readonly: true
            });
            listObj.appendTo('#ComboBox');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('enabled read only', () => {
            mouseEventArgs.target = listObj.inputWrapper.buttons[0];
            listObj.dropDownClick(mouseEventArgs);
            expect(listObj.inputWrapper.clearButton.classList.contains('e-clear-icon-hide')).toBe(true);
        });
        it('disabled read only', () => {
            listObj.readonly = false;
            listObj.dataBind();
            mouseEventArgs.target = listObj.inputWrapper.buttons[0];
            listObj.dropDownClick(mouseEventArgs);
            expect(listObj.inputWrapper.clearButton.classList.contains('e-clear-icon-hide')).not.toBe(true);
        });
    });

});
