/**
 * ComboBox spec document
 */
import { ComboBox } from '../../src/combo-box/combo-box';
import { ChangeEventArgs } from '../../src/drop-down-list/drop-down-list';
import { DataManager, Query, ODataV4Adaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import { profile, inMB, getMemoryProfile } from '../common/common.spec';
import { EmitType, Browser, createElement, isNullOrUndefined, setCulture, L10n } from '@syncfusion/ej2-base';
import { DropDownBase, FilteringEventArgs, dropDownBaseClasses, PopupEventArgs, SelectEventArgs } from '../../src/drop-down-base/drop-down-base';
import { VirtualScroll } from '../../src/common/virtual-scroll';

ComboBox.Inject(VirtualScroll);

let datasource: { [key: string]: Object }[] = [];
for (var i = 1; i <= 150; i++) {
    var item = {
        id: 'id' + i,
        text: "Item " + i,
    };
    datasource.push(item);
}

describe('Combobox_virtualization', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let css: string = ".e-spinner-pane::after { content: 'Material'; display: none;} .e-list-item{height:36px} .e-dropdownbase.e-content{overflow: auto;} ";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);
    // Keyboard Interaction
    describe('virtualization key actions', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let dropObj: any;
        let ele: HTMLElement;
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
            ele = createElement('input', { id: 'Combobox' });
            document.body.appendChild(ele);
            dropObj = new ComboBox({
                dataSource: datasource, popupHeight:'200px', enableVirtualization: true, fields: { text: 'text', value: 'id' }
            });
            dropObj.appendTo(ele);
        });
        afterAll(() => {
            ele.remove();
            dropObj.destroy();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            document.body.innerHTML = '';
        });
        /**
        * Tab Key without open popup
        */
        // it("virtualization Tab Key without open popup ", () => {
        //     dropObj.focusIn();
        //     keyEventArgs.action = 'tab';
        //     dropObj.keyActionHandler(keyEventArgs);
        //     expect(isNullOrUndefined(dropObj.list)).toBe(true);
        // })
        // /**
        //  * Tab Key
        //  */
        // it("virtualization Tab key ", (done) => {
        //     dropObj.showPopup();
        //     setTimeout(() => {
        //         keyEventArgs.action = 'tab';
        //         dropObj.keyActionHandler(keyEventArgs);
        //         setTimeout(() => {
        //             expect(dropObj.isPopupOpen).toBe(false);
        //             done();
        //         }, 300);
        //     }, 450);
        // });
        /**
         * DownKey
         */
        it('virtualization Down key pressed ', (done) => {
            dropObj.showPopup();
            expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)').length).toBe(10);
            expect(dropObj.list.querySelectorAll('.e-virtual-list').length).toBe(7);
            expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 1');
            let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
            keyEventArgs.action = 'down';
            dropObj.keyActionHandler(keyEventArgs);
            expect(li[0].classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'down';
            dropObj.keyActionHandler(keyEventArgs);
            expect(li[0].classList.contains('e-active')).toBe(false);
            expect(li[1].classList.contains('e-active')).toBe(true);
            dropObj.isPopupOpen = true;
            setTimeout(function () {
                for (let i: number = 0; i < 30; i++) {
                    keyEventArgs.action = 'down';
                    dropObj.keyActionHandler(keyEventArgs);
                }
                setTimeout(function () {
                    expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)').length).toBe(10);
                    expect(dropObj.list.querySelectorAll('.e-virtual-list').length).toBe(7);
                    //expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[7].textContent.trim()).toBe('Item 12');
                    done();
                    }, 850)
                done();
            }, 100)
        });

        /**
         * UpKey
         */
        it('virtualization Up key pressed ', () => {
            let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
            dropObj.setSelection(li[3]);
            expect(li[3].classList.contains('e-active')).toBe(true);
            keyEventArgs.action = 'up';
            dropObj.keyActionHandler(keyEventArgs);
            expect(li[2].classList.contains('e-active')).toBe(true);
        });
        /**
         * Page_up key
         */
        it('virtualization Page_down and Page_up key pressed ', (done) => {
            dropObj.showPopup();
            setTimeout(() => {
                let ele: Element = dropObj.popupObj.element;
                let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
                dropObj.setSelection(li[4]);
                expect((li[4] as Element).classList.contains('e-active')).toBe(true);
                keyEventArgs.action = 'pageUp';
                dropObj.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                keyEventArgs.action = 'pageDown';
                dropObj.keyActionHandler(keyEventArgs);
                expect((li[5] as Element).classList.contains('e-active')).toBe(true);
                keyEventArgs.action = 'pageDown';
                dropObj.keyActionHandler(keyEventArgs);
                expect((li[9] as Element).classList.contains('e-active')).toBe(true);
                keyEventArgs.action = 'pageUp';
                dropObj.keyActionHandler(keyEventArgs);
                expect((li[4] as Element).classList.contains('e-active')).toBe(true);
                keyEventArgs.action = 'pageUp';
                dropObj.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                done();
            }, 450);
        });
        describe('virtualization mouse actions', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let dropObj: any;
            let ele: HTMLElement;
            let originalTimeout: number;
            beforeAll(() => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
                ele = createElement('input', { id: 'Combobox' });
                document.body.appendChild(ele);
                dropObj = new ComboBox({
                    dataSource: datasource, popupHeight:'200px', enableVirtualization: true, fields: { text: 'text', value: 'id' }
                });
                dropObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                dropObj.destroy();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                document.body.innerHTML = '';
            });
            it('virtualization down actions scroll by manually', (done) => {
                dropObj.showPopup();
                dropObj.isPreventScrollAction = false
                dropObj.list.scrollTop = 1068;
                setTimeout(() => {
                    let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
                    expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                    keyEventArgs.action = 'down';
                    dropObj.keyActionHandler(keyEventArgs);
                    expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                    done();
                }, 850);
            });
            it('virtualization up actions scroll by manually', (done) => {
                dropObj.showPopup();
                dropObj.isPreventScrollAction = false;
                dropObj.list.scrollTop = 4068;
                setTimeout(() => {
                    dropObj.isPreventScrollAction = false;
                    dropObj.list.scrollTop = 1500;
                    setTimeout(() => {
                        let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
                        //expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                        //expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 40');
                        keyEventArgs.action = 'down';
                        dropObj.keyActionHandler(keyEventArgs);
                        expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                        done();
                    }, 750);
                }, 850);
            });
        });
        describe('virtualization filtering actions', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let dropObj: any;
            let ele: HTMLElement;
            beforeAll(() => {
                ele = createElement('input', { id: 'Combobox' });
                document.body.appendChild(ele);
                dropObj = new ComboBox({
                    dataSource: datasource, popupHeight:'200px', enableVirtualization: true,allowFiltering:true, fields: { text: 'text', value: 'id' }
                });
                dropObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                dropObj.destroy();
                document.body.innerHTML = '';
            });
            it('filter a suggestion list with ascending order', () => {
                dropObj.sortOrder = 'Ascending';
                dropObj.dataBind();
                dropObj.showPopup();
                expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)').length).toBe(10);
                expect(dropObj.list.querySelectorAll('.e-virtual-list').length).toBe(7);
                expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 1');
                dropObj.filterInput.value = "Item 2";
                dropObj.onInput()
                dropObj.onFilterUp(keyEventArgs);
                let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
                keyEventArgs.action = 'down';
                dropObj.keyActionHandler(keyEventArgs);
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 2');
                keyEventArgs.action = 'down';
                dropObj.keyActionHandler(keyEventArgs);
                expect(li[1].classList.contains('e-active')).toBe(true);
                expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[1].textContent.trim()).toBe('Item 20');
                //dropObj.filterInput.value = '';
            });
        });
        describe('Virtualization Template support', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let dropObj: any;
            let ele: HTMLElement;
            beforeAll(() => {
                ele = createElement('input', { id: 'DropDownList' });
                document.body.appendChild(ele);
                dropObj = new ComboBox({
                    dataSource: datasource, popupHeight:'200px', enableVirtualization: true,allowFiltering:true, fields: { text: 'text', value: 'id' }, itemTemplate: '<div class="ename"> ${text} </div></div>', valueTemplate: '<div class="tempName"> ${text} </div>',
                });
                dropObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                dropObj.destroy();
                document.body.innerHTML = '';
            });
            it('item template and value template', (done) => {
                dropObj.showPopup();
                dropObj.isPreventScrollAction = false
                dropObj.list.scrollTop = 1068;
                setTimeout(() => {
                    let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
                    expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                    keyEventArgs.action = 'down';
                    dropObj.keyActionHandler(keyEventArgs);
                    expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                    done();
                }, 850);
            });
        });
        describe('Virtualization with clear value', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let dropObj: any;
            let ele: HTMLElement;
            beforeAll(() => {
                ele = createElement('input', { id: 'DropDownList' });
                document.body.appendChild(ele);
                dropObj = new ComboBox({
                    dataSource: datasource, popupHeight:'200px', enableVirtualization: true,allowFiltering:true, showClearButton:true, fields: { text: 'text', value: 'id' }
                });
                dropObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                dropObj.destroy();
                document.body.innerHTML = '';
            });
            it('clear text value', (done) => {
                dropObj.showPopup();
                dropObj.isPreventScrollAction = false
                dropObj.list.scrollTop = 1068;
                setTimeout(() => {
                    let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
                    expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                    keyEventArgs.action = 'down';
                    dropObj.keyActionHandler(keyEventArgs);
                    expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                    dropObj.clearText();
                    var clearElement = dropObj.filterInput.parentElement.querySelector('.e-clear-icon');
                    expect(clearElement.style.visibility).toBe('hidden');
                    expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)').length).toBe(10);
                    expect(dropObj.list.querySelectorAll('.e-virtual-list').length).toBe(7);
                    //expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 1');
                    done();
                }, 650);
            });
        });
    });

});

function done() {
    throw new Error('Function not implemented.');
}
