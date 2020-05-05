import { createElement } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { listData, localData1 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';


describe('DropDown Tree control List datasource', () => {
    describe('combinational testing', () => {
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

        it('for enabled false with chip', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, value: ['1'], showCheckBox: true, mode: 'Box', enabled: false }, '#ddtree');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(1);
            var chipDelete = chips_1[0].querySelector('.e-chips-close');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia');
            let chips_2 = chipElement.querySelectorAll('.e-chips');
            expect(chips_2.length).toBe(1);
        });

        /**
        * zIndex
        */
        it('zIndex', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            ddtreeObj.showPopup();
            ddtreeObj.zIndex = 1333;
            ddtreeObj.dataBind();
        });

        it('for showCheckBox with Delimiter and autocheck enabled', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, mode: 'Delimiter', treeSettings: { autoCheck: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia');
            expect(ddtreeObj.value.length).toBe(5);
            expect(ddtreeObj.value[2]).toBe('3');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
            expect(ddtreeObj.value.length).toBe(9);
        });
        it('for showCheckBox with autoCheck and value', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, treeSettings: { autoCheck: true }, value: ['21', '7'] }, '#ddtree');
            expect(ddtreeObj.text).toBe('India,Assam,Bihar,Tamil Nadu,Punjab,Brazil,Paraná,Ceará,Acre');
        });
        it('for showCheckBox with Delimiter mode and autocheck & loadOnDemand enabled', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, mode: 'Delimiter', treeSettings: { autoCheck: true, loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia');
            expect(ddtreeObj.value.length).toBe(5);
            expect(ddtreeObj.value[2]).toBe('3');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
            expect(ddtreeObj.value.length).toBe(9);
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[5].querySelector('.e-icons');
            ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
                expect(ddtreeObj.value.length).toBe(9);
                ddtreeObj.treeSettings.autoCheck = false;
                ddtreeObj.showCheckBox = false;
                ddtreeObj.dataBind();
                expect(ddtreeObj.text).toBe("Australia");
                expect(ddtreeObj.value.length).toBe(1);
                done();
            }, 100);
        });

        it('for showCheckBox with Box mode and autoCheck enabled', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, mode: 'Box', treeSettings: { autoCheck: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia');
            expect(ddtreeObj.value.length).toBe(5);
            expect(ddtreeObj.value[2]).toBe('3');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(5);
            expect(chips[0].getAttribute("data-value")).toBe("1");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chips[4].querySelector(".e-chipcontent").textContent).toBe("Western Australia");
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
            expect(ddtreeObj.value.length).toBe(9);
            let nchips = chipElement.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(9);
            expect(nchips[7].querySelector(".e-chipcontent").textContent).toBe("Ceará");
            ddtreeObj.treeSettings.autoCheck = false;
            ddtreeObj.dataBind();
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[9].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[9].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[9].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre,China');
            expect(ddtreeObj.value.length).toBe(10);
            let nchips_1 = chipElement.querySelectorAll('.e-chips');
            expect(nchips_1.length).toBe(10);
            expect(nchips_1[9].querySelector(".e-chipcontent").textContent).toBe("China");
            ddtreeObj.showCheckBox = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
            let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
            let chips_3 = chipElement_1.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(0);
            ddtreeObj.delimiterChar = '?';
            ddtreeObj.showPopup();
            ddtreeObj.dataBind();
            let li: Element[] = <Element[] & NodeListOf<Element>>(ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
        });

        it('for showCheckBox with Box mode and autocheck & loadOnDemand enabled', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, mode: 'Box', treeSettings: { autoCheck: true, loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia');
            expect(ddtreeObj.value.length).toBe(5);
            expect(ddtreeObj.value[2]).toBe('3');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(5);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
            expect(ddtreeObj.value.length).toBe(9);
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(9);
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[5].querySelector('.e-icons');
            ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
                expect(ddtreeObj.value.length).toBe(9);
                ddtreeObj.treeSettings.autoCheck = false;
                ddtreeObj.dataBind();
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                let ncheckEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre,China');
                expect(ddtreeObj.value.length).toBe(10);
                ddtreeObj.showCheckBox = false;
                ddtreeObj.dataBind();
                expect(ddtreeObj.text).toBe('Australia');
                expect(ddtreeObj.value.length).toBe(1);
                let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
                let chips_3 = chipElement_1.querySelectorAll('.e-chips');
                expect(chips_3.length).toBe(0);
                (ddtreeObj as any).onFocusOut();
                done();
            }, 450);
        });

        it('for showCheckBox with Default mode and autocheck & loadOnDemand enabled', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, treeSettings: { autoCheck: true, loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.value.length).toBe(5);
            expect(ddtreeObj.value[2]).toBe('3');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(5);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            (ddtreeObj as any).onFocusOut();
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia');
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.showPopup();
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.value.length).toBe(9);
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(9);
            (ddtreeObj as any).onFocusOut();
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
            ddtreeObj.showPopup();
            let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[5].querySelector('.e-icons');
            ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre');
                expect(ddtreeObj.value.length).toBe(9);
                ddtreeObj.treeSettings.autoCheck = false;
                ddtreeObj.dataBind();
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                let ncheckEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                ncheckEle[9].querySelector('.e-frame').dispatchEvent(e);
                expect(ddtreeObj.value.length).toBe(10);
                (ddtreeObj as any).onFocusOut();
                expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia,Brazil,Paraná,Ceará,Acre,China');
                ddtreeObj.showPopup();
                ddtreeObj.dataBind();
                ddtreeObj.showCheckBox = false;
                ddtreeObj.dataBind();
                expect(ddtreeObj.text).toBe('Australia');
                expect(ddtreeObj.value.length).toBe(1);
                let chipElement_1 = ddtreeObj.element.parentElement.firstElementChild;
                let chips_3 = chipElement_1.querySelectorAll('.e-chips');
                expect(chips_3.length).toBe(0);
                (ddtreeObj as any).onFocusOut();
                done();
            }, 400);
        });
        /**
         * loadOnDemand with checkbox
         */
        it('for loadOnDemand and autoCheck enabled', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, treeSettings: { autoCheck: true, loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[2].querySelector('.e-frame').dispatchEvent(e);
            expect(checkEle[2].getAttribute('aria-checked')).toBe('true');
            expect(ddtreeObj.value.length).toBe(1);
            expect(ddtreeObj.value[0]).toBe('3');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].getAttribute("data-value")).toBe("3");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Victoria");
            expect(document.querySelector('.e-popup').classList.contains('e-popup-open')).toBe(true);
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(ddtreeObj.text).toBe('Victoria');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.showPopup();
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[5].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.value.length).toBe(5);
            let nchips = chipElement.querySelectorAll('.e-chips');
            expect(nchips.length).toBe(5);
            expect(nchips[1].querySelector(".e-chipcontent").textContent).toBe("Brazil");
            (ddtreeObj as any).onFocusOut();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            expect(ddtreeObj.text).toBe('Victoria,Brazil,Paraná,Ceará,Acre');
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
        });

        it('Enabling multiselect and using selectAll method and check for the select all checkbox state', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' },
                value: ['1'],
                showCheckBox: true,
                showSelectAll: true,
                allowMultiSelection: true
            }, '#ddtree');
            ddtreeObj.selectAll(true);
            ddtreeObj.showPopup();
            expect(ddtreeObj.popupEle.querySelectorAll('.e-selectall-parent .e-checkbox-wrapper[aria-checked=true]').length === 1).toBe(true);
            ddtreeObj.hidePopup();
            ddtreeObj.onFocusOut();
        });

        it('Chip Delete testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, allowMultiSelection: true, mode: 'Box', treeSettings: { loadOnDemand: true } }, '#ddtree');
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
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(2);
            var chipDelete = chips_1[1].querySelector('.e-chips-close');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia');
        });
        it('Chip Delete dynamically changed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, allowMultiSelection: true, mode: 'Box', treeSettings: { loadOnDemand: true } }, '#ddtree');
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
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(2);
            ddtreeObj.showClearButton = false;
            ddtreeObj.dataBind();
            var chipDelete = chips_1[0].querySelector('.e-chips-close');
            expect(chipDelete.classList.contains('e-icon-hide')).toBe(true);
        });

        it('Invalid value testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, treeSettings: { loadOnDemand: true } }, '#ddtree');
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
            expect(document.querySelector('.e-popup').classList.contains('e-popup-close')).toBe(true);
            ddtreeObj.allowMultiSelection = true;
            ddtreeObj.dataBind();
            ddtreeObj.onFocusOut();
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].getAttribute("data-value")).toBe("1");
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chipElement.classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.showPopup();
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            mouseEventArgs.ctrlKey = true;
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(li[2].classList.contains('e-active')).toBe(true);
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(2);
            ddtreeObj.hidePopup();
            ddtreeObj.onFocusOut();
            ddtreeObj.text = "aaaa";
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            let chips_2 = chipElement.querySelectorAll('.e-chips');
            expect(chips_2.length).toBe(2);
            ddtreeObj.value = ["aaaa"];
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia,Victoria');
            let chips_3 = chipElement.querySelectorAll('.e-chips');
            expect(chips_3.length).toBe(2);
        });

        it('Chip Delete testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, mode: 'Box', treeSettings: { loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            var chipDelete = chips[0].querySelector('.e-chips-close');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            expect(ddtreeObj.text).toBe(null);
        });
        it('Chip Delete dynamically changed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, mode: 'Box', treeSettings: { loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(1);
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.showClearButton = false;
            ddtreeObj.dataBind();
            var chipDelete = chips[0].querySelector('.e-chips-close');
            expect(chipDelete.classList.contains('e-icon-hide')).toBe(true);
        });
        it('parent chip Deleting with autoCheck enabled', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, showCheckBox: true, mode: 'Box', treeSettings: { autoCheck: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia');
            let chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            let chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(5);
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            var chipDelete = chips[0].querySelector('.e-chips-close');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            expect(ddtreeObj.text).toBe(null);
            let chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(0);
        });

        it('blur event testing after clearing value', () => {
            var i = 0;
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' 
                },
                blur: function(){
                    i++;
                } ,
            }, '#ddtree');
            expect(i).toEqual(0);
            ddtreeObj.showPopup();
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.text).toBe("Australia");
            let ele1: HTMLElement = (ddtreeObj as any).element.nextElementSibling;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            expect(ddtreeObj.text).toBe(null);
            ddtreeObj.onFocusOut();
            expect(i).toEqual(1);
        });
        it('Invalid text testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: listData, value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' }, allowMultiSelection: true }, '#ddtree');
            ddtreeObj.text = 'Australia,Brazil,aaaa';
            ddtreeObj.dataBind();
            expect(ddtreeObj.value.length).toBe(2);
        });
        it('noRecordTemplate should not shown after providing valid data source', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: [], value: "id", text: "name", parentValue: "pid", hasChildren: "hasChild", expanded: 'expanded' } }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(true);
            expect((ddtreeObj as any).popupObj.element.firstElementChild.innerText).toBe('No Records Found');
            ddtreeObj.fields.dataSource = listData;
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(false);
            var li = ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li.length).not.toBe(0);
        });

        it('selecting an item in itemTemplate support', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: localData1, value: "nodeId", parentValue: 'nodePid', text: "nodeText", hasChildren: "hasChild", expanded: 'nodeExpanded1' }, itemTemplate: '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}' }, '#ddtree');
            setTimeout(function () {
                ddtreeObj.showPopup();
                let li: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('.e-text-content');
                expect(li[0].querySelector('i')).not.toBe(null);
                expect(li[0].querySelector('b')).toBe(null);
                expect(li[1].querySelector('b')).not.toBe(null);
                expect(li[1].querySelector('i')).toBe(null);
                var liEle = ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = liEle[0].querySelector('.e-list-text');
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.text).toBe('Music')
                ddtreeObj.hidePopup();
                done();
            }, 450);
        });
    });

    describe('combinational testing', () => {
        let ddTreeObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdowntree' });
        element.setAttribute('name', 'ddtree');
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            ddTreeObj = new DropDownTree({ fields: { dataSource: listData, value: 'id', parentValue: 'pid', hasChildren: 'hasChild', text: 'name' } });
            ddTreeObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('htmlAttributes with name attribute', () => {
            expect(ddTreeObj.hiddenElement.getAttribute('name')).not.toBeNull();
            expect(ddTreeObj.hiddenElement.getAttribute('name')).toBe('ddtree');
        });
    });

    describe('combinational testing', () => {
        let ddTreeObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdowntree' });
        element.setAttribute('aria-required', 'true');
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            ddTreeObj = new DropDownTree({ fields: { dataSource: listData, value: 'id', parentValue: 'pid', hasChildren: 'hasChild', text: 'name' } });
            ddTreeObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('htmlAttributes with aria-required attribute', () => {
            expect(ddTreeObj.hiddenElement.getAttribute('aria-required')).not.toBeNull();
            expect(ddTreeObj.hiddenElement.getAttribute('aria-required')).toBe('true');
        });
    });

    describe('combinational testing', () => {
        let ddTreeObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdowntree' });
        element.setAttribute('name', 'ddtree');
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let tapEvent = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        var i = 0;
        beforeAll(() => {
            document.body.appendChild(element);
            ddTreeObj = new DropDownTree({
                fields: { dataSource: listData, value: 'id', parentValue: 'pid', hasChildren: 'hasChild', text: 'name' },
                change: function () {
                    i++;
                }
            });
            ddTreeObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('for change event trigger after clearing value', () => {
            ddTreeObj.showPopup();
            var liEle = ddTreeObj.treeObj.element.querySelectorAll('li');
            expect(i).toBe(0);
            mouseEventArgs.target = liEle[0].querySelector('.e-list-text');
            ddTreeObj.treeObj.touchClickObj.tap(tapEvent);
            expect(ddTreeObj.text).toBe('Australia')
            ddTreeObj.onFocusOut();
            expect(i).toBe(1);
            ddTreeObj.showPopup();
            let ele1: HTMLElement = (ddTreeObj as any).element.nextElementSibling;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele1.dispatchEvent(e);
            expect((ddTreeObj as any).element.value).toBe("");
            mouseEventArgs.target = liEle[2].querySelector('.e-list-text');
            ddTreeObj.treeObj.touchClickObj.tap(tapEvent);
            expect(ddTreeObj.text).toBe('Victoria');
            ddTreeObj.onFocusOut();
            expect(i).toBe(2);
        });
    });
});
