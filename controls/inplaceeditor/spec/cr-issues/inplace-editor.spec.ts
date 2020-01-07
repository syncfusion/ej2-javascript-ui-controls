/**
 * InPlace-Editor CR Issue spec document
 */
import { select, selectAll, createElement, Browser } from '@syncfusion/ej2-base';
import { InPlaceEditor } from '../../src/inplace-editor/base/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy, ieUA } from './../render.spec';
import { DataManager, WebApiAdaptor, Query } from '@syncfusion/ej2-data';
import { MultiSelect, Rte, AutoComplete, ComboBox } from '../../src/inplace-editor/modules/index';

InPlaceEditor.Inject(MultiSelect, Rte, AutoComplete, ComboBox);

describe('CR ISSUE InPlace-Editor Control', () => {
    let currentUA: string = navigator.userAgent;
    describe('EJ2-23937: Toolbar fails to render properly in RTE In-Place Editor when afterOpen is set.', () => {
        let ele: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueEle: HTMLElement;
        let isAfterOpen: Boolean = false;
        beforeEach(() => {
            let element: HTMLElement = createElement('div', { id: 'EJ2-23937-element' });
            document.body.appendChild(element);
            editorObj = new InPlaceEditor({
                mode: 'Popup',
                type: 'RTE',
                value: 'RichTextEditor',
                name: 'TextEditor',
                popupSettings: {
                    title: 'Edit',
                    model: {
                        width: 300,
                        afterOpen: function (e) {
                            isAfterOpen = true;
                        }
                    }
                }
            });
            editorObj.appendTo('#EJ2-23937-element');
        })
        afterEach((): void => {
            destroy(editorObj);
        });
        it(' Trigger the after open event ', (done) => {
            ele = editorObj.element;
            expect(editorObj.mode).toEqual('Popup');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(selectAll('.' + classes.ROOT_TIP, document.body).length === 1).toEqual(true);
                expect(isAfterOpen).toEqual(true);
                done()
            },200);
        })
    });

    describe('EJ2-34914: IE11 - In-place Editor - Type as MultiSelect with open event testing.', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let eventValue: string;
        let assignValue: any = (Object as any).assign;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'MultiSelect',
                model: {
                    dataSource: new DataManager({
                        url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
                        adaptor: new WebApiAdaptor,
                        crossDomain: true
                    }),
                    query: new Query().select(['FirstName', 'EmployeeID']).take(10).requiresCount(),
                    fields: { text: 'FirstName', value: 'EmployeeID' },
                    open: function() { eventValue = 'opened' },
                    mode: 'Box',
                    value: [1]
                }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Check whether the popup is loaded with data', (done) => {
            Browser.userAgent = ieUA;
            expect(editorObj.mode).toEqual('Inline');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            ((window as any).Object as any).assign = undefined;
            valueEle.click();
            setTimeout(() => {
                expect(eventValue).toEqual('opened');
                Browser.userAgent = currentUA;
                (Object as any).assign = assignValue;
                done();
            },1500);
        });
    });

    describe('EJ2-31305: In-place Editor - Type as MultiSelect with data not binded, when use remote data binding through model property.', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'MultiSelect',
                model: {
                    dataSource: new DataManager({
                        url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
                        adaptor: new WebApiAdaptor,
                        crossDomain: true
                    }),
                    query: new Query().select(['FirstName', 'EmployeeID']).take(10).requiresCount(),
                    fields: { text: 'FirstName', value: 'EmployeeID' },
                    mode: 'Box',
                    value: [1]
                }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Check whether the popup is loaded with data', (done) => {
            expect(editorObj.mode).toEqual('Inline');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-list-item').length).toEqual(9);
                done()
            },1500);
        });
    });

    describe('EJ2-34914: In-place Editor - Type as MultiSelect with allowCustomValue not working issue testing.', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let keyboardEventArgs = {
            preventDefault: function () { },
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            char: '',
            key: '',
            charCode: 22,
            keyCode: 22,
            which: 22,
            code: 22
        };
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'MultiSelect',
                model: {
                    allowCustomValue: true,
                    dataSource: new DataManager({
                        url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
                        adaptor: new WebApiAdaptor,
                        crossDomain: true
                    }),
                    query: new Query().select(['FirstName', 'EmployeeID']).take(10).requiresCount(),
                    fields: { text: 'FirstName', value: 'EmployeeID' },
                    mode: 'Box',
                    value: [1]
                }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Check whether the popup is loaded with data', (done) => {
            expect(editorObj.mode).toEqual('Inline');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-list-item').length).toEqual(9);
                let compObj: any = (document.querySelector('.e-multiselect.e-control') as any).ej2_instances[0];
                compObj.inputElement.value = "RUBY";
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 70;
                compObj.keyDownStatus = true;
                compObj.onInput();
                compObj.KeyUp(keyboardEventArgs);
                expect(compObj.liCollections.length).toBe(1);
                done();
            }, 1000);
        });
    });

    describe('EJ2-34914: In-place Editor - Type as MultiSelect with open and close event testing.', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let eventValue: string;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'MultiSelect',
                model: {
                    dataSource: new DataManager({
                        url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
                        adaptor: new WebApiAdaptor,
                        crossDomain: true
                    }),
                    query: new Query().select(['FirstName', 'EmployeeID']).take(10).requiresCount(),
                    fields: { text: 'FirstName', value: 'EmployeeID' },
                    open: function() { eventValue = 'opened' },
                    close: function() { eventValue = 'closed' },
                    mode: 'Box',
                    value: [1]
                }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Check whether the popup is loaded with data', (done) => {
            expect(editorObj.mode).toEqual('Inline');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(eventValue).toEqual('opened');
                (document.querySelector('.e-editable-action-buttons .e-btn-save') as HTMLButtonElement).focus();
                setTimeout(() => {
                    expect(eventValue).toEqual('closed');
                    done();
                },500);
            },1500);
        });
    });

    describe('EJ2-31305: In-place Editor - Type as MultiSelect with no initial value', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'MultiSelect',
                model: {
                    dataSource: new DataManager({
                        url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
                        adaptor: new WebApiAdaptor,
                        crossDomain: true
                    }),
                    query: new Query().select(['FirstName', 'EmployeeID']).take(10).requiresCount(),
                    fields: { text: 'FirstName', value: 'EmployeeID' },
                    mode: 'Box'
                }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Check whether the input is focused and popup is loaded with data', (done) => {
            expect(editorObj.mode).toEqual('Inline');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(document.querySelector('.e-multiselect.e-input-group').classList.contains('e-input-focus')).toEqual(true);
                expect(document.querySelectorAll('.e-list-item').length).toEqual(9);
                done()
            },1500);
        });
    });

    describe('EJ2-31305: In-place Editor - Type as DropDownList with initial value', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'DropDownList',
                model: {
                    dataSource: new DataManager({
                        url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
                        adaptor: new WebApiAdaptor,
                        crossDomain: true
                    }),
                    query: new Query().select(['FirstName', 'EmployeeID']).take(10).requiresCount(),
                    fields: { text: 'FirstName', value: 'EmployeeID' },
                    value: 1,
                }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Check whether the popup is loaded with data', (done) => {
            expect(editorObj.mode).toEqual('Inline');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(document.querySelector('.e-ddl.e-input-group').classList.contains('e-input-focus')).toEqual(true);
                expect(document.querySelectorAll('.e-list-item').length).toEqual(9);
                done()
            },1500);
        });
    });

    describe('EJ2-31305: In-place Editor - Type as ComboBox with initial value', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'ComboBox',
                model: {
                    dataSource: new DataManager({
                        url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
                        adaptor: new WebApiAdaptor,
                        crossDomain: true
                    }),
                    query: new Query().select(['FirstName', 'EmployeeID']).take(10).requiresCount(),
                    fields: { text: 'FirstName', value: 'EmployeeID' },
                    value: 1,
                }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Check whether the popup is loaded with data', (done) => {
            expect(editorObj.mode).toEqual('Inline');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(document.querySelector('.e-ddl.e-input-group').classList.contains('e-input-focus')).toEqual(true);
                expect(document.querySelectorAll('.e-list-item').length).toEqual(9);
                done()
            },1500);
        });
    });

    describe('EJ2-31305: In-place Editor - Type as AutoComplete with initial value', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'AutoComplete',
                model: {
                    dataSource: new DataManager({
                        url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
                        adaptor: new WebApiAdaptor,
                        crossDomain: true
                    }),
                    query: new Query().select(['FirstName', 'EmployeeID']).take(10).requiresCount(),
                    fields: { value: 'FirstName' },
                    value: 'Andrew Fuller',
                }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Check whether popup is loaded with data', (done) => {
            expect(editorObj.mode).toEqual('Inline');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            setTimeout(() => {
                expect(document.querySelector('.e-ddl.e-input-group').classList.contains('e-input-focus')).toEqual(true);
                done()
            },1500);
        });
    });
})
