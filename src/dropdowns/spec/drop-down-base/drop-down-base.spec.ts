/**
 * Dropdownbase spec document
 */
import { EmitType, L10n, createElement, isUndefined } from '@syncfusion/ej2-base';
import { SortOrder } from '@syncfusion/ej2-lists/src/common';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { DropDownBase } from '../../src/drop-down-base/drop-down-base';
import '../../node_modules/es6-promise/dist/es6-promise';

let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
{ id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }];

let datasource2: { [key: string]: Object }[] = [{ id: 'id2', text: 'PHP', icon: 'icon1' }, { id: 'id1', text: 'HTML', icon: 'icon1' }, { id: 'id3', text: 'PERL', icon: 'icon1' },
{ id: 'list1', text: 'JAVA', icon: 'icon1' }, { id: 'list2', text: 'Phython', icon: 'icon1' }, { id: 'list5', text: 'Oracle', icon: 'icon1' }];


L10n.load({
    'fr': {
        'dropdowns': {
            noRecordsTemplate: "Pas de modèle d'enregistrement"
        }
    }
});
describe('DropDownBase', () => {

    //Local data bindng with default values
    describe('Local data bindng with default values', () => {
        let listObj: DropDownBase;
        let element: HTMLElement = createElement('div', { id: 'dropdownbase' });
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new DropDownBase({ dataSource: datasource });
            listObj.appendTo(element);
            (listObj as any).setZIndex();
        });
        afterAll(() => {
            if (element) {
                let parent: HTMLElement = element.parentElement as HTMLElement;
                parent.remove();
            }
        });
        /**
         * initialize
         */
        it('Default initialize', () => {
            let next: HTMLElement = listObj.element.nextElementSibling as HTMLElement;
            expect(next.childNodes.length).not.toBe(0);
            expect(next.classList.contains('e-rtl')).toBe(false);
            expect(listObj.itemTemplate).toBe(null);
            expect(listObj.groupTemplate).toBe(null);
            expect(listObj.enabled).toBe(true);
            expect(listObj.dataSource).toEqual(datasource);
            expect(listObj.query).toBe(null);
        });
    });

    //Dynamic property changes
    describe('Dynamic property changes', () => {
        let listObj: any;
        let element: HTMLElement;
        beforeEach(() => {
            element = createElement('div', { id: 'dropdownbase' });
            document.body.appendChild(element);
            listObj = new DropDownBase({ dataSource: datasource });
            listObj.appendTo(element);
        });
        afterEach(() => {
            if (element) {
                let parent: HTMLElement = element.parentElement as HTMLElement;
                parent.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * enableRtl
         */
        it('enableRtl changed', () => {
            listObj.enableRtl = true;
            listObj.dataBind();
            expect(listObj.element.nextElementSibling.classList.contains('e-rtl')).toEqual(true);
        });
        /**
         * enabled
         */
        it('enabled behavior testing', () => {
            listObj.enabled = false;
            listObj.dataBind();
            expect(listObj.element.getAttribute('aria-disabled')).toBe('true');
        });
        /**
         * dataSource
         */
        it('dataSource, query and sortOrder properties changes', () => {
            listObj.dataSource = datasource2;
            listObj.sortOrder = 'Ascending';
            listObj.query = new Query().take(4);
            listObj.fields = { value: 'id', text: 'text' };
            listObj.dataBind();
            let ele: Element = listObj.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li.length).toEqual(4);
            expect(li[0].textContent).toBe('HTML');
        });
        it('iconCss properties changes', () => {
            listObj.dataSource = datasource2;
            listObj.fields = { text: 'text', iconCss: 'icon' };
            listObj.dataBind();
            let ele: Element = listObj.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect((li[0].firstChild as HTMLElement).tagName).toContain('SPAN');
        });
        /**
         * itemTemplate
         */
        it('itemTemplate property', () => {
            listObj.fields = { text: 'text', iconCss: 'icon' };
            listObj.itemTemplate = '<div class="demo"> ${text} </div><div class="id"> ${id} </div>';
            listObj.dataBind();
            let eles: Element = listObj.element.nextElementSibling;
            let item: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>eles.querySelectorAll('.e-list-item');
            expect(item[0].firstElementChild.classList.contains('demo')).toBe(true);
        });
        /**
         * locale
         */
        it('locale property', () => {
            let data: { [key: string]: Object }[] = [];
            listObj.dataSource = data;
            listObj.dataBind();
            listObj.locale = 'fr';
            listObj.dataBind();
            expect(listObj.locale).toBe('fr');
            expect(listObj.list.innerHTML).toBe("Pas de modèle d'enregistrement");
            listObj.noRecordsTemplate = 'Empty data source';
            listObj.locale = 'en-US';
            listObj.dataBind();
            expect(listObj.noRecordsTemplate).toBe('Empty data source');
            element.parentElement.remove();
            document.body.innerHTML = '';
        });
    });

    // HTMLData Binding
    describe('HTMLData data binding', () => {
        let ele: HTMLElement = document.createElement('ul');
        ele.id = 'newlist';
        ele.innerHTML = '<li id="i1">item1</li>' +
            '<li id="i2">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
            '<li>item6</li><li>item7</li>';
        let nTree: DropDownBase;
        beforeAll(() => {
            document.body.appendChild(ele);
            nTree = new DropDownBase();
            nTree.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                let parent: HTMLElement = ele.parentElement as HTMLElement;
                parent.remove();
                document.body.innerText = '';
            }
        })
        /**
         * initialize
         */
        it('initialized HTML data', () => {
            expect(ele.nextElementSibling.querySelectorAll('.e-list-item').length).toBe(7);
        });
    });
    describe('Remote Data Binding', () => {
        describe('default query', () => {
            let ele: HTMLElement = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            let nTree: DropDownBase;
            beforeAll(() => {
                document.body.appendChild(ele);

            });
            it('initialized HTML data', (done) => {
                nTree = new DropDownBase({
                    dataSource: new DataManager({
                        url: '/api/Employees',
                        adaptor: new ODataV4Adaptor
                    }),
                    fields: { value: 'EmployeeID', text: 'FirstName' },
                    actionComplete: (e: any) => {
                        expect(e.result.length).toBe(9);
                    }
                });
                nTree.appendTo('#newTree');
                setTimeout(done, 800);
            });
            afterAll(() => {
                if (ele) ele.parentElement.remove();
            });
        });
    });

    // Method testing
    describe('method testing ', () => {
        let listObj: any;
        let element: HTMLElement
        beforeEach(() => {
            element = createElement('div', { id: 'dropdownbase' });
            document.body.appendChild(element);
            listObj = new DropDownBase({ dataSource: datasource });
            listObj.appendTo(element);
        });
        afterEach(() => {
            if (element) {
                let parent: HTMLElement = element.parentElement as HTMLElement;
                parent.remove();
            };
            document.body.innerHTML = '';
        });
        /**
         * getModuleName
         */
        it('getModuleName method', () => {
            let name: string = listObj.getModuleName();
            expect(name).toEqual('dropdownbase');
        });
        /**
         * getPersistData
         */
        it('getPersistData method ', () => {
            let stringItems: any = listObj.getPersistData();
            expect(stringItems.search('value')).toBe(-1);
        });
        /**
         * addItem
         */
        it('addItem method', () => {
            listObj.addItem([{ id: 'list3', text: 'HTML' }, { id: 'list4', text: 'PHP' }], 2);
            let ele: Element = listObj.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[2].textContent).toEqual('HTML');
            expect(listObj.liCollections[2].textContent).toEqual('HTML');

        });
        /**
         * addItem with single arg
         */
        it('addItem method without index', () => {
            let select: Element = listObj.element.nextElementSibling.querySelector('li').classList.add('e-active');
            listObj.addItem([{ id: 'list5', text: 'C' }, { id: 'list6', text: 'NewItem' }]);
            let ele: Element = listObj.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[li.length - 1].textContent).toEqual('NewItem');
            expect(listObj.liCollections[li.length - 1].textContent).toEqual('NewItem');
        });
        /**
         * addItem while datasource empty.
         */
        it('addItem while datasource empty', () => {
            listObj.dataSource = [];
            listObj.dataBind();
            listObj.addItem([{ id: 'list7', text: 'Oops' }]);
            let ele: Element = listObj.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[0].textContent).toEqual('Oops');
        });
        it('addItem with high index length', () => {
            let ele: Element = listObj.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            listObj.addItem([{ id: 'list7', text: 'Oops' }], 20);
            let li1: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li1[li1.length - 1].textContent).toEqual('Oops');
        });
        it('addItem as non array', () => {
            listObj.addItem({ id: 'list90', text: 'Oops1' });
            let ele: Element = listObj.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[li.length - 1].textContent).toEqual('Oops1');
        });
        /**
         * getItems
         */
        it('getItems method', () => {
            let items: any = listObj.getItems();
            let ele: Element = listObj.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(items.length).toEqual(li.length);
        });
        /**
         * destroy
         */
        it('destroy method ', () => {
            listObj.destroy();
            expect(!(listObj.element.nextElementSibling)).toBe(true);
            document.body.innerHTML = '';
        });
        /**
         * getIndexByvalue
         */
        it('getIndexByvalue method ', () => {
            var index = listObj.getIndexByValue('C++');
            expect(index).toEqual(2);
        });
    });
    // Action events
    describe('Events', () => {

        describe('Action events ', () => {
            let beginAction: EmitType<Object> = jasmine.createSpy('actionBegin');
            let ele: HTMLElement = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newlist';
            let list: any;
            beforeAll(() => {
                document.body.appendChild(ele);
            });
            afterAll(() => {
                if (ele) { ele.parentElement.remove(); };
                jasmine.Ajax.uninstall();
            });
            /**
             * actionComplete
             */
            it('actionComplete events triggered', (done) => {
                list = new DropDownBase({
                    dataSource: new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor }),
                    fields: { text: 'FirstName' },
                    actionBegin: beginAction,
                    actionComplete: (e: any) => {
                        expect(e.result.length).toBe(9);
                    }
                });
                list.appendTo('#newlist');
                setTimeout(done, 800);
            });
            /**
             * actionBegin
             */
            it('actionBegin event triggered', () => {
                expect(beginAction).toHaveBeenCalled();
            });
        });
        describe('No data with remote ', () => {
            let beginAction: EmitType<Object> = jasmine.createSpy('actionBegin');
            let ele: HTMLElement = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newlist';
            let list: any;
            beforeAll(() => {
                document.body.appendChild(ele);
            });
            afterAll(() => {
                if (ele) { ele.parentElement.remove(); };
                jasmine.Ajax.uninstall();
            });
            /**
             * actionComplete
             */
            it('noRecordsTemplate', (done) => {
                list = new DropDownBase({
                    dataSource: new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor }),
                    fields: { text: 'FirstName' },
                    actionBegin: beginAction,
                    actionComplete: (e: any) => {
                        e.result = [];
                    }
                });
                list.appendTo('#newlist');
                setTimeout(() => {
                    expect(ele.nextElementSibling.querySelectorAll('li').length).toBe(0);
                    expect(list.list.innerHTML).toBe('No Records Found');
                    done();
                }, 800);
            });

        });

        describe('actionFailure event', () => {
            let actionFailedFunction: EmitType<Object> = jasmine.createSpy('actionFailure');
            let ele: HTMLElement = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            let listObj: any;
            beforeAll((done) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                listObj = new DropDownBase({
                    dataSource: new DataManager({
                        url: '/test/db',
                        adaptor: new ODataV4Adaptor
                    }),
                    fields: { value: 'EmployeeID', text: 'FirstName' },
                    actionFailure: actionFailedFunction
                });
                listObj.appendTo('#newTree');
                setTimeout(done, 800);
            });
            beforeEach((done: Function) => {
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 404,
                    'contentType': 'application/json',
                    'responseText': 'Page not found'
                });
                setTimeout(() => { done(); }, 100);
            });
            it('initialized HTML data', () => {
                expect(actionFailedFunction).toHaveBeenCalled();
                expect(listObj.list.textContent).toBe(listObj.actionFailureTemplate);
            });
            afterAll(() => {
                ele.remove();
                jasmine.Ajax.uninstall();
            });
        });

    });
    describe('Template', () => {
        let listObj: any;
        let element: HTMLElement;
        let datasource1: { [key: string]: Object }[] = [{ 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
        beforeEach(() => {
            element = createElement('div', { id: 'dropdownbase', attrs: { 'tabindex': '1' } });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (element) {
                element.parentElement.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * itemTemplate
         */
        it('itemTemplate with category ', (done) => {
            listObj = new DropDownBase({
                dataSource: datasource1,
                fields: { groupBy: 'category' },
                itemTemplate: '<div class="ename"> ${text} </div><div class="desig"> ${id} </div>',
            });
            listObj.appendTo(element);
            let ele: Element = listObj.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[0].classList.contains('e-list-group-item')).toBe(true);
            expect(ele.querySelector('ul').firstChild.textContent).toBe('Audi');
            listObj.element.nextElementSibling.style.overflow = "auto";
            listObj.element.nextElementSibling.style.height = '80px';
            listObj.dataBind();
            listObj.list.scrollTop = ele.scrollHeight;
            setTimeout(() => {
                listObj.list.scrollTop = 0;
                setTimeout(() => {
                    expect(listObj.list.firstChild.textContent).toBe('Audi');
                    done();
                }, 101);
            }, 500);
        });
        /**
        * itemTemplate
        */
        it('itemTemplate with sorting', () => {
            listObj = new DropDownBase({
                dataSource: datasource, sortOrder: 'Ascending',
                fields: { value: 'text' },
                itemTemplate: '<div class="ename"> ${text} </div><div class="desig"> ${id} </div>',
            });
            listObj.appendTo(element);
            let ele: Element = listObj.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[0].getAttribute('data-value')).toEqual('.NET');
        });
        /**
        * groupTemplate
        */
        it('groupBy & groupTemplate', () => {
            let grpList: DropDownBase = new DropDownBase({
                dataSource: datasource1, fields: { groupBy: 'category', value: 'id', text: 'text' },
                groupTemplate: '<div class="category"> ${text} </div><div class="design"> </div> '
            });
            grpList.appendTo('#dropdownbase');
            let ele: Element = grpList.element.nextElementSibling;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('.e-list-group-item');
            expect(li[0].firstElementChild.classList.contains('category')).toBe(true);
        });
        it('groupBy & SortOrder', () => {
            let datasource9: { [key: string]: Object }[] = [{ 'text': 'Audi A7', 'id': 'e807', 'category': 'Audi' }, 
            { 'text': 'Audi A6', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
            let grpList: DropDownBase = new DropDownBase({
                dataSource: datasource9, fields: { groupBy: 'category', value: 'id', text: 'text' },
                sortOrder: 'Ascending'
            });
            grpList.appendTo('#dropdownbase');
            let ele: Element = grpList.element.nextElementSibling;
            let li: Element = <Element & HTMLLIElement>ele.querySelector('.e-list-item');
            expect(li.innerHTML).toEqual('Audi A6');
        });
        it('groupBy & SortOrder & itemtemplate', () => {
            let datasource9: { [key: string]: Object }[] = [{ 'text': 'Audi A7', 'id': 'e807', 'category': 'Audi' },
             { 'text': 'Audi A6', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
            let grpList: DropDownBase = new DropDownBase({
                dataSource: datasource9, fields: { groupBy: 'category', value: 'id', text: 'text' },
                sortOrder: 'Ascending',
                itemTemplate: '<div class="ename">${text}</div><div class="desig"> ${id} </div>',
            });
            grpList.appendTo('#dropdownbase');
            let ele: Element = grpList.element.nextElementSibling;
            let li: Element = <Element & HTMLLIElement>ele.querySelector('.ename');
            expect(li.innerHTML).toEqual('Audi A6');
        });
        /**
        * groupTemplate
        */
        it('groupBy with dynamic groupTemplate', () => {
            let grpList: DropDownBase = new DropDownBase({ dataSource: datasource1, fields: { groupBy: 'category', value: 'id' } });
            grpList.appendTo('#dropdownbase');
            let ele: Element = grpList.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('.e-list-group-item');
            expect(li.length).toEqual(2);
            grpList.groupTemplate = '<div class="category"> ${category} </div><div class="design"> </div> ';
            grpList.dataBind();
            expect(li[0].firstElementChild.classList.contains('category')).toBe(true);
        });
    });
    describe('Floating header', () => {
        let listObj: any;
        let element: HTMLElement;
        let datasource1: { [key: string]: Object }[] = [{ 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
        beforeEach(() => {
            element = createElement('div', { id: 'dropdownbase', attrs: { 'tabindex': '1' } });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (element) {
                element.parentElement.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * itemTemplate
         */
        it('itemTemplate with groupBy ', (done) => {
            listObj = new DropDownBase({
                dataSource: datasource1,
                fields: { groupBy: 'category', text: 'text' },
                itemTemplate: '<div class="ename"> ${text} </div><div class="desig"> ${id} </div>',
            });
            listObj.appendTo(element);
            let ele: Element = listObj.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[0].classList.contains('e-list-group-item')).toBe(true);
            expect(ele.querySelector('ul').firstChild.textContent).toBe('Audi');
            listObj.element.nextElementSibling.style.overflow = "scroll";
            listObj.element.nextElementSibling.style.height = '80px';
            listObj.dataBind();
            listObj.list.scrollTop = ele.scrollHeight;
            setTimeout(() => {
                listObj.list.scrollTop = 0;
                setTimeout(() => {
                    expect(listObj.list.firstChild.textContent).toBe('Audi');
                    done();
                }, 400);
            }, 400);
        });
        it('Floating header', (done) => {
            listObj = new DropDownBase({
                dataSource: datasource1,
                fields: { groupBy: 'category', text: 'text', value: 'id' }
            });
            listObj.appendTo(element);
            let ele: Element = listObj.element.nextElementSibling;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[0].classList.contains('e-list-group-item')).toBe(true);
            expect(ele.querySelector('ul').firstChild.textContent).toBe('Audi');
            listObj.element.nextElementSibling.style.overflow = "auto";
            listObj.element.nextElementSibling.style.height = '80px';
            listObj.dataBind();
            listObj.list.scrollTop = ele.scrollHeight;
            setTimeout(() => {
                listObj.list.scrollTop = 0;
                setTimeout(() => {
                    expect(listObj.fixedHeaderElement.innerText).toBe('Audi');
                    listObj.scrollTimer = 1;
                    listObj.groupTemplate = '<h3 class="ecategory"> ${category} </h3>';
                    setTimeout(() => {
                        expect(listObj.fixedHeaderElement.firstElementChild.tagName).toBe('H3');
                        done();
                    }, 200);
                }, 200);
            }, 200);
        });
        it('getDataByValue method for Object dataSource', () => {
            listObj = new DropDownBase({
                dataSource: datasource1,
                fields: { groupBy: 'category', text: 'text', value: 'id' }
            });
            listObj.appendTo(element);
            let ele: Element = listObj.element.nextElementSibling;
            let data = listObj.getDataByValue('e807');
            expect(data.text).toBe('Audi A6');
            let data1 = listObj.getDataByValue('e8071');
            expect(data1).toBe(null);
        });
        it('getDataByValue method for string array dataSource', () => {
            let items: string[] = ['FootBall', 'Cricket', 'ValleyBall', 'Tennis'];
            listObj = new DropDownBase({ dataSource: items });
            listObj.appendTo(element);
            let ele: Element = listObj.element.nextElementSibling;
            let data = listObj.getDataByValue('Cricket');
            expect(data).toBe('Cricket');
        });
    });
    describe("select element Rendering", () => {
        let listObj: any;
        let element: string = "<select id='select1'><option>option1</option><option value='option2'>option2</option></select>";
        let groupelement: string = "<select id='select2'><optgroup label='option'><option>option1</option><option value='option2'>option2</option></optgroup><option>option3</option></select>";
        afterAll(() => {
            let groupselect: HTMLSelectElement = document.getElementById('select2') as HTMLSelectElement;
            let select: HTMLSelectElement = document.getElementById('select1') as HTMLSelectElement;
            if (select) {
                let parent: HTMLElement = select.parentElement as HTMLElement;
                parent.remove();
            }
            if (groupselect) {
                let parent: HTMLElement = groupselect.parentElement as HTMLElement;
                parent.remove();
            }
        });
        /**
         * Select Rendering
         */
        it('Select Rendering with options only', () => {
            document.body.innerHTML = element;
            let select: HTMLSelectElement = document.getElementById('select1') as HTMLSelectElement;
            listObj = new DropDownBase();
            listObj.appendTo(select);
            let ele: HTMLElement = select.nextElementSibling as HTMLElement;
            expect(ele.querySelectorAll('li').length).toBe(2);
            expect(ele.querySelectorAll('li')[0].innerText).toBe('option1');
            expect(ele.querySelectorAll('li')[0].getAttribute('data-value')).toBe('option1');
            expect(ele.querySelectorAll('li')[1].getAttribute('data-value')).toBe('option2');
        });
        it('Select Rendering with options and optgroup', (done) => {
            document.body.innerHTML = groupelement;
            let groupselect: HTMLSelectElement = document.getElementById('select2') as HTMLSelectElement;
            listObj = new DropDownBase();
            listObj.appendTo(groupselect);
            let ele: HTMLElement = groupselect.nextElementSibling as HTMLElement;
            expect(ele.querySelectorAll('li').length).toBe(4);
            expect(ele.querySelectorAll('li')[0].innerText).toBe('option3');
            expect(ele.querySelectorAll('li')[1].classList).toContain('e-list-group-item');
            expect(ele.querySelectorAll('li')[2].getAttribute('data-value')).toBe('option1');
            expect(ele.querySelectorAll('li')[3].getAttribute('data-value')).toBe('option2');
            expect(ele.querySelectorAll('li')[3].textContent).toBe('option2');
            listObj.list.style.overflow = "auto";
            listObj.list.style.height = '60px';
            listObj.list.scrollTop = 30;
            setTimeout(() => {
                expect(listObj.fixedHeaderElement.style.display).toBe('block');
                listObj.scrollTimer = 1;
                done();
            }, 50);
        });
    });

    describe('boolean array datasource', () => {
        let listObj: DropDownBase;
        let element: HTMLElement = createElement('div', { id: 'dropdownbase' });
        let booleanArray = [ false, true ];
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new DropDownBase({ dataSource: booleanArray });
            listObj.appendTo(element);
            (listObj as any).setZIndex();
        });
        afterAll(() => {
            if (element) {
                let parent: HTMLElement = element.parentElement as HTMLElement;
                parent.remove();
            }
        });
        /**
         * initialize
         */
        it('Boolean Array list initialize', () => {
            let next: HTMLUListElement = listObj.element.nextElementSibling.children[0] as HTMLUListElement;
            expect(listObj.getDataByValue(true)).toBe(true);
            //expect();
        });
    });
});
