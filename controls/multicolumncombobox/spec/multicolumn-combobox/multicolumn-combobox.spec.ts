import { createElement, remove, isNullOrUndefined, EventHandler, Browser } from '@syncfusion/ej2-base';
import { FilteringEventArgs, MultiColumnComboBox, PopupEventArgs, SortOrder, SortType } from '../../src/multicolumn-combobox/multi-column-combo-box';
import { DataManager, Query, ODataAdaptor, ODataV4Adaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import { getMemoryProfile, inMB, profile } from './common.spec';
import { downArrow, enter, resizeClassList } from '@syncfusion/ej2-grids';

let languageData: { [key: string]: Object }[] = [
    { subject: 'cse', id: 'id2', text: 'PHP' }, { subject: 'eee', id: 'id1', text: 'HTML' }, { subject: 'ece', id: 'id3', text: 'PERL' },
    { subject: 'cse', id: 'list1', text: 'JAVA' }, { subject: 'eee', id: 'list2', text: 'PYTHON' }, { subject: 'ece', id: 'list5', text: 'HTMLCSS' },
    { subject: 'cse', id: 'list6', text: 'JAVASCRIPT' }, { subject: 'eee', id: 'list7', text: 'SQL' }, { subject: 'ece', id: 'list8', text: 'C#' }
];

let filterData: { [key: string]: Object }[] = [
    { subject: 'cse', id: 'id2', text: 'PHP' }, { subject: 'cse', id: 'list1', text: 'JAVA' }, { subject: 'cse', id: 'list6', text: 'JAVASCRIPT' }
];

let names: string[] = ['TOM', 'Hawk', 'Jon', 'Chandler', 'Monica', 'Rachel', 'Phoebe', 'Gunther', 'Ross', 'Geller', 'Joey', 'Bing', 'Tribbiani',
    'Janice', 'Bong', 'Perk', 'Green', 'Ken', 'Adams'];
let hours: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let designation: string[] = ['Manager', 'Engineer 1', 'Engineer 2', 'Developer', 'Tester'];
let status: string[] = ['Completed', 'Open', 'In Progress', 'Review', 'Testing']
let dataValue: Function = () => {
    let result: Object[] = [];
    for (let i = 0; i < 50; i++) {
        result.push({
            TaskID: i + 1,
            Engineer: names[Math.round(Math.random() * names.length)] || names[0],
            Designation: designation[Math.round(Math.random() * designation.length)] || designation[0],
            Estimation: hours[Math.round(Math.random() * hours.length)] || hours[0],
            Status: status[Math.round(Math.random() * status.length)] || status[0]
        });
    }
    return result;
};

let data: { [key: string]: Object }[] = [
    {
        OrderID: 10248, CustomerID: 'VINET', Role: 'Admin', EmployeeID: 5, OrderDate: new Date(8364186e5),
        ShipName: 'Vins et alcools Chevalier', ShipCity: 'Reims', ShipAddress: '59 rue de l Abbaye',
        ShipRegion: 'CJ', Mask: '1111',ShipPostalCode: '51100', ShipCountry: 'France', Freight: 32.38, Verified: !0
    },
    {
        OrderID: 10249, CustomerID: 'TOMSP', Role: 'Employee', EmployeeID: 6, OrderDate: new Date(836505e6),
        ShipName: 'Toms Spezialitäten', ShipCity: 'Münster', ShipAddress: 'Luisenstr. 48',
        ShipRegion: 'CJ',  Mask: '2222', ShipPostalCode: '44087', ShipCountry: 'Germany', Freight: 11.61, Verified: !1
    },
    {
        OrderID: 10250, CustomerID: 'HANAR', Role: 'Admin', EmployeeID: 4, OrderDate: new Date(8367642e5),
        ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
        ShipRegion: 'RJ', Mask: '3333', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 65.83, Verified: !0
    },
    {
        OrderID: 10251, CustomerID: 'VICTE', Role: 'Manager', EmployeeID: 3, OrderDate: new Date(8367642e5),
        ShipName: 'Victuailles en stock', ShipCity: 'Lyon', ShipAddress: '2, rue du Commerce',
        ShipRegion: 'CJ', Mask: '4444', ShipPostalCode: '69004', ShipCountry: 'France', Freight: 41.34, Verified: !0
    },
    {
        OrderID: 10252, CustomerID: 'SUPRD', Role: 'Manager', EmployeeID: 2, OrderDate: new Date(8368506e5),
        ShipName: 'Suprêmes délices', ShipCity: 'Charleroi', ShipAddress: 'Boulevard Tirou, 255',
        ShipRegion: 'CJ', Mask: '5555', ShipPostalCode: 'B-6000', ShipCountry: 'Belgium', Freight: 51.3, Verified: !0
    },
    {
        OrderID: 10253, CustomerID: 'HANAR', Role: 'Admin', EmployeeID: 7, OrderDate: new Date(836937e6),
        ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
        ShipRegion: 'RJ', Mask: '6666', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 58.17, Verified: !0
    },
    {
        OrderID: 10254, CustomerID: 'CHOPS', Role: 'Employee', EmployeeID: 5, OrderDate: new Date(8370234e5),
        ShipName: 'Chop-suey Chinese', ShipCity: 'Bern', ShipAddress: 'Hauptstr. 31',
        ShipRegion: 'CJ', Mask: '7777', ShipPostalCode: '3012', ShipCountry: 'Switzerland', Freight: 22.98, Verified: !1
    },
    {
        OrderID: 10255, CustomerID: 'RICSU', Role: 'Admin', EmployeeID: 9, OrderDate: new Date(8371098e5),
        ShipName: 'Richter Supermarkt', ShipCity: 'Genève', ShipAddress: 'Starenweg 5',
        ShipRegion: 'CJ', Mask: '8888', ShipPostalCode: '1204', ShipCountry: 'Switzerland', Freight: 148.33, Verified: !0
    },
    {
        OrderID: 10256, CustomerID: 'WELLI', Role: 'Employee', EmployeeID: 3, OrderDate: new Date(837369e6),
        ShipName: 'Wellington Importadora', ShipCity: 'Resende', ShipAddress: 'Rua do Mercado, 12',
        ShipRegion: 'SP',  Mask: '9999', ShipPostalCode: '08737-363', ShipCountry: 'Brazil', Freight: 13.97, Verified: !1
    },
    {
        OrderID: 10257, CustomerID: 'HILAA', Role: 'Admin', EmployeeID: 4, OrderDate: new Date(8374554e5),
        ShipName: 'HILARION-Abastos', ShipCity: 'San Cristóbal', ShipAddress: 'Carrera 22 con Ave. Carlos Soublette #8-35',
        ShipRegion: 'Táchira', Mask: '1234', ShipPostalCode: '5022', ShipCountry: 'Venezuela', Freight: 81.91, Verified: !0
    },
    {
        OrderID: 10258, CustomerID: 'ERNSH', Role: 'Manager', EmployeeID: 1, OrderDate: new Date(8375418e5),
        ShipName: 'Ernst Handel', ShipCity: 'Graz', ShipAddress: 'Kirchgasse 6',
        ShipRegion: 'CJ',  Mask: '2345', ShipPostalCode: '8010', ShipCountry: 'Austria', Freight: 140.51, Verified: !0
    },
    {
        OrderID: 10259, CustomerID: 'CENTC', Role: 'Admin', EmployeeID: 4, OrderDate: new Date(8376282e5),
        ShipName: 'Centro comercial Moctezuma', ShipCity: 'México D.F.', ShipAddress: 'Sierras de Granada 9993',
        ShipRegion: 'CJ', Mask: '3456', ShipPostalCode: '05022', ShipCountry: 'Mexico', Freight: 3.25, Verified: !1
    },
    {
        OrderID: 10260, CustomerID: 'OTTIK', Role: 'Admin', EmployeeID: 4, OrderDate: new Date(8377146e5),
        ShipName: 'Ottilies Käseladen', ShipCity: 'Köln', ShipAddress: 'Mehrheimerstr. 369',
        ShipRegion: 'CJ',  Mask: '4567', ShipPostalCode: '50739', ShipCountry: 'Germany', Freight: 55.09, Verified: !0
    },
    {
        OrderID: 10261, CustomerID: 'QUEDE', Role: 'Manager', EmployeeID: 4, OrderDate: new Date(8377146e5),
        ShipName: 'Que Delícia', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua da Panificadora, 12',
        ShipRegion: 'RJ',  Mask: '5678', ShipPostalCode: '02389-673', ShipCountry: 'Brazil', Freight: 3.05, Verified: !1
    },
    {
        OrderID: 10262, CustomerID: 'RATTC', Role: 'Employee', EmployeeID: 8, OrderDate: new Date(8379738e5),
        ShipName: 'Rattlesnake Canyon Grocery', ShipCity: 'Albuquerque', ShipAddress: '2817 Milton Dr.',
        ShipRegion: 'NM', Mask: '6789', ShipPostalCode: '87110', ShipCountry: 'USA', Freight: 48.29, Verified: !0
    }
];

let complexData: Object[] = [{
    'EmployeeID': 1,
    'Name': {
    'LastName': 'Davolio',
    'FirstName': 'Nancy'},
    'Names': [{
        'LastName' : 'Davolio',
        'FirstName': 'Nancy'}],
    'Title': 'Sales Representative'
},
{
    'EmployeeID': 2,
    'Name':{
    'LastName': 'Fuller',
    'FirstName': 'Andrew'},
    'Names': [{
    'LastName': 'Fuller',
    'FirstName': 'Andrew'}],
    'Title': 'Vice President, Sales'
},
{
    'EmployeeID': 3,
    'Name':{
    'LastName': 'Leverling',
    'FirstName': 'Janet'},
    'Names': [{
        'LastName': 'Leverling',
        'FirstName': 'Janet'}],
    'Title': 'Sales Representative'
},
{
    'EmployeeID': 4,
    'Name':{
    'LastName': 'Peacock',
    'FirstName': 'Margaret'},
    'Names': [{
        'LastName': 'Peacock',
        'FirstName': 'Margaret'}],
    'Title': 'Sales Representative'
},
{
    'EmployeeID': 5,
    'Name':{
    'LastName': 'Buchanan',
    'FirstName': 'Steven'},
    'Names': [{
        'LastName': 'Buchanan',
        'FirstName': 'Steven'}],
    'Title': 'Sales Manager'
},
{
    'EmployeeID': 6,
    'Name':{
    'LastName': 'Suyama',
    'FirstName': 'Michael'},
    'Title': 'Sales Representative',
    'TitleOfCourtesy': 'Mr.'
},
{
    'EmployeeID': 7,
    'Name':{
    'LastName': 'King',
    'FirstName': 'Robert'},
    'Title': 'Sales Representative',
    'TitleOfCourtesy': 'Mr.'
},
{
    'EmployeeID': 8,
    'Name': {
    'LastName': 'Callahan',
    'FirstName': 'Laura'},
    'Title': 'Inside Sales Coordinator'
},
{
    'EmployeeID': 9,
    'Name': {
    'LastName': 'Dodsworth',
    'FirstName': 'Anne'},
    'Title': 'Sales Representative'
}];

describe('MultiColumnComboBox control', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });
    describe('Basic rendering', () => {
        let multiColObj: MultiColumnComboBox;
        let element: HTMLInputElement;
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input');
            document.body.appendChild(element);
        });
        afterEach((): void => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });
        it('check root component root class, Element Structure and get module name', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(document.getElementById('e-multicolumncombobox_0').classList.contains('e-control')).toEqual(true);
                expect(document.getElementById('e-multicolumncombobox_0').classList.contains('e-multicolumncombobox')).toEqual(true);
                expect(multiColObj.element.id).toBe('e-multicolumncombobox_0');
                expect(multiColObj.element.classList.contains('e-control')).toEqual(true);
                expect(multiColObj.element.classList.contains('e-multicolumncombobox')).toEqual(true);
                expect(multiColObj.element.parentElement.classList.contains('e-control-wrapper')).toEqual(true);
                expect(multiColObj.element.parentElement.classList.contains('e-multicolumn-list')).toEqual(true);
                expect(multiColObj.element.parentElement.lastElementChild.classList.contains('e-multicolumn-list-icon')).toEqual(true);
                expect(multiColObj.getModuleName()).toBe('multicolumncombobox');
                done();
            }, 1200);
        });
        it('Generic nav Element ID generation', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            const multiColEle: HTMLInputElement = <HTMLInputElement>createElement('input', { });
            document.body.appendChild(multiColEle);
            multiColObj.appendTo(multiColEle);
            expect(multiColEle.getAttribute('id') !== element.getAttribute('id')).toEqual(true);
            expect(isNullOrUndefined(multiColEle.id)).toBe(false);
            multiColObj.destroy();
            multiColObj = undefined;
            remove(multiColEle);
        });
        it('Placeholder property with dynamic value', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                placeholder: 'Select a language'
            });
            const multiColEle: HTMLInputElement = <HTMLInputElement>createElement('input', {id: 'multicolumn-combobox'});
            document.body.appendChild(multiColEle);
            multiColObj.appendTo(multiColEle);
            expect(multiColEle.getAttribute('placeholder')).toEqual('Select a language');
            multiColObj.placeholder = 'new placeholder';
            multiColObj.dataBind();
            expect(multiColEle.getAttribute('placeholder')).toEqual('new placeholder');
        });
        it('HtmlAttributes property with dynamic value', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                htmlAttributes: { name: 'name-test', class: 'e-attribute-test', style: 'color:red' }
            });
            const multiColEle: HTMLInputElement = <HTMLInputElement>createElement('input', {id: 'multicolumn-combobox'});
            document.body.appendChild(multiColEle);
            multiColObj.appendTo(multiColEle);
            expect(multiColEle.getAttribute('name')).toEqual('name-test');
            expect((multiColObj as any).inputWrapper.classList.contains('e-attribute-test')).toEqual(true);
            expect((multiColObj as any).inputWrapper.getAttribute('style')).toEqual('color:red');
            multiColObj.htmlAttributes = { placeholder: 'attributes', title: 'html-attributes' };
            multiColObj.dataBind();
            expect(multiColEle.getAttribute('placeholder')).toEqual('attributes');
            expect(multiColEle.getAttribute('title')).toEqual('html-attributes');
            multiColObj.disabled = true;
            multiColObj.dataBind();
            expect(multiColEle.getAttribute('disabled')).toEqual('');
            multiColObj.htmlAttributes = { disabled: 'disabled', readonly: 'readonly' };
            multiColObj.dataBind();
            expect(multiColEle.getAttribute('aria-disabled')).toEqual('true');
        });
        it(' Created event testing ', () => {
            let created: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                created: (): void => {
                    created = true;
                }
            });
            const multiColEle: HTMLInputElement = <HTMLInputElement>createElement('input', {id: 'multicolumn-combobox'});
            document.body.appendChild(multiColEle);
            multiColObj.appendTo(multiColEle);
            expect(created).toBe(true);
        });
        it(' popup open and close testing on mouse click ', (done) => {
            let isPopupOpen: boolean = false;
            let isPopupClose: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                open: (): void => {
                    isPopupOpen = true;
                },
                close: (): void => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(isPopupOpen).toBe(false);
            multiColObj.focusIn();
            expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
            expect(isPopupOpen).toBe(true);
            expect(isPopupClose).toBe(false);
            (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
            setTimeout(() => {
                expect(isPopupClose).toBe(true);
                done();
            }, 500);
        });
        it(' popup open and close on content select ', (done) => {
            let isPopupOpen: boolean = false;
            let isPopupClose: boolean = false;
            let multiColObj: any;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                open: (): void => {
                    isPopupOpen = true;
                },
                close: (): void => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                action: null,
                key: null,
                target: null,
                currentTarget: null,
                stopImmediatePropagation: (): void => { /** NO Code */ }
            };
            multiColObj.appendTo(element);
            expect(isPopupOpen).toBe(false);
            multiColObj.focusIn();
            setTimeout(() => {
                keyEventArgs.action = 'altDown';
                multiColObj.keyActionHandler(keyEventArgs);
                expect(isPopupOpen).toBe(true);
                expect(isPopupClose).toBe(false);
                keyEventArgs.action = 'end';
                multiColObj.keyActionHandler(keyEventArgs);
                keyEventArgs.action = 'enter';
                multiColObj.keyActionHandler(keyEventArgs);
                //expect(multiColObj.value).toBe('list8');
                //expect(multiColObj.text).toBe('C#');
                expect(isPopupClose).toBe(true);
                done();
            }, 1200);
        });
    });

    describe('Basic div rendering', () => {
        let multiColObj: MultiColumnComboBox;
        let element: HTMLInputElement;
        let ngElement: HTMLInputElement;
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('div');
            document.body.appendChild(element);
            ngElement = <HTMLInputElement>createElement('EJS-MULTICOLUMNCOMBOBOX');
            document.body.appendChild(ngElement);
        });
        afterEach((): void => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
            remove(ngElement);
        });
        it('check ng tag and div is created', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.element.tagName).toBe('DIV');
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(ngElement);
            expect(multiColObj.element.tagName).toBe('EJS-MULTICOLUMNCOMBOBOX');
            done();
        });
    });

    describe('Basic rendering', () => {
        let multiColObj: MultiColumnComboBox;
        let element: HTMLInputElement;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: null,
            key: null,
            target: null,
            currentTarget: null,
            stopImmediatePropagation: (): void => { /** NO Code */ }
        };
        let event = new Event('input', {
            bubbles: true,
            cancelable: true
        });
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input');
            document.body.appendChild(element);
        });
        afterEach((): void => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });
        it('- Attributes', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.element.getAttribute("role")).toEqual("combobox");
            expect(multiColObj.element.getAttribute("type")).toEqual("text");
            expect(multiColObj.element.getAttribute("aria-expanded")).toEqual("false");
            expect(multiColObj.element.getAttribute("tabindex")).toEqual("0");
            expect(multiColObj.element.parentElement.getAttribute("spellcheck")).toBe("false");
            expect(multiColObj.element.getAttribute("autocomplete")).toEqual("off");
            expect(multiColObj.element.getAttribute("autocapitalize")).toEqual("off");
            expect(multiColObj.element.getAttribute("aria-owns")).toEqual(null);
            expect(multiColObj.element.getAttribute("aria-controls")).toEqual(null);
            expect(multiColObj.element.getAttribute("aria-activedescendant")).toEqual(null);
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
            setTimeout(() => {
                expect(multiColObj.element.getAttribute("aria-owns")).toEqual("e-multicolumncombobox_15_popup");
                expect(multiColObj.element.getAttribute("aria-controls")).toEqual("e-multicolumncombobox_15");
                (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
                setTimeout(() => {
                    expect(multiColObj.element.getAttribute("aria-owns")).toEqual(null);
                    expect(multiColObj.element.getAttribute("aria-activedescendant")).toEqual(null);
                    done();
                }, 500);
            }, 1200);
        });
        it(' popup close testing on focusout method ', (done) => {
            let isPopupOpen: boolean = false;
            let isPopupClose: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                open: (): void => {
                    isPopupOpen = true;
                },
                close: (): void => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(isPopupOpen).toBe(false);
            multiColObj.focusIn();
            expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
            expect(isPopupOpen).toBe(true);
            expect(isPopupClose).toBe(false);
            multiColObj.focusOut();
            setTimeout(() => {
                expect(isPopupClose).toBe(true);
                done();
            }, 500);
        });
        it(' popup close testing on targetExitViewport ', (done) => {
            let isPopupOpen: boolean = false;
            let isPopupClose: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                open: (): void => {
                    isPopupOpen = true;
                },
                close: (): void => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(isPopupOpen).toBe(false);
            multiColObj.focusIn();
            expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
            expect(isPopupOpen).toBe(true);
            expect(isPopupClose).toBe(false);
            (multiColObj as any).popupObj.trigger('targetExitViewport');
            setTimeout(() => {
                expect(isPopupClose).toBe(true);
                done();
            }, 500);
        });
        it(' Input value checking with filtering and dropdownclick', (done) => {
            const multiColObj2: MultiColumnComboBox = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                allowFiltering: true,
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                value: 'list1'
            });
            multiColObj2.appendTo(element);
            expect(multiColObj2.text).toBe('JAVA');
            expect(multiColObj2.value).toBe('list1');
            expect(multiColObj2.index).toBe(3);
            element.value = 'list';
            element.dispatchEvent(event);
            setTimeout(() => {
                let clickEvent: MouseEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent('mousedown', true, true);
                (multiColObj2 as any).inputObj.buttons[0].dispatchEvent(clickEvent);
                expect(multiColObj2.text).toBe('JAVA');
                expect(multiColObj2.value).toBe('list1');
                expect(multiColObj2.index).toBe(3);
                done();
            }, 1200);
        });
        it(' Input value checking with filtering and keydown', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                allowFiltering: true,
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                value: 'list1'
            });
            multiColObj.appendTo(element);
            expect(multiColObj.text).toBe('JAVA');
            expect(multiColObj.value).toBe('list1');
            expect(multiColObj.index).toBe(3);
            element.value = 'list';
            element.dispatchEvent(event);
            setTimeout(() => {
                keyEventArgs.action = 'moveDown';
                (multiColObj as any).keyActionHandler(keyEventArgs);
                keyEventArgs.key = 'Enter';
                (multiColObj as any).gridObj.keyPressed(keyEventArgs);
                expect((multiColObj as any).inputEle.value).toBe('PHP');
                done();
            }, 1200);
        });
    });

    // Component Focus
    describe('Component Focus ', () => {
        let multiColObj: any;
        let element: HTMLInputElement;
        let element2: HTMLInputElement;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: null,
            key: null,
            target: null,
            currentTarget: null,
            stopImmediatePropagation: (): void => { /** NO Code */ }
        };
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
            element2 = <HTMLInputElement>createElement('div', { id: 'domElement' });
            document.body.appendChild(element2);
        });
        afterEach(() => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
            remove(element2);
        });
        it('focus when click on input', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            multiColObj.inputEle.focus();
            multiColObj.focusIn();
            expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
            expect(document.activeElement === multiColObj.inputEle).toBe(true);
        });
        it('Focus when dropdown click', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
            expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
            (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
            setTimeout(() => {
                expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
                done();
            }, 500);
        });
        // it('Focus when document click', (done) => {
        //     multiColObj = new MultiColumnComboBox({
        //         dataSource: languageData,
        //         fields: { text: 'text', value: 'id' },
        //         columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
        //     });
        //     multiColObj.appendTo(element);
        //     let clickEvent: MouseEvent = document.createEvent('MouseEvents');
        //     clickEvent.initEvent('mousedown', true, true);
        //     (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
        //     expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
        //     document.querySelector('#domElement').dispatchEvent(clickEvent);
        //     done();
        // });
        it('Focus when keyboard interaction', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            multiColObj.inputEle.focus();
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
                expect(document.activeElement === multiColObj.inputEle).toBe(true);
                keyEventArgs.action = 'moveDown';
                multiColObj.keyActionHandler(keyEventArgs);
                expect(multiColObj.gridObj.selectedRowIndex).toBe(0);
                keyEventArgs.key = 'Enter';
                multiColObj.gridObj.keyPressed(keyEventArgs);
                expect(document.activeElement === multiColObj.inputEle).toBe(true);
                expect(multiColObj.inputEle.value).toBe('PHP');
                const rowCell: HTMLElement = multiColObj.gridEle.querySelector('.e-rowcell')
                keyEventArgs.target = rowCell;
                keyEventArgs.key = '';
                multiColObj.onMouseClick(keyEventArgs);
                expect(multiColObj.inputEle.value).toBe('PHP');
                setTimeout(() => {
                    keyEventArgs.action = 'tab';
                    multiColObj.keyActionHandler(keyEventArgs);
                    expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(false);
                    done();
                }, 1200);
            }, 1300);
        });
    });

    describe('Initial selection state', function () {
        let multiColObj1: any;
        let element: HTMLInputElement;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: null,
            key: null,
            target: null,
            currentTarget: null,
            stopImmediatePropagation: (): void => { /** NO Code */ }
        };
        beforeAll((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (multiColObj1) {
                multiColObj1.destroy();
                multiColObj1 = undefined;
            }
            remove(element);
        });
        it('value property - initial select', (done) => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                value: 'list1',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj1.appendTo(element);
            multiColObj1.showPopup();
            multiColObj1.gridObj.selectedRowIndex = 3;
            setTimeout(() => {
                expect(multiColObj1.index).toBe(3);
                done();
            }, 1800);
        });
        it(' value property - initial select - groupBy ', (done) => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                value: 'list1',
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]                
            });
            multiColObj1.appendTo(element);
            // For coverage
            (<any>multiColObj1).isVue = true;
            multiColObj1.showPopup();
            setTimeout(() => {
                multiColObj1.gridObj.selectedRowIndex = 2;
                setTimeout(() => {
                    expect(multiColObj1.popupEle.querySelector('.e-active').innerText).toBe('JAVASCRIPT');
                    done();
                }, 1800);
            }, 1800);
        });
        it('value property - initial select', (done) => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                index: 2,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj1.appendTo(element);
            multiColObj1.showPopup();
            multiColObj1.gridObj.selectedRowIndex = 2;
            setTimeout(() => {
                expect(multiColObj1.index).toBe(2);
                done();
            }, 1800);
        });
        it(' index property - initial select - groupBy ', (done) => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                index: 2,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]                
            });
            multiColObj1.appendTo(element);
            multiColObj1.showPopup();
            setTimeout(() => {
                multiColObj1.gridObj.selectedRowIndex = 2;
                setTimeout(() => {
                    expect(multiColObj1.popupEle.querySelector('.e-active').innerText).toBe('JAVASCRIPT');
                    done();
                }, 1800);
            }, 1800);
        });
        it('Selection behaviour selected item is clicked', (done) => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj1.appendTo(element);
            setTimeout(() => {
                const rowCell: HTMLElement = multiColObj1.gridEle.querySelector('.e-rowcell');
                keyEventArgs.target = rowCell;
                keyEventArgs.key = '';
                multiColObj1.gridObj.selectedRowIndex = -1;
                multiColObj1.onMouseClick(keyEventArgs);
                done();
            }, 1200);
        });
    });

    describe('Custom value with initial rendering and dynamic change', () => {
        let multiColObj1: any;
        let element: HTMLInputElement;
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (multiColObj1) {
                multiColObj1.destroy();
                multiColObj1 = undefined;
            }
            remove(element);
        });
        it(' value property - custom value - not exist value  ', () => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                value: 'abc',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj1.appendTo(element);
            expect(multiColObj1.inputEle.value).toBe('');
            expect(multiColObj1.value).toBe('abc');
            expect(multiColObj1.text).toBe(null);
            expect(multiColObj1.index).toBe(null);
        });
        it(' value property - custom value - exist value  ', () => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                value: 'list1',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj1.appendTo(element);
            expect(multiColObj1.inputEle.value).toBe('JAVA');
            expect(multiColObj1.text).toBe('JAVA');
            expect(multiColObj1.value).toBe('list1');
            expect(multiColObj1.index).toBe(3);
        });
        it(' text property - custom value - not exist text  ', () => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                text: 'abc',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj1.appendTo(element);
            expect(multiColObj1.text).toBe('abc');
            expect(multiColObj1.value).toBe(null);
            expect(multiColObj1.index).toBe(null);
        });
        it(' text property - custom value - exist text  ', () => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                text: 'JAVA',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj1.appendTo(element);
            expect(multiColObj1.inputEle.value).toBe('JAVA');
            expect(multiColObj1.text).toBe('JAVA');
            expect(multiColObj1.value).toBe('list1');
            expect(multiColObj1.index).toBe(3);
        });
        it(' value property - onPropertyChange - custom value - not exist value  ', () => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
            });
            multiColObj1.appendTo(element);
            multiColObj1.value = 'abc';
            multiColObj1.dataBind();
            expect(multiColObj1.text).toBe(null);
            expect(multiColObj1.value).toBe('abc');
            expect(multiColObj1.index).toBe(null);
        });
        it(' value property - onPropertyChange - custom value - exist value  ', () => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
            });
            multiColObj1.appendTo(element);
            multiColObj1.value = 'list1';
            multiColObj1.dataBind();
            expect(multiColObj1.inputEle.value).toBe('JAVA');
            expect(multiColObj1.text).toBe('JAVA');
            expect(multiColObj1.value).toBe('list1');
            expect(multiColObj1.index).toBe(3);
        });
        it(' text property - onPropertyChange custom value - not exist text  ', () => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
            });
            multiColObj1.appendTo(element);
            multiColObj1.text = 'abc';
            multiColObj1.dataBind();
            expect(multiColObj1.text).toBe('abc');
            expect(multiColObj1.value).toBe(null);
            expect(multiColObj1.index).toBe(null);
        });
        it(' text property - onPropertyChange custom value - exist text  ', () => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
            });
            multiColObj1.appendTo(element);
            multiColObj1.text = 'JAVA';
            multiColObj1.dataBind();
            expect(multiColObj1.inputEle.value).toBe('JAVA');
            expect(multiColObj1.text).toBe('JAVA');
            expect(multiColObj1.value).toBe('list1');
            expect(multiColObj1.index).toBe(3);
        });
        it(' value - text - index - property priority check ', () => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                value: 'id1',
                text: 'JAVA',
                index: 3,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj1.appendTo(element);
            expect(multiColObj1.inputEle.value).toBe('HTML');
            expect(multiColObj1.text).toBe('HTML');
            expect(multiColObj1.value).toBe('id1');
            expect(multiColObj1.index).toBe(1);
        });
        it(' text - index - property priority check ', () => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                text: 'JAVA',
                index: 0,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj1.appendTo(element);
            expect(multiColObj1.inputEle.value).toBe('JAVA');
            expect(multiColObj1.text).toBe('JAVA');
            expect(multiColObj1.value).toBe('list1');
            expect(multiColObj1.index).toBe(3);
        });
        it( 'index - property check ', () => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                index: 3,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj1.appendTo(element);
            expect(multiColObj1.inputEle.value).toBe('JAVA');
            expect(multiColObj1.text).toBe('JAVA');
            expect(multiColObj1.value).toBe('list1');
            expect(multiColObj1.index).toBe(3);
        });
        it(' value - text - index - popup open ', () => {
            multiColObj1 = new MultiColumnComboBox({
                dataSource: languageData,
                value: 'list1',
                text: 'JAVA',
                index: 3,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj1.appendTo(element);
            multiColObj1.showPopup();
            expect(multiColObj1.inputEle.value).toBe('JAVA');
            expect(multiColObj1.text).toBe('JAVA');
            expect(multiColObj1.value).toBe('list1');
            expect(multiColObj1.index).toBe(3);
            window.dispatchEvent(new Event('resize'));
        });
    });

    describe('Custom value with initial rendering and dynamic change', () => {
        let multiColObj1: any;
        let element: HTMLInputElement;
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (multiColObj1) {
                multiColObj1.destroy();
                multiColObj1 = undefined;
            }
            remove(element);
        });
        it('value property in remote data', (done) => {
            let data: DataManager = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
                adaptor: new ODataV4Adaptor,
                crossDomain: true
            });
            multiColObj1 = new MultiColumnComboBox({
                dataSource: data,
                fields: { text: 'ContactName', value: 'CustomerID' },
                columns: [{ field: 'ContactName', header: 'ContactName', width: 120 },
                          { field: 'CustomerID', width: 140, header: 'Customer ID' }],
                value: 'EASTC'
            });
            multiColObj1.appendTo(element);
            setTimeout(() => {
                expect(multiColObj1.inputEle.value).toBe('Ann Devon');
                expect(multiColObj1.text).toBe('Ann Devon');
                expect(multiColObj1.value).toBe('EASTC');
                expect(multiColObj1.index).toBe(18);
                done();
            }, 2000);
        });
    });

    describe('Custom value with initial rendering and dynamic change', () => {
        let multiColObj1: any;
        let element: HTMLInputElement;
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (multiColObj1) {
                multiColObj1.destroy();
                multiColObj1 = undefined;
            }
            remove(element);
        });
        it('text property in remote data', (done) => {
            let data: DataManager = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
                adaptor: new ODataV4Adaptor,
                crossDomain: true
            });
            let query: Query = new Query().select(['ContactName', 'CustomerID']).take(10);
            multiColObj1 = new MultiColumnComboBox({
                dataSource: data,
                query: query,
                fields: { text: 'ContactName', value: 'CustomerID' },
                columns: [{ field: 'ContactName', header: 'ContactName', width: 120 },
                          { field: 'CustomerID', width: 140, header: 'Customer ID' }],
                text: 'Ana Trujillo'
            });
            multiColObj1.appendTo(element);
            setTimeout(() => {
                expect(multiColObj1.inputEle.value).toBe('Ana Trujillo');
                expect(multiColObj1.text).toBe('Ana Trujillo');
                expect(multiColObj1.value).toBe('ANATR');
                expect(multiColObj1.index).toBe(1);
                done();
            }, 1200);
        });
    });

    describe('Custom value with initial rendering and dynamic change', () => {
        let multiColObj1: any;
        let element: HTMLInputElement;
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (multiColObj1) {
                multiColObj1.destroy();
                multiColObj1 = undefined;
            }
            remove(element);
        });
        it('index property in remote data', (done) => {
            let data: DataManager = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
                adaptor: new ODataV4Adaptor,
                crossDomain: true
            });
            multiColObj1 = new MultiColumnComboBox({
                dataSource: data,
                fields: { text: 'ContactName', value: 'CustomerID' },
                columns: [{ field: 'ContactName', header: 'ContactName', width: 120 },
                          { field: 'CustomerID', width: 140, header: 'Customer ID' }],
                index: 2
            });
            multiColObj1.appendTo(element);
            setTimeout(() => {
                expect(multiColObj1.inputEle.value).toBe('Antonio Moreno');
                expect(multiColObj1.text).toBe('Antonio Moreno');
                expect(multiColObj1.value).toBe('ANTON');
                expect(multiColObj1.index).toBe(2);
                done();
            }, 1200);
        });
    });

    describe('Properties with initial rendering and dynamic change', () => {
        let multiColObj: any;
        let element: HTMLInputElement;
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });
        it(' Readonly property ', () => {
            let isPopupOpen: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                readonly: true,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                open: (): void => {
                    isPopupOpen = true;
                },
                close: (): void => {
                    isPopupOpen = false;
                }
            });
            multiColObj.appendTo(element);
            expect(multiColObj.inputEle.readOnly).toBe(true);
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
            expect(isPopupOpen).toBe(false)
            multiColObj.readonly = false;
            multiColObj.dataBind();
            expect(multiColObj.inputEle.readOnly).toBe(false);
            multiColObj.focusIn();
            expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
            (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
            expect(isPopupOpen).toBe(true)
        });
        it(' Disabled property ', () => {
            let isPopupOpen: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                disabled: true,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                open: (): void => {
                    isPopupOpen = true;
                },
                close: (): void => {
                    isPopupOpen = false;
                }
            });
            multiColObj.appendTo(element);
            expect(multiColObj.inputEle.disabled).toBe(true);
            expect(multiColObj.element.getAttribute('aria-disabled')).toBe('true');
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
            expect(isPopupOpen).toBe(false)
            multiColObj.disabled = false;
            multiColObj.dataBind();
            expect(multiColObj.inputEle.disabled).toBe(false);
            expect(multiColObj.element.getAttribute('aria-disabled')).toBe('false');
            multiColObj.focusIn();
            expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
            (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
            expect(isPopupOpen).toBe(true);
            multiColObj.disabled = true;
            multiColObj.dataBind();
            expect(multiColObj.inputEle.disabled).toBe(true);
            multiColObj.focusIn();
            expect(multiColObj.inputWrapper.classList.contains('e-input-focus')).toBe(false);
            multiColObj.disabled = false;
            multiColObj.dataBind();
            expect(multiColObj.inputEle.disabled).toBe(false);
            multiColObj.focusIn();
            expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
            multiColObj.disabled = true;
            multiColObj.dataBind();
            expect(multiColObj.inputEle.disabled).toBe(true);
        });
        it(' CssClass property ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                cssClass: 'e-custom-class',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.inputWrapper.classList.contains('e-custom-class')).toBe(true);
            multiColObj.cssClass = 'e-new-class';
            multiColObj.dataBind();
            expect(multiColObj.inputWrapper.classList.contains('e-custom-class')).toBe(false);
            expect(multiColObj.inputWrapper.classList.contains('e-new-class')).toBe(true);
        });
        it(' Rtl property  ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                enableRtl: true,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.inputWrapper.classList.contains('e-rtl')).toBe(true);
            multiColObj.enableRtl = false;
            multiColObj.dataBind();
            expect(multiColObj.inputWrapper.classList.contains('e-rtl')).toBe(false);
        });
        it(' Persistence property  ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                enablePersistence: true,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.element.id).toBe('multicolumn-combobox_wrapper');
        });
        it(' ShowClearButton property  ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                showClearButton: true,
                value: 'PHP',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.value).toBe('PHP');
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            (multiColObj as any).inputObj.clearButton.dispatchEvent(clickEvent);
            expect(multiColObj.value).toBe(null);
            multiColObj.showClearButton = false;
            multiColObj.value = 'PHP';
            multiColObj.dataBind();
            expect(multiColObj.inputObj.clearButton).toBe(null);
            multiColObj.showClearButton = true;
            multiColObj.dataBind();
        });
        it(' No Record property  ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: [],
                noRecordsTemplate: 'Not found anything',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(document.querySelector('.e-no-records').innerHTML).toBe('Not found anything');
                multiColObj.noRecordsTemplate = 'Found Nothing',
                multiColObj.dataBind();
                setTimeout(() => {
                    expect(document.querySelector('.e-no-records').innerHTML).toBe('Found Nothing');
                    done();
                }, 1200);
            }, 1200);
        });
    });

    describe('Additional Properties with initial rendering and dynamic change', () => {
        let multiColObj: any;
        let element: HTMLInputElement;
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });

        it(' width property  ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                enablePersistence: true,
                fields: { text: 'text', value: 'id' },
                width: 500,
                popupHeight: 400,
                popupWidth: 600,
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.element.parentElement.style.width).toBe('500px');
            expect(multiColObj.popupEle.style.width).toBe('600px');
            expect(multiColObj.popupEle.style.maxHeight).toBe('400px');
            multiColObj.width = '600px';
            multiColObj.popupWidth = '500px';
            multiColObj.popupHeight = '500px';
            multiColObj.dataBind();
            expect(multiColObj.element.parentElement.style.width).toBe('600px');
            expect(multiColObj.popupEle.style.width).toBe('500px');
            expect(multiColObj.popupEle.style.maxHeight).toBe('500px');
            multiColObj.width = null;
            multiColObj.dataBind();
            expect(multiColObj.element.parentElement.style.width).toBe('600px');
        });
        it(' Index property  ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                index: 1,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.text).toBe('HTML');
            setTimeout(() => {
                multiColObj.index = 5;
                multiColObj.dataBind();
                expect(multiColObj.text).toBe('HTMLCSS');
                done();
            }, 1200);
        });
        it(' Float Label property  ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                floatLabelType: 'Always',
                placeholder: 'Always Float Label',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(document.querySelector('.e-float-text').innerHTML).toBe('Always Float Label');
            multiColObj.floatLabelType = 'Never';
            multiColObj.placeholder = 'Updated placeholder value';
            multiColObj.dataBind();
            setTimeout(() => {
                expect(document.querySelector('.e-float-text')).toBe(null);
                multiColObj.floatLabelType = 'Always';
                multiColObj.showClearButton = true;
                multiColObj.dataBind();
                multiColObj.focusIn();
                multiColObj.disabled = true;
                multiColObj.readOnly = true;
                multiColObj.dataBind();
                multiColObj.focusOut();
                multiColObj.disabled = false;
                multiColObj.readOnly = false;
                multiColObj.dataBind();
                multiColObj.focusOut();
                done();
            }, 1200);
        });
        it(' Fields property  ', function (done) {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                index: 4,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.value).toBe('list2');
            multiColObj.fields = { text: 'id', value: 'text' };
            multiColObj.dataBind();
            setTimeout(function () {
                expect(multiColObj.text).toBe('PYTHON');
                done();
            }, 1200);
        });
        it(' Columns property  ', function (done) {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                index: 4,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            setTimeout(function () {
                expect(multiColObj.columns[0].field).toBe('text');
                multiColObj.columns = [{ field: 'id', header: 'ID' }, { field: 'text', header: 'Language' }];
                multiColObj.dataBind();
                setTimeout(function () {
                    expect(multiColObj.columns[0].field).toBe('id');
                    done();
                }, 1200);
            }, 1200);
        });
        it(' DataSource property  ', function (done) {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                index: 1,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                groupTemplate: '<div class="e-group-temp">Key is: ${key}, Field is: ${field}, Count is: ${count}</div>'
            });
            multiColObj.appendTo(element);
            expect(multiColObj.gridObj.dataSource[1].text).toBe('HTML');
            multiColObj.dataSource = [
                { subject: 'eee', id: 'list2', text: 'PYTHON' }, { subject: 'ece', id: 'list5', text: 'HTMLCSS' },
                { subject: 'cse', id: 'list6', text: 'JAVASCRIPT' }, { subject: 'eee', id: 'list7', text: 'SQL' },
                { subject: 'ece', id: 'list8', text: 'C#' }, { subject: 'cse', id: 'id2', text: 'PHP' },
                { subject: 'eee', id: 'id1', text: 'HTML' }, { subject: 'ece', id: 'id3', text: 'PERL' },
                { subject: 'cse', id: 'list1', text: 'JAVA' }
            ];
            multiColObj.dataBind();
            setTimeout(function () {
                expect(multiColObj.gridObj.dataSource[1].text).toBe('HTMLCSS');
                done();
            }, 1200);
        });
        it(' DataSource property dynamic change with empty data ', function (done) {
            multiColObj = new MultiColumnComboBox({
                dataSource: [],
                index: 1,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                groupTemplate: '<div class="e-group-temp">Key is: ${key}, Field is: ${field}, Count is: ${count}</div>'
            });
            multiColObj.appendTo(element);
            expect(multiColObj.gridObj.dataSource.length).toBe(0);
            multiColObj.dataSource = [
                { subject: 'eee', id: 'list2', text: 'PYTHON' }, { subject: 'ece', id: 'list5', text: 'HTMLCSS' },
                { subject: 'cse', id: 'list6', text: 'JAVASCRIPT' }, { subject: 'eee', id: 'list7', text: 'SQL' },
                { subject: 'ece', id: 'list8', text: 'C#' }, { subject: 'cse', id: 'id2', text: 'PHP' },
                { subject: 'eee', id: 'id1', text: 'HTML' }, { subject: 'ece', id: 'id3', text: 'PERL' },
                { subject: 'cse', id: 'list1', text: 'JAVA' }
            ];
            multiColObj.dataBind();
            expect((multiColObj as any).popupObj.element.querySelector('.e-multicolumn-grid') != null).toEqual(true);
            setTimeout(function () {
                expect(multiColObj.gridObj.dataSource[1].text).toBe('HTMLCSS');
                done();
            }, 1200);
        });
        it(' DataSource property dynamic change with remotedata data ', function (done) {
            let dataSource: DataManager = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
                adaptor: new ODataV4Adaptor,
                crossDomain: true
            });
            let dynamicDataSource: DataManager = new DataManager({
                url: 'https://services.syncfusion.com/js/production/api/Employees',
                adaptor: new WebApiAdaptor,
                crossDomain: true
            });
            multiColObj = new MultiColumnComboBox({
                dataSource: dataSource,
                fields: { text: 'ContactName', value: 'CustomerID' },
                columns: [{ field: 'ContactName', header: 'ContactName', width: 120 },
                    { field: 'CustomerID', width: 140, header: 'Customer ID' }],
            });
            multiColObj.appendTo(element);
            multiColObj.columns = [
                { field: 'EmployeeID', header: 'Employee ID', width: 120 },
                { field: 'FirstName', header: 'Name', width: 130 },
                { field: 'Designation', header: 'Designation', width: 120 },
                { field: 'Country', header: 'Country', width: 90 },
            ];
            multiColObj.dataBind();
            multiColObj.fields = { text: 'FirstName', value: 'EmployeeID' };
            multiColObj.dataBind();
            multiColObj.dataSource = dynamicDataSource;
            multiColObj.dataBind();
            multiColObj.index = 0;
            multiColObj.dataBind();
            expect(multiColObj.popupObj.element.querySelector('.e-multicolumn-grid') != null).toEqual(true);
            setTimeout(function () {
                expect(multiColObj.inputEle.value).toBe('Andrew Fuller');
                expect(multiColObj.text).toBe('Andrew Fuller');
                expect(multiColObj.value).toBe('1');
                expect(multiColObj.index).toBe(0);
                done();
            }, 1800);
        });
        it(' Query property  ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                query: new Query().select(['text', 'id']).take(3)
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(multiColObj.gridObj.getRows().length).toBe(3);
                multiColObj.query = new Query().select(['text', 'id']).take(6);
                multiColObj.dataBind();
                setTimeout(() => {
                    expect(multiColObj.gridObj.getRows().length).toBe(6);
                    done();
                }, 1200);
            }, 1200);
        });
        it(' Allow sorting property  ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                allowSorting: true,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.gridObj.allowSorting).toBe(true);
            setTimeout(() => {
                multiColObj.allowSorting = false;
                multiColObj.dataBind();
                expect(multiColObj.gridObj.allowSorting).toBe(false);
                done();
            }, 1200);
        });
        it(' Sort Type property on property change ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                sortType: SortType.OneColumn,
                fields: { text: 'text', value: 'id' },
                allowSorting: true,
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.gridObj.allowMultiSorting).toBe(false);
            multiColObj.sortType = SortType.MultipleColumns;
            multiColObj.dataBind();
            setTimeout(() => {
                expect(multiColObj.gridObj.allowMultiSorting).toBe(true);
                done();
            }, 1200);
        });
        it(' Sort Type property ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                sortType: SortType.MultipleColumns,
                fields: { text: 'text', value: 'id' },
                allowSorting: true,
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.gridObj.allowMultiSorting).toBe(true);
        });
        it(' Sort Order property  ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                sortOrder: SortOrder.Ascending,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.gridObj.sortSettings.columns[0].direction).toBe(SortOrder.Ascending);
            multiColObj.sortOrder = SortOrder.Descending;
            multiColObj.dataBind();
            setTimeout(() => {
                expect(multiColObj.gridObj.sortSettings.columns[0].direction).toBe(SortOrder.Descending);
                done();
            }, 1200);
        });
        it(' Sort Order property Alternate', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                sortOrder: SortOrder.Descending,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.gridObj.sortSettings.columns[0].direction).toBe(SortOrder.Descending);
            multiColObj.sortOrder = SortOrder.Ascending;
            multiColObj.dataBind();
            setTimeout(() => {
                expect(multiColObj.gridObj.sortSettings.columns[0].direction).toBe(SortOrder.Ascending);
                done();
            }, 1200);
        });
    });

    describe('Additional Properties with initial rendering and dynamic change for enableVirtualization', () => {
        let multiColObj: any;
        let element: HTMLInputElement;
        let isPopupClose: boolean = false;
        let isPopupOpen: boolean = false;
        let eventDetails: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: null,
            key: null,
            target: null,
            currentTarget: null,
            stopImmediatePropagation: (): void => { /** NO Code */ }
        };
        beforeAll((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });
        it(' Enable Virtualization property dynamic chang ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                enableVirtualization: true,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.gridObj.enableVirtualization).toBe(true);
            multiColObj.enableVirtualization = false;
            multiColObj.dataBind();
            setTimeout(() => {
                expect(multiColObj.gridObj.enableVirtualization).toBe(false);
                done();
            }, 1200);
        });
        it(' Enable Virtualization property with data', (done) => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                shiftKey: false,
                action: null,
                key: null,
                target: null,
                currentTarget: null,
                altKey: null,
                stopImmediatePropagation: (): void => { /** NO Code */ }
            };
            let event = new Event('input', {
                bubbles: true,
                cancelable: true
            });
            multiColObj = new MultiColumnComboBox({
                dataSource: dataValue(150),
                enableVirtualization: true,
                fields: { text: 'Engineer', value: 'TaskID'},
                placeholder: 'Select an engineer',
                popupHeight: '230px',
                gridSettings: { rowHeight: 40 },
                columns: [
                    { field: 'TaskID', header: 'Task ID', width: 70 },
                    { field: 'Engineer', header: 'Engineer', width: 100 },
                    { field: 'Designation', header: 'Designation', width: 100 },
                    { field: 'Estimation', header: 'Estimation', width: 90 },
                    { field: 'Status', header: 'Status', width: 90, }
                ]
            });
            multiColObj.appendTo(element);
            multiColObj.showPopup();
            setTimeout(() => {
                keyEventArgs.action = 'end';
                multiColObj.keyActionHandler(keyEventArgs);
                multiColObj.hidePopup();
                multiColObj.showPopup();
                multiColObj.keyActionHandler(keyEventArgs);
                keyEventArgs.action = 'moveUp';
                multiColObj.keyActionHandler(keyEventArgs);
                keyEventArgs.action = 'enter';
                multiColObj.keyActionHandler(keyEventArgs);
                element.value = element.value.slice(0, element.value.length - 1);
                element.dispatchEvent(event);
                setTimeout(() => {
                    expect(multiColObj.gridObj.element.querySelectorAll('.e-row')[0].classList.contains('e-row-focus')).toBe(true);
                    // for coverage
                    keyEventArgs.action = 'end';
                    multiColObj.keyActionHandler(keyEventArgs);
                    setTimeout(() => {
                        expect(multiColObj.gridObj.element.querySelectorAll('.e-row')[0].classList.contains('e-row-focus')).toBe(false);
                        done();
                    }, 1600);
                }, 1000);
            });
        });
              
        it(' Enable Virtualization property  ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: dataValue(),
                enableVirtualization: true,
                gridSettings: { rowHeight: 40 },
                fields: { text: 'Engineer', value: 'Designation'},
                columns: [
                        { field: 'TaskID', header: 'Task ID', width: 100 },
                        { field: 'Engineer', header: 'Engineer', width: 100 },
                        { field: 'Designation', header: 'Designation', width: 100 },
                        { field: 'Estimation', header: 'Estimation', width: 100 },
                        { field: 'Status', header: 'Status', width: 100,}
                    ],
                open: (args: PopupEventArgs) => {
                    eventDetails = args.event;
                    isPopupOpen = true;
                },
                close: () => {
                    isPopupClose = true;
                }
            });
            multiColObj.appendTo(element);
            expect(multiColObj.gridObj.enableVirtualization).toBe(true);
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                setTimeout(() => {
                    multiColObj.keyActionHandler(keyEventArgs);
                    expect(isPopupOpen).toBe(true);
                    expect(eventDetails.action).toBe('altDown');
                    keyEventArgs.action = 'moveDown';
                    multiColObj.keyActionHandler(keyEventArgs);
                    multiColObj.gridObj.selectedRowIndex = 0;
                    expect(multiColObj.gridObj.selectedRowIndex).toBe(0);
                    multiColObj.gridObj.selectedRowIndex = 1;
                    keyEventArgs.action = 'moveUp';
                    multiColObj.gridKeyActionHandler(keyEventArgs, true);
                    multiColObj.gridObj.selectedRowIndex = 0;
                    expect(multiColObj.gridObj.selectedRowIndex).toBe(0);
                    multiColObj.gridObj.selectedRowIndex = 0;
                    expect(isPopupClose).toBe(false);
                    keyEventArgs.action = 'moveDown';
                    multiColObj.gridKeyActionHandler(keyEventArgs, true);
                    multiColObj.gridObj.selectedRowIndex = 1;
                    expect(multiColObj.gridObj.selectedRowIndex).toBe(1);
                    expect(isPopupClose).toBe(false);
                    keyEventArgs.action = 'escape';
                    multiColObj.gridKeyActionHandler(keyEventArgs, true);
                    expect(isPopupClose).toBe(true);
                    done();
                }, 1800);
            }, 1800);
        });
    });

    describe('Grid properties with initial rendering and dynamic change', () => {
        let multiColObj: any;
        let element: HTMLInputElement;
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });
        it(' Width and textalign property ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language', width: 120, textAlign: 'Right' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect((multiColObj as any).gridObj.columns[0].width).toBe(120);
            expect((multiColObj as any).gridObj.columns[0].textAlign).toBe('Right');
        });
        it(' format property ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language', format: 'C2' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect((multiColObj as any).gridObj.columns[0].format).toBe('C2');
        });
        it(' displayAsCheckBox property ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: [
                    { id: 101, text: 'PHP' }, { id: 102, text: 'HTML' }, { id: 103, text: 'PERL' },
                    { id: 104, text: 'JAVA' }, { id: 105, text: 'PYTHON' }, { id: 106, text: 'HTMLCSS' }
                ],
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID', displayAsCheckBox: true }],
            });
            multiColObj.appendTo(element);
            expect((multiColObj as any).gridObj.columns[1].displayAsCheckBox).toBe(true);
        });
        it(' allowTextWrap and textWrapMode property', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: [
                    { id: 101, text: 'PHP' }, { id: 102, text: 'HTML' }, { id: 103, text: 'PERL' },
                    { id: 104, text: 'JAVA' }, { id: 105, text: 'PYTHON' }, { id: 106, text: 'HTMLCSS' }
                ],
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Languages known' }, { field: 'id', header: 'ID' }],
                gridSettings: { allowTextWrap: true, textWrapMode: 'Both' }
            });
            multiColObj.appendTo(element);
            expect((multiColObj as any).gridObj.allowTextWrap).toBe(true);
            expect((multiColObj as any).gridObj.textWrapSettings.wrapMode).toBe('Both');
            (multiColObj as any).gridSettings.textWrapMode = 'Content';
            multiColObj.dataBind();
            expect((multiColObj as any).gridObj.textWrapSettings.wrapMode).toBe('Content');
            (multiColObj as any).gridSettings.allowTextWrap = false;
            multiColObj.dataBind();
            expect((multiColObj as any).gridObj.allowTextWrap).toBe(false);
        });
        it(' groupBy property ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect((multiColObj as any).gridObj.groupSettings.columns.length).toBe(1);
            expect((multiColObj as any).gridObj.groupSettings.columns[0]).toBe('text');
            setTimeout(function () {
                expect(multiColObj.popupEle.querySelector('.e-groupcaption').innerText).toBe('Language: C# - 1 item');
                done();
            }, 1200);
        });
        it(' Actionbegin event testing ', () => {
            let actionBegin: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                actionBegin: (): void => {
                    actionBegin = true;
                }
            });
            multiColObj.appendTo(element);
            (multiColObj as any).gridObj.trigger('actionBegin', { requestType: 'filtering' });
            expect(actionBegin).toBe(true);
        });
        it(' Actionfailure event testing ', () => {
            let actionFailure: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: [],
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                actionFailure: (): void => {
                    actionFailure = true;
                }
            });
            multiColObj.appendTo(element);
            (multiColObj as any).gridObj.trigger('actionFailure', { requestType: 'filtering' });
            expect(actionFailure).toBe(true);
        });
        it(' Filtering event testing ', () => {
            let filtering: boolean = false;
            let text: string = '';
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                filtering: (args: FilteringEventArgs): void => {
                    text = args.text;
                    filtering = true;
                }
            });
            multiColObj.appendTo(element);
            multiColObj.trigger('filtering', { text: 'JAVA' });
            expect(filtering).toBe(true);
            expect(text).toBe('JAVA');
        });
        it(' no Records testing', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: [],
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            (multiColObj as any).inputObj.buttons[0].dispatchEvent(clickEvent);
            multiColObj.gridObj.selectedRowIndex = 0;
            setTimeout(function () {
                let noRecordEle: HTMLElement = multiColObj.popupEle.querySelector('.e-nodata');
                expect(noRecordEle.innerText).toBe('No records found');
                done();
            }, 1200);
        });
        it('format & displayAsCheckBox - property priority check', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: [
                    { OrderID: 101, Freight: 32.38, OrderDate: new Date(8364186e5) }, { OrderID: 102, Freight: 11.61, OrderDate: new Date(836505e6) },
                    { OrderID: 103, Freight: 65.83, OrderDate: new Date(8367642e5) }, { OrderID: 104, Freight: 41.34, OrderDate: new Date(8367642e5) }
                ],
                fields: { text: 'OrderID', value: 'Freight' },
                columns: [
                    { field: 'OrderID', header: 'Order ID' },
                    { field: 'Freight', header: 'Freight', displayAsCheckBox: true },
                    { field: 'OrderDate', header: 'Order Date', format: 'yMd', displayAsCheckBox: true }
                ]
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(multiColObj.gridObj.getContent().querySelectorAll('.e-rowcell')[1].classList.contains('e-gridchkbox-cell')).toBe(true);
                expect(multiColObj.gridObj.columns[2].format).toBe('yMd');
                expect(multiColObj.gridObj.getContent().querySelectorAll('.e-rowcell')[2].classList.contains('e-gridchkbox-cell')).toBe(false);
                done();
            }, 1200);
        });
    });

    describe('Grid properties with initial rendering and dynamic change', () => {
        let multiColObj: any;
        let element: HTMLInputElement;
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });
        it(' ActionComplete event testing ', () => {
            let actionComplete: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                actionComplete: (): void => {
                    actionComplete = true;
                }
            });
            multiColObj.appendTo(element);
            (multiColObj as any).gridObj.trigger('actionComplete', { requestType: 'filtering' });
            expect(actionComplete).toBe(true);
        });
        it(' ActionComplete event testing with sorting ', (done) => {
            let actionComplete: boolean = false;
            let actionCompleteSort: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                text: 'JAVA',
                actionComplete: (args): void => {
                    actionComplete = true;
                    if (args.requestType === 'sorting') { actionCompleteSort = true; }
                }
            });
            multiColObj.appendTo(element);
            setTimeout(function () {
                let dataRowsObject: Object = (multiColObj as any).gridObj.getRowsObject();
                (multiColObj as any).gridObj.trigger('actionComplete', { requestType: 'sorting', rows: dataRowsObject });
                expect(actionComplete).toBe(true);
                done();
            }, 1200);
        });
        it('Column Resizing property rendering', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                gridSettings: { allowResizing: false }
            });
            multiColObj.appendTo(element);
            expect((multiColObj as any).gridObj.allowResizing).toBe(false);
        });
        it('Column Resizing property with different value rendering', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                gridSettings: { allowResizing: true }
            });
            multiColObj.appendTo(element);
            expect((multiColObj as any).gridObj.allowResizing).toBe(true);
        });
        it('Column Resizing property Dynamic rendering', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                gridSettings: { allowResizing: false }
            });
            multiColObj.appendTo(element);
            expect((multiColObj as any).gridObj.allowResizing).toBe(false);
            multiColObj.gridSettings.allowResizing = true;
            multiColObj.dataBind();
            expect((multiColObj as any).gridObj.allowResizing).toBe(true);
        });
        it(' Resizing event testing ', () => {
            let resizing: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                gridSettings: { resizing: (): void => { resizing = true; } }
            });
            multiColObj.appendTo(element);
            (multiColObj as any).gridObj.trigger('resizing', { requestType: 'filtering' });
            expect(resizing).toBe(true);
        });
        it(' ResizeStart event testing ', () => {
            let resizeStart: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                gridSettings: { resizeStart: (): void => { resizeStart = true; } }
            });
            multiColObj.appendTo(element);
            (multiColObj as any).gridObj.trigger('resizeStart', { requestType: 'filtering' });
            expect(resizeStart).toBe(true);
        });
        it(' ResizeStop event testing ', () => {
            let resizeStop: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                gridSettings: { resizeStop: (): void => { resizeStop = true; } }
            });
            multiColObj.appendTo(element);
            (multiColObj as any).gridObj.trigger('resizeStop', { requestType: 'filtering' });
            expect(resizeStop).toBe(true);
        });
    });

    describe(' Keyboard interaction ', () => {
        let multiColObj: any;
        let element: HTMLInputElement;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            shiftKey: false,
            action: null,
            key: null,
            target: null,
            currentTarget: null,
            altKey: null,
            stopImmediatePropagation: (): void => { /** NO Code */ }
        };
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterEach((): void => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });
        it(' focus the component ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            expect(multiColObj.inputWrapper.classList.contains('e-input-focus')).toBe(true);
        });
        it(' key press - alt + down arrow ', (done) => {
            let eventDetails: any;
            let isPopupOpen: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }],
                open: (args: PopupEventArgs) => {
                    eventDetails = args.event;
                    isPopupOpen = true;
                }
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                expect(isPopupOpen).toBe(true);
                expect(eventDetails.action).toBe('altDown');
                done();
            }, 1200);
        });
        it(' key press - alt + up arrow - without open popup ', () => {
            let isPopupOpen: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }],
                open: () => { isPopupOpen = true; }
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altUp';
            multiColObj.keyActionHandler(keyEventArgs);
            expect(isPopupOpen).toBe(false);
        });
        it(' key press - escape ', (done) => {
            let isPopupClose: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }],
                close: () => {
                    isPopupClose = true;
                }
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                expect(isPopupClose).toBe(false);
                keyEventArgs.action = 'escape';
                multiColObj.keyActionHandler(keyEventArgs);
                expect(isPopupClose).toBe(true);
                done();
            }, 1200);
        });
        it(' key press - mouse down and mouse up ', (done) => {
            let isPopupClose: boolean = false;
            let isPopupOpen: boolean = false;
            let eventDetails: any;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                open: (args: PopupEventArgs) => {
                    eventDetails = args.event;
                    isPopupOpen = true;
                },
                close: () => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                expect(isPopupOpen).toBe(true);
                expect(eventDetails.action).toBe('altDown');
                keyEventArgs.action = 'moveDown';
                multiColObj.keyActionHandler(keyEventArgs);
                expect(multiColObj.gridObj.selectedRowIndex).toBe(0);
                multiColObj.gridObj.selectedRowIndex = 1;
                keyEventArgs.action = 'moveUp';
                multiColObj.gridKeyActionHandler(keyEventArgs, true);
                expect(multiColObj.gridObj.selectedRowIndex).toBe(0);
                multiColObj.gridObj.selectedRowIndex = 0;
                expect(isPopupClose).toBe(false);
                keyEventArgs.action = 'moveDown';
                multiColObj.gridKeyActionHandler(keyEventArgs, true);
                expect(multiColObj.gridObj.selectedRowIndex).toBe(1);
                expect(isPopupClose).toBe(false);
                keyEventArgs.action = 'escape';
                multiColObj.gridKeyActionHandler(keyEventArgs, true);
                expect(isPopupClose).toBe(true);
                done();
            }, 1200);
        });
        it(' key press - mouse down and enter key ', (done) => {
            let isPopupClose: boolean = false;
            let isPopupOpen: boolean = false;
            let eventDetails: any;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                open: (args: PopupEventArgs) => {
                    eventDetails = args.event;
                    isPopupOpen = true;
                },
                close: () => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                expect(isPopupOpen).toBe(true);
                expect(eventDetails.action).toBe('altDown');
                keyEventArgs.action = 'moveDown';
                multiColObj.keyActionHandler(keyEventArgs);
                expect(multiColObj.gridObj.selectedRowIndex).toBe(0);
                keyEventArgs.key = 'Enter';
                multiColObj.gridObj.keyPressed(keyEventArgs);
                expect(isPopupClose).toBe(true);
                setTimeout(() => {
                    expect(multiColObj.inputEle.value).toBe('PHP');
                    done();
                }, 1200);
            }, 1200);
        });
        it(' key press - move down and tab key', (done) => {
            let isPopupClose: boolean = false;
            let isPopupOpen: boolean = false;
            let eventDetails: any;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                open: (args: PopupEventArgs) => {
                    eventDetails = args.event;
                    isPopupOpen = true;
                },
                close: () => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                expect(isPopupOpen).toBe(true);
                expect(eventDetails.action).toBe('altDown');
                keyEventArgs.action = 'moveDown';
                multiColObj.keyActionHandler(keyEventArgs);
                expect(multiColObj.gridObj.selectedRowIndex).toBe(0);
                keyEventArgs.action = 'tab';
                multiColObj.gridObj.keyPressed(keyEventArgs);
                expect(isPopupClose).toBe(true);
                setTimeout(() => {
                    expect(multiColObj.inputEle.value).toBe('PHP');
                    done();
                }, 1200);
            }, 1200);
        });
        it(' key press - move down and shiftTab key', (done) => {
            let isPopupClose: boolean = false;
            let isPopupOpen: boolean = false;
            let eventDetails: any;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                open: (args: PopupEventArgs) => {
                    eventDetails = args.event;
                    isPopupOpen = true;
                },
                close: () => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                expect(isPopupOpen).toBe(true);
                expect(eventDetails.action).toBe('altDown');
                keyEventArgs.action = 'moveDown';
                multiColObj.keyActionHandler(keyEventArgs);
                expect(multiColObj.gridObj.selectedRowIndex).toBe(0);
                keyEventArgs.action = 'shiftTab';
                multiColObj.gridObj.keyPressed(keyEventArgs);
                expect(isPopupClose).toBe(true);
                setTimeout(() => {
                    expect(multiColObj.inputEle.value).toBe('PHP');
                    done();
                }, 1200);
            }, 1200);
        });
        it(' key press - move down and altUp key', (done) => {
            let isPopupClose: boolean = false;
            let isPopupOpen: boolean = false;
            let eventDetails: any;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                open: (args: PopupEventArgs) => {
                    eventDetails = args.event;
                    isPopupOpen = true;
                },
                close: () => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                expect(isPopupOpen).toBe(true);
                expect(eventDetails.action).toBe('altDown');
                keyEventArgs.action = 'moveDown';
                multiColObj.keyActionHandler(keyEventArgs);
                expect(multiColObj.gridObj.selectedRowIndex).toBe(0);
                keyEventArgs.action = 'altUp';
                multiColObj.gridObj.keyPressed(keyEventArgs);
                expect(isPopupClose).toBe(true);
                setTimeout(() => {
                    expect(multiColObj.inputEle.value).toBe('PHP');
                    done();
                }, 1200);
            }, 1200);
        });
        it(' key press - enter key ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            multiColObj.showPopup();
            setTimeout(() => {
                keyEventArgs.action = 'end';
                multiColObj.keyActionHandler(keyEventArgs);
                keyEventArgs.key = 'Enter';
                (multiColObj as any).handleKeyPressed(keyEventArgs);
                setTimeout(() => {
                    expect(multiColObj.value).toBe('list7');
                    expect(multiColObj.text).toBe('SQL');
                    done();
                }, 1200);
            }, 1200);
        });
        it(' key press - enter key with home key as branch', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            multiColObj.showPopup();
            setTimeout(() => {
                keyEventArgs.action = 'home';
                multiColObj.keyActionHandler(keyEventArgs);
                keyEventArgs.key = 'Enter';
                (multiColObj as any).handleKeyPressed(keyEventArgs);
                setTimeout(() => {
                    expect(multiColObj.value).toBe('id2');
                    expect(multiColObj.text).toBe('PHP');
                    done();
                }, 1200);
            }, 1200);
        });
        it(' key press - shift and tab ', (done) => {
            let isPopupClose: boolean = false;
            let isPopupOpen: boolean = false;
            let eventDetails: any;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                open: (args: PopupEventArgs) => {
                    eventDetails = args.event;
                    isPopupOpen = true;
                },
                close: () => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                expect(isPopupOpen).toBe(true);
                keyEventArgs.action = 'moveDown';
                multiColObj.keyActionHandler(keyEventArgs);
                keyEventArgs.key = 'Tab';
                keyEventArgs.shiftKey = true;
                multiColObj.gridKeyActionHandler(keyEventArgs, true);
                setTimeout(() => {
                    expect(isPopupClose).toBe(true);
                    expect(multiColObj.text).toBe('PHP');
                    done();
                }, 1200);
            }, 1200);
        });
        it(' key press - alt key and ArrowUp ', (done) => {
            let isPopupClose: boolean = false;
            let isPopupOpen: boolean = false;
            let eventDetails: any;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                open: (args: PopupEventArgs) => {
                    eventDetails = args.event;
                    isPopupOpen = true;
                },
                close: () => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                expect(isPopupOpen).toBe(true);
                keyEventArgs.action = 'moveDown';
                multiColObj.keyActionHandler(keyEventArgs);
                keyEventArgs.key = 'ArrowUp';
                keyEventArgs.altKey = true;
                multiColObj.gridKeyActionHandler(keyEventArgs, true);
                setTimeout(() => {
                    expect(isPopupClose).toBe(true);
                    expect(multiColObj.text).toBe('PHP');
                    done();
                }, 1200);
            }, 1200);
        });
        it(' key press - move down at the end ', (done) => {
            let isPopupOpen: boolean = false;
            let multiColumnObj: any = new MultiColumnComboBox({
                dataSource: languageData,
                index: 8,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                open: () => {
                    isPopupOpen = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColumnObj.appendTo(element);
            multiColumnObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColumnObj.keyActionHandler(keyEventArgs);
                expect(isPopupOpen).toBe(true);
                keyEventArgs.action = 'moveDown';
                multiColumnObj.gridKeyActionHandler(keyEventArgs, true);
                expect(multiColumnObj.index).toBe(8);
                done();
            }, 1200);
        });
    });

    describe(' Keyboard interaction ', () => {
        let multiColObj: any;
        let element: HTMLInputElement;
        var element2: HTMLInputElement;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            shiftKey: false,
            action: null,
            key: null,
            target: null,
            currentTarget: null,
            altKey: null,
            stopImmediatePropagation: (): void => { /** NO Code */ }
        };
        let event = new Event('input', {
            bubbles: true,
            cancelable: true
        });
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
            element2 = <HTMLInputElement>createElement('div', { id: 'domElement' });
            document.body.appendChild(element2);
        });
        afterEach((): void => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
            remove(element2);
        });
        it(' key press - alt key and update input with mismatch value ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                element.value = 'P';
                setTimeout(() => {
                    element.dispatchEvent(event);
                    let clickEvent: MouseEvent = document.createEvent('MouseEvents');
                    clickEvent.initEvent('mousedown', true, true);
                    document.querySelector('#domElement').dispatchEvent(clickEvent);
                    setTimeout(() => {
                        expect(multiColObj.text).toBe(null);
                        done();
                    }, 1000);
                }, 1300);
            }, 2500);
        });
        it(' key press - alt key and update input with exact value ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                element.value = 'PHP';
                (multiColObj as any).exactMatchedContent = 'PHP';
                setTimeout(() => {
                    element.dispatchEvent(event);
                    let clickEvent: MouseEvent = document.createEvent('MouseEvents');
                    clickEvent.initEvent('mousedown', true, true);
                    document.querySelector('#domElement').dispatchEvent(clickEvent);
                    setTimeout(() => {
                        expect(multiColObj.text).toBe('PHP');
                        done();
                    }, 1000);
                }, 1300);
            }, 2500);
        });
        it(' input value update behaviour on enter keydown ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            setTimeout(() => {
                multiColObj.keyActionHandler(keyEventArgs);
                element.value = 'P';
                setTimeout(() => {
                    (multiColObj as any).updateInputValue('P');
                    keyEventArgs.action = 'enter';
                    multiColObj.keyActionHandler(keyEventArgs);
                    setTimeout(() => {
                        expect(multiColObj.text).toBe('PHP');
                        done();
                    }, 1000);
                }, 1300);
            }, 2500);
        });
    });

   describe('Events', () => {
        let multiColObj2: MultiColumnComboBox;
        let element: HTMLInputElement;
        // Manually dispatch the input event
        let event = new Event('input', {
            bubbles: true,
            cancelable: true
        });
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
            element.dispatchEvent(event);
        });
        afterEach((): void => {
            if (multiColObj2) {
                multiColObj2.destroy();
                multiColObj2 = undefined;
            }
            remove(element);
        });
        it('Filtering Event', (done) => {
            let filtering: Boolean = false;
            multiColObj2 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                allowFiltering: false,
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                filtering: (args: FilteringEventArgs) => {
                    filtering = true;
                }
            });
            multiColObj2.appendTo(element);
            element.value = 'a';
            element.dispatchEvent(event);
            expect(filtering).toBe(false);
            setTimeout(() => {
                multiColObj2.allowFiltering = true;
                multiColObj2.dataBind();
                element.value = 'b';
                element.dispatchEvent(event);
                expect(filtering).toBe(true);
                done();
            }, 1200);
        });
        it('Filtering Event filterType property startswith checking', (done) => {
            multiColObj2 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                allowFiltering: true,
                filterType: 'startswith'
            });
            multiColObj2.appendTo(element);
            element.value = 'j';
            element.dispatchEvent(event);
            setTimeout(() => {
                expect((multiColObj2 as any).gridObj.dataSource.length).toBe(2);
                done();
            }, 1200);
        });
        it('Filtering Event filterType property contains checking', (done) => {
            multiColObj2 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                allowFiltering: true,
                filterType: 'contains'
            });
            multiColObj2.appendTo(element);
            element.value = '#';
            element.dispatchEvent(event);
            setTimeout(() => {
                expect((multiColObj2 as any).gridObj.dataSource.length).toBe(1);
                done();
            }, 1200);
        });
        it('Filtering Event filterType property default checking', (done) => {
            multiColObj2 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                allowFiltering: true,
                filterType: 'not'
            });
            multiColObj2.appendTo(element);
            element.value = 'j';
            element.dispatchEvent(event);
            setTimeout(() => {
                expect((multiColObj2 as any).gridObj.dataSource.length).toBe(9);
                done();
            }, 1200);
        });
        it('Filtering Event filterType property endswith checking', (done) => {
            multiColObj2 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                allowFiltering: true,
                filterType: 'endswith'
            });
            multiColObj2.appendTo(element);
            element.value = 'l';
            element.dispatchEvent(event);
            setTimeout(() => {
                expect((multiColObj2 as any).gridObj.dataSource.length).toBe(3);
                multiColObj2.filterType = 'startswith';
                element.value = 'a';
                multiColObj2.dataBind();
                element.dispatchEvent(event);
                setTimeout(() => {
                    //expect((multiColObj2 as any).gridObj.dataSource.length).toBe(1);
                    done();
                }, 1200);
            }, 1200);
        });
        it('Filtering Event with remote data', (done) => {
            let filtering: Boolean = false;
            let dataSource: DataManager = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
                adaptor: new ODataV4Adaptor,
                crossDomain: true
            });
            multiColObj2 = new MultiColumnComboBox({
                dataSource: dataSource,
                fields: { text: 'ContactName', value: 'CustomerID' },
                columns: [{ field: 'ContactName', header: 'ContactName', width: 120 },
                          { field: 'CustomerID', width: 140, header: 'Customer ID' }],
                filtering: (args: FilteringEventArgs) => {
                    filtering = true;
                }
            });
            multiColObj2.appendTo(element);
            element.value = 'a';
            element.dispatchEvent(event);
            setTimeout(() => {
                expect(filtering).toBe(true);
                done();
            }, 1200);
        });
        it('Filtering Event with starstwith operator and dynamic query update data', (done) => {
            multiColObj2 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                allowFiltering: true,
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                filtering: (args: FilteringEventArgs) => {
                    let query = new Query().select(['subject', 'id', 'text']).search(args.text, ['subject', 'id', 'text'], 'startswith', true);
                    args.updateData(languageData, query);
                }
            });
            multiColObj2.appendTo(element);
            element.value = 'c';
            element.dispatchEvent(event);
            setTimeout(() => {
                expect((multiColObj2 as any).gridObj.dataSource.length).toBe(4);
                done();
            }, 1200);
        });
        it('Filtering Event with endswith operator and dynamic query update data', (done) => {
            multiColObj2 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                allowFiltering: true,
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                filtering: (args: FilteringEventArgs) => {
                    let query = new Query().select(['subject', 'id', 'text']).search(args.text, ['subject', 'id', 'text'], 'endswith', true);
                    args.updateData(languageData, query);
                }
            });
            multiColObj2.appendTo(element);
            element.value = '1';
            element.dispatchEvent(event);
            setTimeout(() => {
                expect((multiColObj2 as any).gridObj.dataSource.length).toBe(2);
                done();
            }, 1200);
        });
        it('Filtering Event with contains operator and dynamic query update data', (done) => {
            multiColObj2 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                allowFiltering: true,
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                filtering: (args: FilteringEventArgs) => {
                    let query = new Query().select(['subject', 'id', 'text']).search(args.text, ['subject', 'id', 'text'], 'contains', true);
                    args.updateData(languageData, query);
                }
            });
            multiColObj2.appendTo(element);
            element.value = 'c';
            element.dispatchEvent(event);
            setTimeout(() => {
                expect((multiColObj2 as any).gridObj.dataSource.length).toBe(6);
                done();
            }, 1200);
        });
        it('Filtering Event with null query update data', (done) => {
            multiColObj2 = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                allowFiltering: true,
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                filtering: (args: FilteringEventArgs) => {
                    args.updateData(filterData, null);
                }
            });
            multiColObj2.appendTo(element);
            expect((multiColObj2 as any).gridObj.dataSource.length).toBe(9);
            element.value = 'c';
            element.dispatchEvent(event);
            setTimeout(() => {
                expect((multiColObj2 as any).gridObj.dataSource.length).toBe(3);
                done();
            }, 1200);
        });
    });

    describe('Templates', () => {
        let multiColObj: any;
        let element: HTMLInputElement;
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });

        it(' Group template property  ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'subject' },
                groupTemplate: '<div class="e-group-temp">Group Template 1</div>',
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }, { field: 'subject', header: 'Subject' }]
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(document.querySelector('.e-group-temp').innerHTML).toBe('Group Template 1');
                multiColObj.groupTemplate = '<div class="e-group-temp">Group Template 2</div>';
                multiColObj.dataBind();
                setTimeout(() => {
                    expect(document.querySelector('.e-group-temp').innerHTML).toBe('Group Template 2');
                    done();
                }, 1200);
            }, 1200);
        });
        it(' Item template property  ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                itemTemplate: "<tr id='e-custom-item-template'><td>Text value</td><td>ID value</td><td>Subject</td></tr>",
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(document.querySelectorAll('#e-custom-item-template')[0].innerHTML).toBe('<td>Text value</td><td>ID value</td><td>Subject</td>');
                multiColObj.itemTemplate = "<tr id='e-custom-item-template-2'><td>ID value</td><td>Text value</td><td>Subject</td></tr>";
                multiColObj.dataBind();
                setTimeout(() => {
                    expect(document.querySelectorAll('#e-custom-item-template-2')[0].innerHTML).toBe('<td>ID value</td><td>Text value</td><td>Subject</td>');
                    done();
                }, 1200);
            }, 1200);
        });
        it(' Action Failure Template property  ', (done) => {
            let data: DataManager = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers/asde',
                adaptor: new ODataV4Adaptor,
                crossDomain: true
            });
            multiColObj = new MultiColumnComboBox({
                dataSource: data,
                actionFailureTemplate: 'Action Failed',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(multiColObj.popupEle.querySelector('.e-no-records').innerHTML).toBe('Action Failed');
                multiColObj.actionFailureTemplate = 'Failed action',
                multiColObj.dataBind();
                setTimeout(() => {
                    expect(multiColObj.popupEle.querySelector('.e-no-records').innerHTML).toBe('Failed action');
                    done();
                }, 1200);
            }, 1200);
        });
        it (' footer template property', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                footerTemplate: '<div class="e-footer-temp">Total count is: ${count}</div>'
            });
            multiColObj.appendTo(element);
            multiColObj.isReact = true;
            const footerEle: HTMLElement = (multiColObj as any).popupObj.element.querySelector('.e-popup-footer');
            expect(footerEle.querySelector('.e-footer-temp').innerHTML).toBe('Total count is: 9');
            multiColObj.footerTemplate = '<div class="e-footer-temp">Total update count is: ${count}</div>';
            multiColObj.dataBind();
            expect(footerEle.querySelector('.e-footer-temp').innerHTML).toBe('Total update count is: 9');
        });
    });

    describe('Methods', () => {
        let multiColObj: MultiColumnComboBox;
        let element: HTMLInputElement;
        beforeEach((): void => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterEach((): void => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });
        it(' Get items method ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                const values = multiColObj.getItems();
                expect((values[6].firstChild as any).innerHTML).toBe('JAVASCRIPT');
                done();
            }, 1200);
        });
        it(' Add items method ', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            multiColObj.addItems({subject: 'eee', id: 'list22', text: 'Physics'});
            setTimeout(() => {
                expect((multiColObj as any).dataSource[0].text).toBe('Physics');
                done();
            }, 1200);
        });
    });
    describe('No Column Rendering Property', () => {
        let multiColObj: MultiColumnComboBox;
        let element: HTMLInputElement;
        beforeEach(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });

        it('check a rendering data without column property and row length', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: data,
                fields: { text: 'OrderID', value: 'ShipCountry' }
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect((multiColObj as any).gridEle.querySelectorAll('.e-row').length).toBe(15);
                done();
            }, 4000);
        });
        it('Rendering a remote data without column property', (done) => {
            let filtering: Boolean = false;
            let dataSource: DataManager = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
                adaptor: new ODataV4Adaptor,
                crossDomain: true
            });
            multiColObj = new MultiColumnComboBox({
                dataSource: dataSource,
                fields: { text: 'ContactName', value: 'CustomerID' },
                filtering: (args: FilteringEventArgs) => {
                    filtering = true;
                }
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect((multiColObj as any).gridEle.querySelectorAll('.e-row').length).toBe(20);
                done();
            }, 2000);
        });
    });
    describe('Complex data rendering', () => {
        let multiColObj: MultiColumnComboBox;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: null,
            key: null,
            target: null,
            currentTarget: null,
            stopImmediatePropagation: (): void => { /** NO Code */ }
        };
        let element: HTMLInputElement;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });
        it('Selection behaviour selected item is clicked with complex data', (done) => {
            let isPopupOpen: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: complexData,
                fields: { text: 'Name.FirstName', value: 'EmployeeID' },
                columns: [{ field: 'EmployeeID', header: 'Employee ID' }, { field: 'Name.FirstName', header: 'First Name' }],
                open: (): void => {
                    isPopupOpen = true;
                }
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                const rowCell: HTMLElement = (multiColObj as any).gridEle.querySelector('.e-rowcell');
                keyEventArgs.target = rowCell;
                keyEventArgs.key = '';
                (multiColObj as any).gridObj.selectedRowIndex = 0;
                setTimeout(() => {
                    (multiColObj as any).onMouseClick(keyEventArgs);
                    expect((multiColObj as any).inputEle.value).toBe('Nancy');
                    (multiColObj as any).showPopup();
                    expect(isPopupOpen).toBe(true);
                    keyEventArgs.target = document.body;
                    (multiColObj as any).onDocumentClick(keyEventArgs);
                    done();
                }, 1200);
            }, 1200);
        });
        it('Initial value selection with complex data', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: complexData,
                fields: { text: 'Name.FirstName', value: 'EmployeeID' },
                columns: [{ field: 'EmployeeID', header: 'Employee ID' }, { field: 'Name.FirstName', header: 'First Name' }],
                value: '1'
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(multiColObj.value).toBe('1');
                expect(multiColObj.index).toBe(0);
                expect(multiColObj.text).toBe('Nancy');
                expect((multiColObj as any).inputEle.value).toBe('Nancy');
                done();
            }, 1200);
        });
        it('Initial index selection with complex data', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: complexData,
                fields: { text: 'Name.FirstName', value: 'EmployeeID' },
                columns: [{ field: 'EmployeeID', header: 'Employee ID' }, { field: 'Name.FirstName', header: 'First Name' }],
                index: 0
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(multiColObj.value).toBe('1');
                expect(multiColObj.index).toBe(0);
                expect(multiColObj.text).toBe('Nancy');
                expect((multiColObj as any).inputEle.value).toBe('Nancy');
                done();
            }, 1200);
        });
        it('Initial text selection with complex data', (done) => {
            multiColObj = new MultiColumnComboBox({
                dataSource: complexData,
                fields: { text: 'Name.FirstName', value: 'EmployeeID' },
                columns: [{ field: 'EmployeeID', header: 'Employee ID' }, { field: 'Name.FirstName', header: 'First Name' }],
                text: 'Andrew'
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(multiColObj.value).toBe('2');
                expect(multiColObj.index).toBe(1);
                expect(multiColObj.text).toBe('Andrew');
                expect((multiColObj as any).inputEle.value).toBe('Andrew');
                done();
            }, 1200);
        });
    });
});