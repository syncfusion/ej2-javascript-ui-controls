/**
 * Dropdownlist spec document
 */
import { EmitType, Browser, createElement, isNullOrUndefined, setCulture, L10n, extend } from '@syncfusion/ej2-base';
import { DropDownBase, FilteringEventArgs, dropDownBaseClasses } from '../../src/drop-down-base/drop-down-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';
import { DataManager, ODataV4Adaptor, ODataAdaptor, Query, WebApiAdaptor, Predicate } from '@syncfusion/ej2-data';
import { isCollide } from '@syncfusion/ej2-popups';
import '../../node_modules/es6-promise/dist/es6-promise';

let templateDataSource: { [key: string]: Object }[] = [
    { Name: 'Andrew Fuller', Eimg: '7', Designation: 'Team Lead', Country: 'England' },
    { Name: 'Anne Dodsworth', Eimg: '1', Designation: 'Developer', Country: 'USA' },
    { Name: 'Janet Leverling', Eimg: '3', Designation: 'HR', Country: 'USA' },
    { Name: 'Laura Callahan', Eimg: '2', Designation: 'Product Manager', Country: 'USA' },
    { Name: 'Margaret Peacock', Eimg: '6', Designation: 'Developer', Country: 'USA' },
    { Name: 'Michael Suyama', Eimg: '9', Designation: 'Team Lead', Country: 'USA' },
    { Name: 'Nancy Davolio', Eimg: '4', Designation: 'Product Manager', Country: 'USA' },
    { Name: 'Robert King', Eimg: '8', Designation: 'Developer ', Country: 'England' },
    { Name: 'Steven Buchanan', Eimg: '10', Designation: 'CEO', Country: 'England' }
];

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
describe('DropDownList', () => {
    let css: string = ".e-spinner-pane::after { content: 'Material'; display: none;} ";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);

    // template supports
    describe('Template support Issue EJ2-9023', () => {
        let element: HTMLInputElement;
        let listObj: DropDownList;
        let popup: HTMLElement;
        let liEle: HTMLElement;
        let divNode: HTMLDivElement;
        let textContent: string;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: templateDataSource,
                fields: { text: 'Name', value: 'Eimg' },
                popupHeight: "200px",
                allowFiltering: true,
                headerTemplate: '<div class="header"> <span>Photo</span> <span class="info">Employee Info</span></div>',
                // set the template content for list items
                itemTemplate: '<div><img class="empImage"' +
                    ' src="http://npmci.syncfusion.com/development/demos/src/combobox/Employees/${Eimg}.png"' +
                    'alt="employee"/>' +
                    '<div class="ename"> ${Name} </div><div class="job"> ${Designation} </div></div>',
            });
            listObj.appendTo(element);
        });
        it("Items values", function () {
            listObj.open = function (args) {
                popup = document.getElementById('dropdownlist_popup');
                liEle = popup.querySelector('li');
                divNode = liEle.querySelectorAll("div.ename")[0] as HTMLDivElement;
                textContent = divNode.innerText;
                expect(textContent).toEqual('Andrew Fuller');
                listObj.hidePopup();
                // listObj.open = null;
            };
            listObj.close = function (args) {
                listObj.close = null;
            };
            listObj.showPopup();
        });
        it("Items Recheck values", function () {
            listObj.open = function (args) {
                popup = document.getElementById('dropdownlist_popup');
                liEle = popup.querySelector('li');
                divNode = liEle.querySelectorAll("div.ename")[0] as HTMLDivElement;
                textContent = divNode.innerText;
                expect(textContent).toEqual('Andrew Fuller');
                listObj.hidePopup();
                listObj.open = null;
            };
            listObj.close = function (args) {
                listObj.close = null;
            };
            listObj.showPopup();
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });

    });
    describe('EJ2-10838 - Change event trigger while component initial render with empty and then set the data at any action', () => {
        let ddlObj: any;
        let isfocused: boolean = false;
        let ddlEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl', attrs: { autofocus: 'autofocus' } });
        let empList: { [key: string]: Object }[] = [
            { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
            { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
            { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
            { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
            { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
        ];
        beforeAll(() => {
            document.body.appendChild(ddlEle);
            ddlObj = new DropDownList({
                dataSource: empList,
                fields: { text: 'sports', value: 'id' },
                focus: function () {
                    isfocused = true;
                }
            });
            ddlObj.appendTo(ddlEle);
        });
        afterAll(() => {
            ddlObj.destroy();
            ddlEle.remove();
        });

        it('EJ2-10873 - check whether the autofocus is applied', () => {
            expect(isfocused).toBe(true);
        });

        it('EJ2-10838  - check whether the previous and value are same during render', () => {
            expect(ddlObj.previousValue === ddlObj.value).toBe(true)
        });
    });
    describe('EJ2-11038 - Value set through ngModel is not maintained after changing dataSource.', () => {
        let ddlObj: any;
        let ddlEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl' });
        let empList: { [key: string]: Object }[] = [
            { Id: 'Game1', Game: 'American Football' },
            { Id: 'Game2', Game: 'Badminton' },
            { Id: 'Game3', Game: 'Basketball' },
            { Id: 'Game4', Game: 'Cricket' },
            { Id: 'Game5', Game: 'Football' }

        ];
        beforeAll(() => {
            document.body.appendChild(ddlEle);
            ddlObj = new DropDownList({
                dataSource: empList,
                fields: { text: 'Game', value: 'Id' },
                value: "Game3"
            });
            ddlObj.appendTo(ddlEle);
        });
        afterAll(() => {
            ddlObj.destroy();
            ddlEle.remove();
        });

        it('check whether the value is maintained after updating the datasource', () => {
            ddlObj.dataSource = [
                { Id: 'Game3', Game: 'Golf' },
                { Id: 'Game4', Game: 'Hockey' },
                { Id: 'Game5', Game: 'Rugby' },
                { Id: 'Game6', Game: 'Snooker' },
                { Id: 'Game7', Game: 'Tennis' }];
            ddlObj.dataBind();
            expect(ddlObj.value).toBe("Game3");
            expect(ddlObj.text).toBe("Golf");
            expect(ddlObj.inputElement.value).toBe("Golf");
        });
        it('check whether the value is not maintained after updating the different datasource', () => {
            ddlObj.dataSource = [
                { Id: 'Game6', Game: 'Golf' },
                { Id: 'Game7', Game: 'Hockey' },
                { Id: 'Game8', Game: 'Rugby' },
                { Id: 'Game9', Game: 'Snooker' },
                { Id: 'Game10', Game: 'Tennis' }];
            ddlObj.dataBind();
            expect(ddlObj.value).toBe(null);
            expect(ddlObj.text).toBe(null);
            expect(ddlObj.inputElement.value).toBe('');
        });
    });
    describe('EJ2-11073 - Change event is not triggered when clicking showClearButton in dropdown components.', () => {
        let ddlObj: any;
        let isChangeCalled: boolean = false;
        let ddlEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl' });
        let empList: { [key: string]: Object }[] = [
            { Id: 'Game1', Game: 'American Football' },
            { Id: 'Game2', Game: 'Badminton' },
            { Id: 'Game3', Game: 'Basketball' },
            { Id: 'Game4', Game: 'Cricket' },
            { Id: 'Game5', Game: 'Football' }

        ];
        beforeAll(() => {
            document.body.appendChild(ddlEle);
            ddlObj = new DropDownList({
                dataSource: empList,
                fields: { text: 'Game', value: 'Id' },
                value: "Game3",
                showClearButton: true,
                change: function () {
                    isChangeCalled = true;
                }
            });
            ddlObj.appendTo(ddlEle);
        });
        afterAll(() => {
            ddlObj.destroy();
            ddlEle.remove();
        });

        it('check whether the change event is triggered when selected item is removed using clear icons ', () => {
            ddlObj.focusIn();
            var event = new Event('mousedown');
            ddlObj.inputWrapper.clearButton.dispatchEvent(event);
            expect(isChangeCalled).toBe(true);
        });
    });

    describe('EJ2-14939 - CssClass applied to the DropDown element is not removed when it is changes dynamically', () => {
        let ddlObj: any;
        let ddlEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl' });
        let empList: { [key: string]: Object }[] = [
            { Id: 'Game1', Game: 'American Football' },
            { Id: 'Game2', Game: 'Badminton' },
            { Id: 'Game3', Game: 'Basketball' },
            { Id: 'Game4', Game: 'Cricket' },
            { Id: 'Game5', Game: 'Football' }
        ];
        beforeAll(() => {
            document.body.appendChild(ddlEle);
            ddlObj = new DropDownList({
                dataSource: empList,
                fields: { text: 'Game', value: 'Id' },
                cssClass: 'abc'
            });
            ddlObj.appendTo(ddlEle);
        });
        afterAll(() => {
            ddlObj.destroy();
            ddlEle.remove();
        });

        it('check whether the change cssclass dynamically', () => {
            expect(ddlObj.inputWrapper.container.classList.contains('abc')).toBe(true);
            ddlObj.cssClass = 'dce';
            ddlObj.dataBind();
            expect(ddlObj.inputWrapper.container.classList.contains('abc')).not.toBe(true);
            expect(ddlObj.inputWrapper.container.classList.contains('dce')).toBe(true);
        });
    });
    describe('EJ2-15393 - Multiple requests are made to server', () => {
        let listObj: any;
        let popupObj: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });

        let dataSource = new DataManager({
            url: 'https://services.syncfusion.com/js/production/api/Employees',
            adaptor: new WebApiAdaptor,
            crossDomain: true
        });
        let query = new Query().select('FirstName').take(0).requiresCount();
        let query1 = new Query().select('FirstName').take(3).requiresCount();
        let originalTimeout: number;
        beforeEach(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 8000;
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: dataSource,
                query: query,
                fields: { text: 'FirstName', value: 'FirstName' },
                actionComplete: (e: any) => {
                    expect(e.name === 'actionComplete').toBe(true);
                }
            });
            listObj.appendTo(element);
        });
        afterEach(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        // it('when "no records" template is added to the dropdownlist', (done) => { 
        //     setTimeout(function () {
        //         listObj.showPopup();
        //     }, 200);
        //     setTimeout(() => {
        //         expect(listObj.list.classList.contains('e-nodata')).toBe(true);
        //         expect(listObj.isDataFetched).toBe(true);
        //         listObj.hidePopup();
        //         listObj.showPopup();
        //         expect(listObj.list.classList.contains('e-nodata')).toBe(true);
        //         expect(listObj.isDataFetched).toBe(true);
        //         done();
        //     }, 4000);
        // });
        it('dynamic change datascource ', (done) => {
            listObj.hidePopup();
            listObj.dataSource = dataSource;
            listObj.query = query1;
            listObj.dataBind();
            setTimeout(function () {
                listObj.showPopup();
            }, 200);
            setTimeout(() => {
                if (listObj.liCollections.length > 0) {
                    expect(listObj.list.classList.contains('e-nodata')).not.toBe(true);
                }
                expect(listObj.isDataFetched).not.toBe(true);
                if (listObj && listObj.listData) {
                    expect(listObj.listData.length === 3).toBe(true);
                }
                done();
            }, 4000);
        });
        // it('set empty datasource ', (done) => {
        //     listObj.hidePopup();
        //     listObj.dataSource = dataSource;
        //     listObj.query = query;
        //     listObj.dataBind();
        //     listObj.showPopup();
        //     setTimeout(() => {
        //         expect(listObj.list.classList.contains('e-nodata')).toBe(true);
        //         expect(listObj.isDataFetched).toBe(true);
        //         listObj.hidePopup();
        //         listObj.showPopup();
        //         expect(listObj.list.classList.contains('e-nodata')).toBe(true);
        //         expect(listObj.isDataFetched).toBe(true);
        //         done();
        //     }, 4000);
        // });
        it('set null datasource ', (done) => {
            listObj.hidePopup();
            listObj.dataSource = null;
            listObj.query = null;
            listObj.dataBind();
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.list.classList.contains('e-nodata')).toBe(true); 
                done();
            }, 2000);
        });
    });
    describe('EJ2-26552 - Defult value maintained in from reset', () => {
        let element: HTMLInputElement;
        let data: ['American Football', 'Cricket', 'FootBall', 'Hockey', 'BasketBall'];
        let listObj: DropDownList;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('form', { id: 'form1' });
            element.innerHTML = `<input type="text" id="ddl">
            <input type="reset" id="resetForm"/>`;
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: data,
                value: 'American Football',
                allowFiltering: true
            });
            listObj.appendTo('#ddl');
            listObj.showPopup();
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('reset the form', (done) => {
            document.getElementById('resetForm').click();
            setTimeout(() => {
                expect(listObj.value === 'American Football').toBe(true);
                done();
            });
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
        let listObj: DropDownList;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('form', { id: 'form1' });
            element.innerHTML = `<input type="text" id="ddl">
            <input type="reset" id="resetForm"/>`;
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: data,
                fields: { text: "text", value: "id" },
                value: 'list1'
            });
            listObj.appendTo('#ddl');
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
        let listObj: DropDownList;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('form', { id: 'form1' });
            element.innerHTML = `<input type="text" id="DropDownList">
            <div id="dynamic"></div>`;
            document.body.appendChild(element);
            let dynamicEle: HTMLElement = document.getElementById('dynamic');
            let form2: Element = createElement('form');
            form2.id = 'form2';
            form2.innerHTML = '<input id="tempInput" type="text"/> <input type="reset" id="resetForm"/>';
            dynamicEle.appendChild(form2);
            listObj = new DropDownList({
                dataSource: data,
                fields: { text: "text", value: "id" },
                value: 'list1'
            });
            listObj.appendTo('#DropDownList');
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

    describe('EJ2-27976 - Dynamic filtering issue', () => {
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 74,
            metaKey: false
        };
        let listObj: any;
        let element: HTMLSelectElement;
        beforeAll(() => {
            element = <HTMLSelectElement>createElement('select', { id: 'list' });
            element.innerHTML = `<option value="0">American Football</option>
            <option value="1">Badminton</option>
            <option value="2">Basketball</option>
            <option value="3">Cricket</option>
            <option value="4">Football</option>
            <option value="5">Golf</option>
            <option value="6">Hockey</option>
            <option value="7">Rugby</option>
            <option value="8">Snooker</option>
            <option value="9">Tennis</option>`;
            document.body.appendChild(element);
            listObj = new DropDownList({
            });
            listObj.appendTo(element);
            listObj.allowFiltering = true
            listObj.dataBind();
            listObj.showPopup();
        });
        afterAll(() => {
            if (element) { element.remove(); };
            document.body.innerHTML = '';
        });

        it('filter a suggestion list with select element', () => {
            listObj.filterInput.value = "C";
            listObj.onInput(keyEventArgs);
            listObj.onFilterUp(keyEventArgs);
            let element = document.querySelector(".e-list-parent");
            expect(element.childNodes[0].textContent === 'Cricket').toBe(true);
            let li: any = listObj.list.getElementsByClassName('e-list-item');
            let len: number = listObj.list.getElementsByClassName('e-list-item').length;
            li[0].click();
            listObj.hidePopup();
            let len2: number = listObj.list.getElementsByClassName('e-list-item').length;
            expect(len === len2 ).toBe(true);
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
            listObj = new DropDownList({
                fields: { text: 'CustomerID', value: "OrderID" },
                placeholder: 'Select a name',
                actionComplete: () => {
                    count++;
                }
            });
            listObj.appendTo(controlEle);
            listObj.focusIn();
            listObj.showPopup();
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
    describe('focus event', () => {
        let listObj: any;
        let popupObj: any;
        let data: string[] = ['JAVA', 'C#']
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new DropDownList({
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
        it('focus the dropdown', () => {
            expect(listObj.inputWrapper.container).not.toBe(null);
            mouseEventArgs.target = listObj.inputWrapper.container;
            listObj.dropDownClick(mouseEventArgs);
        });
    });

    describe(' dynamic datasource changes', () => {
        let element: HTMLInputElement;
        let listObj: DropDownList;
        let popup: HTMLElement;
        let liEle: HTMLElement;
        let divNode: HTMLDivElement;
        let textContent: string;
        let empList: { [key: string]: Object }[] = [
            { Name: 'Andrew Fuller', Eimg: '7', Designation: 'Team Lead', Country: 'England' },
            { Name: 'Anne Dodsworth', Eimg: '1', Designation: 'Developer', Country: 'USA' },
            { Name: 'Janet Leverling', Eimg: '3', Designation: 'HR', Country: 'USA' },
            { Name: 'Laura Callahan', Eimg: '2', Designation: 'Product Manager', Country: 'USA' },
            { Name: 'Margaret Peacock', Eimg: '6', Designation: 'Developer', Country: 'USA' },
            { Name: 'Michael Suyama', Eimg: '9', Designation: 'Team Lead', Country: 'USA' },
            { Name: 'Nancy Davolio', Eimg: '4', Designation: 'Product Manager', Country: 'USA' },
            { Name: 'Robert King', Eimg: '8', Designation: 'Developer ', Country: 'England' },
            { Name: 'Steven Buchanan', Eimg: '10', Designation: 'CEO', Country: 'England' }
        ];
        let changeData: any = [
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
            listObj = new DropDownList({
                dataSource: empList,
                fields: { text: 'Name', value: 'Eimg' },
                itemTemplate: '<div class="ename"> ${Name}</div><div class="job"> ${Designation} </div>',
                valueTemplate: '<div class="name" style="display:inline;"> ${Name} </div>',
                value: '4',
            });
            listObj.appendTo(element);
        });
        it("value template changes", function () {
            expect(listObj.value === '4').toBe(true);
            expect(listObj.text === 'Nancy Davolio').toBe(true);
            listObj.dataSource = changeData;
            listObj.dataBind();
            expect(listObj.value === '4').toBe(true);
            expect(listObj.text === '111Nancy Davolio').toBe(true);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
    }); 
    describe('template item not generate', () => {
        let element: HTMLInputElement;
        let listObj: DropDownList;
        let popup: HTMLElement;
        let liEle: HTMLElement;
        let divNode: HTMLDivElement;
        let textContent: string;
        let empList: { [key: string]: Object }[] = [
            { Name: 'Andrew Fuller', Eimg: '7', Designation: 'Team Lead', Country: 'England' },
            { Name: 'Anne Dodsworth', Eimg: '1', Designation: 'Developer', Country: 'USA' }
        ];
        let changeData: any = [
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
            listObj = new DropDownList({
                dataSource: empList,
                fields: { text: 'Name', value: 'Eimg' },
                itemTemplate: '<div class="ename"> ${Name}</div><div class="job"> ${Designation} </div>',
                valueTemplate: '<div class="name" style="display:inline;"> ${Name} </div>'
            });
            listObj.appendTo(element);
        });
        it("while change the datasource dynamically", function () {
            listObj.showPopup();
            expect(((listObj as any).ulElement.querySelector('li').firstElementChild as HTMLElement).innerText === 'Andrew Fuller').toBe(true);
            expect((listObj as any).ulElement.querySelectorAll('li').length === 2).toBe(true);
            listObj.dataSource = changeData;
            listObj.dataBind();
            expect(((listObj as any).ulElement.querySelector('li').firstElementChild as HTMLElement).innerText === 'Janet Leverling').toBe(true);
            expect((listObj as any).ulElement.querySelectorAll('li').length === (listObj.dataSource as any).length).toBe(true);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
    });
    describe(' add item with Template', () => {
        let element: HTMLInputElement;
        let listObj: DropDownList;
        let popup: HTMLElement;
        let liEle: HTMLElement;
        let divNode: HTMLDivElement;
        let textContent: string;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: templateDataSource,
                fields: { text: 'Name', value: 'Eimg' },
                popupHeight: "200px",
                // set the template content for list items
                itemTemplate: '<div class ="ename" style="color:red;">${Name}</div>',
            });
            listObj.appendTo(element);
        });
        it("item template with add item values", function (done) {
            expect((listObj.dataSource as string[]).length === templateDataSource.length).toBe(true);
            listObj.addItem({ Name: 'dropdown', Eimg: 100 });
            listObj.open = function (args) {
                popup = document.getElementById('dropdownlist_popup');
                divNode = popup.querySelectorAll("li div.ename")[templateDataSource.length] as HTMLDivElement;
                textContent = divNode.innerText;
                expect(textContent).toEqual('dropdown');
                expect((listObj as any).listData.length === 10).toBe(true);
                listObj.hidePopup();
                listObj.open = null;
            };
            listObj.close = function (args) {
                done();
                listObj.close = null;
            };
            listObj.showPopup();

        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
    });

    describe('EJ2-24975: Form reset clear icon', () => {
        let element: HTMLInputElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' }
        ];
        let listObj: DropDownList;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('form', { id: 'form1' });
            element.innerHTML = `<input type="text" id="ddl">
            <input type="reset" id="resetForm"/>`;
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: data,
                showClearButton: true,
                fields: { text: "text", value: "id" },
                value: 'list1'
            });
            listObj.appendTo('#ddl');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it(' reset the form', (done) => {
            document.getElementById('resetForm').click();
            setTimeout(() => {
                expect(listObj.value === 'list1').toBe(true);
                expect((listObj as any).inputWrapper.container.querySelector('.e-clear-icon').classList.contains('e-clear-icon-hide')).toBe(true);
                done();
            })
        });
    });
    describe('EJ2-24995: re selected value not set', () => {
        let element: HTMLInputElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA' },
            { id: 'list2', text: 'C#' }
        ];
        let data1: any = [
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET' },
            { id: 'list5', text: 'Oracle' }
        ]
        let listObj: DropDownList;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'ddl' }); 
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: data, 
                fields: { text: "text", value: "id" }
            });
            listObj.appendTo('#ddl');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it(' when datasource is observable using AsyncPipe', () => {
            listObj.dataSource = data1;
            listObj.dataBind();
            listObj.showPopup();
            expect((listObj as any).list.querySelectorAll('li').length === data1.length).toBe(true);
            listObj.dataSource = data;
            listObj.value = 'list2';
            listObj.dataBind();
            expect((listObj as any).inputElement.value === 'C#').toBe(true);
        });
    });

    describe('BLAZ-762: float values are rounded to int', () => {
        let element: HTMLInputElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', value: 0.01 },
            { id: 'list2', text: 'C#', value: 0.02 }
        ];
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let listObj: any;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'ddl' }); 
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: data, 
                fields: { text: "text", value: "value" }
            });
            listObj.appendTo('#ddl');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it(' value select', () => {
            listObj.showPopup();
            let item: any = (listObj as any).popupObj.element.querySelectorAll('li')[1];
            mouseEventArgs.target = item;
            mouseEventArgs.type = 'click';
            listObj.onMouseClick(mouseEventArgs);
            expect(listObj.value ===  0.02).toBe(true);
        });
    });
    describe('EJ2-36017: dropdown cascading', () => {
        let element: HTMLInputElement, element1: HTMLInputElement, element2: HTMLInputElement;
        var country = [
            { countryName: 'United States', countryId: '1' },
            { countryName: 'Australia', countryId: '2' }
        ];
        var state = [
            { stateName: 'New York', countryId: '1', stateId: '101' },
            { stateName: 'Virginia ', countryId: '1', stateId: '102' },
            { stateName: 'Queensland', countryId: '2', stateId: '103' },
            { stateName: 'Tasmania ', countryId: '2', stateId: '104' }
        ];
        var cities = [
            { cityName: 'Albany', stateId: '101', cityId: 201 },
                { cityName: 'Beacon ', stateId: '101', cityId: 202 },
                { cityName: 'Alexandria', stateId: '102', cityId: 203 },
                { cityName: 'Hampton ', stateId: '102', cityId: 204 },
                { cityName: 'Aberdeen', stateId: '103', cityId: 205 },
                { cityName: 'Colville ', stateId: '103', cityId: 206 },
                { cityName: 'Townsville', stateId: '104', cityId: 207 },
                { cityName: 'Brisbane ', stateId: '104', cityId: 208 }
        ];
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let listObj: any, listObj1: any, listObj2: any;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'list' }); 
            element1 = <HTMLInputElement>createElement('input', { id: 'list1' }); 
            element2 = <HTMLInputElement>createElement('input', { id: 'list2' }); 
            document.body.appendChild(element);
            document.body.appendChild(element1);
            document.body.appendChild(element2);
            listObj = new DropDownList({
                dataSource: country,
                fields: { value: 'countryId', text: 'countryName' },
                allowFiltering: true,
                change: function () {
                    listObj1.enabled = true;
                    var tempQuery = new Query().where('countryId', 'equal', listObj.value);
                    listObj1.query = tempQuery;
                    listObj1.dataBind();
                    listObj1.value = null;
                    listObj2.value = null;
                    listObj2.enabled = false;
                }
            });
            listObj.appendTo('#list');
            listObj1 = new DropDownList({
                dataSource: state,
                fields: { value: 'stateId', text: 'stateName' },
                enabled: false,
                allowFiltering: true,
                change: function () {
                    listObj2.enabled = true;
                    var tempQuery1 = new Query().where('stateId', 'equal', listObj1.value);
                    listObj2.query = tempQuery1;
                    listObj2.value = null;
                    listObj2.dataBind();
                },
            });
            listObj1.appendTo('#list1');
            listObj2 = new DropDownList({
                dataSource: cities,
                fields: { text: 'cityName' },
                allowFiltering: true,
                enabled: false,
            });
            listObj2.appendTo('#list2');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('previous value maintained', () => {
            listObj.showPopup();
            let item: any = (listObj as any).popupObj.element.querySelectorAll('li')[0];
            mouseEventArgs.target = item;
            mouseEventArgs.type = 'click';
            listObj.onMouseClick(mouseEventArgs);
            expect(listObj.value === '1').toBe(true);
            listObj1.showPopup();
            let item1: any = (listObj1 as any).popupObj.element.querySelectorAll('li')[0];
            mouseEventArgs.target = item1;
            mouseEventArgs.type = 'click';
            listObj1.onMouseClick(mouseEventArgs);
            expect(listObj1.value === '101').toBe(true);
            listObj2.showPopup();
            let item2: any = (listObj2 as any).popupObj.element.querySelectorAll('li')[0];
            mouseEventArgs.target = item2;
            mouseEventArgs.type = 'click';
            listObj2.onMouseClick(mouseEventArgs);
            expect(listObj2.value === 'Albany').toBe(true);
            listObj1.showPopup();
            let item3: any = (listObj1 as any).popupObj.element.querySelectorAll('li')[1];
            mouseEventArgs.target = item3;
            mouseEventArgs.type = 'click';
            listObj1.onMouseClick(mouseEventArgs);
            listObj2.showPopup();
            let item4: any = (listObj2 as any).popupObj.element.querySelectorAll('li');
            expect(item4.length === 2).toBe(true);
        });
    });

    describe('EJ2-26287: popup collision not working', () => {
        let element: HTMLInputElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA' },
            { id: 'list2', text: 'C#' }
        ];
        let listObj: DropDownList;
        beforeAll(() => {
            let parentEle: any = <HTMLInputElement>createElement('div');
            document.body.appendChild(parentEle);
            
            let divEle: any =  <HTMLInputElement>createElement('div', { styles: 'height:700px; position: relative;' });
            parentEle.appendChild(divEle);
            element = <HTMLInputElement>createElement('input', { id: 'ddl' }); 
            parentEle.appendChild(element);
            listObj = new DropDownList({
                dataSource: data, 
                fields: { text: "text", value: "id" },
                allowFiltering: true
            });
            listObj.appendTo('#ddl');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        // it('when enable the filtering', () => { 
        //     listObj.focusIn();
        //     listObj.showPopup();
        //     expect((listObj as any).list.querySelectorAll('li').length === data.length).toBe(true); 
        //     expect(parseInt(getComputedStyle((listObj as any).popupObj.element).marginTop) === 0).toBe(true);
        // });
    });

    // describe('EJ2-18309 - Maximum call stack error while emptying dataSource with filtering and remote data', () => {
    //     let listObj: any;
    //     let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
    //     let originalTimeout: number;
    //     beforeEach((done) => {
    //         originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
    //         document.body.appendChild(element);
    //         listObj = new DropDownList({
    //             dataSource: new DataManager({
    //                 url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
    //                 adaptor: new WebApiAdaptor,
    //                 crossDomain: true
    //             }),
    //             query: new Query().select(['FirstName', 'EmployeeID']),
    //             fields: { text: 'FirstName', value: 'EmployeeID' },
    //             value: 2

    //         });
    //         listObj.appendTo(element);
    //         done();
    //     });
    //     afterEach(() => {
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    //         if (element) {
    //             element.remove();
    //             document.body.innerHTML = '';
    //         }
    //     });
    //     it('set empty datasource ', (done) => {
    //         setTimeout(() => {
    //             listObj.dataSource = [];
    //             listObj.query = null;
    //             listObj.dataBind();
    //             listObj.showPopup();
    //             setTimeout(() => {
    //                 expect(listObj.list.classList.contains('e-nodata')).toBe(true);
    //                 done();
    //             }, 1000);
    //         }, 3000);
    //     });
    // });
    describe('EJ2-39447- Dropdownlist', () => {
        let keyboardEventArgs = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
        };
        let isPopupFiltered: boolean = false;
        let ddlObj: DropDownList;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
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
        it('Filtering dropdown popup using paste testcase', () => {
            ddlObj = new DropDownList({
                dataSource: sportsData,
                fields: { text: 'Game', value: 'Id' },
                allowFiltering: true,
                filtering: function (e) {
                    isPopupFiltered = true;
                }
            });
            ddlObj.appendTo(element);
            ddlObj.showPopup();
            expect((<any>ddlObj).list.querySelectorAll('li').length === 10).toBe(true);
            // Filter popup by pasting value
            (<any>ddlObj).filterInput.value = "Cricket";
            keyboardEventArgs.altKey = false;
            (<any>ddlObj).pasteHandler(keyboardEventArgs);
            setTimeout (function () {
                expect((<any>ddlObj).list.querySelectorAll('li').length === 1).toBe(true);
                // Checking popup is filtered when paste
                expect(isPopupFiltered).toBe(true)
            },)
        });
    });
    describe('EJ2-46380 - dynamic fields property changing', () => {
        let ddlObj: any;
        let ddlEle1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl1' });
        let empList: any = [ 
            { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
        { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
        { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
        { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
        { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
        ];
        beforeAll(() => {
            document.body.appendChild(ddlEle1); 
            ddlObj = new DropDownList({
                dataSource: empList,
                fields: { text: 'sports', value: 'sports' },
            });
            ddlObj.appendTo(ddlEle1); 
        });
        afterAll(() => {
            ddlObj.destroy();
            ddlEle1.remove();
        });
        it('field property changes on dynamically', () => {
            ddlObj.showPopup();
            expect(ddlObj.list.querySelectorAll('li')[2].textContent).toBe('Basketball');
            ddlObj.hidePopup();
            ddlObj.fields = { text: 'id', value: 'id' };
            ddlObj.dataBind();
            ddlObj.showPopup();
            expect(ddlObj.list.querySelectorAll('li')[2].textContent).toBe('level3');
            let item: any = (ddlObj as any).popupObj.element.querySelectorAll('li')[2];
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = item;
            mouseEventArgs.type = 'click';
            ddlObj.onMouseClick(mouseEventArgs);
            expect(ddlObj.value === 'level3').toBe(true);
        });
    });
    describe('EJ2-39852', () => {
        let ddlObj: any;
        let ddlEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl' });
        let empList: any = [ 
            { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
            { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
            { id: 'level5', sports: 'Football' }
        ];
        beforeAll(() => {
            document.body.appendChild(ddlEle);
            ddlObj = new DropDownList({
                dataSource: empList,
                fields: { text: 'sports' },
                showClearButton: true,
                sortOrder: "Ascending"
            });
            ddlObj.appendTo(ddlEle);
        });
        afterAll(() => {
            ddlObj.destroy();
            ddlEle.remove();
        });
        it('SortOrder is not working after adding new item using addItem method', () => {
            ddlObj.addItem({id: 'level6', sports: 'Chess' });
            ddlObj.dataBind();
            expect(ddlObj.list.querySelectorAll('li')[3].textContent).toBe('Chess');
            expect(ddlObj.list.querySelectorAll('li').length === 6).toBe(true);
            ddlObj.addItem({id: 'level7', sports: 'Kabadi' });
            ddlObj.dataBind();
            expect(ddlObj.list.querySelectorAll('li')[6].textContent).toBe('Kabadi');
            expect(ddlObj.list.querySelectorAll('li').length === 7).toBe(true);
        });
    });
    // describe('EJ2-40058', () => {
    //     let keyEventArgs = {charCode: 115};
    //     let ddlObj1: any;
    //     let ddlObj2: any; 
    //     let ddlEle1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl1' });
    //     let ddlEle2: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl2' });
    //     let empList: any = [ 
    //         { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
    //     { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
    //     { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
    //     { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
    //     { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
    //     ];
    //     beforeAll(() => {
    //         document.body.appendChild(ddlEle1);
    //         document.body.appendChild(ddlEle2);
    //         ddlObj1 = new DropDownList({
    //             dataSource: empList,
    //             fields: { text: 'sports' },
    //         });
    //         ddlObj1.appendTo(ddlEle1);
    //         ddlObj2 = new DropDownList({
    //             dataSource: empList,
    //             fields: { text: 'sports' },
    //         });
    //         ddlObj2.appendTo(ddlEle2);
    //     });
    //     afterAll(() => {
    //         ddlObj1.destroy();
    //         ddlEle1.remove();
    //         ddlObj2.destroy();
    //         ddlEle2.remove();
    //     });
    //     it('Dropdownlist search produces undefined values', (done) => {
    //         ddlObj1.focusIn();
    //         ddlObj1.onSearch(keyEventArgs);
    //         expect(ddlObj1.value).toBe('Snooker');
    //         ddlObj1.focusOut();
    //         // Used settimeout since we reset the querystring variable in source after 1000 milliseconds
    //         setTimeout(() => {
    //             ddlObj2.focusIn();
    //             ddlObj2.onSearch(keyEventArgs);
    //             expect(ddlObj2.value).toBe('Snooker');
    //             ddlObj2.focusOut();
    //             done();
    //         }, 1000);
    //     });
    // });
    describe('EJ2-41417', () => {
        let element: HTMLInputElement, element1: HTMLInputElement, element2: HTMLInputElement;
        var country = [
            { CountryName: "United States", CountryId: "1" },
            { CountryName: "Australia", CountryId: "2" }
        ];
        var state = [
            { StateName: "US 1", CountryId: "1", StateId: "101" }, { StateName: "Australia 2", CountryId: "2", StateId: "104" },
            { StateName: "Australia 1 ", CountryId: "2", StateId: "105" }, { StateName: "Australia 3", CountryId: "2", StateId: "106" },
            { StateName: "US 2 ", CountryId: "1", StateId: "102" }, { StateName: "US 3", CountryId: "1", StateId: "103" }
        ];
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ }, metaKey: false };
        let listObj: any, listObj1: any, listObj2: any;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'list' }); 
            element1 = <HTMLInputElement>createElement('input', { id: 'list1' }); 
            document.body.appendChild(element);
            document.body.appendChild(element1);
            listObj = new DropDownList({
                dataSource: country,
                fields: { value: 'CountryId', text: 'CountryName' },
                allowFiltering: true,
                change: function () {
                    listObj1.enabled = true;
                    var tempQuery = new Query().where('CountryId', 'equal', listObj.value);
                    listObj1.query = tempQuery;
                    listObj1.text = null;
                    listObj1.dataBind();
                },
            });
            listObj.appendTo('#list');
            listObj1 = new DropDownList({
                dataSource: state,
                fields: { value: 'StateId', text: 'StateName' },
                enabled: false,
                allowFiltering: true,
            });
            listObj1.appendTo('#list1');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Popup list items is not updated properly in the cascading dropdown when filtered', () => {
            listObj.showPopup();
            let item: any = (listObj as any).popupObj.element.querySelectorAll('li')[0];
            mouseEventArgs.target = item;
            mouseEventArgs.type = 'click';
            listObj.onMouseClick(mouseEventArgs);
            expect(listObj.value === '1').toBe(true);
            listObj1.showPopup();
            keyEventArgs.keyCode = 49;
            listObj1.filterInput.value = 'US 1';
            listObj1.onInput()
            listObj1.onFilterUp(keyEventArgs);
            let newItem: any = (listObj1 as any).popupObj.element.querySelectorAll('li')[0];
            mouseEventArgs.target = newItem;
            mouseEventArgs.type = 'click';
            listObj1.onMouseClick(mouseEventArgs);
            expect(listObj1.value === '101').toBe(true);
            listObj.showPopup();
            item=  (listObj as any).popupObj.element.querySelectorAll('li')[1];
            mouseEventArgs.target = item;
            mouseEventArgs.type = 'click';
            listObj.onMouseClick(mouseEventArgs);
            listObj1.showPopup();
           // expect((listObj1 as any).popupObj.element.querySelectorAll('li')[0].textContent).toBe('Australia 2');
        });
    });
    
    describe('EJ2-44572- Dropdownlist', () => {
        let ddlObj: DropDownList;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let sportsData: Array<string> = [
            "Snooker",
            "Tennis",
            "Cricket",
            "Football",
            "Rugby"
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
        it('Sortorder in string array type datasource', () => {
            ddlObj = new DropDownList({
                dataSource: sportsData,
                sortOrder: "Ascending"
            });
            ddlObj.appendTo(element);
            ddlObj.showPopup();
            expect((ddlObj as any).liCollections[0].innerText).toBe("Cricket");
            ddlObj.hidePopup();
            ddlObj.sortOrder = "Descending";
            ddlObj.dataBind();
            ddlObj.showPopup();
            expect((ddlObj as any).liCollections[0].innerText).toBe("Tennis");
        });
    });
    
    describe('EJ2-44588- Cannot select dropdown items after calling refresh method -', () => {
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let ddlObj1: any;
        let ddlEle1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl1' });
        let empList: any = [ 
            { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
        { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
        { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
        { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
        { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
        ];
        beforeAll(() => {
            document.body.appendChild(ddlEle1);
            ddlObj1 = new DropDownList({
                dataSource: empList,
                fields: { text: 'sports' },
                created  : function(){
                      setTimeout(() => {
                        (ddlObj1 as any).refresh();
                      }, 400);
                }
            });
            ddlObj1.appendTo(ddlEle1);
        });
        afterAll(() => {
            ddlObj1.destroy();
            ddlEle1.remove();
        });
        it('mouse click', (done) => {
            setTimeout(() => {
                mouseEventArgs.target = ddlObj1.inputWrapper.container;
                ddlObj1.dropDownClick(mouseEventArgs);
                done();
            }, 800);
            mouseEventArgs.target = ddlObj1.inputWrapper.container;
            ddlObj1.dropDownClick(mouseEventArgs);
            mouseEventArgs.target = ddlObj1.ulElement.querySelectorAll('li')[0];
            ddlObj1.onMouseClick(mouseEventArgs);
            expect(ddlObj1.inputElement.value).toBe("American Football");
        });
    });
            
    describe('EJ2-44462', () => {
        let keyboardEventArgs: any = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
        };
        let ddlObj1: any;
        let ddlEle1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl1' });
        let empList: any = [ 
        { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
        { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
        { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
        { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
        { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
        ];
        beforeAll(() => {
            document.body.appendChild(ddlEle1);
            ddlObj1 = new DropDownList({
                dataSource: empList,
                fields: { text: 'sports', value: 'sports' },
                itemTemplate: '<div class="ename"> ${sports}</div>',
                allowFiltering: true,
            });
            ddlObj1.appendTo(ddlEle1);
        });
        afterAll(() => {
            ddlObj1.destroy();
            ddlEle1.remove();
        });
        it('Clearing filter input using clear icon not reset the popup', (done) => {
            if (!ddlObj1.isPopupOpen) {
                ddlObj1.showPopup();
            }
            setTimeout(() => {
                (ddlObj1 as any).filterInput.focus();
                (ddlObj1 as any).filterInput.value = (ddlObj1 as any).typedString = "a";
                (ddlObj1 as any).searchLists(keyboardEventArgs);
                expect((ddlObj1 as any).liCollections.length).toBe(1);
                (ddlObj1 as any).clearIconElement.click();
                expect((ddlObj1 as any).liCollections.length).toBe(empList.length);
                done();
            });
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
            listObj = new DropDownList();
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
    describe("EJ2-48999- Improper data source values are loaded in the popup while modifying query property", () => {
        let listObj: any;
        let listObj1: any;
        let element: any = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let element1: any = <HTMLInputElement>createElement('input', { id: 'dropdownlist1' });
        let pred:Predicate = new Predicate('CustomerID', 'notequal', null, true, false);
        let query:Query = new Query().where(pred);
        let dataSource = new DataManager({
            url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
            adaptor: new ODataV4Adaptor,
            crossDomain: true,
        });
        beforeAll(() => {
            document.body.appendChild(element);
            document.body.appendChild(element1);
        });
        afterAll(() => {
            document.body.innerHTML = "";
            listObj1.destroy();
            listObj.destroy();
        });
        it('Checking li elements are rendered properly by updating same query', (done) => {
            listObj = new DropDownList({
                dataSource: dataSource,
                query: query.select('CustomerID'),
                fields: { text: 'CustomerID', value: 'CustomerID' },
                placeholder: 'Select a name',
                value: "VINET",
                created: function() {
                    listObj1 = new DropDownList({
                        dataSource: dataSource,
                        query: query.select('CustomerID'),
                        fields: { text: 'CustomerID', value: 'CustomerID' },
                        placeholder: 'Select a name',
                        created:()=> {
                            setTimeout(() => {
                                listObj1.showPopup();
                                done();
                            }, 400);
                        },
                        open: (args) => {
                            expect((listObj1 as any).liCollections.length == (listObj as any).liCollections.length).toBe(true);
                            listObj1.hidePopup()
                        }
                    });
                    listObj1.appendTo('#dropdownlist1');
                },
                width: '250px',
            });
            listObj.appendTo('#dropdownlist');
        });
    });
    describe('EJ2-56514', () => {
        let ddlObj1: any;
        let ddlEle1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl1' });
        let empList: any = [ 
        { id: 1, sports: 'American Football' }, { id: 2, sports: 'Badminton' },
        { id: 3, sports: 'Badminton' }, { id: 4, sports: 'Cricket' }
        ];
        beforeAll(() => {
            document.body.appendChild(ddlEle1);
            ddlObj1 = new DropDownList({
                dataSource: empList,
                fields: { text: 'sports', value: 'id' },
                itemTemplate: '<div class="ename"> ${sports}</div>'
            });
            ddlObj1.appendTo(ddlEle1);
        });
        afterAll(() => {
            ddlObj1.destroy();
            ddlEle1.remove();
        });
        it('Dynamically set the text property from the same data source', (done) => {
            ddlObj1.text = "Badminton";
            ddlObj1.dataBind();
            ddlObj1.showPopup();
            let li: Element[] = ddlObj1.popupObj.element.querySelectorAll('li');
            expect(li[2].classList.contains('e-active')).toBe(true);
            ddlObj1.text = "Cricket";
            ddlObj1.dataBind();
            ddlObj1.showPopup();
            let li1: Element[] = ddlObj1.popupObj.element.querySelectorAll('li');
            expect(li1[3].classList.contains('e-active')).toBe(true);
            ddlObj1.value = 2;
            ddlObj1.dataBind();
            ddlObj1.showPopup();
            let li2: Element[] = ddlObj1.popupObj.element.querySelectorAll('li');
            expect(li2[1].classList.contains('e-active')).toBe(true);
            done();
        });
    });
    describe('936862: ', () => {
        let ddlObj1: any;
        let ddlEle1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl1' });
        let empList: any = [ 
        { id: 1, sports: 'American Football' }, { id: 2, sports: 'Badminton' },
        { id: 3, sports: 'Badminton' }, { id: 4, sports: 'Cricket' }
        ];
        beforeAll(() => {
            document.body.appendChild(ddlEle1);
            ddlObj1 = new DropDownList({
                dataSource: empList,
                fields: { text: 'sports', value: 'id' },
                allowResize: true,
                popupHeight: '200px'
            });
            ddlObj1.appendTo(ddlEle1);
        });
        afterAll(() => {
            ddlObj1.destroy();
            ddlEle1.remove();
        });
        it('Extra space appears when using AllowResize with height', (done) => {
            ddlObj1.text = "Badminton";
            ddlObj1.dataBind();
            ddlObj1.showPopup();
            expect(ddlObj1.popupObj.element.clientHeight < 200).toBe(true);
            done();
        });
    });
});