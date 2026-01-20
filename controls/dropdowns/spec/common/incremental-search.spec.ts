/**
 * listbase spec document
 */
import { createElement, addClass, removeClass, isUndefined } from '@syncfusion/ej2-base';
import { DropDownBase } from '../../src/drop-down-base/drop-down-base';
import { incrementalSearch, Search } from '../../src/common/incremental-search';
import '../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from './common.spec';


describe('Incremental search', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

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
            li1 = incrementalSearch(charCode, listObj.getItems(), 3, true, element.id) as HTMLElement;
            expect(li1.innerText).toBe("Armenia");
            addClass([li1], 'e-active');
        });
        it('again "a" key pressing ', (done) => {
            setTimeout(() => {
                let charCode: number = 65;
                li2 = incrementalSearch(charCode, listObj.getItems(), 6, true, element.id) as HTMLElement;
                expect(li2.innerText).toBe("Algeria");
                addClass([li2], 'e-active');
                removeClass([li1], 'e-active');
                done();
            }, 2000)
        });
        it('getting matches "a" key pressing ', (done) => {
            setTimeout(() => {
                let charCode: number = 65;
                let li: HTMLElement = incrementalSearch(charCode, listObj.getItems(), 6, true, element.id, true, 'Algeria') as HTMLElement;
                expect(li.innerText).toBe("Algeria");
                done();
            }, 1000)
        });
        it('I key with camelcase false', (done) => {
            setTimeout(() => {
                let charCode: number = 73;
                li3 = incrementalSearch(charCode, listObj.getItems(), 6, false, element.id) as HTMLElement;
                expect(li3.innerText).toBe("India");
                addClass([li3], 'e-active');
                removeClass([li2], 'e-active');
                done();
            }, 1000)
        });
        it('"M" key pressing ', () => {
            let charCode: number = 77;
            let li: Element = incrementalSearch(charCode, listObj.getItems(), 3, true, element.id);
            expect(isUndefined(li)).toBe(true);
        });
        it('again again "a" key pressing ', (done) => {
            setTimeout(() => {
                let charCode: number = 65;
                let charCode1: number = 108;
                li2 = incrementalSearch(charCode, listObj.getItems(), 6, true, element.id, true) as HTMLElement;
                li2 = incrementalSearch(charCode1, listObj.getItems(), 6, true, element.id, true, 'Algeria', true, true) as HTMLElement;
                expect(li2.innerText).toBe("Algeria");
                addClass([li2], 'e-active');
                removeClass([li1], 'e-active');
                done();
            }, 2000)
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
    it('memory leak', () => {     
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
    describe('Autofill with special characters at start', () => {
        const data: string[] = ['(Apple', '{Beta', '[Gamma', '@Delta', '#Echo', '$Foxtrot', '(apricot'];
        let li: HTMLLIElement[] = [];

        beforeAll(() => {
            li = [];
            for (const txt of data) {
                const ele: HTMLLIElement = document.createElement('li');
                ele.innerText = txt;
                li.push(ele);
            }
        });

        // Bracket special characters - should work with StartsWith (autofill scenario)
        it('StartsWith - "(" should match "(Apple"', () => {
            const result = Search('(', li, 'StartsWith', true).item as Element;
            expect(result && result.innerHTML).toBe('(Apple');
        });

        it('StartsWith - "{", should match "{Beta"', () => {
            const result = Search('{', li, 'StartsWith', true).item as Element;
            expect(result && result.innerHTML).toBe('{Beta');
        });

        it('StartsWith - "[" should match "[Gamma"', () => {
            const result = Search('[', li, 'StartsWith', true).item as Element;
            expect(result && result.innerHTML).toBe('[Gamma');
        });

        it('StartsWith - "(a" (ignoreCase) should match "(Apple"', () => {
            const result = Search('(a', li, 'StartsWith', true).item as Element;
            expect(result && result.innerHTML).toBe('(Apple');
        });

        it('StartsWith - "(ap" (ignoreCase) should match "(Apple" first before "(apricot"', () => {
            const result = Search('(ap', li, 'StartsWith', true).item as Element;
            expect(result && result.innerHTML).toBe('(Apple');
        });

        it('StartsWith - "@" should match "@Delta"', () => {
            const result = Search('@', li, 'StartsWith', true).item as Element;
            expect(result && result.innerHTML).toBe('@Delta');
        });

        it('StartsWith - "#" should match "#Echo"', () => {
            const result = Search('#', li, 'StartsWith', true).item as Element;
            expect(result && result.innerHTML).toBe('#Echo');
        });

        it('StartsWith - "$" should match "$Foxtrot"', () => {
            const result = Search('$', li, 'StartsWith', true).item as Element;
            expect(result && result.innerHTML).toBe('$Foxtrot');
        });

        // Negative case - no match
        it('StartsWith - "(z" should return null', () => {
            const result = Search('(z', li, 'StartsWith', true).item as Element;
            expect(result).toBe(null);
        });
    });

});
