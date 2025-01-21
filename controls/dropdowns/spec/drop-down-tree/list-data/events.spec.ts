import { createElement } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { listData } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('DropDown Tree control List datasource', () => {
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
        let i: number = 0, j: number = 0; let isInteracted: boolean;
        let action: string;
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
                    dataSource: listData, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected'
                },
                treeSettings: { loadOnDemand: true },
                created: clickFn
            }, '#tree1');
            expect(i).toEqual(1);
        });
        it('dataBond event', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: listData, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected'
                },
                treeSettings: { loadOnDemand: true },
                dataBound: clickFn
            }, '#tree1');
            expect(i).toEqual(1);
        });
        it('beforeOpen event is triggered', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded'
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
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
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
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
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
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
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
                    dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded'
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
            expect(ddTreeObj.element.getAttribute("aria-expanded")).toEqual("false");
            expect(ddTreeObj.element.getAttribute("aria-haspopup")).toEqual("tree");
            expect(document.querySelector('.e-popup')).toBe(null);
        });
        it('select event testing', () => {
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded'
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
                    dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded'
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
                    dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded'
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
        it('select event args testing with showselectall', (done: Function) => {
            ddTreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                showSelectAll: true, 
                showCheckBox: true, 
                select: function(e) {
                    isInteracted = e.isInteracted;
                    action = e.action;
                },
                mode: 'Delimiter' 
            }, '#tree1');
            ddTreeObj.showPopup();
            var selectAllElement = ddTreeObj.popupEle.firstElementChild;
            expect(selectAllElement.classList.contains('e-selectall-parent')).toBe(true);
            expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Select All');
            let checkEle: Element = <Element & NodeListOf<Element>>selectAllElement.querySelector('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle.querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle.querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle.querySelector('.e-frame').dispatchEvent(e);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(ddTreeObj.value.length).toBe(24);
                expect(isInteracted).toBe(true);
                expect(action).toBe("select");
                expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Unselect All');
                expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                let ncheckEle: Element = <Element & NodeListOf<Element>>selectAllElement.querySelector('.e-checkbox-wrapper');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                ncheckEle.querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ncheckEle.querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ncheckEle.querySelector('.e-frame').dispatchEvent(e);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(ddTreeObj.value.length).toBe(0);
                    expect(isInteracted).toBe(true);
                    expect(action).toBe("un-select");
                    expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Select All');
                    expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 400);
            }, 400);
        });
        it('change event is triggered after dynamically adding values and selecting SelectAll', function () {
            let changedEvent: boolean = false;
            var addNewValueButton = document.createElement('button');
            addNewValueButton.id = 'addNewValueButton';
            addNewValueButton.innerText = 'Add new value';
            document.body.appendChild(addNewValueButton);
            ddTreeObj = new DropDownTree({
                fields: {
                    dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded'
                },
                allowMultiSelection: true,
                showCheckBox: true,
                showSelectAll: true,
                changeOnBlur: false,
                treeSettings: { autoCheck: true, loadOnDemand: true, expandOn: 'Auto' },
                change: function(args) {
                    changedEvent = true;
            },  
            }, '#tree1');
            expect(i).toEqual(0);
            addNewValueButton.addEventListener('click', function () {
                if (ddTreeObj) {
                    ddTreeObj.value = ['8'];
                    ddTreeObj.dataBind();
                }
            });
            addNewValueButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
            addNewValueButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            addNewValueButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            expect(changedEvent).toEqual(true);
            ddTreeObj.showPopup();
            var selectAllCheckbox = document.querySelector('.e-selectall-parent');
            if (selectAllCheckbox) {
                selectAllCheckbox.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                selectAllCheckbox.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                selectAllCheckbox.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            }
            expect(changedEvent).toEqual(true);
        });
    });
});