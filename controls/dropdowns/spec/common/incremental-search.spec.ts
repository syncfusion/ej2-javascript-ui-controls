/**
 * listbase spec document
 */
import { createElement, addClass, removeClass, isUndefined } from '@syncfusion/ej2-base';
import { DropDownBase } from '../../src/drop-down-base/drop-down-base';
import { incrementalSearch, Search } from '../../src/common/incremental-search';
import '../../node_modules/es6-promise/dist/es6-promise';


describe('Incremental search', () => {

    describe('Local data', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, charCode: 65 };
        let listObj: any;
        let element: HTMLElement;
        let searchList: { [key: string]: Object }[] = [{ text: "Algeria" }, { text: "Bangladesh" }, { text: "Finland" },
        { text: "Cuba" }, { text: "Denmark", }, { text: "Egypt" }, { text: "Armenia" }, { text: "India" }, { text: "Malaysia" }];
        let li3: HTMLElement;
        let li1: HTMLElement;
        let li2: HTMLElement;
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            element = createElement('div', { id: 'listbase' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('"a" key pressing ', () => {
            listObj = new DropDownBase({ dataSource: searchList, fields: { text: 'text' } });
            listObj.appendTo(element);
            listObj.index = 3;
            listObj.dataBind();
            let charCode: number = 65;
            li1 = incrementalSearch(charCode, listObj.getItems(), 3, true) as HTMLElement;
            expect(li1.innerText).toBe("Armenia");
            addClass([li1], 'e-active');
        });
        it('again again "a" key pressing ', (done) => {
            setTimeout(() => {
                let charCode: number = 65;
                li2 = incrementalSearch(charCode, listObj.getItems(), 6, true) as HTMLElement;
                expect(li2.innerText).toBe("Algeria");
                addClass([li2], 'e-active');
                removeClass([li1], 'e-active');
                done();
            }, 2000)
        });
        it('again "a" key pressing ', (done) => {
            setTimeout(() => {
                let charCode: number = 65;
                li2 = incrementalSearch(charCode, listObj.getItems(), 6, true) as HTMLElement;
                expect(li2.innerText).toBe("Algeria");
                addClass([li2], 'e-active');
                removeClass([li1], 'e-active');
                done();
            }, 2000)
        });
        it('I key with camelcase false', (done) => {
            setTimeout(() => {
                let charCode: number = 73;
                li3 = incrementalSearch(charCode, listObj.getItems(), 6, false) as HTMLElement;
                expect(li3.innerText).toBe("India");
                addClass([li3], 'e-active');
                removeClass([li2], 'e-active');
                done();
            }, 1000)
        });
        it('getting matches "a" key pressing ', (done) => {
            setTimeout(() => {
                let charCode: number = 65;
                let li: HTMLElement = incrementalSearch(charCode, listObj.getItems(), 6, true) as HTMLElement;
                expect(li.innerText).toBe("Algeria");
                done();
            }, 1000)
        });
        it('"M" key pressing ', () => {
            let charCode: number = 77;
            let li: Element = incrementalSearch(charCode, listObj.getItems(), 3, true);
            expect(isUndefined(li)).toBe(true);
        });
    });
    describe('Search Module', () => {
        let data: string[] = ["Armenia", "america", "India", "Indonesia", "Srilanka", "Canada", "Bangaladesh", "Germany", "Russia", "china"]
        let li: HTMLLIElement[] = [];
        beforeAll(() => {
            for (let a of data) {
                let ele: HTMLLIElement = document.createElement("li");
                ele.innerText = a;
                li.push(ele);
            }
        });
        it('ignoreCase - undefined', () => {
            let test: Element = Search('a', li, 'StartsWith').item as Element;
            expect(test.innerHTML).toBe('Armenia');
        });
        it('ignoreCase - defined- true ', () => {
            let test: Element = Search('a', li, 'StartsWith', true).item as Element;
            expect(test.innerHTML).toBe('Armenia');
        });
        it('ignoreCase - defined- false ', () => {
            let test: Element = Search('a', li, 'StartsWith', false).item as Element;
            expect(test.innerHTML).toBe('america');
        });
        it('inputValue - length <= 0 ==> null ', () => {
            let test: Element = Search('', li, 'StartsWith', true).item as Element;
            expect(test).toBe(null);
        });
        it('inputValue - mismatch', () => {
            let test: Element = Search('z', li, 'StartsWith', true).item as Element;
            expect(test).toBe(null);
        });
        it('Search same starting value ', () => {
            let test: Element = Search('ind', li, 'StartsWith', true).item as Element;
            expect(test.innerHTML).toBe('India');
            test = Search('indo', li, 'StartsWith', true).item as Element;
            expect(test.innerHTML).toBe('Indonesia');
        });
    });
});