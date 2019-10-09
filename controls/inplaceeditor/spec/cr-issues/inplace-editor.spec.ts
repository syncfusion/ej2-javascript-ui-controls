/**
 * InPlace-Editor spec document
 */
import { isNullOrUndefined as isNOU, select, selectAll, createElement, Browser } from '@syncfusion/ej2-base';
import { InPlaceEditor } from '../../src/inplace-editor/base/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy, triggerKeyBoardEvent, safariMobileUA } from './../render.spec';
import { profile, inMB, getMemoryProfile } from './../common.spec';
import { DataManager, WebApiAdaptor, Query } from '@syncfusion/ej2-data';

describe('CR ISSUE InPlace-Editor Control', () => {

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
    })

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
