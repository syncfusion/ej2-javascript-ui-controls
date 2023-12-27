import { createElement } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { hierarchicalData3 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('DropDown Tree control hierarchical datasource', () => {
    describe('Method testing', () => {
        let ddtreeObj: any;
        let mouseEventArgs: any;
        let originalTimeout: any;
        let tapEvent: any;
        beforeEach((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent: { target: null }
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            ddtreeObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (ddtreeObj)
                ddtreeObj.destroy();
            document.body.innerHTML = '';
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('for showPopup', () => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                }, treeSettings: { loadOnDemand: true }
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.inputEle.getAttribute("aria-expanded")).toBe('true');
            expect(document.querySelector('.e-popup').querySelector('.e-treeview')).not.toBe(null);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect(ddtreeObj.element.value).toBe("Australia")
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.inputEle.getAttribute("aria-expanded")).toBe('false');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('.e-popup').length).toBe(1);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(false);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(li[0].classList.contains('e-active')).toBe(true);
            ddtreeObj.hidePopup();
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.inputEle.getAttribute("aria-expanded")).toBe('false');
        });
        it('for hidePopup', () => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                }, treeSettings: { loadOnDemand: true }
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.inputEle.getAttribute("aria-expanded")).toBe('true');
            expect(document.querySelector('.e-popup').querySelector('.e-treeview')).not.toBe(null);
            ddtreeObj.hidePopup();
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.inputEle.getAttribute("aria-expanded")).toBe('false');
            ddtreeObj.showPopup();
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect(ddtreeObj.element.value).toBe("Australia")
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.inputEle.getAttribute("aria-expanded")).toBe('false');
            ddtreeObj.showPopup();
            expect(document.querySelectorAll('.e-popup').length).toBe(1);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(false);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(li[0].classList.contains('e-active')).toBe(true);
            ddtreeObj.hidePopup();
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.inputEle.getAttribute("aria-expanded")).toBe('false');
        });
        it('for clear', () => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                }, treeSettings: { loadOnDemand: true }
            }, '#ddtree');
            ddtreeObj.showPopup();
            expect(document.querySelector('.e-popup').querySelector('.e-treeview')).not.toBe(null);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect(ddtreeObj.element.value).toBe("Australia")
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            ddtreeObj.clear();
            expect(ddtreeObj.value.length).toBe(0);
            expect(ddtreeObj.text).toBe(null);
            ddtreeObj.onFocusOut();
            ddtreeObj.clear();
            ddtreeObj.allowMultiSelection = true;
            ddtreeObj.value = ['1', '21'];
            ddtreeObj.dataBind();
            ddtreeObj.clear();
            expect(ddtreeObj.value.length).toBe(0);
            expect(ddtreeObj.text).toBe(null);
        });
        it('for getData', () => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                }
            }, '#ddtree');
            expect(ddtreeObj.getData().length).toBe(5);
            expect(ddtreeObj.getData('0').length).toBe(0);
            expect(ddtreeObj.getData('1').length).toBe(1);
            expect(ddtreeObj.getData('1')[0].name).toBe('Australia');
        });
        it('for ensureVisible', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                }
            }, '#ddtree');
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            ddtreeObj.ensureVisible('22');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(li[19].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                expect(li[19].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                ddtreeObj.ensureVisible(li[12]);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(li[9].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    done();
                }, 450);
            }, 450);
        });
        it('for selectAll method with allowMultiSelection', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                }, allowMultiSelection: true
            }, '#ddtree');
            ddtreeObj.selectAll(true);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(ddtreeObj.value.length).toBe(24);
                ddtreeObj.selectAll(false);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(ddtreeObj.value.length).toBe(0);
                    done();
                }, 400);
            }, 400);
        });
        it('for selectAll method with showCheckBox', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                }, showCheckBox: true
            }, '#ddtree');
            ddtreeObj.selectAll(true);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(ddtreeObj.value.length).toBe(24);
                ddtreeObj.selectAll(false);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(ddtreeObj.value.length).toBe(0);
                    done();
                }, 400);
            }, 400);
        });

        it('for selectAll', () => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                },
                value: ['1'],
                showCheckBox: true,
                showSelectAll: true,
                allowMultiSelection: true
            }, '#ddtree');
            ddtreeObj.selectAll(true);
            expect(ddtreeObj.value.length === 24).toBe(true);
            ddtreeObj.selectAll(false);
            expect(ddtreeObj.value.length === 0).toBe(true);
        });
    });
    describe('Destroy Method testing', () => {
        let ddtreeObj: any;
        let mouseEventArgs: any;
        let tapEvent: any;
        let i: number = 0, j: number = 0;
        function clickFn(): void {
            i++;
        }
        beforeEach((): void => {
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent: { target: null }
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            i = 0, j = 0;
            ddtreeObj = undefined;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('destroy', () => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                }, destroyed: clickFn
            }, '#ddtree');
            ddtreeObj.destroy();
            expect(ddtreeObj.element.className).toBe('');
            expect(ddtreeObj.element.childElementCount).toBe(0);
        });
        it('destroy after popup click', () => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                }, destroyed: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect(ddtreeObj.element.value).toBe("Australia")
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            ddtreeObj.destroy();
            expect(ddtreeObj.element.className).toBe('');
            expect(ddtreeObj.element.childElementCount).toBe(0);
            expect(ddtreeObj.value.length).toBe(0);
            expect(ddtreeObj.text).toBe(null);
        });
    });
});