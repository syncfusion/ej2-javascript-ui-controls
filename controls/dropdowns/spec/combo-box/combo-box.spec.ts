/**
 * ComboBox spec document
 */
import { createElement, isVisible, isNullOrUndefined, Browser, EmitType } from '@syncfusion/ej2-base';
import { ComboBox, CustomValueSpecifierEventArgs } from '../../src/combo-box/combo-box';
import { ChangeEventArgs } from '../../src/drop-down-list/drop-down-list';
import { FilteringEventArgs, PopupEventArgs } from '../../src/drop-down-base';
import { DataManager, Query, ODataV4Adaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import  {profile , inMB, getMemoryProfile} from '../common/common.spec';

let languageData: { [key: string]: Object }[] = [
    { id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
    { id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'PYTHON' }, { id: 'list5', text: 'HTMLCSS' }];

describe('ComboBox', () => {
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
            expect(comboBoxObj.inputElement.getAttribute('aria-expanded')).toEqual('false');
            expect(comboBoxObj.inputElement.getAttribute('aria-readonly')).toEqual('false');
        });
        it('keyboard attributes', () => {
            expect(comboBoxObj.inputElement.getAttribute('autocomplete')).toEqual('off');
            expect(comboBoxObj.inputElement.getAttribute('autocapitalize')).toEqual('off');
            expect(comboBoxObj.inputElement.getAttribute('spellcheck')).toEqual('false');
        });
        it('input element as active when focus', () => {
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            mouseEventArgs.target = comboBoxObj.inputWrapper.buttons[0];
            comboBoxObj.dropDownClick(mouseEventArgs);
            expect(document.activeElement === comboBoxObj.inputElement).toBe(true);
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

    describe('Custom object value with preselect', () => {
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
                allowObjectBinding: true,
                value: { id: 'id7', text: 'REACT' },
                fields: { text: 'text', value: 'id' }
            });
            comboBoxObj.appendTo(element);
            expect(comboBoxObj.inputElement.value).toBe('REACT');
            expect(comboBoxObj.text).toBe('REACT');
            expect(comboBoxObj.index).toBe(null);
        });
    });

    describe('dynamic change', () => {
        let comboBoxObj: any;
        let popupObj: any;
        let originalTimeout: number;

        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'combobox' });
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', keyCode: 72 };
        let languageData: { [key: string]: Object }[] = [
            { id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
            { id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'PYTHON' }, { id: 'list5', text: 'HTMLCSS' }];
        beforeEach(() => {
            Browser.userAgent = navigator.userAgent;
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
            document.body.appendChild(element);
        });
        afterEach(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('value at dynamic changes with allowObjectBinding', (done) => {
            let changeAction: EmitType<Object> = jasmine.createSpy('Change');
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowObjectBinding: true,
                fields: { text: 'text', value: 'id' },
                change: changeAction
            });
            comboBoxObj.appendTo(element);
            comboBoxObj.value = { id: 'id1', text: 'HTML' };
            comboBoxObj.dataBind();
            setTimeout(() => { 
                expect(comboBoxObj.isObjectInArray({ id: "id1", text: "HTML" }, [comboBoxObj.value])).toBe(true)
                comboBoxObj.value = { id: 'list2', text: 'PYTHON' };
                setTimeout(() => {
                    expect(comboBoxObj.isObjectInArray({ id: 'list2', text: 'PYTHON' }, [comboBoxObj.value])).toBe(true)
                    expect(isNullOrUndefined(comboBoxObj.popupObj)).toBe(true);
                    done();
                }, 800);
            }, 800);
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
                comboBoxObj.onInput(keyEventArgs);
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
                comboBoxObj.onInput(keyEventArgs);
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

        it('customvalue with allowObjectBinding', (done) => {
            let changeAction: EmitType<Object> = jasmine.createSpy('Change');
            comboBoxObj = new ComboBox({
                dataSource: languageData,
                allowObjectBinding: true,
                allowCustom: true,
                fields: { text: 'text', value: 'id' },
            });
            comboBoxObj.appendTo(element);
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.inputElement.value = 'ASP';
                comboBoxObj.onInput(keyEventArgs);
                comboBoxObj.onFilterUp(keyEventArgs);
                comboBoxObj.hidePopup();
                setTimeout(() => {
                    expect(comboBoxObj.inputElement.value).toEqual('ASP');
                    expect(comboBoxObj.isObjectInArray({ id: "ASP", text: "ASP" }, [comboBoxObj.value])).toBe(true)
                    expect(comboBoxObj.text).toEqual('ASP');
                    done();
                }, 450)
            }, 450)
        });

        it('clear custom value', (done) => {
            comboBoxObj.allowObjectBinding = false;
            comboBoxObj.showPopup();
            setTimeout(() => {
                comboBoxObj.inputElement.value = 'abc';
                comboBoxObj.allowCustom = false;
                comboBoxObj.dataBind();
                comboBoxObj.onInput(keyEventArgs);
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
                comboBoxObj.onInput(keyEventArgs);
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
                comboBoxObj.onInput(keyEventArgs);
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
                    comboBoxObj.onBlurHandler(keyEventArgs);
                    expect(comboBoxObj.value === 'abc').toBe(true);
                    expect(comboBoxObj.text === 'abc').toBe(true);
                    expect(comboBoxObj.index === null).toBe(true);
                    done();
                }, 450)
                done();
            }, 450)
        });
        // it('update the model value after select a value when hide the popup ', (done) => {
        //     comboBoxObj.inputElement.value = '';
        //     comboBoxObj.onInput(keyEventArgs);
        //     comboBoxObj.onFilterUp(keyEventArgs);
        //     setTimeout(() => {
        //         keyEventArgs.action = 'down';
        //         keyEventArgs.type = 'keydown';
        //         comboBoxObj.keyActionHandler(keyEventArgs);
        //         comboBoxObj.hidePopup();
        //         setTimeout(() => {
        //             expect(comboBoxObj.text === 'PHP').toBe(true);
        //             expect(comboBoxObj.value === 'id2').toBe(true);
        //             done();
        //         }, 450)
        //     }, 450)
        // });
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
                comboBoxObj.onInput(keyEventArgs);
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
                comboBoxObj.onInput(keyEventArgs);
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

    describe('Setting fields value as null', () => {
        let comboBoxObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'combobox' });
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'tab', keyCode: 72 };
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });
        /**
        * read only property
        */
        it('Checking null value ', () => {
            comboBoxObj = new ComboBox({ fields: { text: null, value: null } });
            comboBoxObj.appendTo(element);
            comboBoxObj.onBlurHandler(keyEventArgs);
            expect(comboBoxObj.inputElement.value).toBe('');
        });
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
        it('mobile layout - not open popup when typing', (done) => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            e.keyCode = 74;
            comboBoxObj.element.value = 'a';
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            setTimeout(() => {
                expect(comboBoxObj.isPopupOpen).toEqual(true);
                Browser.userAgent = navigator.userAgent;
                done();
            }, 450)
        });
        it('Searching', (done) => {
            comboBoxObj.inputElement.value = 'h'
            comboBoxObj.showPopup();
            setTimeout(() => {
                e.key = 'H';
                e.keyCode = 72;
                comboBoxObj.onInput(e);
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
                comboBoxObj.onInput(e);
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
                comboBoxObj.onInput(e);
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
                comboBoxObj.onInput(e);
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
                    comboBoxObj.onInput(e);
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
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(isNullOrUndefined(comboBoxObj.value)).toBe(true);
        });
        it('type backspace key', () => {
            comboBoxObj.inputElement.value = 'ht'
            e.keyCode = 8;
            comboBoxObj.onFilterDown(e);
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            activeElement = comboBoxObj.list.querySelector('.e-item-focus');
            expect(activeElement.textContent).toBe('HTML');
        });

        it('select a first value when wrong value', () => {
            comboBoxObj.text = 'JAVA'
            comboBoxObj.dataBind();
            comboBoxObj.inputElement.value = 'JAVAa'
            e.keyCode = 74;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            e.action = 'down';
            comboBoxObj.keyActionHandler(e);
            expect(comboBoxObj.text === 'PHP').toBe(true);
        });
        it('reset the model value while clear the selected value', () => {
            comboBoxObj.inputElement.value = '';
            e.keyCode = 74;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            comboBoxObj.onBlurHandler(keyEventArgs);
            expect(comboBoxObj.value === null).toBe(true);
            expect(comboBoxObj.text === null).toBe(true);
            expect(comboBoxObj.index === null).toBe(true);
        });

        it('delete the selected value', (done) => {
            comboBoxObj.inputElement.value = '';
            e.keyCode = 8;
            comboBoxObj.onInput(e);
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
            comboBoxObj.onInput(e);
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
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            e.action = 'close';
            comboBoxObj.keyActionHandler(e);
            setTimeout(() => {
                expect(comboBoxObj.inputWrapper.container.classList.contains('e-input-focus')).toEqual(true);
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
                comboBoxObj.onInput(e);
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
            e.key = 'H';
            e.keyCode = 72;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            //expect(comboBoxObj.inputElement.value).toBe('hTML');
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
        });
        it('android mobile: fill a first value in text box', () => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            comboBoxObj.inputElement.value = '';
            e.keyCode = 229;
            comboBoxObj.onFilterDown(e);
            comboBoxObj.inputElement.value = 'ph';
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value === 'phP').toBe(true);
        });
        it('android mobile: remove the selection when press a backspace', () => {
            comboBoxObj.inputElement.value = 'ph';
            comboBoxObj.onFilterDown(e);
            comboBoxObj.inputElement.value = 'ph';
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value === 'ph').toBe(true);
        });
        it('android mobile: not fill when typing backspace', () => {
            comboBoxObj.inputElement.value = 'ph'
            e.keyCode = 229;
            comboBoxObj.onFilterDown(e);
            comboBoxObj.inputElement.value = 'p';
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value === 'p').toBe(true);
        });
        it('android mobile: not fill when typing backspace in worst case', () => {
            comboBoxObj.inputElement.value = 'ph'
            e.keyCode = 229;
            comboBoxObj.onFilterDown(e);
            comboBoxObj.inputElement.value = 'ph';
            comboBoxObj.onInput(e);
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
                comboBoxObj.onInput(e);
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
                comboBoxObj.onInput(e);
                comboBoxObj.onFilterUp(e);
                let element: Element = comboBoxObj.ulElement.querySelector('li')
                expect(element.classList.contains('e-item-focus')).toEqual(true);
                comboBoxObj.hidePopup();
                comboBoxObj.onBlurHandler(e);
                setTimeout(() => {
                    expect(comboBoxObj.value === ' ').toBe(true);
                    expect(comboBoxObj.text === ' ').toBe(true);
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
                comboBoxObj.onInput(e);
                comboBoxObj.onFilterUp(e);
                let item: HTMLElement = comboBoxObj.popupObj.element.querySelector('.e-item-focus');
                expect(isNullOrUndefined(item)).toBe(true);
                done();
            }, 450)
        })
        it('remove the selection color when open the popup', (done) => {
            comboBoxObj.inputElement.value = '';
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            comboBoxObj.keyActionHandler(e);
            comboBoxObj.inputElement.value = 'abc';
            comboBoxObj.onInput(e);
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
            url: 'https://services.syncfusion.com/js/production/api/Employees',
            adaptor: new WebApiAdaptor,
            crossDomain: true
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
            ddlObj.onInput(keyEventArgs);
            ddlObj.onFilterUp(keyEventArgs);
            setTimeout(() => {
                let liElement = ddlObj.list.querySelectorAll('li');
                //expect(liElement.length > 0).toBe(true);
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
        let originalTimeout: number;
        let data: DataManager = new DataManager({
            url: 'https://services.syncfusion.com/js/production/api/Employees',
            adaptor: new WebApiAdaptor,
            crossDomain: true
        });
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 74
        };
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
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
               // expect(e.result.length > 0).toBe(true);
                done();
            }
            ddlObj.allowFiltering = true;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
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
            comboObj.onInput(keyEventArgs);
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
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
            // originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            // jasmine.DEFAULT_TIMEOUT_INTERVAL = 13000;
        });
        afterAll(() => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            //console.log('timeout', jasmine.DEFAULT_TIMEOUT_INTERVAL);
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
            //expect(isDataBound).toBe(false);
            dropDowns.showPopup();
            setTimeout(() => {
                //expect(isDataBound).toBe(true);
                done();
            }, 450);
        });
        it(' trigger on remote data', (done) => {
            let remoteData: DataManager = new DataManager({
                url: 'https://services.syncfusion.com/js/production/api/Employees',
                adaptor: new WebApiAdaptor,
                crossDomain: true
            });
            let isDataBound: boolean = false;
            dropDowns = new ComboBox({
                dataSource: remoteData,
                fields: { value: 'FirstName' },
                dataBound: () => {
                    isDataBound = true;
                }
            });
            dropDowns.appendTo(element);
            //expect(isDataBound).toBe(false);
            dropDowns.showPopup();
            setTimeout(() => {
               // expect(isDataBound).toBe(true);
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
            dropDowns.onInput(e);
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
            let remoteData: DataManager = new DataManager({
                url: 'https://services.syncfusion.com/js/production/api/Employees',
                adaptor: new WebApiAdaptor,
                crossDomain: true
            });
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
            dropDowns.onInput(e);
            dropDowns.onFilterUp(e);
            setTimeout(() => {
               // expect(dropDowns.isPopupOpen).toBe(false);
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
    describe('EJ2-21994 - combobox ngModel value not updated when enable autofill and type text and press tab', () => {
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
        it('check blur event trigger', (done) => {
            ddl = new ComboBox({
                dataSource: empList,
                fields: { text: 'sports', value: 'id' },
                popupHeight: '300px',
                autofill: true,
                allowCustom:false,
                change: (args: ChangeEventArgs): void => {
                    expect(args.value).toBe('level5');
                    done();
                },
                open: (): void => {
                    keyEventArgs.action = 'tab';
                    (<any>ddl).keyActionHandler(keyEventArgs);
                    keyEventArgs.action = 'tab';
                    (<any>ddl).keyActionHandler(keyEventArgs);
                    setTimeout((): void => {
                        ddl.focusOut();
                    }, 300);
                }
            });
            ddl.appendTo(element);
            ddl.focusIn();
            (<any>ddl).inputElement.value = 'f';
            (<any>ddl).isValidKey = true;
            (<any>ddl).onFilterUp(keyEventArgs);
        });
    });

    describe('combobox with react template', () => {
        let ddlObj: any;
        let element: HTMLInputElement;
        let data: DataManager = new DataManager({
            url: 'https://services.syncfusion.com/js/production/api/Employees',
            adaptor: new WebApiAdaptor,
            crossDomain: true
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
            ddlObj.isReact = true;
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            ddlObj.dropDownClick(mouseEventArgs);
            ddlObj.filterInput.value = "j";
            ddlObj.onInput(keyEventArgs);
            ddlObj.onFilterUp(keyEventArgs);
            setTimeout(() => {
                let liElement = ddlObj.list.querySelectorAll('li');
                if(liElement && liElement.length > 0){
                    mouseEventArgs = { preventDefault: function () { }, target: liElement[0] };
                    ddlObj.onDocumentClick(mouseEventArgs);
                }
                done()
            }, 800);
        });
        afterAll(() => {
            ddlObj.destroy();
            element.remove();
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
        let listObj: ComboBox;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('form', { id: 'form1' });
            element.innerHTML = `<input type="text" id="ddl">
            <input type="reset" id="resetForm"/>`;
            document.body.appendChild(element);
            listObj = new ComboBox({
                dataSource: data,
                fields: { text: "text", value: "id" },
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
                expect((<any>listObj).inputElement.value === 'C#').toBe(true);
                done();
            });
        });
    });
    describe('EJ2-23514 - ComboBox item not selected when pre-selected item remove using clear button', () => {
        let element: HTMLInputElement;
        let empList: { [key: string]: Object }[] = [
            { id: 'level1', country: 'American Football' }, { id: 'level2', country: 'Badminton' },
            { id: 'level3', country: 'Basketball' }, { id: 'level4', country: 'Cricket' },
            { id: 'level5', country: 'Football' }, { id: 'level6', country: 'Golf' },
            { id: 'level7', country: 'Hockey' }, { id: 'level8', country: 'Rugby' },
            { id: 'level9', country: 'Snooker' }, { id: 'level10', country: 'Tennis' },
        ];
        let ddl: ComboBox;
        beforeAll((done) => {
            element = <HTMLInputElement>createElement('input', { id: 'games' });
            document.body.appendChild(element);
            ddl = new ComboBox({
                dataSource: empList,
                fields: { text: 'country', value: 'id' },
                placeholder: 'Select a game',
                sortOrder: 'Ascending',
                value: 'level4',
                popupHeight: '230px',
                allowFiltering: true
            });
            ddl.appendTo('#games');
            ddl.showPopup();
            setTimeout(() => {
                ddl.hidePopup();
                setTimeout(() => {
                    done();
                }, 200);
            }, 200);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('check blur event trigger', (done) => {
            ddl.open = (args: PopupEventArgs) : void => {
                expect(isNullOrUndefined(args.popup.element.querySelector('.e-active'))).toBe(true);
                done();
            }
            ddl.focusIn();
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            (<any>ddl).resetHandler(mouseEventArgs);
            ddl.showPopup();
        });
    });
    describe('filtering', () => {
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 74,
            metaKey: false
        };
        let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }];

        let datasource2: { [key: string]: Object }[] = [{ id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
            { id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'Phython' }, { id: 'list5', text: 'Oracle' }];
        let keyEvent: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let listObj: any;
        let element: HTMLInputElement;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
            listObj = new ComboBox({
                dataSource: datasource,
                fields: { text: "text", value: "id" },
                popupHeight: "200px",
                allowFiltering: true,
                filtering: function (e: FilteringEventArgs) {
                    let query = new Query();
                    query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                    listObj.filter(datasource2, query);
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
        });
        it('addItem ', () => {
            listObj.addItem({ id: 'list54', text: 'newitemss' }, 0);
            expect(listObj.list.querySelector('li').textContent).toBe('newitemss');
        })

        it('using filter method', (done) => {
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
    });
    describe('Disabled with showpopup public methpd', () => {
        let element: HTMLInputElement;
        let ddl: any;
        let empList: { [key: string]: Object }[] = [
            { id: 'level1', country: 'American Football' }, { id: 'level2', country: 'Badminton' },
            { id: 'level3', country: 'Basketball' }, { id: 'level4', country: 'Cricket' },
            { id: 'level5', country: 'Football' }, { id: 'level6', country: 'Golf' },
            { id: 'level7', country: 'Hockey' }, { id: 'level8', country: 'Rugby' },
            { id: 'level9', country: 'Snooker' }, { id: 'level10', country: 'Tennis' },
        ];
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, keyCode: 78, type: 'keyup' };
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('contains filtering', () => {
            ddl = new ComboBox({
                dataSource: empList,
                fields: { text: 'country', value: 'id' },
                placeholder: 'Select a customer',
                popupHeight: '230px',
                width: '350px',
                allowFiltering: true,
                filtering: function (e) {
                    let query = new Query().select(['country', 'id']);
                    query = (e.text !== '') ? query.where('country', 'contains', e.text, true) : query;
                    e.updateData(empList, query);
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();
            ddl.filterInput.value = 'n';
            ddl.onInput(keyEventArgs);
            ddl.onFilterUp(keyEventArgs);
            expect(ddl.popupObj.element.querySelector('.e-list-item').classList.contains('e-item-focus')).toBe(true);
            ddl.destroy();
        });
        it('endswith filtering', () => {
            ddl = new ComboBox({
                dataSource: empList,
                fields: { text: 'country', value: 'id' },
                placeholder: 'Select a customer',
                popupHeight: '230px',
                width: '350px',
                allowFiltering: true,
                filtering: function (e) {
                    let query = new Query().select(['country', 'id']);
                    query = (e.text !== '') ? query.where('country', 'contains', e.text, true) : query;
                    e.updateData(empList, query);
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();
            ddl.filterInput.value = 'n';
            ddl.onInput(keyEventArgs);
            ddl.onFilterUp(keyEventArgs);
            expect(ddl.popupObj.element.querySelector('.e-list-item').classList.contains('e-item-focus')).toBe(true);
        });
    });
    describe('EJ2-32775 ', () => {
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
        it('Empty Popup rendering issue testing ', () => {
            expect(comboBoxObj.element.tagName).toEqual('EJS-COMBOBOX');
            comboBoxObj.focusIn();
            comboBoxObj.focusOut();
            comboBoxObj.inputWrapper.container.querySelectorAll('.e-ddl-icon')[0].click();
            comboBoxObj.showPopup();
            expect(comboBoxObj.list.querySelectorAll('ul li').length > 0).toBe(true);
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
        let inputElement: HTMLElement = createElement('input', { id: 'combobox' });
        document.body.appendChild(inputElement);
    });
    afterEach(function () {
        if (listObj) {
            listObj.destroy();
            document.body.innerHTML = '';
        }
    });
    it('Entering the class name without any empty space', function () {
        listObj = new ComboBox({
            htmlAttributes: { class: 'custom-class' }
        });
        listObj.appendTo('#combobox');
        expect(listObj.inputWrapper.container.classList.contains('custom-class')).toBe(true);
    });
    it('Giving empty space before and after the class name', function () {
        listObj = new ComboBox({
            htmlAttributes: { class: ' custom-class ' }
        });
        listObj.appendTo('#combobox');
        expect(listObj.inputWrapper.container.classList.contains('custom-class')).toBe(true);
    });
    it('Giving more than one empty space between two class names', function () {
        listObj = new ComboBox({
            htmlAttributes: { class: 'custom-class-one      custom-class-two'}
        });
        listObj.appendTo('#combobox');
        expect(listObj.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        expect(listObj.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
    });
    it('Giving more than one empty space between two class names as well before and after the class name', function () {
        listObj = new ComboBox({
            htmlAttributes: {  class: ' custom-class-one       custom-class-two ' }
        });
        listObj.appendTo('#combobox');
        expect(listObj.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        expect(listObj.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
    });
    it('Giving only empty space  without entering any class Name', function () {
        listObj = new ComboBox({
        });
        listObj.appendTo('#combobox');
        let beforeAddClass = listObj.inputWrapper.container.classList.length;
        listObj.htmlAttributes = { class: '  ' };
        listObj.appendTo('#combobox');
        let AfterAddClass = listObj.inputWrapper.container.classList.length;
        expect(beforeAddClass == AfterAddClass).toBe(true);
    });
    it('Keep input as empty without entering any class Name', function () {
        listObj = new ComboBox({
        });
        listObj.appendTo('#combobox');
        let beforeAddClass = listObj.inputWrapper.container.classList.length;
        listObj.htmlAttributes = { class: '' };
        listObj.appendTo('#combobox');
        let AfterAddClass = listObj.inputWrapper.container.classList.length;
        expect(beforeAddClass == AfterAddClass).toBe(true);
    });

    it('Entering the class name without any empty space', function () {
        listObj = new ComboBox({
            cssClass: 'custom-class' 
        });
        listObj.appendTo('#combobox');
        expect(listObj.inputWrapper.container.classList.contains('custom-class')).toBe(true);
    });
    it('Giving empty space before and after the class name', function () {
        listObj = new ComboBox({
             cssClass: ' custom-class ' 
        });
        listObj.appendTo('#combobox');
        expect(listObj.inputWrapper.container.classList.contains('custom-class')).toBe(true);
    });
    it('Giving more than one empty space between two class names', function () {
        listObj = new ComboBox({
             cssClass: 'custom-class-one      custom-class-two'
        });
        listObj.appendTo('#combobox');
        expect(listObj.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        expect(listObj.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
    });
    it('Giving more than one empty space between two class names as well before and after the class name', function () {
        listObj = new ComboBox({
             cssClass: ' custom-class-one       custom-class-two ' 
        });
        listObj.appendTo('#combobox');
        expect(listObj.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        expect(listObj.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
    });
    it('Giving only empty space  without entering any class Name', function () {
        listObj = new ComboBox({
        });
        listObj.appendTo('#combobox');
        let beforeAddClass = listObj.inputWrapper.container.classList.length;
        listObj.cssClass =  '  ' ;
        listObj.appendTo('#combobox');
        let AfterAddClass = listObj.inputWrapper.container.classList.length;
        expect(beforeAddClass == AfterAddClass).toBe(true);
    });
    it('Keep input as empty without entering any class Name', function () {
        listObj = new ComboBox({
        });
        listObj.appendTo('#combobox');
        let beforeAddClass = listObj.inputWrapper.container.classList.length;
        listObj.cssClass =  '' ;
        listObj.appendTo('#combobox');
        let AfterAddClass = listObj.inputWrapper.container.classList.length;
        expect(beforeAddClass == AfterAddClass).toBe(true);
    });
    it('Giving class name with underscore in the beginning', function () {
        listObj = new ComboBox({
            htmlAttributes : { class : '  _custom-class-one  '},
            cssClass : '   _custom-class-two  '
        });
        listObj.appendTo('#combobox');
        expect(listObj.inputWrapper.container.classList.contains('_custom-class-one')).toBe(true);
        expect(listObj.inputWrapper.container.classList.contains('_custom-class-two')).toBe(true);
    });
    it('Giving class name with empty space in both cases seperatly', function () {
        listObj = new ComboBox({
            htmlAttributes : { class : '  custom-class-one  '},
            cssClass : '   custom-class-two  '
        });
        listObj.appendTo('#combobox');
        expect(listObj.inputWrapper.container.classList.contains('custom-class-one')).toBe(true);
        expect(listObj.inputWrapper.container.classList.contains('custom-class-two')).toBe(true);
    });   
});
describe('EJ2-43971 : After cleared the typed value, popup not shown the entire datasource with ng-template', () => {
    let comboBoxObj: any;
    let element: any;
    let keyEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
        keyCode: 74
    };
    let datasource: { [key: string]: Object }[] = [
        { Name: 'Mona Sak',  country: 'USA' },
        { Name: 'Kapil Sharma', country: 'USA' },
        { Name: 'Erik Linden',  country: 'England' },
        { Name: 'Kavi Tam',  country: 'England' },
        { Name: "Harish Sree",  country: 'USA' },
    ];

    beforeAll(() => {
        element = createElement('EJS-COMBOBOX', { id: 'combobox' });
        document.body.appendChild(element);
    });
    afterAll(() => {
        comboBoxObj.destroy();
        element.remove();
    });
    it('Checking the li element while open popup, after cleared the filtered value', () => {
        comboBoxObj = new ComboBox({
            dataSource: datasource,
            fields: { text: 'Name', value: 'country' },
            popupHeight: "200px",
            allowFiltering: true,
            showClearButton : true,
            itemTemplate: '<div class="ename"> ${Name}</div><div class="place"> ${country} </div>',
            filtering: function (e: FilteringEventArgs) {
                let query: Query = new Query();
                query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
                e.updateData(datasource, query);
            }
        });
        comboBoxObj.appendTo(element);
        expect(comboBoxObj.element.tagName).toEqual('EJS-COMBOBOX');
        comboBoxObj.filterInput.value = "e";
        comboBoxObj.onInput(keyEventArgs);
        comboBoxObj.onFilterUp(keyEventArgs);
        expect(comboBoxObj.list.querySelectorAll('li').length).toBe(1);
        comboBoxObj.onBlurHandler(keyEventArgs);
        comboBoxObj.clearAll();
        comboBoxObj.showPopup();
        expect(comboBoxObj.list.querySelectorAll('li').length > 0).toBe(true);
        expect(comboBoxObj.list.querySelectorAll('li')[0].textContent === '').toBe(false);
        comboBoxObj.addItem({ country: 'USA', Name: 'Robert King' }, 0);
        comboBoxObj.addItem({ country: 'USA', Name: 'Nancy Davolio' });
        expect(comboBoxObj.list.querySelectorAll('li').length > 0).toBe(true);
        expect(comboBoxObj.list.querySelectorAll('li')[0].textContent === '').toBe(false);
        comboBoxObj.hidePopup();
    });
});
describe(' EJ2-47195 ', () => {
    let comboBoxObj: any;
    let element: HTMLElement;
    let keyEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
        keyCode: 74
    };
    let mouseEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
        target: null
    };
    let empList: { [key: string]: Object }[] = [
        { Name: 'Mona Sak',  country: 'USA' },
        { Name: 'Kapil Sharma', country: 'Germany' },
        { Name: 'Erik Linden',  country: 'England' },
        { Name: 'Kavi Tam',  country: 'Italy' },
        { Name: "Harish Sree",  country: 'India' },
    ];
    beforeAll(() => {
        element = createElement('input', { id: 'combobox' });
        document.body.appendChild(element);
    });
    afterAll(() => {
        if (comboBoxObj) {
            comboBoxObj.destroy();
            element.remove();
            document.body.innerHTML = '';
        }
    });
    it('Update Data source while rendering then filtering value', () => {
        comboBoxObj = new ComboBox({
            dataSource: empList,
            fields: { text: 'Name', value: 'country' },
            popupHeight: "200px",
            allowFiltering: true,
            showClearButton : true,
            itemTemplate: '<div class="ename"> ${Name}</div><div class="place"> ${country} </div>',
        });
        comboBoxObj.appendTo('#combobox');
        comboBoxObj.inputElement.value = "e";
        comboBoxObj.onInput(keyEventArgs);
        comboBoxObj.onFilterUp(keyEventArgs);
        expect(comboBoxObj.list.querySelectorAll('li').length).toBe(1);
        comboBoxObj.hidePopup();
    });
    it('Update Data source as dynamic then filtering value', () => {
        comboBoxObj = new ComboBox({
            fields: { text: 'Name', value: 'country' },
            popupHeight: "200px",
            allowFiltering: true,
            showClearButton : true,
            itemTemplate: '<div class="ename"> ${Name}</div><div class="place"> ${country} </div>',
        });
        comboBoxObj.appendTo('#combobox');
        comboBoxObj.dataSource = empList;
        comboBoxObj.dataBind();
        comboBoxObj.inputElement.value = "e";
        comboBoxObj.onInput(keyEventArgs);
        comboBoxObj.onFilterUp(keyEventArgs);
        expect(comboBoxObj.list.querySelectorAll('li').length).toBe(1);
        comboBoxObj.hidePopup();
    });
    it('Update Data source while rendering then open popup', () => {
        comboBoxObj = new ComboBox({
            dataSource: empList,
            fields: { text: 'Name', value: 'country' },
            popupHeight: "200px",
            allowFiltering: true,
            showClearButton : true,
            itemTemplate: '<div class="ename"> ${Name}</div><div class="place"> ${country} </div>',
        });
        comboBoxObj.appendTo('#combobox');
        comboBoxObj.showPopup();
        expect(comboBoxObj.list.querySelectorAll('li').length).toBe(5);
        comboBoxObj.hidePopup();
    });
    it('Update Data source as dynamic then open popup', () => {
        comboBoxObj = new ComboBox({
            fields: { text: 'Name', value: 'country' },
            popupHeight: "200px",
            allowFiltering: true,
            showClearButton : true,
            itemTemplate: '<div class="ename"> ${Name}</div><div class="place"> ${country} </div>',
        });
        comboBoxObj.appendTo('#combobox');
        comboBoxObj.dataSource = empList;
        comboBoxObj.dataBind();
        comboBoxObj.showPopup();
        expect(comboBoxObj.list.querySelectorAll('li').length).toBe(5);
        comboBoxObj.hidePopup();
    });
    it('Update Data source while rendering and testing that all data are loaded after filtering', () => {
        comboBoxObj = new ComboBox({
            dataSource: empList,
            fields: { text: 'Name', value: 'country' },
            popupHeight: "200px",
            allowFiltering: true,
            showClearButton : true,
            itemTemplate: '<div class="ename"> ${Name}</div><div class="place"> ${country} </div>',
        });
        comboBoxObj.appendTo('#combobox');
        comboBoxObj.inputElement.value = "e";
        comboBoxObj.onInput(keyEventArgs);
        comboBoxObj.onFilterUp(keyEventArgs);
        expect(comboBoxObj.list.querySelectorAll('li').length).toBe(1);
        let item: HTMLElement[] = comboBoxObj.popupObj.element.querySelectorAll('li')[0];
        mouseEventArgs.target = item;
        mouseEventArgs.type = 'click';
        comboBoxObj.onMouseClick(mouseEventArgs);
        comboBoxObj.showPopup();
        expect(comboBoxObj.list.querySelectorAll('li').length).toBe(5);
        comboBoxObj.hidePopup();
    });
    it('Update Data source as dynamic and testing that all data are loaded after filtering', () => {
        comboBoxObj = new ComboBox({
            fields: { text: 'Name', value: 'country' },
            popupHeight: "200px",
            allowFiltering: true,
            showClearButton : true,
            itemTemplate: '<div class="ename"> ${Name}</div><div class="place"> ${country} </div>',
        });
        comboBoxObj.appendTo('#combobox');
        comboBoxObj.dataSource = empList;
        comboBoxObj.dataBind();
        comboBoxObj.inputElement.value = "e";
        comboBoxObj.onInput(keyEventArgs);
        comboBoxObj.onFilterUp(keyEventArgs);
        expect(comboBoxObj.list.querySelectorAll('li').length).toBe(1);
        let item: HTMLElement[] = comboBoxObj.popupObj.element.querySelectorAll('li')[0];
        mouseEventArgs.target = item;
        mouseEventArgs.type = 'click';
        comboBoxObj.onMouseClick(mouseEventArgs);
        comboBoxObj.showPopup();
        expect(comboBoxObj.list.querySelectorAll('li').length).toBe(5);
        comboBoxObj.hidePopup();
    });
    it('Update Data source as dynamic and testing dynamic value update', () => {
        comboBoxObj = new ComboBox({
            fields: { text: 'Name', value: 'country' },
            popupHeight: "200px",
            allowFiltering: true,
            showClearButton : true,
            itemTemplate: '<div class="ename"> ${Name}</div><div class="place"> ${country} </div>',
        });
        comboBoxObj.appendTo('#combobox');
        comboBoxObj.dataSource = empList;
        comboBoxObj.dataBind();
        comboBoxObj.inputElement.value = "e";
        comboBoxObj.onInput(keyEventArgs);
        comboBoxObj.onFilterUp(keyEventArgs);
        expect(comboBoxObj.list.querySelectorAll('li').length).toBe(1);
        let item: HTMLElement[] = comboBoxObj.popupObj.element.querySelectorAll('li')[0];
        mouseEventArgs.target = item;
        mouseEventArgs.type = 'click';
        comboBoxObj.onMouseClick(mouseEventArgs);
        comboBoxObj.showPopup();
        comboBoxObj.value = 'India';
        comboBoxObj.dataBind();
        expect(comboBoxObj.inputElement.value).toBe("Harish Sree");
        comboBoxObj.showPopup();
        expect(comboBoxObj.list.querySelectorAll('li').length).toBe(5);
        comboBoxObj.hidePopup();
    });
});
describe('EJ2-48321 - Need to trigger filtering event when clear the typed text using clear icon', () => {
    let element: HTMLInputElement;
    let comboBoxObj: any;
    let e: any = { preventDefault: function () { }, target: null, type: null, action: 'down' };
    let isFiltered: boolean = false;
    let isPopupOpened: boolean = false;
    let isPopupClosed: boolean = false;
    beforeAll(() => {
        element = <HTMLInputElement>createElement('input', { id: 'combobox' });
        document.body.appendChild(element);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('Testing filter event triggering while click the clear icon while popup is in open state', (done) => {
        comboBoxObj = new ComboBox({
            dataSource: languageData,
            fields: { value: 'text',text : 'text' },
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
        comboBoxObj.appendTo(element);
        e.keyCode = 74;
        comboBoxObj.inputElement.value = 'J';
        comboBoxObj.onInput(e);
        comboBoxObj.onFilterUp(e);
        expect(isFiltered).toBe(true);
        isFiltered = false;
        setTimeout(() => {
            expect(isPopupOpened).toBe(true);
            isPopupOpened = false;
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            comboBoxObj.inputWrapper.clearButton.dispatchEvent(clickEvent);
            expect(isFiltered).toBe(true);
            isFiltered = false;
            expect(isPopupClosed).toBe(false);
            comboBoxObj.hidePopup();
            expect(isPopupClosed).toBe(true);
            isPopupClosed = false;
            comboBoxObj.destroy();
            done();
        }, 450)
    });
    it('Testing filter event triggering while click the clear icon while popup is in closed state', (done) => {
        comboBoxObj = new ComboBox({
            dataSource: languageData,
            fields: { value: 'text',text : 'text' },
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
        comboBoxObj.appendTo(element);
        e.keyCode = 74;
        comboBoxObj.inputElement.value = 'J';
        comboBoxObj.onInput(e);
        comboBoxObj.onFilterUp(e);
        expect(isFiltered).toBe(true);
        isFiltered = false;
        expect(isPopupOpened).toBe(true);
        isPopupOpened = false;
        comboBoxObj.hidePopup();
        setTimeout(() => {
            expect(isPopupClosed).toBe(true);
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            comboBoxObj.inputWrapper.clearButton.dispatchEvent(clickEvent);
            expect(isFiltered).toBe(true);
            expect(isPopupOpened).toBe(false);
            comboBoxObj.destroy();
            done();
        }, 450)
    });
});
describe('EJ2-48529 - Filtering is not firing while remove the last letter in popup closed state', () => {
    let element: HTMLInputElement;
    let comboBoxObj: any;
    let e: any = { preventDefault: function () { }, target: null, type: null, action: 'down' };
    let isFiltered: boolean = false;
    let isPopupOpened: boolean = false;
    let isPopupClosed: boolean = false;
    beforeAll(() => {
        element = <HTMLInputElement>createElement('input', { id: 'combobox' });
        document.body.appendChild(element);
    });
    afterAll(() => {
        document.body.innerHTML = '';
    });
    it('Testing filter event triggering while remove the last letter using keyboard in popup closed state', (done) => {
        comboBoxObj = new ComboBox({
            dataSource: languageData,
            fields: { value: 'text',text : 'text' },
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
        comboBoxObj.appendTo(element);
        e.keyCode = 74;
        comboBoxObj.inputElement.value = 'J';
        comboBoxObj.onInput(e);
        comboBoxObj.onFilterUp(e);
        expect(isFiltered).toBe(true);
        isFiltered = false;
        expect(isPopupOpened).toBe(true);
        isPopupOpened = false;
        comboBoxObj.hidePopup();
        setTimeout(() => {
            expect(isPopupClosed).toBe(true);
            e.keyCode = 8;
            comboBoxObj.inputElement.value = '';
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(isFiltered).toBe(true);
            expect(isPopupOpened).toBe(false);
            comboBoxObj.destroy();
            done();
        }, 450)
    });
});
describe('EJ2MVC-335 - Value updated incorrectly for autofill true case', () => {
    let element: HTMLInputElement;
    let keyEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
        keyCode: 74
    };
    let keyEventArguments: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', keyCode: 40 };
    let gameList: { [key: string]: Object }[] = [
        {  Id : "Game1", Game :"22"  },
        {  Id : "22", Game : "Tennis" },
        {  Id:  "Game3", Game :"Basketball" },
    ];
    let comboBox: any;
    beforeAll(() => {
        element = <HTMLInputElement>createElement('input', { id: 'combBox' });
        document.body.appendChild(element);
    });
    afterAll(() => {
        document.body.innerHTML = '';
        if (element) {
            element.remove();
        }
    });
    it('check the value update for autofill case while typing text in the control', () => {
        comboBox = new ComboBox({
            dataSource: gameList,
            fields: { text: 'Game', value: 'Id'},
            autofill : true,
        });
        comboBox.appendTo(element);
        keyEventArguments.type = 'keydown';
        keyEventArguments.action = 'down';
        comboBox.keyActionHandler(keyEventArguments);
        comboBox.inputElement.value = "2";
        comboBox.onInput(keyEventArgs);
        comboBox.onFilterUp(keyEventArgs);
        comboBox.focusOut();
        expect(comboBox.text).toBe("22");
        expect(comboBox.value).toBe("Game1");
        comboBox.hidePopup();
        comboBox.destroy();    
    });
    it('check the value update while navigating in the popup for autofill case', () => {
        comboBox = new ComboBox({
            dataSource: gameList,
            fields: { text: 'Game', value: 'Id'},
            autofill : true,
        });
        comboBox.appendTo(element);
        comboBox.showPopup();
        keyEventArguments.type = 'keydown';
        keyEventArguments.action = 'down';
        comboBox.keyActionHandler(keyEventArguments);
        comboBox.focusOut();
        expect(comboBox.text).toBe("22");
        expect(comboBox.value).toBe("Game1");
        comboBox.hidePopup();
        comboBox.destroy();    
    });
    describe('EJ2-58878', () => {
        let comboBoxObj: any;
        let element: any;
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 74
        };
        let data: { [key: string]: Object }[] = [
            {
              Name: 'Andrew Fuller',
              Eimg: '7',
              Designation: 'Team Lead',
              Country: 'England',
            },
            {
              Name: 'Anne Dodsworth',
              Eimg: '1',
              Designation: 'Developer',
              Country: 'USA',
            },
            { Name: 'Aanet Leverling', 
              Eimg: '3',
              Designation: 'HR', 
              Country: 'USA' 
            },
            {
              Name: 'Laura Callahan',
              Eimg: '2',
              Designation: 'Product Manager',
              Country: 'USA',
            },
            {
              Name: 'Margaret Peacock',
              Eimg: '6',
              Designation: 'Developer',
              Country: 'USA',
            },
            {
              Name: 'Aichael Suyama',
              Eimg: '9',
              Designation: 'Team Lead',
              Country: 'USA',
            },
            {
              Name: 'Nancy Davolio',
              Eimg: '4',
              Designation: 'Product Manager',
              Country: 'USA',
            },
            {
              Name: 'Robert King',
              Eimg: '8',
              Designation: 'Developer ',
              Country: 'England',
            },
            {
              Name: 'Steven Buchanan',
              Eimg: '10',
              Designation: 'CEO',
              Country: 'England',
            },
          ];
        beforeAll(() => {
            element = createElement('EJS-COMBOBOX', { id: 'combobox' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });
        it('Newly added data not displayed in the popup element, when item template is used', () => {
            comboBoxObj = new ComboBox({
                dataSource: data,
                fields: { text: 'Name', value: 'Eimg' },
                placeholder: "Find a country",
                popupHeight: '250px',
                itemTemplate: '<div>${Name}</div>',
                allowFiltering: true,
                autofill: true,
                showClearButton: true,
                change: function (args: any) {
                    if (args.value === null) {
                        comboBoxObj.addItem({
                            Name: 'Raveen Kumar',
                            Eimg: 'DL',
                            Designation: 'CEO',
                            Country: 'England',
                        });
                        comboBoxObj.dataBind();
                    }
                },
            });
            comboBoxObj.appendTo(element);
            (<any>comboBoxObj).showPopup();
            let list: Array<HTMLElement> = (<any>comboBoxObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[2];
            mouseEventArgs.type = 'click';
            (<any>comboBoxObj).onMouseClick(mouseEventArgs);
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            comboBoxObj.inputWrapper.clearButton.dispatchEvent(clickEvent);
            expect(comboBoxObj.list.querySelectorAll('li')[9].textContent === 'Raveen Kumar').toBe(true);
        });
        it('mouse click on list with allowObjectBinding', (done) => {
            comboBoxObj = new ComboBox({
                dataSource: data,
                fields: { text: 'Name', value: 'Eimg' },
                placeholder: "Find a country",
                popupHeight: '250px',
                allowObjectBinding: true,
                allowFiltering: true,
                showClearButton: true,
            });
            comboBoxObj.appendTo(element);
            comboBoxObj.showPopup();
            setTimeout(() => {
                let item: HTMLElement[] = comboBoxObj.popupObj.element.querySelectorAll('li')[3];
                mouseEventArgs.target = item;
                mouseEventArgs.type = 'click';
                comboBoxObj.onMouseClick(mouseEventArgs);
                setTimeout(function () {
                    expect(comboBoxObj.isPopupOpen).toBe(false);
                    comboBoxObj.clearAll();
                    done();
                }, 450);
            }, 450)
        });
    });
    describe('EJ2-59155-Unable to type in the input when autofill is enabled with Contains filter', () => {
        let comboBoxObj: any;
        let e: any = { preventDefault: function () { }, target: null, type: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ComboBox1' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            comboBoxObj.destroy();
            element.remove();
        });
        it('with filtertype as contains', () => {
           comboBoxObj = new ComboBox({
                dataSource: [
                    { text: 'MM/dd/yyyy' },
                    { text: 'yyyy-MM-dd' },
                    { text: 'dd.MM.yyyy' },
                    { text: 'dd/yyyy/MM' },
                    { text: 'dd/MM/yyyy' },
                  ],
                  autofill: true,
                  filterType: 'Contains',
            });
            comboBoxObj.appendTo(element);
            comboBoxObj.showPopup();
            comboBoxObj.inputElement.value = 'm';
            e.key = 'm';
            e.keyCode = 77;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('mM/dd/yyyy');
            let item: Element = comboBoxObj.list.querySelector('.e-active')
            expect(item.textContent === 'MM/dd/yyyy').toBe(true);
            comboBoxObj.inputElement.value = 'mm';
            e.key = 'm';
            e.keyCode = 77;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('mm/dd/yyyy');
            comboBoxObj.inputElement.value = 'mm-';
            e.key = '-';
            e.keyCode = 189;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('mm-');
            expect(comboBoxObj.list.querySelector('.e-active').textContent === 'yyyy-MM-dd').toBe(true);
            comboBoxObj.inputElement.value = 'mm'
            e.key= "Backspace"
            e.keyCode = 8;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('mm');
            comboBoxObj.inputElement.value = 'mm.'
            e.key = '.';
            e.keyCode = 190;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('mm.');
            expect(comboBoxObj.list.querySelector('.e-active').textContent === 'dd.MM.yyyy').toBe(true);
            comboBoxObj.inputElement.value = 'y';
            e.key = 'y';
            e.keyCode = 89;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('y');
            expect(comboBoxObj.list.querySelector('.e-active').textContent === 'MM/dd/yyyy').toBe(true);
            comboBoxObj.inputElement.value = 'y/';
            e.key = 'y/';
            e.keyCode = 191;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('y/');
            expect(comboBoxObj.list.querySelector('.e-active').textContent === 'dd/yyyy/MM').toBe(true);
            comboBoxObj.inputElement.value = 'y'
            e.key= "Backspace"
            e.keyCode = 8;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('y');
            comboBoxObj.inputElement.value = 'y-'
            e.key= "-"
            e.keyCode = 189;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('y-');
            expect(comboBoxObj.list.querySelector('.e-active').textContent === 'yyyy-MM-dd').toBe(true);
            keyEventArgs.type = 'keydown';
            keyEventArgs.action = 'down';
            comboBoxObj.keyActionHandler(keyEventArgs);
            expect(comboBoxObj.inputElement.value).toBe('dd.MM.yyyy');
            comboBoxObj.keyActionHandler(keyEventArgs);
            expect(comboBoxObj.inputElement.value).toBe('dd/yyyy/MM');
            keyEventArgs.type = 'keyup';
            keyEventArgs.action = 'up';
            comboBoxObj.keyActionHandler(keyEventArgs);
            expect(comboBoxObj.inputElement.value).toBe('dd.MM.yyyy');
            comboBoxObj.keyActionHandler(keyEventArgs);
            expect(comboBoxObj.inputElement.value).toBe('yyyy-MM-dd');
            comboBoxObj.destroy();
        });
        it('with filtertype as endswith', () => {
            comboBoxObj = new ComboBox({
                 dataSource: [
                     { text: 'MM/dd/yyyy' },
                     { text: 'yyyy-MM-dd' },
                     { text: 'dd.MM.yyyy' },
                     { text: 'dd/yyyy/MM' },
                     { text: 'dd/MM/yyyy' },
                   ],
                   autofill: true,
                   filterType: 'EndsWith',
             });
            comboBoxObj.appendTo(element);
            comboBoxObj.showPopup();
            comboBoxObj.inputElement.value = 'm';
            e.key = 'm';
            e.keyCode = 77;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('m');
            let item: Element = comboBoxObj.list.querySelector('.e-active')
            expect(item.textContent === 'dd/yyyy/MM').toBe(true);
            comboBoxObj.inputElement.value = 'mm';
            e.key = 'm';
            e.keyCode = 77;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('mm');
            expect(comboBoxObj.list.querySelector('.e-active').textContent === 'dd/yyyy/MM').toBe(true);
            comboBoxObj.inputElement.value = 'mm-';
            e.key = '-';
            e.keyCode = 189;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('mm-');
            expect(isNullOrUndefined(comboBoxObj.list.querySelector('.e-active'))).toBe(true);
            comboBoxObj.inputElement.value = 'mm'
            e.key= "Backspace"
            e.keyCode = 8;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('mm');
            expect(isNullOrUndefined(comboBoxObj.list.querySelector('.e-active'))).toBe(true);
            comboBoxObj.inputElement.value = 'y'
            e.key = 'y';
            e.keyCode = 89;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('y');
            expect(comboBoxObj.list.querySelector('.e-active').textContent === 'MM/dd/yyyy').toBe(true);
            comboBoxObj.inputElement.value = 'y/';
            e.key = 'y/';
            e.keyCode = 191;
            comboBoxObj.onInput(e);
            comboBoxObj.onFilterUp(e);
            expect(comboBoxObj.inputElement.value).toBe('y/');
            expect(isNullOrUndefined(comboBoxObj.list.querySelector('.e-active'))).toBe(true);
            keyEventArgs.type = 'keydown';
            keyEventArgs.action = 'down';
            comboBoxObj.keyActionHandler(keyEventArgs);
            expect(comboBoxObj.inputElement.value).toBe('MM/dd/yyyy');
            comboBoxObj.keyActionHandler(keyEventArgs);
            expect(comboBoxObj.inputElement.value).toBe('yyyy-MM-dd');
            keyEventArgs.type = 'keyup';
            keyEventArgs.action = 'up';
            comboBoxObj.keyActionHandler(keyEventArgs);
            expect(comboBoxObj.inputElement.value).toBe('MM/dd/yyyy');
            comboBoxObj.destroy();
        });
    });
    describe('Provide event details in open and close event arguments in dropdown components', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down', keyCode: null, type: null };
        let list: any;
        let ele: HTMLElement;
        let eventDetails : any;
        beforeAll(() => {
            ele = createElement('input', { id: 'autocomplete' });
            document.body.appendChild(ele);
            list = new ComboBox({
                dataSource: languageData,
                fields: { value: 'text' },
                open: (e: PopupEventArgs) => {
                    eventDetails = e.event;
                },
                close: (e: PopupEventArgs) => {
                    eventDetails = e.event;
                }
            });
            list.appendTo(ele);
        });
        afterAll(() => {
            ele.remove();
            list.destroy();
            document.body.innerHTML = '';
        });
        it("Testing event details when popup close using press alt+up key", (done) => {
            keyEventArgs.action = 'hide';
            list.onInput(keyEventArgs);
            list.onFilterUp(keyEventArgs);
            setTimeout(() => {
                expect(!isNullOrUndefined(eventDetails)).toBe(true);
                eventDetails = null;
                keyEventArgs.action = 'down';
                keyEventArgs.type = 'keydown';
                list.keyActionHandler(keyEventArgs);
                list.hidePopup(keyEventArgs);
                expect(!isNullOrUndefined(eventDetails)).toBe(true);
                eventDetails = null;
                done();
            }, 450);
        })
        it("Testing eventdetails when popup open by click on popup button", (done) => {
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            setTimeout(() => {
                mouseEventArgs.target = list.inputWrapper.buttons[0];
                list.dropDownClick(mouseEventArgs);
                expect(!isNullOrUndefined(eventDetails)).toBe(true);
                eventDetails = null;
                list.focusOut(mouseEventArgs);
                expect(!isNullOrUndefined(eventDetails)).toBe(true);
                eventDetails = null;
                done();
            }, 450);
        })
    });
    describe('Disable items', () => {  
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let listObj: any;
        let sportsData: { [key: string]: Object }[] = [ 
            { "State": false, "Game": "American Football", "Id" : 'Game1' },
            { "State": false, "Game": "Badminton", "Id" : 'Game2' },
            { "State": false, "Game": "Basketball", "Id" : 'Game3' },
            { "State": true, "Game": "Cricket", "Id" : 'Game4' },
            { "State": false, "Game": "Football", "Id" : 'Game5' },
            { "State": false, "Game": "Golf", "Id" : 'Game6' },
            { "State": true, "Game": "Hockey", "Id" : 'Game7' },
            { "State": false, "Game": "Rugby", "Id" : 'Game8' },
            { "State": false, "Game": "Snooker", "Id" : 'Game9' },
            { "State": false, "Game": "Tennis", "Id" : 'Game10' } 
        
        ]; 
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new ComboBox({
                dataSource: sportsData,
                fields: { value: 'Id', text: 'Game', disabled: 'State' },
            });
            listObj.appendTo(element);
        });
        afterAll((done) => {
            listObj.hidePopup();
            setTimeout(() => {
                listObj.destroy();
                element.remove();
                done();
            }, 450)
        });
        /**
       * Mouse click
       */
        it('checked with disableItem method', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(8);
                listObj.disableItem("Game4");
                expect(listObj.liCollections[3].classList.contains('e-disabled')).toBe(true);
                expect(listObj.liCollections[3].getAttribute('aria-selected')).toBe('false');
                expect(listObj.liCollections[3].getAttribute('aria-disabled')).toBe('true');
                expect(listObj.liCollections[6].classList.contains('e-disabled')).toBe(true);
                expect(listObj.liCollections[6].getAttribute('aria-selected')).toBe('false');
                expect(listObj.liCollections[6].getAttribute('aria-disabled')).toBe('true');
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(8);
                listObj.disableItem({ "State": true, "Game": "Hockey", "Id" : 'Game7' });
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(8);
                listObj.disableItem(0);
                expect(listObj.liCollections[0].classList.contains('e-disabled')).toBe(true);
                expect(listObj.liCollections[0].getAttribute('aria-selected')).toBe('false');
                expect(listObj.liCollections[0].getAttribute('aria-disabled')).toBe('true');
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(7);
                listObj.disableItem("Game8");
                expect(listObj.liCollections[7].classList.contains('e-disabled')).toBe(true);
                expect(listObj.liCollections[7].getAttribute('aria-selected')).toBe('false');
                expect(listObj.liCollections[7].getAttribute('aria-disabled')).toBe('true');
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(6);
                listObj.disableItem({ "State": false, "Game": "Tennis", "Id": 'Game10' });
                expect(listObj.liCollections[9].classList.contains('e-disabled')).toBe(true);
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(5);
                listObj.disableItem(0);
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(5);
                listObj.disableItem("Game8");
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(5);
                listObj.disableItem({ "State": false, "Game": "Tennis", "Id": 'Game10' });
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(5);
                listObj.disableItem(listObj.liCollections[8]);
                expect(listObj.liCollections[8].classList.contains('e-disabled')).toBe(true);
                expect(listObj.liCollections[8].getAttribute('aria-selected')).toBe('false');
                expect(listObj.liCollections[8].getAttribute('aria-disabled')).toBe('true');
                expect(listObj.list.querySelectorAll('.e-list-item:not(.e-disabled)').length).toBe(4);
                done();
            }, 450);
        });
    });
    describe('Disable items', function () {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let listObj: any;
        let sportsData: { [key: string]: Object }[] = [ 
            { "State": false, "Game": "American Football", "Id" : 'Game1' },
            { "State": false, "Game": "Badminton", "Id" : 'Game2' },
            { "State": false, "Game": "Basketball", "Id" : 'Game3' },
            { "State": true, "Game": "Cricket", "Id" : 'Game4' },
            { "State": false, "Game": "Football", "Id" : 'Game5' },
            { "State": false, "Game": "Golf", "Id" : 'Game6' },
            { "State": true, "Game": "Hockey", "Id" : 'Game7' },
            { "State": false, "Game": "Rugby", "Id" : 'Game8' },
            { "State": false, "Game": "Snooker", "Id" : 'Game9' },
            { "State": false, "Game": "Tennis", "Id" : 'Game10' } 
        
        ]; 
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new ComboBox({
                dataSource: sportsData,
                fields: { value: 'Id', text: 'Game', disabled: 'State' },
                value: 'Game7',
            });
            listObj.appendTo(element);
        });
        afterAll((done) => {
            listObj.hidePopup();
            setTimeout(() => {
                listObj.destroy();
                element.remove();
                done();
            }, 450)
        });
        it('checked with value binding', function (done) { 
            setTimeout(function () {
                expect(listObj.value).toBe(null);
                listObj.value = "Game4";
                listObj.dataBind();
                expect(listObj.value === null).toBe(true);
                listObj.value = "Game1";
                listObj.dataBind();
                listObj.disableItem(0);
                expect(listObj.value === null).toBe(true);
                done();
            }, 450);
        });
    });
    describe('Disable Items', function () {          
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let listObj: any;
        let sportsData: { [key: string]: Object }[] = [ 
            { "State": false, "Game": "American Football", "Id" : 'Game1' },
            { "State": false, "Game": "Badminton", "Id" : 'Game2' },
            { "State": false, "Game": "Basketball", "Id" : 'Game3' },
            { "State": true, "Game": "Cricket", "Id" : 'Game4' },
            { "State": false, "Game": "Football", "Id" : 'Game5' },
            { "State": false, "Game": "Golf", "Id" : 'Game6' },
            { "State": true, "Game": "Hockey", "Id" : 'Game7' },
            { "State": false, "Game": "Rugby", "Id" : 'Game8' },
            { "State": false, "Game": "Snooker", "Id" : 'Game9' },
            { "State": false, "Game": "Tennis", "Id" : 'Game10' } 
        
        ]; 
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new ComboBox({
                dataSource: sportsData,
                fields: { value: 'Id', text: 'Game', disabled: 'State' },
                value: { "State": true, "Game": "Hockey", "Id" : 'Game7' },
                allowObjectBinding: true,
            });
            listObj.appendTo(element);
        });
        afterAll((done) => {
            listObj.hidePopup();
            setTimeout(() => {
                listObj.destroy();
                element.remove();
                done();
            }, 450)
        });
        it('checked with object value binding', function (done) {     
            setTimeout(function () {
                expect(listObj.value).toBe(null);
                listObj.value = { "State": true, "Game": "Cricket", "Id" : 'Game4' };
                listObj.dataBind();
                expect(listObj.value === null).toBe(true);
                listObj.value = { "State": false, "Game": "American Football", "Id" : 'Game1' };
                listObj.dataBind();
                listObj.disableItem(0);
                expect(listObj.value === null).toBe(true);
                done();
            }, 450);
        });
    });
    describe('Disable items with allowfiltering', function () {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'escape' };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let listObj: any;
        let sportsData: { [key: string]: Object }[] = [ 
            { "State": false, "Game": "American Football", "Id" : 'Game1' },
            { "State": false, "Game": "Badminton", "Id" : 'Game2' },
            { "State": false, "Game": "Basketball", "Id" : 'Game3' },
            { "State": true, "Game": "Cricket", "Id" : 'Game4' },
            { "State": false, "Game": "Football", "Id" : 'Game5' },
            { "State": false, "Game": "Golf", "Id" : 'Game6' },
            { "State": true, "Game": "Hockey", "Id" : 'Game7' },
            { "State": false, "Game": "Rugby", "Id" : 'Game8' },
            { "State": false, "Game": "Snooker", "Id" : 'Game9' },
            { "State": false, "Game": "Tennis", "Id" : 'Game10' } 
        
        ]; 
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new ComboBox({
                dataSource: sportsData,
                fields: { value: 'Id', text: 'Game', disabled: 'State' },
                allowFiltering: true
            });
            listObj.appendTo(element);
        });
        afterAll((done) => {
            listObj.hidePopup();
            setTimeout(() => {
                listObj.destroy();
                element.remove();
                done();
            }, 450)
        });
        it('to check the enabled value with enter key action', function (done) { 
            listObj.showPopup();
            setTimeout(function () {
                listObj.filterInput.value = "s";
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs); 
                keyEventArgs.action = 'enter';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.liCollections[0].classList.contains('e-active')).toBe(true);
                done();
            }, 200);
        });
        it('to check the diabled value with enter key action', function (done) { 
            setTimeout(function () {
                listObj.showPopup();
                listObj.filterInput.value = "c";
                listObj.onInput()
                listObj.onFilterUp(keyEventArgs); 
                keyEventArgs.action = 'enter';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.liCollections[0].classList.contains('e-active')).toBe(false);
                expect(listObj.liCollections[0].classList.contains('e-disabled')).toBe(true);
                done();
            }, 400);
        });
    });
    describe('Disable items', function () {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let listObj: any;
        let sportsData: { [key: string]: Object }[] = [ 
            { "State": false, "Game": "American Football", "Id" : 'Game1' },
            { "State": false, "Game": "Badminton", "Id" : 'Game2' },
            { "State": false, "Game": "Basketball", "Id" : 'Game3' },
            { "State": true, "Game": "Cricket", "Id" : 'Game4' },
            { "State": false, "Game": "Football", "Id" : 'Game5' },
            { "State": false, "Game": "Golf", "Id" : 'Game6' },
            { "State": true, "Game": "Hockey", "Id" : 'Game7' },
            { "State": false, "Game": "Rugby", "Id" : 'Game8' },
            { "State": false, "Game": "Snooker", "Id" : 'Game9' },
            { "State": false, "Game": "Tennis", "Id" : 'Game10' } 
        
        ]; 
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new ComboBox({
                dataSource: sportsData,
                fields: { value: 'Id', text: 'Game', disabled: 'State' },
                text: "Hockey",
            });
            listObj.appendTo(element);
        });
        afterAll((done) => {
            listObj.hidePopup();
            setTimeout(() => {
                listObj.destroy();
                element.remove();
                done();
            }, 450)
        });
        it('checked with text binding', function (done) {  
            setTimeout(function () {
                expect(listObj.value).toBe(null);
                listObj.text = "Cricket";
                listObj.dataBind();
                expect(listObj.value === null).toBe(true);
                listObj.text = "American Football";
                listObj.dataBind();
                listObj.disableItem("Game1");
                expect(listObj.value === null).toBe(true);
                done();
            }, 450);
        });
    });
    describe('Disable items', function () {        
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let listObj: any;
        let sportsData: { [key: string]: Object }[] = [ 
            { "State": false, "Game": "American Football", "Id" : 'Game1' },
            { "State": false, "Game": "Badminton", "Id" : 'Game2' },
            { "State": false, "Game": "Basketball", "Id" : 'Game3' },
            { "State": true, "Game": "Cricket", "Id" : 'Game4' },
            { "State": false, "Game": "Football", "Id" : 'Game5' },
            { "State": false, "Game": "Golf", "Id" : 'Game6' },
            { "State": true, "Game": "Hockey", "Id" : 'Game7' },
            { "State": false, "Game": "Rugby", "Id" : 'Game8' },
            { "State": false, "Game": "Snooker", "Id" : 'Game9' },
            { "State": false, "Game": "Tennis", "Id" : 'Game10' } 
        
        ]; 
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new ComboBox({
                dataSource: sportsData,
                fields: { value: 'Id', text: 'Game', disabled: 'State' },
                index: 6,
            });
            listObj.appendTo(element);
        });
        afterAll((done) => {
            listObj.hidePopup();
            setTimeout(() => {
                listObj.destroy();
                element.remove();
                done();
            }, 450)
        });
        it('checked with index binding', function (done) {        
            setTimeout(function () {
                expect(listObj.value).toBe(null);
                listObj.index = 3;
                listObj.dataBind();
                expect(listObj.value === null).toBe(true);
                listObj.index = 0;
                listObj.dataBind();
                listObj.disableItem({ "State": false, "Game": "American Football", "Id" : 'Game1' });
                expect(listObj.value === null).toBe(true);
                done();
            }, 450);
        });
    });
    describe('keyboard interaction with disabled items', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'up' };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let listObj: any;
        let sportsData: { [key: string]: Object }[] = [ 
            { "State": true, "Game": "American Football", "Id" : 'Game1' },
            { "State": false, "Game": "Badminton", "Id" : 'Game2' },
            { "State": true, "Game": "Basketball", "Id" : 'Game3' },
            { "State": true, "Game": "Cricket", "Id" : 'Game4' },
            { "State": false, "Game": "Football", "Id" : 'Game5' },
            { "State": true, "Game": "Golf", "Id" : 'Game6' },
        
        ]; 
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new ComboBox({
                dataSource: sportsData,
                fields: { value: 'Id', text: 'Game', disabled: 'State' },
            });
            listObj.appendTo(element);
        });
        afterAll((done) => {
            listObj.hidePopup();
            setTimeout(() => {
                listObj.destroy();
                element.remove();
                done();
            }, 450)
        });
        /**
       * Mouse click
       */
        it('up and down action', (done) => {       
            listObj.showPopup();
            setTimeout(() => {
                expect(listObj.list.querySelector('.e-item-focus').getAttribute('data-value') === "Game2").toBe(true);
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelector('.e-active').getAttribute('data-value') === "Game2").toBe(true);
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelector('.e-active').getAttribute('data-value') === "Game2").toBe(true);
                keyEventArgs.action = 'down';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelector('.e-active').getAttribute('data-value') === "Game5").toBe(true);
                keyEventArgs.action = 'down';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelector('.e-active').getAttribute('data-value') === "Game5").toBe(true);
                keyEventArgs.action = 'up';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelector('.e-active').getAttribute('data-value') === "Game2").toBe(true);
                done();
            }, 450);
        });
        it('all disabled items', (done) => {         
            listObj.showPopup();
            setTimeout(() => {
                listObj.disableItem('Game2');
                listObj.disableItem('Game5');
                expect(listObj.list.querySelectorAll('.e-item-focus').length === 0).toBe(true);
                keyEventArgs.action = 'down';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelectorAll('.e-item-focus').length === 0).toBe(true);
                keyEventArgs.action = 'up';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelectorAll('.e-item-focus').length === 0).toBe(true);
                keyEventArgs.action = 'down';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelectorAll('.e-item-focus').length === 0).toBe(true);
                keyEventArgs.action = 'up';
                listObj.keyActionHandler(keyEventArgs);
                expect(listObj.list.querySelectorAll('.e-item-focus').length === 0).toBe(true);
                done();
            }, 450);
        });
    });
    describe('Null or undefined value testing', () => {
        let listObj: ComboBox;
        beforeEach(() => {
            listObj = undefined;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'list' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
        it('actionFailureTemplate', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                actionFailureTemplate: null
            }, '#list');
            expect(listObj.actionFailureTemplate).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                actionFailureTemplate: undefined
            }, '#list');
            expect(listObj.actionFailureTemplate).toBe('Request failed');
            listObj.destroy();
        });
        it('allowCustom', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                allowCustom: null
            }, '#list');
            expect(listObj.allowCustom).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                allowCustom: undefined
            }, '#list');
            expect(listObj.allowCustom).toBe(true);
            listObj.destroy();
        });
        it('allowFiltering', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                allowFiltering: null
            }, '#list');
            expect(listObj.allowFiltering).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                allowFiltering: undefined
            }, '#list');
            expect(listObj.allowFiltering).toBe(false);
            listObj.destroy();
        });
        it('allowObjectBinding', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                allowObjectBinding: null
            }, '#list');
            expect(listObj.allowObjectBinding).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                allowObjectBinding: undefined
            }, '#list');
            expect(listObj.allowObjectBinding).toBe(false);
            listObj.destroy();
        });
        it('autofill', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                autofill: null
            }, '#list');
            expect(listObj.autofill).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                autofill: undefined
            }, '#list');
            expect(listObj.autofill).toBe(false);
            listObj.destroy();
        });
        it('cssClass', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                cssClass: null
            }, '#list');
            expect(listObj.cssClass).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                cssClass: undefined
            }, '#list');
            expect(listObj.cssClass).toBe(null);
            listObj.destroy();
        });
        it('enablePersistence', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                enablePersistence: null
            }, '#list');
            expect(listObj.enablePersistence).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                enablePersistence: undefined
            }, '#list');
            expect(listObj.enablePersistence).toBe(false);
            listObj.destroy();
        });
        it('enableRtl', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                enableRtl: null
            }, '#list');
            expect(listObj.enableRtl).toBe(false);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                enableRtl: undefined
            }, '#list');
            expect(listObj.enableRtl).toBe(false);
            listObj.destroy();
        });
        it('enableVirtualization', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                enableVirtualization: null
            }, '#list');
            expect(listObj.enableVirtualization).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                enableVirtualization: undefined
            }, '#list');
            expect(listObj.enableVirtualization).toBe(false);
            listObj.destroy();
        });
        it('enabled', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                enabled: null
            }, '#list');
            expect(listObj.enabled).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                enabled: undefined
            }, '#list');
            expect(listObj.enabled).toBe(true);
            listObj.destroy();
        });
        it('filterBarPlaceholder', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                allowFiltering: true,
                filterBarPlaceholder: null
            }, '#list');
            expect(listObj.filterBarPlaceholder).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                allowFiltering: true,
                filterBarPlaceholder: undefined
            }, '#list');
            expect(listObj.filterBarPlaceholder).toBe(null);
            listObj.destroy();
        });
        it('footerTemplate', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                footerTemplate: null
            }, '#list');
            expect(listObj.footerTemplate).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                footerTemplate: undefined
            }, '#list');
            expect(listObj.footerTemplate).toBe(null);
            listObj.destroy();
        });
        it('groupTemplate', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                groupTemplate: null
            }, '#list');
            expect(listObj.groupTemplate).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                groupTemplate: undefined
            }, '#list');
            expect(listObj.groupTemplate).toBe(null);
            listObj.destroy();
        });
        it('headerTemplate', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                headerTemplate: null
            }, '#list');
            expect(listObj.headerTemplate).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                headerTemplate: undefined
            }, '#list');
            expect(listObj.headerTemplate).toBe(null);
            listObj.destroy();
        });
        it('ignoreAccent', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                ignoreAccent: null
            }, '#list');
            expect(listObj.ignoreAccent).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                ignoreAccent: undefined
            }, '#list');
            expect(listObj.ignoreAccent).toBe(false);
            listObj.destroy();
        });
        it('ignoreCase', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                ignoreCase: null
            }, '#list');
            expect(listObj.ignoreCase).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                ignoreCase: undefined
            }, '#list');
            expect(listObj.ignoreCase).toBe(true);
            listObj.destroy();
        });
        it('itemTemplate', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                itemTemplate: null
            }, '#list');
            expect(listObj.itemTemplate).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                itemTemplate: undefined
            }, '#list');
            expect(listObj.itemTemplate).toBe(null);
            listObj.destroy();
        });
        it('noRecordsTemplate', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                noRecordsTemplate: null
            }, '#list');
            expect(listObj.noRecordsTemplate).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                noRecordsTemplate: undefined
            }, '#list');
            expect(listObj.noRecordsTemplate).toBe('No records found');
            listObj.destroy();
        });
        it('placeholder', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                placeholder: null
            }, '#list');
            expect(listObj.placeholder).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                placeholder: undefined
            }, '#list');
            expect(listObj.placeholder).toBe(null);
            listObj.destroy();
        });
        it('popupHeight', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                popupHeight: null
            }, '#list');
            expect(listObj.popupHeight).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                popupHeight: undefined
            }, '#list');
            expect(listObj.popupHeight).toBe('300px');
            listObj.destroy();
        });
        it('popupWidth', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                popupWidth: null
            }, '#list');
            expect(listObj.popupWidth).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                popupWidth: undefined
            }, '#list');
            expect(listObj.popupWidth).toBe('100%');
            listObj.destroy();
        });
        it('readonly', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                readonly: null
            }, '#list');
            expect(listObj.readonly).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                readonly: undefined
            }, '#list');
            expect(listObj.readonly).toBe(false);
            listObj.destroy();
        });
        it('showClearButton', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                showClearButton: null
            }, '#list');
            expect(listObj.showClearButton).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                showClearButton: undefined
            }, '#list');
            expect(listObj.showClearButton).toBe(true);
            listObj.destroy();
        });
        it('text', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                text: null
            }, '#list');
            expect(listObj.text).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                text: undefined
            }, '#list');
            expect(listObj.text).toBe(null);
            listObj.destroy();
        });
        it('value', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                value: null
            }, '#list');
            expect(listObj.value).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                value: undefined
            }, '#list');
            expect(listObj.value).toBe(null);
            listObj.destroy();
        });
        it('valueTemplate', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                valueTemplate: null
            }, '#list');
            expect(listObj.valueTemplate).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                valueTemplate: undefined
            }, '#list');
            expect(listObj.valueTemplate).toBe(null);
            listObj.destroy();
        });
        it('width', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                width: null
            }, '#list');
            expect(listObj.width).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                width: undefined
            }, '#list');
            expect(listObj.width).toBe('100%');
            listObj.destroy();
        });
        it('index', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                index: null
            }, '#list');
            expect(listObj.index).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                index: undefined
            }, '#list');
            expect(listObj.index).toBe(null);
            listObj.destroy();
        });
        it('zIndex', () => {
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                zIndex: null
            }, '#list');
            expect(listObj.zIndex).toBe(null);
            listObj.destroy();
            listObj = new ComboBox({ 
                dataSource: languageData,
                fields: { value: "id", text: "text" },
                zIndex: undefined
            }, '#list');
            expect(listObj.zIndex).toBe(1000);
            listObj.destroy();
        });
    });
    describe('Object value binding', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        let listObj: any;
        let sportsData: { [key: string]: Object }[] = [
            { "State": true, "Game": "American Football", "Id" : 'Game1' },
            { "State": false, "Game": "Badminton", "Id" : 'Game2' },
            { "State": true, "Game": "Basketball", "Id" : 'Game3' },
            { "State": true, "Game": "Cricket", "Id" : 'Game4' },
            { "State": false, "Game": "Football", "Id" : 'Game5' },
            { "State": true, "Game": "Golf", "Id" : 'Game6' },
        ]; 
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new ComboBox({
                dataSource: sportsData,
                fields: { value: 'Id', text: 'Game', disabled: 'State' },
                value: { "State": true, "Game": "TestGame", "Id" : 'TestId' },
                allowCustom: true,
                allowObjectBinding: true
            });
            listObj.appendTo(element);
        });
        afterAll((done) => {
            listObj.hidePopup();
            setTimeout(() => {
                listObj.destroy();
                element.remove();
                done();
            }, 450)
        });
        it('- With Custom object value', (done) => {
            expect(listObj.index).toBe(null);
            listObj.value = { "State": false, "Game": "TestGame1", "Id" : 'TestId1' };
            listObj.dataBind();
            expect(listObj.index).toBe(null);
            done();
        });
    });
});
