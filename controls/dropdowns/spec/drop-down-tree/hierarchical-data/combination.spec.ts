import { createElement, Browser } from '@syncfusion/ej2-base';
import { DropDownTree } from '../../../src/drop-down-tree/drop-down-tree';
import { hierarchicalData3, hierarchicalData1 } from '../dataSource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';


describe('DropDown Tree control hierarchical datasource', () => {
    describe('combinational testing', () => {
        let originalTimeout: any;
        let ddtreeObj: any;
        let mouseEventArgs: any;
        let tapEvent: any;
        let keyboardEventArgs: any;
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
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
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
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, value: ['1'], showCheckBox: true, mode: 'Box', enabled: false }, '#ddtree');
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
        it('KeyBoard interaction while enabled false', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, enabled: false }, '#ddtree');
            keyboardEventArgs.action = 'tab';
            keyboardEventArgs.action = 'altDown';
            keyboardEventArgs.action = 'moveDown';
            ddtreeObj.keyActionHandler(keyboardEventArgs);
            expect(document.querySelector('.e-popup')).toBe(null);
            expect(ddtreeObj.element.getAttribute("aria-expanded")).toBe('false');
        });
        it('for showCheckBox with Delimiter and autocheck enabled', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Delimiter', treeSettings: { autoCheck: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
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
            ddtreeObj.showCheckBox = false;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('Australia');
            expect(ddtreeObj.value.length).toBe(1);
        });
        it('for showCheckBox with autoCheck and value', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, treeSettings: { autoCheck: true }, value: ['21', '7'] }, '#ddtree');
            expect(ddtreeObj.text).toBe('India,Brazil,Assam,Bihar,Tamil Nadu,Punjab,Paraná,Ceará,Acre');
        });
        it('for showCheckBox with Delimiter mode and autocheck & loadOnDemand enabled', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Delimiter', treeSettings: { autoCheck: true, loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
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
                done();
            }, 400);
        });

        it('for showCheckBox with Box mode and autoCheck enabled', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Box', treeSettings: { autoCheck: true }, 
        destroyPopupOnHide: false }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
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
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Box', treeSettings: { autoCheck: true, loadOnDemand: true } }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
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
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
            showCheckBox: true, treeSettings: { autoCheck: true, loadOnDemand: true }, destroyPopupOnHide: false }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
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
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true,
            treeSettings: { autoCheck: true, loadOnDemand: true }, destroyPopupOnHide: false }, '#ddtree');
            let ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>ddtreeObj.treeObj.element.querySelectorAll('li');
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
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                value: ['1'],
                showCheckBox: true,
                showSelectAll: true,
                allowMultiSelection: true
            }, '#ddtree');
            ddtreeObj.selectAll(true);
            ddtreeObj.showPopup();
            expect(ddtreeObj.popupEle.querySelectorAll('.e-selectall-parent[aria-checked=true]').length === 1).toBe(true);
            ddtreeObj.hidePopup();
            ddtreeObj.onFocusOut();
        });

        it('Chip Delete testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, allowMultiSelection: true, mode: 'Box', treeSettings: { loadOnDemand: true } }, '#ddtree');
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
            let chips_2 = chipElement.querySelectorAll('.e-chips');
            expect(chips_2.length).toBe(1);
            mouseEventArgs.target = chips_2[0].querySelector('.e-chips-close');
            ddtreeObj.clickHandler(mouseEventArgs);
        });
        it('Chip Delete dynamically changed', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, allowMultiSelection: true, mode: 'Box', treeSettings: { loadOnDemand: true } }, '#ddtree');
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

        it('blur event testing after clearing value', () => {
            var i = 0;
            ddtreeObj = new DropDownTree({
                fields: {
                    dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"
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

        it('Invalid value testing', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
            treeSettings: { loadOnDemand: true }, wrapText: true, destroyPopupOnHide: false }, '#ddtree');
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
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Box', treeSettings: { loadOnDemand: true } }, '#ddtree');
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
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Box', treeSettings: { loadOnDemand: true } }, '#ddtree');
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
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Box', treeSettings: { autoCheck: true } }, '#ddtree');
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
        it('noRecordTemplate should not shown after providing valid data source', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: [], value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(true);
            expect((ddtreeObj as any).popupObj.element.firstElementChild.innerText).toBe('No Records Found');
            ddtreeObj.fields.dataSource = hierarchicalData3;
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(false);
            var li = ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li.length).not.toBe(0);
        });

        it('updating noRecordTemplate after providing valid data source', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: [], value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
            ddtreeObj.showPopup();
            expect((ddtreeObj as any).popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(true);
            expect((ddtreeObj as any).popupObj.element.firstElementChild.innerText).toBe('No Records Found');
            ddtreeObj.fields.dataSource = hierarchicalData3;
            ddtreeObj.dataBind();
            var li = ddtreeObj.treeObj.element.querySelectorAll('li');
            expect(li.length).not.toBe(0);
            ddtreeObj.noRecordsTemplate = 'No Valid data available';
            ddtreeObj.dataBind();
            expect((ddtreeObj as any).popupObj.element.firstElementChild.classList.contains('e-no-data')).toBe(false);
        });

        it('updating Mode', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, allowMultiSelection: true, mode: "Box" , wrapText: true}, '#ddtree');
            ddtreeObj.showPopup();
            var liEle = ddtreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = liEle[0].querySelector('.e-list-text');
            ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
            expect(ddtreeObj.element.parentElement.classList.contains('e-show-chip')).toBe(true);
            ddtreeObj.mode = 'Delimiter';
            ddtreeObj.dataBind();
            expect(ddtreeObj.element.parentElement.classList.contains('e-show-chip')).toBe(false);
        });

        it('updating showSelectAll state', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, showSelectAll: true }, '#ddtree');
            ddtreeObj.showPopup();
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
            setTimeout(function () {
                expect(ddtreeObj.value.length).toBe(24);
                expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Unselect All');
                ddtreeObj.value = [];
                ddtreeObj.dataBind();
                setTimeout(function () {
                    expect(ddtreeObj.value.length).toBe(0);
                    expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Select All');
                    ddtreeObj.onFocusOut();
                    done();
                }, 400);
            }, 400);
        });

        it('updating selectAll method with showCheckBox', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, showSelectAll: true }, '#ddtree');
            ddtreeObj.showPopup();
            var selectAllElement = ddtreeObj.popupEle.firstElementChild;
            expect(selectAllElement.classList.contains('e-selectall-parent')).toBe(true);
            expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Select All');
            ddtreeObj.selectAll(true);
            setTimeout(function () {
                expect(ddtreeObj.value.length).toBe(24);
                var selectAllElement = ddtreeObj.popupEle.firstElementChild;
                expect(selectAllElement.classList.contains('e-selectall-parent')).toBe(true);
                expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Unselect All');
                ddtreeObj.selectAll(false);
                setTimeout(function () {
                    expect(ddtreeObj.value.length).toBe(0);
                    var selectAllElement = ddtreeObj.popupEle.firstElementChild;
                    expect(selectAllElement.classList.contains('e-selectall-parent')).toBe(true);
                    expect(selectAllElement.querySelector('.e-all-text').textContent).toBe('Select All');
                    ddtreeObj.onFocusOut();
                    done();
                }, 400);
            }, 400);
        })

        it('showClearButton and allowMultiSelection enabled ', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, allowMultiSelection: true, mode: "Box" }, '#ddtree');
            expect((ddtreeObj as any).element.nextElementSibling.classList.contains('e-clear-icon')).toBe(true);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var li = (ddtreeObj as any).treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.showClearButton = false;
            ddtreeObj.dataBind();
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(true);
            expect(ddtreeObj.element.parentElement.querySelectorAll('.e-chips-wrapper')[0].querySelector('.e-chips-close').classList.contains('e-icon-hide')).toBe(true);
            ddtreeObj.hidePopup();
            ddtreeObj.showClearButton = true;
            ddtreeObj.dataBind();
            ddtreeObj.showPopup();
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            tapEvent.tapCount = 1;
            (ddtreeObj as any).treeObj.touchClickObj.tap(tapEvent);
            expect((ddtreeObj).element.nextElementSibling.classList.contains('e-icon-hide')).toBe(false);
            expect(ddtreeObj.element.parentElement.querySelectorAll('.e-chips-wrapper')[0].querySelector('.e-chips-close').classList.contains('e-icon-hide')).toBe(false);
        });

        it('selecting an item in itemTemplate support', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' }, itemTemplate: '${if(nodeChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}' }, '#ddtree');
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

        it('showCheckbox enabled dynamically ', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child", selected: 'isSelected' } }, '#ddtree');
            ddtreeObj.showCheckBox = true;
            ddtreeObj.dataBind();
            expect(ddtreeObj.text).toBe('New South Wales');
        });
        it('for text when loadOnDemand enabled', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild" }, treeSettings: { loadOnDemand: true }, text: 'Game.exe' }, '#ddtree');
            expect(ddtreeObj.text).toBe('Game.exe');
            expect(ddtreeObj.value.length).toBe(1);
        });

        it('IE browser testing', (done: Function) => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' }, }, '#ddtree');
            setTimeout(function () {
                Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
                ddtreeObj.showPopup();
                expect(ddtreeObj.element.parentElement.classList.contains('e-input-focus')).toBe(true);
                var liEle = ddtreeObj.treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = liEle[0].querySelector('.e-list-text');
                ddtreeObj.treeObj.touchClickObj.tap(tapEvent);
                expect(ddtreeObj.text).toBe('Music')
                ddtreeObj.hidePopup();
                mouseEventArgs.target = ddtreeObj.element.parentElement;
                ddtreeObj.focusOut(mouseEventArgs);
                done();
            }, 450);
        });

        it('for showDropDownIcon and placeholder', () => {
            ddtreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild" }, showDropDownIcon: false, placeholder: 'Select Value', floatLabelType: 'Auto', showCheckBox: true,
                mode: 'Box'
            }, '#ddtree');
            expect(ddtreeObj.element.parentElement.classList.contains('e-input-group')).toBe(true);
        });
        it('for scrollerClick', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData1, value: "nodeId", text: "nodeText", child: "nodeChild" }, placeholder: 'Select Value', floatLabelType: 'Auto', popupHeight: '200px' }, '#ddtree');
            expect(ddtreeObj.element.parentElement.classList.contains('e-input-group')).toBe(true);
            ddtreeObj.showPopup();
            mouseEventArgs.target = ddtreeObj.popupDiv;
            ddtreeObj.onDocumentClick(mouseEventArgs);
        });
        it('Remove selected items from the input box using close icon after closing the popup', function () {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, showCheckBox: true, mode: 'Box', treeSettings: { autoCheck: true } }, '#ddtree');
            var ele = ddtreeObj.element;
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            ele.dispatchEvent(e);
            var checkEle = ddtreeObj.treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            checkEle[0].querySelector('.e-frame').dispatchEvent(e);
            expect(ddtreeObj.text).toBe('Australia,New South Wales,Victoria,South Australia,Western Australia');
            var chipElement = ddtreeObj.element.parentElement.firstElementChild;
            expect(chipElement.classList.contains('e-chips-wrapper')).toBe(true);
            var chips = chipElement.querySelectorAll('.e-chips');
            expect(chips.length).toBe(5);
            expect(chips[0].querySelector(".e-chipcontent").textContent).toBe("Australia");
            expect(chipElement.classList.contains('e-icon-hide')).toBe(false);
            ddtreeObj.hidePopup();
            var chipDelete = chips[4].querySelector('.e-chips-close');
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            chipDelete.dispatchEvent(e);
            expect(ddtreeObj.text).toBe('New South Wales,Victoria,South Australia');
            var chips_1 = chipElement.querySelectorAll('.e-chips');
            expect(chips_1.length).toBe(3);
        });
    });
    describe('combinational testing', () => {
        let element: HTMLInputElement;
        let ddtTreeObj: any;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('form', { id: 'form1' });
            element.innerHTML = `<input type="text" id="ddt">
            <input type="reset" id="resetForm"/>`;
            document.body.appendChild(element);
            ddtTreeObj = new DropDownTree({ 
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                value: ['7']
            });
            ddtTreeObj.appendTo('#ddt');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('reset the form with single selection', (done) => {
            expect(ddtTreeObj.hiddenElement.querySelector('option').value).toBe('7');
            document.getElementById('resetForm').click();
            setTimeout(() => {
                expect(ddtTreeObj.hiddenElement.querySelector('option')).toBe(null);
                done();
            });
        });
    });

    describe('combinational testing', () => {
        let element: HTMLInputElement;
        let ddtTreeObj: any;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('form', { id: 'form1' });
            element.innerHTML = `<input type="text" id="ddt">
            <input type="reset" id="resetForm"/>`;
            document.body.appendChild(element);
            ddtTreeObj = new DropDownTree({
                fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" },
                value: ['7', '21'],
                allowMultiSelection: true
            });
            ddtTreeObj.appendTo('#ddt');
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('reset the form with multiple selection', (done) => {
            expect((ddtTreeObj.hiddenElement.querySelectorAll('option')[1]).value).toBe('21');
            document.getElementById('resetForm').click();
            setTimeout(() => {
                expect(ddtTreeObj.hiddenElement.querySelector('option')).toBe(null);
                done();
            });
        });
    });
    describe('combinational testing', () => {
        let ddTreeObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdowntree' });
        element.setAttribute('name', 'ddtree');
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            document.body.appendChild(element);
            ddTreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
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
        let tapEvent = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        beforeAll(() => {
            document.body.appendChild(element);
            ddTreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" } }, '#ddtree');
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

        it('updating value after clearing', () => {
            ddTreeObj.showPopup();
            let li: Element[] = <Element[] & NodeListOf<Element>>ddTreeObj.treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-icons');
            ddTreeObj.treeObj.touchClickObj.tap(tapEvent);
        });
    });

    // angular tag testing
    describe('Angular tag testing ', () => {
        let ddTreeObj: any;
        beforeAll(() => {
            let element: any = createElement('EJS-DROPDOWNTREE', { id: 'dropdowntree' });
            document.body.appendChild(element);
            ddTreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" } });
            ddTreeObj.appendTo(element);
        });
        afterAll(() => {
            ddTreeObj.destroy();
            document.body.innerHTML = '';
        });
        it('Wrapper testing ', () => {
            expect(ddTreeObj.element.tagName).toEqual('EJS-DROPDOWNTREE');
            expect(ddTreeObj.inputWrapper.parentElement).toBe(ddTreeObj.element);
        });
    });

    // DOM Element testing

    describe('combinational testing', () => {
        let originalTimeout: any;
        let ddtreeObj: any;
        let mouseEventArgs: any;
        let tapEvent: any;
        let keyboardEventArgs: any;
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

        it('Hidden element testing while declaring value property at initial rendering', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, value: ['1'] }, '#ddtree');
            var hiddenElement = ddtreeObj.inputWrapper.querySelector('option');
            expect(hiddenElement).not.toBe(null);
            expect(hiddenElement.getAttribute('value')).toBe('1');
            expect(hiddenElement.text).toBe('Australia');
        });
        it('Hidden element testing while declaring value property at initial rendering', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child" }, text: 'Acre' }, '#ddtree');
            var hiddenElement = ddtreeObj.inputWrapper.querySelector('option');
            expect(hiddenElement).not.toBe(null);
            expect(hiddenElement.getAttribute('value')).toBe('10');
            expect(hiddenElement.text).toBe('Acre');
        });
        it('Hidden element testing while declaring value property at initial rendering', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child", selected: 'isSelected' } }, '#ddtree');
            var hiddenElement = ddtreeObj.inputWrapper.querySelector('option');
            expect(hiddenElement).not.toBe(null);
            expect(hiddenElement.getAttribute('value')).toBe('2');
            expect(hiddenElement.text).toBe('New South Wales');
        });
        it('Hidden element testing while declaring value property dynamically', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"} }, '#ddtree');
            var hiddenElement = ddtreeObj.inputWrapper.querySelector('option');
            expect(hiddenElement).toBe(null);
            ddtreeObj.value = ['1'];
            ddtreeObj.dataBind();
            var hiddenElement_1 = ddtreeObj.inputWrapper.querySelector('option');
            expect(hiddenElement_1).not.toBe(null);
            expect(hiddenElement_1.getAttribute('value')).toBe('1');
            expect(hiddenElement_1.text).toBe('Australia');
        });
        it('Hidden element testing while declaring text property dynamically', () => {
            ddtreeObj = new DropDownTree({ fields: { dataSource: hierarchicalData3, value: "id", text: "name", expanded: 'expanded', child: "child"} }, '#ddtree');
            var hiddenElement = ddtreeObj.inputWrapper.querySelector('option');
            expect(hiddenElement).toBe(null);
            ddtreeObj.text = 'Acre'
            ddtreeObj.dataBind();
            var hiddenElement_1 = ddtreeObj.inputWrapper.querySelector('option');
            expect(hiddenElement_1).not.toBe(null);
            expect(hiddenElement_1.getAttribute('value')).toBe('10');
            expect(hiddenElement_1.text).toBe('Acre');
        });
    });
});
