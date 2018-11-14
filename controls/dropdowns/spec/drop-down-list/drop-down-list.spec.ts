/**
 * Dropdownlist spec document
 */
import { EmitType, Browser, createElement, isNullOrUndefined, setCulture, L10n } from '@syncfusion/ej2-base';
import { DropDownBase, FilteringEventArgs, dropDownBaseClasses } from '../../src/drop-down-base/drop-down-base';
import { DropDownList } from '../../src/drop-down-list/drop-down-list';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { isCollide } from '@syncfusion/ej2-popups';
import '../../node_modules/es6-promise/dist/es6-promise';


L10n.load({
    'fr': {
        'dropdowns': {
            noRecordsTemplate: "Pas de modèle d'enregistrement"
        }
    }
});

let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
{ id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }];

let datasource2: { [key: string]: Object }[] = [{ id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
{ id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'Phython' }, { id: 'list5', text: 'Oracle' }];
describe('DDList', () => {
    let css: string = ".e-spinner-pane::after { content: 'Material'; display: none;} ";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);
    //Local data bindng with default values
    describe('Local data binding with default values', () => {
        let listObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: datasource2 });
            listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * initialize
         */
        it('Default initialize', () => {
            expect(listObj.element.classList.contains('e-dropdownlist')).not.toBe(0);
        });
        /**
         * Width
         */
        it('Width validation', () => {
            expect(listObj.width).toEqual('100%');
        });
        /**
         * tabIndex
         */
        it('tab index of focus element', () => {
            expect(listObj.inputWrapper.container.getAttribute('tabindex') === '0').toBe(true);
        });
        /**
         * Template properties
         */
        it('Default null value propertes', () => {
            expect(listObj.headerTemplate).toBe(null);
            expect(listObj.footerTemplate).toBe(null);
            expect(listObj.element.getAttribute('placeholder')).toEqual(null);
            expect(listObj.text).toBe(null);
            expect(listObj.value).toBe(null);
            expect(listObj.index).toEqual(null);
        });
        /**
         * document click before open popup
         */
        it('document click before open popup', (done) => {
            listObj.showPopup();
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = document.body;
            listObj.onDocumentClick(mouseEventArgs);
            expect(document.body.contains(listObj.popupObj.element)).toBe(false);
            setTimeout(() => {
                expect(isNullOrUndefined(listObj.isPopupOpen)).toBe(false);
                done();
            }, 500);
        });
        it('Popup height & width', () => {
            listObj.showPopup();
            popupObj = document.getElementById('popupWrapper');
            expect(listObj.popupWidth).toEqual('100%');
            expect(listObj.popupHeight).toEqual('300px');
            listObj.hidePopup();
        });
        it('string header template property', (done) => {
            listObj.headerTemplate = 'header';
            listObj.dataBind();
            listObj.open = function (){
                expect(listObj.headerTemplate).toEqual(listObj.popupObj.element.firstChild.innerText);
                listObj.hidePopup();
                listObj.open = null;
                done();
            };
            listObj.showPopup();
        });
        it('string footer template property', (done) => {
            listObj.footerTemplate = 'header';
            listObj.dataBind();
            listObj.open = function (){
                expect(listObj.footerTemplate).toEqual(listObj.popupObj.element.lastChild.innerText);
                listObj.hidePopup();
                listObj.open = null;
                done();
            };
            listObj.showPopup();
        });
        it('value template', (done) => {
            listObj.valueTemplate = "<div class='ename'> ${id} </div>";
            listObj.change = function (){
                let valueEle: HTMLElement = listObj.element.parentElement.querySelector('.e-input-value');
                expect(valueEle.innerHTML).toEqual('<div class="ename"> list1 </div>');
                expect(listObj.element.parentElement.childNodes[1].classList.contains('e-input-value')).toBe(true);
                expect(listObj.element.style.display).toBe('none');
                listObj.change = null;
                done();
            };
            listObj.index = 3;
            listObj.dataBind();
        });
    });
    describe('Local data binding with Disable Item', () => {
        let listObj: any;
        let popupObj: any;
        let localData: { [key: string]: Object }[] = [{ id: 'id2', text: 'PHP',
         htmlAttributes: { class: 'e-disabled', title: 'PHP' } },
         { id: 'id1', text: 'HTML' }, 
         { id: 'id3', text: 'PERL' },
        { id: 'list1', text: 'JAVA' }, 
        { id: 'list2', text: 'Phython', htmlAttributes: { class: 'e-disabled', title: 'Phython' }}, 
        { id: 'list5', text: 'Oracle' }];
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        element.setAttribute('data-required', 'name');
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new DropDownList({
                    dataSource: localData,
                    fields: { value: 'id', text: 'HTML', htmlAttributes : 'htmlAttributes'},
                    htmlAttributes: {'data-msg-container-id':'msgid'}
                 });
            listObj.appendTo(element);
        });
        it('choose disabled item', (done) => {
            listObj.select = function (args : any){
                if(args.item.classList.contains('e-disabled')){
                args.cancel = true;
                }
                expect(listObj.value).toEqual(null);
                listObj.select = null;
                done();
            };
            listObj.index = 0;
        });
        it('check data attribute', () => {
            expect(listObj.hiddenElement.getAttribute('data-msg-container-id')).not.toBeNull();
            expect(listObj.hiddenElement.getAttribute('data-required')).toBe('name');
            expect(listObj.htmlAttributes['data-required']).toBe('name');
         });
 
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
    });

    describe('Floating label', () => {
        let listObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: datasource2, floatLabelType: 'Auto' });
            listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('floating-Auto: check floating to top', () => {
            mouseEventArgs.target = listObj.inputWrapper.container;
            let floatElement = listObj.inputWrapper.container.querySelector('.e-float-text')
            listObj.dropDownClick(mouseEventArgs);
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
        });
        it('floating-Auto: check floating to bottom', () => {
            mouseEventArgs.target = document.body;
            let floatElement = listObj.inputWrapper.container.querySelector('.e-float-text')
            listObj.onDocumentClick(mouseEventArgs);
            expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
        });

        it('floating-Always: check floating to top when document click', () => {
            listObj.floatLabelType = 'Always';
            listObj.dataBind();
            mouseEventArgs.target = document.body;
            let floatElement = listObj.inputWrapper.container.querySelector('.e-float-text')
            listObj.onDocumentClick(mouseEventArgs);
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
        });
    });
    // collision
    describe('DropDownList collision checking', () => {
        let listObj: any;
        let parentElement: HTMLElement = document.createElement('div');
        parentElement.style.marginTop = '500px';
        let data: string[] = ['Cricket', '', 'Tennis', 'VolleyBall', 'Badminton', 'Basketball', 'Footballs', 'Rugby', 'Bags', 'Tenni', 'Sweet', 'Hot'];
        beforeEach(() => {
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'DropDownList' });
            parentElement.appendChild(element)
            document.body.appendChild(parentElement);
            listObj = new DropDownList({ dataSource: data });
            listObj.appendTo(element);
        });
        /**
         * set the search key value in text
         */
        it('Collision at bottom', () => {
            listObj.showPopup();
            expect(isCollide(listObj.popupObj.element)[0]).toBe("bottom");
        });
        it('empty string value selection', () => {
            listObj.index = 1;
            listObj.dataBind();
            expect(listObj.value).not.toBe(null);
            expect(listObj.value).toBe('');
            expect(listObj.text).not.toBe(null);
            expect(listObj.text).toBe('');
        });
        afterEach(() => {
            if (parentElement) {
                parentElement.remove();
                document.body.innerHTML = '';
            }
        });
    })
    //clear button
    describe('Clear button', () => {
        let listObj: any;
        let listObj1: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let element1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddlelement' });
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: datasource2, index: 2, popupHeight: 'auto', fields: { text: 'text', value: 'id' }, showClearButton: true });
            listObj.appendTo(element);
        });
        afterAll((done) => {
            if (element) {
                element.remove();
                listObj.destroy();
                document.body.innerHTML = '';
                done();
            }
        });

        it('clear icon', () => {
            expect(listObj.inputWrapper.clearButton.classList.contains('e-clear-icon')).toBe(true);
        });

        it('click on clear button', () => {
            listObj.resetHandler(mouseEventArgs);
            expect(listObj.inputWrapper.clearButton.classList.contains('e-clear-icon-hide')).toBe(true);
        });
        it('show clear icon when key navigation', (done) => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            listObj.showPopup()
            setTimeout(() => {
                expect(listObj.inputWrapper.clearButton.classList.contains('e-clear-icon-hide')).toBe(true);
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.inputWrapper.clearButton.classList.contains('e-clear-icon-hide')).toBe(false);
                done();
            }, 450);
        });
        it('show clear icon with allowFiltering', (done) => {
            document.body.appendChild(element1);
            listObj1 = new DropDownList({ dataSource: datasource2, allowFiltering: true, fields: { text: 'text', value: 'id' }, index: 2, showClearButton: true });
            listObj1.appendTo(element1);
            listObj1.showPopup();
            setTimeout(() => {
                expect(listObj1.inputWrapper.clearButton.classList.contains('e-clear-icon-hide')).toBe(true);
                done();
            }, 450);
        });
        it('click on clear button', () => {
            listObj1.clear();
            expect(listObj1.list.querySelectorAll('li').length == 6).toBe(true);
            listObj1.resetValueHandler();
        });
    });

    describe('actionFailure event', () => {
        let listObj: any;
        let popupObj: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employee', adaptor: new ODataV4Adaptor });
        beforeEach(() => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('no data text when ajax failure', (done) => {
            listObj = new DropDownList({ dataSource: remoteData, value: 1004, fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
            listObj.showPopup()
            setTimeout(() => {
                expect(listObj.list.classList.contains('e-nodata')).toBe(true);
                done();
            }, 800);
        });
        it('mouse click on noRecords template', () => {
            mouseEventArgs.target = listObj.list;
            listObj.onMouseClick(mouseEventArgs);
            expect(listObj.value === 1004).toBe(true);
            expect(listObj.beforePopupOpen).toBe(true);
        });
    });
    describe('noRecords template while empty dataSource', () => {
        let listObj: any;
        let popupObj: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        beforeEach(() => {
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: [] });
            listObj.appendTo(element);
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('popup hidden state - press down key in records template ', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 74,
                action: 'down',
                type: 'keydown'
            };
            listObj.keyActionHandler(keyEventArgs);
            expect(listObj.inputElement.value === '').toBe(true);
        });
        it('open the noRecords template popup by alt+down key ', (done) => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 74,
                action: 'open',
                type: 'keydown'
            };
            listObj.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(listObj.isPopupOpen).toBe(true);
                done();
            }, 450);
        });
        it('popup open state - press down key in records template ', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 74,
                action: 'down',
                type: 'keydown'
            };
            listObj.keyActionHandler(keyEventArgs);
            expect(listObj.inputElement.value === '').toBe(true);
        });

        it('close the noRecords template popup by escape key ', (done) => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 74,
                action: 'escape',
                type: 'keydown'
            };
            listObj.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(listObj.isPopupOpen).toBe(false);
                done();
            }, 450);
        });
    });

    describe('noRecords template while empty dataSource in mobile layout', () => {
        let listObj: any;
        let popupObj: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        beforeEach(() => {
            document.body.appendChild(element);
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            listObj = new DropDownList({ dataSource: [] });
            listObj.appendTo(element);
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('show noRecord template', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.isPopupOpen).toBe(true);
                expect(listObj.list.classList.contains('e-nodata')).toBe(true);
                Browser.userAgent = navigator.userAgent;
                done();
            }, 450);
        });
    });
    describe('actionFailure template while wrong data dataSource in mobile layout', () => {
        let listObj: any;
        let popupObj: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employee', adaptor: new ODataV4Adaptor });
        beforeEach(() => {
            document.body.appendChild(element);
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            listObj = new DropDownList({ dataSource: remoteData });
            listObj.appendTo(element);
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('show actionFailure template', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.isPopupOpen).toBe(true);
                expect(listObj.list.classList.contains('e-nodata')).toBe(true);
                Browser.userAgent = navigator.userAgent;
                done();
            }, 800);
        });
    });
    describe('Remote data binding', () => {
        let listObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeEach(() => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * remoteData binding with index
         */
        it('index at initialize time ', (done) => {
            listObj = new DropDownList({ dataSource: remoteData, index: 2, fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
            setTimeout(() => {
                expect(listObj.index).toBe(2);
                expect(listObj.text).toBe('Leverling');
                expect(listObj.value).toBe(1003);
                expect(isNullOrUndefined(listObj.popupObj)).toBe(true);
                done();
            }, 800);
        });
        /**
         * remoteData binding with text
         */
        it('value at initialize time ', (done) => {
            listObj = new DropDownList({ dataSource: remoteData, value: 1004, fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
            setTimeout(() => {
                expect(listObj.value).toBe(1004);
                expect(listObj.index).toBe(3);
                expect(listObj.text).toBe('Peacock');
                expect(isNullOrUndefined(listObj.popupObj)).toBe(true);
                done();
            }, 800);
        });
        /**
         * remoteData binding with value
         */
        it('text at initialize time ', (done) => {
            listObj = new DropDownList({ dataSource: remoteData, text: 'King', fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
            setTimeout(() => {
                expect(listObj.text).toBe('King');
                expect(listObj.value).toBe(1007);
                expect(listObj.index).toBe(6);
                expect(isNullOrUndefined(listObj.popupObj)).toBe(true);
                done();
            }, 800);
        });
        /**
         * remoteData binding
         */
        it('index at dynamic changes ', (done) => {
            listObj = new DropDownList({ dataSource: remoteData, fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
            listObj.index = 3;
            listObj.dataBind();
            setTimeout(() => {
                expect(listObj.index).toBe(3);
                expect(listObj.text).toBe('Peacock');
                expect(listObj.value).toBe(1004);
                expect(isNullOrUndefined(listObj.popupObj)).toBe(true);
                done();
            }, 800);
        });
        /**
         * remoteData binding with text
         */
        it('text at dynamic changes ', (done) => {
            listObj = new DropDownList({ dataSource: remoteData, fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
            listObj.text = 'Fuller';
            listObj.dataBind();
            setTimeout(() => {
                expect(listObj.index).toBe(1);
                expect(listObj.text).toBe('Fuller');
                expect(listObj.value).toBe(1002);
                expect(isNullOrUndefined(listObj.popupObj)).toBe(true);
                done();
            }, 800);
        });
        /**
         * remoteData binding with value
         */
        it('value at dynamic changes ', (done) => {
            listObj = new DropDownList({ dataSource: remoteData, fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
            listObj.value = 1003;
            listObj.dataBind();
            setTimeout(() => {
                expect(listObj.value).toBe(1003);
                expect(listObj.text).toBe('Leverling');
                expect(listObj.index).toBe(2);
                expect(isNullOrUndefined(listObj.popupObj)).toBe(true);
                done();
            }, 800);
        });

    });
    // dynamic property changes
    describe('Dynamic property changes', () => {
        let listObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new DropDownList({ enabled: false, dataSource: datasource2, fields: { text: 'text', value: 'id' } });
            listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * tab index in disable state
         */
        it('tab index of focus element in disable state ', () => {
            expect(listObj.inputWrapper.container.tabIndex === -1).toBe(true);
            listObj.enabled = true;
            listObj.dataBind();
        });
        /**
       * locale
       */
        it('locale property called through setCulture method while dataSource items exist', (done) => {
            setCulture('fr');
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.isPopupOpen).toBe(true);
                listObj.hidePopup();
                setTimeout(() => {
                    expect(listObj.isPopupOpen).toBe(false);
                    done();
                }, 400)
            }, 400);
        });
        /**
         * read only property
         */
        it('readonly ', () => {
            listObj.readonly = false;
            listObj.dataBind();
            //expect(listObj.element.getAttribute('readonly')).toEqual(null);
            listObj.readonly = true;
            listObj.dataBind();
            expect(listObj.element.hasAttribute('readonly')).toEqual(true);
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = listObj.inputWrapper.container;
            listObj.dropDownClick(mouseEventArgs);
            expect(listObj.beforePopupOpen).toEqual(false);
            listObj.keyActionHandler(keyEventArgs);
            expect(listObj.index).toBe(null);
            listObj.readonly = false;
            listObj.dataBind();
        });
        /**
         * cssClass property while popup closed.
         */
        it('cssClass ', () => {
            listObj.cssClass = 'closeState';
            listObj.dataBind();
            expect(listObj.element.parentElement.classList.contains('closeState')).toBe(true);
        });
        /**
         * Width, popupHeight & popupWidth properties in string
         */
        it('Width ', () => {
            listObj.width = '400px';
            listObj.popupWidth = '300px';
            listObj.popupHeight = '300px';
            listObj.dataBind();
            listObj.showPopup();
            expect(listObj.element.parentElement.style.width).toEqual('400px');
            expect(listObj.popupObj.element.style.width).toEqual('300px');
            expect(listObj.popupObj.element.style.maxHeight).toEqual('300px');
        });
        /**
         * Width, popupHeight & popupWidth properties in integer.
         */
        it('Width ', () => {
            listObj.width = 400;
            listObj.popupWidth = 300;
            listObj.popupHeight = 300;
            listObj.dataBind();
            listObj.showPopup();
            expect(listObj.element.parentElement.style.width).toEqual('400px');
            expect(listObj.popupObj.element.style.width).toEqual('300px');
            expect(listObj.popupObj.element.style.maxHeight).toEqual('300px');
        });
        /**
         * text
         */
        it('text based selection', () => {
            listObj.text = 'JAVA';
            listObj.dataBind();
            let ele: Element = listObj.popupObj.element;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[3].classList.contains('e-active')).toBe(true);
            listObj.text = 'JUICE';
            listObj.dataBind();
            expect(li[3].classList.contains('e-active')).toBe(true);
            expect(listObj.text).toBe('JAVA');
            listObj.text = null;
            listObj.dataBind();
            expect(isNullOrUndefined(listObj.value)).toBe(true);
        });
        /**
         * value
         */
        it('value based selection', () => {
            listObj.value = 'id3';
            listObj.dataBind();
            let ele: Element = listObj.popupObj.element;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[2].classList.contains('e-active')).toBe(true);
            listObj.value = 'id332312';
            listObj.dataBind();
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(listObj.value).toBe('id3');
            listObj.value = null;
            listObj.dataBind();
            expect(listObj.value == null).toBe(true);
            expect(listObj.text == null).toBe(true);
        });
        /**
         * Index
         */
        it('Index based selection', () => {
            listObj.index = 1;
            listObj.dataBind();
            let ele: Element = listObj.popupObj.element;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[1].classList.contains('e-active')).toBe(true);
            listObj.index = 10;
            listObj.dataBind();
            expect(li[1].classList.contains('e-active')).toBe(true);
            expect(listObj.index).toBe(1);
        });
        /**
         * place holder property 
         */
        it('placeholder ', () => {
            listObj.placeholder = 'Enter text';
            listObj.dataBind();
            expect(listObj.element.getAttribute('placeholder')).toEqual('Enter text');
        });
        /**
         * cssClass property
         */
        it('cssClass ', () => {
            listObj.showPopup();
            listObj.cssClass = 'temp';
            listObj.dataBind();
            expect(listObj.element.parentElement.classList.contains('temp')).toEqual(true);
            expect(listObj.popupObj.element.classList.contains('temp')).toEqual(true);
        });
        /**
         * enabled property
         */
        it('enabled ', () => {
            listObj.enabled = false;
            listObj.dataBind();
            expect(listObj.element.classList.contains('e-disabled')).toEqual(true);
            expect(listObj.inputWrapper.container.classList.contains('e-disabled')).toEqual(true);
            expect(listObj.element.getAttribute('aria-disabled')).toEqual('true');
            expect(listObj.element.getAttribute('disabled')).toEqual('disabled');
            listObj.enabled = true;
            listObj.dataBind();
            expect(listObj.element.classList.contains('e-disabled')).toEqual(false);
            expect(listObj.inputWrapper.container.classList.contains('e-disabled')).toEqual(false);
            expect(listObj.element.getAttribute('aria-disabled')).toEqual('false');
            expect(listObj.element.getAttribute('disabled')).toEqual(null);
        });
        /**
         * enableRtl
         */
        it('enableRtl ', () => {
            listObj.enableRtl = true;
            listObj.dataBind();
            listObj.showPopup();
            expect(listObj.element.parentElement.classList.contains('e-rtl')).toEqual(true);
            expect(listObj.popupObj.element.classList.contains('e-rtl')).toBe(true);
            expect(listObj.popupObj.enableRtl).toEqual(true);
            listObj.hidePopup();
            listObj.enableRtl = false;
            listObj.dataBind();
            listObj.showPopup();
            expect(listObj.element.parentElement.classList.contains('e-rtl')).toEqual(false);
            expect(listObj.popupObj.element.classList.contains('e-rtl')).toBe(false);
            expect(listObj.popupObj.enableRtl).toEqual(false);
            document.body.innerHTML = '';
        });
        /**
         * htmlAttributes
         */
        it('htmlAttributes', () => {
            listObj.htmlAttributes = { name: 'dropdown', required: "true", class: 'e-ddl-list', disabled: 'disabled', readonly: 'readonly', style: 'margin: 0', role: 'listbox', placeholder: 'new text' };
            listObj.dataBind();
            expect(listObj.hiddenElement.getAttribute('name')).toBe('dropdown');
            expect(listObj.hiddenElement.getAttribute('required')).toBe('true');
            expect(listObj.element.parentElement.classList.contains('e-ddl-list')).toBe(true);
            expect(listObj.element.parentElement.classList.contains('e-disabled')).toBe(true);
            expect(listObj.element.getAttribute('placeholder')).toBe('new text');
            expect(listObj.element.parentElement.getAttribute('role')).toBe('listbox');
            expect(listObj.element.parentElement.getAttribute('style')).toBe('margin: 0');
        })
        /**
         * data source property
         */
        it('data source ', () => {
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: datasource2, index: 5, popupHeight: 100, fields: { value: 'id', text: 'text' } });
            listObj.appendTo(element);
            listObj.showPopup();
            listObj.value = 'list3';
            listObj.dataSource = datasource;
            listObj.dataBind();
            let items: HTMLElement[] = listObj.popupObj.element.querySelectorAll('li');
            expect(items.length).toEqual(5);
            expect(listObj.text === 'C++').toBe(true);
        });
        /**
         * text with null
         */
        it('nullable text ', () => {
            listObj.text = null;
            listObj.dataBind();
            expect(listObj.index).toEqual(null);
            expect(listObj.text).toEqual(null);
            expect(listObj.value).toEqual(null);
            expect(listObj.item).toEqual(null);
            expect(listObj.itemData).toEqual(null);
        });
        /**
         * Index with null
         */
        it('nullable index ', () => {
            listObj.index = 2;
            listObj.dataBind();
            listObj.index = null;
            listObj.dataBind();
            expect(listObj.index).toEqual(null);
            expect(listObj.text).toEqual(null);
            expect(listObj.value).toEqual(null);
            expect(listObj.item).toEqual(null);
            expect(listObj.itemData).toEqual(null);
        });
        /**
         * Value with null
         */
        it('nullable value ', () => {
            listObj.value = 'list3';
            listObj.dataBind();
            listObj.value = null;
            listObj.dataBind();
            expect(listObj.index).toEqual(null);
            expect(listObj.text).toEqual(null);
            expect(listObj.value).toEqual(null);
            expect(listObj.item).toEqual(null);
            expect(listObj.itemData).toEqual(null);
            element.parentElement.remove();
            document.body.innerHTML = '';
        });
        it('footerTemplate ', () => {
            listObj.footerTemplate = 'Total items count 5';
            listObj.dataBind();
            expect(listObj.popupObj.element.lastElementChild.innerHTML).toEqual(listObj.footerTemplate);
            listObj.footerTemplate = 'Overall 5 cources available';
            listObj.dataBind();
            expect(listObj.popupObj.element.lastElementChild.innerHTML).not.toEqual('Total items count 5');
        })
    });

    // Initialize the properties
    describe('Initialize properties changes', () => {
        let listObj: any;
        let element: HTMLElement;
        beforeEach(() => {
            element = createElement('input', { id: 'DropDownList' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (element) {
                let parent: HTMLElement = element.parentElement as HTMLElement;
                parent.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * value
         */
        it('value at initialize ', () => {
            listObj = new DropDownList({ dataSource: datasource, fields: { value: 'id' }, value: 'list2' });
            listObj.appendTo(element);
            listObj.showPopup();
            let ele: Element = listObj.popupObj.element;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[1].classList.contains('e-active')).toBe(true);
        });
        /**
         * Index
         */
        it('index at initialize ', () => {
            listObj = new DropDownList({ dataSource: datasource, index: 2, fields: { text: 'text', value: 'id' } });
            listObj.appendTo(element);
            listObj.showPopup();
            let ele: Element = listObj.popupObj.element;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[2].classList.contains('e-active')).toBe(true);
        });
        /**
         * text
         */
        it('text at initialize ', () => {
            listObj = new DropDownList({ dataSource: datasource, fields: { value: 'id', text: 'text' }, text: '.NET' });
            listObj.appendTo(element);
            listObj.showPopup();
            let ele: Element = listObj.popupObj.element;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[3].classList.contains('e-active')).toBe(true);
        });
        /**
         * Value integer type checking
         */
        it('value in integer type', () => {
            let datasource: { [key: string]: Object }[] = [{ id: 1, text: 'JAVA', icon: 'icon' }, { id: 2, text: 'C#' },
            { id: 3, text: 'C++' }, { id: 4, text: '.NET', icon: 'icon' }, { id: 5, text: 'Oracle' }];
            listObj = new DropDownList({ dataSource: datasource, index: 3, fields: { text: 'text', value: 'id' } });
            listObj.appendTo(element);
            listObj.showPopup();
            let li: Element[] = listObj.popupObj.element.querySelectorAll('li');
            expect((li[3]).classList.contains('e-active')).toBe(true);
            expect(listObj.value).toBe(4);
        });
        /**
        *  component render with not exist text in dataSource
        */
        it('component render with not exist text in dataSource ', () => {
            listObj = new DropDownList({ dataSource: datasource, fields: { value: 'id', text: 'text' }, text: 'ASP.NET' });
            listObj.appendTo(element);
            expect(listObj.text === null).toBe(true);
            expect(listObj.value === null).toBe(true);
            expect(listObj.index === null).toBe(true);
        });
    });
    // template supports
    describe('Template support', () => {
        let listObj: any;
        let listObj1: any;
        let listObj2: any;
        let element1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl' });
        let element2: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddl2' });
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', type: 'keydown' };
        afterAll(() => {
            element1.remove();
            element2.remove();
            document.body.innerHTML = '';
        });
        it('string header template property', () => {
            document.body.appendChild(element1);
            listObj1 = new DropDownList({ dataSource: datasource2, headerTemplate: "header", footerTemplate: "footer", popupHeight: '300px' });
            listObj1.appendTo(element1);
            listObj1.showPopup();
            expect(listObj1.headerTemplate).toEqual(listObj1.popupObj.element.firstChild.innerText);
        });
        it('string footer template property', () => {
            expect(listObj1.footerTemplate).toEqual(listObj1.popupObj.element.lastChild.innerText);
        });
        it('value template', () => {
            document.body.innerHTML = '';
            document.body.appendChild(element2);
            listObj2 = new DropDownList({
                dataSource: datasource2,
                fields: { text: 'text', value: 'id' },
                valueTemplate: "<div class='ename'> ${id} </div>"
            });
            listObj2.appendTo(element2);
            listObj2.showPopup();
            listObj2.index = 3;
            listObj2.dataBind();
            let valueEle: HTMLElement = listObj2.element.parentElement.querySelector('.e-input-value');
            expect(valueEle.innerHTML).toEqual('<div class="ename"> list1 </div>');
            expect(listObj2.element.parentElement.childNodes[1].classList.contains('e-input-value')).toBe(true);
            expect(listObj2.element.style.display).toBe('none');
        });
        it('value template with null value', () => {
            listObj2.value = null;
            listObj2.dataBind();
            expect(listObj2.element.style.display).toBe('block');
            expect(listObj2.element.parentElement.firstChild.classList.contains('e-input-value')).not.toBe(true);

        });

        it('escape key - after value select and previous empty text box', (done) => {
            keyEventArgs.action = 'open';
            listObj2.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                keyEventArgs.action = 'down';
                listObj2.keyActionHandler(keyEventArgs);
                expect(listObj2.inputElement.value !== '').toBe(true);
                keyEventArgs.action = 'escape';
                listObj2.keyActionHandler(keyEventArgs);
                setTimeout(() => {
                    let valueTemp: Element = document.querySelector('.e-input-value')
                    expect(isNullOrUndefined(valueTemp)).toBe(true);
                    expect(listObj2.isPopupOpen).toBe(false);
                    done();
                }, 450);
            }, 450);
        });

        it('escape key - after value select and previous not empty text box', (done) => {
            listObj2.value = 'id2';
            listObj2.dataBind();
            keyEventArgs.action = 'open';
            listObj2.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                keyEventArgs.action = 'down';
                listObj2.keyActionHandler(keyEventArgs);
                keyEventArgs.action = 'escape';
                listObj2.keyActionHandler(keyEventArgs);
                setTimeout(() => {
                    let valueTemp: HTMLElement = <HTMLElement>document.querySelector('.ename')
                    expect(valueTemp.innerText === 'id2').toBe(true);
                    expect(listObj2.isPopupOpen).toBe(false);
                    done();
                }, 450);
            }, 450);
        });

        it('value template with value', () => {
            listObj2.value = 'id3';
            listObj2.valueTemplate = null;
            listObj2.dataBind();
            expect(listObj2.element.style.display).toBe('block');
            expect(listObj2.element.parentElement.firstChild.classList.contains('e-input-value')).not.toBe(true);
        });
    });

    // Method testing
    describe('method testing ', () => {
        let listObj: any;
        let element: HTMLInputElement;
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 700;
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
            listObj = new DropDownList({ fields: { text: 'text', value: 'id' } });
            listObj.appendTo(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) { element.remove(); };
            document.body.innerHTML = '';
        });
        /**
         * show popup method
         */
        it('show popup method', (done) => {
            expect(listObj.inputWrapper.container.getAttribute('aria-expanded')).toBe('false');
            listObj.showPopup();
            setTimeout(function () {
                expect(listObj.isPopupOpen).toEqual(true);
                expect(listObj.element.parentElement.classList.contains('e-icon-anim')).toEqual(true);
                expect(listObj.element.parentElement.classList.contains('e-input-focus')).toEqual(true);
                expect(listObj.inputWrapper.container.getAttribute('aria-expanded')).toBe('true');
                expect(listObj.inputWrapper.container.getAttribute('aria-hasPopup')).toBe('true');
                listObj.showPopup();
                expect(listObj.isPopupOpen).toEqual(true);
                expect(listObj.element.parentElement.classList.contains('e-input-focus')).toEqual(true);
                done();
            }, 450);
        });
        /**
         * hide popup method
         */
        it('Hide popup method', (done) => {
            listObj.hidePopup();
            expect(listObj.inputWrapper.container.getAttribute('aria-expanded')).toBe('false');
            setTimeout(function () {
                expect(listObj.isPopupOpen).toEqual(false);
                listObj.hidePopup();
                expect(listObj.isPopupOpen).toEqual(false);
                done();
            }, 450);

        });
        /**
         * focusIn method
         */
        it('focus method ', () => {
            listObj.focusIn();
            expect(listObj.element.parentElement.classList.contains('e-input-focus')).toBe(true);
        });
        /**
         * focusOut method
         */
        it('focusOut method ', () => {
            listObj.focusOut();
            expect(listObj.element.parentElement.classList.contains('e-input-focus')).toBe(false);
        });

        /**
         * getModuleName
         */
        it('getModuleName method', () => {
            let name: string = listObj.getModuleName();
            expect(name).toEqual('dropdownlist');
        });
        /**
         * getPersistData
         */
        it('getPersistData method ', () => {
            let stringItems: any = listObj.getPersistData();
            expect(stringItems.search('value')).toBe(2);
        });
        /**
         * hovering
         */
        it('hovering method ', () => {
            listObj.dataSource = datasource;
            listObj.dataBind();
            let items: Element[] = listObj.popupObj.element.querySelectorAll('li');
            listObj.setHover(items[3]);
            expect(items[3].classList.contains('e-hover')).toBe(true);
            listObj.setHover(items[3]);
        });
        /**
         * removeHover
         */
        it('removeHover method ', () => {
            let hoveredLi: Element = listObj.popupObj.element.querySelector('.e-hover');
            listObj.removeHover(hoveredLi);
            expect(hoveredLi.classList.contains('e-hover')).toBe(false);
        });
        it('getElementByText', () => {
            listObj.fields = { text: 'text', value: 'id' };
            listObj.dataBind();
            let text: string = 'c#';
            let value: string = listObj.getValueByText(text, true);
            expect(value).toEqual('list2');
        });
        it('addItem ', () => {
            listObj.addItem({ id: 'list14', text: 'PHP' }, 0);
            expect(listObj.list.querySelector('li').textContent).toBe('PHP');
        })
        it('addItem with selection ', () => {
            listObj.index = 2;
            listObj.dataBind();
            listObj.addItem({ id: 'list04', text: 'TypeScript' }, 3);
            expect(listObj.list.querySelector('li').textContent).not.toBe('TypeScript');
        })
        it('getValueByText with number type value', () => {
            listObj.dataSource = [1, 2, 3, 4, 5, 6, 7];
            listObj.fields = { text: null, value: null };
            listObj.dataBind();
            let value: number = listObj.getValueByText('3');
            expect(value).toBe(3);
        })
        it('getValueByText with string type value', () => {
            listObj.dataSource = ['Cricket', 'FootBall', 'Tennis', 'VolleyBall'];
            listObj.dataBind();
            let value: string = listObj.getValueByText('cricket', true);
            expect(value).toBe('Cricket');
            let value2: string = listObj.getValueByText('tennis');
            expect(value2).not.toBe('Tennis');
        })
        it('getTextByValue  with number type value', () => {
            listObj.dataSource = [1, 2, 3, 4, 5, 6, 7];
            listObj.fields = { text: null, value: null };
            listObj.dataBind();
            let value: string = listObj.getTextByValue(2);
            expect(value).toBe('2');
        })
        /**
         * destroy
         */
        it('destroy method ', () => {
            listObj.destroy();
            expect(!!listObj.element.classList.contains('e-dropdownlist')).toBe(false);
            document.body.innerHTML = '';
        });
    });
    describe(' number of array dataSource ', () => {
        let listObj: any;
        let datasource1: number[] = [1, 2, 3, 4, 5, 6, 7];
        beforeAll(() => {
            let element: HTMLElement = createElement('input', { id: 'list' });
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: datasource1, text: 4 as any });
            listObj.appendTo(element);
        });
        afterAll(() => {
            listObj.destroy();
            document.body.innerHTML = '';
        });
        it(' check initial value, text and index ', () => {
            expect(listObj.value === 4).toBe(true);
            expect(listObj.text === 4).toBe(true);
            expect(listObj.index === 3).toBe(true);
        });
    });

    describe('Before list creation AddItem method testing ', () => {
        let listObj: any;
        let datasource1: { [key: string]: Object }[] = [{ 'text': 'Audi', 'id': 'e807' },
        { 'text': 'BMW', 'id': 'a0cc' }, { 'text': 'BENZ', 'id': 'f8435' }];
        beforeAll(() => {
            let element: HTMLElement = createElement('input', { id: 'list' });
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: datasource2, fields: { text: 'text', value: 'id' } });
            listObj.appendTo(element);
        });
        afterAll(() => {
            listObj.destroy();
            document.body.innerHTML = '';
        });
        it('AddItem testing ', () => {
            listObj.addItem({ id: 'bike01', text: 'Suzuki' }, 0);
            expect(listObj.list.querySelector('li').textContent).toBe('Suzuki');
        });
    });
    // angular tag testing
    describe('Angular tag testing ', () => {
        let listObj: any;
        let datasource1: { [key: string]: Object }[] = [{ 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
        beforeAll(() => {
            let element: any = createElement('EJS-DROPDOWNLIST', { id: 'dropdownlist' });
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: datasource2 });
            listObj.appendTo(element);
        });
        afterAll(() => {
            listObj.destroy();
            document.body.innerHTML = '';
        });
        it('Wrapper testing ', () => {
            expect(listObj.element.tagName).toEqual('EJS-DROPDOWNLIST');
            expect(listObj.inputWrapper.container.parentElement).toBe(listObj.element);
        });
    });
    // Event testing

    describe('Select event triggered', () => {
        let listObj: any;
        let element: HTMLElement;
        let data: string[] = ['Basketball', 'Football', 'Hockey', 'Snooker'];
        let selectAction: EmitType<Object> = jasmine.createSpy('Select');
        let changeAction: EmitType<Object> = jasmine.createSpy('Change');
        let originalTimeout: number;
        beforeEach(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            element = createElement('input', { id: 'list' });
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: data, change: changeAction, select: selectAction, index: 2 });
            listObj.appendTo(element);
        });
        afterEach(() => {
            if (element) {
                element.parentElement.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * select  event
         */
        it('select event trigger at initialize and check aria-activedescendant', (done) => {
            expect(changeAction).not.toHaveBeenCalled();
            expect(selectAction).not.toHaveBeenCalled();
            expect(listObj.inputWrapper.container.getAttribute('aria-activedescendant')).toBe('null');
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.inputWrapper.container.getAttribute('aria-activedescendant') !== 'null').toBe(true);
                let items: Element[] = listObj.popupObj.element.querySelectorAll('li');
                listObj.setSelection(items[0]);
                expect(selectAction).toHaveBeenCalled();
                expect(changeAction).not.toHaveBeenCalled();
                done()
            }, 450)
        });

        /**
         * change event
         */
        it('change event trigger when value selected', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', type: 'keydown' };
                listObj.keyActionHandler(keyEventArgs);
                expect(selectAction).toHaveBeenCalled();
                keyEventArgs.action = 'enter';
                listObj.keyActionHandler(keyEventArgs);
                expect(changeAction).toHaveBeenCalled();
                done();
            }, 450);
        });

    });
    describe('event testing ', () => {
        let listObj: any;
        let element: HTMLInputElement;
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: datasource2, fields: { text: 'text', value: 'id' } });
            listObj.appendTo(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) { element.remove(); };
            document.body.innerHTML = '';
        });

        it('document click event', (done) => {
            listObj.allowFiltering = true;
            listObj.showPopup();
            setTimeout(() => {
                mouseEventArgs.target = document.getElementsByTagName('HTML')[0];
                mouseEventArgs.srcElement = document.getElementsByTagName('HTML')[0];
                listObj.onDocumentClick(mouseEventArgs);
                setTimeout(function () {
                    expect(listObj.isPopupOpen).toBe(false);
                    done();
                }, 450);
            }, 450)
        });
        it('documentclick event in this.element', (done) => {
            listObj.showPopup();
            mouseEventArgs.target = listObj.element;
            listObj.onDocumentClick(mouseEventArgs);
            setTimeout(function () {
                expect(listObj.isPopupOpen).toBe(true);
                done();
            }, 250);
        });
        it('mouse click on input', (done) => {
            listObj.dropDownClick(mouseEventArgs);
            expect(listObj.isPopupOpen).toBe(true);
            setTimeout(function () {
                expect(listObj.isPopupOpen).toBe(false);
                done();
            }, 450);
        });
        it('mouse click on disabled input', (done) => {
            listObj.enabled = false;
            listObj.dataBind();
            listObj.dropDownClick(mouseEventArgs);
            setTimeout(function () {
                expect(listObj.isPopupOpen).toBe(false);
                done();
            }, 450);
        });
        it('mouse click on list ', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                let item: HTMLElement[] = listObj.popupObj.element.querySelectorAll('li')[3];
                mouseEventArgs.target = item;
                mouseEventArgs.type = 'click';
                listObj.onMouseClick(mouseEventArgs);
                setTimeout(function () {
                    expect(listObj.isPopupOpen).toBe(false);
                    done();
                }, 450);
            }, 450)
        });
        it('change & close event trigger ', (done) => {
            listObj.enabled = true;
            listObj.showPopup();
            let closeAction: EmitType<Object> = jasmine.createSpy('Open');
            listObj.close = closeAction;
            setTimeout(() => {
                let item: HTMLElement[] = listObj.popupObj.element.querySelectorAll('li')[4];
                mouseEventArgs.target = item;
                mouseEventArgs.type = 'click';
                listObj.onMouseClick(mouseEventArgs);
                setTimeout(function () {
                    expect(closeAction).toHaveBeenCalled();
                    expect(listObj.value).toEqual(listObj.listData[4][listObj.fields.value]);
                    expect(listObj.isPopupOpen).toBe(false);
                    done();
                }, 450);
            }, 450);
        });
        /**
         * select event
         */
        it('select & open event trigger', (done) => {
            let selectAction: EmitType<Object> = jasmine.createSpy('Select');
            let openAction: EmitType<Object> = jasmine.createSpy('Open');
            listObj.select = selectAction;
            listObj.open = openAction;
            listObj.showPopup();
            setTimeout(() => {
                expect(openAction).toHaveBeenCalled();
                let items: Element[] = listObj.popupObj.element.querySelectorAll('li');
                listObj.setSelection(items[2]);
                expect(selectAction).toHaveBeenCalled();
                done()
            }, 450)
        });

        it('blur event', (done) => {
            listObj.hidePopup();
            setTimeout(() => {
                mouseEventArgs.target = document.body;
                listObj.showPopup();
                setTimeout(() => {
                    listObj.onBlur(mouseEventArgs);
                    setTimeout(() => {
                        expect(listObj.isPopupOpen).toBe(false);
                        done()
                    }, 450)
                }, 450);
            }, 450)
        });
        describe('change event arguments', () => {
            let listObj: any;
            let element: HTMLInputElement;
            let datasource1: { [key: string]: Object }[] = [{ 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
            { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
            beforeAll(() => {
                element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
                document.body.appendChild(element);
            });
            afterAll(() => {
                document.body.innerHTML = '';
            });
            it("change value checking", () => {
                listObj = new DropDownList({
                    dataSource: datasource1,
                    fields: { text: "text", value: "id" },
                    index: 0
                });
                listObj.appendTo(element);
                expect(listObj.text).toEqual('Audi A6');
                listObj.change = function(args: any){
                    expect(args.previousItemData.text).toEqual('Audi A6');
                    expect(args.element).not.toBe(null);
                };
                listObj.index = 2;
                listObj.dataBind();
            });
        });
    });

    describe(' hidden element ', () => {
        let listObj: any;
        let element: HTMLInputElement;
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let datasource1: { [key: string]: Object }[] = [{ 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
        let originalTimeout: number;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it("name attribute as id of this.element", () => {
            let ddl: DropDownList = new DropDownList({}, element);
            let select: HTMLSelectElement[] = <HTMLSelectElement[] & NodeListOf<HTMLSelectElement>>element.parentElement.querySelectorAll('select');
            expect(select.length).toBe(1);
            expect(element.id).toBe(select[0].getAttribute('name'));
        });
        it("name attribute as name of this.element", () => {
            element.setAttribute('name', 'select1');
            let ddl: DropDownList = new DropDownList({}, element);
            let select: HTMLSelectElement[] = <HTMLSelectElement[] & NodeListOf<HTMLSelectElement>>element.parentElement.querySelectorAll('select');
            expect('select1').toBe(select[0].getAttribute('name'));
        });
        it("select value checking", () => {
            element.setAttribute('name', 'select1');
            let ddl: DropDownList = new DropDownList({
                dataSource: datasource1,
                fields: { text: "text", value: "id" },
                text: "BMW 3"
            });
            ddl.appendTo(element);
            let option: HTMLOptionElement[] = <HTMLOptionElement[] & NodeListOf<HTMLElement>>element.parentElement.querySelectorAll('select>option');
            expect(option.length).toBe(1);
            expect(ddl.value).toBe(option[0].value);
            expect(option[0].selected).toBe(true);
            ddl.text = 'Audi A6';
            ddl.dataBind();
            let option1: HTMLOptionElement[] = <HTMLOptionElement[] & NodeListOf<HTMLElement>>element.parentElement.querySelectorAll('select>option');
            expect(option.length).toBe(1);
            expect(ddl.value).toBe(option1[0].value);
            expect(option1[0].selected).toBe(true);
        });

    });
    describe("select element Rendering", () => {
        let listObj: any;
        let element: string = "<select id='select1'><option>option1</option><option value='option2'>option2</option></select>";
        let groupelement: string = "<select id='select2'><optgroup label='option'><option>option1</option><option value='option2' disabled>option2</option></optgroup><option>option3</option></select>";
        /**
         * Select Rendering
         */
        it('Select Rendering with options only', () => {
            document.body.innerHTML = element;
            let select: HTMLSelectElement = document.getElementById('select1') as HTMLSelectElement;
            listObj = new DropDownList();
            listObj.appendTo(select);
            listObj.value = 'option1';
            listObj.dataBind();
            listObj.showPopup();
            let ele: HTMLElement = listObj.popupObj.element;
            expect(ele.querySelectorAll('li').length).toBe(2);
            expect(ele.querySelectorAll('li')[0].innerText).toBe('option1');
            expect(ele.querySelectorAll('li')[0].getAttribute('data-value')).toBe('option1');
            expect(ele.querySelectorAll('li')[1].getAttribute('data-value')).toBe('option2');
        });
        it('Select Rendering with options and optgroup', () => {
            document.body.innerHTML = groupelement;
            let groupselect: HTMLSelectElement = document.getElementById('select2') as HTMLSelectElement;
            listObj = new DropDownList();
            listObj.appendTo(groupselect);
            listObj.index = 1;
            listObj.dataBind();
            listObj.showPopup();
            let ele: HTMLElement = listObj.popupObj.element;
            expect(ele.querySelectorAll('li').length).toBe(4);
            expect(ele.querySelectorAll('li')[0].innerText).toBe('option3');
            expect(ele.querySelectorAll('li')[1].classList).toContain('e-list-group-item');
            expect(ele.querySelectorAll('li')[2].getAttribute('data-value')).toBe('option1');
            expect(ele.querySelectorAll('li')[3].getAttribute('data-value')).toBe('option2');
            expect(ele.querySelectorAll('li')[3].textContent).toBe('option2');
        });
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
    });
    describe('Rendering by UL-LI tag', () => {
        let ele: HTMLElement = document.createElement('ul');
        ele.id = 'newlist';
        ele.innerHTML = '<li id="i1">item1</li>' +
            '<li id="i2">item2</li><li id="i3">item3</li><li id="i4" disabled>item4</li><li id="i5">item5</li>' +
            '<li>item6</li><li>item7</li>';
        let listObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new DropDownList();
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
                document.body.innerText = '';
            }
        })
        it('ul-li rendering', () => {
            listObj.text = 'item1';
            listObj.dataBind();
            listObj.showPopup();
            let ele: HTMLElement = listObj.popupObj.element;
            expect(ele.querySelectorAll('li').length).toBe(7);
            expect(listObj.element.classList.contains('e-control')).toBe(true);
            expect(listObj.element.style.display).toBe('none');
        });
    });

    // Keyboard Interaction
    describe('key actions', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let list: any;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('input', { id: 'DropDownList' });
            document.body.appendChild(ele);
            list = new DropDownList({
                dataSource: datasource, fields: { text: 'text', value: 'id' }
            });
            list.appendTo(ele);
        });
        afterAll(() => {
            ele.remove();
            list.destroy();
            document.body.innerHTML = '';
        });
        /**
        * Tab Key without open popup
        */
        it("Tab Key without open popup ", () => {
            list.focusIn();
            keyEventArgs.action = 'tab';
            list.keyActionHandler(keyEventArgs);
            expect(isNullOrUndefined(list.list)).toBe(true);
        })
        /**
         * Tab Key
         */
        it("Tab key ", (done) => {
            list.showPopup();
            setTimeout(() => {
                keyEventArgs.action = 'tab';
                list.keyActionHandler(keyEventArgs);
                setTimeout(() => {
                    expect(list.isPopupOpen).toBe(false);
                    expect(list.popupObj.element.classList.contains("e-popup-close")).toEqual(true);
                    done();
                }, 300);
            }, 450);
        });
        /**
         * Shift+Tab Key
         */
        it("Shift+Tab key ", (done) => {
            list.showPopup();
            setTimeout(() => {
                expect(list.isPopupOpen).toBe(true);
                keyEventArgs.action = 'close';
                list.keyActionHandler(keyEventArgs);
                setTimeout(() => {
                    expect(list.isPopupOpen).toBe(false);
                    expect(list.popupObj.element.classList.contains("e-popup-close")).toEqual(true);
                    done();
                }, 300);
            }, 450)
        });
        /**
         * DownKey
         */
        it('Down key pressed ', () => {
            list.index = 1;
            list.dataBind();
            let li: Element[] = list.popupObj.element.querySelectorAll('li');
            expect(li[1].classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'down';
            list.keyActionHandler(keyEventArgs);
            expect(li[1].classList.contains('e-active')).toBe(false);
            expect(li[2].classList.contains('e-active')).toBe(true);
            list.index = null;
            list.dataBind();
            list.keyActionHandler(keyEventArgs);
            expect(li[0].classList.contains('e-active')).toBe(true);
        });
        /**
         * DownKey
         */
        it('Down key to last li ', () => {
            let ele: Element = list.popupObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            list.setSelection(li[li.length - 1]);
            expect((li[li.length - 1] as Element).classList.contains('e-active')).toBe(true);
            list.keyActionHandler(keyEventArgs);
            expect((li[1] as Element).classList.contains('e-active')).toBe(false);
        });
        /**
         * UpKey
         */
        it('Up key pressed ', () => {
            let li: Element[] = list.popupObj.element.querySelectorAll('li');
            list.setSelection(li[3]);
            expect(li[3].classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'up';
            list.keyActionHandler(keyEventArgs);
            expect(li[2].classList.contains('e-active')).toBe(true);
            list.index = null;
            list.dataBind();
            list.keyActionHandler(keyEventArgs);
            expect(li[0].classList.contains('e-active')).toBe(true);
        });
        /**
         * UpKey
         */
        it('Up key pressed for 0th li ', () => {
            let ele: Element = list.popupObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            keyEventArgs.action = 'up';
            list.keyActionHandler(keyEventArgs);
            expect((li[li.length - 1] as Element).classList.contains('e-active')).toBe(false);
        });
        /**
         * HomeKey
         */
        it('Home key pressed ', () => {
            let ele: Element = list.popupObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            list.setSelection(li[3]);
            expect((li[3] as Element).classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'home';
            list.keyActionHandler(keyEventArgs);
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
        });
        /**
         * HomeKey
         */
        it('Home key pressed to 0th li ', () => {
            let ele: Element = list.popupObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            list.setSelection(li[0]);
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'home';
            list.keyActionHandler(keyEventArgs);
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
        });
        /**
         * EndKey
         */
        it('End key pressed ', () => {
            let ele: Element = list.popupObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            list.setSelection(li[3]);
            expect((li[3] as Element).classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'end';
            list.keyActionHandler(keyEventArgs);
            expect((li[li.length - 1] as Element).classList.contains('e-active')).toBe(true);
        });
        /**
         * EndKey
         */
        it('End key pressed to last li', () => {
            let ele: Element = list.popupObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            list.setSelection(li[li.length - 1]);
            expect((li[li.length - 1] as Element).classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'end';
            list.keyActionHandler(keyEventArgs);
            expect((li[li.length - 1] as Element).classList.contains('e-active')).toBe(true);
        });
        /**
         * pageUp key without open popup
         */
        it('pageUp key without open popup', () => {
            let ele: Element = list.popupObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            keyEventArgs.action = 'pageUp';
            list.keyActionHandler(keyEventArgs);
            expect((li[li.length - 1] as Element).classList.contains('e-active')).toBe(true);
        });
        /**
         * pageUp key without open popup
         */
        it('pageDown key without open popup', () => {
            let ele: Element = list.popupObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            keyEventArgs.action = 'pageDown';
            list.keyActionHandler(keyEventArgs);
            expect((li[li.length - 1] as Element).classList.contains('e-active')).toBe(true);
        });
        /**
         * Page_up key
         */
        it('Page_up key pressed ', (done) => {
            list.showPopup();
            setTimeout(() => {
                let ele: Element = list.popupObj.element;
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
                list.setSelection(li[4]);
                expect((li[4] as Element).classList.contains('e-active')).toBe(true);
                keyEventArgs.action = 'pageUp';
                list.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                list.list.querySelector('ul').style.height = '50px';
                list.dataBind();
                list.list.querySelector('ul').style.overflow = 'auto';
                list.list.querySelector('ul').style.display = 'block';
                list.setSelection(li[4]);
                keyEventArgs.action = 'pageUp';
                list.keyActionHandler(keyEventArgs);
                done();
            }, 450);
        });
        /**
         * HomeKey
         */
        it('Page_up key pressed to 0th li ', () => {
            let ele: Element = list.popupObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            list.setSelection(li[0]);
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'pageUp';
            list.keyActionHandler(keyEventArgs);
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            list.index = li.length;
            list.dataBind();
            list.keyActionHandler(keyEventArgs);
        });
        /**
         * Page_down key
         */
        it('Page_down key pressed ', () => {
            let ele: Element = list.popupObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            list.setSelection(li[3]);
            expect((li[3] as Element).classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'pageDown';
            list.keyActionHandler(keyEventArgs);
            expect((li[li.length - 1] as Element).classList.contains('e-active')).toBe(true);
            list.list.querySelector('ul').style.height = '50px';
            list.dataBind();
            list.list.querySelector('ul').style.overflow = 'auto';
            list.list.querySelector('ul').style.display = 'block';
            list.setSelection(li[1]);
            keyEventArgs.action = 'pageDown';
            list.keyActionHandler(keyEventArgs);
        });
        /**
         * EndKey
         */
        it('Page_down key pressed to last li', () => {
            let ele: Element = list.popupObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            list.setSelection(li[li.length - 1]);
            expect((li[li.length - 1] as Element).classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'pageDown';
            list.keyActionHandler(keyEventArgs);
            expect((li[li.length - 1] as Element).classList.contains('e-active')).toBe(true);
            list.index = 0;
            list.dataBind();
            list.keyActionHandler(keyEventArgs);
        });
        /**
       * space key
       */
        it('Space key - popup open state', (done) => {
            keyEventArgs.action = 'space';
            list.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(list.isPopupOpen).toBe(true);
                list.hidePopup();
                setTimeout(() => {
                    expect(list.isPopupOpen).toBe(false);
                    done();
                }, 450);
            }, 450);
        });
        /**
      * space key
      */
        it('Space key - popup hidden state', (done) => {
            keyEventArgs.action = 'space';
            list.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(list.isPopupOpen).toBe(true);
                list.hidePopup();
                setTimeout(() => {
                    expect(list.isPopupOpen).toBe(false);
                    done();
                }, 450);
            }, 450);
        });
    });
    describe('key actions after manual scroll', () => {
        describe('without group', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let list: any;
            let ele: HTMLElement;
            beforeAll(() => {
                ele = createElement('input', { id: 'DropDownList' });
                document.body.appendChild(ele);
                list = new DropDownList({
                    dataSource: datasource2, fields: { text: 'text', value: 'id' },
                    index: 4
                });
                list.appendTo(ele);
            });
            afterAll((done) => {
                list.hidePopup();
                setTimeout(() => {
                    list.destroy();
                    ele.remove();
                    done();
                }, 450)
            });
            it('down && up key press after scroll by manually', (done) => {
                list.showPopup();
                setTimeout(() => {
                    expect(list.isPopupOpen).toBe(true);
                    list.list.style.overflow = 'auto';
                    list.list.style.height = '48px';
                    list.list.style.display = 'block';
                    keyEventArgs.action = 'up';
                    list.list.scrollTop = 0;
                    list.keyActionHandler(keyEventArgs);
                    expect(list.list.scrollTop !== 0).toBe(true);
                    list.index = 0;
                    list.dataBind();
                    keyEventArgs.action = 'down';
                    list.list.scrollTop = 90;
                    list.keyActionHandler(keyEventArgs);
                    expect(list.list.scrollTop !== 90).toBe(true);
                    done()
                }, 450)
            });
        });
    });

    describe('with group', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let list: any;
        let ele: HTMLElement;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let scrollItemData: { [key: string]: Object }[] = [{ 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' },
        { 'text': 'BMW 502', 'id': 'f8430', 'category': 'BMW' },
        { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
        beforeAll(() => {
            ele = createElement('input', { id: 'DropDownList' });
            document.body.appendChild(ele);
            list = new DropDownList({
                dataSource: scrollItemData,
                fields: { text: 'text', value: 'id', groupBy: 'category' },
                index: 4
            });
            list.appendTo(ele);
        });
        afterAll((done) => {
            list.hidePopup();
            setTimeout(() => {
                list.destroy();
                ele.remove();
                done();
            }, 450)
        });
        /**
       * Mouse click
       */
        it('mouse click on group item', (done) => {
            list.showPopup();
            setTimeout(() => {
                let items: Element[] = list.popupObj.element.querySelectorAll('li');
                mouseEventArgs.target = items[0];
                list.onMouseClick(mouseEventArgs);
                expect((items[0].classList.contains('e-list-group-item'))).toBe(true);
                expect(list.value === 'b2b1').toBe(true);
                expect(list.beforePopupOpen).toBe(true);
                done();
            }, 450);
        });
        it('down && up key press after scroll by manually', () => {
            expect(list.isPopupOpen).toBe(true);
            list.list.style.overflow = 'auto';
            list.list.style.height = '48px';
            list.list.style.display = 'block';
            keyEventArgs.action = 'up';
            list.list.scrollTop = 0;
            list.keyActionHandler(keyEventArgs);
            expect(list.list.scrollTop !== 0).toBe(true);
            list.index = 0;
            list.dataBind();
            keyEventArgs.action = 'down';
            list.list.scrollTop = 120;
            list.keyActionHandler(keyEventArgs);
            expect(list.list.scrollTop !== 120).toBe(true);
        });
    });
    // Mouse Events
    describe('mouse events', () => {
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let listObj: any;
        let ele: HTMLElement = createElement('input', { id: 'List' });
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new DropDownList({ dataSource: datasource, value: 'list2', fields: { text: 'text', value: 'id' } });
            listObj.appendTo(ele);
        });
        /**
         * Mouse click
         */
        it('mouse click event', () => {
            listObj.showPopup();
            let items: Element[] = listObj.popupObj.element.querySelectorAll('li');
            mouseEventArgs.target = items[2];
            expect((items[2] as Element).classList.contains('e-active')).toBe(false);
            listObj.onMouseClick(mouseEventArgs);
            expect((items[2] as Element).classList.contains('e-active')).toBe(true);
            mouseEventArgs.target = items[3];
            listObj.onMouseClick(mouseEventArgs);
            expect((items[3] as Element).classList.contains('e-active')).toBe(true);
            mouseEventArgs = { target: listObj.list }
            listObj.onMouseClick(mouseEventArgs);
        });
        /**
         * Mouse hover
         */
        it('hover event', () => {
            let li: Element[] = listObj.popupObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0];
            expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
            listObj.onMouseOver(mouseEventArgs);
            expect((li[0] as Element).classList.contains('e-hover')).toBe(true);
        });
        /**
         * Mouse leave
         */
        it('mouse leave event', () => {
            let li: Element[] = listObj.popupObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0];
            expect((li[0] as Element).classList.contains('e-hover')).toBe(true);
            listObj.onMouseLeave(mouseEventArgs);
            expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
        });
        afterAll(() => {
            ele.parentElement.remove();
            document.body.innerHTML = '';
        });
    });
    describe("Animation ", function () {
        let originalTimeout: number;
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'escape' };
        let listObj: any;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3700;
            let element: any;
            element = createElement('div', { id: 'popup1' });
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: datasource2, fields: { text: 'text', value: 'id' } });
            listObj.appendTo(element);
        });
        /**
         * Show popup method
         */
        it("show method ", (done) => {
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.popupObj.element.style.display).not.toEqual('none');
                done();
            }, 300);
        });
        /**
         * Focus element testing
         */
        it('Focus element testing', (done) => {
            let item: Element = listObj.popupObj.element.querySelector('li');
            expect(item.classList.contains('e-item-focus')).toBe(true);
            keyEventArgs.action = 'enter';
            listObj.keyActionHandler(keyEventArgs);
            let FocusItem: Element = listObj.popupObj.element.querySelector('li');
            expect(FocusItem.classList.contains('e-item-focus')).toBe(false);
            expect(FocusItem.classList.contains('e-active')).toBe(true);
            setTimeout(() => {
                expect(listObj.isPopupOpen).toBe(false);
                listObj.keyActionHandler(keyEventArgs);
                setTimeout(() => {
                    expect(listObj.isPopupOpen).toBe(true);
                    done();
                }, 450);
            }, 350);
        })
        /**
         * heide popup method
         */
        it("hide method ", (done) => {
            listObj.hidePopup();
            setTimeout(() => {
                expect(listObj.popupObj.element.classList.contains('e-control')).toBe(false);
                done();
            }, 500);
        });
        /**
         * Esc key
         */
        it('Esc key pressed ', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.popupObj.element.style.display).not.toEqual('none');
                keyEventArgs.action = 'escape';
                listObj.keyActionHandler(keyEventArgs);
            }, 300);
            setTimeout(() => {
                expect(listObj.popupObj.element.classList.contains('e-control')).toBe(false);
                expect(listObj.isPopupOpen).toEqual(false);
                done();
            }, 1000);
        });
        /**
         * Down Key
         */
        it('Down key pressed ', (done) => {
            keyEventArgs.action = 'down';
            listObj.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                let items: HTMLElement[] = listObj.popupObj.element.querySelectorAll('li');
                expect(items[1].classList.contains('e-active')).toBe(true);
                done();
            }, 1000);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (listObj) {
                listObj.destroy();
                document.body.innerHTML = '';
            }
        });
    });

    describe('Keys in input elements', () => {
        let listObj: any;
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ } };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: datasource2, fields: { text: 'text', value: 'id' }, popupHeight: '100px' });
            listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * Down Key while popup closed
         */
        it('Down key pressed ', () => {
            keyEventArgs.action = 'down';
            listObj.keyActionHandler(keyEventArgs);
            let items: HTMLElement[] = listObj.list.querySelectorAll('li');
            expect(items[0].classList.contains('e-active')).toBe(true);
        });
        /**
         * Up Key while popup closed
         */
        it('Up key pressed ', () => {
            keyEventArgs.action = 'up';
            listObj.keyActionHandler(keyEventArgs);
            let items: HTMLElement[] = listObj.list.querySelectorAll('li');
            expect(items[0].classList.contains('e-active')).toBe(true);
        });
        /**
         * Down Key while popup closed
         */
        it('popup - Down key pressed ', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                listObj.list.style.height = '50px';
                listObj.list.style.overflow = 'auto';
                listObj.list.style.display = 'block';
                keyEventArgs.action = 'down';
                keyEventArgs.type = 'keydown';
                keyEventArgs.code = 'ArrowDown';
                listObj.keyActionHandler(keyEventArgs);
                listObj.keyActionHandler(keyEventArgs);
                listObj.keyActionHandler(keyEventArgs);
                listObj.scrollHandler();
                listObj.keyActionHandler(keyEventArgs);
                let items: HTMLElement[] = listObj.list.querySelectorAll('li');
                expect(items[4].classList.contains('e-active')).toBe(true);
                done();
            }, 450);
        });
        /**
         * Up Key while popup open
         */
        it('popup - Up key pressed ', () => {
            keyEventArgs.action = 'up';
            keyEventArgs.type = 'keydown';
            keyEventArgs.code = 'ArrowUp';
            listObj.keyActionHandler(keyEventArgs);
            listObj.keyActionHandler(keyEventArgs);
            listObj.keyActionHandler(keyEventArgs);
            let items: HTMLElement[] = listObj.list.querySelectorAll('li');
            expect(items[1].classList.contains('e-active')).toBe(true);
        });
        /**
         * alt + up arrow to close the popup
         */
        it('Alt + Up arrow pressing', (done) => {
            keyEventArgs.action = 'hide';
            listObj.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(listObj.isPopupOpen).toBe(false);
                done();
            }, 450);
        });
        /**
         * alt + down arrow to open the popup
         */
        it('Alt + Down arrow pressing', (done) => {
            keyEventArgs.action = 'open';
            listObj.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(listObj.isPopupOpen).toBe(true);
                done();
            }, 450);
        });
    });
    describe('DropdownList incremental search', () => {
        let listObj1: any;
        let element: HTMLElement;
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, charCode: 70 };
        let searchList: { [key: string]: Object }[] = [{ text: "Algeria" }, { text: "Bangladesh" }, { text: "Finland" },
        { text: "Cuba" }, { text: "Denmark", }, { text: "Egypt" }, { text: "Armenia" }, { text: "India" }, { text: "Malaysia" }];
        let li4: HTMLElement;
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1100;
            element = createElement('div', { id: 'listbase', attrs: { 'tabindex': '1' } });
            document.body.appendChild(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.parentElement.remove();
            }
        });
        it('"F" key pressing ', (done) => {
            listObj1 = new DropDownList({ dataSource: searchList, fields: { text: 'text' } });
            listObj1.appendTo(element);
            li4 = listObj1.onSearch(keyEventArgs);
            setTimeout(() => {
                expect(listObj1.value).toBe("Finland");
                done();
            }, 500);
        });
        it('"A" key pressing ', (done) => {
            keyEventArgs.charCode = 65;
            setTimeout(() => {
                li4 = listObj1.onSearch(keyEventArgs);
                expect(listObj1.value).toBe("Armenia");
                done();
            }, 500);
        });
        it('"O" key pressing ', (done) => {
            keyEventArgs.charCode = 79;
            setTimeout(() => {
                li4 = listObj1.onSearch(keyEventArgs);
                expect(li4).toBe(undefined);
                done();
            }, 500);
        });
    });

    describe('SearchBox support', () => {
        describe('Basic rendering', () => {
            let listObj: DropDownList;
            let element: HTMLInputElement;
            beforeAll(() => {
                element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
                document.body.appendChild(element);
                listObj = new DropDownList({
                    dataSource: datasource,
                    fields: { text: "text", value: "id" },
                    popupHeight: "200px",
                    allowFiltering: true,
                    headerTemplate: 'header'
                });
                listObj.appendTo(element);
                listObj.showPopup();
            });
            it('header position while enable the searchBox', () => {
                let element = <HTMLElement[] | NodeListOf<HTMLElement>>document.querySelectorAll(".e-filter-parent")
                expect(element[0].nextElementSibling.textContent === 'header').toBe(true);
            });
            it('check search box element', () => {
                let element = <HTMLElement>document.querySelector(".e-input-filter");
                expect(!isNullOrUndefined(element)).toBe(true);
            });
            it('check search box parent element', () => {
                let element = <HTMLElement>document.querySelector(".e-input-filter");
                expect(element.parentElement.classList.contains("e-input-group")).toBe(true);
            });
            it('check search box icon element', () => {
                let element = <HTMLElement>document.querySelector(".e-input-filter");
                expect((element.nextSibling as HTMLElement).classList.contains("e-icons")).toBe(true);
            });
            it('search box wrapper insert before of list element', () => {
                let element = <HTMLElement>document.querySelector(".e-popup");
                expect((element.childNodes[0] as HTMLElement).classList.contains("e-filter-parent")).toBe(true);
            });
            afterAll(() => {
                if (element) { element.remove(); };
                document.body.innerHTML = '';
            });
        });
        describe('in-built filter support', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 74,
                metaKey: false
            };
            let keyEvent: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let listObj: any;
            let element: HTMLInputElement;
            beforeAll(() => {
                element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
                document.body.appendChild(element);
                listObj = new DropDownList({
                    dataSource: datasource2,
                    fields: { text: "text", value: "id" },
                    popupHeight: "200px",
                    allowFiltering: true
                });
                listObj.appendTo(element);
                listObj.showPopup();
            });
            afterAll(() => {
                if (element) { element.remove(); };
                document.body.innerHTML = '';
            });

            it('select a searched item', (done) => {
                setTimeout(() => {
                    listObj.filterInput.value = "p";
                    listObj.onInput()
                    listObj.onFilterUp(keyEventArgs);
                    listObj.keyActionHandler(keyEvent);
                    listObj.keyActionHandler(keyEvent);
                    listObj.hidePopup();
                    setTimeout(() => {
                        expect(listObj.text === 'PERL').toBe(true);
                        done();
                    }, 250)
                }, 500)
            });
            it('filter a suggestion list while empty text', (done) => {
                setTimeout(() => {
                    listObj.showPopup();
                    setTimeout(() => {
                        listObj.filterInput.value = "";
                        listObj.onInput()
                        listObj.onFilterUp(keyEventArgs);
                        let element = document.querySelector(".e-list-parent");
                        expect(element.childNodes.length).not.toBe(0);
                        done();
                    }, 250)
                }, 250)
            });

            it('filter a suggestion list with ascending order', () => {
                listObj.sortOrder = 'Ascending';
                listObj.dataBind();
                listObj.filterInput.value = "P";
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                let element = document.querySelector(".e-list-parent");
                expect(element.childNodes[0].textContent === 'PERL').toBe(true);
                listObj.filterInput.value = '';
            });

            it('filter a suggestion list with ascending order', () => {
                listObj.sortOrder = 'Descending';
                listObj.dataBind();
                listObj.filterInput.value = "P";
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                let element = document.querySelector(".e-list-parent");
                expect(element.childNodes[element.childNodes.length - 1].textContent === 'PERL').toBe(true);
            });

            it('back space key and delete in searchBox', () => {
                let element: any;
                keyEventArgs.keyCode = 8;
                listObj.filterInput.value = "j";
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length).not.toBe(0);

                keyEventArgs.keyCode = 46;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length).not.toBe(0);
            });

            it('prevent browser default behavior in searchBox keydown', () => {
                let element: any;
                keyEventArgs.keyCode = 35;
                listObj.filterInput.value = "j";
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 36;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 40;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 38;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 33;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 13;
                listObj.onFilterDown(keyEventArgs);

                keyEventArgs.keyCode = 34;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 37;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 39;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);
            });

            it('skip and prevent browser default behavior in searchBox keyup', () => {
                let element: any;
                keyEventArgs.keyCode = 35;
                listObj.filterInput.value = "j";
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 36;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 40;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 38;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 33;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 34;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 37;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 39;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 20;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 16;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 17;
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 18;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 144;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 9;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 27;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 13;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);
            });
        });
        describe('Local data filtering', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 74,
                metaKey: false
            };
            let keyEvent: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let listObj: any;
            let element: HTMLInputElement;
            beforeAll(() => {
                element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
                document.body.appendChild(element);
                listObj = new DropDownList({
                    dataSource: datasource,
                    fields: { text: "text", value: "id" },
                    popupHeight: "200px",
                    allowFiltering: true,
                    filtering: function (e: FilteringEventArgs) {
                        let query = new Query();
                        query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                        e.updateData(datasource2, query);
                    }
                });
                listObj.appendTo(element);
                listObj.showPopup();
            });

            it('select a searched item', (done) => {
                setTimeout(() => {
                    listObj.filterInput.value = "p";
                    listObj.onInput()
                    listObj.onFilterUp(keyEventArgs);
                    listObj.keyActionHandler(keyEvent);
                    listObj.keyActionHandler(keyEvent);
                    listObj.hidePopup();
                    setTimeout(() => {
                        expect(listObj.text === 'PERL').toBe(true);
                        done();
                    }, 250)
                }, 500)
            });
            it('add a selected item on initial suggestion lists', (done) => {
                setTimeout(() => {
                    listObj.showPopup();
                    setTimeout(() => {
                        let element = document.querySelector(".e-list-parent");
                        expect(element.childNodes[element.childNodes.length - 1].textContent === 'PERL').toBe(true);
                        done();
                    }, 250)
                }, 250)
            });

            it('filter a suggestion list while empty text', () => {
                listObj.filterInput.value = "";
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                let element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length).not.toBe(0);
            });

            it('filter a suggestion list with ascending order', () => {
                listObj.sortOrder = 'Ascending';
                listObj.dataBind();
                listObj.filterInput.value = "P";
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                let element = document.querySelector(".e-list-parent");
                expect(element.childNodes[0].textContent === 'PERL').toBe(true);
                listObj.filterInput.value = '';
            });

            it('filter a suggestion list with ascending order', () => {
                listObj.sortOrder = 'Descending';
                listObj.dataBind();
                listObj.filterInput.value = "P";
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                let element = document.querySelector(".e-list-parent");
                expect(element.childNodes[element.childNodes.length - 1].textContent === 'PERL').toBe(true);
            });

            it('back space key and delete in searchBox', () => {
                let element: any;
                keyEventArgs.keyCode = 8;
                listObj.filterInput.value = "j";
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length).not.toBe(0);

                keyEventArgs.keyCode = 46;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length).not.toBe(0);
            });

            it('prevent browser default behavior in searchBox keydown', () => {
                let element: any;
                keyEventArgs.keyCode = 35;
                listObj.filterInput.value = "j";
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 36;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 40;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 38;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 33;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 13;
                listObj.onFilterDown(keyEventArgs);

                keyEventArgs.keyCode = 34;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 37;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 39;
                listObj.onFilterDown(keyEventArgs);
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);
            });

            it('skip and prevent browser default behavior in searchBox keyup', () => {
                let element: any;
                keyEventArgs.keyCode = 35;
                listObj.filterInput.value = "j";
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 36;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 40;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 38;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 33;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 34;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 37;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 39;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 20;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 16;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 17;
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 18;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 144;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 9;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 27;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);

                keyEventArgs.keyCode = 13;
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                element = document.querySelector(".e-list-parent");
                expect(element.childNodes.length === 1).toBe(true);
            });

            afterAll(() => {
                if (element) { element.remove(); };
            });
        });
    });

    // mobile layout testing
    describe('mobile layout testing', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let listObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            document.body.appendChild(ele);
            listObj = new DropDownList({ dataSource: data, fields: { text: 'text', value: 'id' }, popupHeight: '100px' });
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('initial items choosing', (done) => {
            listObj.text = 'JAVA';
            listObj.dataBind();
            listObj.list.querySelector('ul').style.height = '100px';
            listObj.list.querySelector('ul').style.overflow = 'auto';
            listObj.list.querySelector('ul').style.display = 'block';
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.index).toBe(0);
                listObj.scrollHandler();
                setTimeout(function () {
                    expect(listObj.isPopupOpen).toBe(false);
                    done();
                }, 300);
            }, 450);
        })
        it('middle items choosing', (done) => {
            listObj.text = 'Oracle';
            listObj.dataBind();
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.index).toBe(4);
                listObj.hidePopup();
                setTimeout(function () {
                    expect(listObj.isPopupOpen).toBe(false);
                    done();
                }, 300);
            }, 450);
        })
        it('end items choosing', () => {
            listObj.text = 'C';
            listObj.dataBind();
            listObj.showPopup();
            expect(listObj.index).toBe(9);
        });
        it('scrollHandler choosing', () => {
            listObj.allowFiltering = true;
            listObj.dataBind();
            listObj.scrollHandler();
            expect(listObj.index).toBe(9);
        });
    });
    describe('Allowfiltering support in mobile', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let listObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            document.body.appendChild(ele);
            listObj = new DropDownList({
                dataSource: data, fields: { text: 'text', value: 'id' }, allowFiltering: true,
                popupHeight: '100px'
            });
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('allowFiltering enabled', () => {
            listObj.showPopup();
            expect(listObj.popupObj.element.style.maxHeight).toBe('100%');
            expect(listObj.popupObj.element.style.width).toBe('100%');
        })
        it('clear text & search icon in search textbox', () => {
            listObj.clearText();
            var clearElement = listObj.filterInput.parentElement.querySelector('.e-clear-icon');
            expect(clearElement.style.visibility).toBe('hidden');
            listObj.filterInput.value = 'a';
            listObj.searchLists();
            expect(clearElement.style.visibility).toBe('visible');
        })
        it('active state change on scrolling', () => {
            listObj.listScroll();
            expect(document.activeElement !== listObj.filterInput).toBe(true);
        })
    });
    describe('Remote Data Binding', () => {
        let ddlObj: any;
        let element: HTMLInputElement;
        let keyEvent: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', type: 'keydown' };
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
            ddlObj = new DropDownList({
                dataSource: new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataV4Adaptor
                }),
                fields: { value: 'EmployeeID', text: 'FirstName' }
            });
            ddlObj.appendTo('#dropdownlist');
        });
        it('select the first value while press down key', (done) => {
            ddlObj.keyActionHandler(keyEvent);
            setTimeout(() => {
                expect(ddlObj.inputElement.value !== '').toBe(true);
                done()
            }, 800);
        });
        it('popup show after actionComplete event', (done) => {
            ddlObj.showPopup();
            setTimeout(() => {
                let liElement = ddlObj.list.querySelectorAll('li');
                expect(liElement.length > 0).toBe(true);
                done()
            }, 800);
        });
        afterAll(() => {
            if (element) {
                element.parentElement.remove();
                document.body.innerHTML = '';
            }
        });
    });
    describe('focus and blur event triggered', () => {
        describe('basic rendering', () => {
            let listObj1: any;
            let listObj2: any;
            let element1: HTMLElement;
            let empList: { [key: string]: Object }[] = [
                { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
                { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
                { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
                { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
                { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
            ];
            let focusAction: EmitType<Object> = jasmine.createSpy('Focus');
            let blurAction: EmitType<Object> = jasmine.createSpy('Blur');
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            beforeAll((done) => {
                element1 = createElement('input', { id: 'list1' });
                document.body.appendChild(element1);
                listObj1 = new DropDownList({
                    dataSource: empList,
                    fields: { text: 'sports', value: 'id' },
                    focus: focusAction,
                    blur: blurAction,
                    index: 1,
                    headerTemplate: '<span id="header">Games</span>',
                    footerTemplate: '<span id="footer"> Best game</span>',
                    valueTemplate: '<span id="value-temp">${sports}</span>'
                });
                listObj1.appendTo(element1);
                done();
            });
            afterAll(() => {
                if (element1) {
                    element1.parentElement.remove();
                    document.body.innerHTML = '';
                }
            });

            it('focus event trigger when click on dropdown input', (done) => {
                mouseEventArgs.target = listObj1.inputWrapper.container;
                listObj1.dropDownClick(mouseEventArgs);
                setTimeout(() => {
                    expect(focusAction).toHaveBeenCalled();
                    expect(listObj1.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
                    done()
                }, 450)
            });

            it('focus event hold when click on header template', () => {
                mouseEventArgs.target = document.getElementById('header');
                listObj1.onDocumentClick(mouseEventArgs);
                expect(listObj1.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
                expect(listObj1.isPopupOpen).toBe(true);
            })

            it('focus event hold when click on footer template', () => {
                mouseEventArgs.target = document.getElementById('footer');
                listObj1.onDocumentClick(mouseEventArgs);
                expect(listObj1.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
                expect(listObj1.isPopupOpen).toBe(true);
            })

            it('focus event hold when click a list', (done) => {
                let item: HTMLElement[] = listObj1.popupObj.element.querySelectorAll('li')[2];
                mouseEventArgs.target = item;
                mouseEventArgs.type = 'click';
                listObj1.onMouseClick(mouseEventArgs);
                setTimeout(() => {
                    expect(listObj1.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
                    done()
                }, 450)
            })

            it('focus event hold when click on value template', () => {
                mouseEventArgs.target = document.getElementById('value-temp');
                listObj1.onDocumentClick(mouseEventArgs);
                expect(listObj1.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
            })
            it('IE 11 issue: focus the current focus element when click on header at popup open state', (done) => {
                mouseEventArgs.target = listObj1.inputWrapper.container;
                listObj1.dropDownClick(mouseEventArgs);
                setTimeout(() => {
                    Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
                    mouseEventArgs.target = document.getElementById('header');
                    listObj1.onDocumentClick(mouseEventArgs);
                    listObj1.onBlur(mouseEventArgs);
                    expect(listObj1.inputWrapper.container === document.activeElement).toBe(true);
                    expect(listObj1.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
                    done();
                }, 450)
            })
            it('IE 11 issue: focus the current focus element when click on header at popup open state with enabled the filter', (done) => {
                listObj1.hidePopup();
                setTimeout(() => {
                    listObj1.allowFiltering = true;
                    listObj1.dataBind();
                    mouseEventArgs.target = listObj1.inputWrapper.container;
                    listObj1.dropDownClick(mouseEventArgs);
                    listObj1.showPopup();
                    setTimeout(() => {
                        mouseEventArgs.target = document.getElementById('header');
                        listObj1.onDocumentClick(mouseEventArgs);
                        listObj1.onBlur(mouseEventArgs);
                        expect(listObj1.filterInput === document.activeElement).toBe(true);
                        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
                        Browser.userAgent = androidPhoneUa;
                        done();
                    }, 450);
                }, 450);
            })

            it('blur event trigger when click document', (done) => {
                mouseEventArgs.target = document.body;
                listObj1.onDocumentClick(mouseEventArgs);
                setTimeout(() => {
                    expect(listObj1.inputWrapper.container.classList.contains('e-input-focus')).toBe(false);
                    expect(blurAction).toHaveBeenCalled();
                    done();
                }, 400)
            })
        });
        describe('render with filtering', () => {
            let listObj1: any;
            let listObj2: any;
            let element1: HTMLElement;
            let data: string[] = ['Basketball', 'Football', 'Hockey', 'Snooker'];
            let focusAction: EmitType<Object> = jasmine.createSpy('Focus');
            let blurAction: EmitType<Object> = jasmine.createSpy('Blur');
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            let originalTimeout: number;
            beforeAll((done) => {
                element1 = createElement('input', { id: 'list1' });
                document.body.appendChild(element1);
                listObj1 = new DropDownList({
                    dataSource: data,
                    focus: focusAction,
                    blur: blurAction,
                    index: 1,
                    allowFiltering: true
                });
                listObj1.appendTo(element1);
                done();
            });
            afterAll(() => {
                if (element1) {
                    element1.parentElement.remove();
                    document.body.innerHTML = '';
                }
            });
            it('focus search box element when click dropdown input', (done) => {
                mouseEventArgs.target = listObj1.inputWrapper.container;
                listObj1.dropDownClick(mouseEventArgs);
                setTimeout(() => {
                    expect(listObj1.inputWrapper.container.classList.contains('e-input-focus')).toBe(false);
                    done()
                }, 450)
            });

            it('focus hold when click on search icon', () => {
                mouseEventArgs.target = listObj1.inputWrapper.container;
                mouseEventArgs.target = listObj1.filterInput;
                listObj1.onDocumentClick(mouseEventArgs);
                expect(listObj1.isPopupOpen).toBe(true);
            });

            it('filterBarPlaceholder property', (done) => {
                listObj1.filterBarPlaceholder = 'Search a customer';
                listObj1.dataBind();
                expect(listObj1.filterInput.getAttribute('placeholder')).toEqual(listObj1.filterBarPlaceholder);
                listObj1.hidePopup();
                setTimeout(() => {
                    done();
                }, 300)
            });

            it('hold focus event when click a list', (done) => {
                mouseEventArgs.target = listObj1.inputWrapper.container;
                listObj1.dropDownClick(mouseEventArgs);
                setTimeout(() => {
                    let item: HTMLElement[] = listObj1.popupObj.element.querySelectorAll('li')[2];
                    mouseEventArgs.target = item;
                    mouseEventArgs.type = 'click';
                    listObj1.onMouseClick(mouseEventArgs);
                    setTimeout(() => {
                        expect(listObj1.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
                        done();
                    }, 450)
                }, 450)
            });

            it('hold focus event when click a back icon', (done) => {
                listObj1.showPopup();
                setTimeout(() => {
                    listObj1.clickOnBackIcon();
                    setTimeout(() => {
                        expect(listObj1.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
                        done();
                    }, 450)
                }, 400)
            });
        });
    });
    // HTMLData Binding
    describe('HTML UL element data binding', () => {
        let ele: HTMLElement = document.createElement('ul');
        ele.id = 'newlist';
        ele.innerHTML = '<li id="i1">item1</li>' +
            '<li id="i2">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
            '<li>item6</li><li>item7</li>';
        let listObj: any;
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new DropDownList();
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                let parent: HTMLElement = ele.parentElement as HTMLElement;
                parent.remove();
                document.body.innerText = '';
            }
        })
        it('rendered the ul-li data element in popup', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.list.querySelectorAll('.e-list-item').length).toBe(7);
                done();
            }, 450);
        });
        it('check fields value and text', () => {
            expect(listObj.fields.value === 'text').toBe(true);
            expect(listObj.fields.text === 'text').toBe(true);
        });
        it('click on list item', () => {
            let item: HTMLElement[] = listObj.popupObj.element.querySelectorAll('li')[2];
            mouseEventArgs.target = item;
            mouseEventArgs.type = 'click';
            listObj.onMouseClick(mouseEventArgs);
            expect(listObj.value === 'item3').toBe(true);
            expect(listObj.text === 'item3').toBe(true);
            expect(listObj.inputElement.value === 'item3').toBe(true);
        });
    });
    describe('datasource with number type', () => {
        let listObj: any;
        let numberData: number[] = [1001, 2001, 3001, 4001, 5001, 6001, 7001];
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            let element: HTMLElement = createElement('input', { id: 'list' });
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: numberData, index: 2 });
            listObj.appendTo(element);
        });
        afterAll(() => {
            listObj.destroy();
            document.body.innerHTML = '';
        });
        it('Initializing as number ', () => {
            let liItem: Element = listObj.list.querySelector('li');
            expect(liItem.classList.contains('e-list-item')).toBe(true);
            expect(liItem.getAttribute('data-value')).toEqual('1001');
            expect(liItem.textContent).toEqual('1001');
            expect(listObj.value).toEqual(3001);
        });
        it('Interaction in DDL', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                let item: HTMLElement[] = listObj.popupObj.element.querySelectorAll('li')[3];
                mouseEventArgs.target = item;
                mouseEventArgs.type = 'click';
                listObj.onMouseClick(mouseEventArgs);
                setTimeout(function () {
                    expect(listObj.isPopupOpen).toBe(false);
                    expect(listObj.element.value).toEqual(listObj.value.toString());
                    done();
                }, 450);
            }, 450);
        })
    })
    describe("select element Rendering", () => {
        let listObj: any;
        let element: string = "<select id='select1'><option>option1</option><option value='option2'>option2</option></select>";
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        afterAll(() => {
            let select: HTMLSelectElement = document.getElementById('select1') as HTMLSelectElement;
            if (select) {
                let parent: HTMLElement = select.parentElement as HTMLElement;
                parent.remove();
            }
        });
        beforeAll(() => {
            document.body.innerHTML = element;
            let select: HTMLSelectElement = document.getElementById('select1') as HTMLSelectElement;
            document.body.appendChild(select);
            listObj = new DropDownList();
            listObj.appendTo('#select1');
        });
        it('check fields value and text', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.fields.value === 'value').toBe(true);
                expect(listObj.fields.text === 'text').toBe(true);
                expect(listObj.value === 'option1').toBe(true);
                expect(listObj.text === 'option1').toBe(true);
                done();
            }, 450);
        });
        it('click on list item', () => {
            let item: HTMLElement[] = listObj.popupObj.element.querySelectorAll('li')[1];
            mouseEventArgs.target = item;
            mouseEventArgs.type = 'click';
            listObj.onMouseClick(mouseEventArgs);
            expect(listObj.value === 'option2').toBe(true);
            expect(listObj.text === 'option2').toBe(true);
            expect(listObj.inputElement.value === 'option2').toBe(true);
        });
    });
    describe('DropdownList incremental search with DataManager instance', () => {
        let listObj: any;
        let popupObj: any;
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, charCode: 76, metaKey: false };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeEach(() => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        /**
         * set the search key value in text
         */
        it(' set the search key value in text ', (done) => {
            listObj = new DropDownList({ dataSource: remoteData, fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
            listObj.onSearch(keyEventArgs)
            setTimeout(() => {
                expect(listObj.text).toBe('Leverling');
                done();
            }, 800);
        });
    });
    describe('Spinner support', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let listObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new DropDownList({
                dataSource: data, fields: { text: 'text', value: 'id' }, allowFiltering: true,
                popupHeight: '100px',
                filtering: function (e: FilteringEventArgs) {
                    let query = new Query();
                    query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                    e.updateData(data, query);
                }
            });
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it(' - spinner show instead of dropdown icon at initial time', () => {
            listObj.showPopup();
            expect(isNullOrUndefined(listObj.inputWrapper.buttons[0].querySelector('e-spinner-pane'))).toBe(true);
        })
        it(' - spinner show instead of clear icon in filter bar', (done) => {
            setTimeout(() => {
                listObj.filterInput.value = 'a';
                listObj.searchLists();
                expect(isNullOrUndefined(listObj.filterInputObj.buttons[0].querySelector('e-spinner-pane'))).toBe(true);
                listObj.hidePopup();
                setTimeout(() => {
                    expect(listObj.filterInputObj === null).toBe(true);
                    done();
                }, 400);
            }, 400);
        })

        it(' - spinner show on mobile filter bar', (done) => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            listObj.showPopup();
            setTimeout(() => {
                listObj.filterInput.value = 'j';
                listObj.searchLists();
                expect(isNullOrUndefined(listObj.list.querySelector('e-spinner-pane'))).toBe(true);
                Browser.userAgent = navigator.userAgent;
                done();
            }, 400);
        })
    });
    describe('with group alignemnt', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let list: any;
        let ele: HTMLElement;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let scrollItemData: { [key: string]: Object }[] = [{ 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' },
        { 'text': 'BMW 502', 'id': 'f8430', 'category': 'BMW' },
        { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
        beforeAll(() => {
            ele = createElement('input', { id: 'DropDownList' });
            let ele1: HTMLElement = createElement('div', { id: 'dd' });
            ele1.appendChild(ele);
            ele1.style.height = '500px';
            document.body.appendChild(ele1);
            document.body.style.overflowY = 'scroll';
            document.body.style.height = '300px';
            list = new DropDownList({
                dataSource: scrollItemData,
                fields: { text: 'text', value: 'id', groupBy: 'category' },
                index: 4
            });
            list.appendTo(ele);
        });
        afterAll((done) => {
            list.hidePopup();
            setTimeout(() => {
                list.destroy();
                ele.remove();
                done();
            }, 450)
        });
        /**
       * Mouse click
       */
        it('grouping header alignment', (done) => {
            list.showPopup();
            let obj = list;
            setTimeout(() => {
                let items: Element[] = list.popupObj.element.querySelectorAll('li');
                list.list.style.overflow = 'auto';
                list.list.style.height = '48px';
                list.list.style.display = 'block';
                list.list.scrollTop = 100;
                setTimeout(() => {
                    expect((document.getElementsByClassName('e-fixed-head')[0] as any).style.zIndex === '10').toBe(true);
                    list.scrollHandler();
                    list.dataBind();
                    keyEventArgs.action = 'down';
                    list.list.scrollTop = 120;
                    list.keyActionHandler(keyEventArgs);
                    done();
                }, 100);
                list.index = 0;
                list.dataBind();
                keyEventArgs.action = 'down';
                list.list.scrollTop = 120;
                list.keyActionHandler(keyEventArgs);
                list.scrollHandler();
                list.list.scrollTop = 100;
                document.body.scrollTop = 100;
            }, 450);
        });
    });
    describe('nested data binding to fields', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let list: any;
        let ele: HTMLElement;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let complexStringData: { [key: string]: Object; }[] = [
            {
                id: '01', list: { text: 'text1' }, iconCss: 'iconClass1',
                primaryKey: { code: '001' }
            },
            {
                id: '02', list: { text: 'text2' }, iconCss: undefined,
                primaryKey: { code: '002' }
            },
            {
                id: '03', list: { text: 'text3' }, iconCss: 'iconClass3',
                primaryKey: { code: '003' }
            },
        ];
        beforeAll(() => {
            ele = createElement('input', { id: 'DropDownList' });
            document.body.appendChild(ele);
            list = new DropDownList({
                dataSource: complexStringData,
                fields: { text: 'list.text', value: 'primaryKey.code' },
                index: 0
            });
            list.appendTo(ele);
        });
        afterAll((done) => {
            list.hidePopup();
            setTimeout(() => {
                list.destroy();
                ele.remove();
                done();
            }, 450)
        });

        it('initially select the complex data of text and value fields', () => {
            expect(list.value === '001').toBe(true);
            expect(list.text === 'text1').toBe(true);
        });
        it('select the complex data of text and value fields while click on popup list', (done) => {
            list.showPopup();
            setTimeout(() => {
                let item: HTMLElement[] = list.popupObj.element.querySelectorAll('li')[1];
                mouseEventArgs.target = item;
                mouseEventArgs.type = 'click';
                list.onMouseClick(mouseEventArgs);
                expect(list.value === '002').toBe(true);
                expect(list.text === 'text2').toBe(true);
                expect(list.index === 1).toBe(true);
                expect(list.inputElement.value === 'text2').toBe(true);
                list.hidePopup();
                setTimeout(() => {
                    done()
                }, 400);
            }, 400);
        });
    });


    describe('Value get as object if selected value as 0 (I197200||EJ2-7752)', () => {
        let list: any;
        let ele: HTMLElement;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let countryData: { [key: string]: Object }[] = [{ value: 0, text: 'USA' }, { value: 1, text: 'UK' }];

        beforeAll(() => {
            ele = createElement('input', { id: 'DropDownList' });
            document.body.appendChild(ele);
            list = new DropDownList({
                dataSource: countryData,
                fields: { text: 'text', value: 'value' }
            });
            list.appendTo(ele);
        });

        afterAll((done) => {
            list.hidePopup();
            setTimeout(() => {
                list.destroy();
                ele.remove();
                done();
            }, 450)
        });

        it('select the 0 value item', (done) => {
            list.showPopup();
            setTimeout(() => {
                let item: HTMLElement[] = list.popupObj.element.querySelectorAll('li')[0];
                mouseEventArgs.target = item;
                mouseEventArgs.type = 'click';
                list.onMouseClick(mouseEventArgs);
                expect(list.value === 0).toBe(true);
                expect(list.text === 'USA').toBe(true);
                expect(list.index === 0).toBe(true);
                expect(list.inputElement.value === 'USA').toBe(true);
                list.hidePopup();
                setTimeout(() => {
                    done()
                }, 400);
            }, 400);
        });
    });
    describe('add the zIndex property', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let list: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            list = new DropDownList({
                dataSource: data,
                fields: { text: 'text', value: 'text' },
                zIndex: 1234
            });
            list.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('check zIndex on popup open', (done) => {
            list.showPopup();
            setTimeout(() => {
                expect(list.popupObj.element.style.zIndex === '1234').toBe(true);
                list.zIndex = 1333;
                list.dataBind();
                expect(list.popupObj.element.style.zIndex === '1333').toBe(true);
                done();
            }, 400);
        });
    });
    describe('validation events for args.cancel', () => {
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 74,
            metaKey: false
        };
        let keyEvent: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let listObj: any;
        let element: HTMLInputElement;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: datasource,
                fields: { text: "text", value: "id" },
                popupHeight: "200px",
                select: function (e: any) {
                    e.cancel = true;
                }
            });
            listObj.appendTo(element);
        });

        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('select event args.cancel', (done) => {
            expect(listObj.inputWrapper.container.getAttribute('aria-activedescendant')).toBe('null');
            listObj.showPopup();
            setTimeout(() => {
                let items: Element[] = listObj.popupObj.element.querySelectorAll('li');
                listObj.setSelection(items[0]);
                expect(listObj.value === null).toBe(true);
                expect(listObj.text === null).toBe(true);
                expect(listObj.index === null).toBe(true);
                done();
            }, 450);
        });
    })
    describe('filter validation events for args.cancel', () => {
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 74,
            metaKey: false
        };
        let keyEvent: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let listObj: any;
        let element: HTMLInputElement;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
        });
        it('filter event args.cancel', (done) => {
            listObj = new DropDownList({
                dataSource: datasource,
                fields: { text: "text", value: "id" },
                popupHeight: "200px",
                allowFiltering: true,
                filtering: function (e: FilteringEventArgs) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                    let query = new Query();
                    query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                    e.updateData(datasource2, query);
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(() => {
                listObj.filterInput.value = "p";
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs);
                done();
            }, 100)
        });
    });
    describe('open and close args.cancel', () => {
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 74,
            metaKey: false
        };
        let keyEvent: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let listObj: any;
        let element: HTMLInputElement;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
        });
        it('open event args.cancel ', () => {
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: datasource2, value: 'list1', popupHeight: 100, fields: { value: 'id', text: 'text' },
                select: function (e: any) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                },
                open: function (e) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            listObj.destroy();
        });
        it('close event args.cancel ', () => {
            document.body.appendChild(element);
            listObj = new DropDownList({
                dataSource: datasource2, index: 5, popupHeight: 100, fields: { value: 'id', text: 'text' },
                close: function (e) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(function () {
                listObj.hidePopup();
            }, 20);
            listObj.destroy();
        });
    });
    describe('ignoreAccent support', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let dropDowns: any;
        let activeElement: HTMLElement[];
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let data: string[] = ['Åland', ' à propos', 'abacá'];
        beforeAll(() => {
            document.body.appendChild(element);
            dropDowns = new DropDownList({
                dataSource: data,
                ignoreAccent: true,
                allowFiltering: true
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it('search diacritics data', (done) => {
            dropDowns.showPopup();
            dropDowns.filterInput.value = 'ä';
            keyEventArgs.keyCode = 67;
            dropDowns.onInput();
            dropDowns.onFilterUp(keyEventArgs);
            setTimeout(() => {
                let item: HTMLElement[] = dropDowns.popupObj.element.querySelectorAll('li');
                expect(item.length === 2).toBe(true);
                mouseEventArgs.target = item[0];
                mouseEventArgs.type = 'click';
                dropDowns.onMouseClick(mouseEventArgs);
                expect(dropDowns.value === 'Åland').toBe(true);
                expect(dropDowns.inputElement.value === 'Åland').toBe(true);
                done();
            }, 400);
        });
    });

    describe('prevent right click', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
            dropDowns = new DropDownList({
                dataSource: datasource,
                fields: { value: 'id', text: 'text' }
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it(' click on popup button', (done) => {
            mouseEventArgs.target = dropDowns.inputWrapper.container;
            dropDowns.dropDownClick(mouseEventArgs);
            setTimeout(() => {
                expect(dropDowns.isPopupOpen).toBe(false);
                done();
            }, 400);
        });
    });


    describe('dataBound event', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it(' trigger on local data', (done) => {
            let isDataBound: boolean = false;
            dropDowns = new DropDownList({
                dataSource: datasource,
                fields: { value: 'id', text: 'text' },
                dataBound: () => {
                    isDataBound = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isDataBound).toBe(false);
            dropDowns.showPopup();
            setTimeout(() => {
                expect(isDataBound).toBe(true);
                done();
            }, 450);
        });
        it(' trigger on remote data', (done) => {
            let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
            let isDataBound: boolean = false;
            dropDowns = new DropDownList({
                dataSource: remoteData,
                fields: { value: 'FirstName', text: 'FirstName' },
                dataBound: () => {
                    isDataBound = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isDataBound).toBe(false);
            dropDowns.showPopup();
            setTimeout(() => {
                expect(isDataBound).toBe(true);
                done();
            }, 800);
        });
    });

    describe('event args.cancel', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it(' filtering event', (done) => {
            dropDowns = new DropDownList({
                dataSource: datasource,
                allowFiltering: true,
                fields: { value: 'id', text: 'text' },
                filtering: (e: FilteringEventArgs) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                dropDowns.filterInput.value = 'java';
                e.keyCode = 72;
                dropDowns.onInput();
                dropDowns.onFilterUp(e);
                setTimeout(() => {
                    expect(dropDowns.list.classList.contains(dropDownBaseClasses.noData)).toBe(false);
                    done();
                }, 450);
            }, 450);
        });
    });

    describe('remote data : actionComplete event args.cancel', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it(' actionComplete event', (done) => {
            let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
            dropDowns = new DropDownList({
                dataSource: remoteData,
                allowFiltering: true,
                fields: { value: 'FirstName', text: 'FirstName' },
                actionComplete: (e: any) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                expect(dropDowns.isPopupOpen).toBe(false);
                done();
            }, 800)
        });
    });

    describe('remote data : actionBegin event args.cancel', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });
        it(' actionBegin event', (done) => {
            let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
            dropDowns = new DropDownList({
                dataSource: remoteData,
                allowFiltering: true,
                fields: { value: 'FirstName', text: 'FirstName' },
                actionBegin: (e: any) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                expect(dropDowns.isPopupOpen).toBe(false);
                done();
            }, 800);
        });
    });

    describe('itemCreated fields event', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it(' set disable to first item', (done) => {
            let count: number = 0;
            dropDowns = new DropDownList({
                dataSource: datasource,
                allowFiltering: true,
                fields: <Object> {
                    value: 'text', text:'text', itemCreated: (e: any) => {
                        if (count === 0) {
                            e.item.classList.add('e-disabled');
                        }
                    }
                }
            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                expect(dropDowns.list.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(true);
                done();
            }, 500);
        });
    });

    describe('created and destroy event', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it(' trigger create event after component rendering', () => {
            let isCreated: boolean = false;
            dropDowns = new DropDownList({
                dataSource: datasource,
                fields: {
                    value: 'text'
                },
                created: () => {
                    isCreated = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isCreated).toBe(true);
        });
        it(' trigger destroyed event after component destroy', (done) => {
            let isDestroy: boolean = false;
            let destroyedEvent: EmitType<Object> = jasmine.createSpy('destroyed');
            dropDowns = new DropDownList({
                dataSource: datasource,
                fields: {
                    value: 'text'
                },
                destroyed: () => {
                    isDestroy = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.destroy();
            setTimeout(() => {
                expect(isDestroy).toBe(true);
                done();
            }, 200);
        });

    });
    describe('Grouping in DropDownList', () => {
        let dropDowns: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it('Render the DropDowns with grouping and sortOrder:None', (done) => {
            let groupData = [
                { vegetable: 'Cabbage', category: 'Leafy and Salad' }, { vegetable: 'Spinach', category: 'Leafy and Salad' },
                { vegetable: 'Wheatgrass', category: 'Leafy and Salad' }, { vegetable: 'Yarrow', category: 'Leafy and Salad' },
                { vegetable: 'Chickpea', category: 'Beans' }, { vegetable: 'Green bean', category: 'Beans' },
                { vegetable: 'Horse gram', category: 'Beans' }, { vegetable: 'Garlic', category: 'Bulb and Stem' },
                { vegetable: 'Nopal', category: 'Bulb and Stem' }, { vegetable: 'Onion', category: 'Bulb and Stem' }
            ];
            dropDowns = new DropDownList({
                dataSource: groupData,
                fields: { groupBy: 'category', text: 'vegetable' },
                placeholder: 'Select a vegetable'
            });
            dropDowns.appendTo(element);
            dropDowns.open = function(args: any){
                let groupElemenet: HTMLElement = dropDowns.list.querySelector(".e-list-group-item");
                let groupText: string = groupElemenet.innerText;
                expect(groupText).toEqual('Leafy and Salad');
                dropDowns.open = null;
                dropDowns.hidePopup();
                dropDowns.destroy();
                done();
            };
            dropDowns.showPopup();
        });
        it('Render the DropDowns with grouping and sortOrder:Ascending', (done) => {
            let groupData = [
                { vegetable: 'Cabbage', category: 'Leafy and Salad' }, { vegetable: 'Spinach', category: 'Leafy and Salad' },
                { vegetable: 'Wheatgrass', category: 'Leafy and Salad' }, { vegetable: 'Yarrow', category: 'Leafy and Salad' },
                { vegetable: 'Chickpea', category: 'Beans' }, { vegetable: 'Green bean', category: 'Beans' },
                { vegetable: 'Horse gram', category: 'Beans' }, { vegetable: 'Garlic', category: 'Bulb and Stem' },
                { vegetable: 'Nopal', category: 'Bulb and Stem' }, { vegetable: 'Onion', category: 'Bulb and Stem' }
            ];
            dropDowns = new DropDownList({
                dataSource: groupData,
                fields: { groupBy: 'category', text: 'vegetable' },
                placeholder: 'Select a vegetable',
                sortOrder: 'Ascending'
            });
            dropDowns.appendTo(element);
            dropDowns.open = function(args: any){
                let groupElemenet: HTMLElement = dropDowns.list.querySelector(".e-list-group-item");
                let groupText: string = groupElemenet.innerText;
                expect(groupText).toEqual('Beans');
                dropDowns.open = null;
                dropDowns.hidePopup();
                dropDowns.destroy();
                done();
            };
            dropDowns.showPopup();
        });
    });

    describe('GetItems related bug', () => {
        let element: HTMLInputElement;
        let element1: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: DropDownList;
        let ddl1: DropDownList;
        let remoteData: DataManager = new DataManager({ url: '/api/Employee', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
            element1 = <HTMLInputElement>createElement('input', { id: 'dropdownlist1' });
            document.body.appendChild(element1);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            ddl = new DropDownList({
                dataSource: data
            });
            ddl.appendTo(element);
            expect(ddl.getItems().length).toBe(2);
        });
    });

    describe('Boolean value support', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: any;
        let jsonData: { [key: string]: Object; }[] = [{'id': false, 'text': 'failure'},{'id': true,
        'text': 'success'}];
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('select boolean value', () => {
            ddl = new DropDownList({
                dataSource: data,
                value: false
            });
            ddl.appendTo(element);
            expect(ddl.inputElement.value).toBe('false');
            expect(ddl.value).toBe(false);
            expect(ddl.index).toBe(1);
            expect(ddl.getDataByValue(false)).toBe(false);
        });
        it('set boolean value in dynamic way', () => {
            ddl = new DropDownList({
                dataSource: data
            });
            ddl.appendTo(element);
            ddl.setProperties({value:true});
            expect(ddl.inputElement.value).toBe('true');
            expect(ddl.value).toBe(true);
            expect(ddl.index).toBe(0);
            expect(ddl.getDataByValue(true)).toBe(true);
        });
        it('select boolean value', () => {
            ddl = new DropDownList({
                dataSource: jsonData,
                fields: {text: 'text', value: 'id'},
                value: false
            });
            ddl.appendTo(element);
            expect(ddl.inputElement.value).toBe('failure');
            expect(ddl.text).toBe('failure');
            expect(ddl.value).toBe(false);
            expect(ddl.index).toBe(0);
            expect(ddl.getDataByValue(false).text).toBe('failure');
        });
        it('set boolean value in dynamic way', () => {
            ddl= new DropDownList({
                dataSource: jsonData,
                fields: {text: 'text', value: 'id'}
            });
            ddl.appendTo(element);
            ddl.setProperties({value:true});
            expect(ddl.inputElement.value).toBe('success');
            expect(ddl.text).toBe('success');
            expect(ddl.value).toBe(true);
            expect(ddl.index).toBe(1);
            expect(ddl.getDataByValue(true).text).toBe('success');
        });
    });
    describe('Disabled with showpopup public methpd', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: any;
        let isOpen: boolean = false;
        let isFocus: boolean = false;
        let isBlur: boolean = false;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('check popup open', () => {
            ddl = new DropDownList({
                dataSource: data,
                value: false,
                enabled: false,
                open: (): void => {
                    isOpen = true;
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();
            expect(isOpen).toBe(false);
        });
        it('check focus event trigger', () => {
            ddl = new DropDownList({
                dataSource: data,
                value: false,
                enabled: false,
                focus: (): void => {
                    isFocus = true;
                }
            });
            ddl.appendTo(element);
            ddl.focusIn();
            expect(isFocus).toBe(false);
        });
        it('check blur event trigger', () => {
            ddl = new DropDownList({
                dataSource: data,
                value: false,
                enabled: false,
                blur: (): void => {
                    isBlur = true;
                }
            });
            ddl.appendTo(element);
            ddl.focusOut();
            expect(isBlur).toBe(false);
        });
    });

    describe('Check Readonly focus issue', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: DropDownList;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            ddl = new DropDownList({
                dataSource: data,
                readonly: true,
                focus: (): void => {
                    expect(true).toBe(true);
                }
            });
            ddl.appendTo(element);
            ddl.focusIn();
        });
    });

    describe('Check beforeopen event', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: DropDownList;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            ddl = new DropDownList({
                dataSource: data,
                beforeOpen: (): void => {
                    expect(true).toBe(true);
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();
        });
    });

    describe('EJ2-12367 - Angular reset and disable combination is not working in DropDownList', () => {
        let element: HTMLInputElement;
        let ddl: any;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
            ddl = new DropDownList({
                dataSource: datasource,
                value: 'list1'
            });
            ddl.appendTo(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it(' disable the control after set as value null and set the enabled property false', () => {
            ddl.value = null;
            ddl.enabled = false;
            ddl.dataBind();
            expect(ddl.element.classList.contains('e-disabled')).toBe(true);
        });
    });
    describe('dropdownlist same value not cleared', () => {
        let element: HTMLInputElement;
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let ddl: any;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
            ddl = new DropDownList({
                dataSource: datasource
            });
            ddl.appendTo(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it(' same value not clear', () => {
            ddl.showPopup();
             let items: Element[] = ddl.popupObj.element.querySelectorAll('li');
                mouseEventArgs.target = items[0];
                ddl.onMouseClick(mouseEventArgs);
                expect(ddl.value ==='JAVA').toBe(true);
                ddl.value = null;
                ddl.dataBind();
                ddl.showPopup();
                expect(ddl.value === null).toBe(true);
                ddl.onMouseClick(mouseEventArgs);
                expect(ddl.value ==='JAVA').toBe(true);
                ddl.value = null;
                ddl.dataBind();
                expect(ddl.value === null).toBe(true);
        });
    });

    describe('EJ2-17776 - Check variable exists before iteration', () => {
        let listObj: DropDownList;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new DropDownList({ dataSource: null });
            listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('Check getElementByValue function', () => {
            let ele: Element = (<any>listObj).getElementByValue('car');
            expect(ele).toBe(undefined);
        });
    });

});
