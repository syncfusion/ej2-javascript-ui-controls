/**
 * InPlace-Editor CR Issue spec document
 */
import { select, selectAll, createElement, Browser } from '@syncfusion/ej2-base';
import { InPlaceEditor, BeginEditEventArgs, ActionBeginEventArgs } from '../../src/inplace-editor/base/index';
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

    describe('EJ2-35418 - I258695: Preventing the editable action for inplace-editor', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let count: number = 0;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                beginEdit: function(e: BeginEditEventArgs) {
                    count = count + 1;
                    e.cancel = true
                }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Check ', (done) => {
            expect(editorObj.mode).toEqual('Inline');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle.click();
            setTimeout(() => {
                expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(false);
                expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
                expect(document.querySelectorAll('.' + classes.INLINE).length > 0).toEqual(false);
                expect(count).toEqual(1);
                done()
            },1500);
        });
    });

    describe('EJ2-33001 - Value submit testing', () => {
        let ele: HTMLElement
        let valueEle: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueWrapper: HTMLElement;
        let beginArgs: any = {};
        let successArgs: any = {};
        function begin(e: any): void {
            beginArgs = e;
        }
        function success(e: any): void {
            successArgs = e;
        }
        afterEach((): void => {
            destroy(editorObj);
        });
        it('actionSuccess eventArgs cancel as true testing', (done: Function) => {
            editorObj = renderEditor({
                primaryKey: 'text',
                mode: 'Inline',
                name: 'Game',
                emptyText: 'Empty',
                adaptor: 'UrlAdaptor',
                url: 'https://ej2services.syncfusion.com/production/web-services/api/Editor/UpdateData',
                model: {
                    value: 'Syncfusion'
                },
                actionBegin: begin,
                actionSuccess: function(e: any) {
                    e.cancel = true;
                    successArgs = e;
                }
            });
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerText).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(true);
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion' }, name: "actionBegin" });
                expect(successArgs['name']).toEqual('actionSuccess');
                expect(successArgs['value']).toEqual('Syncfusion');
                expect(valueEle.innerText).toEqual('Empty');
                expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(false);
                done();
            }, 500);
        });
        it('actionSuccess eventArgs cancel as false testing', (done: Function) => {
            editorObj = renderEditor({
                primaryKey: 'text',
                mode: 'Inline',
                name: 'Game',
                emptyText: 'Empty',
                adaptor: 'UrlAdaptor',
                url: 'https://ej2services.syncfusion.com/production/web-services/api/Editor/UpdateData',
                model: {
                    value: 'Syncfusion'
                },
                actionBegin: begin,
                actionSuccess: function(e: any) {
                    e.cancel = false;
                    successArgs = e;
                }
            });
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerText).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(true);
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion' }, name: "actionBegin" });
                expect(successArgs['name']).toEqual('actionSuccess');
                expect(successArgs['value']).toEqual('Syncfusion');
                expect(valueEle.innerText).toEqual('Syncfusion');
                expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(false);
                done();
            }, 500);
        });
        it('actionSuccess eventArgs cancel not configured with testing', (done: Function) => {
            editorObj = renderEditor({
                primaryKey: 'text',
                mode: 'Inline',
                name: 'Game',
                emptyText: 'Empty',
                adaptor: 'UrlAdaptor',
                url: 'https://ej2services.syncfusion.com/production/web-services/api/Editor/UpdateData',
                model: {
                    value: 'Syncfusion'
                },
                actionBegin: begin,
                actionSuccess: function(e: any) {
                    successArgs = e;
                }
            });
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerText).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(true);
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion' }, name: "actionBegin" });
                expect(successArgs['name']).toEqual('actionSuccess');
                expect(successArgs['value']).toEqual('Syncfusion');
                expect(valueEle.innerText).toEqual('Syncfusion');
                expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(false);
                done();
            }, 4000);
        });
        it('actionBegin eventArgs cancel as true testing', (done: Function) => {
            editorObj = renderEditor({
                primaryKey: 'text',
                mode: 'Inline',
                name: 'Game',
                emptyText: 'Empty',
                adaptor: 'UrlAdaptor',
                url: 'https://ej2services.syncfusion.com/production/web-services/api/Editor/UpdateData',
                model: {
                    value: 'Syncfusion'
                },
                actionBegin: function(e: ActionBeginEventArgs) {
                    e.cancel = true;
                    beginArgs = e;
                }
            });
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerText).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(true);
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion' }, name: "actionBegin", cancel: true });
                expect(valueEle.innerText).toEqual('Empty');
                expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(true);
                expect(editorObj.element.querySelectorAll('.' + classes.INPUT).length > 0).toEqual(true);
                done();
            }, 4000);
        });
        it('actionBegin eventArgs cancel as true with popup mode testing', (done: Function) => {
            editorObj = renderEditor({
                primaryKey: 'text',
                mode: 'Popup',
                name: 'Game',
                emptyText: 'Empty',
                adaptor: 'UrlAdaptor',
                url: 'https://ej2services.syncfusion.com/production/web-services/api/Editor/UpdateData',
                model: {
                    value: 'Syncfusion'
                },
                actionBegin: function(e: ActionBeginEventArgs) {
                    e.cancel = true;
                    beginArgs = e;
                }
            });
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerText).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(false);
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion' }, name: "actionBegin", cancel: true });
                expect(valueEle.innerText).toEqual('Empty');
                expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(false);
                expect(document.querySelectorAll('.' + classes.ROOT_TIP).length > 0).toEqual(true);
                done();
            }, 4000);
        });
        it('actionBegin eventArgs cancel as false testing', (done: Function) => {
            editorObj = renderEditor({
                primaryKey: 'text',
                mode: 'Inline',
                name: 'Game',
                emptyText: 'Empty',
                adaptor: 'UrlAdaptor',
                url: 'https://ej2services.syncfusion.com/production/web-services/api/Editor/UpdateData',
                model: {
                    value: 'Syncfusion'
                },
                actionBegin: function(e: ActionBeginEventArgs) {
                    e.cancel = false;
                    beginArgs = e;
                },
                actionSuccess: success
            });
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerText).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(true);
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion' }, name: "actionBegin", cancel: false });
                expect(successArgs['name']).toEqual('actionSuccess');
                expect(successArgs['value']).toEqual('Syncfusion');
                expect(valueEle.innerText).toEqual('Syncfusion');
                expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(false);
                done();
            }, 4000);
        });
        it('actionBegin eventArgs cancel not configured with testing', (done: Function) => {
            editorObj = renderEditor({
                primaryKey: 'text',
                mode: 'Inline',
                name: 'Game',
                emptyText: 'Empty',
                adaptor: 'UrlAdaptor',
                url: 'https://ej2services.syncfusion.com/production/web-services/api/Editor/UpdateData',
                model: {
                    value: 'Syncfusion'
                },
                actionBegin: begin,
                actionSuccess: success
            });
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerText).toEqual('Empty');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(true);
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion' }, name: "actionBegin" });
                expect(successArgs['name']).toEqual('actionSuccess');
                expect(successArgs['value']).toEqual('Syncfusion');
                expect(valueEle.innerText).toEqual('Syncfusion');
                expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(false);
                done();
            }, 4000);
        });
    });
    describe('EJ2-33001 - Without change value to submit prevent testing ', () => {
        let editorObj: any;
        let ele: HTMLElement
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let beginArgs: any = {};
        let successArgs: any = {};
        function begin(e: any): void {
            beginArgs = e;
        }
        function success(e: any): void {
            successArgs = e;
        }
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                primaryKey: 'text',
                mode: 'Inline',
                name: 'Game',
                adaptor: 'UrlAdaptor',
                url: 'https://ej2services.syncfusion.com/production/web-services/api/Editor/UpdateData',
                value: 'Syncfusion',
                actionBegin: begin,
                actionSuccess: success
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Initial value submit testing', (done: Function) => {
            expect(valueEle.innerText).toEqual('Syncfusion');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(true);
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion' }, name: "actionBegin" });
                expect(successArgs['name']).toEqual('actionSuccess');
                expect(successArgs['value']).toEqual('Syncfusion');
                expect(valueEle.innerText).toEqual('Syncfusion');
                expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(false);
                done();
            }, 4000);
        });
        it('Without change value to submit testing', (done: Function) => {
            successArgs = {};
            expect(valueEle.innerText).toEqual('Syncfusion');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(true);
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion' }, name: "actionBegin" });
                expect(successArgs['name']).toEqual('actionSuccess');
                expect(successArgs['data']).toEqual({});
                expect(valueEle.innerText).toEqual('Syncfusion');
                expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(false);
                done();
            }, 4000);
        });
        it('Without change value to submit testing', (done: Function) => {
            successArgs = {};
            expect(valueEle.innerText).toEqual('Syncfusion');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(true);
            editorObj.componentObj.value = 'Syncfusion1';
            editorObj.componentObj.dataBind();
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion1' }, name: "actionBegin" });
                expect(successArgs['name']).toEqual('actionSuccess');
                expect(successArgs['value']).toEqual('Syncfusion1');
                expect(valueEle.innerText).toEqual('Syncfusion1');
                expect(valueWrapper.classList.contains(classes.HIDE)).toEqual(false);
                done();
            }, 4000);
        });
        it('enableHtmlSanitizer as true', () => {
            editorObj = renderEditor({
                template:"<img src='fail' onerror='alert();' /> test",
                enableHtmlSanitizer: true,
                mode: 'Inline'
            });
            ele = editorObj.element;
            let inputEle: HTMLElement = (<HTMLElement>selectAll('.e-editable-overlay-icon', ele)[0]);
            inputEle.click();
            expect(editorObj.template).toBe('<img src="fail"> test');
            expect((<HTMLElement>selectAll('.e-editable-component', ele)[0]).querySelectorAll('script').length).toBe(0);
        });
    });
    describe('Check enableHtmlSanitizer for value property', () => {
        let ele: HTMLElement;
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('enableHtmlSanitizer', () => {
            editorObj = renderEditor({
            type: 'RTE',
            enableHtmlSanitizer: true,
            value: "<img src='fail' onerror='alert();' /> test",
            });
            ele = editorObj.element;
            expect(ele.querySelector('.e-editable-value').innerHTML).toBe('<img src="fail"> test');
            expect(editorObj.value).toBe('<img src="fail"> test');
        });
    });
});
