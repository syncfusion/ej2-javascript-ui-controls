/**
 * Dropdownlist spec document
 */
import { EmitType, Browser, createElement, isNullOrUndefined, setCulture, L10n, extend } from '@syncfusion/ej2-base';
import { DropDownBase, FilteringEventArgs, dropDownBaseClasses } from '../../src/drop-down-base/drop-down-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';
import { DataManager, ODataV4Adaptor, ODataAdaptor, Query } from '@syncfusion/ej2-data';
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
        it("Items values", function (done) {
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
                done();
                listObj.close = null;
            };
            listObj.showPopup();
        });
        it("Items Recheck values", function (done) {
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
            url: 'http://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/',
            crossDomain: true
        });
        let query = new Query().from('Customers').select('ContactName').take(0);
        let query1 = new Query().from('Customers').select('ContactName').take(3);
        beforeEach(() => {
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: dataSource,
                query: query,
                fields: { text: 'ContactName', value: 'ContactName' },
                actionComplete: (e: any) => {
                    expect(e.name === 'actionComplete').toBe(true);
                }
            });
            listObj.appendTo(element);
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('when "no records" template is added to the dropdownlist', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.list.classList.contains('e-nodata')).toBe(true);
                expect(listObj.isDataFetched).toBe(true);
                listObj.hidePopup();
                listObj.showPopup();
                expect(listObj.list.classList.contains('e-nodata')).toBe(true);
                expect(listObj.isDataFetched).toBe(true);
                done();
            }, 2000);
        });
        it('dynamic change datascource ', (done) => {
            listObj.hidePopup();
            listObj.dataSource = dataSource;
            listObj.query = query1;
            listObj.dataBind();
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.list.classList.contains('e-nodata')).not.toBe(true);
                expect(listObj.isDataFetched).not.toBe(true);
                expect(listObj.listData.length === 3).toBe(true);
                done();
            }, 1000);
        });
        it('set empty datasource ', (done) => {
            listObj.hidePopup();
            listObj.dataSource = dataSource;
            listObj.query = query;
            listObj.dataBind();
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.list.classList.contains('e-nodata')).toBe(true);
                expect(listObj.isDataFetched).toBe(true);
                listObj.hidePopup();
                listObj.showPopup();
                expect(listObj.list.classList.contains('e-nodata')).toBe(true);
                expect(listObj.isDataFetched).toBe(true);
                done();
            }, 1000);
        });
        it('set null datasource ', () => {
            listObj.hidePopup();
            listObj.dataSource = null;
            listObj.query = query;
            listObj.dataBind();
            listObj.showPopup();
            expect(listObj.list.classList.contains('e-nodata')).toBe(true);
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
                itemTemplate: '<div class ="ename" style="color:red;"> ${Name}</div>',
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
    describe('EJ2-18309 - Maximum call stack error while emptying dataSource with filtering and remote data', () => {
        let listObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        beforeEach((done) => {
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: new DataManager({
                    url: 'https://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Customers',
                    adaptor: new ODataAdaptor,
                    crossDomain: true
                }),
                query: new Query().select(['ContactName', 'CustomerID']),
                fields: { text: 'ContactName', value: 'CustomerID' },
                value: "ALFKI"

            });
            listObj.appendTo(element);
            done();
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('set empty datasource ', (done) => {
            setTimeout(() => {
                listObj.dataSource = [];
                listObj.dataBind();
                listObj.showPopup();
                setTimeout(() => {
                    expect(listObj.list.classList.contains('e-nodata')).toBe(true);
                    done();
                }, 400);
            }, 2000);
        });
    });
});