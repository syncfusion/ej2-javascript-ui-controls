/**
 * ComboBox spec document
 */
import { ComboBox, CustomValueSpecifierEventArgs } from '../../src/combo-box/combo-box';
import { ChangeEventArgs } from '../../src/drop-down-list/drop-down-list';
import { DataManager, Query, ODataV4Adaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import  {profile , inMB, getMemoryProfile} from '../common/common.spec';
import { EmitType, Browser, createElement, isNullOrUndefined, setCulture, L10n } from '@syncfusion/ej2-base';
import { DropDownBase, FilteringEventArgs, dropDownBaseClasses, PopupEventArgs, SelectEventArgs } from '../../src/drop-down-base/drop-down-base';
import { VirtualScroll } from '../../src/common/virtual-scroll';
import { MultiSelect } from '../../src/multi-select/multi-select';
import { CheckBoxSelection } from '../../src/multi-select/checkbox-selection';
import { MultiSelectHelper } from '../../helpers/e2e';

MultiSelect.Inject(VirtualScroll);
MultiSelect.Inject(CheckBoxSelection);

let datasource: { [key: string]: Object }[]=[];
for (let i = 1; i <= 150; i++) {
    let item: { [key: string]: Object } = {};
    item.id = 'id' + i;
    item.text = `Item ${i}`;

    // Generate a random number between 1 and 4 to determine the group
    const randomGroup = Math.floor(Math.random() * 4) + 1;
    switch (randomGroup) {
        case 1:
            item.group = 'Group A';
            break;
        case 2:
            item.group = 'Group B';
            break;
        case 3:
            item.group = 'Group C';
            break;
        case 4:
            item.group = 'Group D';
            break;
        default:
            break;
    }
    datasource.push(item);
}


describe('MultiSelect_Virtualization', () => {
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
        let multiObj: any;
        let ele: HTMLElement;
        let originalTimeout: number;
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
            ele = createElement('input', { id: 'Multiselect' });
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                dataSource: datasource, popupHeight:'200px', enableVirtualization: true, fields: { text: 'text', value: 'id' }
            });
            multiObj.appendTo(ele);
        });
        afterAll(() => {
            ele.remove();
            multiObj.destroy();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            document.body.innerHTML = '';
        });
        /**
         * DownKey
         */
        it('virtualization Down key pressed ', (done) => {
            multiObj.showPopup();
            expect(multiObj.isPopupOpen()).toBe(true);
            expect(multiObj.list.querySelectorAll('li:not(.e-virtual-list)').length).toBe(10);
            expect(multiObj.list.querySelectorAll('.e-virtual-list').length).toBe(7);
            expect(multiObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 1');
            let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
            expect(li[0].classList.contains('e-item-focus')).toBe(true);
            keyEventArgs.keyCode = 40;
            multiObj.onKeyDown(keyEventArgs);
            expect(li[1].classList.contains('e-item-focus')).toBe(true);
            keyEventArgs.keyCode = 40;
            multiObj.onKeyDown(keyEventArgs);
            expect(li[1].classList.contains('e-item-focus')).toBe(false);
            expect(li[2].classList.contains('e-item-focus')).toBe(true);
            setTimeout(function () {
                for (let i: number = 0; i < 30; i++) {
                    keyEventArgs.keyCode = 40;
                    multiObj.onKeyDown(keyEventArgs);
                }
                setTimeout(function () {
                    expect(multiObj.list.querySelectorAll('li:not(.e-virtual-list)').length).toBe(10);
                    expect(multiObj.list.querySelectorAll('.e-virtual-list').length).toBe(7);
                    done();
                    }, 850)
            }, 100)
        });

        /**
         * UpKey
         */
        it('virtualization Up key pressed ', () => {
            let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
            //multiObj.setSelection(li[3]);
            expect(li[5].classList.contains('e-item-focus')).toBe(true);
            keyEventArgs.keyCode = 38;
            multiObj.onKeyDown(keyEventArgs);
            expect(li[4].classList.contains('e-item-focus')).toBe(true);
            multiObj.onKeyDown(keyEventArgs);
            expect(li[3].classList.contains('e-item-focus')).toBe(true);
            multiObj.onKeyDown(keyEventArgs);
            expect(li[2].classList.contains('e-item-focus')).toBe(true);
            multiObj.onKeyDown(keyEventArgs);
            expect(li[1].classList.contains('e-item-focus')).toBe(true);
            multiObj.dataBind();
            multiObj.onKeyDown(keyEventArgs);
            expect(li[0].classList.contains('e-item-focus')).toBe(true);
        });
        /**
         * HomeKey
         */
        it('virtualization Home and End key pressed ', () => {
            multiObj.showPopup();
            let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
            keyEventArgs.keyCode = 40;
            multiObj.onKeyDown(keyEventArgs);
            expect(li[1].classList.contains('e-item-focus')).toBe(true);
            keyEventArgs.keyCode = 40;
            multiObj.onKeyDown(keyEventArgs);
            expect(li[1].classList.contains('e-item-focus')).toBe(false);
            expect(li[2].classList.contains('e-item-focus')).toBe(true);
            keyEventArgs.keyCode = 36;
            multiObj.onKeyDown(keyEventArgs);
            expect((multiObj.list.querySelectorAll('li:not(.e-virtual-list)')[0] as Element).classList.contains('e-item-focus')).toBe(true);
            keyEventArgs.keyCode = 35;
            multiObj.onKeyDown(keyEventArgs);
            expect((multiObj.list.querySelectorAll('li:not(.e-virtual-list)')[li.length - 1] as Element).classList.contains('e-item-focus')).toBe(true);
            keyEventArgs.keyCode = 36;
            multiObj.onKeyDown(keyEventArgs); 
            expect((multiObj.list.querySelectorAll('li:not(.e-virtual-list)')[0] as Element).classList.contains('e-item-focus')).toBe(true);
        });
        /**
         * Page_up key
         */
        it('virtualization Page_down and Page_up key pressed ', (done) => {
            multiObj.showPopup();
            setTimeout(() => {
                let ele: Element = multiObj.popupObj.element;
                let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                keyEventArgs.keyCode = 34;
                multiObj.onKeyDown(keyEventArgs);
                expect((li[9] as Element).classList.contains('e-item-focus')).toBe(true);
                keyEventArgs.keyCode = 34;
                multiObj.onKeyDown(keyEventArgs);
                expect((li[9] as Element).classList.contains('e-item-focus')).toBe(true);
                keyEventArgs.keyCode = 34;
                multiObj.onKeyDown(keyEventArgs);
                expect((li[9] as Element).classList.contains('e-item-focus')).toBe(true);
                keyEventArgs.keyCode = 33;
                multiObj.onKeyDown(keyEventArgs);
                expect((li[3] as Element).classList.contains('e-item-focus')).toBe(true);
                keyEventArgs.keyCode = 33;
                multiObj.onKeyDown(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                done();
            }, 450);
        });
        
        describe('virtualization IncrementalSearch', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let multiObj: any;
            let ele: HTMLElement;
            let originalTimeout: number;
            beforeAll(() => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
                ele = createElement('input', { id: 'Multiselect' });
                document.body.appendChild(ele);
                multiObj = new MultiSelect({
                    dataSource: datasource, popupHeight:'200px', enableVirtualization: true, fields: { text: 'text', value: 'id' }
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                document.body.innerHTML = '';
            });
            it('with key action.', () => {
                multiObj.showPopup();
                (<any>multiObj).inputElement.value = "Item 30";
                //open action validation
                keyEventArgs.keyCode = 113;
                (<any>multiObj).keyDownStatus = true;
                (<any>multiObj).onInput();
                (<any>multiObj).keyUp(keyEventArgs);
                keyEventArgs.altKey = false;
                keyEventArgs.keyCode = 70;
                (<any>multiObj).keyDownStatus = true;
                (<any>multiObj).onInput();
                (<any>multiObj).keyUp(keyEventArgs);
                //expect((<any>multiObj).liCollections.length).toBe(17);
                //expect((<any>multiObj).liCollections[10].innerText).toBe("Item 30");
                mouseEventArgs.target = (<any>multiObj).liCollections[11];
                mouseEventArgs.type = 'click';
                (<any>multiObj).onMouseClick(mouseEventArgs);
                expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                multiObj.destroy();
            });
        });
        describe('virtualization mouse actions', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let multiObj: any;
            let ele: HTMLElement;
            let originalTimeout: number;
            beforeAll(() => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
                ele = createElement('input', { id: 'Multiselect' });
                document.body.appendChild(ele);
                multiObj = new MultiSelect({
                    dataSource: datasource, popupHeight:'200px', value: [], enableVirtualization: true, fields: { text: 'text', value: 'id' }
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                document.body.innerHTML = '';
            });
            it('virtualization down actions scroll by manually', (done) => {
                multiObj.showPopup();
                multiObj.isPreventScrollAction = false
                multiObj.list.scrollTop = 1068;
                setTimeout(() => {
                    let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                    ///expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                    keyEventArgs.keyCode = 40;
                    multiObj.onKeyDown(keyEventArgs);
                    ////expect((li[1] as Element).classList.contains('e-item-focus')).toBe(true);
                    done();
                }, 850);
            });
            it('virtualization up actions scroll by manually', (done) => {
                multiObj.showPopup();
                multiObj.isPreventScrollAction = false;
                multiObj.list.scrollTop = 4068;
                setTimeout(() => {
                    multiObj.isPreventScrollAction = false
                    multiObj.list.scrollTop = 1500;
                    setTimeout(() => {
                        (<any>multiObj).focusAtFirstListItem();
                        let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                        expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                        //expect(multiObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Item 40');
                        keyEventArgs.keyCode = 40;
                        multiObj.onKeyDown(keyEventArgs);
                        expect((li[1] as Element).classList.contains('e-item-focus')).toBe(true);
                        done();
                    }, 850);
                }, 850);
            });
            it('virtualization down actions scroll by manually', (done) => {
                multiObj.value = ['id1', 'id2', 'id3', 'id41', 'id15', 'id50', 'id71', 'id80', 'id10'];
                multiObj.hideSelectedItem = false;
                multiObj.showPopup();
                multiObj.isPreventScrollAction = false
                multiObj.list.scrollTop = 1068;
                setTimeout(() => {
                    let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                    ///expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                    keyEventArgs.keyCode = 40;
                    multiObj.onKeyDown(keyEventArgs);
                    ////expect((li[1] as Element).classList.contains('e-item-focus')).toBe(true);
                    done();
                }, 850);
            });
        });
        describe('virtualization filtering actions', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let multiObj: any;
            let ele: HTMLElement;
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            beforeAll(() => {
                ele = createElement('input', { id: 'Multiselect' });
                document.body.appendChild(ele);
                multiObj = new MultiSelect({
                    dataSource: datasource, value: ["id4","id7"], popupHeight:'200px', enableVirtualization: true, allowFiltering:true, fields: { text: 'text', value: 'id', groupBy: 'group' }
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                document.body.innerHTML = '';
            });
            it('filter a suggestion list', () => {
                multiObj.showPopup();
                //expect(multiObj.list.querySelectorAll('li:not(.e-virtual-list)').length).toBe(10);
                expect(multiObj.list.querySelectorAll('.e-virtual-list').length).toBe(7);
                expect(multiObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Group A');
                (<any>multiObj).inputElement.value  = "Item 2";
                //open action validation
                keyEventArgs.keyCode = 113;
                (<any>multiObj).keyDownStatus = true;
                (<any>multiObj).onInput();
                (<any>multiObj).keyUp(keyEventArgs);
                let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                expect(li[1].classList.contains('e-item-focus')).toBe(true);
                keyEventArgs.keyCode = 40;
                multiObj.onKeyDown(keyEventArgs);
                expect(li[2].classList.contains('e-item-focus')).toBe(true);
                //expect(multiObj.list.querySelectorAll('li:not(.e-virtual-list)')[0].textContent.trim()).toBe('Group A');
                keyEventArgs.keyCode = 40;
                multiObj.onKeyDown(keyEventArgs);
                //expect(li[3].classList.contains('e-item-focus')).toBe(true);
                multiObj.inputElement.value = '';
            });
            it('With grouping', () => {
                (<any>multiObj).renderPopup();
                multiObj.showPopup();
                expect((<any>multiObj).isPopupOpen()).toBe(true);
                mouseEventArgs.target = (multiObj as any).popupWrapper.querySelectorAll('.e-selectall-parent')[0];
                mouseEventArgs.type = 'click'; 
                //(<any>multiObj).selectAllItem(true, mouseEventArgs);
                //expect((multiObj as any).list.querySelectorAll('.e-list-item.e-active').length == (multiObj as any).maximumSelectionLength).toBe(true);
                //expect((multiObj as any).value.length == (multiObj as any).maximumSelectionLength).toBe(true);
                multiObj.hidePopup();
                multiObj.destroy();
            });
        });
        describe('Virtualization Template support', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let multiObj: any;
            let ele: HTMLElement;
            beforeAll(() => {
                ele = createElement('input', { id: 'Multiselect' });
                document.body.appendChild(ele);
                multiObj = new MultiSelect({
                    dataSource: datasource, popupHeight:'200px', enableVirtualization: true,allowFiltering:true, fields: { text: 'text', value: 'id' }, itemTemplate: '<div class="ename"> ${text} </div></div>', valueTemplate: '<div class="tempName"> ${text} </div>',
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                document.body.innerHTML = '';
            });
            it('item template and value template', (done) => {
                multiObj.showPopup();
                multiObj.isPreventScrollAction = false
                multiObj.list.scrollTop = 1068;
                setTimeout(() => {
                    let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                    expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                    keyEventArgs.keyCode = 40;
                    multiObj.onKeyDown(keyEventArgs);
                    expect((li[1] as Element).classList.contains('e-item-focus')).toBe(true);
                    done();
                }, 850);
            });
        });
        describe('Virtualization with clear value', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let multiObj: any;
            let ele: HTMLElement;
            beforeAll(() => {
                ele = createElement('input', { id: 'multiselect' });
                document.body.appendChild(ele);
                multiObj = new MultiSelect({
                    dataSource: datasource, popupHeight:'200px', enableVirtualization: true,allowFiltering:true, showClearButton:true, fields: { text: 'text', value: 'id' }
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                document.body.innerHTML = '';
            });
        });
        describe('Virtualization with no data', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let multiObj: any;
            let ele: HTMLElement;
            beforeAll(() => {
                ele = createElement('input', { id: 'multiselect' });
                document.body.appendChild(ele); 
                multiObj = new MultiSelect({
                    dataSource: datasource, popupHeight:'200px',query: new Query(), value: ["id2", "id5", "id4", "id3", "id6", "id1", "id31", "id61", "id81", "id15","id18"], enableVirtualization: true,allowFiltering: true, showClearButton:true, fields: { text: 'text', value: 'id' }
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                document.body.innerHTML = '';
            });
            it('opening popup', (done) => {
                multiObj.viewPortInfo.startIndex = 2;
                multiObj.viewPortInfo.endIndex = 12;
                multiObj.showPopup();
                multiObj.isPreventScrollAction = false;
                multiObj.list.scrollTop = 5068;
                setTimeout(() => {
                    multiObj.isPreventScrollAction = false
                    multiObj.list.scrollTop = 6068;
                    setTimeout(() => {
                        let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                        expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                        keyEventArgs.keyCode = 40;
                        multiObj.onKeyDown(keyEventArgs);
                        expect((li[1] as Element).classList.contains('e-item-focus')).toBe(true);
                        done();
                    }, 1050);
                }, 1050);
            });
            it('opening popup without binding', (done) => {
                multiObj.value = [];
                multiObj.viewPortInfo.startIndex = 2;
                multiObj.viewPortInfo.endIndex = 12;
                multiObj.showPopup();
                multiObj.isPreventScrollAction = false;
                multiObj.list.scrollTop = 5068;
                setTimeout(() => {
                    multiObj.isPreventScrollAction = false
                    multiObj.list.scrollTop = 6068;
                    setTimeout(() => {
                        let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                        //expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                        keyEventArgs.keyCode = 40;
                        multiObj.onKeyDown(keyEventArgs);
                        //expect((li[1] as Element).classList.contains('e-item-focus')).toBe(true);
                        done();
                    }, 1050);
                }, 1050);
            });
        });
        describe('Virtualization with Custom Value', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            let multiObj: any;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
            beforeAll(() => {
                document.body.appendChild(ele);
                multiObj = new MultiSelect({
                    dataSource: datasource, popupHeight:'200px', query: new Query(), hideSelectedItem: true, enableVirtualization: true, allowCustomValue: true, showClearButton:true, fields: { text: 'text', value: 'id' }
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                document.body.innerHTML = '';
            });
            it('allowCustomValue.', () => {
                multiObj.showPopup();
                (<any>multiObj).inputElement.value = "custom";
                //open action validation
                keyEventArgs.keyCode = 113;
                (<any>multiObj).keyDownStatus = true;
                (<any>multiObj).onInput();
                (<any>multiObj).keyUp(keyEventArgs);
                keyEventArgs.altKey = false;
                keyEventArgs.keyCode = 70;
                (<any>multiObj).keyDownStatus = true;
                (<any>multiObj).onInput();
                (<any>multiObj).keyUp(keyEventArgs);
                //expect((<any>multiObj).liCollections.length).toBe(17);
                //expect((<any>multiObj).value.length).toBe(1);
                mouseEventArgs.target = (<any>multiObj).liCollections[0];
                mouseEventArgs.type = 'click';
                (<any>multiObj).onMouseClick(mouseEventArgs);
                expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                multiObj.destroy();
            });
            it('allowCustomValue with filtering.', () => {
                multiObj = new MultiSelect({
                    dataSource: datasource, popupHeight:'200px', hideSelectedItem: false, enableVirtualization: true,allowFiltering: true, allowCustomValue: true, showClearButton:true, fields: { text: 'text', value: 'id' }
                });
                multiObj.appendTo(ele);
                multiObj.showPopup();
                (<any>multiObj).inputElement.value = "customvalue";
                //open action validation
                keyEventArgs.keyCode = 113;
                (<any>multiObj).keyDownStatus = true;
                (<any>multiObj).onInput();
                (<any>multiObj).keyUp(keyEventArgs);
                keyEventArgs.altKey = false;
                keyEventArgs.keyCode = 70;
                (<any>multiObj).keyDownStatus = true;
                (<any>multiObj).onInput();
                (<any>multiObj).keyUp(keyEventArgs);
                expect((<any>multiObj).liCollections.length).toBe(1);
                mouseEventArgs.target = (<any>multiObj).liCollections[0];
                mouseEventArgs.type = 'click';
                (<any>multiObj).onMouseClick(mouseEventArgs);
                expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                multiObj.destroy();
            });
        });
        describe('hideselecteditem false with Custom Value', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            let multiObj: any;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
            beforeAll(() => {
                document.body.appendChild(ele);
                multiObj = new MultiSelect({
                    dataSource: datasource, popupHeight:'200px', value: ["abc"], hideSelectedItem: false, enableVirtualization: true, allowCustomValue: true, showClearButton:true, fields: { text: 'text', value: 'id' }
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                document.body.innerHTML = '';
            });
            it('allowCustomValue.', (done) => {
                multiObj.clearAll();
                multiObj.showPopup();
                multiObj.isPreventScrollAction = false;
                multiObj.list.scrollTop = 5068;
                setTimeout(() => {
                    multiObj.isPreventScrollAction = false
                    multiObj.list.scrollTop = 6068;
                    setTimeout(() => {
                        let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                        expect((li[0] as Element).classList.contains('e-item-focus')).toBe(true);
                        for (let i: number = 0; i < 30; i++) {
                            keyEventArgs.keyCode = 34;
                            multiObj.onKeyDown(keyEventArgs);
                        }
                        done();
                    }, 1050);
                }, 1050);
            });
        });

        describe('Virtualization checkbox', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            let multiObj: any;
            let checker: boolean = false
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
            beforeAll(() => {
                document.body.appendChild(ele);
                multiObj = new MultiSelect({
                    dataSource: datasource,
                    enableVirtualization: true, mode: 'CheckBox',
                    showSelectAll: true, 
                    value: ["id5", "id4", "id3", "id6", "id1", "id31", "id61", "id81", "id15", "id131", "id33", "id77"],
                    popupHeight: '200px',
                    fields: { value: 'id', text: 'text' }, allowFiltering: true,
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                document.body.innerHTML = '';
            });
            it('value selection with reorder', (done) => {
                multiObj.showPopup();
                mouseEventArgs.target = (<any>multiObj).liCollections[10];
                mouseEventArgs.type = 'click';
                (<any>multiObj).onMouseClick(mouseEventArgs);
                expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                multiObj.isPreventScrollAction = false;
                multiObj.list.scrollTop = 4068;
                setTimeout(() => {
                    multiObj.isPreventScrollAction = false;
                    multiObj.list.scrollTop = 5050;
                    setTimeout(() => {
                        (<any>multiObj).focusAtFirstListItem();
                        let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                        (<any>multiObj).focusAtLastListItem();
                        mouseEventArgs.target = (<any>multiObj).liCollections[9];
                        mouseEventArgs.type = 'click';
                        //(<any>multiObj).onMouseClick(mouseEventArgs);
                        expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                        multiObj.isPreventScrollAction = false;
                        multiObj.list.scrollTop = 100;
                        setTimeout(() => {
                            let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                            mouseEventArgs.target = (<any>multiObj).liCollections[9];
                            mouseEventArgs.type = 'click';
                            //(<any>multiObj).onMouseClick(mouseEventArgs);
                            expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                            done();
                        }, 850);
                    }, 850);
                }, 850);
            });
        });
        describe('Virtualization checkbox', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            let multiObj: any;
            let checker: boolean = false
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
            beforeAll(() => {
                document.body.appendChild(ele);
                multiObj = new MultiSelect({
                    dataSource: datasource,
                    enableVirtualization: true, mode: 'CheckBox',
                    showSelectAll: true, 
                    value: ["id5", "id4", "id3", "id6", "id1", "id31", "id61"],
                    popupHeight: '200px',
                    fields: { value: 'id', text: 'text' }, allowFiltering: true,
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                document.body.innerHTML = '';
            });
            it('value selection with low data', (done) => {
                multiObj.showPopup();
                mouseEventArgs.target = (<any>multiObj).liCollections[10];
                mouseEventArgs.type = 'click';
                (<any>multiObj).onMouseClick(mouseEventArgs);
                expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                multiObj.isPreventScrollAction = false;
                multiObj.list.scrollTop = 4068;
                setTimeout(() => {
                    multiObj.isPreventScrollAction = false;
                    multiObj.list.scrollTop = 5050;
                    setTimeout(() => {
                        (<any>multiObj).focusAtFirstListItem();
                        let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                        (<any>multiObj).focusAtLastListItem();
                        mouseEventArgs.target = (<any>multiObj).liCollections[9];
                        mouseEventArgs.type = 'click';
                        (<any>multiObj).onMouseClick(mouseEventArgs);
                        expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                        multiObj.isPreventScrollAction = false;
                        multiObj.list.scrollTop = 100;
                        setTimeout(() => {
                            let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                            mouseEventArgs.target = (<any>multiObj).liCollections[9];
                            mouseEventArgs.type = 'click';
                            //(<any>multiObj).onMouseClick(mouseEventArgs);
                            expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                            done();
                        }, 850);
                    }, 850);
                }, 850);
            });
        });
        describe('Virtualization checkbox selection', () => { 
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            let multiObj: any;
            let checker: boolean = false
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
            beforeAll(() => {
                document.body.appendChild(ele);
                multiObj = new MultiSelect({
                    dataSource: datasource,
                    enableVirtualization: true, mode: 'CheckBox',
                    showSelectAll: true, 
                    value: ["id5", "id4", "id3", "id6", "id1", "id31", "id61", "id81", "id15", "id131", "id33", "id77", "id44", "id43", "id47", "id16", "id17", "id49", "id78", "id79", "id91", "id97"],
                    popupHeight: '200px', 
                    fields: { value: 'id', text: 'text' }, allowFiltering: true,
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                document.body.innerHTML = ''; 
            });
            it('value selection with manual scroll', (done) => { 
                multiObj.viewPortInfo.startIndex = 2;
                multiObj.viewPortInfo.endIndex = 12;
                multiObj.showPopup();
                mouseEventArgs.target = (<any>multiObj).liCollections[10];
                mouseEventArgs.type = 'click';
                (<any>multiObj).onMouseClick(mouseEventArgs);
                expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                multiObj.isPreventScrollAction = false;
                multiObj.list.scrollTo(0, 100);
                setTimeout(() => {
                    multiObj.isPreventScrollAction = false;
                    multiObj.list.scrollTo(100, 400);
                    setTimeout(() => {
                        (<any>multiObj).focusAtFirstListItem();
                        let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                        (<any>multiObj).focusAtLastListItem();
                        mouseEventArgs.target = (<any>multiObj).liCollections[9];
                        mouseEventArgs.type = 'click';
                        //(<any>multiObj).onMouseClick(mouseEventArgs);
                        expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                        multiObj.isPreventScrollAction = false;
                        multiObj.list.scrollTo(0, 500); 
                        setTimeout(() => {
                            let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                            mouseEventArgs.target = (<any>multiObj).liCollections[9];
                            mouseEventArgs.type = 'click';
                            //(<any>multiObj).onMouseClick(mouseEventArgs);
                            expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                            done();
                        }, 850);
                    }, 850);
                }, 850);
            });
        }); 
        describe('Virtualization checkbox with', () => { 
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            let multiObj: any;
            let checker: boolean = false
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
            beforeAll(() => {
                document.body.appendChild(ele);
                multiObj = new MultiSelect({
                    dataSource: datasource,
                    enableVirtualization: true, mode: 'CheckBox',
                    enableSelectionOrder: false,
                    showSelectAll: true, 
                    value: ["id5", "id4", "id3", "id6", "id1", "id31", "id61", "id81", "id15", "id131", "id33", "id77", "id44", "id43", "id47", "id16", "id17", "id49", "id78", "id79", "id91", "id97"],
                    popupHeight: '200px', 
                    fields: { value: 'id', text: 'text' }, allowFiltering: true,
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                document.body.innerHTML = ''; 
            });
            it('value selection without reorder', (done) => {
                multiObj.showPopup();
                mouseEventArgs.target = (<any>multiObj).liCollections[10];
                mouseEventArgs.type = 'click';
                (<any>multiObj).onMouseClick(mouseEventArgs);
                expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                multiObj.isPreventScrollAction = false;
                multiObj.list.scrollTop = 4068;
                setTimeout(() => {
                    multiObj.isPreventScrollAction = false;
                    multiObj.list.scrollTop = 5050;
                    setTimeout(() => {
                        (<any>multiObj).focusAtFirstListItem();
                        let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                        (<any>multiObj).focusAtLastListItem();
                        mouseEventArgs.target = (<any>multiObj).liCollections[9];
                        mouseEventArgs.type = 'click';
                        (<any>multiObj).onMouseClick(mouseEventArgs);
                        expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                        multiObj.isPreventScrollAction = false;
                        multiObj.list.scrollTop = 2000;
                        setTimeout(() => {
                            let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                            mouseEventArgs.target = (<any>multiObj).liCollections[9];
                            mouseEventArgs.type = 'click';
                            (<any>multiObj).onMouseClick(mouseEventArgs);
                            expect((<any>multiObj).value && (<any>multiObj).value.length).not.toBeNull();
                            done();
                        }, 850);
                    }, 850);
                }, 850);
            });
        }); 
        describe('Virtualization with value selection', () => {
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            let mouseEventArgs: any = { preventDefault: function () { }, target: null };
            let multiObj: any;
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
            beforeAll(() => {
                document.body.appendChild(ele);
                multiObj = new MultiSelect({
                    dataSource: datasource, popupHeight:'200px', hideSelectedItem: false, enableVirtualization: true,allowCustomValue: true, showClearButton:true, fields: { text: 'text', value: 'id' }
                });
                multiObj.appendTo(ele);
            });
            afterAll(() => {
                ele.remove();
                multiObj.destroy();
                document.body.innerHTML = '';
            });
            it('Selecting value using enter key', (done) => {
                multiObj.showPopup();
              // (<any>multiObj).focusAtFirstListItem();
              // keyEventArgs.keyCode = 13;
               //(<any>multiObj).onKeyDown(keyEventArgs);
               //multiObj.showPopup();
                multiObj.isPreventScrollAction = false
                multiObj.list.scrollTop =  5068;
                setTimeout(() => {
                    multiObj.isPreventScrollAction = false
                    multiObj.list.scrollTop = 6068;
                    setTimeout(() => {
                        let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                        (<any>multiObj).focusAtFirstListItem();
                        expect(li[0].classList.contains('e-item-focus')).toBe(true);
                        keyEventArgs.keyCode = 40;
                        multiObj.onKeyDown(keyEventArgs);
                        expect(li[1].classList.contains('e-item-focus')).toBe(true);
                        keyEventArgs.keyCode = 40;
                        multiObj.onKeyDown(keyEventArgs);
                        expect(li[1].classList.contains('e-item-focus')).toBe(false);
                        expect(li[2].classList.contains('e-item-focus')).toBe(true);
                        multiObj.isPreventScrollAction = false
                        multiObj.list.scrollTop = 0;
                        setTimeout(() => {
                            let li: Element[] = multiObj.list.querySelectorAll('li:not(.e-virtual-list)');
                            (<any>multiObj).focusAtFirstListItem();
                            expect(li[0].classList.contains('e-item-focus')).toBe(true);
                            keyEventArgs.keyCode = 40;
                            multiObj.onKeyDown(keyEventArgs);
                            expect(li[1].classList.contains('e-item-focus')).toBe(true);
                            done();
                        }, 850);
                    }, 850);
                }, 850);
            });
            it('Removing chip using backspace key', () => {
                multiObj.value= ["id4"];
                multiObj.showPopup();
               (<any>multiObj).focusAtFirstListItem();
               keyEventArgs.keyCode = 8;
               //(<any>multiObj).removelastSelection(keyEventArgs);
                let wrapper: HTMLElement = (<any>multiObj).inputElement.parentElement.parentElement;
                if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                    expect(getComputedStyle((<any>multiObj).searchWrapper).width).toBe('calc(100% - 20px)');
                }
                else
                    expect(true).toBe(false);            
            });
        });
    });

});

function done() {
    throw new Error('Function not implemented.');
}
