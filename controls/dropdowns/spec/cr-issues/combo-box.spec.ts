/**
 * ComboBox spec document
 */
import { createElement, isVisible, isNullOrUndefined, Browser, EmitType, extend } from '@syncfusion/ej2-base';
import { ComboBox, CustomValueSpecifierEventArgs } from '../../src/combo-box/combo-box';
import { SelectEventArgs } from './../../src/drop-down-base/index';
import { ChangeEventArgs } from '../../src/drop-down-list/index'; 
import { FilteringEventArgs } from '../../src/drop-down-base';
import { DataManager, Query, WebApiAdaptor, ODataAdaptor } from '@syncfusion/ej2-data';

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
            comboObj.onInput(keyEventArgs);
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
    describe('EJ2-26008-The combobox is not focused when click the tab key at single time', () => {
        let comboObj: any;
        let comboEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'combo' });
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
        it('Remove tabindex attribute in wrapper element', () => {
            expect(comboObj.inputWrapper.container.hasAttribute('tabindex')).toBe(false);
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
                expect(listObj.value === 'list1').toBe(true);
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

    describe('EJ2-20519- Change event not trigger when focus out the control using tab key', () => {
        let comboEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ComboBox' });
        let data: { [key: string]: Object }[] = [
            { id: 'level1', country: 'American Football' }, { id: 'level2', country: 'Badminton' },
            { id: 'level3', country: 'Basketball' }, { id: 'level4', country: 'Cricket' },
            { id: 'level5', country: 'Football' }, { id: 'level6', country: 'Golf' },
            { id: 'level7', country: 'Hockey' }, { id: 'level8', country: 'Rugby' },
            { id: 'level9', country: 'Snooker' }, { id: 'level10', country: 'Tennis' },
        ];
        let listObj: ComboBox;
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
            document.body.appendChild(comboEle);
            listObj = new ComboBox({
                dataSource: data,
                fields: { text: 'country', value: 'id' }
            });
            listObj.appendTo('#ComboBox');
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            document.body.innerHTML = '';
        });
        it('Check the value selection', (done) => {
            listObj.focusIn();
            (<any>listObj).inputElement.value = 'Cricket';
            listObj.showPopup();
            listObj.change = function (args) {
               // expect(args.value).toBe('level4');
                done();
            };
            listObj.focusOut();
        });
		// it('Check the value selection', (done) => {
        //     listObj.focusIn();
        //     (<any>listObj).inputElement.value = 'Cr';
        //     listObj.showPopup();
        //     listObj.change = function (args) {
        //         expect(args.value).toBe('Cr');
        //         done();
        //     };
        //     listObj.focusOut();
        // });
    });

    describe('template item not generate', () => {
        let element: HTMLInputElement;
        let listObj: any;
        let popup: HTMLElement;
        let liEle: HTMLElement;
        let divNode: HTMLDivElement;
        let textContent: string;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 74
        };
        let empList: { [key: string]: Object }[] = [
            { Name: 'Andrew Fuller', Eimg: '7', Designation: 'Team Lead', Country: 'England' },
            { Name: 'Anne Dodsworth', Eimg: '1', Designation: 'Developer', Country: 'USA' },
            { Name: 'Janet Leverling', Eimg: '3', Designation: 'HR', Country: 'USA' },
            { Name: 'Laura Callahan', Eimg: '2', Designation: 'Product Manager', Country: 'USA' },
            { Name: 'Margaret Peacock', Eimg: '6', Designation: 'Developer', Country: 'USA' },
            { Name: 'Michael Suyama', Eimg: '9', Designation: 'Team Lead', Country: 'USA' },
            { Name: '111Nancy Davolio', Eimg: '4', Designation: 'hahahProduct Manager111', Country: 'USA11' },
            { Name: 'Robert King', Eimg: '8', Designation: 'Developer ', Country: 'England' },
            { Name: 'Steven Buchanan', Eimg: '10', Designation: 'CEO', Country: 'England' }
        ];
        beforeAll(() => {
            
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
            listObj = new ComboBox({
                dataSource: empList,
                allowFiltering: true,
                fields: { text: 'Name', value: 'Eimg' },
                itemTemplate: '<div class="ename"> ${Name}</div><div class="job"> ${Designation} </div>',
                valueTemplate: '<div class="name" style="display:inline;"> ${Name} </div>'
            });
            listObj.appendTo(element);
        });
        it('tempalte data filtering', () => {
            listObj.filterInput.value = "a";
            listObj.onInput(keyEventArgs);
            listObj.onFilterUp(keyEventArgs);
            expect(((listObj as any).ulElement.querySelector('li').firstElementChild as HTMLElement).innerText === 'Andrew Fuller').toBe(true);
                
        });
        it('empty data filtering', () => {
            listObj.filterInput.value = "";
            listObj.onInput(keyEventArgs);
            listObj.onFilterUp(keyEventArgs); 
            let liElement = listObj.list.querySelectorAll('li');
            expect(liElement.length === listObj.dataSource.length).toBe(true);
            expect((liElement[0].firstElementChild as HTMLElement).innerText === 'Andrew Fuller' ).toBe(true);
               
        }); 
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
    });
    describe('EJ2-25867- list not generated properly', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let comboObj: any;
        let activeElement: HTMLElement[];
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let data: string[] = ['Badminton', 'Basketball', 'Golf', 'Football', 'Rugby'];
        beforeAll(() => {
            document.body.appendChild(element);
            comboObj = new ComboBox({
                dataSource: data, 
                allowFiltering: true
            });
            comboObj.appendTo(element);
        });
        afterAll(() => {
            comboObj.destroy();
            element.remove();
        });

        it('while clear the value using clear button', (done) => {
            comboObj.showPopup();
            comboObj.filterInput.value = 'b';
            keyEventArgs.keyCode = 67;
            comboObj.onInput(keyEventArgs);
            comboObj.onFilterUp(keyEventArgs);
            setTimeout(() => {
                let item: HTMLElement[] = comboObj.popupObj.element.querySelectorAll('li');
                expect(item.length === 2).toBe(true);
                mouseEventArgs.target = item[0];
                mouseEventArgs.type = 'click';
                comboObj.onMouseClick(mouseEventArgs);
                expect(comboObj.value === 'Badminton').toBe(true);
                comboObj.clear();
                comboObj.showPopup();
                item = comboObj.popupObj.element.querySelectorAll('li');
                expect(item.length === 5).toBe(true); 
                done(); 
            }, 400);
        });
    });
    describe('EJ2-26010- Change the readonly API', () => {
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
                readonly: true,
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

        it('value as false from true, search items not displayed ', (done) => {
            comboObj.readonly = false;
            comboObj.dataBind();
            comboObj.filterInput.value = "can";
            comboObj.onInput(keyEventArgs);
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

    describe('EJ2-36607 - isInteracted not updated in change event', () => {
        let element: HTMLInputElement;
        let empList: { [key: string]: Object }[] = [
            { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
            { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
            { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
            { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
            { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
        ];
        let ddl: ComboBox;
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'up', keyCode: 70 };
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            document.body.innerHTML = '';
        });
        it('when press tab key in change event ', (done) => {
            ddl = new ComboBox({
                dataSource: empList,
                fields: { text: 'sports', value: 'id' },
                popupHeight: '300px',
                autofill: true,
                allowCustom:true,
                change: (args: ChangeEventArgs): void => {
                    //expect(args.isInteracted).toBe(true);
                    done();
                },
                open: (): void => {
                    keyEventArgs.action = 'tab';
                    (<any>ddl).keyActionHandler(keyEventArgs);
                    keyEventArgs.action = 'tab';
                    (<any>ddl).keyActionHandler(keyEventArgs);
                    setTimeout((): void => {
                        (ddl as any).focusOut();
                    }, 300);
                }
            });
            ddl.appendTo(element);
            ddl.focusIn();
            (<any>ddl).inputElement.value = 'f';
            //expect((<any>ddl).value == null).toBe(true);
            (<any>ddl).isValidKey = true;
            (<any>ddl).onFilterUp(keyEventArgs);
        });
    });

    describe('EJ2-26477- dropdown popup closed suddenly. ', () => {
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
                readonly: true,
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

        it(' when filtering second time', (done) => {
            comboObj.readonly = false;
            comboObj.dataBind();
            comboObj.filterInput.value = "can";
            comboObj.onInput(keyEventArgs);
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
    
    describe('Filtering API', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let listObj: any;
        let e: any = { preventDefault: function () { }, target: null };
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ComboBox({
                dataSource: data, fields: { text: 'text', value: 'id' }, allowFiltering: true,
                popupHeight: '100px',
                filterType: 'StartsWith'
            });
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it(' check the filter', () => {
            listObj.showPopup();
            listObj.filterInput.value = 'java';
            e.keyCode = 72;
            listObj.onInput(e);
            listObj.onFilterUp(e);
            expect(listObj.liCollections[0].getAttribute('data-value') === 'list1').toBe(true);
            listObj.filterType = 'Contains';
            listObj.dataBind();
            listObj.filterInput.value = 'o';
            e.keyCode = 72;
            listObj.onInput(e);
            listObj.onFilterUp(e);
            expect(listObj.liCollections.length >1).toBe(true);
            listObj.filterType = 'EndsWith';   
            listObj.dataBind();
            listObj.filterInput.value = 'n';
            e.keyCode = 72;
            listObj.onInput(e);
            listObj.onFilterUp(e);
            expect(listObj.liCollections.length >=1).toBe(true);
        });
    });

    describe('EJ2-39943', () => {
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
            let comboEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ComboBox' });
            document.body.appendChild(comboEle);
            listObj = new ComboBox({
                dataSource: data,
                fields: { text: "text", value: "id" },
                autofill: true,
                select: (e: SelectEventArgs): void => {
                    expect(e.isInteracted).toBe(true);
                }
            });
            listObj.appendTo('#ComboBox');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('while entering any character and select that value from the list select event is not fired when autofill is enabled', () => {
            listObj.focusIn();
            listObj.showPopup();
            listObj.inputElement.value = "j";
            let event: any = new Event('keyup');
            event.keyCode = 74;
            event.key = "j";
            listObj.isValidKey = true;
            listObj.onFilterUp(event);
            let item: Element[] = listObj.popupObj.element.querySelectorAll('li')[0];
            mouseEventArgs.target = item;
            mouseEventArgs.type = 'click';
        });
    });
    describe('EJ2-44588', () => {
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
            let comboEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ComboBox' });
            document.body.appendChild(comboEle);
            listObj = new ComboBox({
                dataSource: data,
                fields: { text: "text", value: "id" },
                created  : function(){
                    setTimeout(() => {
                      (listObj as any).refresh();
                    }, 400);
              }
            });
            listObj.appendTo('#ComboBox');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Select item from list of calling refresh method', (done) => {
            setTimeout(() => {
                mouseEventArgs.target = listObj.inputWrapper.buttons[0];
                listObj.dropDownClick(mouseEventArgs);
                done();
            }, 800);
            mouseEventArgs.target = listObj.inputWrapper.buttons[0];
            listObj.dropDownClick(mouseEventArgs);
            mouseEventArgs.target = listObj.ulElement.querySelectorAll('li')[0];
            listObj.onMouseClick(mouseEventArgs);
            expect(listObj.inputElement.value).toBe("JAVA");
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
            listObj = new ComboBox();
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
            listObj.value = '';
            listObj.dataBind();
            setTimeout(() => {
                expect(listObj.inputElement.value).toBe('Empty');
                expect(listObj.value).toBe('');
                expect(listObj.text).toBe('Empty');
                done();
            }, 450);
        });
        it('open popup and select the empty value item from the list', (done) => {
            listObj.showPopup();
            mouseEventArgs.target = listObj.ulElement.querySelectorAll('li')[1];
            mouseEventArgs.type = 'click';
            listObj.onMouseClick(mouseEventArgs);
            setTimeout(() => {
                expect(listObj.inputElement.value).toBe('Empty');
                expect(listObj.value).toBe('');
                expect(listObj.text).toBe('Empty');
                done();
            }, 450);
        });
    });
    describe('EJ2-45039', () => {
        let keyboardEventArgs = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            keyCode: 22,
        };
        let buttonEle: any;
        let dynamicDataSource: { [key: string]: Object }[] = [
            { Name: "Germany", Code: "DE" },
            { Name: "Greenland", Code: "GL" },
            { Name: "Hong Kong", Code: "HK" },
            { Name: "India", Code: "IN" },
            { Name: "Italy", Code: "IT" },
            { Name: "Japan", Code: "JP" },
            { Name: "Mexico", Code: "MX" },
            { Name: "Norway", Code: "NO" },
            { Name: "Poland", Code: "PL" },
            { Name: "Switzerland", Code: "CH" },
            { Name: "United Kingdom", Code: "GB" },
            { Name: "United States", Code: "US" }
          ];
          let data: { [key: string]: Object }[] = [
              { Name: "Australia", Code: "AU" },
              { Name: "Bermuda", Code: "BM" },
              { Name: "Canada", Code: "CA" },
              { Name: "Cameroon", Code: "CM" },
              { Name: "Denmark", Code: "DK" },
              { Name: "France", Code: "FR" },
              { Name: "Finland", Code: "FI" }
            ];
        let listObj: any;
        let listObj1: any;
        beforeAll(() => {
            let comboEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ComboBox' });
            document.body.appendChild(comboEle);
            buttonEle= createElement('button',{id: 'changedata'});
            document.body.appendChild(buttonEle);
        });
        afterAll(() => {
            if (listObj) {
                listObj.destroy();
            }
            if (listObj1) {
                listObj1.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Changing datasource in filtering event causes input element value is empty', () => {
            listObj = new ComboBox({
                dataSource: data,
                fields: { text: "Name", value: "Code" },
                sortOrder: 'Ascending',
                width: '250px',
                popupHeight: '200px',
                popupWidth: '250px',
                allowFiltering: true,
                filtering: (e) => {
                    if (listObj.dataSource == dynamicDataSource) {
                        listObj.dataSource = data;
                    } else {
                        listObj.dataSource = dynamicDataSource;
                    }
                    listObj.dataBind();
                    expect((listObj as any).inputElement.value !== "").toBe(true);
                }
            });
            listObj.appendTo('#ComboBox');
            (listObj as any).inputElement.value = "a";
            keyboardEventArgs.keyCode = 65;
            (listObj as any).isValidKey = true;
            (listObj as any).onFilterUp(keyboardEventArgs);
        });
        it('Changing datasource dynamically should not change value property', () => {
            listObj1 = new ComboBox({
                dataSource: data,
                fields: { text: "Name", value: "Code" },
                sortOrder: 'Ascending',
                value: "AU",
                width: '250px',
                popupHeight: '200px',
                popupWidth: '250px',
                allowFiltering: true,
            });
            listObj1.appendTo('#ComboBox');
            buttonEle.onclick = ()=> {
                if (listObj1.dataSource == dynamicDataSource) {
                    listObj1.dataSource = data;
                } else {
                    listObj1.dataSource = dynamicDataSource;
                }
                listObj1.dataBind();
                expect(listObj1.value).toBe("AU");
            }
            buttonEle.click();
        });
    });
    describe('EJ2-45854- Null exception when destroy the component', () => {
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' }
        ];
        let comboObj: any;
        beforeAll(() => {
            let comboEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ComboBox' });
            document.body.appendChild(comboEle);
            comboObj = new ComboBox({
                dataSource: data,
                fields: { text: "text", value: "id" },
            });
            comboObj.appendTo('#ComboBox');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Select item from list of calling refresh method', () => {
            comboObj.inputElement = undefined;
            comboObj.destroy();
            expect(comboObj.inputWrapper === null).toBe(true)
        });
    });
});
