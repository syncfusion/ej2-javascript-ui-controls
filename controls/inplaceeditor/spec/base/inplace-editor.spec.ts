/**
 * InPlace-Editor spec document
 */
import { isNullOrUndefined as isNOU, select, selectAll, createElement, Browser } from '@syncfusion/ej2-base';
import { InPlaceEditor } from '../../src/inplace-editor/base/index';
import * as classes from '../../src/inplace-editor/base/classes';
import { renderEditor, destroy, triggerKeyBoardEvent, safariMobileUA } from './../render.spec';

describe('InPlace-Editor Control', () => {
    let currentUA: string = navigator.userAgent;
    describe('Root element testing', () => {
        let ele: HTMLElement;
        let editorObj: any;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({});
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Control class testing', () => {
            expect(ele.classList.contains(classes.ROOT)).toEqual(true);
            expect(ele.classList.contains('e-control')).toEqual(true);
        });
        it('Tab index value testing', () => {
            expect(ele.getAttribute('tabindex')).toEqual('0');
        });
        it('Custom attribute availability testing', () => {
            expect(ele.getAttribute('data-underline')).toEqual(null);
        });
        it('Submit prevent method testing', () => {
            editorObj.submitPrevent({ preventDefault: function() {} });
        });
    });
    describe('Model value testing', () => {
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('default value testing', () => {
            editorObj = renderEditor({});
            expect(editorObj.name).toEqual('');
            expect(editorObj.value).toEqual(null);
            expect(editorObj.template).toEqual('');
            expect(editorObj.cssClass).toEqual('');
            expect(editorObj.primaryKey).toEqual('');
            expect(editorObj.emptyText).toEqual('Empty');
            expect(editorObj.url).toEqual('');
            expect(editorObj.mode).toEqual('Popup');
            expect(editorObj.adaptor).toEqual('UrlAdaptor');
            expect(editorObj.type).toEqual('Text');
            expect(editorObj.editableOn).toEqual('Click');
            expect(editorObj.actionOnBlur).toEqual('Submit');
            expect(editorObj.enableRtl).toEqual(false);
            expect(editorObj.enablePersistence).toEqual(false);
            expect(editorObj.disabled).toEqual(false);
            expect(editorObj.showButtons).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(false);
            expect(editorObj.submitOnEnter).toEqual(true);
            expect(editorObj.popupSettings.title).toEqual('');
            expect(editorObj.model).toEqual({});
            expect(editorObj.saveButton).toEqual({ iconCss: 'e-icons e-save-icon' });
            expect(editorObj.cancelButton).toEqual({ iconCss: 'e-icons e-cancel-icon' });
            expect(editorObj.validationRules).toEqual(null);
        });
        it('New model value testing', () => {
            editorObj = renderEditor({
                name: 'comments',
                value: 'MyText',
                cssClass: 'customClass',
                primaryKey: '1',
                emptyText: 'Dummy Text',
                url: 'http://www.google.com',
                mode: 'Inline',
                adaptor: 'ODataV4Adaptor',
                type: 'AutoComplete',
                editableOn: 'DblClick',
                actionOnBlur: 'Cancel',
                enableRtl: true,
                enablePersistence: true,
                disabled: true,
                showButtons: false,
                enableEditMode: true,
                submitOnEnter: false,
                popupSettings: { title: 'Test', model: { content: 'hi' } },
                model: { enableRtl: true },
                saveButton: { iconCss: 'e-icons e-save-icon' },
                cancelButton: { iconCss: 'e-icons e-reset-icon' },
                validationRules: { Game: { required: true } }
            });
            expect(editorObj.name).toEqual('comments');
            expect(editorObj.value).toEqual('MyText');
            expect(editorObj.cssClass).toEqual('customClass');
            expect(editorObj.primaryKey).toEqual('1');
            expect(editorObj.emptyText).toEqual('Dummy Text');
            expect(editorObj.url).toEqual('http://www.google.com');
            expect(editorObj.mode).toEqual('Inline');
            expect(editorObj.adaptor).toEqual('ODataV4Adaptor');
            expect(editorObj.type).toEqual('AutoComplete');
            expect(editorObj.editableOn).toEqual('DblClick');
            expect(editorObj.actionOnBlur).toEqual('Cancel');
            expect(editorObj.enableRtl).toEqual(true);
            expect(editorObj.enablePersistence).toEqual(true);
            expect(editorObj.disabled).toEqual(true);
            expect(editorObj.showButtons).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(true);
            expect(editorObj.submitOnEnter).toEqual(false);
            expect(editorObj.popupSettings.title).toEqual('Test');
            expect(editorObj.model).toEqual({ cssClass: "e-editable-elements", enableRtl: true, value: 'MyText', showClearButton: true });
            expect(editorObj.saveButton).toEqual({ iconCss: 'e-icons e-save-icon' });
            expect(editorObj.cancelButton).toEqual({ iconCss: 'e-icons e-reset-icon' });
            expect(editorObj.validationRules).toEqual({ Game: { required: true } });
        });
    });
    describe('Value element testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueWrapper: HTMLElement;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({});
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Value wrapper availability testing', () => {
            expect(isNOU(valueWrapper)).toEqual(false);
            expect(selectAll('span', valueWrapper).length).toEqual(2);
        });
        it('Value element availability testing', () => {
            expect(isNOU(valueEle)).toEqual(false);
        });
        it('Overlay element availability testing', () => {
            expect(isNOU(select('.' + classes.OVERLAY_ICON, valueWrapper))).toEqual(false);
            expect(isNOU(select('.' + classes.OVERLAY_ICON + '.' + classes.ICONS, valueWrapper))).toEqual(false);
            expect((<HTMLElement>select('.' + classes.OVERLAY_ICON, valueWrapper)).getAttribute('title')).toEqual('Click to edit');
        });
        it('Initial load with hide class availability testing', () => {
            expect(valueEle.classList.contains(classes.HIDE)).toEqual(false);
        });
        it('Initial load with open class availability testing', () => {
            expect(valueEle.classList.contains(classes.OPEN)).toEqual(false);
        });
    });
    describe('Name property testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model value with render testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                type: 'Text'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.name = 'Testing';
            editorObj.dataBind();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            expect(select('input', ele).getAttribute('name')).toEqual('Testing');
            editorObj.name = '';
            editorObj.dataBind();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.name = 'Tests';
            editorObj.dataBind();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            expect(select('input', ele).getAttribute('name')).toEqual('Tests');
        });
        it('Modified model value with render testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                name: 'Game',
                type: 'Text'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            expect(select('input', ele).getAttribute('name')).toEqual('Game');
            editorObj.name = 'Testing';
            editorObj.dataBind();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            expect(select('input', ele).getAttribute('name')).toEqual('Testing');
            editorObj.name = '';
            editorObj.dataBind();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.name = 'Tests';
            editorObj.dataBind();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            expect(select('input', ele).getAttribute('name')).toEqual('Tests');
        });
    });
    describe('Value property testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model value with render testing', () => {
            editorObj = renderEditor({});
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.value = 'Testing';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Testing');
            expect(valueEle.innerHTML).toEqual('Testing');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Empty');
        });
        it('Modified model value with render testing', () => {
            editorObj = renderEditor({
                value: 'Testing'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(select('.' + classes.VALUE, ele).innerHTML).toEqual('Testing');
            editorObj.value = '';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('');
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.value = 'Testing';
            editorObj.dataBind();
            expect(editorObj.value).toEqual('Testing');
            expect(valueEle.innerHTML).toEqual('Testing');
        });
    });
    describe('template property testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let editorObj: InPlaceEditor;
        beforeEach((): void => {
            document.body.appendChild(createElement('input', { className: 'test-input' }));
            document.body.appendChild(createElement('input', { id: 'testInput' }));
            document.body.appendChild(createElement('input', { id: 'myElement' }));
        });
        afterEach((): void => {
            destroy(editorObj);
            editorObj = undefined;
        });
        it('String as "" testing', () => {
            editorObj = renderEditor({
                template: "",
                mode: 'Inline'
            });
            ele = editorObj.element;
            expect(editorObj.type).toEqual('Text');
            expect(editorObj.template).toEqual('');
        });
        it('String as null testing', () => {
            editorObj = renderEditor({
                template: null,
                mode: 'Inline'
            });
            ele = editorObj.element;
            expect(editorObj.type).toEqual('Text');
            expect(editorObj.template).toEqual(null);
            editorObj.template = 'hi';
            editorObj.dataBind();
            expect(editorObj.template).toEqual('hi');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).toEqual('hi');
            editorObj.type = 'Text';
            editorObj.template = '';
            editorObj.dataBind();
            expect(editorObj.type).toEqual('Text');
            expect(editorObj.template).toEqual('');
            valueEle.click();
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).not.toEqual('');
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).not.toEqual('hi');
        });
        it('String as template testing', () => {
            editorObj = renderEditor({
                template: 'hi',
                mode: 'Inline'
            });
            ele = editorObj.element;
            expect(editorObj.template).toEqual('hi');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).toEqual('hi');
            editorObj.type = 'Text';
            editorObj.template = '';
            editorObj.dataBind();
            expect(editorObj.type).toEqual('Text');
            expect(editorObj.template).toEqual('');
            valueEle.click();
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).not.toEqual('');
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).not.toEqual('hi');
            editorObj.template = 'hi';
            editorObj.dataBind();
            expect(editorObj.template).toEqual('hi');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).toEqual('hi');
        });
        it('String element structure as template testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                template: '<div id="myTextElement"></div>'
            });
            ele = editorObj.element;
            expect(editorObj.template).toEqual('<div id="myTextElement"></div>');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            let groupEle: HTMLElement = <HTMLElement>select('.' + classes.INPUT, ele);
            expect(selectAll('#myTextElement', groupEle).length === 1).toEqual(true);
        });
        it('Class selector testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                template: '.test-input'
            });
            ele = editorObj.element;
            expect(editorObj.template).toEqual('.test-input');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect(selectAll('.test-input', document.body).length === 1).toEqual(true);
            expect(selectAll('.test-input', ele).length === 1).toEqual(true);
            editorObj.type = 'Text';
            editorObj.template = '';
            editorObj.dataBind();
            expect(editorObj.type).toEqual('Text');
            expect(editorObj.template).toEqual('');
            expect(selectAll('.test-input', document.body).length === 1).toEqual(true);
            expect(selectAll('.test-input', ele).length < 1).toEqual(true);
            valueEle.click();
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).not.toEqual('');
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).not.toEqual('hi');
            editorObj.template = '.test-input';
            editorObj.dataBind();
            expect(editorObj.template).toEqual('.test-input');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect(selectAll('.test-input', document.body).length === 1).toEqual(true);
            expect(selectAll('.test-input', ele).length === 1).toEqual(true);
        });
        it('Class element not availability testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                template: '.test-inputs'
            });
            ele = editorObj.element;
            expect(editorObj.template).toEqual('.test-inputs');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).toEqual('.test-inputs');
        });
        it('Id selector testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                template: '#testInput'
            });
            ele = editorObj.element;
            expect(editorObj.template).toEqual('#testInput');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect(selectAll('#testInput', document.body).length === 1).toEqual(true);
            expect(selectAll('#testInput', ele).length === 1).toEqual(true);
            editorObj.type = 'Text';
            editorObj.template = '';
            editorObj.dataBind();
            expect(editorObj.type).toEqual('Text');
            expect(editorObj.template).toEqual('');
            expect(selectAll('#testInput', document.body).length === 1).toEqual(true);
            expect(selectAll('#testInput', ele).length < 1).toEqual(true);
            valueEle.click();
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).not.toEqual('');
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).not.toEqual('hi');
            editorObj.template = '#testInput';
            editorObj.dataBind();
            expect(editorObj.template).toEqual('#testInput');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect(selectAll('#testInput', document.body).length === 1).toEqual(true);
            expect(selectAll('#testInput', ele).length === 1).toEqual(true);
        });
        it('Id element not availability testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                template: '#testInputs'
            });
            ele = editorObj.element;
            expect(editorObj.template).toEqual('#testInputs');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect((<HTMLElement>select('.' + classes.INPUT, ele)).innerHTML).toEqual('#testInputs');
        });
        it('HtmlElement as template testing', () => {
            let trgEle: HTMLElement = <HTMLElement>select('#myElement', document.body);
            editorObj = renderEditor({
                mode: 'Inline',
                template: trgEle
            });
            ele = editorObj.element;
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            let groupEle: HTMLElement = <HTMLElement>select('.' + classes.INPUT, ele);
            expect(selectAll('#myElement', groupEle).length === 1).toEqual(true);
        });
    });
    describe('cssClass property testing', () => {
        let ele: HTMLElement;
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({});
            ele = editorObj.element;
            editorObj.cssClass = '';
            editorObj.dataBind();
            expect(ele.classList.contains('e-one')).toEqual(false);
            editorObj.cssClass = 'e-one';
            editorObj.dataBind();
            expect(ele.classList.contains('e-one')).toEqual(true);
            editorObj.cssClass = '';
            editorObj.dataBind();
            expect(ele.classList.contains('e-one')).toEqual(false);
            editorObj.cssClass = 'e-one';
            editorObj.dataBind();
            expect(ele.classList.contains('e-one')).toEqual(true);
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                cssClass: 'e-one'
            });
            ele = editorObj.element;
            expect(ele.classList.contains('e-one')).toEqual(true);
            editorObj.cssClass = '';
            editorObj.dataBind();
            expect(ele.classList.contains('e-one')).toEqual(false);
            editorObj.cssClass = 'e-one';
            editorObj.dataBind();
            expect(ele.classList.contains('e-one')).toEqual(true);
            editorObj.cssClass = '';
            editorObj.dataBind();
            expect(ele.classList.contains('e-one')).toEqual(false);
            editorObj.cssClass = 'e-one';
            editorObj.dataBind();
            expect(ele.classList.contains('e-one')).toEqual(true);
        });
        it('OnProperty with different class testing', () => {
            editorObj = renderEditor({
                cssClass: 'e-one'
            });
            ele = editorObj.element;
            expect(ele.classList.contains('e-one')).toEqual(true);
            editorObj.cssClass = 'e-two';
            editorObj.dataBind();
            expect(ele.classList.contains('e-one')).toEqual(false);
            expect(ele.classList.contains('e-two')).toEqual(true);
            editorObj.cssClass = 'e-three';
            editorObj.dataBind();
            expect(ele.classList.contains('e-one')).toEqual(false);
            expect(ele.classList.contains('e-two')).toEqual(false);
            expect(ele.classList.contains('e-three')).toEqual(true);
            editorObj.cssClass = '';
            editorObj.dataBind();
            expect(ele.classList.contains('e-one')).toEqual(false);
            expect(ele.classList.contains('e-two')).toEqual(false);
            expect(ele.classList.contains('e-three')).toEqual(false);
        });
    });
    describe('primaryKey property testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({});
            ele = editorObj.element;
            expect(editorObj.primaryKey).toEqual('');
            editorObj.primaryKey = 'name';
            editorObj.dataBind();
            expect(editorObj.primaryKey).toEqual('name');
            editorObj.primaryKey = '';
            editorObj.dataBind();
            expect(editorObj.primaryKey).toEqual('');
            editorObj.primaryKey = null;
            editorObj.dataBind();
            expect(editorObj.primaryKey).toEqual(null);
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                primaryKey: 'Test'
            });
            expect(editorObj.primaryKey).toEqual('Test');
            editorObj.primaryKey = 'name';
            editorObj.dataBind();
            expect(editorObj.primaryKey).toEqual('name');
            editorObj.primaryKey = '';
            editorObj.dataBind();
            expect(editorObj.primaryKey).toEqual('');
            editorObj.primaryKey = null;
            editorObj.dataBind();
            expect(editorObj.primaryKey).toEqual(null);
            editorObj.primaryKey = 'Testing';
            editorObj.dataBind();
            expect(editorObj.primaryKey).toEqual('Testing');
        });
    });
    describe('emptyText property testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({});
            ele = editorObj.element;
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.emptyText = 'Testing';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('Testing');
            editorObj.emptyText = '';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('');
            editorObj.emptyText = 'Dummy';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('Dummy');
            editorObj.value = 'Edit';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('Edit');
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                emptyText: 'Click to edit'
            });
            ele = editorObj.element;
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            expect(valueEle.innerHTML).toEqual('Click to edit');
            editorObj.emptyText = 'Testing';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('Testing');
            editorObj.emptyText = '';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('');
            editorObj.emptyText = 'Dummy';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('Dummy');
            editorObj.value = 'Edit';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('Edit');
        });
        it('Value property with testing', () => {
            editorObj = renderEditor({
                emptyText: 'Click to edit',
                value: 'Edit Me'
            });
            ele = editorObj.element;
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            expect(valueEle.innerHTML).toEqual('Edit Me');
            editorObj.emptyText = 'Testing';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('Edit Me');
            editorObj.emptyText = '';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('Edit Me');
            editorObj.emptyText = 'Dummy';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('Edit Me');
            editorObj.value = 'Edit';
            editorObj.dataBind();
            expect(valueEle.innerHTML).toEqual('Edit');
        });
    });
    describe('url property testing', () => {
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({});
            expect(editorObj.url).toEqual('');
            editorObj.url = 'https://www.google.com';
            editorObj.dataBind();
            expect(editorObj.url).toEqual('https://www.google.com');
            editorObj.url = '';
            editorObj.dataBind();
            expect(editorObj.url).toEqual('');
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                url: 'https://www.google.com'
            });
            expect(editorObj.url).toEqual('https://www.google.com');
            editorObj.url = '';
            editorObj.dataBind();
            expect(editorObj.url).toEqual('');
            editorObj.url = 'https://www.google.com';
            editorObj.dataBind();
            expect(editorObj.url).toEqual('https://www.google.com');
        });
    });
    describe('mode property testing', () => {
        let ele: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueEle: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({});
            ele = editorObj.element;
            expect(editorObj.mode).toEqual('Popup');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect(selectAll('.' + classes.ROOT_TIP, document.body).length === 1).toEqual(true);
            editorObj.mode = 'Inline';
            editorObj.dataBind();
            expect(editorObj.mode).toEqual('Inline');
            valueEle.click();
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(true);
            editorObj.mode = 'Popup';
            editorObj.dataBind();
            expect(editorObj.mode).toEqual('Popup');
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            expect(editorObj.mode).toEqual('Inline');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(true);
            editorObj.mode = 'Popup';
            editorObj.dataBind();
            expect(editorObj.mode).toEqual('Popup');
            valueEle.click();
            expect(selectAll('.' + classes.ROOT_TIP, document.body).length === 1).toEqual(true);
            editorObj.mode = 'Inline';
            editorObj.dataBind();
            expect(editorObj.mode).toEqual('Inline');
            valueEle.click();
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(true);
        });
    });
    describe('adaptor property testing', () => {
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({});
            expect(editorObj.adaptor).toEqual('UrlAdaptor');
            editorObj.adaptor = 'ODataV4Adaptor';
            editorObj.dataBind();
            expect(editorObj.adaptor).toEqual('ODataV4Adaptor');
            editorObj.adaptor = 'UrlAdaptor';
            editorObj.dataBind();
            expect(editorObj.adaptor).toEqual('UrlAdaptor');
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                adaptor: 'ODataV4Adaptor'
            });
            expect(editorObj.adaptor).toEqual('ODataV4Adaptor');
            editorObj.adaptor = 'UrlAdaptor';
            editorObj.dataBind();
            expect(editorObj.adaptor).toEqual('UrlAdaptor');
            editorObj.adaptor = 'ODataV4Adaptor';
            editorObj.dataBind();
            expect(editorObj.adaptor).toEqual('ODataV4Adaptor');
        });
    });
    describe('type property testing', () => {
        let ele: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueEle: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            expect(editorObj.type).toEqual('Text');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect(selectAll('.e-textbox', ele).length === 1).toEqual(true);
            editorObj.type = 'Date';
            editorObj.dataBind();
            expect(editorObj.type).toEqual('Date');
            valueEle.click();
            expect(selectAll('.e-datepicker', ele).length === 1).toEqual(true);
            editorObj.type = 'Text';
            editorObj.dataBind();
            expect(editorObj.type).toEqual('Text');
            valueEle.click();
            expect(selectAll('.e-textbox', ele).length === 1).toEqual(true);
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                type: 'Date',
                mode: 'Inline'
            });
            ele = editorObj.element;
            expect(editorObj.type).toEqual('Date');
            valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
            valueEle.click();
            expect(selectAll('.e-datepicker', ele).length === 1).toEqual(true);
            editorObj.type = 'Text';
            editorObj.dataBind();
            expect(editorObj.type).toEqual('Text');
            valueEle.click();
            expect(selectAll('.e-textbox', ele).length === 1).toEqual(true);
            editorObj.type = 'Date';
            editorObj.dataBind();
            expect(editorObj.type).toEqual('Date');
            valueEle.click();
            expect(selectAll('.e-datepicker', ele).length === 1).toEqual(true);
        });
    });
    describe('editableOn property testing', () => {
        let ele: HTMLElement;
        let editorObj: any;
        let valueWrapper: HTMLElement;
        let valueEle: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('editableOn as "EditIconClick" with testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                editableOn: 'EditIconClick'
            });
            ele = editorObj.element;
            let editIconEle: HTMLElement = <HTMLElement>select('.' + classes.OVERLAY_ICON, ele);
            expect(editIconEle.getAttribute('title')).toEqual('Click to edit');
            expect(ele.getAttribute('title')).toEqual(null);
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            editorObj.editableOn = 'Click';
            editorObj.dataBind();
            expect(ele.getAttribute('title')).toEqual('Click to edit');
            valueWrapper.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.editableOn = 'DblClick';
            editorObj.dataBind();
            expect(ele.getAttribute('title')).toEqual('Double click to edit');
            valueWrapper.dispatchEvent(new MouseEvent("dblclick"));
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
        });
        it('editableOn as "Click" with testing', () => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            let editIconEle: HTMLElement = <HTMLElement>select('.' + classes.OVERLAY_ICON, ele);
            expect(editIconEle.getAttribute('title')).toEqual('Click to edit');
            expect(ele.getAttribute('title')).toEqual('Click to edit');
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.editableOn = 'EditIconClick';
            editorObj.dataBind();
            expect(ele.getAttribute('title')).toEqual(null);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            editorObj.editableOn = 'DblClick';
            editorObj.dataBind();
            expect(ele.getAttribute('title')).toEqual('Double click to edit');
            valueWrapper.dispatchEvent(new MouseEvent("dblclick"));
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
        });
        it('editableOn as "DblClick" with testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                editableOn: 'DblClick'
            });
            ele = editorObj.element;
            let editIconEle: HTMLElement = <HTMLElement>select('.' + classes.OVERLAY_ICON, ele);
            expect(editIconEle.getAttribute('title')).toEqual('Click to edit');
            expect(ele.getAttribute('title')).toEqual('Double click to edit');
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueWrapper.dispatchEvent(new MouseEvent("dblclick"));
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.editableOn = 'EditIconClick';
            editorObj.dataBind();
            expect(ele.getAttribute('title')).toEqual(null);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            editorObj.editableOn = 'Click';
            editorObj.dataBind();
            expect(ele.getAttribute('title')).toEqual('Click to edit');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
        });
        it('IOS - editableOn as "DblClick" with single tap testing', () => {
            Browser.userAgent = safariMobileUA;
            editorObj = renderEditor({
                mode: 'Inline',
                editableOn: 'DblClick'
            });
            ele = editorObj.element;
            let editIconEle: HTMLElement = <HTMLElement>select('.' + classes.OVERLAY_ICON, ele);
            expect(editIconEle.getAttribute('title')).toEqual('Click to edit');
            expect(ele.getAttribute('title')).toEqual('Double click to edit');
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            editorObj.doubleTapHandler({ tapCount: 1, originalEvent: { stopPropagation: function() {} } });
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            editorObj.editableOn = 'EditIconClick';
            editorObj.dataBind();
            expect(ele.getAttribute('title')).toEqual(null);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            editorObj.editableOn = 'Click';
            editorObj.dataBind();
            expect(ele.getAttribute('title')).toEqual('Click to edit');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            Browser.userAgent = currentUA;
        });
        it('IOS - editableOn as "DblClick" with double tap testing', () => {
            Browser.userAgent = safariMobileUA;
            editorObj = renderEditor({
                mode: 'Inline',
                editableOn: 'DblClick'
            });
            ele = editorObj.element;
            let editIconEle: HTMLElement = <HTMLElement>select('.' + classes.OVERLAY_ICON, ele);
            expect(editIconEle.getAttribute('title')).toEqual('Click to edit');
            expect(ele.getAttribute('title')).toEqual('Double click to edit');
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            editorObj.doubleTapHandler({ tapCount: 2, originalEvent: { stopPropagation: function() {} } });
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.editableOn = 'EditIconClick';
            editorObj.dataBind();
            expect(ele.getAttribute('title')).toEqual(null);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            editorObj.editableOn = 'Click';
            editorObj.dataBind();
            expect(ele.getAttribute('title')).toEqual('Click to edit');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            Browser.userAgent = currentUA;
        });
    });
    describe('actionOnBlur with document click testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('actionOnBlur as submit testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline',
                actionOnBlur: 'Submit'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            let args: any = { target: document.body }
            editorObj.docClickHandler(args);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            done();
        });
        it('actionOnBlur as cancel testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline',
                actionOnBlur: 'Cancel'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            let args: any = { target: document.body }
            editorObj.docClickHandler(args);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            done();
        });
        it('actionOnBlur as cancel testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline',
                actionOnBlur: 'Ignore'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            let args: any = { target: document.body }
            editorObj.docClickHandler(args);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            done();
        });
        it('Clear icon as target with docClickEvent testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            let inputEle: HTMLElement = (<HTMLElement>select('input', ele));
            inputEle.focus();
            (<HTMLElement>select('.e-clear-icon', ele)).dispatchEvent(new MouseEvent("mousedown"));
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            let args: any = { target: select('.e-clear-icon', ele) };
            editorObj.docClickHandler(args);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.isClearTarget = true;
            let args1: any = { target: select('.e-clear-icon', ele) };
            editorObj.docClickHandler(args1);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            done();
        });
    });
    describe('enableRtl property testing', () => {
        let ele: HTMLElement;
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('enableRtl as "false" with class testing', () => {
            editorObj = renderEditor({
                enableRtl: false
            });
            ele = editorObj.element;
            expect(editorObj.enableRtl).toEqual(false);
            expect(editorObj.element.classList.contains(classes.RTL)).toEqual(false);
            editorObj.enableRtl = true;
            editorObj.dataBind();
            expect(editorObj.enableRtl).toEqual(true);
            expect(editorObj.element.classList.contains(classes.RTL)).toEqual(true);
            editorObj.enableRtl = false;
            editorObj.dataBind();
            expect(editorObj.enableRtl).toEqual(false);
            expect(editorObj.element.classList.contains(classes.RTL)).toEqual(false);
        });
        it('enableRtl as "true" with class testing', () => {
            editorObj = renderEditor({
                enableRtl: true
            });
            ele = editorObj.element;
            expect(editorObj.enableRtl).toEqual(true);
            expect(editorObj.element.classList.contains(classes.RTL)).toEqual(true);
            editorObj.enableRtl = false;
            editorObj.dataBind();
            expect(editorObj.enableRtl).toEqual(false);
            expect(editorObj.element.classList.contains(classes.RTL)).toEqual(false);
            editorObj.enableRtl = true;
            editorObj.dataBind();
            expect(editorObj.enableRtl).toEqual(true);
            expect(editorObj.element.classList.contains(classes.RTL)).toEqual(true);
        });
    });
    describe('enablePersistence property testing', () => {
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({});
            expect(editorObj.enablePersistence).toEqual(false);
            editorObj.enablePersistence = true;
            editorObj.dataBind();
            expect(editorObj.enablePersistence).toEqual(true);
            editorObj.enablePersistence = false;
            editorObj.dataBind();
            expect(editorObj.enablePersistence).toEqual(false);
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                enablePersistence: true
            });
            expect(editorObj.enablePersistence).toEqual(true);
            editorObj.enablePersistence = false;
            editorObj.dataBind();
            expect(editorObj.enablePersistence).toEqual(false);
            editorObj.enablePersistence = true;
            editorObj.dataBind();
            expect(editorObj.enablePersistence).toEqual(true);
        });
    });
    describe('disabled property testing', () => {
        let ele: HTMLElement;
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Initial load "disabled as false" with disable class testing', () => {
            editorObj = renderEditor({
                disabled: false
            });
            ele = editorObj.element;
            expect(ele.classList.contains(classes.DISABLE)).toEqual(false);
            editorObj.disabled = true;
            editorObj.dataBind();
            expect(ele.classList.contains(classes.DISABLE)).toEqual(true);
            editorObj.disabled = false;
            editorObj.dataBind();
            expect(ele.classList.contains(classes.DISABLE)).toEqual(false);
        });
        it('Initial load "disabled as true" with disable class testing', () => {
            editorObj = renderEditor({
                disabled: true
            });
            ele = editorObj.element;
            expect(ele.classList.contains(classes.DISABLE)).toEqual(true);
            editorObj.disabled = false;
            editorObj.dataBind();
            expect(ele.classList.contains(classes.DISABLE)).toEqual(false);
            editorObj.disabled = true;
            editorObj.dataBind();
            expect(ele.classList.contains(classes.DISABLE)).toEqual(true);
        });
    });
    describe('Inline - showButtons property testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let editorObj: InPlaceEditor;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline',
                showButtons: false
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('ShowButtons as "false" with testing', (done: Function) => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            setTimeout(() => {
                expect(selectAll('.' + classes.BUTTONS, ele).length === 1).toEqual(false);
                done();
            }, 400);
        });
        it('ShowButtons as "true" with testing', (done: Function) => {
            editorObj.showButtons = true;
            editorObj.dataBind();
            expect(valueEle.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            valueEle.click();
            setTimeout(() => {
                expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
                expect(editorObj.enableEditMode).toEqual(true);
                expect(selectAll('.' + classes.BUTTONS, ele).length === 1).toEqual(true);
                done();
            }, 400);
        });
        it('ShowButtons as "false" with testing', (done: Function) => {
            editorObj.showButtons = false;
            editorObj.dataBind();
            expect(valueEle.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            setTimeout(() => {
                expect(selectAll('.' + classes.BUTTONS, ele).length === 1).toEqual(false);
                done();
            }, 400);
        });
    });
    // describe('Popup - showButtons property testing', () => {
    //     let ele: HTMLElement;
    //     let valueEle: HTMLElement;
    //     let editorObj: InPlaceEditor;
    //     beforeAll((done: Function): void => {
    //         editorObj = renderEditor({
    //             mode: 'Popup',
    //             showButtons: false
    //         });
    //         ele = editorObj.element;
    //         done();
    //     });
    //     afterAll((): void => {
    //         destroy(editorObj);
    //     });
    //     it('ShowButtons as "false" with testing', (done: Function) => {
    //         valueEle = <HTMLElement>select('.' + classes.VALUE, ele);
    //         valueEle.click();
    //         expect(valueEle.classList.contains(classes.OPEN)).toEqual(true);
    //         setTimeout(() => {
    //             let tipEle: HTMLElement = <HTMLElement>select('.' + classes.ROOT_TIP, document.body);
    //             expect(selectAll('.' + classes.BUTTONS, tipEle).length === 1).toEqual(false);
    //             done();
    //         }, 400);
    //     });
    //     it('ShowButtons as "true" with testing', (done: Function) => {
    //         editorObj.showButtons = true;
    //         editorObj.dataBind();
    //         expect(valueEle.classList.contains(classes.OPEN)).toEqual(false);
    //         valueEle.click();
    //         expect(valueEle.classList.contains(classes.OPEN)).toEqual(true);
    //         setTimeout(() => {
    //             let tipEle: HTMLElement = <HTMLElement>select('.' + classes.ROOT_TIP, document.body);
    //             expect(selectAll('.' + classes.BUTTONS, tipEle).length === 1).toEqual(true);
    //             done();
    //         }, 400);
    //     });
    //     it('ShowButtons as "false" with testing', (done: Function) => {
    //         editorObj.showButtons = false;
    //         editorObj.dataBind();
    //         expect(valueEle.classList.contains(classes.OPEN)).toEqual(false);
    //         valueEle.click();
    //         expect(valueEle.classList.contains(classes.OPEN)).toEqual(true);
    //         setTimeout(() => {
    //             let tipEle: HTMLElement = <HTMLElement>select('.' + classes.ROOT_TIP, document.body);
    //             expect(selectAll('.' + classes.BUTTONS, tipEle).length === 1).toEqual(false);
    //             done();
    //         }, 400);
    //     });
    // });
    describe('enableEditMode property testing', () => {
        let ele: HTMLElement;
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Initial load with editor availability testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                enableEditMode: true
            });
            ele = editorObj.element;
            expect(editorObj.enableEditMode).toEqual(true);
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(true);
            editorObj.enableEditMode = false;
            editorObj.dataBind();
            expect(editorObj.enableEditMode).toEqual(false);
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(false);
            editorObj.enableEditMode = true;
            editorObj.dataBind();
            expect(editorObj.enableEditMode).toEqual(true);
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(true);
            editorObj.mode = 'Popup';
            editorObj.dataBind();
            expect(editorObj.enableEditMode).toEqual(false);
            expect(selectAll('.' + classes.ROOT_TIP, document.body).length === 1).toEqual(false);
            editorObj.mode = 'Inline';
            editorObj.dataBind();
            expect(editorObj.enableEditMode).toEqual(false);
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(false);
            editorObj.mode = 'Popup';
            editorObj.dataBind();
            expect(editorObj.enableEditMode).toEqual(false);
            expect(selectAll('.' + classes.ROOT_TIP, document.body).length === 1).toEqual(false);
        });
        it('OnPropertyChange with editor availability testing', () => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            expect(editorObj.enableEditMode).toEqual(false);
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(false);
            editorObj.enableEditMode = true;
            editorObj.dataBind();
            expect(editorObj.enableEditMode).toEqual(true);
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(true);
            editorObj.enableEditMode = false;
            editorObj.dataBind();
            expect(editorObj.enableEditMode).toEqual(false);
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(false);
            editorObj.enableEditMode = true;
            editorObj.dataBind();
            expect(editorObj.enableEditMode).toEqual(true);
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(true);
            editorObj.mode = 'Popup';
            editorObj.dataBind();
            expect(editorObj.enableEditMode).toEqual(false);
            expect(selectAll('.' + classes.ROOT_TIP, document.body).length === 1).toEqual(false);
            editorObj.mode = 'Inline';
            editorObj.dataBind();
            expect(editorObj.enableEditMode).toEqual(false);
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(false);
            editorObj.mode = 'Popup';
            editorObj.dataBind();
            expect(editorObj.enableEditMode).toEqual(false);
            expect(selectAll('.' + classes.ROOT_TIP, document.body).length === 1).toEqual(false);
        });
    });
    describe('submitOnEnter property testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({
                mode: "Inline"
            });
            ele = editorObj.element;
            expect(editorObj.submitOnEnter).toEqual(true);
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            triggerKeyBoardEvent(select('input', ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            editorObj.submitOnEnter = false;
            editorObj.dataBind();
            expect(editorObj.submitOnEnter).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            triggerKeyBoardEvent(select('input', ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.submitOnEnter = true;
            editorObj.dataBind();
            expect(editorObj.submitOnEnter).toEqual(true);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            triggerKeyBoardEvent(select('input', ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                submitOnEnter: false,
                mode: 'Inline'
            });
            ele = editorObj.element;
            expect(editorObj.submitOnEnter).toEqual(false);
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            triggerKeyBoardEvent(select('input', ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.submitOnEnter = true;
            editorObj.dataBind();
            expect(editorObj.submitOnEnter).toEqual(true);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            triggerKeyBoardEvent(select('input', ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            editorObj.submitOnEnter = false;
            editorObj.dataBind();
            expect(editorObj.submitOnEnter).toEqual(false);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            triggerKeyBoardEvent(select('input', ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
        });
    });
    describe('PopupSettings property testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({});
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(editorObj.popupSettings.title).toEqual('');
            expect(selectAll('.' + classes.ROOT_TIP + ' .' + classes.TITLE, document.body).length === 1).toEqual(false);
            editorObj.popupSettings.title = 'Edit';
            editorObj.dataBind();
            expect(editorObj.popupSettings.title).toEqual('Edit');
            valueEle.click();
            expect(selectAll('.' + classes.ROOT_TIP + ' .' + classes.TITLE, document.body).length === 1).toEqual(true);
            editorObj.popupSettings.title = '';
            editorObj.dataBind();
            expect(editorObj.popupSettings.title).toEqual('');
            valueEle.click();
            expect(selectAll('.' + classes.ROOT_TIP + ' .' + classes.TITLE, document.body).length === 1).toEqual(false);
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                popupSettings: {
                    title: 'Edit'
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.popupSettings.title).toEqual('Edit');
            valueEle.click();
            expect(selectAll('.' + classes.ROOT_TIP + ' .' + classes.TITLE, document.body).length === 1).toEqual(true);
            editorObj.popupSettings.title = '';
            editorObj.dataBind();
            expect(editorObj.popupSettings.title).toEqual('');
            valueEle.click();
            expect(selectAll('.' + classes.ROOT_TIP + ' .' + classes.TITLE, document.body).length === 1).toEqual(false);
            editorObj.popupSettings.title = 'Edits';
            editorObj.dataBind();
            expect(editorObj.popupSettings.title).toEqual('Edits');
            valueEle.click();
            expect(selectAll('.' + classes.ROOT_TIP + ' .' + classes.TITLE, document.body).length === 1).toEqual(true);
        });
    });
    describe('saveButton property testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.saveButton).toEqual({ iconCss: 'e-icons e-save-icon' });
            valueEle.click();
            expect(selectAll('button', ele).length === 2).toEqual(true);
            expect(selectAll('.e-save-icon', ele).length === 1).toEqual(true);
            editorObj.saveButton = { iconCss: 'e-icons e-saves-icon' };
            editorObj.dataBind();
            expect(editorObj.saveButton).toEqual({ iconCss: 'e-icons e-saves-icon' });
            valueEle.click();
            expect(selectAll('button', ele).length === 2).toEqual(true);
            expect(selectAll('.e-saves-icon', ele).length === 1).toEqual(true);
            editorObj.saveButton = {};
            editorObj.dataBind();
            expect(editorObj.saveButton).toEqual({});
            valueEle.click();
            expect(selectAll('button', ele).length === 1).toEqual(true);
            editorObj.saveButton = { iconCss: 'e-icons e-saves-icon' };
            editorObj.dataBind();
            expect(editorObj.saveButton).toEqual({ iconCss: 'e-icons e-saves-icon' });
            valueEle.click();
            expect(selectAll('button', ele).length === 2).toEqual(true);
            expect(selectAll('.e-saves-icon', ele).length === 1).toEqual(true);
            editorObj.saveButton = { content: 'Ok' };
            editorObj.dataBind();
            expect(editorObj.saveButton).toEqual({ content: 'Ok' });
            valueEle.click();
            expect(selectAll('button', ele).length === 2).toEqual(true);
            expect(select('button', ele).classList.contains('e-primary')).toEqual(true);
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                saveButton: { iconCss: 'e-icons e-saves-icon' }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.saveButton).toEqual({ iconCss: 'e-icons e-saves-icon' });
            valueEle.click();
            expect(selectAll('button', ele).length === 2).toEqual(true);
            expect(selectAll('.e-saves-icon', ele).length === 1).toEqual(true);
            editorObj.saveButton = {};
            editorObj.dataBind();
            expect(editorObj.saveButton).toEqual({});
            valueEle.click();
            expect(selectAll('button', ele).length === 1).toEqual(true);
            editorObj.saveButton = { iconCss: 'e-icons e-save-icon' };
            editorObj.dataBind();
            expect(editorObj.saveButton).toEqual({ iconCss: 'e-icons e-save-icon' });
            valueEle.click();
            expect(selectAll('button', ele).length === 2).toEqual(true);
            expect(selectAll('.e-save-icon', ele).length === 1).toEqual(true);
            editorObj.saveButton = { content: 'Ok' };
            editorObj.dataBind();
            expect(editorObj.saveButton).toEqual({ content: 'Ok' });
            valueEle.click();
            expect(selectAll('button', ele).length === 2).toEqual(true);
            expect(select('button', ele).classList.contains('e-primary')).toEqual(true);
        });
    });
    describe('cancelButton property testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.cancelButton).toEqual({ iconCss: 'e-icons e-cancel-icon' });
            valueEle.click();
            expect(selectAll('button', ele).length === 2).toEqual(true);
            expect(selectAll('.e-cancel-icon', ele).length === 1).toEqual(true);
            editorObj.cancelButton = { iconCss: 'e-icons e-reset-icon' };
            editorObj.dataBind();
            expect(editorObj.cancelButton).toEqual({ iconCss: 'e-icons e-reset-icon' });
            valueEle.click();
            expect(selectAll('button', ele).length === 2).toEqual(true);
            expect(selectAll('.e-reset-icon', ele).length === 1).toEqual(true);
            editorObj.cancelButton = {};
            editorObj.dataBind();
            expect(editorObj.cancelButton).toEqual({});
            valueEle.click();
            expect(selectAll('button', ele).length === 1).toEqual(true);
            editorObj.cancelButton = { iconCss: 'e-icons e-cancel-icon' };
            editorObj.dataBind();
            expect(editorObj.cancelButton).toEqual({ iconCss: 'e-icons e-cancel-icon' });
            valueEle.click();
            expect(selectAll('button', ele).length === 2).toEqual(true);
            expect(selectAll('.e-cancel-icon', ele).length === 1).toEqual(true);
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                mode: 'Inline',
                cancelButton: { iconCss: 'e-icons e-reset-icon' }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(editorObj.cancelButton).toEqual({ iconCss: 'e-icons e-reset-icon' });
            valueEle.click();
            expect(selectAll('button', ele).length === 2).toEqual(true);
            expect(selectAll('.e-reset-icon', ele).length === 1).toEqual(true);
            editorObj.cancelButton = {};
            editorObj.dataBind();
            expect(editorObj.cancelButton).toEqual({});
            valueEle.click();
            expect(selectAll('button', ele).length === 1).toEqual(true);
            editorObj.cancelButton = { iconCss: 'e-icons e-cancel-icon' };
            editorObj.dataBind();
            expect(editorObj.cancelButton).toEqual({ iconCss: 'e-icons e-cancel-icon' });
            valueEle.click();
            expect(selectAll('button', ele).length === 2).toEqual(true);
            expect(selectAll('.e-cancel-icon', ele).length === 1).toEqual(true);
        });
    });
    describe('validationRules property testing', () => {
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Default model with testing', () => {
            editorObj = renderEditor({});
            expect(editorObj.validationRules).toEqual(null);
            editorObj.validationRules = { Game: { required: true } };
            editorObj.dataBind();
            expect(editorObj.validationRules).toEqual({ Game: { required: true } });
            editorObj.validationRules = {};
            editorObj.dataBind();
            expect(editorObj.validationRules).toEqual({});
        });
        it('Modified model with testing', () => {
            editorObj = renderEditor({
                validationRules: { Game: { required: true } }
            });
            expect(editorObj.validationRules).toEqual({ Game: { required: true } });
            editorObj.validationRules = {};
            editorObj.dataBind();
            expect(editorObj.validationRules).toEqual({});
            editorObj.validationRules = { Game: { required: true } };
            editorObj.dataBind();
            expect(editorObj.validationRules).toEqual({ Game: { required: true } });
        });
    });
    describe('save method testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Without template to save testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.save();
            expect(valueEle.innerHTML).toEqual('Empty');
            done();
        });
        it('Template with save testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline',
                template: '<input />'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            (<HTMLInputElement>select('input', this.element)).focus();
            (<HTMLInputElement>select('input', this.element)).value = 'Test';
            editorObj.element.focus();
            editorObj.save();
            expect(valueEle.innerHTML).toEqual('Empty');
            editorObj.value = 'Testing'
            editorObj.dataBind();
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.save();
            expect(valueEle.innerHTML).toEqual('Testing');
            done();
        });
    });
    describe('validate method testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Without rules property to validate testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.validate();
            expect(select('.' + classes.FORM, this.element).classList.contains(classes.ERROR)).toEqual(false);
            expect(select('.e-input-group', this.element).classList.contains(classes.ERROR)).toEqual(false);
            done();
        });
        it('TextBox open with empty text to validate with error class testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline',
                name: 'Game',
                validationRules: {
                    Game: { required: true }
                }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.validate();
            expect(select('.' + classes.FORM, this.element).classList.contains(classes.ERROR)).toEqual(true);
            expect(select('.e-input-group', this.element).classList.contains(classes.ERROR)).toEqual(true);
            done();
        });
    });
    describe('destroy method testing', () => {
        let editorObj: InPlaceEditor;
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('destroy', () => {
            editorObj = renderEditor({});
            editorObj.destroy();
            expect(isNOU(select('.' + classes.ROOT, document.body))).toEqual(true);
            expect(isNOU(select('.' + classes.VALUE_WRAPPER, document.body))).toEqual(true);
            expect(isNOU(select('.' + classes.VALUE, document.body))).toEqual(true);
            expect(isNOU(select('.' + classes.OVERLAY_ICON, document.body))).toEqual(true);
        });
    });
    describe('Event testing', () => {
        let index: number = 0;
        let editorObj: InPlaceEditor;
        function add() {
            index = index + 1;
        }
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('created', () => {
            expect(index).toEqual(0);
            editorObj = renderEditor({
                created: add
            });
            expect(index).toEqual(1);
        });
        it('destroy', () => {
            expect(index).toEqual(1);
            editorObj = renderEditor({
                destroyed: add
            });
            editorObj.destroy();
            expect(index).toEqual(2);
        });
    });
    describe('Keyboard action to editor open/close testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let editorObj: InPlaceEditor;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Enter key to open testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            editorObj.element.focus();
            triggerKeyBoardEvent(editorObj.element, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            done();
        });
        it('Enter key to close testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            let inputEle: HTMLElement = (<HTMLElement>select('input', ele));
            inputEle.focus();
            triggerKeyBoardEvent(inputEle, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            done();
        });
        it('Escape key to close testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            let inputEle: HTMLElement = (<HTMLElement>select('input', ele));
            inputEle.focus();
            triggerKeyBoardEvent(inputEle, 27);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            done();
        });
        it('Other key to editor availability testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            let inputEle: HTMLElement = (<HTMLElement>select('input', ele));
            inputEle.focus();
            triggerKeyBoardEvent(inputEle, 18);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            done();
        });
    });
    describe('MouseDown to clear button click with editor availability testing', () => {
        let editorObj: any;
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Clear icon as target to testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            let inputEle: HTMLElement = (<HTMLElement>select('input', ele));
            inputEle.focus();
            (<HTMLElement>select('.e-clear-icon', ele)).dispatchEvent(new MouseEvent("mousedown"));
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            done();
        });
        it('mousedown event with clear icon testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            let inputEle: HTMLElement = (<HTMLElement>select('input', ele));
            inputEle.focus();
            let args: any = { target: select('.e-clear-icon', ele) }
            editorObj.mouseDownHandler(args);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            done();
        });
        it('input as target to testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            let inputEle: HTMLElement = (<HTMLElement>select('input', ele));
            inputEle.focus();
            inputEle.dispatchEvent(new MouseEvent("mousedown"));
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            done();
        });
        it('mousedown event with input icon testing', (done: Function) => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            let inputEle: HTMLElement = (<HTMLElement>select('input', ele));
            inputEle.focus();
            let args: any = { target: inputEle }
            editorObj.mouseDownHandler(args);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            done();
        });
    });
    describe('Inline - Editor open and close testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let editorObj: InPlaceEditor;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Inline'
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Click with open class testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
        });
        it('Inline root element availability testing', () => {
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(true);
        });
        it('Inline wrapper element availability testing', () => {
            expect(selectAll('.' + classes.WRAPPER, ele).length === 1).toEqual(true);
        });
        it('Loading element availability testing', () => {
            expect(selectAll('.' + classes.LOADING, ele).length === 1).toEqual(true);
        });
        it('Form element and it classes availability testing', () => {
            let formEle: HTMLElement = <HTMLElement>select('form', ele);
            expect(isNOU(formEle)).toEqual(false);
            expect(formEle.classList.contains(classes.FORM)).toEqual(true);
            expect(formEle.classList.contains(classes.HIDE)).toEqual(false);
        });
        it('Control group element availability testing', () => {
            expect(selectAll('.' + classes.CTRL_GROUP, ele).length === 1).toEqual(true);
        });
        it('Error display element availability testing', () => {
            expect(selectAll('.' + classes.EDITABLE_ERROR, ele).length === 1).toEqual(true);
        });
        it('Input wrapper element availability testing', () => {
            expect(selectAll('.' + classes.INPUT, ele).length === 1).toEqual(true);
        });
        it('Buttons wrapper element availability testing', () => {
            expect(selectAll('.' + classes.BUTTONS, ele).length === 1).toEqual(true);
        });
        it('Close with editor element availability testing', () => {
            (<HTMLElement>select('.' + classes.BTN_CANCEL, ele)).dispatchEvent(new MouseEvent('mousedown'));
            expect(selectAll('.' + classes.INLINE, ele).length === 1).toEqual(false);
        });
    });
    describe('Popup - Editor open and close testing', () => {
        let ele: HTMLElement;
        let tipEle: HTMLElement;
        let valueEle: HTMLElement;
        let valueWrapper: HTMLElement;
        let editorObj: any;
        beforeAll((done: Function): void => {
            editorObj = renderEditor({
                mode: 'Popup',
                popupSettings: { title: 'Test' }
            });
            ele = editorObj.element;
            done();
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Click with open class testing', (done: Function) => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            setTimeout(() => {
                expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
                expect(editorObj.enableEditMode).toEqual(true);
                done();
            }, 400);
        });
        it('Tooltip element availability testing', () => {
            expect(selectAll('.e-tooltip-wrap', document.body).length === 1).toEqual(true);
            expect(selectAll('.e-popup', document.body).length === 1).toEqual(true);
            expect(selectAll('.e-popup-open', document.body).length === 1).toEqual(true);
            tipEle = <HTMLElement>select('.' + classes.ROOT_TIP, document.body);
            expect(isNOU(tipEle)).toEqual(false);
        });
        it('Tooltip content element availability testing', () => {
            expect(selectAll('.e-tip-content', tipEle).length === 1).toEqual(true);
        });
        it('Tooltip content first child classList availability testing', () => {
            expect(select('.e-tip-content > div', tipEle).classList.length === 1).toEqual(true);
        });
        it('Inline wrapper element availability testing', () => {
            expect(selectAll('.' + classes.WRAPPER, tipEle).length === 1).toEqual(true);
        });
        it('Loading element availability testing', () => {
            expect(selectAll('.' + classes.LOADING, tipEle).length === 1).toEqual(true);
        });
        it('Title element availability testing', () => {
            expect(selectAll('.' + classes.TITLE, tipEle).length === 1).toEqual(true);
        });
        it('Form element and it classes availability testing', () => {
            let formEle: HTMLElement = <HTMLElement>select('form', tipEle);
            expect(isNOU(formEle)).toEqual(false);
            expect(formEle.classList.contains(classes.FORM)).toEqual(true);
            expect(formEle.classList.contains(classes.HIDE)).toEqual(false);
        });
        it('Control group element availability testing', () => {
            expect(selectAll('.' + classes.CTRL_GROUP, tipEle).length === 1).toEqual(true);
        });
        it('Error display element availability testing', () => {
            expect(selectAll('.' + classes.EDITABLE_ERROR, tipEle).length === 1).toEqual(true);
        });
        it('Input wrapper element availability testing', () => {
            expect(selectAll('.' + classes.INPUT, tipEle).length === 1).toEqual(true);
        });
        it('Buttons wrapper element availability testing', () => {
            expect(selectAll('.' + classes.BUTTONS, tipEle).length === 1).toEqual(true);
        });
        it('Close with editor element availability testing', () => {
            (<HTMLElement>select('.' + classes.BTN_CANCEL, tipEle)).dispatchEvent(new MouseEvent('mousedown'));
            expect(selectAll('.' + classes.ROOT_TIP, document.body).length === 1).toEqual(false);
        });
        it('Page scroll with testing', (done: Function) => {
            document.body.style.minHeight = '900px';
            destroy(editorObj);
            editorObj = renderEditor({
                mode: 'Popup',
                popupSettings: { title: 'Test' }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            window.scrollTo(0, 10);
            setTimeout(() => {
                expect(select('.' + classes.ROOT + ' .' + classes.VALUE_WRAPPER, document.body).classList.contains(classes.OPEN)).toEqual(false);
                expect(selectAll('.' + classes.ROOT_TIP, document.body).length === 1).toEqual(false);
                document.body.style.minHeight = '';
                done();
            }, 500);
        });
        it('Resize with testing', (done: Function) => {
            destroy(editorObj);
            editorObj = renderEditor({
                mode: 'Popup',
                popupSettings: { title: 'Test' }
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.scrollResizeHandler();
            setTimeout(() => {
                expect(select('.' + classes.ROOT + ' .' + classes.VALUE_WRAPPER, document.body).classList.contains(classes.OPEN)).toEqual(false);
                expect(selectAll('.' + classes.ROOT_TIP, document.body).length === 1).toEqual(false);
                document.body.style.minHeight = '';
                done();
            }, 500);
        });
    });
    describe('Value submit testing', () => {
        let ele: HTMLElement
        let valueEle: HTMLElement;
        let editorObj: InPlaceEditor;
        let valueWrapper: HTMLElement;
        let beginArgs: any = {};
        let successArgs: any = {};
        let failArgs: any = {};
        function begin(e: any): void {
            beginArgs = e;
        }
        function success(e: any): void {
            successArgs = e;
        }
        function fail(e: any): void {
            failArgs = e;
        }
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Success testing', (done: Function) => {
            editorObj = renderEditor({
                primaryKey: 'text',
                mode: 'Inline',
                name: 'Game',
                value: 'Syncfusion',
                adaptor: 'UrlAdaptor',
                url: 'https://ej2services.syncfusion.com/development/web-services/api/Editor/UpdateData',
                actionBegin: begin,
                actionSuccess: success,
                actionFailure: fail
            });
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion' }, name: "actionBegin" });
                expect(successArgs['name']).toEqual('actionSuccess');
                expect(successArgs['value']).toEqual('Syncfusion');
                done();
            }, 4000);
        });
        it('Failure testing', (done: Function) => {
            editorObj = renderEditor({
                primaryKey: 'text',
                name: 'Game',
                mode: 'Inline',
                value: 'Syncfusion',
                adaptor: 'UrlAdaptor',
                url: 'https://ej2services.syncfusion.com/development/web-services/api/Editor/Updates',
                actionBegin: begin,
                actionFailure: fail
            });
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion' }, name: "actionBegin" });
                expect(failArgs['name']).toEqual('actionFailure');
                expect(failArgs['value']).toEqual('Syncfusion');
                done();
            }, 2000);
        });
        it('Failure with popup testing', (done: Function) => {
            editorObj = renderEditor({
                primaryKey: 'text',
                name: 'Game',
                value: 'Syncfusion',
                adaptor: 'UrlAdaptor',
                url: 'https://ej2services.syncfusion.com/development/web-services/api/Editor/Updates',
                actionBegin: begin,
                actionFailure: fail
            });
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            valueEle.click();
            editorObj.save();
            setTimeout(() => {
                expect(beginArgs).toEqual({ data: { name: 'Game', primaryKey: 'text', value: 'Syncfusion' }, name: "actionBegin" });
                expect(failArgs['name']).toEqual('actionFailure');
                expect(failArgs['value']).toEqual('Syncfusion');
                done();
            }, 2000);
        });
    });
    describe('Button keyboard action testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let editorObj: any;
        let valueWrapper: HTMLElement;
        afterEach((): void => {
            destroy(editorObj);
        });
        it('Enter key with save testing', () => {
            editorObj = renderEditor({
                mode: "Inline",
                value: 'welcome'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.componentObj.value = 'hi';
            triggerKeyBoardEvent(select('.' + classes.BTN_SAVE, ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            expect(valueEle.innerHTML).toEqual('hi');
        });
        it('Space key with save testing', () => {
            editorObj = renderEditor({
                mode: "Inline",
                value: 'welcome'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.componentObj.value = 'hi';
            triggerKeyBoardEvent(select('.' + classes.BTN_SAVE, ele) as HTMLElement, 32);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            expect(valueEle.innerHTML).toEqual('hi');
        });
        it('Enter key with cancel testing', () => {
            editorObj = renderEditor({
                mode: "Inline",
                value: 'welcome'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.componentObj.value = 'hi';
            triggerKeyBoardEvent(select('.' + classes.BTN_CANCEL, ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            expect(valueEle.innerHTML).toEqual('welcome');
        });
        it('Space key with cancel testing', () => {
            editorObj = renderEditor({
                mode: "Inline",
                value: 'welcome'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.componentObj.value = 'hi';
            triggerKeyBoardEvent(select('.' + classes.BTN_CANCEL, ele) as HTMLElement, 32);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(false);
            expect(editorObj.enableEditMode).toEqual(false);
            expect(valueEle.innerHTML).toEqual('welcome');
        });
        it('Without target button class testing', () => {
            editorObj = renderEditor({
                mode: "Inline",
                value: 'welcome'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.componentObj.value = 'hi';
            select('.' + classes.BTN_SAVE, ele).classList.remove(classes.BTN_SAVE);
            triggerKeyBoardEvent(select('button', ele) as HTMLElement, 13);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            expect(valueEle.innerHTML).toEqual('welcome');
        });
        it('Other key with cancel testing', () => {
            editorObj = renderEditor({
                mode: "Inline",
                value: 'welcome'
            });
            ele = editorObj.element;
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('welcome');
            valueEle.click();
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            editorObj.componentObj.value = 'hi';
            triggerKeyBoardEvent(select('.' + classes.BTN_CANCEL, ele) as HTMLElement, 12);
            expect(valueWrapper.classList.contains(classes.OPEN)).toEqual(true);
            expect(editorObj.enableEditMode).toEqual(true);
            expect(valueEle.innerHTML).toEqual('welcome');
        });
    });
    describe('Spinner load/remove testing', () => {
        let ele: HTMLElement;
        let valueEle: HTMLElement;
        let editorObj: any;
        let valueWrapper: HTMLElement;
        beforeAll((): void => {
            editorObj = renderEditor({
                mode: "Inline",
                value: 'welcome'
            });
            ele = editorObj.element;
        });
        afterAll((): void => {
            destroy(editorObj);
        });
        it('Load spinner testing', () => {
            valueWrapper = <HTMLElement>select('.' + classes.VALUE_WRAPPER, ele);
            valueEle = <HTMLElement>select('.' + classes.VALUE, valueWrapper);
            expect(valueEle.innerHTML).toEqual('welcome');
            valueEle.click();
            editorObj.formEle = undefined;
            editorObj.loadSpinner();
            expect(ele.querySelectorAll('.e-spinner-pane').length > 0).toEqual(true);
        });
        it('Remove spinner testing', () => {
            editorObj.removeSpinner();
            expect(ele.querySelectorAll('.e-spinner-pane').length > 0).toEqual(false);
        });
    });
});