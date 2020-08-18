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

    describe('valueOverFlow -', () => {
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
        it('For allowMultiSelection with Default mode', () => {
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
            expect(oveflowElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.onFocusOut();
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('For allowMultiSelection with Box mode', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                allowMultiSelection: true,
                width: '250px',
                mode: 'Box'
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
            expect(oveflowElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.onFocusOut();
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('For allowMultiSelection with Delimiter mode', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                allowMultiSelection: true,
                width: '250px',
                mode: 'Delimiter',
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
            let oveflowElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(oveflowElement.classList.contains('e-overflow')).toBe(true);
            expect(oveflowElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.onFocusOut();
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('For allowMultiSelection with initial mutiple value', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                allowMultiSelection: true,
                value : ['1', '2', '3'],
                width: '250px'
            }, '#ddtree');
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('For allowMultiSelection with initial mutiple text', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                allowMultiSelection: true,
               text: 'Australia, China, France, India',
                width: '250px',
            }, '#ddtree');
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('For allowMultiSelection with selected field', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', selected: 'isSelected', child: "child" },
                allowMultiSelection: true,
               text: 'Australia, China, France, India',
                width: '150px',
            }, '#ddtree');
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('allowMultiSelection enabled dynamically', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                width: '250px',
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
            ddtreeObj.allowMultiSelection = true;
            ddtreeObj.dataBind();
            ddtreeObj.shiftKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            ddtreeObj.shiftKey = true;
            mouseEventArgs.target = li[li.length-1].querySelector('.e-list-text');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            let oveflowElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(oveflowElement.classList.contains('e-overflow')).toBe(true);
            expect(oveflowElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.onFocusOut();
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('switching between various mode', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                allowMultiSelection: true,
                width: '250px',
                mode: 'Box',
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
            ddtreeObj.mode = 'Box';
            ddtreeObj.dataBind();
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-chips-wrapper')).toBe(true);
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(false);
            let nchips = nchipElement.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(3);
            let overflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(overflowElement.classList.contains('e-overflow')).toBe(true);
            expect(overflowElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.mode = 'Default';
            ddtreeObj.dataBind();
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(3);
            let noverflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noverflowElement.classList.contains('e-overflow')).toBe(true);
        });
        it('For showCheckBox with Default mode', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                showCheckBox: true,
                width: '250px',
            }, '#ddtree');
            ddtreeObj.showPopup();
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(3);
            let oveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(oveflowElement.classList.contains('e-overflow')).toBe(true);
            expect(oveflowElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.onFocusOut();
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('For showCheckBox with Box mode', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                showCheckBox: true,
                width: '250px',
                mode: 'Box'
            }, '#ddtree');
            ddtreeObj.showPopup();
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(3);
            let oveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(oveflowElement.classList.contains('e-overflow')).toBe(true);
            expect(oveflowElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.onFocusOut();
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('For showCheckBox with Delimiter mode', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                showCheckBox: true,
                width: '250px',
                mode: 'Delimiter'
            }, '#ddtree');
            ddtreeObj.showPopup();
            let li: any = ddtreeObj.treeObj.element.querySelectorAll('li');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            let oveflowElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(oveflowElement.classList.contains('e-overflow')).toBe(true);
            expect(oveflowElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.onFocusOut();
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true)
        });
        it('For showCheckBox with initial mutiple value', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                showCheckBox: true,
                value : ['1', '2', '3'],
                width: '250px'
            }, '#ddtree');
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('For showCheckBox with initial mutiple text', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                showCheckBox: true,
               text: 'Australia, China, France, India',
                width: '250px',
            }, '#ddtree');
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('For showCheckBox with selected field', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', selected: 'isSelected', child: "child" },
                showCheckBox: true,
               text: 'Australia, China, France, India',
                width: '150px',
            }, '#ddtree');
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('showCheckBox enabled dynamically', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                width: '250px',
            }, '#ddtree');
            ddtreeObj.showCheckBox = true;
            ddtreeObj.dataBind();
            ddtreeObj.showPopup();
            let ncheckEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ncheckEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ncheckEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ncheckEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ncheckEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ncheckEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ncheckEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ncheckEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ncheckEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ncheckEle[2].querySelector('.e-frame').dispatchEvent(e);
            let chipElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(3);
            let oveflowElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(oveflowElement.classList.contains('e-overflow')).toBe(true);
            expect(oveflowElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.onFocusOut();
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(true);
            let noveflowElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(noveflowElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.focusIn();
            let newchipElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(newchipElement.classList.contains('e-icon-hide')).toBe(false);
            let newoveflowElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(newoveflowElement.classList.contains('e-icon-hide')).toBe(true);
        });
        it('switching between various mode', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                showCheckBox: true,
                width: '250px',
                mode: 'Box'
            }, '#ddtree');
            ddtreeObj.showPopup();
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[1].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            let nchipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(nchipElement.classList.contains('e-chips-wrapper')).toBe(true);
            expect(nchipElement.classList.contains('e-icon-hide')).toBe(false);
            let nchips = nchipElement.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(3);
            let overflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(overflowElement.classList.contains('e-overflow')).toBe(true);
            expect(overflowElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.mode = 'Default';
            ddtreeObj.dataBind();
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(3);
            let noverflowElement = ddtreeObj.element.parentElement.firstElementChild.nextElementSibling;
            expect(noverflowElement.classList.contains('e-overflow')).toBe(true);
        });
    });
});
