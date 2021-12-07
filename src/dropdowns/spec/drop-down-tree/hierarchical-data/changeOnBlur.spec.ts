import { createElement } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { hierarchicalData3 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';


describe('DropDown Tree control hierarchical datasource', () => {
    /**
      * changeOnBlur testing
      */
    describe('changeOnBlur -', () => {
        let mouseEventArgs: any;
        let ddtreeObj: any;
        let originalTimeout: any;
        let tapEvent: any;
        let keyboardEventArgs: any = {
            preventDefault: (): void => { },
            action: null,
            target: null,
            stopImmediatePropagation: (): void => { },
        };
        let i: number = 0, j: number = 0;
        function clickFn(): void {
            i++;
        }
        beforeEach((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            i = 0, j = 0;
            ddtreeObj = undefined;
            let ele: HTMLElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (ddtreeObj)
                ddtreeObj.destroy();
            document.body.innerHTML = '';
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('change event should not be triggered at initial rendering', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                changeOnBlur: false,
                value: ['1'],
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(i).toBe(0);
            ddtreeObj.value = null;
            ddtreeObj.dataBind();
            expect(i).toBe(1);
            ddtreeObj.onFocusOut();
        });
        it('change event should be triggered while changing the value', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                changeOnBlur: false,
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(i).toBe(1);
            ddtreeObj.onFocusOut();
        });
        it('change event should be triggered while clearing the value', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                changeOnBlur: false,
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(i).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            var ele: HTMLElement = (ddtreeObj as any).element.nextElementSibling;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toBe(2);
            expect(ddtreeObj.text).toBe(null);
            ddtreeObj.onFocusOut();
        });
        it('change event should be triggered while enabling the multiSelection and selecting multiple values', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                changeOnBlur: false,
                allowMultiSelection: true,
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.text).toBe('Australia');
            expect(i).toBe(1);
            expect(ddtreeObj.value[0]).toBe('1');
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(i).toBe(2);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            ddtreeObj.onFocusOut();
        });
        it('change event should be triggered while enabling the checkbox and selection multiple values', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                changeOnBlur: false,
                showCheckBox: true,
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(i).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales');
            expect(i).toBe(2);
            ddtreeObj.onFocusOut();
        });
        it('change event should be triggered while deleting the chip', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                changeOnBlur: false,
                showCheckBox: true,
                mode: 'Box',
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(i).toBe(1);
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            var chipDelete = chips_1[0].querySelector('.e-chips-close');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            expect(i).toBe(2);
            expect(ddtreeObj.text).toBe(null);
            ddtreeObj.onFocusOut();
        });
        it('Change Event testing with default value after popup open and close', () => {
            let changed: boolean = false;
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                value: ['1'],
                change: function (args: any) {
                    changed = true;
                }
            }, '#ddtree');
            ddtreeObj.showPopup();
            ddtreeObj.hidePopup();
            ddtreeObj.onFocusOut();
            expect(changed).toBe(false);
        });

        it('Change Event triggered after resetting value', () => {
            let changed: boolean = false;
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                change: function (args: any) {
                    changed = true;
                }
            }, '#ddtree');
            ddtreeObj.showPopup();
            ddtreeObj.value = ['1'];
            ddtreeObj.dataBind();
            expect(changed).toBe(true);
            ddtreeObj.clear();
            ddtreeObj.value = ['2']
            ddtreeObj.dataBind();
            expect(changed).toBe(true);
            ddtreeObj.onFocusOut();
        });
        it('ShowSelectAll testing', (done: Function) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                changeOnBlur: false,
                showCheckBox: true,
                showSelectAll: true,
                mode: 'Box',
                change: clickFn
            }, '#ddtree');
            ddtreeObj.showPopup();
            var selectAllElement = ddtreeObj.popupEle.firstElementChild;
            expect(i).toBe(0);
            expect(selectAllElement.classList.contains('e-selectall-parent')).toBe(true);
            expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Select All');
            let checkEle: Element = <Element & NodeListOf<Element>>selectAllElement.querySelector('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle.querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle.querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle.querySelector('.e-frame').dispatchEvent(e);
            setTimeout(function () {
                expect(ddtreeObj.value.length).toBe(24);
                expect(i).toBe(1);
                expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Unselect All');
                let ncheckEle: Element = <Element & NodeListOf<Element>>selectAllElement.querySelector('.e-checkbox-wrapper');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ncheckEle.querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ncheckEle.querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ncheckEle.querySelector('.e-frame').dispatchEvent(e);
                setTimeout(function () {
                    expect(ddtreeObj.value.length).toBe(0);
                    expect(i).toBe(2);
                    expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Select All');
                    done();
                }, 400);
            }, 400);
        });
        it('Change event triggers while changing value via keyboard interaction', () => {
            let changed: boolean = false;
            ddtreeObj = new DropDownTree(
                {
                    fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                    change: function (args: any) {
                        changed = true;
                    },
                    changeOnBlur: false
                }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-hover')).toBe(true);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[0].classList.contains('e-active')).toBe(false);
            keyboardEventArgs.action = 'enter';
            ddtreeObj.treeAction(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.showPopup();
            expect(li[0].classList.contains('e-hover')).toBe(true);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[0].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia');
            expect(changed).toBe(true);
            ddtreeObj.onFocusOut();
        });
    });
});
