import { createElement } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { hierarchicalData3 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('DropDown Tree control hierarchical datasource', () => {
    describe('Events testing', () => {
        let mouseEventArgs: any;
        let ddTreeObj: any;
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
            ddTreeObj = undefined;
            let ele: HTMLElement = <HTMLInputElement>createElement('input', { id: 'tree1' });
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (ddTreeObj)
                ddTreeObj.destroy();
            document.body.innerHTML = '';
        });
        it('created event', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                },
                treeSettings: { loadOnDemand: true },
                created: clickFn
            }, '#tree1');
            expect(i).toEqual(1);
        });
        it('dataBound event', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                },

                treeSettings: { loadOnDemand: true },
                dataBound: clickFn
            }, '#tree1');
            expect(i).toEqual(1);
        });
        it('beforeOpen event is triggered', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                },
                beforeOpen: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            expect(i).toEqual(0);
            let ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toEqual(1);
            ddTreeObj.hidePopup();
            ddTreeObj.showPopup();
            expect(i).toEqual(2);
        });
        it('open event is triggered', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                },
                open: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            expect(i).toEqual(0);
            let ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toEqual(1);
            ddTreeObj.hidePopup();
            ddTreeObj.showPopup();
            expect(i).toEqual(2);
        });
        it('close event is triggered', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                },
                close: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            expect(i).toEqual(0);
            let ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toEqual(0);
            ddTreeObj.hidePopup();
            expect(i).toEqual(1);
        });
        it('change event is triggered', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                },
                change: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            expect(i).toEqual(0);
            let ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toEqual(0);
            var li = (ddTreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddTreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddTreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect(ddTreeObj.element.value).toBe("Australia");
            (ddTreeObj as any).onFocusOut();
            expect(i).toEqual(1);
        });
        it('beforeOpen event is cancelled', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                },
                beforeOpen: function (args) {
                    args.cancel = true;
                },
                open: clickFn,
                treeSettings: { loadOnDemand: true }
            }, '#tree1');
            let ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toEqual(0);
            ddTreeObj.hidePopup();
            expect(i).toEqual(0);
            expect(ddTreeObj.element.parentElement.getAttribute("aria-expanded")).toEqual("false");
            expect(ddTreeObj.element.parentElement.getAttribute("aria-haspopup")).toEqual("true");
            expect(document.querySelector('.e-popup')).toBe(null);
        });
        it('select event testing', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                },
                select: clickFn,
            }, '#tree1');
            let ele = ddTreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            expect(i).toEqual(0);
            var li = (ddTreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddTreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddTreeObj.text).toBe("Australia");
            expect(i).toEqual(1);
        });
        it('focus event testing', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                },
                focus: clickFn,
            }, '#tree1');
            expect(i).toEqual(0);
            ddTreeObj.showPopup();
            expect(i).toEqual(1);
        });
        it('blur event testing', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                },
                blur: clickFn,
            }, '#tree1');
            expect(i).toEqual(0);
            ddTreeObj.showPopup();
            var li = (ddTreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddTreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddTreeObj.text).toBe("Australia");
            ddTreeObj.onFocusOut();
            expect(i).toEqual(1);
        });
    });
});