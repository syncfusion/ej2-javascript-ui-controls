/**
 * ComboBox spec document
 */
import { createElement, isVisible, isNullOrUndefined, Browser, EmitType } from '@syncfusion/ej2-base';
import { AutoComplete } from '../../src/auto-complete/index';
import { FilteringEventArgs } from '../../src/drop-down-base';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import  {profile , inMB, getMemoryProfile} from '../common/common.spec';

let languageData: { [key: string]: Object }[] = [{ id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
{ id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'PYTHON' }, { id: 'list5', text: 'HTMLCSS' }];
let filterData: { [key: string]: Object }[] = [
    { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, Freight: 32.38 },
    { OrderID: 10249, CustomerID: 'AANAR', EmployeeID: 2, Freight: 11.61 },
    { OrderID: 10250, CustomerID: 'VICTE', EmployeeID: 7, Freight: 65.83 },
    { OrderID: 10251, CustomerID: 'VINET', EmployeeID: 7, Freight: 70.63 },
    { OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 6, Freight: 45.45 }
];
let sportsData: string[] = ['Badminton', 'Basketball', 'Tennis', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Rugby', 'Snooker', 'Tennis'];
let mouseEventArgs: any = { preventDefault: function () { }, target: null };
describe('AutoComplete', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let css: string = ".e-spinner-pane::after { content: 'Material'; display: none;} ";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);
    describe('Basic rendering', () => {
        let atcObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        beforeAll(() => {
            Browser.userAgent = navigator.userAgent;
            document.body.appendChild(element);
            atcObj = new AutoComplete({
                dataSource: languageData,
                fields: { value: 'text' }
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
        });

        it('check root component root class', () => {
            expect(atcObj.inputElement.classList.contains('e-autocomplete')).toBe(true);
        });
        it('component module name', () => {
            expect(atcObj.getModuleName() === 'autocomplete').toBe(true);
        });
        it('default - popup button not enabled ', () => {
            expect(isNullOrUndefined(atcObj.inputWrapper.buttons[0])).toBe(true);
        });
        it('select a text by value', () => {
            atcObj.value = 'JAVA';
            atcObj.dataBind();
            expect(atcObj.text === 'JAVA').toBe(true);
        });
        it('select a value by text', () => {
            atcObj.text = 'PHP';
            atcObj.dataBind();
            expect(atcObj.value === 'PHP').toBe(true);
        });
        it('clear the value and text when click on clear icon', (done) => {
            atcObj.showPopup();
            setTimeout(() => {
                atcObj.clearAll();
                expect(atcObj.value === null).toBe(true);
                expect(atcObj.text === null).toBe(true);
                done();
            }, 450);
        });
        it('enabled the popup button', () => {
            atcObj.showPopupButton = true;
            atcObj.dataBind();
            expect(!isNullOrUndefined(atcObj.inputWrapper.buttons[0])).toBe(true);
        });
        it('disabled the popup button', () => {
            atcObj.showPopupButton = false;
            atcObj.dataBind();
            expect(isNullOrUndefined(atcObj.inputWrapper.buttons[0])).toBe(true);
        });
        it('value remains after data source change', () => {
            atcObj.value = 'PHP';
            atcObj.dataBind();
            expect(atcObj.value === 'PHP').toBe(true);
            atcObj.dataSource = [{ id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'PYTHON' }];
            atcObj.dataBind();
            expect(atcObj.value === 'PHP').toBe(true);
        });
    });

    // Method testing
    describe('method testing ', () => {
        let atcObj: any;
        let element: HTMLInputElement;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
            document.body.appendChild(element);
            atcObj = new AutoComplete();
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
        });

        it('getModuleName method', () => {
            let name: string = atcObj.getModuleName();
            expect(name).toEqual('autocomplete');
        });

        it('showPopup method', (done) => {
            atcObj.showPopup();
            setTimeout(() => {
                expect(atcObj.isPopupOpen).toBe(true);
                atcObj.showPopup();
                expect(atcObj.beforePopupOpen).toBe(true);
                done();
            }, 450);
        });

        it('hidePopup method', (done) => {
            atcObj.hidePopup();
            setTimeout(() => {
                expect(atcObj.isPopupOpen).toBe(false);
                done();
            }, 450);
        });

        it('second time call hidePopup method', (done) => {
            atcObj.showPopup();
            setTimeout(() => {
                expect(atcObj.isPopupOpen).toBe(true);
                done();
            }, 450);
        });

        it('destroy method ', () => {
            atcObj.destroy();
            atcObj.destroy = function (){
                expect(!!atcObj.element.classList.contains('e-autocomplete')).toBe(false);
            }
        });
        describe('Second time call destroy method', () => {
            let atcObj: any;
            let element: HTMLInputElement;
            beforeAll(() => {
                element = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
                document.body.appendChild(element);
                atcObj = new AutoComplete();
                atcObj.appendTo(element);
            });
            afterAll(() => {
                atcObj.destroy();
                element.remove();
            });
            it('destroy method in autocomplete', () => {
                atcObj.destroy();
                atcObj.destroy = function (){
                    expect(!!atcObj.element.classList.contains('e-autocomplete')).toBe(false);
                    element.remove();
                }
            });

        });
    });

    describe('Searching ', () => {
        describe('internal searching with array data', () => {
            let atcObj: any;
            let activeElement: HTMLElement[];
            let e: any = { preventDefault: function () { }, target: null, type: null };
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
            beforeAll(() => {
                document.body.appendChild(element);
                atcObj = new AutoComplete({
                    dataSource: sportsData,
                    allowCustom: true
                });
                atcObj.appendTo(element);
            });
            afterAll(() => {
                atcObj.destroy();
                element.remove();
            });

            it('Searching the matched item ', (done) => {
                atcObj.inputElement.value = 'Badminton';
                e.keyCode = 72;
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                setTimeout(() => {
                    activeElement = atcObj.list.querySelectorAll('li');
                    expect(activeElement[0].textContent).toBe('Badminton');
                    done();
                }, 450)
            });
            it('Searching the unmatched item ', () => {
                atcObj.inputElement.value = 'Badmintona';
                e.keyCode = 72;
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                expect(atcObj.list.classList.contains('e-nodata')).toBe(true);
            });
        });
        describe('internal searching with complex data', () => {
            let atcObj: any;
            let activeElement: HTMLElement[];
            let e: any = { preventDefault: function () { }, target: null, type: null };
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
            beforeAll(() => {
                document.body.appendChild(element);
                atcObj = new AutoComplete({
                    dataSource: languageData,
                    fields: { value: 'text' },
                    allowCustom: true
                });
                atcObj.appendTo(element);
            });
            afterAll(() => {
                atcObj.destroy();
                element.remove();
            });

            it('Searching with ignoreCase ', (done) => {
                atcObj.inputElement.value = 'java';
                e.keyCode = 72;
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                setTimeout(() => {
                    activeElement = atcObj.list.querySelectorAll('li');
                    expect(activeElement[0].textContent).toBe('JAVA');
                    done();
                }, 450)
            });
            it('Searching without ignoreCase ', () => {
                atcObj.ignoreCase = false;
                atcObj.dataBind();
                atcObj.inputElement.value = 'java'
                e.keyCode = 72;
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                expect(atcObj.list.querySelector('li') > 0).toBe(false);
                atcObj.ignoreCase = true;
                atcObj.dataBind();
            });

            it('noRecordsTemplate text when searching with unmatched item', () => {
                atcObj.inputElement.value = 'x';
                atcObj.onFilterUp(e);
                expect(atcObj.list.classList.contains('e-nodata')).toBe(true);
            });

            it('less than minCharacter length for searching', (done) => {
                atcObj.minLength = 2;
                atcObj.dataBind();
                atcObj.inputElement.value = 'j';
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                setTimeout(() => {
                    expect(atcObj.isPopupOpen).toBe(false);
                    done();
                }, 450)
            });

            it('above and equal the minCharacter length for searching', (done) => {
                atcObj.inputElement.value = 'ja';
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                setTimeout(() => {
                    activeElement = atcObj.list.querySelectorAll('li');
                    expect(activeElement[0].textContent).toBe('JAVA');
                    expect(atcObj.isPopupOpen).toBe(true);
                    atcObj.minLength = 1;
                    atcObj.dataBind();
                    done();
                }, 450);
            });

            it('search with empty text', (done) => {
                atcObj.inputElement.value = '';
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                setTimeout(() => {
                    expect(atcObj.isPopupOpen).toBe(false);
                    done();
                }, 450);
            });

            it('item count for searching', (done) => {
                atcObj.suggestionCount = 2;
                atcObj.dataBind();
                atcObj.inputElement.value = 'p';
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                setTimeout(() => {
                    expect(atcObj.list.querySelectorAll('li').length === 2).toBe(true);
                    done();
                }, 450)
            });
            it('item count with null for searching', () => {
                atcObj.suggestionCount = null;
                atcObj.dataBind();
                atcObj.inputElement.value = 'p';
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                expect(atcObj.list.querySelectorAll('li').length === 3).toBe(true);
            });

            it('press tab key while open a popup', (done) => {
                e.keyCode = 9;
                atcObj.onFilterDown(e);
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                e.action = 'close';
                atcObj.keyActionHandler(e);
                setTimeout(() => {
                    expect(atcObj.isPopupOpen).toEqual(false);
                    done();
                }, 450)
            });

            it('press tab key while hide a popup', (done) => {
                e.keyCode = 9;
                atcObj.onFilterDown(e);
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                e.action = 'close';
                atcObj.keyActionHandler(e);
                setTimeout(() => {
                    expect(atcObj.inputWrapper.container.classList.contains('e-input-focus')).toEqual(true);
                    done();
                }, 450)
            });

            it('select a value from popup list', (done) => {
                e.keyCode = 76;
                atcObj.inputElement.value = 'p';
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                setTimeout(() => {
                    e.type = 'keydown';
                    e.action = 'down';
                    atcObj.keyActionHandler(e);
                    e.action = 'enter';
                    atcObj.keyActionHandler(e);
                    expect(atcObj.inputElement.value === 'PHP').toBe(true);
                    expect(atcObj.value === 'PHP').toBe(true);
                    done();
                }, 450);
            });

            it('enter key press while empty text', (done) => {
                e.keyCode = 76;
                atcObj.inputElement.value = ' ';
                atcObj.onFilterUp(e);
                setTimeout(() => {
                    e.type = 'keydown';
                    e.action = 'enter';
                    atcObj.keyActionHandler(e);
                    expect(atcObj.inputElement.value === '').toBe(true);
                    expect(atcObj.value === null).toBe(true);
                    done();
                }, 450);
            });
        });

        describe('external searching', () => {
            let atcObj: any;
            let activeElement: HTMLElement[];
            let e: any = { preventDefault: function () { }, target: null };
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
            beforeAll(() => {
                document.body.appendChild(element);
                atcObj = new AutoComplete({
                    dataSource: languageData,
                    fields: { text: 'text', value: 'id' },
                    filtering: (e: FilteringEventArgs) => {
                        let query = new Query();
                        query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                        e.updateData(languageData, query);
                    }
                });
                atcObj.appendTo(element);
            });
            afterAll(() => {
                atcObj.destroy();
                element.remove();
            });

            it('Searching a value ', (done) => {
                atcObj.inputElement.value = 'java';
                e.keyCode = 72;
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                setTimeout(() => {
                    activeElement = atcObj.list.querySelectorAll('li');
                    expect(activeElement[0].textContent).toBe('JAVA');
                    done();
                }, 450)
            });

            it('noRecordsTemplate text when searching with unmatched item', () => {
                atcObj.inputElement.value = 'x';
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                expect(atcObj.list.classList.contains('e-nodata')).toBe(true);
            });

            it('search with empty text', (done) => {
                atcObj.inputElement.value = '';
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                setTimeout(() => {
                    expect(atcObj.isPopupOpen).toBe(false);
                    done();
                }, 450);
            });
        });

        describe('external searching using filter', () => {
            let atcObj: any;
            let activeElement: HTMLElement[];
            let e: any = { preventDefault: function () { }, target: null };
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
            beforeAll(() => {
                document.body.appendChild(element);
                atcObj = new AutoComplete({
                    dataSource: languageData,
                    fields: { text: 'text', value: 'id' },
                    filtering: (e: FilteringEventArgs) => {
                        let query = new Query();
                        query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                        atcObj.filter(languageData, query);
                    }
                });
                atcObj.appendTo(element);
            });
            afterAll(() => {
                atcObj.destroy();
                element.remove();
            });

            it('Searching a value ', (done) => {
                atcObj.inputElement.value = 'java';
                e.keyCode = 72;
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                setTimeout(() => {
                    activeElement = atcObj.list.querySelectorAll('li');
                    expect(activeElement[0].textContent).toBe('JAVA');
                    done();
                }, 450)
            });
        });
    });
    describe('Highlight and AutoFill', () => {
        let atcObj: any;
        let e: any = { preventDefault: function () { }, target: null, type: null, action: 'down' };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        beforeAll(() => {
            document.body.appendChild(element);
            atcObj = new AutoComplete({
                dataSource: languageData,
                fields: { value: 'text' },
                autofill: true,
                highlight: true
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
        });
        it('highlight by StartsWith', (done) => {
            atcObj.filterType = 'StartsWith';
            atcObj.dataBind()
            e.keyCode = 76;
            atcObj.inputElement.value = 'p';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            setTimeout(() => {
                let highlight: HTMLElement[] = atcObj.liCollections[0].querySelectorAll('.e-highlight');
                expect(highlight.length === 1).toBe(true);
                done();
            }, 450);
        });
        it('highlight by EndsWith', (done) => {
            atcObj.hidePopup();
            setTimeout(() => {
                atcObj.filterType = 'EndsWith';
                atcObj.dataBind();
                e.keyCode = 76;
                atcObj.inputElement.value = 'p';
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                setTimeout(() => {
                    let highlight: HTMLElement[] = atcObj.liCollections[0].querySelectorAll('.e-highlight');
                    expect(highlight.length === 1).toBe(true);
                    atcObj.filterType = 'Contains';
                    atcObj.dataBind()
                    done();
                }, 450);
            }, 450)
        });
        it('highlight with special character', () => {
            atcObj.inputElement.value = ')';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            expect(atcObj.liCollections.length === 0).toBe(true);
        });
        it('fill first item text in input', (done) => {
            e.keyCode = 76;
            atcObj.inputElement.value = 'p';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            setTimeout(() => {
                e.action = 'down';
                e.type = 'keydown';
                atcObj.keyActionHandler(e);
                expect(atcObj.inputElement.value === 'pHP').toBe(true);
                done();
            }, 450);
        });
        it('fill second item text in input', function () {
            e.type = 'keydown';
            e.action = 'down';
            atcObj.keyActionHandler(e);
            expect(atcObj.inputElement.value === 'pERL').toBe(true);
            e.type = null;
        });
        it('check highlight value in popup list', () => {
            e.keyCode = 76;
            atcObj.inputElement.value = 'p';
            let highlight: HTMLElement = atcObj.list.querySelector('.e-highlight');
            expect(highlight.textContent === 'P').toBe(true);
        });

        it('not fill when delete or backspace key press', () => {
            atcObj.inputElement.value = 'PER';
            e.keyCode = 8;
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            expect(atcObj.inputElement.value === 'PER').toBe(true);
        });
        it('select fill value when press enter key', (done) => {
            e.type = 'keydown';
            e.action = 'down';
            atcObj.keyActionHandler(e);
            e.action = 'enter';
            atcObj.keyActionHandler(e);
            setTimeout(() => {
                expect(atcObj.inputElement.value === 'PERL').toBe(true);
                expect(atcObj.value === 'PERL').toBe(true);
                done();
            }, 450)
        });
    });

    describe('AutoFill', () => {
        let originalTimeout: number;
        let atcObj: any;
        let popupObj: any;
        let keyEventArgs: any;
        let e: any = { preventDefault: function () { }, target: null, type: null, keyCode: 74 };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ComboBox1' });
        beforeAll(() => {
            document.body.appendChild(element);
            atcObj = new AutoComplete({
                dataSource: languageData,
                fields: { value: 'text' },
                filterType: 'StartsWith',
                autofill: true
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
        });

        it('fill a first value in text box', (done) => {
            atcObj.inputElement.value = 'h';
            e.key = 'H';
            e.keyCode = 72;
            atcObj.focusIn();
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            setTimeout(() => {
                expect(atcObj.inputElement.value).toBe('hTML');
                done();
            }, 450)
        });

        it('select a first value in text box', (done) => {
            e.keyCode = 13;
            e.action = 'enter';
            atcObj.keyActionHandler(e);
            setTimeout(() => {
                expect(atcObj.inputElement.value).toBe('HTML');
                done();
            }, 450)
        });

        it('remove fill selection', (done) => {
            atcObj.inputElement.value = 'h';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            setTimeout(() => {
                e.key = 'H';
                e.keyCode = 72;
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                expect(atcObj.inputElement.value).toBe('hTML');
                e.keyCode = 13;
                e.action = 'down';
                e.type = 'keydown';
                atcObj.keyActionHandler(e);
                let focusEle: HTMLElement = atcObj.list.querySelector('.e-item-focus');
                expect(focusEle.textContent).toBe('HTML');
                e.action = 'enter';
                atcObj.keyActionHandler(e);
                setTimeout(() => {
                    expect(atcObj.value).toBe('HTML');
                    done();
                }, 450);
            }, 450)
        });
        it('android mobile: fill a first value in text box', () => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            atcObj.inputElement.value = '';
            e.keyCode = 229;
            atcObj.onFilterDown(e);
            atcObj.inputElement.value = 'ph';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            expect(atcObj.inputElement.value === 'phP').toBe(true);
        });
        it('android mobile: remove the selection when press a backspace', () => {
            atcObj.inputElement.value = 'ph';
            atcObj.onFilterDown(e);
            atcObj.inputElement.value = 'ph';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            expect(atcObj.inputElement.value === 'ph').toBe(true);
        });
        it('android mobile: not fill when typing backspace', () => {
            atcObj.inputElement.value = 'ph'
            e.keyCode = 229;
            atcObj.onFilterDown(e);
            atcObj.inputElement.value = 'p';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            expect(atcObj.inputElement.value === 'p').toBe(true);
        });
        it('android mobile: not fill when typing backspace in worst case', () => {
            atcObj.inputElement.value = 'ph'
            e.keyCode = 229;
            atcObj.onFilterDown(e);
            atcObj.inputElement.value = 'ph';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            expect(atcObj.inputElement.value === 'ph').toBe(true);
            Browser.userAgent = navigator.userAgent;
        });
    });

    describe('Internal filterType operation', () => {
        let atcObj: any;
        let e: any = { preventDefault: function () { }, target: null, type: null };
        let element: HTMLInputElement;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
            document.body.appendChild(element);
            atcObj = new AutoComplete({
                dataSource: filterData,
                fields: { value: 'CustomerID' }
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
        });

        it('filterType - contains', (done) => {
            e.keyCode = 76;
            atcObj.inputElement.value = 'a';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            setTimeout(() => {
                let list: any = atcObj.list.querySelectorAll('li');
                expect(list.length === 1).toBe(true);
                done();
            }, 450);
        });
        it('filterType - StartsWith', () => {
            atcObj.filterType = 'StartsWith';
            atcObj.dataBind();
            e.keyCode = 76;
            atcObj.inputElement.value = 't';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            let list: any = atcObj.list.querySelectorAll('li');
            expect(list.length == 0).toBe(true);
            atcObj.inputElement.value = 'v';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            list = atcObj.list.querySelectorAll('li');
            expect(list.length == 3).toBe(true);
        });
        it('filterType - EndsWith', () => {
            atcObj.filterType = 'EndsWith';
            atcObj.dataBind();
            e.keyCode = 76;
            atcObj.inputElement.value = 't';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            let list: any = atcObj.list.querySelectorAll('li');
            expect(list.length == 2).toBe(true);
        });

        it('filterType - Equal', () => {
            atcObj.filterType = 'Equal';
            atcObj.fields = { value: 'OrderID' };
            atcObj.dataBind();
            e.keyCode = 76;
            atcObj.inputElement.value = '10251';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            let list: any = atcObj.list.querySelectorAll('li');
            expect(list.length == 1).toBe(true);
        });

        it('filterType - NotEqual', () => {
            atcObj.filterType = 'NotEqual';
            atcObj.fields = { value: 'OrderID' };
            atcObj.dataBind();
            e.keyCode = 76;
            atcObj.inputElement.value = '10251';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            let list: any = atcObj.list.querySelectorAll('li');
            expect(list.length == 4).toBe(true);
        });

        it('filterType - GreaterThanOrEqual', () => {
            atcObj.filterType = 'GreaterThanOrEqual';
            atcObj.fields = { value: 'OrderID' };
            atcObj.dataBind();
            e.keyCode = 76;
            atcObj.inputElement.value = '10251';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            let list: any = atcObj.list.querySelectorAll('li');
            expect(list.length == 2).toBe(true);
        });
        it('filterType - GreaterThan', () => {
            atcObj.filterType = 'GreaterThan';
            atcObj.fields = { value: 'OrderID' };
            atcObj.dataBind();
            e.keyCode = 76;
            atcObj.inputElement.value = '10251';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            let list: any = atcObj.list.querySelectorAll('li');
            expect(list.length == 1).toBe(true);
        });
        it('filterType - LessThan', () => {
            atcObj.filterType = 'LessThan';
            atcObj.fields = { value: 'OrderID' };
            atcObj.dataBind();
            e.keyCode = 76;
            atcObj.inputElement.value = '10251';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            let list: any = atcObj.list.querySelectorAll('li');
            expect(list.length == 3).toBe(true);
        });

        it('filterType - LessThanOrEqual', () => {
            atcObj.filterType = 'LessThanOrEqual';
            atcObj.fields = { value: 'OrderID' };
            atcObj.dataBind();
            e.keyCode = 76;
            atcObj.inputElement.value = '10251';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            let list: any = atcObj.list.querySelectorAll('li');
            expect(list.length == 4).toBe(true);
        });
    });

    // Keyboard Interaction
    describe('key actions', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', keyCode: null, type: null };
        let list: any;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('input', { id: 'autocomplete' });
            document.body.appendChild(ele);
            list = new AutoComplete({
                dataSource: languageData,
                fields: { value: 'text' },
                showPopupButton: true
            });
            list.appendTo(ele);
        });
        afterAll(() => {
            ele.remove();
            list.destroy();
            document.body.innerHTML = '';
        });
        /**
        * popup open when press down key
        */
        it("popup open when press down key", (done) => {
            keyEventArgs.keyCode = 40;
            list.onInput(keyEventArgs);
            list.onFilterUp(keyEventArgs);
            setTimeout(() => {
                expect(list.isPopupOpen).toBe(true);
                expect(list.liCollections.length > 0).toBe(true);
                done();
            }, 450);
        })
        /**
        * popup close when press alt+up key
        */
        it("popup close when press alt+up key", (done) => {
            keyEventArgs.action = 'hide';
            list.keyActionHandler(keyEventArgs);
            list.onInput(keyEventArgs);
            list.onFilterUp(keyEventArgs);
            setTimeout(() => {
                expect(list.isPopupOpen).toBe(false);
                done();
            }, 450);
        })
        /**
        * popup open with suggestion list when press down key
        */
        it("popup open with suggestion list when press down key", (done) => {
            list.inputElement.value = 'j';
            keyEventArgs.action = 'down';
            list.keyActionHandler(keyEventArgs);
            list.onInput(keyEventArgs);
            list.onFilterUp(keyEventArgs);
            setTimeout(() => {
                expect(list.isPopupOpen).toBe(true);
                expect(list.liCollections.length === 1).toBe(true);
                done();
            }, 450);
        })
        /**
        * popup close when press escape key
        */
        it("popup close when press escape key", (done) => {
            list.inputElement.value = '';
            keyEventArgs.action = 'escape';
            list.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(list.isPopupOpen).toBe(false);
                done();
            }, 450);
        })
        /**
        * popup open when click on popup button
        */
        it("popup open when click on popup button", (done) => {
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = list.inputWrapper.buttons[0];
            list.dropDownClick(mouseEventArgs);
            setTimeout(() => {
                expect(list.isPopupOpen).toBe(true);
                expect(list.liCollections.length > 0).toBe(true);
                done();
            }, 450);
        })
        /**
        * select a value from suggestion list
        */
        it("select a value from suggestion list", (done) => {
            keyEventArgs.action = 'down';
            keyEventArgs.type = 'keydown';
            list.keyActionHandler(keyEventArgs);
            keyEventArgs.action = 'enter';
            list.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(list.value === 'PHP').toBe(true);
                expect(list.isPopupOpen).toBe(false);
                done();
            }, 450);
        })
        /**
        * popup open with suggestion when click on popup button
        */
        it("popup open with suggestion when click on popup button", (done) => {
            list.inputElement.value = 'j';
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = list.inputWrapper.buttons[0];
            list.dropDownClick(mouseEventArgs);
            setTimeout(() => {
                expect(list.isPopupOpen).toBe(true);
                expect(list.liCollections.length === 1).toBe(true);
                done();
            }, 450);
        })
        /**
        * last selected value set when press a escape key
        */
        it("last selected value set when press an escape key", (done) => {
            keyEventArgs.action = 'escape';
            keyEventArgs.type = 'keydown';
            list.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(list.value === 'PHP').toBe(true);
                expect(list.isPopupOpen).toBe(false);
                done();
            }, 450);
        })
        /**
        * round robin navigation in down key
        */
        it("round robin navigation in down key", (done) => {
            list.inputElement.value = 'm';
            keyEventArgs.action = 'down';
            keyEventArgs.type = 'keydown';
            list.onInput(keyEventArgs);
            list.onFilterUp(keyEventArgs);
            setTimeout(() => {
                expect(list.isPopupOpen).toBe(true);
                let focusEle: HTMLElement;
                list.keyActionHandler(keyEventArgs);
                focusEle = list.list.querySelector('.e-item-focus');
                expect(focusEle.textContent === 'HTML').toBe(true);

                list.keyActionHandler(keyEventArgs);
                focusEle = list.list.querySelector('.e-item-focus');
                expect(focusEle.textContent === 'HTMLCSS').toBe(true);

                list.keyActionHandler(keyEventArgs);
                focusEle = list.list.querySelector('.e-item-focus');
                expect(focusEle.textContent === 'HTML').toBe(true);
                done();
            }, 450);
        })
        /**
        * round robin navigation in up key
        */
        it("round robin navigation in up key", () => {
            let focusEle: HTMLElement;
            keyEventArgs.action = 'up';
            keyEventArgs.type = 'keydown';
            list.keyActionHandler(keyEventArgs);
            focusEle = list.list.querySelector('.e-item-focus');
            expect(focusEle.textContent === 'HTMLCSS').toBe(true);

            list.keyActionHandler(keyEventArgs);
            focusEle = list.list.querySelector('.e-item-focus');
            expect(focusEle.textContent === 'HTML').toBe(true);

            list.keyActionHandler(keyEventArgs);
            focusEle = list.list.querySelector('.e-item-focus');
            expect(focusEle.textContent === 'HTMLCSS').toBe(true);
        })
        /**
        *  popup hide while empty text - delete key or backspace
        */
        it("popup hide while empty text - down key", (done) => {
            list.inputElement.value = '';
            keyEventArgs.keyCode = 72;
            list.onInput(keyEventArgs);
            list.onFilterUp(keyEventArgs);
            keyEventArgs.keyCode = 46;
            list.onInput(keyEventArgs);
            list.onFilterUp(keyEventArgs);
            setTimeout(() => {
                expect(list.isPopupOpen).toBe(false)
                done();
            }, 450);
        })
    });

    describe('Spinner support', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', keyCode: null, type: null };
        let listObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        describe(' enable the popup button', () => {
            beforeAll(() => {
                document.body.appendChild(ele);
                listObj = new AutoComplete({
                    dataSource: data, fields: { value: 'text' },
                    popupHeight: '100px',
                    showPopupButton: true
                });
                listObj.appendTo('#newlist');
            });
            afterAll(() => {
                if (ele) {
                    ele.remove();
                }
            })
            it(' - spinner show instead of popup button icon at initial time', () => {
                listObj.showPopup();
                expect(isNullOrUndefined(listObj.inputWrapper.buttons[0].querySelector('e-spinner-pane'))).toBe(true);
            })

            it(' - spinner show instead of clear icon', () => {
                listObj.showPopupButton = false;
                listObj.dataBind();
                listObj.filterInput.value = 'a';
                keyEventArgs.keyCode = 40;
                listObj.onInput(keyEventArgs);
                listObj.onFilterUp(keyEventArgs);
                expect(isNullOrUndefined(listObj.inputWrapper.clearButton.querySelector('e-spinner-pane'))).toBe(true);
            })
        });
        describe('disable the clear button', () => {
            beforeAll(() => {
                document.body.appendChild(ele);
                listObj = new AutoComplete({
                    dataSource: data, fields: { value: 'text' },
                    popupHeight: '100px',
                    showPopupButton: false,
                    showClearButton: false
                });
                listObj.appendTo('#newlist');
            });
            afterAll(() => {
                if (ele) {
                    ele.remove();
                }
            })

            it(' - spinner show without enable the popup button', () => {
                listObj.filterInput.value = 'a';
                keyEventArgs.keyCode = 40;
                listObj.onInput(keyEventArgs);
                listObj.onFilterUp(keyEventArgs);
                expect(isNullOrUndefined(listObj.inputWrapper.container.querySelector('e-spinner-pane'))).toBe(true);
            })
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
            list = new AutoComplete({
                dataSource: complexStringData,
                fields: { value: 'list.text' },
                value: "text1"
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

        it('initially select the complex data of value fields', () => {
            expect(list.value === 'text1').toBe(true);
        });
        it('select the complex data of value fields while click on popup list', (done) => {
            list.showPopup();
            list.filterInput.value = 't';
            keyEventArgs.keyCode = 40;
            list.onInput(keyEventArgs);
            list.onFilterUp(keyEventArgs);
            setTimeout(() => {
                let item: HTMLElement[] = list.popupObj.element.querySelectorAll('li')[1];
                mouseEventArgs.target = item;
                mouseEventArgs.type = 'click';
                list.onMouseClick(mouseEventArgs);
                expect(list.value === 'text2').toBe(true);
                expect(list.inputElement.value === 'text2').toBe(true);
                list.hidePopup();
                setTimeout(() => {
                    done()
                }, 400);
            }, 400);
        });
    });
    describe('clear button event argument isInteraction', () => {
        let atcObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        beforeAll(() => {
            Browser.userAgent = navigator.userAgent;
            document.body.appendChild(element);
            atcObj = new AutoComplete({
                dataSource: languageData,
                fields: { value: 'text' },
                change: function (args: any) {
                    if (args.isInteracted) {
                        expect(args.isInteracted).toBe(true);
                    }
                }
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
        });
        it('click clearbutton', () => {
            atcObj.value = 'JAVA';
            atcObj.dataBind();
            expect(atcObj.text === 'JAVA').toBe(true);
            atcObj.resetHandler(mouseEventArgs);
        });
    });
    describe('events args.cancel', () => {
        let atcObj: any;
        let activeElement: HTMLElement[];
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        beforeAll(() => {
            document.body.appendChild(element);
            atcObj = new AutoComplete({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                filtering: (e: FilteringEventArgs) => {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                    let query = new Query();
                    query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                    e.updateData(languageData, query);
                }
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
        });

        it('external Searching args.cancel ', (done) => {
            setTimeout(() => {
                atcObj.inputElement.value = 'java';
                e.keyCode = 72;
                atcObj.onInput(e);
                atcObj.onFilterUp(e);
                done();
            }, 500);
        });
    });

    describe('ignoreAccent support', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let atcObj: any;
        let activeElement: HTMLElement[];
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let data: string[] = ['jäger', 'jalapeño', 'jardinière', 'jūdō', 'jūjutsu']
        beforeAll(() => {
            document.body.appendChild(element);
            atcObj = new AutoComplete({
                dataSource: data,
                ignoreAccent: true
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
        });

        it('search diacritics data', (done) => {
            atcObj.showPopup();
            atcObj.filterInput.value = 'ä';
            keyEventArgs.keyCode = 40;
            atcObj.onInput(keyEventArgs);
            atcObj.onFilterUp(keyEventArgs);
            setTimeout(() => {
                let item: HTMLElement[] = atcObj.popupObj.element.querySelectorAll('li');
                expect(item.length === 3).toBe(true);
                mouseEventArgs.target = item[0];
                mouseEventArgs.type = 'click';
                atcObj.onMouseClick(mouseEventArgs);
                expect(atcObj.value === 'jäger').toBe(true);
                expect(atcObj.inputElement.value === 'jäger').toBe(true);
                atcObj.hidePopup();
                setTimeout(() => {
                    done()
                }, 400);
            }, 400);
        });
    });
    describe('prevent right click', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
            dropDowns = new AutoComplete({
                dataSource: languageData,
                fields: { value: 'id', text: 'text' },
                showPopupButton: true
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it(' click on popup button', (done) => {
            mouseEventArgs.target = dropDowns.inputWrapper.buttons[0];
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
            dropDowns = new AutoComplete({
                dataSource: languageData,
                fields: { value: 'id', text: 'text' },
                showPopupButton: true,
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
            dropDowns = new AutoComplete({
                dataSource: remoteData,
                fields: { value: 'FirstName' },
                showPopupButton: true,
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
            dropDowns = new AutoComplete({
                dataSource: languageData,
                fields: { value: 'id', text: 'text' },
                showPopupButton: true,
                filtering: (e: FilteringEventArgs) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'java';
            e.keyCode = 72;
            dropDowns.onInput(e);
            dropDowns.onFilterUp(e);
            setTimeout(() => {
                expect(dropDowns.isPopupOpen).toBe(false);
                done();
            }, 500);
        });
    });
    describe('event args.cancel: actionBegin', () => {
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
            dropDowns = new AutoComplete({
                dataSource: remoteData,
                fields: { value: 'FirstName' },
                showPopupButton: true,
                actionBegin: (e: any) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'java';
            e.keyCode = 72;
            dropDowns.onInput(e);
            dropDowns.onFilterUp(e);
            setTimeout(() => {
                expect(dropDowns.isPopupOpen).toBe(false);
                done();
            }, 800);
        });
    });
    describe('event args.cancel: actionComplete', () => {
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
            dropDowns = new AutoComplete({
                dataSource: remoteData,
                fields: { value: 'FirstName' },
                showPopupButton: true,
                actionComplete: (e: any) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'java';
            e.keyCode = 72;
            dropDowns.onInput(e);
            dropDowns.onFilterUp(e);
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
            dropDowns = new AutoComplete({
                dataSource: languageData,
                fields: <Object>{
                    value: 'text', itemCreated: (e: any) => {
                        if (count === 0) {
                            e.item.classList.add('e-disabled');
                        }
                    }
                },
                showPopupButton: true
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'a';
            e.keyCode = 72;
            dropDowns.onInput(e);
            dropDowns.onFilterUp(e);
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
            dropDowns = new AutoComplete({
                dataSource: languageData,
                fields: {
                    value: 'text'
                },
                showPopupButton: true,
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
            dropDowns = new AutoComplete({
                dataSource: languageData,
                fields: {
                    value: 'text'
                },
                showPopupButton: true,
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

        it(' Autocomplete - Empty listdata &  getdatabyvalue', () => {
            let isCreated: boolean = false;
            dropDowns = new AutoComplete({
                dataSource: languageData,
                fields: {
                    value: 'text'
                }
            });
            dropDowns.appendTo(element);
            expect(dropDowns.getDataByValue('PYTHON')).toBe(null);
        });


    });

    describe('Highlight search: EJ2-8617', () => {
        let atcObj: any;
        let e: any = { preventDefault: function () { }, target: null, type: null, action: 'down' };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        beforeAll(() => {
            document.body.appendChild(element);
            atcObj = new AutoComplete({
                dataSource: languageData,
                fields: <any>{
                    value: 'text', itemCreated: (e: any) => {
                        e.item.classList.add('e-disabled');
                    }
                },
                highlight: true
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
        });
        it('highlight by StartsWith and set the e-disabled class to each item', (done) => {
            atcObj.filterType = 'StartsWith';
            atcObj.dataBind()
            e.keyCode = 76;
            atcObj.inputElement.value = 'p';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            setTimeout(() => {
                let highlight: HTMLElement[] = atcObj.liCollections[0].querySelectorAll('.e-highlight');
                let listItems: HTMLElement[] = atcObj.list.querySelectorAll('li');
                expect(highlight.length === 1).toBe(true);
                expect(listItems[1].classList.contains("e-disabled")).toBe(true);
                done();
            }, 450);
        });
    });
    describe('GetItems related bug', () => {
        let element: HTMLInputElement;
        let element1: HTMLInputElement;
        let jsonData: { [key: string]: Object; }[] = [{'id': false, 'text': 'failure'},{'id': true,
        'text': 'success'}];
        let ddl: AutoComplete;
        let ddl1: AutoComplete;
        let remoteData: DataManager = new DataManager({ url: '/api/Employee', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'comboBox' });
            document.body.appendChild(element);
            element1 = <HTMLInputElement>createElement('input', { id: 'comboBox1' });
            document.body.appendChild(element1);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            ddl = new AutoComplete({
                dataSource: jsonData,
                fields: {text: 'text', value: 'id'},
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
            ddl = new AutoComplete({
                dataSource: data,
                value: false
            });
            ddl.appendTo(element);
            expect(ddl.inputElement.value).toBe('false');
            expect(ddl.value).toBe(false);
        });
        it('set boolean value in dynamic way', () => {
            ddl = new AutoComplete({
                dataSource: data
            });
            ddl.appendTo(element);
            ddl.setProperties({value:true});
            expect(ddl.inputElement.value).toBe('true');
            expect(ddl.value).toBe(true);
        });
        it('select boolean value', () => {
            ddl = new AutoComplete({
                dataSource: jsonData,
                fields: {text: 'text', value: 'id'},
                value: false
            });
            ddl.appendTo(element);
            expect(ddl.inputElement.value).toBe('failure');
            expect(ddl.text).toBe('failure');
            expect(ddl.value).toBe(false);
            expect(ddl.getDataByValue(false).text).toBe('failure');
        });
        it('set boolean value in dynamic way', () => {
            ddl= new AutoComplete({
                dataSource: jsonData,
                fields: {text: 'text', value: 'id'}
            });
            ddl.appendTo(element);
            ddl.setProperties({value:true});
            expect(ddl.inputElement.value).toBe('success');
            expect(ddl.text).toBe('success');
            expect(ddl.value).toBe(true);
            expect(ddl.getDataByValue(true).text).toBe('success');
        });
    });
    describe('Check Readonly focus issue', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: AutoComplete;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            ddl = new AutoComplete({
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
        let ddl: AutoComplete;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            ddl = new AutoComplete({
                dataSource: data,
                beforeOpen: (): void => {
                    expect(true).toBe(true);
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();
        });
    });
    describe('Disabled with showpopup public method', () => {
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
            ddl = new AutoComplete({
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
            ddl = new AutoComplete({
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
            ddl = new AutoComplete({
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
    describe('EJ2-17992 - minlength issue with filtering', () => {
        let atcObj: any;
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
        let openAction: EmitType<Object> = jasmine.createSpy('Open');
        let e: any = { preventDefault: function () { }, target: null, type: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(element);
            atcObj = new AutoComplete({
                minLength: 5,
                fields: { value: 'Name' },
                placeholder: 'e.g. Australia',
                filtering: function(e: FilteringEventArgs){ 
                    let query: Query = new Query();
                    query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
                 e.updateData(countries, query);
                },
                open: openAction
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            atcObj.destroy();
            element.remove();
        });


        it('minlength issue with filtering ', () => {
            atcObj.inputElement.value = 'Aust';
            e.keyCode = 84;
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            expect(openAction).not.toHaveBeenCalled();
        });
    });
    describe('EJ2-21720 - custom value not maintain after the reload the data source ', () => {
        let atcObj: AutoComplete;
        let sportsData: string[] = [
            'Badminton',
            'Basketball',
            'Cricket',
            'Football',
            'Golf',
            'Gymnastics',
            'Hockey',
            'Rugby',
            'Snooker',
            'Tennis'
          ];
        let data: string[] = [
            'Bad',
            'ball'
          ];
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let btnEle: HTMLButtonElement = <HTMLButtonElement>createElement('input', { id: 'btn',attrs: { type: 'button' } });
        beforeAll(() => {
            document.body.appendChild(element);
            document.body.appendChild(btnEle);
            atcObj = new AutoComplete({
                placeholder: 'e.g. Australia',
                dataSource: sportsData
            });
            atcObj.appendTo(element);
        });
        afterAll(() => {
            atcObj.destroy();
            element.remove();
            btnEle.remove();
        });


        it('check custom value', () => {
            btnEle.onclick = (): void => {
                atcObj.dataSource = data;
                atcObj.dataBind();
                expect((<any>atcObj).inputElement.value).toBe('abc');
            }
            (<any>atcObj).inputElement.value = 'abc';
            btnEle.click();
        });
    });
    describe('EJ2-22523: Form reset', () => {
        let element: HTMLInputElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' }
        ];
        let listObj: AutoComplete;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('form', { id: 'form1' });
            element.innerHTML = `<input type="text" id="ddl">
            <input type="reset" id="resetForm"/>`;
            document.body.appendChild(element);
            listObj = new AutoComplete({
                dataSource: data,
                fields: { value: "id" },
                value: 'list2'
            });
            listObj.appendTo('#ddl');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('reset the form', (done) => {
            document.getElementById('resetForm').click();
            setTimeout(() => {
                expect((<any>listObj).inputElement.value === 'list2').toBe(true);
                done();
            });
        });
    });
    it('memory leak', () => {     
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});
describe('EJ2-36604 - While giving the class name with empty space for HtmlAttributes, console error is produced.', function () {
    let listObj: any;
    beforeEach(function () {
        let inputElement: HTMLElement = createElement('input', { id: 'autocomplete' });
        document.body.appendChild(inputElement);
    });
    afterEach(function () {
        if (listObj) {
            listObj.destroy();
            document.body.innerHTML = '';
        }
    });
    it('Entering the class name without any empty space', function () {
        listObj = new AutoComplete({
            htmlAttributes: { class: 'custom-class' }
        });
        listObj.appendTo('#autocomplete');
        expect(listObj.inputWrapper.container.classList.contains('custom-class')).toBe(true);
    });
    it('Giving empty space before and after the class name', function () {
        listObj = new AutoComplete({
            htmlAttributes: { class: ' custom-class ' }
        });
        listObj.appendTo('#autocomplete');
        expect(listObj.inputWrapper.container.classList.contains('custom-class')).toBe(true);
    });
    it('Giving more than one empty space between two class names', function () {
        listObj = new AutoComplete({
            htmlAttributes: { class: 'custom-class-one      custom-class-two'}
        });
        listObj.appendTo('#autocomplete');
        expect(listObj.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        expect(listObj.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
    });
    it('Giving more than one empty space between two class names as well before and after the class name', function () {
        listObj = new AutoComplete({
            htmlAttributes: {  class: ' custom-class-one       custom-class-two ' }
        });
        listObj.appendTo('#autocomplete');
        expect(listObj.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        expect(listObj.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
    });
    it('Giving only empty space  without entering any class Name', function () {
        listObj = new AutoComplete({
        });
        listObj.appendTo('#autocomplete');
        let beforeAddClass = listObj.inputWrapper.container.classList.length;
        listObj.htmlAttributes = { class: '  ' };
        listObj.appendTo('#autocomplete');
        let AfterAddClass = listObj.inputWrapper.container.classList.length;
        expect(beforeAddClass == AfterAddClass).toBe(true);
    });
    it('Keep input as empty without entering any class Name', function () {
        listObj = new AutoComplete({
        });
        listObj.appendTo('#autocomplete');
        let beforeAddClass = listObj.inputWrapper.container.classList.length;
        listObj.htmlAttributes = { class: '' };
        listObj.appendTo('#autocomplete');
        let AfterAddClass = listObj.inputWrapper.container.classList.length;
        expect(beforeAddClass == AfterAddClass).toBe(true);
    });

    it('Entering the class name without any empty space', function () {
        listObj = new AutoComplete({
            cssClass: 'custom-class' 
        });
        listObj.appendTo('#autocomplete');
        expect(listObj.inputWrapper.container.classList.contains('custom-class')).toBe(true);
    });
    it('Giving empty space before and after the class name', function () {
        listObj = new AutoComplete({
             cssClass: ' custom-class ' 
        });
        listObj.appendTo('#autocomplete');
        expect(listObj.inputWrapper.container.classList.contains('custom-class')).toBe(true);
    });
    it('Giving more than one empty space between two class names', function () {
        listObj = new AutoComplete({
             cssClass: 'custom-class-one      custom-class-two'
        });
        listObj.appendTo('#autocomplete');
        expect(listObj.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        expect(listObj.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
    });
    it('Giving more than one empty space between two class names as well before and after the class name', function () {
        listObj = new AutoComplete({
             cssClass: ' custom-class-one       custom-class-two ' 
        });
        listObj.appendTo('#autocomplete');
        expect(listObj.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        expect(listObj.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
    });
    it('Giving only empty space  without entering any class Name', function () {
        listObj = new AutoComplete({
        });
        listObj.appendTo('#autocomplete');
        let beforeAddClass = listObj.inputWrapper.container.classList.length;
        listObj.cssClass =  '  ' ;
        listObj.appendTo('#autocomplete');
        let AfterAddClass = listObj.inputWrapper.container.classList.length;
        expect(beforeAddClass == AfterAddClass).toBe(true);
    });
    it('Keep input as empty without entering any class Name', function () {
        listObj = new AutoComplete({
        });
        listObj.appendTo('#autocomplete');
        let beforeAddClass = listObj.inputWrapper.container.classList.length;
        listObj.cssClass =  '' ;
        listObj.appendTo('#autocomplete');
        let AfterAddClass = listObj.inputWrapper.container.classList.length;
        expect(beforeAddClass == AfterAddClass).toBe(true);
    });
    it('Giving class name with underscore in the beginning', function () {
        listObj = new AutoComplete({
            htmlAttributes : { class : '  _custom-class-one  '},
            cssClass : '   _custom-class-two  '
        });
        listObj.appendTo('#autocomplete');
        expect(listObj.inputWrapper.container.classList.contains('_custom-class-one')).toBe(true);
        expect(listObj.inputWrapper.container.classList.contains('_custom-class-two')).toBe(true);
    });
    it('Giving class name with empty space in both cases seperatly', function () {
        listObj = new AutoComplete({
            htmlAttributes : { class : '  custom-class-one  '},
            cssClass : '   custom-class-two  '
        });
        listObj.appendTo('#autocomplete');
        expect(listObj.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        expect(listObj.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
    });   
});
describe('bug(EJ2-44058): When template is used, highlight is not working in the DropDown components', () => {
    let atcObj: any;
    let e: any = { preventDefault: function () { }, target: null, type: null, action: 'down' };
    let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
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
        document.body.appendChild(element);
    });
    afterAll(() => {
        atcObj.destroy();
        element.remove();
    });
    it('highlight by StartsWith', (done) => {
        atcObj = new AutoComplete({
            dataSource: empList,
            fields: { value: 'Name' },
            highlight: true,
            itemTemplate: '<div class="ename"> ${Name}</div><div class="job"> ${Designation} </div>',
        });
        atcObj.appendTo(element);
        atcObj.filterType = 'StartsWith';
        atcObj.dataBind()
        e.keyCode = 76;
        atcObj.inputElement.value = 'J';
        atcObj.onInput(e);
        atcObj.onFilterUp(e);
        setTimeout(() => {
            let highlight: HTMLElement[] = atcObj.liCollections[0].querySelectorAll('.e-highlight');
            expect(highlight.length === 1).toBe(true);
            atcObj.hidePopup();
            done();
        }, 450);
    });
    it('highlight by EndsWith', (done) => {
        atcObj = new AutoComplete({
            dataSource: empList,
            fields: { value: 'Name' },
            highlight: true,
            itemTemplate: '<div class="ename"> ${Name}</div><div class="job"> ${Designation} </div>',
        });
        atcObj.appendTo(element);
        atcObj.filterType = 'EndsWith';
        atcObj.dataBind()
        e.keyCode = 76;
        atcObj.inputElement.value = 'K';
        atcObj.onInput(e);
        atcObj.onFilterUp(e);
        setTimeout(() => {
            let highlight: HTMLElement[] = atcObj.liCollections[0].querySelectorAll('.e-highlight');
            expect(highlight.length === 1).toBe(true);
            atcObj.hidePopup();
            done();
        }, 450);
    });
});
describe('EJ2-44363- When setting value dynamically in remote data, text is autofilled', () => {
    let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
    let dropDowns: any;
    let e: any = { preventDefault: function () { }, target: null };
    let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
    let countries: { [key: string]: Object }[] = [
        { "Name": "Australia", "Code": "AU" },
        { "Name": "Bermuda", "Code": "BM" },
        { "Name": "Canada", "Code": "CA" },
        { "Name": "Cameroon", "Code": "CM" },
        { "Name": "Denmark", "Code": "DK" },
        { "Name": "France", "Code": "FR" },
        { "Name": "Finland", "Code": "FI" },
        { "Name": "Germany", "Code": "DE" },
        { "Name": "Greenland", "Code": "GL" },
        { "Name": "Hong Kong", "Code": "HK" },
        { "Name": "Switzerland", "Code": "CH" },
        { "Name": "United Kingdom", "Code": "GB" },
        { "Name": "United States", "Code": "US" }
    ];
    beforeEach(() => {
        document.body.appendChild(element);
    });
    afterEach(() => {
        dropDowns.destroy();
        element.remove();
    });
    // it('custom value is set to the control with remote datasource', (done) => {
    //     let remoteData: DataManager = new DataManager({ url: "https://ej2services.syncfusion.com/production/web-services/api/Employees",
    //         adaptor: new ODataV4Adaptor, crossDomain: true });
    //     dropDowns = new AutoComplete({
    //         dataSource: remoteData,
    //         fields: { value: 'FirstName' },
    //         showPopupButton: true,
    //         suggestionCount: 5,
    //         query: new Query()
    //             .select(["FirstName", "EmployeeID"])
    //             .take(10)
    //             .requiresCount(),
    //         sortOrder: "Ascending",
    //         autofill: true,
    //         filterType: "StartsWith"
    //     });
    //     dropDowns.appendTo(element);
    //     dropDowns.value = "a";
    //     dropDowns.dataBind();
    //     setTimeout(() => {
    //         expect(dropDowns.inputElement.value).toBe("a");
    //         done();
    //     }, 800);
    // });
    it('custom value is set to the control with local datasource', (done) => {
        dropDowns = new AutoComplete({
            dataSource: countries,
            fields: { value: "Name" },
            placeholder: "e.g. Australia",
            sortOrder: "Ascending",
            filterType: "StartsWith",
            autofill: true
        });
        dropDowns.appendTo(element);
        dropDowns.value = "a";
        dropDowns.dataBind();
        setTimeout(() => {
            expect(dropDowns.inputElement.value).toBe("a");
            done();
        }, 800);
    });
});
describe('EJ2-48321 - Need to trigger filtering event when clear the typed text using clear icon', () => {
    let element: HTMLInputElement;
    let atcObj: any;
    let e: any = { preventDefault: function () { }, target: null, type: null, action: 'down' };
    let isFiltered: boolean = false;
    let isPopupOpened: boolean = false;
    let isPopupClosed: boolean = false;
    beforeAll(() => {
        element = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        document.body.appendChild(element);
    });
    afterAll(() => {
        document.body.innerHTML = '';
        if (element) {
            element.remove();
        };
    });
    it('Testing filter event triggering while click the clear icon for popup open case', (done) => {
        atcObj = new AutoComplete({
            dataSource: languageData,
            fields: { value: 'text' },
            showClearButton : true,
            allowFiltering : true,
            filtering : function(e: any) {
                isFiltered = true;
                expect(!isNullOrUndefined(e.text)).toBe(true);
            },
            open : function(e: any) {
                isPopupOpened = true;
            },
            close : function(e: any) {
                isPopupClosed = true;
            }
        });
        atcObj.appendTo(element);
        e.keyCode = 74;
        atcObj.inputElement.value = 'J';
        atcObj.onInput(e);
        atcObj.onFilterUp(e);
        expect(isFiltered).toBe(true);
        isFiltered = false;
        setTimeout(() => {
            expect(isPopupOpened).toBe(true);
            isPopupOpened = false;
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            atcObj.inputWrapper.clearButton.dispatchEvent(clickEvent);
            expect(isFiltered).toBe(true);
            isFiltered = false;
            expect(isPopupClosed).toBe(true);
            isPopupClosed = false;
            atcObj.destroy();
            done();
        }, 450)
    });
    it('Testing filter event triggering while click the clear icon for popup close case', (done) => {
        atcObj = new AutoComplete({
            dataSource: languageData,
            fields: { value: 'text' },
            showClearButton : true,
            allowFiltering : true,
            filtering : function(e: any) {
                isFiltered = true;
                expect(!isNullOrUndefined(e.text)).toBe(true);
            },
            open : function(e: any) {
                isPopupOpened = true;
            },
            close : function(e: any) {
                isPopupClosed = true;
            }
        });
        atcObj.appendTo(element);
        e.keyCode = 74;
        atcObj.inputElement.value = 'J';
        atcObj.onInput(e);
        atcObj.onFilterUp(e);
        expect(isFiltered).toBe(true);
        isFiltered = false;
        expect(isPopupOpened).toBe(true);
        isPopupOpened = false;
        atcObj.hidePopup();
        setTimeout(() => {
            expect(isPopupClosed).toBe(true);
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            atcObj.inputWrapper.clearButton.dispatchEvent(clickEvent);
            expect(isFiltered).toBe(true);
            expect(isPopupOpened).toBe(false);
            atcObj.destroy();
            done();
        }, 450)
    });
});
describe('EJ2-48529 - Filtering is not firing while remove the last letter while popup is closed', () => {
    let element: HTMLInputElement;
    let atcObj: any;
    let e: any = { preventDefault: function () { }, target: null, type: null, action: 'down' };
    let isFiltered: boolean = false;
    let isPopupOpened: boolean = false;
    let isPopupClosed: boolean = false;
    beforeAll(() => {
        element = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        document.body.appendChild(element);
    });
    afterAll(() => {
        document.body.innerHTML = '';
        if (element) {
            element.remove();
        };
    });
    it('Testing filter event triggering while remove the last letter using keyboard while popup is in closed state', (done) => {
        atcObj = new AutoComplete({
            dataSource: languageData,
            fields: { value: 'text' },
            showClearButton : true,
            allowFiltering : true,
            filtering : function(e: any) {
                isFiltered = true;
                expect(!isNullOrUndefined(e.text)).toBe(true);
            },
            open : function(e: any) {
                isPopupOpened = true;
            },
            close : function(e: any) {
                isPopupClosed = true;
            }
        });
        atcObj.appendTo(element);
        e.keyCode = 74;
        atcObj.inputElement.value = 'J';
        atcObj.onInput(e);
        atcObj.onFilterUp(e);
        expect(isFiltered).toBe(true);
        isFiltered = false;
        expect(isPopupOpened).toBe(true);
        isPopupOpened = false;
        atcObj.hidePopup();
        setTimeout(() => {
            expect(isPopupClosed).toBe(true);
            e.keyCode = 8;
            atcObj.inputElement.value = '';
            atcObj.onInput(e);
            atcObj.onFilterUp(e);
            expect(isFiltered).toBe(true);
            expect(isPopupOpened).toBe(false);
            atcObj.destroy();
            done();
        }, 450)
    });
    describe('EJ2-54666-While preventing the request to the server using actionBegin event throws console error', () => {
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
        it('actionBegin', () => {
            dropDowns = new AutoComplete({
                dataSource: sportsData,
                actionBegin: (e: any) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            e.type = 'keydown';
            e.action = 'down';
            dropDowns.keyActionHandler(e);
            expect(isNullOrUndefined(dropDowns.liCollections)).toBe(true);
        });
    });
    describe('EJ2-59078', () => {
        let dropDowns: any;
        let e: any = { preventDefault: function () { }, target: null, type: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let countries: { [key: string]: Object }[] = [
            { "Name": "*Australia", "Code": "AU" },
            { "Name": "Bermuda", "Code": "BM" },
            { "Name": "Canada.", "Code": "CA" },
            { "Name": "Cameroon", "Code": "CM" },
            { "Name": "Denmark", "Code": "DK" },
            { "Name": "France", "Code": "FR" },
            { "Name": "Finland", "Code": "FI" },
            { "Name": "Germany", "Code": "DE" },
            { "Name": "Greenland", "Code": "GL" },
            { "Name": "Hong Kong", "Code": "HK" },
            { "Name": "Switzerland", "Code": "CH" },
            { "Name": "United Kingdom", "Code": "GB" },
            { "Name": "United States", "Code": "US" }
        ];
        beforeEach(() => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            dropDowns.destroy();
            element.remove();
        });
        it('Auto complete throws error when * is used in the search string', () => {
           dropDowns = new AutoComplete({
                dataSource: countries,
                fields: { value: 'Name' },
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = "*";
            e.keyCode = 56;
            dropDowns.onInput(e);
            dropDowns.onFilterUp(e);
            expect(dropDowns.inputElement.value).toBe("*");
            expect(dropDowns.ulElement.children[0].textContent).toBe("*Australia");
            dropDowns.inputElement.value = ".";
            e.keyCode = 190;
            dropDowns.onInput(e);
            dropDowns.onFilterUp(e);
            expect(dropDowns.inputElement.value).toBe(".");
            expect(dropDowns.ulElement.children[0].textContent).toBe("Canada.");
        });
    });
});
