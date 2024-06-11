import { createElement, remove, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { FilteringEventArgs, MultiColumnComboBox, PopupEventArgs } from '../../src/multicolumn-combobox/multi-column-combo-box';
import { DataManager, Query, ODataAdaptor, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { getMemoryProfile, inMB, profile } from './common.spec';

let languageData: { [key: string]: Object }[] = [
    { id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
    { id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'PYTHON' }, { id: 'list5', text: 'HTMLCSS' },
    { id: 'list6', text: 'JAVASCRIPT' }, { id: 'list7', text: 'SQL' }, { id: 'list8', text: 'C#' }
];

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
            element = <HTMLInputElement>createElement('input', { id: 'multicolumn-combobox' });
            document.body.appendChild(element);
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
        });
        afterEach((): void => {
            if (multiColObj) {
                multiColObj.destroy();
                multiColObj = undefined;
            }
            remove(element);
        });
        it('check root component root class', () => {
            expect(document.getElementById('multicolumn-combobox').classList.contains('e-control')).toEqual(true);
            expect(document.getElementById('multicolumn-combobox').classList.contains('e-multicolumncombobox')).toEqual(true);
        });
        it('Element Structure', () => {
            expect(multiColObj.element.classList.contains('e-control')).toEqual(true);
            expect(multiColObj.element.classList.contains('e-multicolumncombobox')).toEqual(true);
            expect(multiColObj.element.parentElement.classList.contains('e-control-wrapper')).toEqual(true);
            expect(multiColObj.element.parentElement.classList.contains('e-multicolumn-list')).toEqual(true);
            expect(multiColObj.element.parentElement.lastElementChild.classList.contains('e-multicolumn-list-icon')).toEqual(true);
        });
        it('get module name', () => {
            expect(multiColObj.getModuleName()).toBe('multicolumncombobox');
        });
        it('aria attributes', () => {
            expect(multiColObj.element.getAttribute("role")).toEqual("combobox");
            expect(multiColObj.element.getAttribute("type")).toEqual("text");
            expect(multiColObj.element.getAttribute("aria-expanded")).toEqual("false");
            expect(multiColObj.element.getAttribute("tabindex")).toEqual("0");
            expect(multiColObj.element.parentElement.getAttribute("spellcheck")).toBe("false");
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
            expect(multiColEle.getAttribute('id') != element.getAttribute('id')).toEqual(true);
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
        it(' popup open and close testing on mouse click ', () => {
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
            const dropDownEle: HTMLElement = (multiColObj as any).inputWrapper.querySelector('.e-input-group-icon');
            EventHandler.trigger(dropDownEle, 'mousedown');
            expect(isPopupOpen).toBe(true);
            expect(isPopupClose).toBe(false);
            EventHandler.trigger(dropDownEle, 'mousedown');
            expect(isPopupClose).toBe(true);
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
            multiColObj.appendTo(element);
            expect(isPopupOpen).toBe(false);
            multiColObj.focusIn();
            expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
            const dropDownEle: HTMLElement = (multiColObj as any).inputWrapper.querySelector('.e-input-group-icon');
            EventHandler.trigger(dropDownEle, 'mousedown');
            multiColObj.gridObj.selectedRowIndex = 0;
            setTimeout(function () {
                expect(isPopupOpen).toBe(true);
                expect(isPopupClose).toBe(false);
                const gridRow: HTMLElement = (multiColObj as any).popupObj.element.querySelector('.e-row');
                const mouseEventArgs: any = { preventDefault: function () { }, target: gridRow };
                multiColObj.onMouseClick(mouseEventArgs);
                expect(isPopupClose).toBe(true);
                expect(multiColObj.inputEle.value).toBe('PHP');
                done();
            }, 800);
        });
    });

    describe('Custom value with initial rendering and dynamic change', () => {
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
        it(' value property - custom value - not exist value  ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                value: 'abc',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.inputEle.value).toBe('');
            expect(multiColObj.value).toBe('abc');
            expect(multiColObj.text).toBe(null);
            expect(multiColObj.index).toBe(null);
        });
        it(' value property - custom value - exist value  ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                value: 'list1',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.inputEle.value).toBe('JAVA');
            expect(multiColObj.text).toBe(null);
            expect(multiColObj.value).toBe('list1');
            expect(multiColObj.index).toBe(null);
        });
        it(' text property - custom value - not exist text  ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                text: 'abc',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.inputEle.value).toBe('');
            expect(multiColObj.text).toBe('abc');
            expect(multiColObj.value).toBe(null);
            expect(multiColObj.index).toBe(null);
        });
        it(' text property - custom value - exist text  ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                text: 'JAVA',
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.inputEle.value).toBe('JAVA');
            expect(multiColObj.text).toBe('JAVA');
            expect(multiColObj.value).toBe(null);
            expect(multiColObj.index).toBe(null);
        });
        it(' value property - onPropertyChange - custom value - not exist value  ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
            });
            multiColObj.appendTo(element);
            multiColObj.value = 'abc';
            multiColObj.dataBind();
            expect(multiColObj.inputEle.value).toBe('');
            expect(multiColObj.text).toBe(null);
            expect(multiColObj.value).toBe('abc');
            expect(multiColObj.index).toBe(null);
        });
        it(' value property - onPropertyChange - custom value - exist value  ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
            });
            multiColObj.appendTo(element);
            multiColObj.value = 'list1';
            multiColObj.dataBind();
            expect(multiColObj.inputEle.value).toBe('JAVA');
            expect(multiColObj.text).toBe(null);
            expect(multiColObj.value).toBe('list1');
            expect(multiColObj.index).toBe(null);
        });
        it(' text property - onPropertyChange custom value - not exist text  ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
            });
            multiColObj.appendTo(element);
            multiColObj.text = 'abc';
            multiColObj.dataBind();
            expect(multiColObj.inputEle.value).toBe('');
            expect(multiColObj.text).toBe('abc');
            expect(multiColObj.value).toBe(null);
            expect(multiColObj.index).toBe(null);
        });
        it(' text property - onPropertyChange custom value - exist text  ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
            });
            multiColObj.appendTo(element);
            multiColObj.text = 'JAVA';
            multiColObj.dataBind();
            expect(multiColObj.inputEle.value).toBe('JAVA');
            expect(multiColObj.text).toBe('JAVA');
            expect(multiColObj.value).toBe(null);
            expect(multiColObj.index).toBe(null);
        });
        it(' value - text - index - property priority check ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                value: 'id1',
                text: 'JAVA',
                index: 3,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.inputEle.value).toBe('HTML');
            expect(multiColObj.text).toBe('JAVA');
            expect(multiColObj.value).toBe('id1');
            expect(multiColObj.index).toBe(3);
        });
        it(' text - index - property priority check ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                text: 'JAVA',
                index: 3,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.inputEle.value).toBe('JAVA');
            expect(multiColObj.text).toBe('JAVA');
            expect(multiColObj.value).toBe(null);
            expect(multiColObj.index).toBe(3);
        });
        it( 'index - property priority check ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                index: 3,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.inputEle.value).toBe('JAVA');
            expect(multiColObj.text).toBe(null);
            expect(multiColObj.value).toBe(null);
            expect(multiColObj.index).toBe(3);
        });
        it('value property in remote data', (done) => {
            let data: DataManager = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
                adaptor: new ODataV4Adaptor,
                crossDomain: true
            });
            multiColObj = new MultiColumnComboBox({
                dataSource: data,
                fields: { text: 'ContactName', value: 'CustomerID' },
                columns: [{ field: 'ContactName', header: 'ContactName', width: 120 },
                          { field: 'CustomerID', width: 140, header: 'Customer ID' }],
                value: 'EASTC'
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(multiColObj.inputEle.value).toBe('Ann Devon');
                expect(multiColObj.text).toBe(null);
                expect(multiColObj.value).toBe('EASTC');
                expect(multiColObj.index).toBe(null);
                done();
            }, 800);
        });
        it('text property in remote data', (done) => {
            let data: DataManager = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
                adaptor: new ODataV4Adaptor,
                crossDomain: true
            });
            let query: Query = new Query().select(['ContactName', 'CustomerID']).take(10);
            multiColObj = new MultiColumnComboBox({
                dataSource: data,
                query: query,
                fields: { text: 'ContactName', value: 'CustomerID' },
                columns: [{ field: 'ContactName', header: 'ContactName', width: 120 },
                          { field: 'CustomerID', width: 140, header: 'Customer ID' }],
                text: 'Ana Trujillo'
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(multiColObj.inputEle.value).toBe('Ana Trujillo');
                expect(multiColObj.text).toBe('Ana Trujillo');
                expect(multiColObj.value).toBe(null);
                expect(multiColObj.index).toBe(null);
                done();
            }, 800);
        });
        it('index property in remote data', (done) => {
            let data: DataManager = new DataManager({
                url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
                adaptor: new ODataV4Adaptor,
                crossDomain: true
            });
            multiColObj = new MultiColumnComboBox({
                dataSource: data,
                fields: { text: 'ContactName', value: 'CustomerID' },
                columns: [{ field: 'ContactName', header: 'ContactName', width: 120 },
                          { field: 'CustomerID', width: 140, header: 'Customer ID' }],
                index: 2
            });
            multiColObj.appendTo(element);
            setTimeout(() => {
                expect(multiColObj.inputEle.value).toBe('Antonio Moreno');
                expect(multiColObj.text).toBe(null);
                expect(multiColObj.value).toBe(null);
                expect(multiColObj.index).toBe(2);
                done();
            }, 800);
        });
    });

    describe('Readonly, CssClass, Disabled, Rtl and Persistence with initial rendering and dynamic change', () => {
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
            const dropDownEle: HTMLElement = (multiColObj as any).inputWrapper.querySelector('.e-input-group-icon');
            EventHandler.trigger(dropDownEle, 'mousedown');
            expect(isPopupOpen).toBe(false)
            multiColObj.readonly = false;
            multiColObj.dataBind();
            expect(multiColObj.inputEle.readOnly).toBe(false);
            multiColObj.focusIn();
            expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
            EventHandler.trigger(dropDownEle, 'mousedown');
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
            const dropDownEle: HTMLElement = (multiColObj as any).inputWrapper.querySelector('.e-input-group-icon');
            EventHandler.trigger(dropDownEle, 'mousedown');
            expect(isPopupOpen).toBe(false)
            multiColObj.disabled = false;
            multiColObj.dataBind();
            expect(multiColObj.inputEle.disabled).toBe(false);
            expect(multiColObj.element.getAttribute('aria-disabled')).toBe('false');
            multiColObj.focusIn();
            expect((multiColObj as any).inputWrapper.classList.contains('e-input-focus')).toBe(true);
            EventHandler.trigger(dropDownEle, 'mousedown');
            expect(isPopupOpen).toBe(true)
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
        it(' Rtl propert  ', () => {
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
        it(' groupBy property ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect((multiColObj as any).gridObj.groupSettings.columns.length).toBe(1);
            expect((multiColObj as any).gridObj.groupSettings.columns[0]).toBe('text');
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
            const dropDownEle: HTMLElement = (multiColObj as any).inputWrapper.querySelector('.e-input-group-icon');
            EventHandler.trigger(dropDownEle, 'mousedown');
            multiColObj.gridObj.selectedRowIndex = 0;
            setTimeout(function () {
                let noRecordEle: HTMLElement = multiColObj.popupObj.querySelector('.e-nodata');
                expect(noRecordEle.innerText).toBe('No records found');
                done();
            }, 800);
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
            const dropDownEle: HTMLElement = (multiColObj as any).inputWrapper.querySelector('.e-input-group-icon');
            EventHandler.trigger(dropDownEle, 'mousedown');
            multiColObj.gridObj.selectedRowIndex = 0;
            setTimeout(function () {
                let noRecordEle: HTMLElement = multiColObj.popupObj.querySelector('.e-nodata');
                expect(noRecordEle.innerText).toBe('No records found');
                done();
            }, 800);
        });
        it (' footer template property', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id', groupBy: 'text' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                footerTemplate: '<div class="e-footer-temp">Total count is: ${count}</div>'
            });
            multiColObj.appendTo(element);
            const footerEle: HTMLElement = (multiColObj as any).popupObj.element.querySelector('.e-popup-footer');
            expect(footerEle.innerText).toBe('Total count is: 9');
            multiColObj.footerTemplate = '<div class="e-footer-temp">Total update count is: ${count}</div>';
            multiColObj.dataBind();
            expect(footerEle.innerText).toBe('Total update count is: 9');
        });
    });

    describe(' Keyboard interaction ', () => {
        let multiColObj: any;
        let element: HTMLInputElement;
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
        it(' key press - alt + down arrow ', () => {
            let eventDetails: any;
            let isPopupOpen: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                open: (args: PopupEventArgs) => {
                    eventDetails = args.event;
                    isPopupOpen = true;
                }
            });
            multiColObj.appendTo(element);
            expect(multiColObj.popupObj.element.classList.contains('e-popup-open')).toBe(false);
            expect(multiColObj.popupObj.element.classList.contains('e-popup-close')).toBe(true);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            multiColObj.keyActionHandler(keyEventArgs);
            expect(isPopupOpen).toBe(true);
            expect(eventDetails.action).toBe('altDown');
        });
        it(' key press - alt + up arrow - without open popup ', () => {
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.popupObj.element.classList.contains('e-popup-open')).toBe(false);
            expect(multiColObj.popupObj.element.classList.contains('e-popup-close')).toBe(true);
            multiColObj.focusIn();
            keyEventArgs.action = 'altUp';
            multiColObj.keyActionHandler(keyEventArgs);
            expect(multiColObj.popupObj.element.classList.contains('e-popup-open')).toBe(false);
            expect(multiColObj.popupObj.element.classList.contains('e-popup-close')).toBe(true);
        });
        it(' key press - escape ', () => {
            let isPopupClose: boolean = false;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }],
                close: () => {
                    isPopupClose = true;
                }
            });
            multiColObj.appendTo(element);
            expect(multiColObj.popupObj.element.classList.contains('e-popup-open')).toBe(false);
            expect(multiColObj.popupObj.element.classList.contains('e-popup-close')).toBe(true);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            multiColObj.keyActionHandler(keyEventArgs);
            expect(isPopupClose).toBe(false);
            keyEventArgs.action = 'escape';
            multiColObj.keyActionHandler(keyEventArgs);
            expect(isPopupClose).toBe(true);
        });
        it(' key press - mouse down and mouse up ', (done) => {
            let isPopupClose: boolean = false;
            let isPopupOpen: boolean = false;
            let eventDetails: any;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                open: (args: PopupEventArgs) => {
                    eventDetails = args.event;
                    isPopupOpen = true;
                },
                close: () => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.popupObj.element.classList.contains('e-popup-open')).toBe(false);
            expect(multiColObj.popupObj.element.classList.contains('e-popup-close')).toBe(true);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            multiColObj.keyActionHandler(keyEventArgs);
            expect(isPopupOpen).toBe(true);
            setTimeout(() => {
                expect(eventDetails.action).toBe('altDown');
                keyEventArgs.action = 'moveDown';
                multiColObj.keyActionHandler(keyEventArgs);
                expect(multiColObj.gridObj.selectedRowIndex).toBe(0);
                multiColObj.gridObj.selectedRowIndex = 1;
                keyEventArgs.action = 'moveDown';
                multiColObj.gridKeyActionHandler(keyEventArgs);
                expect(multiColObj.gridObj.selectedRowIndex).toBe(1);
                multiColObj.gridObj.selectedRowIndex = 0;
                expect(isPopupClose).toBe(false);
                keyEventArgs.action = 'moveUp';
                multiColObj.gridKeyActionHandler(keyEventArgs);
                expect(multiColObj.gridObj.selectedRowIndex).toBe(0);
                expect(isPopupClose).toBe(false);
                keyEventArgs.action = 'escape';
                multiColObj.keyActionHandler(keyEventArgs);
                expect(isPopupClose).toBe(true);
                done();
            }, 800);
        });
        it(' key press - mouse down and enter key ', (done) => {
            let isPopupClose: boolean = false;
            let isPopupOpen: boolean = false;
            let eventDetails: any;
            multiColObj = new MultiColumnComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                open: (args: PopupEventArgs) => {
                    eventDetails = args.event;
                    isPopupOpen = true;
                },
                close: () => {
                    isPopupClose = true;
                },
                columns: [{ field: 'text', header: 'Language' }, { field: 'id', header: 'ID' }]
            });
            multiColObj.appendTo(element);
            expect(multiColObj.popupObj.element.classList.contains('e-popup-open')).toBe(false);
            expect(multiColObj.popupObj.element.classList.contains('e-popup-close')).toBe(true);
            multiColObj.focusIn();
            keyEventArgs.action = 'altDown';
            multiColObj.keyActionHandler(keyEventArgs);
            expect(isPopupOpen).toBe(true);
            setTimeout(() => {
                expect(eventDetails.action).toBe('altDown');
                keyEventArgs.action = 'moveDown';
                multiColObj.keyActionHandler(keyEventArgs);
                expect(multiColObj.gridObj.selectedRowIndex).toBe(0);
                keyEventArgs.key = 'Enter';
                multiColObj.gridObj.keyPressed(keyEventArgs);
                expect(isPopupClose).toBe(true);
                expect(multiColObj.inputEle.value).toBe('PHP');
                done();
            }, 800);
        });
    });
});
