/**
 * ComboBox spec document
 */
import { createElement, isVisible, isNullOrUndefined, Browser, EmitType } from '@syncfusion/ej2-base';
import { ComboBox, CustomValueSpecifierEventArgs } from '../../src/combo-box/combo-box';
import { FilteringEventArgs } from '../../src/drop-down-base';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';

let languageData: { [key: string]: Object }[] = [
    { id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
    { id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'PYTHON' }, { id: 'list5', text: 'HTMLCSS' }];

describe('ComboBox', () => {
    let css: string = ".e-spinner-pane::after { content: 'Material'; display: none;} ";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);
    describe('Basic rendering', () => {
        let comboBoxObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'combobox' });
        beforeAll(() => {
            Browser.userAgent = navigator.userAgent;
            document.body.appendChild(element);
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' }
            });
            comboBoxObj.appendTo(element);
        });
        afterAll((done) => {
            comboBoxObj.destroy();
            setTimeout(() => {
                element.remove();
                done();
            })
        });

        it('check root component root class', () => {
            expect(comboBoxObj.inputElement.classList.contains('e-combobox')).toBe(true);
        });
        /**
         * tabIndex
         */
        it('tab index of focus element', () => {
            expect(comboBoxObj.inputElement.getAttribute('tabindex') === '0').toBe(true);
        });

        it('wai-aria attributes', () => {
            expect(comboBoxObj.inputElement.hasAttribute('readonly')).toBe(false);
            expect(comboBoxObj.inputElement.getAttribute('role')).toEqual('combobox');
            expect(comboBoxObj.inputElement.getAttribute('aria-autocomplete')).toEqual('both');
            expect(comboBoxObj.inputElement.getAttribute('aria-hasPopup')).toEqual('true');
            expect(comboBoxObj.inputElement.getAttribute('aria-expanded')).toEqual('false');
            expect(comboBoxObj.inputElement.getAttribute('aria-readonly')).toEqual('false');
        });
        it('keyboard attributes', () => {
            expect(comboBoxObj.inputElement.getAttribute('autocomplete')).toEqual('off');
            expect(comboBoxObj.inputElement.getAttribute('autocorrect')).toEqual('off');
            expect(comboBoxObj.inputElement.getAttribute('autocapitalize')).toEqual('off');
            expect(comboBoxObj.inputElement.getAttribute('spellcheck')).toEqual('false');
        });
        it('input element as active when focus', (done) => {
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = comboBoxObj.inputWrapper.buttons[0];
            comboBoxObj.dropDownClick(mouseEventArgs);
            setTimeout(() => {
                expect(comboBoxObj.isPopupOpen).toBe(true);
                expect(document.activeElement === comboBoxObj.inputElement).toBe(true);
                done();
            }, 450);
        });

    });

    describe('Custom value with initial rendering and dynamic change', () => {
        let comboBoxObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'combobox' });
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', keyCode: 72 };
        let languageData: { [key: string]: Object }[] = [
            { id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
            { id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'PYTHON' }, { id: 'list5', text: 'HTMLCSS' }];
        beforeEach(() => {
            Browser.userAgent = navigator.userAgent;
            document.body.appendChild(element);
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it(' value property -  custom value - not exist value  ', () => {
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: true,
                value: 'abc',
                fields: { text: 'text', value: 'id' }
            });
            comboBoxObj.appendTo(element);
            expect(comboBoxObj.inputElement.value).toBe('abc');
            expect(comboBoxObj.text).toBe('abc');
            expect(comboBoxObj.value).toBe('abc');
            expect(comboBoxObj.index).toBe(null);
        });
        it(' value property -  custom value - exist value  ', () => {
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: true,
                value: 'list1',
                fields: { text: 'text', value: 'id' }
            });
            comboBoxObj.appendTo(element);
            expect(comboBoxObj.inputElement.value).toBe('JAVA');
            expect(comboBoxObj.text).toBe('JAVA');
            expect(comboBoxObj.value).toBe('list1');
            expect(comboBoxObj.index).toBe(3);
        });
        it(' text property -  custom value - not exist text  ', () => {
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: true,
                text: 'abc',
                fields: { text: 'text', value: 'id' }
            });
            comboBoxObj.appendTo(element);
            expect(comboBoxObj.inputElement.value).toBe('abc');
            expect(comboBoxObj.text).toBe('abc');
            expect(comboBoxObj.value).toBe('abc');
            expect(comboBoxObj.index).toBe(null);
        });
        it(' text property -  custom value - exist text  ', () => {
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: true,
                text: 'JAVA',
                fields: { text: 'text', value: 'id' }
            });
            comboBoxObj.appendTo(element);
            expect(comboBoxObj.inputElement.value).toBe('JAVA');
            expect(comboBoxObj.text).toBe('JAVA');
            expect(comboBoxObj.value).toBe('list1');
            expect(comboBoxObj.index).toBe(3);
        });

        it(' value property - onPropertyChange - custom value - not exist value  ', () => {
            let changeAction: EmitType<Object> = jasmine.createSpy('Change');
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: true,
                fields: { text: 'text', value: 'id' },
                change: changeAction
            });
            comboBoxObj.appendTo(element);
            expect(changeAction).not.toHaveBeenCalled();
            comboBoxObj.value = 'abc';
            comboBoxObj.dataBind();
            expect(changeAction).toHaveBeenCalled();
            expect(comboBoxObj.inputElement.value).toBe('abc');
            expect(comboBoxObj.text).toBe('abc');
            expect(comboBoxObj.value).toBe('abc');
            expect(comboBoxObj.index).toBe(null);
        });
        it(' value property -  onPropertyChange - custom value - exist value  ', () => {
            let changeAction: EmitType<Object> = jasmine.createSpy('Change');
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: true,
                fields: { text: 'text', value: 'id' },
                change: changeAction
            });
            comboBoxObj.appendTo(element);
            expect(changeAction).not.toHaveBeenCalled();
            comboBoxObj.value = 'list1';
            comboBoxObj.dataBind();
            expect(changeAction).toHaveBeenCalled();
            expect(comboBoxObj.inputElement.value).toBe('JAVA');
            expect(comboBoxObj.text).toBe('JAVA');
            expect(comboBoxObj.value).toBe('list1');
            expect(comboBoxObj.index).toBe(3);
        });
        it(' text property - onPropertyChange custom value - not exist text  ', () => {
            let changeAction: EmitType<Object> = jasmine.createSpy('Change');
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: true,
                fields: { text: 'text', value: 'id' },
                change: changeAction
            });
            comboBoxObj.appendTo(element);
            expect(changeAction).not.toHaveBeenCalled();
            comboBoxObj.text = 'abc';
            comboBoxObj.dataBind();
            expect(changeAction).toHaveBeenCalled();
            expect(comboBoxObj.inputElement.value).toBe('abc');
            expect(comboBoxObj.text).toBe('abc');
            expect(comboBoxObj.value).toBe('abc');
            expect(comboBoxObj.index).toBe(null);
        });
        it(' text property - onPropertyChange custom value - exist text  ', () => {
            let changeAction: EmitType<Object> = jasmine.createSpy('Change');
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: true,
                fields: { text: 'text', value: 'id' },
                change: changeAction
            });
            comboBoxObj.appendTo(element);
            expect(changeAction).not.toHaveBeenCalled();
            comboBoxObj.text = 'JAVA';
            comboBoxObj.dataBind();
            expect(changeAction).toHaveBeenCalled();
            expect(comboBoxObj.inputElement.value).toBe('JAVA');
            expect(comboBoxObj.text).toBe('JAVA');
            expect(comboBoxObj.value).toBe('list1');
            expect(comboBoxObj.index).toBe(3);
        });

        it(' text property - not allowed the custom value when disabled the allowCustom property ', () => {
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: false,
                text: 'abc',
                fields: { text: 'text', value: 'id' }
            });
            comboBoxObj.appendTo(element);
            expect(comboBoxObj.inputElement.value).toBe('');
            expect(comboBoxObj.text).toBe(null);
            expect(comboBoxObj.value).toBe(null);
            expect(comboBoxObj.index).toBe(null);
        });

        it(' text property - onPropertyChange - not allowed the custom value when disabled the allowCustom property ', () => {
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: false,
                fields: { text: 'text', value: 'id' }
            });
            comboBoxObj.appendTo(element);
            comboBoxObj.text = 'abc';
            comboBoxObj.dataBind();
            expect(comboBoxObj.inputElement.value).toBe('');
            expect(comboBoxObj.text).toBe(null);
            expect(comboBoxObj.value).toBe(null);
            expect(comboBoxObj.index).toBe(null);
        });
        it(' value property - not allowed the custom value when disabled the allowCustom property ', () => {
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: false,
                value: 'abc',
                fields: { text: 'text', value: 'id' }
            });
            comboBoxObj.appendTo(element);
            expect(comboBoxObj.inputElement.value).toBe('');
            expect(comboBoxObj.text).toBe(null);
            expect(comboBoxObj.value).toBe(null);
            expect(comboBoxObj.index).toBe(null);
        });

        it(' text property - onPropertyChange - not allowed the custom value when disabled the allowCustom property ', () => {
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: false,
                fields: { text: 'text', value: 'id' }
            });
            comboBoxObj.appendTo(element);
            comboBoxObj.value = 'abc';
            comboBoxObj.dataBind();
            expect(comboBoxObj.inputElement.value).toBe('');
            expect(comboBoxObj.text).toBe(null);
            expect(comboBoxObj.value).toBe(null);
            expect(comboBoxObj.index).toBe(null);
        });
    });

    describe('Custom value with interaction', () => {
        let comboBoxObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'combobox' });
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', keyCode: 72 };
        beforeAll(() => {
            Browser.userAgent = navigator.userAgent;
            document.body.appendChild(element);
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowCustom: true,
                fields: { text: 'text', value: 'id' }
            });
            comboBoxObj.appendTo(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });
        it('custom value - not exist value  ', (done) => {
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.inputElement.value = 'abc';
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(keyEventArgs);
                comboBoxObj.hidePopup();
                setTimeout(() => {
                    expect(comboBoxObj.inputElement.value).toEqual('abc');
                    done();
                }, 450)
            }, 450)
        });
        it('custom value - exist value  ', (done) => {
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.inputElement.value = 'java';
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(keyEventArgs);
                comboBoxObj.hidePopup();
                setTimeout(() => {
                    expect(comboBoxObj.value === 'list1').toEqual(true);
                    done();
                }, 450)
            }, 450)
        });
        it('select an exist value in first list items', (done) => {
            comboBoxObj.showPopup();
            setTimeout(() => {
                let item: HTMLElement = comboBoxObj.list.querySelector('.e-active');
                expect(item.textContent === 'JAVA').toBe(true);
                done();
            }, 450)
        });

        it('clear custom value', (done) => {
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.inputElement.value = 'abc';
                comboBoxObj.allowCustom = false;
                comboBoxObj.dataBind();
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(keyEventArgs);
                comboBoxObj.hidePopup();
                setTimeout(() => {
                    expect(comboBoxObj.inputElement.value).toEqual('');
                    done();
                }, 450);
            }, 450);
        });

        it('custom value2', (done) => {
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.inputElement.value = 'HTML';
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(keyEventArgs);
                comboBoxObj.hidePopup();
                setTimeout(() => {
                    expect(comboBoxObj.inputElement.value).toEqual('HTML');
                    done();
                }, 450)
            }, 450)
        });

        it('custom value with escape key', (done) => {
            comboBoxObj.allowCustom = true;
            comboBoxObj.dataBind();
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.inputElement.value = 'abc';
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(keyEventArgs);
                keyEventArgs.type = 'keydown';
                keyEventArgs.action = 'down';
                comboBoxObj.keyActionHandler(keyEventArgs);
                keyEventArgs.action = 'escape';
                comboBoxObj.keyActionHandler(keyEventArgs);
                let item: Element = comboBoxObj.list.querySelector('.e-active');
                expect(isNullOrUndefined(item)).toBe(true);
                setTimeout(() => {
                    expect(comboBoxObj.inputElement.value).toEqual('abc');
                    expect(comboBoxObj.value !== 'abc').toBe(true);
                    expect(comboBoxObj.text !== 'abc').toBe(true);
                    keyEventArgs.action = 'tab';
                    comboBoxObj.keyActionHandler(keyEventArgs);
                    comboBoxObj.onBlur(keyEventArgs);
                    expect(comboBoxObj.value === 'abc').toBe(true);
                    expect(comboBoxObj.text === 'abc').toBe(true);
                    expect(comboBoxObj.index === null).toBe(true);
                    done();
                }, 450)
            }, 450)
        });
        it('update the model value after select a value when hide the popup ', (done) => {
            comboBoxObj.inputElement.value = '';
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(keyEventArgs);
            setTimeout(() => {
                keyEventArgs.action = 'down';
                keyEventArgs.type = 'keydown';
                comboBoxObj.keyActionHandler(keyEventArgs);
                comboBoxObj.hidePopup();
                setTimeout(() => {
                    expect(comboBoxObj.text === 'PHP').toBe(true);
                    expect(comboBoxObj.value === 'id2').toBe(true);
                    done();
                }, 450)
            }, 450)
        });
        it('focus the first item when click on clear button ', (done) => {
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.clear()
                setTimeout(() => {
                    expect(comboBoxObj.text === null).toBe(true);
                    expect(comboBoxObj.value === null).toBe(true);
                    let item: Element = comboBoxObj.list.querySelector('li');
                    expect(item.classList.contains('e-item-focus')).toBe(true);
                    done();
                }, 450)
            }, 450)
        });
        it('click on clear button when empty datasource', (done) => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, charCode: 70 };
            comboBoxObj.dataSource = [];
            comboBoxObj.onSearch(keyEventArgs);
            setTimeout(() => {
                comboBoxObj.clear();
                setTimeout(() => {
                    expect(comboBoxObj.text === null).toBe(true);
                    expect(comboBoxObj.value === null).toBe(true);
                    done();
                }, 450);
            }, 450);
        });
    });

    describe('Custom value with customValueSpecifier', () => {
        let comboBoxObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'combobox' });
        let data: { [key: string]: Object }[] = [{ id: 'id2', language: 'PHP' }, { id: 'id1', language: 'HTML' }, { id: 'id3', language: 'PERL' },
        { id: 'list1', language: 'JAVA' }, { id: 'list2', language: 'PYTHON' }, { id: 'list5', language: 'HTMLCSS' }];
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', keyCode: 72 };
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });

        it('set correct filed ', (done) => {
            comboBoxObj = new ComboBox({
                dataSource: data,
                allowCustom: true,
                fields: { text: 'language', value: 'id' },
                customValueSpecifier: (e: CustomValueSpecifierEventArgs) => {
                    e.item = { language: e.text + '.NET', id: 'net12' };
                }
            });
            comboBoxObj.appendTo(element);
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.inputElement.value = 'ASP';
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(keyEventArgs);
                comboBoxObj.hidePopup();
                setTimeout(() => {
                    expect(comboBoxObj.inputElement.value).toEqual('ASP.NET');
                    expect(comboBoxObj.value).toEqual('net12');
                    expect(comboBoxObj.text).toEqual('ASP.NET');
                    done();
                }, 450)
            }, 450)
        });
        it('set incorrect filed ', (done) => {
            comboBoxObj = new ComboBox({
                dataSource: data,
                allowCustom: true,
                fields: { text: 'language', value: 'id' },
                customValueSpecifier: (e: CustomValueSpecifierEventArgs) => {
                    e.item = { text: e.text + '.NET', id: 'net12' };
                }
            });
            comboBoxObj.appendTo(element);
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.inputElement.value = 'ASP';
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(keyEventArgs);
                comboBoxObj.hidePopup();
                setTimeout(() => {
                    expect(comboBoxObj.inputElement.value).toEqual('ASP');
                    expect(comboBoxObj.value).toEqual('ASP');
                    expect(comboBoxObj.text).toEqual('ASP');
                    done();
                }, 450)
            }, 450)
        });
    });

    describe('Readonly property', () => {
        let comboBoxObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'combobox' });
        beforeAll(() => {
            document.body.appendChild(element);
            comboBoxObj = new ComboBox({ dataSource: languageData, readonly: true, fields: { text: 'text', value: 'id' } });
            comboBoxObj.appendTo(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });
        /**
        * read only property
        */
        it('readonly ', (done) => {
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.readonly = false;
                comboBoxObj.dataBind();
                expect(comboBoxObj.element.hasAttribute('readonly')).toEqual(false);
                comboBoxObj.readonly = true;
                comboBoxObj.dataBind();
                expect(comboBoxObj.element.hasAttribute('readonly')).toEqual(true);
                comboBoxObj.hidePopup()
                setTimeout(() => {
                    expect(isVisible(comboBoxObj.popupObj.element)).toEqual(false);
                    done();
                }, 450);
            }, 450);
        })

    });

    // Method testing
    describe('method testing ', () => {
        let comboBoxObj: any;
        let element: HTMLInputElement;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'combobox' });
            document.body.appendChild(element);
            comboBoxObj = new ComboBox();
            comboBoxObj.appendTo(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });

        /**
         * getModuleName
         */
        it('getModuleName method', () => {
            let name: string = comboBoxObj.getModuleName();
            expect(name).toEqual('combobox');
        });

        /**
         * destroy
         */
        it('destroy method ', () => {
            comboBoxObj.destroy();
            expect(!!comboBoxObj.element.classList.contains('e-combobox')).toBe(false);
            document.body.innerHTML = '';
        });
    });
    // angular tag testing
    describe('Angular tag testing ', () => {
        let comboBoxObj: any;
        let element: any;
        beforeAll(() => {
            element = createElement('EJS-COMBOBOX', { id: 'combobox' });
            document.body.appendChild(element);
            comboBoxObj = new ComboBox({ dataSource: languageData });
            comboBoxObj.appendTo(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });
        it('Wrapper testing ', () => {
            expect(comboBoxObj.element.tagName).toEqual('EJS-COMBOBOX');
            expect(comboBoxObj.inputWrapper.container.parentElement).toBe(comboBoxObj.element);
        });
    });
    // Event testing
    describe('event testing ', () => {
        let comboBoxObj: any;
        let element: HTMLInputElement;
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let originalTimeout: number;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'combobox' });
            document.body.appendChild(element);
            comboBoxObj = new ComboBox({ dataSource: languageData, fields: { text: 'text', value: 'id' } });
            comboBoxObj.appendTo(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });
        it('mouse click on popup icon', (done) => {
            mouseEventArgs.target = comboBoxObj.inputWrapper.buttons[0];
            comboBoxObj.dropDownClick(mouseEventArgs);
            setTimeout(() => {
                expect(comboBoxObj.isPopupOpen).toBe(true);
                comboBoxObj.dropDownClick(mouseEventArgs);
                setTimeout(() => {
                    expect(document.activeElement.classList.contains('e-combobox')).toBe(true);
                    expect(comboBoxObj.isPopupOpen).toBe(false);
                    done();
                }, 450);
            }, 450);

        });
        it('mouse click on disabled input', (done) => {
            comboBoxObj.enabled = false;
            comboBoxObj.dataBind();
            comboBoxObj.dropDownClick(mouseEventArgs);
            setTimeout(() => {
                expect(comboBoxObj.isPopupOpen).toBe(false);
                done();
            }, 450);
        });
    });
    describe('Searching', () => {
        let originalTimeout: number;
        let comboBoxObj: any;
        let popupObj: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 74,
            metaKey: false
        };
        let activeElement: HTMLElement;
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ComboBox' });
        beforeAll(() => {
            document.body.appendChild(element);
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                fields: { value: 'id', text: 'text' },
                allowCustom: false

            });
            comboBoxObj.appendTo(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });
        it('Searching', (done) => {
            comboBoxObj.inputElement.value = 'h'
            comboBoxObj.showPopup();
            setTimeout(() => {
                e.key = 'H';
                e.keyCode = 72;
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(e);
                activeElement = comboBoxObj.list.querySelector('.e-item-focus');
                expect(activeElement.textContent).toBe('HTML');
                done();
            }, 450)
        });

        it('Searching empty string', (done) => {
            comboBoxObj.inputElement.value = '';
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(e);
                activeElement = comboBoxObj.list.querySelector('.e-item-focus');
                expect(activeElement.textContent).toBe('PHP');
                done();
            }, 450)
        });
        it('Searching and select it', (done) => {
            comboBoxObj.inputElement.value = 'h'
            comboBoxObj.showPopup();
            setTimeout(() => {
                e.keyCode = 72;
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(e);
                e.keyCode = 13;
                e.action = 'enter';
                e.type = 'keydown';
                comboBoxObj.keyActionHandler(e);
                expect(comboBoxObj.inputElement.value).toBe('HTML');
                e.type = undefined;
                done();
            }, 450)
        });
        it('Searching with unmatched item', (done) => {
            setTimeout(() => {
                comboBoxObj.inputElement.value = 'x';
                e.keyCode = 72;
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(e);
                setTimeout(() => {
                    e.keyCode = 13;
                    e.action = 'enter';
                    comboBoxObj.keyActionHandler(e);
                    expect(comboBoxObj.inputElement.value).toBe('');
                    done();
                }, 500);
            }, 450)
        });
        it('type delete key', (done) => {
            setTimeout(() => {
                comboBoxObj.inputElement.value = 'ht'
                comboBoxObj.showPopup();
                setTimeout(() => {
                    e.keyCode = 46;
                    comboBoxObj.onFilterDown(e);
                    comboBoxObj.onInput();
                    comboBoxObj.onFilterUp(e);
                    activeElement = comboBoxObj.list.querySelector('.e-item-focus');
                    expect(activeElement.textContent).toBe('HTML');
                    done();
                }, 450);
            }, 450);
        });
        it('clear text box value by delete and backspace key', () => {
            comboBoxObj.inputElement.value = ''
            e.keyCode = 8;
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            expect(isNullOrUndefined(comboBoxObj.value)).toBe(true);
        });
        it('type backspace key', () => {
            comboBoxObj.inputElement.value = 'ht'
            e.keyCode = 8;
            comboBoxObj.onFilterDown(e);
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            activeElement = comboBoxObj.list.querySelector('.e-item-focus');
            expect(activeElement.textContent).toBe('HTML');
        });

        it('select a first value when wrong value', () => {
            comboBoxObj.text = 'JAVA'
            comboBoxObj.dataBind();
            comboBoxObj.inputElement.value = 'JAVAa'
            e.keyCode = 74;
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            e.action = 'down';
            comboBoxObj.keyActionHandler(e);
            expect(comboBoxObj.text === 'PHP').toBe(true);
        });
        it('reset the model value while clear the selected value', () => {
            comboBoxObj.inputElement.value = '';
            e.keyCode = 74;
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            comboBoxObj.onBlur(keyEventArgs);
            expect(comboBoxObj.value === null).toBe(true);
            expect(comboBoxObj.text === null).toBe(true);
            expect(comboBoxObj.index === null).toBe(true);
        });

        it('delete the selected value', (done) => {
            comboBoxObj.inputElement.value = '';
            e.keyCode = 8;
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            setTimeout(() => {
                activeElement = comboBoxObj.list.querySelector('.e-item-focus');
                let selectElement: HTMLElement = comboBoxObj.list.querySelector('.e-active');
                expect(isNullOrUndefined(selectElement)).toBe(true);
                expect(activeElement.textContent).toBe('PHP');
                done()
            }, 450);
        });

        it('press tab key while open a popup', (done) => {
            e.keyCode = 9;
            comboBoxObj.onFilterDown(e);
            comboBoxObj.onFilterUp(e);
            e.action = 'close';
            comboBoxObj.keyActionHandler(e);
            setTimeout(() => {
                expect(comboBoxObj.isPopupOpen).toEqual(false);
                done();
            }, 450)
        });

        it('click on dropdown icon after press a delete key', (done) => {
            comboBoxObj.inputElement.value = ''
            e.keyCode = 8;
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            e.target = comboBoxObj.inputWrapper.buttons[0];
            comboBoxObj.dropDownClick(e);
            setTimeout(() => {
                expect(comboBoxObj.liCollections.length > 0).toBe(true);
                done();
            }, 450)
        });

        it('press tab key while hide a popup', (done) => {
            e.keyCode = 9;
            comboBoxObj.onFilterDown(e);
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            e.action = 'close';
            comboBoxObj.keyActionHandler(e);
            setTimeout(() => {
                expect(comboBoxObj.inputWrapper.container.classList.contains('e-input-focus')).toEqual(true);
                done();
            }, 450)
        });

        it('mobile layout - not open popup when typing', (done) => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            e.keyCode = 74;
            comboBoxObj.element.value = 'a';
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            setTimeout(() => {
                expect(comboBoxObj.isPopupOpen).toEqual(true);
                Browser.userAgent = navigator.userAgent;
                done();
            }, 450)
        });
    });
    describe('AutoFill', () => {
        let originalTimeout: number;
        let comboBoxObj: any;
        let popupObj: any;
        let keyEventArgs: any;
        let e: any = { preventDefault: function () { }, target: null, type: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ComboBox1' });
        beforeAll(() => {
            document.body.appendChild(element);
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                fields: { value: 'id', text: 'text' },
                autofill: true
            });
            comboBoxObj.appendTo(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });

        it('fill a first value in text box', (done) => {
            comboBoxObj.inputElement.value = 'h';
            comboBoxObj.showPopup();
            setTimeout(() => {
                e.key = 'H';
                e.keyCode = 72;
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(e);
                expect(comboBoxObj.inputElement.value).toBe('hTML');
                let item: Element = comboBoxObj.list.querySelector('.e-active')
                expect(item.textContent === 'HTML').toBe(true);
                done();
            }, 450)
        });

        it('select a first value in text box', (done) => {
            e.keyCode = 13;
            e.action = 'enter';
            comboBoxObj.keyActionHandler(e);
            setTimeout(() => {
                expect(comboBoxObj.inputElement.value).toBe('HTML');
                done();
            }, 450)
        });

        it('remove fill selection', (done) => {
            comboBoxObj.inputElement.value = 'h';
            comboBoxObj.showPopup();
            setTimeout(() => {
                e.key = 'H';
                e.keyCode = 72;
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(e);
                expect(comboBoxObj.inputElement.value).toBe('hTML');
                e.keyCode = 13;
                e.action = 'down';
                e.type = 'keydown';
                comboBoxObj.keyActionHandler(e);
                expect(comboBoxObj.inputElement.value).toBe('PERL');
                e.action = 'enter';
                comboBoxObj.keyActionHandler(e);
                setTimeout(() => {
                    expect(comboBoxObj.text).toBe('PERL');
                    done();
                }, 450);
            }, 450)
        });
        it('android mobile: fill a first value in text box', () => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            comboBoxObj.inputElement.value = '';
            e.keyCode = 229;
            comboBoxObj.onFilterDown(e);
            comboBoxObj.inputElement.value = 'ph';
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value === 'phP').toBe(true);
        });
        it('android mobile: remove the selection when press a backspace', () => {
            comboBoxObj.inputElement.value = 'ph';
            comboBoxObj.onFilterDown(e);
            comboBoxObj.inputElement.value = 'ph';
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value === 'ph').toBe(true);
        });
        it('android mobile: not fill when typing backspace', () => {
            comboBoxObj.inputElement.value = 'ph'
            e.keyCode = 229;
            comboBoxObj.onFilterDown(e);
            comboBoxObj.inputElement.value = 'p';
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value === 'p').toBe(true);
        });
        it('android mobile: not fill when typing backspace in worst case', () => {
            comboBoxObj.inputElement.value = 'ph'
            e.keyCode = 229;
            comboBoxObj.onFilterDown(e);
            comboBoxObj.inputElement.value = 'ph';
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value === 'ph').toBe(true);
            Browser.userAgent = navigator.userAgent;
        });
    });
    describe('Server filtering', () => {
        let comboBoxObj: any;
        let e: any = { preventDefault: function () { }, target: null, action: 'down', keyCode: 74 };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ComboBox' });
        beforeAll(() => {
            document.body.appendChild(element);
            let query = new Query();
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                fields: { value: 'id', text: 'text' },
                popupHeight: "200px",
                query: query.take(3),
                allowFiltering: true,
                filtering: function (e: FilteringEventArgs) {
                    let query = new Query();
                    query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                    e.updateData(languageData, query);
                }
            });
            comboBoxObj.appendTo(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });

        it('this.inputElement assign to this.filterInput', () => {
            expect(comboBoxObj.filterInput.classList.contains('e-combobox')).toEqual(true);
        });

        it('this.inputElement assign to this.filterInput in onPropertChanged', () => {
            comboBoxObj.allowFiltering = false;
            comboBoxObj.dataBind()
            comboBoxObj.allowFiltering = true;
            comboBoxObj.dataBind()
            expect(comboBoxObj.filterInput.classList.contains('e-combobox')).toEqual(true);
        });

        it('select a value with empty', (done) => {
            comboBoxObj.showPopup();
            setTimeout(() => {
                e.keyCode = 8;
                comboBoxObj.inputElement.value = ' ';
                comboBoxObj.onFilterDown(e);
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(e);
                let element: Element = comboBoxObj.ulElement.querySelector('li')
                expect(element.classList.contains('e-item-focus')).toEqual(true);
                comboBoxObj.hidePopup();
                setTimeout(() => {
                    expect(comboBoxObj.isPopupOpen).toEqual(false);
                    done();
                }, 450)
            }, 450)
        });
        it('update the model value of empty text', (done) => {
            comboBoxObj.index = 1;
            comboBoxObj.dataBind();
            comboBoxObj.showPopup();
            setTimeout(() => {
                e.keyCode = 8;
                comboBoxObj.inputElement.value = ' ';
                comboBoxObj.onFilterDown(e);
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(e);
                let element: Element = comboBoxObj.ulElement.querySelector('li')
                expect(element.classList.contains('e-item-focus')).toEqual(true);
                comboBoxObj.hidePopup();
                comboBoxObj.onBlur(e);
                setTimeout(() => {
                    expect(comboBoxObj.value === null).toBe(true);
                    expect(comboBoxObj.text === null).toBe(true);
                    done();
                }, 450)
            }, 450)
        });
        it('not focus any item in popup list', (done) => {
            comboBoxObj.allowCustom = true;
            comboBoxObj.dataBind();
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.inputElement.value = 'abc';
                comboBoxObj.onFilterDown(e);
                comboBoxObj.onInput();
                comboBoxObj.onFilterUp(e);
                let item: HTMLElement = comboBoxObj.popupObj.element.querySelector('.e-item-focus');
                expect(isNullOrUndefined(item)).toBe(true);
                done();
            }, 450)
        })
        it('remove the selection color when open the popup', (done) => {
            comboBoxObj.inputElement.value = '';
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            comboBoxObj.keyActionHandler(e);
            comboBoxObj.inputElement.value = 'abc';
            comboBoxObj.onInput();
            comboBoxObj.onFilterUp(e);
            comboBoxObj.hidePopup();
            setTimeout(() => {
                expect(comboBoxObj.value === 'abc').toBe(true);
                expect(comboBoxObj.text === 'abc').toBe(true);
                comboBoxObj.showPopup();
                setTimeout(() => {
                    let item: HTMLElement = comboBoxObj.popupObj.element.querySelector('.e-active');
                    expect(isNullOrUndefined(item)).toBe(true);
                    done();
                }, 450)
            }, 450)
        });

    });
    describe('Filtering in remote data', () => {
        let ddlObj: any;
        let element: HTMLInputElement;
        let data: DataManager = new DataManager({
            url: '/api/Employees',
            adaptor: new ODataV4Adaptor
        });
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 74
        };
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'combobox' });
            document.body.appendChild(element);
            ddlObj = new ComboBox({
                dataSource: data,
                fields: { value: 'EmployeeID', text: 'FirstName' },
                allowFiltering: true,
                filtering: function (e: FilteringEventArgs) {
                    let query = new Query();
                    query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                    e.updateData(data, query);
                }
            });
            ddlObj.appendTo('#combobox');
        });
        it('remote data filtering', (done) => {
            ddlObj.filterInput.value = "j";
            ddlObj.onInput();
            ddlObj.onFilterUp(keyEventArgs);
            setTimeout(() => {
                let liElement = ddlObj.list.querySelectorAll('li');
                expect(liElement.length > 0).toBe(true);
                done()
            }, 800);
        });
        afterAll(() => {
            ddlObj.destroy();
            element.remove();
        });
    });
    describe('Dynamic Filtering in remote data', () => {
        let ddlObj: any;
        let element: HTMLInputElement;
        let data: DataManager = new DataManager({
            url: '/api/Employees',
            adaptor: new ODataV4Adaptor
        });
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 74
        };
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'combobox' });
            document.body.appendChild(element);
            ddlObj = new ComboBox({
                dataSource: data,
                fields: { value: 'EmployeeID', text: 'FirstName' }
            });
            ddlObj.appendTo('#combobox');
        });
        it('remote data filtering', (done) => {
            ddlObj.actionComplete = function(e: { result :{ [key: string]: Object }[] }) {
                expect(e.result.length > 0).toBe(true);
                done();
            }
            ddlObj.allowFiltering = true;
        });
        afterAll(() => {
            ddlObj.destroy();
            element.remove();
        });
    });
    // Component Focus
    describe('Component Focus ', () => {
        let comboBoxObj: any;
        let element: any;
        let e: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            element = createElement('input', { id: 'combobox' });
            document.body.appendChild(element);
            comboBoxObj = new ComboBox({ dataSource: languageData });
            comboBoxObj.appendTo(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });

        it('focus event when click on input', () => {
            comboBoxObj.inputElement.focus();
            comboBoxObj.targetFocus();
            expect(comboBoxObj.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
            expect(document.activeElement === comboBoxObj.inputElement).toBe(true);
        });

        it('mobile layout focus event when click on input', () => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            comboBoxObj.inputElement.focus();
            comboBoxObj.targetFocus();
            expect(comboBoxObj.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
            expect(document.activeElement === comboBoxObj.inputElement).toBe(true);
        });

        it('mobile layout focus event when click on popup button', () => {
            e.target = comboBoxObj.inputWrapper.buttons[0];
            comboBoxObj.dropDownClick(e);
            expect(comboBoxObj.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
            expect(document.activeElement === comboBoxObj.inputWrapper.container).toBe(true);
            comboBoxObj.preventBlur(e);
            Browser.userAgent = navigator.userAgent;
            comboBoxObj.preventBlur(e);
        });
    });
    // Keyboard Interaction
    describe('key actions', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let list: any;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('input', { id: 'combobox' });
            document.body.appendChild(ele);
            list = new ComboBox({
                dataSource: languageData,
                fields: { text: 'text', value: 'id' },
                index: 1
            });
            list.appendTo(ele);
        });
        afterAll(() => {
            ele.remove();
            list.destroy();
            document.body.innerHTML = '';
        });
        /**
        * Home key without open popup
        */
        it("Home key without open popup", () => {
            let ele: Element = list.list;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            list.setSelection(li[3]);
            expect((li[3] as Element).classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'home';
            list.keyActionHandler(keyEventArgs);
            expect((li[3] as Element).classList.contains('e-active')).toBe(true);
        })
        /**
         * End key without open popup
         */
        it("End key without open popup", () => {
            let ele: Element = list.list;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            keyEventArgs.action = 'end';
            list.keyActionHandler(keyEventArgs);
            expect((li[3] as Element).classList.contains('e-active')).toBe(true);
        })
        /**
        * Home key with open popup
        */
        it("Home key with open popup", (done) => {
            list.showPopup();
            setTimeout(() => {
                let ele: Element = list.popupObj.element;
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
                list.setSelection(li[3]);
                expect((li[3] as Element).classList.contains('e-active')).toBe(true);
                keyEventArgs.action = 'home';
                list.keyActionHandler(keyEventArgs);
                expect((li[3] as Element).classList.contains('e-active')).toBe(true);
                done();
            }, 450);
        })
        /**
        * End key with open popup
        */
        it("End key with open popup", () => {
            let ele: Element = list.popupObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            list.setSelection(li[3]);
            expect((li[3] as Element).classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'end';
            list.keyActionHandler(keyEventArgs);
            expect((li[3] as Element).classList.contains('e-active')).toBe(true);
        })
    });
    describe('actionFailure event', () => {
        let listObj: any;
        let popupObj: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'combobox' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employee', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new ComboBox({ dataSource: remoteData, value: 1004, fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('no data text when ajax failure', (done) => {
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
        it(' press  escape key to close a popup ', (done) => {
            keyEventArgs.action = 'escape';
            keyEventArgs.type = 'keydown';
            listObj.keyActionHandler(keyEventArgs);
            setTimeout(() => {
                expect(listObj.isPopupOpen).toBe(false);
                done();
            }, 450);
        });
        it(' press tab key to close a popup ', (done) => {
            keyEventArgs.action = 'tab';
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.isPopupOpen).toBe(true);
                listObj.keyActionHandler(keyEventArgs);
                setTimeout(() => {
                    expect(listObj.isPopupOpen).toBe(false);
                    done();
                }, 450);
            }, 450);
        });
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
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ComboBox({
                dataSource: data, fields: { value: 'text' },
                popupHeight: '100px'
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
            list = new ComboBox({
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

        it('initially select the complex data of text fields', () => {
            expect(list.value === '001').toBe(true);
            expect(list.text === 'text1').toBe(true);
        });
        it('select the complex data of text fields while click on popup list', (done) => {
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
    describe('ignoreAccent support', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let comboObj: any;
        let activeElement: HTMLElement[];
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let data: string[] = ['Åland', ' à propos', 'abacá'];
        beforeAll(() => {
            document.body.appendChild(element);
            comboObj = new ComboBox({
                dataSource: data,
                ignoreAccent: true,
                allowFiltering: true
            });
            comboObj.appendTo(element);
        });
        afterAll(() => {
            comboObj.destroy();
            element.remove();
        });

        it('search diacritics data', (done) => {
            comboObj.showPopup();
            comboObj.filterInput.value = 'ä';
            keyEventArgs.keyCode = 67;
            comboObj.onInput();
            comboObj.onFilterUp(keyEventArgs);
            setTimeout(() => {
                let item: HTMLElement[] = comboObj.popupObj.element.querySelectorAll('li');
                expect(item.length === 2).toBe(true);
                mouseEventArgs.target = item[0];
                mouseEventArgs.type = 'click';
                comboObj.onMouseClick(mouseEventArgs);
                expect(comboObj.value === 'Åland').toBe(true);
                expect(comboObj.inputElement.value === 'Åland').toBe(true);
                comboObj.hidePopup();
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
            dropDowns = new ComboBox({
                dataSource: languageData,
                fields: { value: 'id', text: 'text' }
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
            dropDowns = new ComboBox({
                dataSource: languageData,
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
            dropDowns = new ComboBox({
                dataSource: remoteData,
                fields: { value: 'FirstName' },
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
            dropDowns = new ComboBox({
                dataSource: languageData,
                allowFiltering: true,
                fields: { value: 'id', text: 'text' },
                filtering: (e: FilteringEventArgs) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'java';
            e.keyCode = 72;
            dropDowns.onInput();
            dropDowns.onFilterUp(e);
            setTimeout(() => {
                expect(dropDowns.isPopupOpen).toBe(false);
                done();
            }, 500);
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
            dropDowns = new ComboBox({
                dataSource: remoteData,
                fields: { value: 'FirstName', text:'FirstName' },
                allowFiltering: true,
                actionComplete: (e: any) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'Nancy';
            e.keyCode = 72;
            dropDowns.onInput();
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
            dropDowns = new ComboBox({
                dataSource: languageData,
                allowFiltering: true,
                fields: <Object>{
                    value: 'text', text: 'text', itemCreated: (e: any) => {
                        if (count === 0) {
                            e.item.classList.add('e-disabled');
                        }
                    }
                }
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'P';
            e.keyCode = 72;
            dropDowns.onInput();
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
            dropDowns = new ComboBox({
                dataSource: languageData,
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
            dropDowns = new ComboBox({
                dataSource: languageData,
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
    describe('GetItems related bug', () => {
        let element: HTMLInputElement;
        let element1: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: ComboBox;
        let ddl1: ComboBox;
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
            ddl = new ComboBox({
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
            ddl = new ComboBox({
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
            ddl = new ComboBox({
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
            ddl = new ComboBox({
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
            ddl= new ComboBox({
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
    describe('Check Readonly focus issue', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: ComboBox;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            ddl = new ComboBox({
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
        let ddl: ComboBox;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            ddl = new ComboBox({
                dataSource: data,
                beforeOpen: (): void => {
                    expect(true).toBe(true);
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();
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
            ddl = new ComboBox({
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
            ddl = new ComboBox({
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
            ddl = new ComboBox({
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
});
