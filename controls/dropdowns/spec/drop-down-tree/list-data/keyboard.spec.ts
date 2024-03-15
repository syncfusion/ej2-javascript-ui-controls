import { createElement } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { listData } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';


describe('DropDown Tree control List datasource', () => {
    /**
      * Keyboard key testing
      */
    describe('keyboard event testing', () => {
        let ddtreeObj: any;
        let mouseEventArgs: any;
        let keyboardEventArgs: any
        let tapEvent: any;
        let originalTimeout: any;
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
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
            keyboardEventArgs = {
                preventDefault: (): void => { },
                action: null,
                target: null,
                currentTarget: null,
                stopImmediatePropagation: (): void => { },
            };

            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };

            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'ddtree' });
            document.body.appendChild(ele);
            ddtreeObj = undefined
        });
        afterEach((): void => {
            if (ddtreeObj)
                ddtreeObj.destroy();
            document.body.innerHTML = '';
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        it('tab key pressed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
        });
        it('shiftTab key pressed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            keyboardEventArgs.action = 'shiftTab';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
        });
        it('altDown key pressed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toBe('true');
        });
        it('altup key pressed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, destroyPopupOnHide: false }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toBe('true');
            keyboardEventArgs.action = 'altUp';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toBe('false');
            ddtreeObj.onFocusOut();
        });
        it('escape key pressed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, destroyPopupOnHide: false }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toBe('true');
            keyboardEventArgs.action = 'escape';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toBe('false');
            ddtreeObj.onFocusOut();
        });
        it('shiftTab key pressed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, destroyPopupOnHide: false }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toBe('true');
            keyboardEventArgs.action = 'shiftTab';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toBe('false');
            ddtreeObj.onFocusOut();
        });
        it('down arrow key pressed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[1].classList.contains('e-node-focus')).toBe(false);
            keyboardEventArgs.action = 'moveDown';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-node-focus')).toBe(false);
            expect(li[1].classList.contains('e-node-focus')).toBe(true);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[1].classList.contains('e-node-focus')).toBe(false);
            expect(li[5].classList.contains('e-node-focus')).toBe(true);
            ddtreeObj.onFocusOut();
        });
        it('up arrow key pressed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            var li = ddtreeObj.treeObj.element.querySelectorAll('li');
            keyboardEventArgs.action = 'moveDown';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[4].classList.contains('e-node-focus')).toBe(true);
            keyboardEventArgs.action = 'moveUp';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[3].classList.contains('e-node-focus')).toBe(true);
            expect(li[4].classList.contains('e-node-focus')).toBe(false);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[1].classList.contains('e-node-focus')).toBe(false);
            ddtreeObj.onFocusOut();
        });
        it('end key pressed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            var li = ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[19].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[19].classList.contains('e-node-focus')).toBe(false);
            keyboardEventArgs.action = 'end';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[19].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(false);
            expect(li[19].classList.contains('e-node-focus')).toBe(true);
            ddtreeObj.onFocusOut();
        });
        it('home key pressed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            keyboardEventArgs.action = 'end';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[19].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(false);
            expect(li[19].classList.contains('e-node-focus')).toBe(true);
            keyboardEventArgs.action = 'home';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[19].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[19].classList.contains('e-node-focus')).toBe(false);
            ddtreeObj.onFocusOut();
        });
        it('enter key pressed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[0].classList.contains('e-active')).toBe(false);
            keyboardEventArgs.action = 'enter';
            ddtreeObj.treeAction(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.showPopup();
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[0].classList.contains('e-active')).toBe(true);
            ddtreeObj.onFocusOut();
        });
        it('space key pressed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[0].classList.contains('e-active')).toBe(false);
            keyboardEventArgs.action = 'space';
            ddtreeObj.treeAction(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[0].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.text).toBe('Australia');
            ddtreeObj.onFocusOut();
        });
        it('space key pressed on showSelectAll', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, showSelectAll: true }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'moveDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.currentTarget = ddtreeObj.popupObj.element.querySelector('.e-selectall-parent');
            keyboardEventArgs.action = 'space';
            ddtreeObj.checkAllAction(keyboardEventArgs);
            expect(ddtreeObj.popupObj.element.querySelector('.e-selectall-parent').getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.value.length).toBe(24);
            keyboardEventArgs.action = 'shiftTab';
            ddtreeObj.treeAction(keyboardEventArgs);
            ddtreeObj.onFocusOut();
        });

        it('Focus treeview while enabling showCheckAll', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, showSelectAll: true }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'moveDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.currentTarget = ddtreeObj.popupObj.element.querySelector('.e-selectall-parent');
            keyboardEventArgs.action = 'moveDown';
            ddtreeObj.checkAllAction(keyboardEventArgs);
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            ddtreeObj.onFocusOut();
        });

        it('right arrow key pressed', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            var li = ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            expect(li[1].classList.contains('e-node-focus')).toBe(false);
            keyboardEventArgs.action = 'moveDown';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            expect(li[5].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
            keyboardEventArgs.action = 'moveRight';
            ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(li[5].classList.contains('e-hover')).toBe(false);
                expect(li[5].classList.contains('e-node-focus')).toBe(true);
                expect(li[5].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                expect(li[5].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                var newli = ddtreeObj.treeObj.element.querySelectorAll('li');
                keyboardEventArgs.action = 'moveRight';
                ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(newli[5].classList.contains('e-hover')).toBe(false);
                    expect(newli[6].classList.contains('e-hover')).toBe(false);
                    expect(newli[5].classList.contains('e-node-focus')).toBe(false);
                    expect(newli[6].classList.contains('e-node-focus')).toBe(true);
                    keyboardEventArgs.action = 'moveRight';
                    ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(newli[5].classList.contains('e-hover')).toBe(false);
                        expect(newli[6].classList.contains('e-hover')).toBe(false);
                        expect(newli[7].classList.contains('e-hover')).toBe(false);
                        expect(newli[5].classList.contains('e-node-focus')).toBe(false);
                        expect(newli[6].classList.contains('e-node-focus')).toBe(true);
                        expect(newli[7].classList.contains('e-node-focus')).toBe(false);
                        keyboardEventArgs.action = 'altUp';
                        ddtreeObj.treeAction(keyboardEventArgs);
                        ddtreeObj.onFocusOut();
                        done();
                    }, 250);
                }, 250);
            }, 250);
        });
        it('left arrow key pressed', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[1].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                keyboardEventArgs.action = 'moveLeft';
                ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(li[0].classList.contains('e-hover')).toBe(false);
                    expect(li[1].classList.contains('e-hover')).toBe(false);
                    expect(li[0].classList.contains('e-node-focus')).toBe(true);
                    expect(li[1].classList.contains('e-node-focus')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                    keyboardEventArgs.action = 'moveLeft';
                    ddtreeObj.treeObj.keyActionHandler(keyboardEventArgs);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(li[0].classList.contains('e-hover')).toBe(false);
                        expect(li[1].classList.contains('e-hover')).toBe(false);
                        expect(li[0].classList.contains('e-node-focus')).toBe(true);
                        expect(li[1].classList.contains('e-node-focus')).toBe(false);
                        keyboardEventArgs.action = 'escape';
                        ddtreeObj.treeAction(keyboardEventArgs);
                        ddtreeObj.onFocusOut();
                        done();
                    }, 450);
                }, 450);
            }, 450);
        });

        it('keyPress event testing', () => {
            var k = 0;
            var keyAction = '';
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                keyPress: function (args) {
                    k++;
                    keyAction = args.event.action;
                }
            }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            expect(k).toBe(0);
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(k).toBe(1);
            expect(keyAction).toBe('altDown');
            keyboardEventArgs.action = 'moveDown';
            ddtreeObj.treeAction(keyboardEventArgs);
            expect(k).toBe(2);
            expect(keyAction).toBe('moveDown');
            ddtreeObj.onFocusOut();

        });
        it('keyPress event cancelled on pressing enter', function () {
            var k = 0;
            var keyAction = '';
            var cancelled = 'false'
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                keyPress: function (args) {
                    k++;
                    keyAction = args.event.action;
                    if (args.event.action === 'enter') {
                        args.cancel = true;
                        cancelled = 'true'
                    }
                }
            }, '#ddtree');
            expect(k).toBe(0);
            keyboardEventArgs.action = 'tab';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(k).toBe(1);
            keyboardEventArgs.action = 'altDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(k).toBe(2);
            expect(keyAction).toBe('altDown');
            keyboardEventArgs.action = 'moveDown';
            ddtreeObj.treeAction(keyboardEventArgs);
            expect(k).toBe(3);
            keyboardEventArgs.action = 'enter';
            ddtreeObj.treeAction(keyboardEventArgs);
            expect(k).toBe(4);
            expect(keyAction).toBe('enter');
            expect(cancelled).toBe('true');
            expect(ddtreeObj.text).toBe(null)
            ddtreeObj.onFocusOut();
        });
    });
});
