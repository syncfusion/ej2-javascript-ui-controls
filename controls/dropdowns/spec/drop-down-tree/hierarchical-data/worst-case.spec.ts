import { createElement, Browser } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { hierarchicalData3 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';


describe('DropDown Tree control hierarchial datasource', () => {
    describe('Worst case testing', () => {
        let ddtreeObj: any;
        let mouseEventArgs: any;
        let keyboardEventArgs: any
        let tapEvent: any;
        beforeEach((): void => {
            mouseEventArgs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                relatedTarget: null,
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
        });
        it('for window resize', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
            ddtreeObj.showPopup();
            ddtreeObj.windowResize();
            ddtreeObj.onFocusOut();
        });
        it('selecAllText without setting selectAll', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
            ddtreeObj.selectAllText = 'Select All Text';
            ddtreeObj.dataBind();
            ddtreeObj.showPopup();
            var selectAllElement = ddtreeObj.popupEle.firstElementChild;
            expect(selectAllElement.classList.contains('e-selectall-parent')).toBe(false);
        });
        it('disabed after destroy', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
            ddtreeObj.showPopup();
            ddtreeObj.onFocusOut();
            ddtreeObj.destroy();
            ddtreeObj.enabled = true;
            ddtreeObj.dataBind();
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
        });
        it('for branch coverage', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
            mouseEventArgs.target = ddtreeObj.element.parentElement;
            mouseEventArgs.relatedTarget = null;
            ddtreeObj.focusOut(mouseEventArgs);
        });
    });
});
