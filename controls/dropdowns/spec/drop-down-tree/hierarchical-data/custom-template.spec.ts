import { createElement } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { hierarchicalData3 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';


describe('DropDown Tree control Hierarchical datasource', () => {
    /**
      * valueOverFlow testing
      */

     beforeAll(() => {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.id   = 'wrapper-css';
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = '/base/styles/drop-down-tree/material.css';
        link.media = 'all';
        head.appendChild(link);
    });

    afterAll(() => {
        document.head.getElementsByClassName('wrapper-css')[0].remove();
    });

    describe('Custom Mode testing -', () => {
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
        it('With allowMultiSelection', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                allowMultiSelection: true,
                mode: 'Custom',
                width: '250px'
            }, '#ddtree');
            ddtreeObj.showPopup();
            mouseEventArgs.ctrlKey = true;
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("3 item(s) selected");
            expect(ddtreeObj.value.length).toBe(3);
            expect(ddtreeObj.text).toBe("Australia,New South Wales,Victoria");
            ddtreeObj.onFocusOut();
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("3 item(s) selected");
        });
        it('With allowMultiSelection and customTemplate Enabled', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                allowMultiSelection: true,
                mode: 'Custom',
                customTemplate: "Number of items selected : ${value.length}",
                width: '250px'
            }, '#ddtree');
            ddtreeObj.showPopup();
            mouseEventArgs.ctrlKey = true;
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("Number of items selected : 3");
            expect(ddtreeObj.value.length).toBe(3);
            expect(ddtreeObj.text).toBe("Australia,New South Wales,Victoria");
            ddtreeObj.onFocusOut();
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("Number of items selected : 3");
        });
        it('With allowMultiSelection with initial multiple value', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                allowMultiSelection: true,
                value : ['1', '2', '3'],
                mode: 'Custom',
                width: '250px'
            }, '#ddtree');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("3 item(s) selected");
            expect(ddtreeObj.value.length).toBe(3);
            ddtreeObj.focusIn();
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("3 item(s) selected");
        });
        it('For allowMultiSelection with initial multiple text', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                allowMultiSelection: true,
                mode: 'Custom',
               text: 'Australia,China,France,India',
                width: '250px',
            }, '#ddtree');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("4 item(s) selected");
            expect(ddtreeObj.value.length).toBe(4);
            ddtreeObj.focusIn();
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("4 item(s) selected");
        });
        it('For allowMultiSelection with selected field', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', selected: 'isSelected', child: "child" },
                allowMultiSelection: true,
                width: '150px',
                mode: 'Custom'
            }, '#ddtree');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("2 item(s) selected");
            expect(ddtreeObj.value.length).toBe(2);
            ddtreeObj.focusIn();
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("2 item(s) selected");
        });
        it('With showCheckBox', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                showCheckBox: true,
                width: '250px',
                mode: 'Custom'
            }, '#ddtree');
            ddtreeObj.showPopup();
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("3 item(s) selected");
            expect(ddtreeObj.value.length).toBe(3);
            expect(ddtreeObj.text).toBe("Australia,New South Wales,Victoria");
            ddtreeObj.onFocusOut();
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("3 item(s) selected");
        });

        it('With showCheckBox and customTemplate enabled', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                showCheckBox: true,
                width: '250px',
                mode: 'Custom',
                customTemplate: "Number of items selected : ${value.length}",
            }, '#ddtree');
            ddtreeObj.showPopup();
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("Number of items selected : 3");
            expect(ddtreeObj.value.length).toBe(3);
            expect(ddtreeObj.text).toBe("Australia,New South Wales,Victoria");
            ddtreeObj.onFocusOut();
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("Number of items selected : 3");
        });

        it('For showCheckBox with initial mutiple value', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                showCheckBox: true,
                value : ['1', '2', '3'],
                mode: 'Custom',
                width: '250px'
            }, '#ddtree');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("3 item(s) selected");
            expect(ddtreeObj.value.length).toBe(3);
            ddtreeObj.focusIn();
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("3 item(s) selected");
        });

        it('For showCheckBox with initial mutiple text', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                showCheckBox: true,
                mode: 'Custom',
                text: 'Australia,China,France,India',
                width: '250px',
            }, '#ddtree');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("4 item(s) selected");
            expect(ddtreeObj.value.length).toBe(4);
            ddtreeObj.focusIn();
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("4 item(s) selected");
        });


        it('For showCheckBox with selected field', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', selected: 'isSelected', child: "child" },
                showCheckBox: true,
                mode: 'Custom',
                width: '150px',
            }, '#ddtree');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("2 item(s) selected");
            expect(ddtreeObj.value.length).toBe(2);
            ddtreeObj.focusIn();
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("2 item(s) selected");
        });

        it('allowMultiSelection enabled dynamically', () => { 
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                width: '250px',
                mode: 'Custom',
            }, '#ddtree');
            ddtreeObj.showPopup();
            mouseEventArgs.ctrlKey = true;
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            let ochipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(ochipElement.classList.contains('e-chips-wrapper')).toBe(false);
            expect(ddtreeObj.value.length).toBe(1);
            ddtreeObj.allowMultiSelection = true;
            ddtreeObj.dataBind();
            let chipElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("1 item(s) selected");
        });

        it('showCheckBox enabled dynamically', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                width: '250px',
                mode: 'Custom',
            }, '#ddtree');
            ddtreeObj.showCheckBox = true;
            ddtreeObj.value = ['1', '2'];
            ddtreeObj.dataBind();
            let chipElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].innerText).toBe("2 item(s) selected");
        });

        it('Custom Mode enabled dynamically', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                allowMultiSelection: true,
                width: '250px'
            }, '#ddtree');
            ddtreeObj.showPopup();
            mouseEventArgs.ctrlKey = true;
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(3);
            let oveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(oveflowElement.classList.contains('e-overflow')).toBe(true);
            ddtreeObj.onFocusOut();
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.mode = 'Custom';
            ddtreeObj.dataBind();
            let TchipElement = ddtreeObj.element.parentElement.firstElementChild;
            let Tchips = TchipElement.querySelectorAll('.e-chips');
            expect(Tchips.length).toBe(1);
            expect(Tchips[0].innerText).toBe("3 item(s) selected");
            expect(ddtreeObj.value.length).toBe(3);
            expect(ddtreeObj.text).toBe("Australia,New South Wales,Victoria");
            ddtreeObj.showPopup();
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("3 item(s) selected");
            ddtreeObj.onFocusOut();
            ddtreeObj.mode = 'Default';
            ddtreeObj.dataBind();
            let n_chipElement = ddtreeObj.element.parentElement.firstElementChild;
            let n_chips = n_chipElement.querySelectorAll('.e-chips');
            expect(n_chips.length).toBe(3);
            expect(n_chips[0].innerText).not.toBe("3 item(s) selected");
        });
        it('customTemplate changed dynamically', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                allowMultiSelection: true,
                mode: 'Custom',
                width: '250px'
            }, '#ddtree');
            ddtreeObj.showPopup();
            mouseEventArgs.ctrlKey = true;
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let TchipElement = ddtreeObj.element.parentElement.firstElementChild;
            let Tchips = TchipElement.querySelectorAll('.e-chips');
            expect(Tchips.length).toBe(1);
            expect(Tchips[0].innerText).toBe("3 item(s) selected");
            expect(ddtreeObj.value.length).toBe(3);
            ddtreeObj.customTemplate= "Number of items selected : ${value.length}",
            ddtreeObj.dataBind();
            let T_chipElement = ddtreeObj.element.parentElement.firstElementChild;
            let T_chips = T_chipElement.querySelectorAll('.e-chips');
            expect(T_chips.length).toBe(1);
            expect(T_chips[0].innerText).toBe("Number of items selected : 3");
            ddtreeObj.onFocusOut();
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let n_chips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(n_chips.length).toBe(1);
            expect(n_chips[0].innerText).toBe("Number of items selected : 3");
        });
    });

    describe('Combinational testing ', () => {
        let ddtreeObj: any;
        let mouseEventArgs: any;
        let tapEvent: any;
        let originalTimeout: any;
        let ele: HTMLInputElement;
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
            ele = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (ddtreeObj)
                ddtreeObj.destroy();
                ddtreeObj = undefined;
            ele.remove();
            document.body.innerHTML = '';
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('Custom Mode with multiselect and filtering', (done) => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild" },
                allowFiltering: true,
                treeSettings: { loadOnDemand: true },
                allowMultiSelection: true,
                filterType: 'Contains',
                mode: 'Custom'
            }, '#ddtree');
            ddtreeObj.showPopup();
            let filterEle: any = ddtreeObj.popupObj.element.querySelector('#' + ddtreeObj.element.id + "_filter");
            let filterObj: any = filterEle.ej2_instances[0];
            filterEle.value = 'j';
            filterObj.value = 'j';
            let eventArgs: any = { value: 'j', container: filterEle };
            filterObj.input(eventArgs);
            setTimeout(function () {
                expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(4);
                let li: Element[] = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 1;
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                mouseEventArgs.target = li[2].querySelector('.e-list-text');
                (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.value.length).toBe(2);
                expect(ddtreeObj.value.indexOf('11') !== -1).toBe(true);
                expect(ddtreeObj.value.indexOf('21') !== -1).toBe(true);
                filterEle.value = '';
                filterObj.value = '';
                eventArgs = { value: '', container: filterEle };
                filterObj.input(eventArgs);
                setTimeout(function () {
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item').length).toBe(9);
                    expect(ddtreeObj.treeObj.selectedNodes.length).toBe(2);
                    expect(ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active').length).toBe(2);
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[0].querySelector('.e-list-text') as HTMLElement).innerText).toBe("China");
                    expect((ddtreeObj.treeObj.element.querySelectorAll('li.e-list-item.e-active')[1].querySelector('.e-list-text') as HTMLElement).innerText).toBe("India");
                    expect(ddtreeObj.treeObj.selectedNodes.indexOf('11') !== -1).toBe(true);
                    expect(ddtreeObj.treeObj.selectedNodes.indexOf('21') !== -1).toBe(true);
                    expect(document.querySelectorAll('.e-chips-wrapper .e-chipcontent').length).toBe(1);
                    expect((document.querySelectorAll('.e-chips-wrapper .e-chipcontent')[0] as HTMLElement).innerText).toBe("2 item(s) selected");
                    done();
                },350);
            },350);
        });
        /**
         * Delimiter char
         */
        it('Custom Mode with delimiterChar', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, mode: 'Custom', allowMultiSelection: true, delimiterChar: '*' }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            // ctrl key pressed
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[0].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value[0]).toBe('1');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            expect(ddtreeObj.element.value).toBe('Australia* Victoria');
            expect(ddtreeObj.value.length).toBe(2);
            expect(ddtreeObj.value[1]).toBe('3');
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("2 item(s) selected");
            ddtreeObj.onFocusOut();
        });
        /**
         * showSelectAll testing
         */
        it('Custom Mode with ShowSelectAll', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showSelectAll: true, showCheckBox: true, mode: 'Custom' }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var selectAllElement = ddtreeObj.popupEle.firstElementChild;
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
                expect(ddtreeObj.value.length).toBe(24);
                expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
                let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
                expect(nchips.length).toBe(1);
                expect(nchips[0].innerText).toBe("24 item(s) selected");
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
                    expect(ddtreeObj.value.length).toBe(0);
                    let n_chips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
                    expect(n_chips.length).toBe(0);
                    expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Select All');
                    expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 400);
            }, 400);
        });

        it('Custom Mode with selectAll method', () => {
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
                },
                value: ['1'],
                showCheckBox: true,
                mode: 'Custom',
                showSelectAll: true,
            }, '#ddtree');
            ddtreeObj.selectAll(true);
            expect(ddtreeObj.value.length === 24).toBe(true);
            expect(ddtreeObj.element.parentElement.firstElementChild.classList.contains('e-chips-wrapper')).toBe(true);
            let nchips = ddtreeObj.element.parentElement.firstElementChild.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(1);
            expect(nchips[0].innerText).toBe("24 item(s) selected");
            ddtreeObj.selectAll(false);
            expect(ddtreeObj.value.length === 0).toBe(true);
        });
    });
});
