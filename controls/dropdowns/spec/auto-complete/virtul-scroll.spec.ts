/**
 * ComboBox spec document
 */
import { ChangeEventArgs } from '../../src/drop-down-list/drop-down-list';
import { DataManager, Query, ODataV4Adaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import  {profile , inMB, getMemoryProfile} from '../common/common.spec';
import { EmitType, Browser, createElement, isNullOrUndefined, setCulture, L10n } from '@syncfusion/ej2-base';
import { DropDownBase, FilteringEventArgs, dropDownBaseClasses, PopupEventArgs, SelectEventArgs } from '../../src/drop-down-base/drop-down-base';
import { VirtualScroll } from '../../src/common/virtual-scroll';
import { AutoComplete } from '../../src/auto-complete/index';

AutoComplete.Inject(VirtualScroll);

let datasource: { [key: string]: Object }[]=[];
for (var i = 1; i <= 150; i++) {
    var item = {
        id: 'id' + i,
        text: "Item " + i,
    };
    datasource.push(item);
}

describe('Autocomplete_Virtualization', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let css: string = ".e-spinner-pane::after { content: 'Material'; display: none;} .e-list-item{height:36px} .e-dropdownbase.e-content{overflow: auto;max-height: 200px;} ";
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
            ele = createElement('input', { id: 'AutoComplete' });
            document.body.appendChild(ele);
            dropObj = new AutoComplete({
                dataSource: datasource, popupHeight:'200px', enableVirtualization: true, fields: { text: 'text', value: 'text' }
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
            expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)').length).toBe(30);
            expect(dropObj.list.querySelectorAll('.e-virtual-list').length).toBe(15);
            expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 1');
            let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
            keyEventArgs.type = 'keydown';
            keyEventArgs.action = 'down';
            dropObj.keyActionHandler(keyEventArgs);
            expect(li[0].classList.contains('e-item-focus')).toBe(true);
            keyEventArgs.type = 'keydown';
            keyEventArgs.action = 'down';
            dropObj.isPopupOpen = true;
            dropObj.keyActionHandler(keyEventArgs);
            expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].classList.contains('e-item-focus')).toBe(false);
            expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[1].classList.contains('e-item-focus')).toBe(true);
            dropObj.isPopupOpen = true;
            setTimeout(function () {
                for (let i: number = 0; i < 30; i++) {
                    keyEventArgs.type = 'keydown';
                    keyEventArgs.action = 'down';
                    dropObj.keyActionHandler(keyEventArgs);
                }
                setTimeout(function () {
                    expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)').length).toBe(30);
                    expect(dropObj.list.querySelectorAll('.e-virtual-list').length).toBe(15);
                    //expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[7].textContent.trim()).toBe('Item 12');
                    done();
                    }, 500)
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
            keyEventArgs.type = 'keydown';
            dropObj.keyActionHandler(keyEventArgs);
            expect(li[2].classList.contains('e-item-focus')).toBe(true);
            dropObj.index = null;
            dropObj.dataBind();
            keyEventArgs.action = 'down';
            keyEventArgs.type = 'keydown';
            dropObj.keyActionHandler(keyEventArgs);
            li = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
            //expect(li[0].classList.contains('e-item-focus')).toBe(true);
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
                keyEventArgs.type = 'keydown';
                keyEventArgs.action = 'pageUp';
                dropObj.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                keyEventArgs.action = 'pageDown';
                dropObj.keyActionHandler(keyEventArgs);
                expect((li[6] as Element).classList.contains('e-item-focus')).toBe(true);
                keyEventArgs.action = 'pageDown';
                dropObj.keyActionHandler(keyEventArgs);
                expect((li[12] as Element).classList.contains('e-item-focus')).toBe(true);
                keyEventArgs.action = 'pageUp';
                dropObj.keyActionHandler(keyEventArgs);
                expect((li[7] as Element).classList.contains('e-item-focus')).toBe(true);
                keyEventArgs.action = 'pageUp';
                dropObj.keyActionHandler(keyEventArgs); 
                expect((li[2] as Element).classList.contains('e-item-focus')).toBe(true);
                done();
            }, 500);
        });
        describe('virtualization mouse actions', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let dropObj: any;
            let ele: HTMLElement;
            let originalTimeout: number;
            beforeAll(() => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
                ele = createElement('input', { id: 'AutoComplete' });
                document.body.appendChild(ele);
                dropObj = new AutoComplete({
                    dataSource: datasource, popupHeight:'200px', query: new Query().take(10), enableVirtualization: true, fields: { text: 'text', value: 'text' }
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
                    expect((li[2] as Element).classList.contains('e-item-focus')).toBe(true);
                    keyEventArgs.action = 'down';
                    dropObj.keyActionHandler(keyEventArgs);
                    expect((li[1] as Element).classList.contains('e-active')).toBe(true);
                    done();
                }, 500);
            });
            it('virtualization up actions scroll by manually', (done) => {

                dropObj.showPopup();
                dropObj.isPreventScrollAction = false
                dropObj.list.scrollTop = 4068;
                setTimeout(() => {
                    let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
                    expect((li[2] as Element).classList.contains('e-item-focus')).toBe(true);
                    //expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 114');
                    keyEventArgs.action = 'down';
                    dropObj.keyActionHandler(keyEventArgs);
                    expect((li[1] as Element).classList.contains('e-active')).toBe(true);
                    dropObj.isPreventScrollAction = false
                    dropObj.list.scrollTop = 1500;
                    setTimeout(() => {
                        let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
                        expect((li[2] as Element).classList.contains('e-item-focus')).toBe(true);
                        //expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 40');
                        keyEventArgs.action = 'down';
                        dropObj.keyActionHandler(keyEventArgs);
                        expect((li[2] as Element).classList.contains('e-active')).toBe(true);
                        done();
                    }, 500);
                   
                }, 500);
            });
        });
        describe('virtualization filtering actions', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let dropObj: any;
            let ele: HTMLElement;
            beforeAll(() => {
                ele = createElement('input', { id: 'AutoComplete' });
                document.body.appendChild(ele);
                dropObj = new AutoComplete({
                    dataSource: datasource, popupHeight:'200px', enableVirtualization: true,allowFiltering:true, fields: { text: 'text', value: 'text' }
                });
                dropObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                dropObj.destroy();
                document.body.innerHTML = '';
            });
            it('filter a suggestion list with ascending order', (done) => {
                dropObj.sortOrder = 'Ascending';
                dropObj.dataBind();
                dropObj.showPopup();
                setTimeout(() => {
                    expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)').length).toBe(30);
                    expect(dropObj.list.querySelectorAll('.e-virtual-list').length).toBe(15);
                    expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 1');
                    dropObj.filterInput.value = "Item 2";
                    dropObj.onInput()
                    dropObj.onFilterUp(keyEventArgs);
                    let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
                    dropObj.isPopupOpen = true;
                    keyEventArgs.type = 'keydown';
                    keyEventArgs.action = 'down';
                    dropObj.keyActionHandler(keyEventArgs);
                    expect(li[1].classList.contains('e-item-focus')).toBe(true);
                    expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 2');
                    keyEventArgs.action = 'down';
                    dropObj.keyActionHandler(keyEventArgs);
                    expect(li[2].classList.contains('e-item-focus')).toBe(true);
                    expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[1].textContent.trim()).toBe('Item 20');
                    done();
                }, 500)
            });
        });
        describe('virtualization remote filtering actions', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let dropObj: any;
            let ele: HTMLElement;
            beforeAll(() => {
                ele = createElement('input', { id: 'AutoComplete' });
                document.body.appendChild(ele);
                let remoteData: DataManager = new DataManager({
                    url: 'https://services.syncfusion.com/js/production/api/orders',
                    adaptor: new WebApiAdaptor,
                    crossDomain: true
                });
                dropObj = new AutoComplete({
                    dataSource: remoteData, popupHeight:'200px', enableVirtualization: true,allowFiltering:true, fields: { text: 'OrderID', value: 'OrderID' }
                });
                dropObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                dropObj.destroy();
                document.body.innerHTML = '';
            });
            it('filter a not present item', (done) => {
                dropObj.dataBind();
                dropObj.showPopup();
                setTimeout(() => {
                    dropObj.filterInput.value = "a";
                    dropObj.onInput()
                    dropObj.onFilterUp(keyEventArgs);
                    setTimeout(() => {
                        let isNoDataElement: boolean = dropObj.list.classList.contains('e-nodata');
                        expect(isNoDataElement).toBe(false);
                        done();
                    }, 500);
                }, 500)
            });
        });
        describe('virtualization mouse actions with clear value', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let dropObj: any;
            let ele: HTMLElement;
            let originalTimeout: number;
            beforeAll(() => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
                ele = createElement('input', { id: 'AutoComplete' });
                document.body.appendChild(ele);
                dropObj = new AutoComplete({
                    dataSource: datasource, popupHeight:'200px', enableVirtualization: true, showClearButton: true, fields: { text: 'text', value: 'text' }
                });
                dropObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                dropObj.destroy();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
                document.body.innerHTML = '';
            });
            it('down actions scroll by manually with clear value', (done) => {
                dropObj.showPopup();
                dropObj.isPreventScrollAction = false;
                dropObj.list.scrollTop = 4068;
                setTimeout(() => {
                    dropObj.isPreventScrollAction = false;
                    dropObj.list.scrollTop = 1500;
                    setTimeout(() => {
                        let li: Element[] = dropObj.list.querySelectorAll('li:not(.e-virtual-list)');
                        expect((li[2] as Element).classList.contains('e-item-focus')).toBe(true);
                        expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 20');
                        keyEventArgs.action = 'down';
                        dropObj.keyActionHandler(keyEventArgs);
                        expect((li[1] as Element).classList.contains('e-active')).toBe(true);
                        done();
                    }, 500);
                }, 500);
            });
        });
        describe('Virtualization Template support', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let dropObj: any;
            let ele: HTMLElement;
            beforeAll(() => {
                ele = createElement('input', { id: 'DropDownList' });
                document.body.appendChild(ele);
                dropObj = new AutoComplete({
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
                    //expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                    keyEventArgs.action = 'down';
                    dropObj.keyActionHandler(keyEventArgs);
                    //expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                    done();
                }, 500);
            });
        });
        describe('Virtualization with clear value', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let dropObj: any;
            let ele: HTMLElement;
            beforeAll(() => {
                ele = createElement('input', { id: 'DropDownList' });
                document.body.appendChild(ele);
                dropObj = new AutoComplete({
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
                    //expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                    keyEventArgs.action = 'down';
                    dropObj.keyActionHandler(keyEventArgs);
                    //expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                    dropObj.clearAll();
                    var clearElement = dropObj.filterInput.parentElement.querySelector('.e-clear-icon');
                    expect(dropObj.value === null).toBe(true);
                    expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)').length).toBe(30);
                    expect(dropObj.list.querySelectorAll('.e-virtual-list').length).toBe(15);
                    expect(dropObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 1');
                    done();
                }, 500);
            });
        });
    });
    describe('Custom filtering action', () => {
        let dropDowns: any;
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });
        it('', (done) => {
            dropDowns = new AutoComplete({
                dataSource: datasource, 
                popupHeight: '200px', 
                enableVirtualization: true, 
                allowFiltering: true, 
                showClearButton: true,
                
                fields: { text: 'text', value: 'id' },
                filtering(e)
                {
                    let query: Query = new Query();
                    query = (e.text != "") ? query.where("text", "contains", e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            dropDowns.appendTo(element);
               
                dropDowns.showPopup();
                dropDowns.isPopupOpen = true;
                dropDowns.inputElement.value = '1';
                e.keyCode = 49;
                dropDowns.onInput(e);
                dropDowns.onFilterUp(e);
                //setTimeout(function () {
                    var activeElement = dropDowns.list.querySelectorAll('li:not(.e-virtual-list)');
                    expect(activeElement[0].textContent).toBe('Item 1');
                    done();
              //  }, 550);
        });
        it('virtualization false', (done) => {
            dropDowns = new AutoComplete({
                dataSource: datasource, 
                popupHeight: '200px',  
                allowFiltering: true, 
                showClearButton: true,
                
                fields: { text: 'text', value: 'id' },
                filtering(e)
                {
                    let query: Query = new Query();
                    query = (e.text != "") ? query.where("text", "contains", e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            dropDowns.appendTo(element);
               
                dropDowns.showPopup();
                dropDowns.isPopupOpen = true;
                dropDowns.inputElement.value = '1';
                e.keyCode = 49;
                dropDowns.onInput(e);
                dropDowns.onFilterUp(e);
                //setTimeout(function () {
                    var activeElement = dropDowns.list.querySelectorAll('li:not(.e-virtual-list)');
                    expect(activeElement[0].textContent).toBe('Item 1');
                    done();
              //  }, 550);
        });
    });

});

function done() {
    throw new Error('Function not implemented.');
}