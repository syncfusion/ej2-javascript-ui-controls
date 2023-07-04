/**
 * MultiSelect spec document
 */
import { MultiSelect, TaggingEventArgs, MultiSelectChangeEventArgs } from '../../src/multi-select/multi-select';
import { Browser, isNullOrUndefined, EmitType } from '@syncfusion/ej2-base';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { dropDownBaseClasses, FilteringEventArgs, PopupEventArgs, FocusEventArgs } from '../../src/drop-down-base/drop-down-base';
import { DataManager, ODataV4Adaptor, Query, ODataAdaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import { MultiSelectModel, ISelectAllEventArgs } from '../../src/index';
import  {profile , inMB, getMemoryProfile} from '../common/common.spec';

let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
{ id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }];

let dataSource44: string[] = ['java', 'php', 'html', 'oracle', '.net', 'c++'];
let datasource2: { [key: string]: Object }[] = [{ id: 'id2', text: 'PHP' }, { id: 'id1', text: 'HTML' }, { id: 'id3', text: 'PERL' },
{ id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'Python' }, { id: 'list5', text: 'Oracle' }];
let css: string = ".e-searcher { width: calc(100% - 20px) !important;} ";
let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
let styleNode: Node = style.appendChild(document.createTextNode(css));
document.getElementsByTagName('head')[0].appendChild(style);
//e-searcher  
//e-chips-close e-icon e-close-hooker
//e-multi-select-wrapper
//e-chips-collection
//e-delim-values
//e-control e-dropdownbase
//e-chips
//e-chips-close
let multiSelectData: multiSelectStyles = {
    container: "e-multi-select-wrapper",
    selectedListContainer: "e-chips-collection",
    delimViewContainer: "e-delim-view e-delim-values",
    delimContainer: "e-delim-values",
    listContainer: "e-content e-dropdownbase",
    chips: "e-chips",
    chipSelection: "e-chip-selected",
    chipsClose: "e-chips-close",
    individualListClose: "",
    closeiconhide: 'e-close-icon-hide',
    inputContainer: "e-searcher e-zero-size",
    inputElement: "e-dropdownbase",
    inputFocus: "e-focus",
    overAllClose: "e-chips-close e-close-hooker",
    popupListWrapper: "e-ddl e-popup e-multi-select-list-wrapper e-control e-popup-open",
    overAllList: "e-list-parent e-ul",
    listItem: "e-list-item e-active e-item-focus",
    ListItemSelected: "e-active",
    ListItemHighlighted: "e-item-focus",
    containerChildlength: 5,
    defaultChildlength: 5,
    inputARIA: ['aria-expanded', 'role', 'aria-disabled'],
    listARIA: ['aria-hidden', 'role'],
    mobileChip: 'e-mob-chip'
}
// aria-disabled': 'false',
//             'aria-owns': this.element.id + '_options',
//             'role': 'listbox',
//             'aria-haspopup': 'true',
//             'aria-expanded': 'false',
//             'aria-activedescendant': 'null'
interface multiSelectStyles {
    container: string;
    mobileChip: string,
    selectedListContainer: string;
    delimContainer: string;
    chips: string,
    chipSelection: string;
    chipsClose: string,
    individualListClose: string;
    inputContainer: string;
    inputElement: string;
    delimViewContainer: string;
    inputFocus: string;
    overAllClose: string;
    popupListWrapper: string;
    listContainer: string;
    overAllList: string;
    listItem: string;
    ListItemSelected: string;
    ListItemHighlighted: string;
    containerChildlength: number;
    defaultChildlength: number;
    inputARIA: Array<string>;
    listARIA: Array<string>;
    closeiconhide: string;
}
let mouseEventArgs: any = { preventDefault: function () { }, target: null };
let keyboardEventArgs = {
    preventDefault: function () { },
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    char: '',
    key: '',
    charCode: 22,
    keyCode: 22,
    which: 22,
    code: 22
};
describe('MultiSelect', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let css: string = ".e-spinner-pane::after { content: 'Material'; display: none;} .e-multi-select-wrapper .e-multi-hidden {border: 0;height: 0;visibility: hidden; width: 0;}";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);
    //Validation for element strcture and css class.
    describe('rendering validation', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
            }
        });
        /**
         * element structure validation.
         */
        it('wrapper element - Box Mode', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (!Browser.isDevice) {
                expect(wrapper.nodeName).toEqual("DIV");//1
                expect(wrapper.classList.toString()).toEqual(multiSelectData.container);//2
                expect(wrapper.childNodes.length).toEqual(4);//4
                //Selected items list structure validation. 
                //<span class="e-chips">sample1<span class="e-chips-close e-icon"></span></span>
                if (wrapper.firstChild) {
                    expect(wrapper.firstChild.nodeName).toEqual("SPAN");//4
                    expect(wrapper.firstElementChild.classList.toString()).toEqual(multiSelectData.selectedListContainer);//5
                    expect(wrapper.firstElementChild.childNodes.length).toEqual(1);//14
                    if (wrapper.firstElementChild.childNodes.length) {
                        expect(wrapper.firstElementChild.firstElementChild.nodeName).toEqual("SPAN");//15
                        expect(wrapper.firstElementChild.firstElementChild.classList.toString()).toEqual(multiSelectData.chips);//16
                        expect(wrapper.firstElementChild.firstElementChild.lastElementChild.nodeName).toEqual("SPAN");//17
                        expect(wrapper.firstElementChild.firstElementChild.lastElementChild.classList.toString()).toEqual(multiSelectData.chipsClose);//18
                    }
                    if (wrapper.firstChild.nextSibling) {
                        //Input Wrapper structure validation.
                        expect(wrapper.firstChild.nextSibling.nodeName).toEqual("SPAN");//6
                        expect(wrapper.firstElementChild.nextElementSibling.classList.contains('e-multiselect-box')).toEqual(true);
                        wrapper.firstElementChild.nextElementSibling.classList.remove('e-multiselect-box');
                        expect(wrapper.firstElementChild.nextElementSibling.classList.toString()).toEqual(multiSelectData.inputContainer);//7
                        if (wrapper.firstChild.nextSibling.nextSibling) {
                            //wrapper element validation.
                            expect(wrapper.firstChild.nextSibling.nextSibling.nodeName).toEqual("SPAN");//8
                            expect(wrapper.firstElementChild.nextElementSibling.nextElementSibling.classList.toString()).toEqual(multiSelectData.overAllClose);//9

                        } else {
                            expect(true).toBe(false);
                        }
                    } else {
                        expect(true).toBe(false);
                    }
                } else {
                    expect(true).toBe(false);
                }
                //Input element validation.
                expect((<any>listObj).inputElement.nodeName).toEqual("INPUT");//10
                expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//11
                for (let a = 0; a < multiSelectData.inputARIA.length; a++) {
                    expect((<any>listObj).inputElement.getAttribute(multiSelectData.inputARIA[a])).not.toBe(null);//12
                }
                expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//13
            }
            //wrapper structure validation.
             (<any>listObj).updateDelimView();
            listObj.destroy();
        });
        it('wrapper element - Delim Mode', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Delimiter', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (!Browser.isDevice) {
                //wrapper structure validation.
                expect(wrapper.nodeName).toEqual("DIV");//1
                expect(wrapper.classList.toString()).toEqual(multiSelectData.container);//2
                expect(wrapper.childNodes.length).toEqual(multiSelectData.containerChildlength);//3
                //Selected items list structure validation. 
                //<span class="e-chips">sample1<span class="e-chips-close e-icon"></span></span>
                if (wrapper.firstChild) {
                    expect(wrapper.firstChild.nodeName).toEqual("SPAN");//4
                    expect(wrapper.firstElementChild.classList.toString()).toEqual(multiSelectData.delimContainer);//5
                    expect(wrapper.firstElementChild.textContent.split(',').length).toEqual(2);//14
                    if (wrapper.firstChild.nextSibling) {
                        //Input Wrapper structure validation.
                        expect(wrapper.firstChild.nextSibling.nodeName).toEqual("SPAN");//6
                        expect(wrapper.firstElementChild.nextElementSibling.classList.toString()).toEqual(multiSelectData.delimViewContainer);//7
                        if (wrapper.firstChild.nextSibling.nextSibling) {
                            //wrapper element validation.
                            expect(wrapper.firstChild.nextSibling.nextSibling.nodeName).toEqual("SPAN");//8
                            expect(wrapper.firstElementChild.nextElementSibling.nextElementSibling.classList.toString()).toEqual(multiSelectData.inputContainer);//9
                            if (wrapper.firstChild.nextSibling.nextSibling.nextSibling) {
                                //Close element validation.
                                expect(wrapper.firstChild.nextSibling.nextSibling.nextSibling.nodeName).toEqual("SPAN");//8
                                expect(wrapper.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.classList.toString()).toEqual(multiSelectData.overAllClose);//9
                            } else {
                                expect(true).toBe(false);
                            }
                        } else {
                            expect(true).toBe(false);
                        }
                    } else {
                        expect(true).toBe(false);
                    }
                } else {
                    expect(true).toBe(false);
                }
                //Input element validation.
                expect((<any>listObj).inputElement.nodeName).toEqual("INPUT");//10
                expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//11

                for (let a = 0; a < multiSelectData.inputARIA.length; a++) {
                    expect((<any>listObj).inputElement.getAttribute(multiSelectData.inputARIA[a])).not.toBe(null);//12
                }
                expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//13
                (<any>listObj).focusInHandler();
            }
            listObj.destroy();
        });
        it('wrapper element - Default Mode', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            //wrapper structure validation.
            if (!Browser.isDevice) {
                expect(wrapper.nodeName).toEqual("DIV");//1
                expect(wrapper.classList.toString()).toEqual(multiSelectData.container);//2
                expect(wrapper.childNodes.length).toEqual(multiSelectData.defaultChildlength);//3
                //Selected items list structure validation. 
                //<span class="e-chips">sample1<span class="e-chips-close e-icon"></span></span>
                if (wrapper.firstChild) {
                    expect(wrapper.firstChild.nodeName).toEqual("SPAN");//4
                    expect(wrapper.firstElementChild.classList.toString()).toEqual(multiSelectData.selectedListContainer);//5
                    expect(wrapper.firstElementChild.childNodes.length).toEqual(1);//14
                    if (wrapper.firstElementChild.childNodes.length) {
                        expect(wrapper.firstElementChild.firstElementChild.nodeName).toEqual("SPAN");//15
                        expect(wrapper.firstElementChild.firstElementChild.classList.toString()).toEqual(multiSelectData.chips);//16
                        expect(wrapper.firstElementChild.firstElementChild.lastElementChild.nodeName).toEqual("SPAN");//17
                        expect(wrapper.firstElementChild.firstElementChild.lastElementChild.classList.toString()).toEqual(multiSelectData.chipsClose);//18
                    }
                    expect(wrapper.firstChild.nextSibling.nodeName).toEqual("SPAN");//4
                    expect(wrapper.firstElementChild.nextElementSibling.classList.toString()).toEqual(multiSelectData.delimViewContainer);//5
                    if (wrapper.firstChild.nextSibling) {
                        //Input Wrapper structure validation.
                        if (wrapper.firstChild.nextSibling.nextSibling) {
                            //Close element validation.
                            expect(wrapper.firstChild.nextSibling.nextSibling.nodeName).toEqual("SPAN");//8
                            expect(wrapper.firstElementChild.nextElementSibling.nextElementSibling.classList.toString()).toEqual(multiSelectData.inputContainer);//9
                            if (wrapper.firstChild.nextSibling.nextSibling.nextSibling) {
                                //Close element validation.
                                expect(wrapper.firstChild.nextSibling.nextSibling.nextSibling.nodeName).toEqual("SPAN");//8
                                expect(wrapper.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.classList.toString()).toEqual(multiSelectData.overAllClose);//9
                            } else {
                                expect(true).toBe(false);
                            }
                        } else {
                            expect(true).toBe(false);
                        }
                    } else {
                        expect(true).toBe(false);
                    }
                } else {
                    expect(true).toBe(false);
                }
                //Input element validation.
                expect((<any>listObj).inputElement.nodeName).toEqual("INPUT");//10
                expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//11
                for (let a = 0; a < multiSelectData.inputARIA.length; a++) {
                    expect((<any>listObj).inputElement.getAttribute(multiSelectData.inputARIA[a])).not.toBe(null);//12
                }
                expect((<any>listObj).inputElement.classList.toString()).toEqual(multiSelectData.inputElement);//13
                listObj.enabled = false;
                listObj.dataBind();
                (<any>listObj).mouseIn();
                (<any>listObj).focusInHandler();
            }
            listObj.destroy();
        });
        it('List Popup Element Validation.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            listObj.showPopup();
            //expect((<any>listObj).overAllWrapper.classList.contains(multiSelectData.inputFocus)).toEqual(true);//27
            let listWarapper: HTMLElement = (<any>listObj).popupObj.element;
            if (listWarapper) {
                expect(listWarapper.nodeName).toEqual("DIV");//18
                expect(listWarapper.parentElement).not.toEqual(null);//19                
                if (listWarapper.firstElementChild) {//list container validation.
                    expect(listWarapper.firstChild.nodeName).toEqual("DIV");//21
                    expect(listWarapper.firstElementChild.classList.toString()).toEqual(multiSelectData.listContainer);//22
                    if (listWarapper.firstElementChild.firstChild) {//list element validation.
                        expect(listWarapper.firstElementChild.firstChild.nodeName).toEqual("UL");//23
                        expect(listWarapper.firstElementChild.firstElementChild.classList.toString().trim()).toEqual(multiSelectData.overAllList);//24
                        for (let a = 0; a < multiSelectData.listARIA.length; a++) {
                            expect((<any>listObj).ulElement.getAttribute(multiSelectData.listARIA[a])).not.toBe(null);//20
                        }
                        if (listWarapper.firstElementChild.firstElementChild.firstElementChild) {
                            expect(listWarapper.firstElementChild.firstChild.firstChild.nodeName).toEqual("LI");//25
                            expect(listWarapper.firstElementChild.firstElementChild.firstElementChild.classList.toString().trim()).toEqual(multiSelectData.listItem);//26
                        } else {
                            expect(true).toBe(false);
                        }
                    } else {
                        expect(true).toBe(false);
                    }
                } else {
                    expect(true).toBe(false);
                }
            } else {
                expect(true).toBe(false);
            }
            listObj.destroy();
        });
        it('List Popup Element Validation step - 1.', () => {
            let listObj: any = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            (<any>listObj).inputElement.focus();
            listObj.showPopup();
            let listWarapper: HTMLElement = (<any>listObj).popupObj.element;
            if (listWarapper) {
                let listElement: HTMLElement = <HTMLElement>listWarapper.querySelector(".e-list-parent");
                expect(listElement.firstElementChild.classList.contains(multiSelectData.ListItemSelected)).toBe(true);//28
                expect(listElement.firstElementChild.classList.contains(multiSelectData.ListItemHighlighted)).toBe(true);//29
            } else {
                expect(true).toBe(false);
            }
            listObj.hidePopup();
            expect(document.body.contains(listObj.popupObj.element)).toBe(false);
            listObj.destroy();
        });
        it('Chip rendering for mobile scenarios:', () => {
            let temp: any = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            expect(elem.classList.contains(multiSelectData.mobileChip)).toBe(true);
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('none');
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('');
            expect(elem.classList.contains(multiSelectData.chipSelection)).toBe(true);
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(elem.parentElement).toBe(null);
            (<any>listObj).value = ["JAVA"];
            (<any>listObj).dataBind();
            (<any>listObj).focusInHandler();
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            (<any>listObj).overAllWrapper.classList.add(multiSelectData.inputFocus);
            (<any>listObj).onListMouseDown({ preventDefault: function () { } });
            listObj.destroy();
            Browser.userAgent = temp;
        });
        it('Chip rendering for mobile scenarios: with wrapper click', () => {
            let temp: any = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            expect(elem.classList.contains(multiSelectData.mobileChip)).toBe(true);
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('none');
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('');
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = elem;
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('');
            (<any>listObj).value = ["JAVA"];
            (<any>listObj).dataBind();
            (<any>listObj).focusInHandler();
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            (<any>listObj).overAllWrapper.classList.add(multiSelectData.inputFocus);
            (<any>listObj).onListMouseDown({ preventDefault: function () { } });
            listObj.destroy();
            Browser.userAgent = temp;
        });
        it('Chip rendering for mobile scenarios: with wrapper click', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            listObj.showPopup();
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = elem.lastElementChild;
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(true);
            listObj.hidePopup();
            mouseEventArgs.target = elem.lastElementChild;
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            (<any>listObj).wrapperClick(mouseEventArgs);
            mouseEventArgs.target = (<any>listObj).overAllClear;
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            listObj.destroy();
        });
        // 
        it('Chip rendering for mobile scenarios: with onblur click', () => {
            let temp: any = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"] });
            listObj.appendTo(element);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            expect(elem.classList.contains(multiSelectData.mobileChip)).toBe(true);
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('none');
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('');
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = elem;
            (<any>listObj).onBlurHandler(mouseEventArgs);
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('none');
            (<any>listObj).value = ["JAVA"];
            (<any>listObj).dataBind();
            (<any>listObj).focusInHandler();
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            (<any>listObj).overAllWrapper.classList.add(multiSelectData.inputFocus);
            (<any>listObj).onListMouseDown({ preventDefault: function () { } });
            (<any>listObj).showPopup();
            (<any>listObj).scrollFocusStatus = false;
            (<any>listObj).onBlurHandler(mouseEventArgs);
            listObj.destroy();
            Browser.userAgent = temp;
        });
        it('Chip rendering for mobile scenarios: readonly true', () => {
            let temp: any = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource, mode: 'Box', fields: { text: "text", value: "text" }, value: ["JAVA"], readonly: true });
            listObj.appendTo(element);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            expect(elem.classList.contains(multiSelectData.mobileChip)).toBe(true);
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('none');
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            expect((<HTMLElement>elem.lastElementChild).style.display).toBe('none');
            expect(elem.classList.contains(multiSelectData.chipSelection)).toBe(false);
            (<any>listObj).onMobileChipInteraction({ target: elem, preventDefault: function () { } });
            expect(elem.parentElement).not.toBe(null);
            listObj.destroy();
            Browser.userAgent = temp;
        });
    });
    describe('Placeholder testing through inline', () => {
        let listObj: any;
        let element: HTMLElement
        let datasource1: { [key: string]: Object }[] = [{ 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
        beforeAll(() => {
            element = createElement('input', { id: 'msd' });
            element.setAttribute('placeholder','Select a game');
            document.body.appendChild(element);
        });
        afterAll(() => {
            listObj.destroy();
            element.remove();
        });
        /**
         * Inline placeholder
         */
        it('Adding placeholder attribute through inline with float type auto', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, floatLabelType: 'Auto'});
            listObj.appendTo(element);
            setTimeout(()=>{
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.textContent === 'Select a game').toBe(true);
                done();
            }, 200);
        });
        it('Adding placeholder attribute through inline with float type always', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, floatLabelType: 'Always'});
            listObj.appendTo(element);
            setTimeout(()=>{
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.textContent === 'Select a game').toBe(true);
                done();
            }, 200);
        });
        it('Adding placeholder attribute through inline with float type never', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, floatLabelType: 'Never'});
            listObj.appendTo(element);
            expect((<any>listObj).inputElement.getAttribute('placeholder')).toBe('Select a game');
        });
    });  
    describe('Placeholder testing through inline and API', () => {
        let listObj: any;
        let element: HTMLElement
        let datasource1: { [key: string]: Object }[] = [{ 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
        beforeAll(() => {
            element = createElement('input', { id: 'msd' });
            element.setAttribute('placeholder','Select a game');
            document.body.appendChild(element);
        });
        afterAll(() => {
            listObj.destroy();
            element.remove();
        });
        /**
         * placeholder API at initial rendering
         */
        it('Adding placeholder attribute through API at initial rendering with float type auto', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, placeholder: 'Select an employee', floatLabelType: 'Auto'});
            listObj.appendTo(element);
            expect((<any>listObj).inputElement.hasAttribute('placeholder')).toBe(false);
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.textContent === 'Select an employee').toBe(true);
        });
        it('Adding placeholder attribute through API at initial rendering with float type always', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, placeholder: 'Select an employee', floatLabelType: 'Always'});
            listObj.appendTo(element);
            expect((<any>listObj).inputElement.hasAttribute('placeholder')).toBe(false);
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.textContent === 'Select an employee').toBe(true);
        });
        it('Adding placeholder attribute through API at initial rendering with float type never', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, placeholder: 'Select an employee', floatLabelType: 'Never'});
            listObj.appendTo(element);
            expect((<any>listObj).inputElement.getAttribute('placeholder')).toBe('Select an employee');
        });
        /**
         * placeholder API dynamically
         */
        it('Adding placeholder attribute through API dynamically with float type auto', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, floatLabelType:'Auto'});
            listObj.appendTo(element);
            listObj.placeholder = 'Select an employee';
            listObj.dataBind();
            expect((<any>listObj).inputElement.hasAttribute('placeholder')).toBe(false);
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.textContent === 'Select an employee').toBe(true);
        });
        it('Adding placeholder attribute through API dynamically with float type always', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, floatLabelType:'Always'});
            listObj.appendTo(element);
            listObj.placeholder = 'Select an employee';
            listObj.dataBind();
            expect((<any>listObj).inputElement.hasAttribute('placeholder')).toBe(false);
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.textContent === 'Select an employee').toBe(true);
        });
        it('Adding placeholder attribute through API dynamically with float type never', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, floatLabelType:'Never'});
            listObj.appendTo(element);
            listObj.placeholder = 'Select an employee';
            listObj.dataBind();
            expect((<any>listObj).inputElement.getAttribute('placeholder')).toBe('Select an employee');
        });
    });
    describe('Placeholder testing through API', () => {
        let listObj: any;
        let element: HTMLElement
        let datasource1: { [key: string]: Object }[] = [{ 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
        beforeAll(() => {
            element = createElement('input', { id: 'msd' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            listObj.destroy();
            element.remove();
        });
        /**
         * placeholder API at initial rendering
         */
        it('Adding placeholder attribute through API at initial rendering with float type auto', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, placeholder: 'Select an employee', floatLabelType: 'Auto'});
            listObj.appendTo(element);
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.textContent === 'Select an employee').toBe(true);
        });
        it('Adding placeholder attribute through API at initial rendering with float type always', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, placeholder: 'Select an employee', floatLabelType: 'Always'});
            listObj.appendTo(element);
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.textContent === 'Select an employee').toBe(true);
        });
        it('Adding placeholder attribute through API at initial rendering with float type never', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, placeholder: 'Select an employee', floatLabelType: 'Never'});
            listObj.appendTo(element);
            expect((<any>listObj).inputElement.getAttribute('placeholder')).toBe('Select an employee');
        });
        /**
         * placeholder API dynamically
         */
        it('Adding placeholder attribute through API dynamically with float type auto', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, floatLabelType:'Auto'});
            listObj.appendTo(element);
            listObj.placeholder = 'Select an employee';
            listObj.dataBind();
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.textContent === 'Select an employee').toBe(true);
        });
        it('Adding placeholder attribute through API dynamically with float type always', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, floatLabelType:'Always'});
            listObj.appendTo(element);
            listObj.placeholder = 'Select an employee';
            listObj.dataBind();
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.textContent === 'Select an employee').toBe(true);
        });
        it('Adding placeholder attribute through API dynamically with float type never', () =>{
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, floatLabelType:'Never'});
            listObj.appendTo(element);
            listObj.placeholder = 'Select an employee';
            listObj.dataBind();
            expect((<any>listObj).inputElement.getAttribute('placeholder')).toBe('Select an employee');
        });
    });
    describe('Angular tag testing ', () => {
        let listObj: any;
        let element: HTMLElement
        let datasource1: { [key: string]: Object }[] = [{ 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
        { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
        beforeAll(() => {
            element = createElement('EJS-MULTISELECT', { id: 'msd' });
            document.body.appendChild(element);
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            listObj.appendTo(element);
        });
        afterAll(() => {
            listObj.destroy();
            element.remove();
        });
        it('Wrapper testing ', () => {
            expect(listObj.element.tagName).toEqual('EJS-MULTISELECT');
            expect((<HTMLElement>listObj.element).contains(listObj.overAllWrapper)).toBe(true);
            listObj.resetValueHandler();
        });
    });

    //Multiple cssClass
    describe('Add multiple CssClass', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Dynamically change multiple cssClass', () => {
            listObj = new MultiSelect({ dataSource: datasource2, cssClass: 'sample' });
            listObj.appendTo(element);
            expect((<any>listObj).overAllWrapper.classList.contains('sample')).toEqual(true);
            expect((<any>listObj).popupWrapper.classList.contains('sample')).toBe(true);
            listObj.cssClass = 'test highlight';
            listObj.dataBind();
            expect((<any>listObj).overAllWrapper.classList.contains('test')).toEqual(true);
            expect((<any>listObj).overAllWrapper.classList.contains('highlight')).toEqual(true);
            expect((<any>listObj).overAllWrapper.classList.contains('test')).toEqual(true);
            expect((<any>listObj).overAllWrapper.classList.contains('highlight')).toEqual(true);

        });
        it('Initially render multiple cssClass', () => {
            listObj = new MultiSelect({ dataSource: datasource2, cssClass: 'sample highlight' });
            listObj.appendTo(element);
            expect((<any>listObj).overAllWrapper.classList.contains('sample')).toEqual(true);
            expect((<any>listObj).overAllWrapper.classList.contains('highlight')).toEqual(true);
            expect((<any>listObj).popupWrapper.classList.contains('sample')).toBe(true);
            expect((<any>listObj).popupWrapper.classList.contains('highlight')).toBe(true);
            listObj.cssClass = 'test';
            listObj.dataBind();
            expect((<any>listObj).overAllWrapper.classList.contains('test')).toEqual(true);
            expect((<any>listObj).popupWrapper.classList.contains('test')).toBe(true);
        });
        it('Dynamically change cssClass as null', () => {
            listObj = new MultiSelect({ dataSource: datasource2, cssClass: 'sample highlight' });
            listObj.appendTo(element);
            expect((<any>listObj).overAllWrapper.classList.contains('sample')).toEqual(true);
            expect((<any>listObj).overAllWrapper.classList.contains('highlight')).toEqual(true);
            expect((<any>listObj).popupWrapper.classList.contains('sample')).toBe(true);
            expect((<any>listObj).popupWrapper.classList.contains('highlight')).toBe(true);
            listObj.cssClass = null;
            listObj.dataBind();
            expect((<any>listObj).overAllWrapper.classList.contains('sample')).toEqual(false);
            expect((<any>listObj).overAllWrapper.classList.contains('highlight')).toEqual(false);
            expect((<any>listObj).popupWrapper.classList.contains('sample')).toBe(false);
            expect((<any>listObj).popupWrapper.classList.contains('highlight')).toBe(false);
        });
        it('Dynamically change cssClass as empty', () => {
            listObj = new MultiSelect({ dataSource: datasource2, cssClass: 'sample highlight' });
            listObj.appendTo(element);
            expect((<any>listObj).overAllWrapper.classList.contains('sample')).toEqual(true);
            expect((<any>listObj).overAllWrapper.classList.contains('highlight')).toEqual(true);
            expect((<any>listObj).popupWrapper.classList.contains('sample')).toBe(true);
            expect((<any>listObj).popupWrapper.classList.contains('highlight')).toBe(true);
            listObj.cssClass = '';
            listObj.dataBind();
            expect((<any>listObj).overAllWrapper.classList.contains('sample')).toEqual(false);
            expect((<any>listObj).overAllWrapper.classList.contains('highlight')).toEqual(false);
            expect((<any>listObj).popupWrapper.classList.contains('sample')).toBe(false);
            expect((<any>listObj).popupWrapper.classList.contains('highlight')).toBe(false);
        });
    });

    //Validation for element strcture and css class.
    describe('Property validation on initial render', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        /**
         * API validation.
         */
        it('validate dimention APIs', (done) => {
            let datasource33: { [key: string]: Object }[] = datasource2.slice();
            datasource33.push({ id: 'list6', text: 'Oracle_Java_C#_Python_Flask_DJango' })
            L10n.load({
                'fr-BE': {
                    'dropdowns': {
                        'noRecordsTemplate': "Aucun enregistrement trouvé",
                        'actionFailureTemplate': "Modèle d'échec d'action",
                        "overflowCountTemplate": "More +${count} items"
                    }

                }
            });
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource33, fields: { value: 'id', text: 'text' }, width: "300px", popupHeight: "100px", popupWidth: "250px", locale: 'fr-BE' });
            listObj.appendTo(element);
            (<any>listObj).viewWrapper.setAttribute('style', "white-space: nowrap;");
            listObj.change = function () {
                expect((<HTMLElement>(<any>listObj).viewWrapper).childElementCount).toBe(1);
                listObj.destroy();
                done();
            };
            listObj.value = ['list6', 'list5', 'list4', 'list3'];
            listObj.dataBind();
        });
        /**
         * API validation.
         */
        it('validate dimention APIs', () => {

            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, width: "300px", popupHeight: "100px", mode: 'Box', popupWidth: "250px" });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper)
                expect(wrapper.getBoundingClientRect().width).toBe(300);//31
            else
                expect(true).toBe(false);
            listObj.showPopup();
            let listWarapper: HTMLElement = (<any>listObj).popupObj.element;
            if (listWarapper) {
                let listElement: HTMLElement = <HTMLElement>listWarapper.querySelector(".e-list-parent");
                expect(listWarapper.getBoundingClientRect().width).toBe(250);//32
                expect(listWarapper.getBoundingClientRect().height).toBe(100);//33
            } else {
                expect(true).toBe(false);
            }
            listObj.width = "200px";
            listObj.dataBind();
            if (wrapper)
                expect(wrapper.getBoundingClientRect().width).toBe(200);//31
            else
                expect(true).toBe(false);
            if (listWarapper) {
                let listElement: HTMLElement = <HTMLElement>listWarapper.querySelector(".e-list-parent");
                expect(listWarapper.getBoundingClientRect().width).toBe(250);//32
                expect(listWarapper.getBoundingClientRect().height).toBe(100);//33
            } else {
                expect(true).toBe(false);
            }

            listObj.destroy();

        });
        it('validate duplicated value APIs', () => {

            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, width: "300px", popupHeight: "100px", mode: 'Box', popupWidth: "250px", value: ["JAVA", "JAVA"] });
            listObj.appendTo(element);
            expect((<any>listObj).chipCollectionWrapper.childElementCount).toBe(1);
            listObj.showPopup();
            listObj.destroy();
        });
        it('Validating the Delimeter Cahr', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ["PHP", "JAVA"], mode: 'Delimiter' });
            listObj.appendTo(element);
            expect((<any>listObj).delimiterWrapper.innerHTML.trim()).toBe("PHP, JAVA,");
            expect((<any>listObj).viewWrapper.innerHTML.trim()).toBe("PHP, JAVA");
            listObj.setProperties({ delimiterChar: ';' })
            expect((<any>listObj).delimiterWrapper.innerHTML.trim()).toBe("PHP; JAVA;");
            expect((<any>listObj).viewWrapper.innerHTML.trim()).toBe("PHP; JAVA");
            listObj.destroy();
        });
        it('validate item selection on render API-Value', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ["PHP", "JAVA"] });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild)
                expect(wrapper.firstElementChild.childNodes.length).toEqual(2);//34
            else
                expect(true).toBe(false);
            listObj.destroy();
        });
        it('validate item selection on render API-Text', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.change = function (){
                expect(listObj.text).toEqual(listObj.value.toString());//34
                listObj.destroy();
                done();
            };
            listObj.value = ["PHP", "JAVA"];
            listObj.dataBind();
        });
        it('validate item selection on render API-Value', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: ['JAVA', 'PHP', 'PYTHON'] });
            listObj.appendTo(element);
            listObj.change = function (){
                let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
                if (wrapper && wrapper.firstElementChild)
                    expect(wrapper.firstElementChild.childNodes.length).toEqual(2);//34
                else
                    expect(true).toBe(false);
                listObj.destroy();
                done();
            };
            listObj.value = ["PHP", "JAVA"];
            listObj.dataBind();
        });
        it('validate datasource binding without init value selection.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, fields: { text: "Text", value: "text" } });
            listObj.appendTo(element);
            listObj.dataSource = datasource2;
            listObj.dataBind();
            let wrapper: HTMLElement = (<any>listObj).chipCollectionWrapper;
            expect(wrapper && (wrapper.childNodes.length == 0)).toEqual(true);//34
            listObj.destroy();
            //listObj.query = new Query().take(4);
        });
        it('down && up key press after scroll by manually', (done) => {
            //
            let list: any = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2,
                fields: { text: "text", value: "text" }
            });
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            list.appendTo(element);
            list.showPopup();
            setTimeout(() => {
                expect(list.isPopupOpen()).toBe(true);
                list.list.style.overflow = 'auto';
                list.list.style.height = '48px';
                list.list.style.display = 'block';
                keyboardEventArgs.keyCode = 40;
                list.list.scrollTop = 90;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 113;
                list.onKeyDown(keyboardEventArgs);
                expect(list.list.scrollTop !== 90).toBe(true);
                keyboardEventArgs.keyCode = 38;
                list.onKeyDown(keyboardEventArgs);
                expect(list.list.scrollTop !== 0).toBe(true);
                list.list.scrollTop = 0;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 40;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 33;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 34;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.destroy();
                done()
            }, 450);
        });
        it('down && up key press after scroll by manually', (done) => {
            //
            let list: any = new MultiSelect();
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            list.appendTo(element);
            list.value = ['java', 'php'];
            list.mainData = '';
            list.delimiterChar = ',';
            list.showPopup();
            setTimeout(() => {
                expect(list.isPopupOpen()).toBe(true);
                list.list.style.overflow = 'auto';
                list.list.style.height = '48px';
                list.list.style.display = 'block';
                keyboardEventArgs.keyCode = 40;
                list.list.scrollTop = 90;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                expect(list.list.scrollTop !== 90).toBe(true);
                keyboardEventArgs.keyCode = 38;
                list.onKeyDown(keyboardEventArgs);
                list.list.scrollTop = 0;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 40;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 33;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 34;
                list.onKeyDown(keyboardEventArgs);
                list.onKeyDown(keyboardEventArgs);
                list.destroy();
                done()
            }, 450);
        });
        it('validate datasource binding Keyup.', () => {
            keyboardEventArgs.keyCode = 71;
            listObj = new MultiSelect({ hideSelectedItem: false, fields: { text: "Text", value: "text" } });
            listObj.appendTo(element);
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            let wrapper: HTMLElement = (<any>listObj).chipCollectionWrapper;
            expect(wrapper && (wrapper.childNodes.length == 0)).toEqual(true);//34
            listObj.destroy();
            //listObj.query = new Query().take(4);
        });
        it('validate datasource binding with Query property.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.dataSource = datasource2;
            listObj.query = new Query().take(4);
            listObj.value = ['Python'];
            listObj.dataBind();
            expect((<any>listObj).list.querySelectorAll("li").length).toEqual(4);//34
            listObj.destroy();
        });
        it('validate datasource binding with-out data value set', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, fields: { text: "Text", value: "text" } });
            listObj.appendTo(element);
            listObj.value = ['Python'];
            listObj.dataBind();
            listObj.showPopup();
            listObj.selectAll(true);
            expect((<any>listObj).list).not.toEqual(null);//34
            listObj.destroy();
        });
        it('validate  on render API-placeholder', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, placeholder: "Select your choice" });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).inputElement.getAttribute("placeholder")).not.toBe(null)//35
            }
            else
                expect(true).toBe(false);

            listObj.placeholder = 'Sample Check';
            listObj.dataBind();

            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe('Sample Check')//35
            }
            else
                expect(true).toBe(false);
            listObj.destroy();
        });
        /**
         * cssClass  property.
         */
        it('cssClass ', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, cssClass: 'closeState' });
            listObj.appendTo(element);
            listObj.dataBind();
            expect((<any>listObj).overAllWrapper.classList.contains('closeState')).toEqual(true);//27
            //popupWrapper
            expect((<any>listObj).popupWrapper.classList.contains('closeState')).toBe(true);//37
            listObj.cssClass = 'CloseSet';
            listObj.dataBind();
            expect((<any>listObj).overAllWrapper.classList.contains('closeState')).toEqual(false);//27
            //popupWrapper
            expect((<any>listObj).popupWrapper.classList.contains('closeState')).toBe(false);//37
            expect((<any>listObj).overAllWrapper.classList.contains('CloseSet')).toEqual(true);//27
            //popupWrapper
            expect((<any>listObj).popupWrapper.classList.contains('CloseSet')).toBe(true);//37

            listObj.destroy();

        });
        /**
         * htmlAttributes
         */
        it('htmlAttributes', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).overAllWrapper;
            listObj.htmlAttributes = { title: 'sample', name: 'dropdown', class: 'e-ddl-list', disabled: 'disabled', readonly: 'readonly', style: 'margin: 0', role: 'listbox', placeholder: 'new text' };
            listObj.dataBind();
            expect((<any>listObj).hiddenElement.getAttribute('name')).toBe('dropdown');//Need tp add it to the select element/
            expect(wrapper.classList.contains('e-ddl-list')).toBe(true);//38
            expect(wrapper.classList.contains('e-disabled')).toBe(true);
            expect((<any>listObj).inputElement.getAttribute('placeholder')).toBe('new text');
            expect(wrapper.getAttribute('role')).toBe('listbox');////39
            expect(wrapper.getAttribute('style')).toBe('margin: 0');
            expect(wrapper.getAttribute('style')).toBe('margin: 0');
            expect((<any>listObj).element).not.toBe(null);
            listObj.destroy();
        });
        /**
         * enableRtl
         */
        it('enableRtl ', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).overAllWrapper;
            listObj.showPopup();
            listObj.enableRtl = true;
            listObj.dataBind();
            let listWarapper = (<any>listObj).popupObj.element;
            expect(wrapper.classList.contains('e-rtl')).toEqual(true);//40
            if (listWarapper)
                expect(listWarapper.classList.contains('e-rtl')).toBe(true);//41
            else
                expect(true).toBe(false);
            listObj.hidePopup();
            listObj.enableRtl = false;
            listObj.dataBind();
            listObj.showPopup();
            expect(wrapper.classList.contains('e-rtl')).toEqual(false);//42
            if (listWarapper)
                expect(listWarapper.classList.contains('e-rtl')).toBe(false);//43
            else
                expect(true).toBe(false);
            listObj.destroy();
        });
        /**
         * showClearButton
         */
        it('showClearButton false', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, showClearButton: false, value: ['PHP'], fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.showClearButton = false;
            listObj.dataBind();
            expect((<any>listObj).componentWrapper.classList.contains(multiSelectData.closeiconhide)).toBe(true);
            listObj.destroy();
        })
        // it('showClearButton ', (done:Function) => {
        //     listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, showClearButton: false, value: ['PHP'], fields: { text: "text", value: "text" } });
        //     listObj.appendTo(element);
        //     //Close element validation.
        //     let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
        //     if (wrapper) {
        //         setTimeout (function () {
        //         expect(wrapper.querySelector('.' + multiSelectData.overAllClose.split(' ')[2])).toEqual(null);//44
        //         done();
        //         },1000)
        //     }
        //     else
        //         expect(true).toBe(false);
        //     if (wrapper) {
        //         setTimeout (function () {
        //         expect(wrapper.querySelector('.' + multiSelectData.chipsClose.split(' ')[0])).toEqual(null);//45
        //         done();
        //     },500)
        //     }
        //     else
        //         expect(true).toBe(false);
        //     listObj.showClearButton = true;
        //     listObj.value = ['JAVA']
        //     listObj.dataBind();
        //     if (wrapper) {
        //         expect(wrapper.querySelector('.' + multiSelectData.overAllClose.split(' ')[1])).not.toEqual(null);//46
        //     }
        //     else
        //         expect(true).toBe(false);
        //     if (wrapper) {
        //         expect(wrapper.querySelector('.' + multiSelectData.chipsClose.split(' ')[0])).not.toEqual(null);//45
        //     }
        //     else
        //         expect(true).toBe(false);
        //     listObj.showClearButton = false;
        //     listObj.dataBind();
        //     if (wrapper) {
        //         expect((<any>listObj).overAllClear.style.display).not.toEqual(null);//46
        //     }
        //     else
        //         expect(true).toBe(false);
        //     listObj.showClearButton = true;
        //     listObj.dataBind();
        //     if (wrapper) {
        //         expect((<any>listObj).overAllClear.style.display).toEqual('');//46
        //     }
        //     else
        //         expect(true).toBe(false);
        //     listObj.destroy();
        // });
        /**
         * List Click Action
         */
        it('Lit Click action with hide selected item and select event checkup.', () => {
            let status: boolean = false;
            listObj = new MultiSelect({
                dataSource: datasource2, fields: { text: "text", value: "text" }, select: function () {
                    status = true;
                }, hideSelectedItem: true
            });
            listObj.appendTo(element);
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            expect(list[0].classList.contains('e-hide-listitem')).toBe(false);
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect(list[0].classList.contains('e-hide-listitem')).toBe(true);
            expect(status).toBe(true);
            listObj.destroy();
        });
        /**
         * maximumSelectionLength.
         */
        it('maximumSelectionLength.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, maximumSelectionLength: 1 });
            listObj.appendTo(element);
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            mouseEventArgs.target = list[1];
            (<any>listObj).onMouseClick(mouseEventArgs);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            expect(wrapper.firstElementChild.childNodes.length).toEqual(1);//48
            listObj.maximumSelectionLength = 2;
            (<any>listObj).onMouseClick(mouseEventArgs);
            (<any>listObj).onBlurHandler();
            listObj.dataBind();
            expect(wrapper.firstElementChild.childNodes.length).toEqual(2);//49
            listObj.enabled = false;
            listObj.dataBind();
            listObj.showPopup();
            (<any>listObj).onMouseClick(mouseEventArgs);
            listObj.destroy();
        });
        /**
         * allowCustomValue.
        */

        it('allowCustomValue.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: 'text', value: 'text' }, allowCustomValue: true, value: ['PHP'] });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.keyCode = 113;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(1);
            expect((<any>listObj).value.length).toBe(1);
            mouseEventArgs.target = (<any>listObj).liCollections[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
            listObj.destroy();
        });
        it('allowCustomValue with empty datasource', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: [], allowCustomValue: true });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.keyCode = 113;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(1);
            mouseEventArgs.target = (<any>listObj).liCollections[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
            listObj.destroy();
        });
        it('allowCustomValue with array datasource', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: ['test'], allowCustomValue: true });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.keyCode = 113;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(1);
            mouseEventArgs.target = (<any>listObj).liCollections[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
            listObj.destroy();
        });
        /**
         * readonly.
         */
        it('readonly.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            listObj.appendTo(element);
            listObj.readonly = true;
            listObj.dataBind();
            expect((<any>listObj).inputElement.hasAttribute('readonly')).not.toEqual(null);//52
            keyboardEventArgs.altKey = true;
            keyboardEventArgs.keyCode = 40;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            listObj.readonly = false;
            listObj.dataBind();
            expect((<any>listObj).inputElement.getAttribute('readonly')).toEqual(null);//54
            listObj.destroy();
        });
        /**
         * enabled property
         */
        it('enabled ', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            listObj.enabled = false;
            listObj.dataBind();
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: null });
            expect((<any>listObj).overAllWrapper.classList.contains('e-disabled')).toEqual(true);//55
            expect((<any>listObj).inputElement.getAttribute('aria-disabled')).toEqual('true');
            expect((<any>listObj).inputElement.getAttribute('disabled')).not.toBe(null);
            listObj.value = ['JAVA'];
            listObj.dataBind();
            listObj.showPopup();
            setTimeout (function () {
                expect((<any>listObj).value[0]).toEqual('JAVA');
                listObj.enabled = true;
                listObj.dataBind();
                expect((<any>listObj).overAllWrapper.classList.contains('e-disabled')).toEqual(false);//55
                expect((<any>listObj).inputElement.getAttribute('aria-disabled')).toEqual('false');
                expect((<any>listObj).inputElement.getAttribute('disabled')).toBe(null);
                listObj.destroy();
                done();
            }, 500);
        });
        /**
         * Interaction automation.
         */
        it('Hover event validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.showPopup();
            let element1: HTMLElement = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            expect(element1.classList.contains(dropDownBaseClasses.hover)).toBe(false);
            mouseEventArgs.target = element1;
            mouseEventArgs.type = 'hover';
            (<any>listObj).onMouseOver(mouseEventArgs);
            expect(element1.classList.contains(dropDownBaseClasses.hover)).toBe(true);
            (<any>listObj).onMouseLeave();
            expect(element1.classList.contains(dropDownBaseClasses.hover)).toBe(false);
            listObj.enabled = false;
            (<any>listObj).onMouseOver(mouseEventArgs);
            expect(element1.classList.contains(dropDownBaseClasses.hover)).not.toBe(true);
            listObj.destroy();
        });
        // onMouseClick(e:MouseEvent)
        /**
         * Interaction automation.
         */
        it('select event validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, width: "10px" });
            listObj.appendTo(element);
            listObj.showPopup();
            let element1: HTMLElement = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            expect(element.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            mouseEventArgs.target = element1;
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(true);
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            let elements: HTMLElement[] = (<any>listObj).list.querySelectorAll('li[data-value]');
            for (let index: number = 0; index < elements.length; index++) {
                mouseEventArgs.target = elements[index];
                (<any>listObj).onMouseClick(mouseEventArgs);
            }
            (<any>listObj).onBlurHandler();
            (<any>listObj).windowResize();
            (<any>listObj).removeFocus();
            (<any>listObj).selectListByKey();
            listObj.destroy();
        });
        /**
         * Interaction automation. mouseClick for filtering
         */
        it('select event validation with mouse', () => {
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let element1: HTMLElement = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            mouseEventArgs.target = element1;
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(true);
            element1 = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            listObj.destroy();
        });
        it('filtering basic coverage', () => {
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            let element1: HTMLElement = (<any>listObj).list.querySelector('li[data-value="JAVA"]');
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            (<any>listObj).inputElement.value = "";
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            listObj.destroy();
        });
        it('filtering with same selected value', () => {
            listObj = new MultiSelect({
                hideSelectedItem: true,
                dataSource: datasource2,
                value: ['list1'],
                fields: { value: 'id', text: 'text' },
                allowFiltering: true
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).inputElement.value = "JA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).list.classList.contains(dropDownBaseClasses.noData)).toBe(false);
            listObj.destroy();
        });
        it('filtering with same selected value in Grouping', () => {
            let empList: { [key: string]: Object }[] = [
                { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
                { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
                { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
                { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
                { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
            ];
            listObj = new MultiSelect({
                hideSelectedItem: true,
                dataSource: empList,
                value: ['2'],
                fields: { value: 'eimg', text: 'text', groupBy: "country" },
                allowFiltering: true
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).inputElement.value = "Kap";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).list.classList.contains(dropDownBaseClasses.noData)).toBe(false);
            (<any>listObj).inputElement.value = "";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            (<any>listObj).value = ['1', '2', '3', '4', '5'];
            (<any>listObj).dataBind();
            listObj.hidePopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(false);
            (<any>listObj).value = ['1'];
            (<any>listObj).dataBind();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            listObj.destroy();
        });
        it('with out filtering in Grouping hide', () => {
            let empList: { [key: string]: Object }[] = [
                { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
                { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
                { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
                { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
                { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
            ];
            listObj = new MultiSelect({
                hideSelectedItem: true,
                dataSource: empList,
                value: ['2'],
                fields: { value: 'eimg', text: 'text', groupBy: "country" },
            });
            listObj.appendTo(element);
            //open action validation
            (<any>listObj).addValue('3', 'Erik Linden', mouseEventArgs);
            (<any>listObj).addValue('4', 'Kavi Tam', mouseEventArgs);
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            (<any>listObj).removeValue('3', mouseEventArgs);
            (<any>listObj).removeValue('4', mouseEventArgs);
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            listObj.destroy();
        });
        it('filtering basic coverage', () => {
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            (<any>listObj).inputElement.value = "JAVA!";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            let elem: HTMLElement[] = (<any>listObj).list.querySelectorAll('li.' + dropDownBaseClasses.focus);
            expect(elem.length).toBe(0);
            listObj.destroy();
        });
        it('filtering methode', () => {
            let listObj1: any = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    listObj1.filter(datasource, query);
                }
            });
            listObj1.appendTo(element);
            //open action validation
            listObj1.showPopup();
            (<any>listObj1).inputElement.value = "JAVA!";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 8;
            (<any>listObj1).keyDownStatus = true;
            (<any>listObj1).onInput();
            (<any>listObj1).keyUp(keyboardEventArgs);
            let elem: HTMLElement[] = (<any>listObj1).list.querySelectorAll('li.' + dropDownBaseClasses.focus);
            expect(elem.length).toBe(0);
            listObj1.destroy();
        });
        /*
         */
        /**
         * Interaction automation. mouseClick for filtering
         */
        it('select event validation with keyboard interaction', () => {
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            (<any>listObj).windowResize();
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let elem: HTMLElement[] = (<any>listObj).list.querySelectorAll('li.' + dropDownBaseClasses.li);
            expect(elem[0].classList.contains(dropDownBaseClasses.selected)).toBe(false);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 13;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[0].classList.contains(dropDownBaseClasses.selected)).toBe(true);
            listObj.maximumSelectionLength = 0;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            listObj.destroy();
        });
        /*
         */
        /**
         * Interaction automation. 
         */
        it('select event validation with keyboard interaction-Esc key-default', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, value: ['JAVA', 'Python'] });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).tempValues = listObj.value.slice();
            (<any>listObj).onMouseClick(mouseEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            expect(listObj.value.length).toBe(3);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value.length).toBe(2);
            expect((<any>listObj).chipCollectionWrapper.style.display).toBe('');
            listObj.destroy();
        });
        it('select event validation with keyboard interaction-Esc key-Box', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, value: ['JAVA', 'Python'], mode: 'Box' });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).tempValues = listObj.value.slice();
            (<any>listObj).onMouseClick(mouseEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            expect(listObj.value.length).toBe(3);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value.length).toBe(2);
            expect((<any>listObj).chipCollectionWrapper.style.display).toBe('');
            listObj.destroy();
        });
        it('select event validation with keyboard interaction-Esc key-Box no value interaction.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, mode: 'Box' });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value).toBe(null);
            listObj.destroy();
        });
        it('select event validation with keyboard interaction-Esc key-Delim', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, value: ['JAVA', 'Python'], mode: 'Delimiter' });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).tempValues = listObj.value.slice();
            (<any>listObj).onMouseClick(mouseEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            expect(listObj.value.length).toBe(3);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value.length).toBe(2);
            expect((<any>listObj).delimiterWrapper.style.display).toBe('');
            listObj.destroy();
        });
        /*
         */
        /**
         * Interaction automation. 
         */
        it('select event validation with keyboard interaction-Esc key-default', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource2, fields: { value: 'text', text: 'text' } });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).tempValues = listObj.value;
            (<any>listObj).onMouseClick(mouseEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            expect(listObj.value.length).toBe(1);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value.length).toBe(0);
            expect((<any>listObj).chipCollectionWrapper.style.display).toBe('');
            listObj.destroy();
        });
        it('select event validation with keyboard interaction-Esc key-Box', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, mode: 'Box' });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).tempValues = listObj.value;
            (<any>listObj).onMouseClick(mouseEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            expect(listObj.value.length).toBe(1);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value.length).toBe(0);
            expect((<any>listObj).chipCollectionWrapper.style.display).toBe('');
            listObj.destroy();
        });
        it('select event validation with keyboard interaction-Esc key-Delim', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, closePopupOnSelect: false, dataSource: datasource2, fields: { value: 'text', text: 'text' }, mode: 'Delimiter' });
            listObj.appendTo(element);
            //open action validation
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).tempValues = listObj.value;
            (<any>listObj).onMouseClick(mouseEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            expect(listObj.value.length).toBe(1);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value.length).toBe(0);
            expect((<any>listObj).delimiterWrapper.style.display).toBe('');
            listObj.destroy();
        });
        /**
         * Interaction automation.
         */
        it('clearALL event validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ['JAVA', 'PHP'] });
            listObj.appendTo(element);
            expect(listObj.value.length).toBe(2);
            (<any>listObj).clearAll({ preventDefault: function () { } });
            expect(listObj.value.length).toBe(0);
            listObj.value = ['JAVA', 'PHP'];
            listObj.enabled = false;
            listObj.dataBind();
            (<any>listObj).clearAll({ preventDefault: function () { } });
            listObj.value = ['JAVA', 'PHP'];
            listObj.enabled = true;
            listObj.dataBind();
            (<any>listObj).inputFocus = true;
            expect((<any>listObj).hiddenElement.multiple).toBe(true);
            expect((<any>listObj).hiddenElement.childNodes.length).toBe(2);//
            listObj.showPopup();
            (<any>listObj).clearAll({ preventDefault: function () { } });
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(listObj.value.length).toBe(0);
            expect((<any>listObj).hiddenElement.childNodes.length).toBe(0);
            listObj.destroy();
        });
        it('clearALL event validation-box', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ['JAVA', 'PHP'], mode: 'Box' });
            listObj.appendTo(element);
            expect(listObj.value.length).toBe(2);
            (<any>listObj).clearAll({ preventDefault: function () { } });
            expect(listObj.value.length).toBe(0);
            listObj.value = ['JAVA', 'PHP'];
            listObj.enabled = false;
            listObj.dataBind();
            (<any>listObj).clearAll({ preventDefault: function () { } });
            listObj.value = ['JAVA', 'PHP'];
            listObj.enabled = true;
            listObj.dataBind();
            (<any>listObj).inputFocus = true;
            expect((<any>listObj).hiddenElement.multiple).toBe(true);
            expect((<any>listObj).hiddenElement.childNodes.length).toBe(2);//
            listObj.showPopup();
            (<any>listObj).clearAll({ preventDefault: function () { } });
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(listObj.value.length).toBe(0);
            expect((<any>listObj).hiddenElement.childNodes.length).toBe(0);
            listObj.destroy();
        });
        //onChipRemove
        /**
         * Interaction automation.
         */
        it('clear event validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, mode: 'Box', fields: { text: "text", value: "text" }, value: ['JAVA', 'JAVA1', 'PHP'] });
            listObj.appendTo(element);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            expect(elem.parentElement).not.toBe(null);
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(elem.parentElement).toBe(null);//
            listObj.value = ['JAVA', 'JAVA1', 'PHP'];
            listObj.dataBind();
            listObj.showPopup();
            (<any>listObj).inputFocus = true;
            elem = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="PHP"]');
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(elem.parentElement).toBe(null);//
            expect((<any>listObj).isPopupOpen()).toBe(false);
            elem = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA1"]');
            expect(elem).toBe(null);
            listObj.destroy();
        });
        it('clearALL event validation-Delim', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ['JAVA', 'PHP'], mode: 'Delimiter' });
            listObj.appendTo(element);
            expect(listObj.value.length).toBe(2);
            (<any>listObj).clearAll({ preventDefault: function () { } });
            expect(listObj.value.length).toBe(0);
            listObj.value = ['JAVA', 'PHP'];
            listObj.enabled = false;
            listObj.dataBind();
            (<any>listObj).clearAll({ preventDefault: function () { } });
            listObj.value = ['JAVA', 'PHP'];
            listObj.enabled = true;
            listObj.dataBind();
            (<any>listObj).inputFocus = true;
            expect((<any>listObj).hiddenElement.multiple).toBe(true);
            expect((<any>listObj).hiddenElement.childNodes.length).toBe(2);//
            listObj.showPopup();
            (<any>listObj).clearAll({ preventDefault: function () { } });
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(listObj.value.length).toBe(0);
            expect((<any>listObj).hiddenElement.childNodes.length).toBe(0);
            listObj.destroy();
        });
        /**
         * Interaction automation.
         */
        it('List click event validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: true });
            listObj.appendTo(element);
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).not.toBe(null);
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).toBe(null);
            (<any>listObj).inputFocus = true;
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).not.toBe(null);
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).toBe(null);
            (<MultiSelect>listObj).setProperties({ readonly: true });
            (<any>listObj).wrapperClick(mouseEventArgs);
            expect((<any>listObj).popupObj.element.parentElement).toBe(null);
            listObj.destroy();
        });
        //expect((<any>listObj).overAllClear.style.display).not.toEqual(null);//46
        /**
         * Interaction automation.
         */
        it('List hover event validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: true, value: ["JAVA"] });
            listObj.appendTo(element);
            expect((<any>listObj).overAllClear.style.display).toBe('none');
            (<any>listObj).inputElement.value = 'a';
            (<any>listObj).mouseIn();
            expect((<any>listObj).overAllClear.style.display).toBe('');
            (<any>listObj).mouseOut();
            expect((<any>listObj).overAllClear.style.display).toBe('none');
            (<any>listObj).mouseIn();
            expect((<any>listObj).overAllClear.style.display).toBe('');
            (<any>listObj).inputFocus = true;
            (<any>listObj).mouseOut();
            expect((<any>listObj).overAllClear.style.display).not.toBe('none');
            (<any>listObj).overAllWrapper.style.width = "400px";
            (<any>listObj).showPopup();
            (<any>listObj).windowResize();
            expect((<any>listObj).popupWrapper.getBoundingClientRect().width).toBe(400);//32
            listObj.value = <string[]>[];
            listObj.dataBind();
            (<any>listObj).inputElement.value = '';
            (<any>listObj).mouseIn();
            expect((<any>listObj).overAllClear.style.display).toBe('none');
            listObj.enabled = false;
            listObj.dataBind();
            listObj.value = ['JAVA'];
            listObj.dataBind();
            (<any>listObj).windowResize();
            listObj.destroy();
        });
        /**
         * Keyboard Interaction automation.
         */
        it('Multiselect-Chip interaction validation', () => {
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: true, value: ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'],
                chipSelection: function (e: any) {
                    expect(e.name === "chipSelection").toBe(true);
                }
            });
            listObj.appendTo(element);
            let elem: HTMLElement[] = (<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips);
            //left Validation
            //with-out textbox has value validation
            keyboardEventArgs.keyCode = 37;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 1].classList.contains(multiSelectData.chipSelection)).toBe(true);//1
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 2].classList.contains(multiSelectData.chipSelection)).toBe(true);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 3].classList.contains(multiSelectData.chipSelection)).toBe(true);//3
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 4].classList.contains(multiSelectData.chipSelection)).toBe(true);//4
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 5].classList.contains(multiSelectData.chipSelection)).toBe(true);//5
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 5].classList.contains(multiSelectData.chipSelection)).toBe(true);//6
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 5].classList.contains(multiSelectData.chipSelection)).toBe(true);//7
            //right Validation
            keyboardEventArgs.keyCode = 39;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 4].classList.contains(multiSelectData.chipSelection)).toBe(true);//1
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 3].classList.contains(multiSelectData.chipSelection)).toBe(true);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 2].classList.contains(multiSelectData.chipSelection)).toBe(true);//3
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 1].classList.contains(multiSelectData.chipSelection)).toBe(true);//4
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(elem[elem.length - 5].classList.contains(multiSelectData.chipSelection)).toBe(false);//5
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chipSelection).length).toBe(0);//7
            //with textbox has value validation
            keyboardEventArgs.keyCode = 37;
            (<any>listObj).inputElement.value = "JAVA";
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chipSelection).length).toBe(0);//2
            keyboardEventArgs.keyCode = 39;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chipSelection).length).toBe(0);//2
            //validate the back-space key with content.
            keyboardEventArgs.keyCode = 8;
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(5);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(5);//2
            //validate the back-space key with out content.
            (<any>listObj).inputElement.value = '';
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(4);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);//2
            listObj.value = ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'];
            listObj.dataBind();
            keyboardEventArgs.keyCode = 37;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chipSelection).length).toBe(1);//2
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(5);//2
            keyboardEventArgs.keyCode = 46;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(4);//2
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chipSelection).length).toBe(0);//2
            keyboardEventArgs.keyCode = 37;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            keyboardEventArgs.keyCode = 46;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);//2
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chipSelection).length).toBe(1);//2
            (<any>listObj).inputElement.value = 'JAVA';
            listObj.value = <string[]>[];
            listObj.dataBind();
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            listObj.destroy();
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: true, value: ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'] });
            listObj.appendTo(element);
            mouseEventArgs.target = (<any>listObj).chipCollectionWrapper.querySelector('span.' + multiSelectData.chips);
            mouseEventArgs.type = 'click';
            (<any>listObj).chipClick(mouseEventArgs);
            let chipSelected = (<any>listObj).chipCollectionWrapper.querySelector('span.' + multiSelectData.chipSelection);
            expect(chipSelected).not.toEqual(null);
            listObj.setProperties({ enabled: false });
            (<any>listObj).chipClick(mouseEventArgs);
            chipSelected = (<any>listObj).chipCollectionWrapper.querySelector('span.' + multiSelectData.chipSelection);
            expect(chipSelected).not.toEqual(null);
            listObj.destroy();
        });
        /**
         * Keyboard Interaction automation for delim mode.
         */
        it('Multiselect-Chip interaction validation with delim mode', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, mode: 'Delimiter', closePopupOnSelect: true, value: ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'] });
            listObj.appendTo(element);
            //validate the back-space key with out content.
            expect((<any>listObj).delimiterWrapper.innerHTML).not.toBe('');
            (<any>listObj).removeChipSelection();
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).inputElement.value = '';
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).delimiterWrapper.innerHTML).toBe('');
            (<any>listObj).addValue("content", "212");
            listObj.value = <string[]>[];
            listObj.dataBind();
            (<any>listObj).onKeyDown(keyboardEventArgs);
            listObj.destroy();
        });

        /**
         * Keyboard Interaction automation for box mode.
         */
        it('Multiselect-Chip interaction validation- box mode with filtering', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, mode: 'Box', allowFiltering: true, closePopupOnSelect: true, value: ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'] });
            listObj.appendTo(element);
            keyboardEventArgs.keyCode = 8;
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(5);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(4);//2
            //validate the back-space key with out content.
            (<any>listObj).inputElement.value = '';
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);//2
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);//2
            listObj.destroy();
        });
        /**
         * Keyboard Interaction automation.
         */
        it('Multiselect-popup interaction validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: true, value: ['JAVA', 'Python', 'Oracle', 'HTML', 'PHP'] });
            listObj.appendTo(element);
            //open action validation
            keyboardEventArgs.altKey = true;
            keyboardEventArgs.keyCode = 40;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).not.toBe(null);
            //close action validation
            keyboardEventArgs.keyCode = 38;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 13;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            keyboardEventArgs.altKey = true;
            keyboardEventArgs.keyCode = 38;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            (<any>listObj).inputElement.value = "JAVA1";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 13;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            (<any>listObj).showPopup();
            keyboardEventArgs.keyCode = 27;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).toBe(null);
            listObj.destroy();
        });
        it('Multiselect-popup interaction validation', () => {
            let selectStatus: boolean = false;
            listObj = new MultiSelect({
                dataSource: datasource2,
                select: function () {
                    selectStatus = true;
                },
                fields: { text: "text", value: "text" }, hideSelectedItem: true, value: ['HTML', 'PHP']
            });
            listObj.appendTo(element);
            listObj.selectAll(true);
            listObj.showPopup();
            let element1: HTMLElement = <HTMLElement>(<any>listObj).ulElement.querySelector('li[data-value="PHP"]');
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 13;
            expect((<HTMLElement>(<any>listObj).ulElement.querySelector('li[data-value="HTML"]')).classList.contains('e-hide-listitem')).toBe(true);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(element1.classList.contains('e-hide-listitem')).toBe(true);
            expect(selectStatus).toBe(true);
            listObj.setProperties({ value: ['Python'] });
            expect((<HTMLElement>(<any>listObj).ulElement.querySelector('li[data-value="Python"]')).classList.contains('e-hide-listitem')).toBe(true);
            listObj.destroy();
        });
        /**
         * Keyboard Interaction automation.
         */
        it('Multiselect-List interaction validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: false });
            listObj.appendTo(element);
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 40;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).popupWrapper.parentElement).not.toBe(null);
            let elem: HTMLElement[] = (<any>listObj).list.querySelectorAll('li.' + dropDownBaseClasses.li);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus)).toBe(elem[1]);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus)).toBe(elem[2]);
            keyboardEventArgs.keyCode = 38;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus)).toBe(elem[0]);
            keyboardEventArgs.keyCode = 13;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listObj.value.length).toBe(1);
            keyboardEventArgs.keyCode = 35;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus)).toBe(elem[elem.length - 1]);
            keyboardEventArgs.keyCode = 36;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus)).toBe(elem[0]);
            listObj.destroy();
        });
        /**
         * Keyboard Interaction automation.
         */
        it('Multiselect input interaction validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: false });
            listObj.appendTo(element);
            (<any>listObj).showPopup();
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li[data-value="JAVA"]')).toBe((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus));
            (<any>listObj).inputElement.value = "Python";
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li[data-value="Python"]')).toBe((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus));
            listObj.destroy();
        });
        /**
         * Keyboard Interaction automation for the filtering.
         */
        it('Multiselect input interaction validation', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, closePopupOnSelect: false });
            listObj.appendTo(element);
            (<any>listObj).showPopup();
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li[data-value="JAVA"]')).toBe((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus));
            (<any>listObj).inputElement.value = "Python";
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).list.querySelector('li[data-value="Python"]')).toBe((<any>listObj).list.querySelector('li.' + dropDownBaseClasses.focus));
            listObj.destroy();
        });
        it('filtering Event - with Key interactions', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, value: ["JAVA"], placeholder: 'Select Dropdown', allowFiltering: true,
                filtering: function (e) {
                    checker = true;
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).keyUp(keyboardEventArgs);
            let coll = (<any>listObj).liCollections;
            (<any>listObj).liCollections = undefined;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            (<any>listObj).liCollections = coll;
            expect(checker).toBe(true);
            listObj.destroy();
        });
    });
    describe('Remote data binding - selectAll method', () => {
        let listObj: MultiSelect;
        let originalTimeout: number;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.body.innerHTML = '';
            document.body.appendChild(element);
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, query: new Query().take(4), fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        /**
        * remoteData binding with selectAll method
        */
        it('remoteData binding with selectAll method ', (done) => {
            listObj.selectAll(true);
            setTimeout(() => {
                (<any>listObj).moveByList(1);
                let elem: HTMLElement[] = (<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips);
                expect(elem.length).toBe(4);
                listObj.destroy();
                done();
            }, 800);
        });
    });
    describe('Remote data binding - with-out initial Value', () => {
        let listObj: MultiSelect;
        let originalTimeout: number;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.body.innerHTML = '';
            document.body.appendChild(element);
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, fields: { value: 'EmployeeID', text: 'FirstName' } });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('with-out initial Value ', (done) => {
            setTimeout(() => {
                let elem: HTMLElement[] = (<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips);
                expect(elem.length).toBe(0);
                listObj.destroy();
                done();
            }, 800);
        });
    });
    describe('Remote data binding - with-out keyboard list selection', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.body.innerHTML = '';
            document.body.appendChild(element);
            listObj = new MultiSelect({
                hideSelectedItem: true, dataSource: remoteData,
                fields: { value: 'EmployeeID', text: 'FirstName' },
                closePopupOnSelect: true,
            });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('with-out keyboard list selection with close popup on select ', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 13;
                (<any>listObj).onKeyDown(keyboardEventArgs);
                (<any>listObj).inputElement.value = "100";
                setTimeout(() => {
                    let elem: HTMLElement[] = (<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips);
                    expect(elem.length).toBe(1);
                    listObj.destroy();
                    done();
                }, 500)
            }, 500);
        });
    });
    describe('Remote data binding - action failure', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let remoteData1: DataManager = new DataManager({ url: '/api/dummy', adaptor: new ODataV4Adaptor });
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData1, value: [1004], fields: { value: 'text', text: 'text' } });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('no data text when ajax failure', (done) => {
            listObj.showPopup();
            setTimeout(() => {
                expect((<any>listObj).list.classList.contains('e-nodata')).toBe(true);
                listObj.dataSource = datasource;
                listObj.dataBind();
                expect((<any>listObj).list.classList.contains('e-nodata')).not.toBe(true);
                listObj.destroy();
                done();
            }, 800);
        });
    });
    describe('Remote data binding - validate API-Text', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ 
            url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
            adaptor: new WebApiAdaptor ,
            crossDomain: true
         });
        beforeAll((done) => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: 'Delimiter', fields: { text: "FirstName", value: "EmployeeID" }, value: [1] });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('validate item selection on render API-Text delim', (done) => {
            setTimeout(() => {
                let wrapper: HTMLElement = (<any>listObj).delimiterWrapper;
                if (wrapper && wrapper.textContent)
                    expect(wrapper.innerHTML).not.toEqual('');//34
                listObj.destroy();
                done();
            }, 800);
        });
    });
    describe('Remote data binding - validate API-Value box', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll((done) => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: 'Box', fields: { text: "FirstName", value: "EmployeeID" }, value: [1004], closePopupOnSelect: false });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('validate item selection on render API-Value box', (done) => {
            setTimeout(() => {
                let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
                if (wrapper && wrapper.firstElementChild)
                    expect(wrapper.firstElementChild.childNodes.length).toEqual(1);//34
                (<any>listObj).removeChip("checkers");
                (<any>listObj).removeSelectedChip();
                (<any>listObj).removeValue("JAVA");
                listObj.destroy();
                done();
            }, 800);
        });
    });
    describe('Remote data binding - validate API-Value', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ 
            url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
            adaptor: new WebApiAdaptor ,
            crossDomain: true
         });
        beforeAll((done) => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: 'Delimiter', fields: { text: "FirstName", value: "EmployeeID" }, value: [1] });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('validate item selection on render API-Value delim', (done) => {
            setTimeout(() => {
                let wrapper: HTMLElement = (<any>listObj).delimiterWrapper;
                if (wrapper && wrapper.textContent)
                    expect(wrapper.innerHTML).not.toEqual('');//34
                listObj.destroy();
                done();
            }, 800);
        });
    });
    describe('Remote data binding - allowCustomValue', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        /**
           * allowCustomValue.
          */
        it('allowCustomValue.-remote data', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: 'Box', fields: { value: 'EmployeeID', text: 'FirstName' }, allowCustomValue: true });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputFocus = true;
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            setTimeout(() => {
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).keyUp(keyboardEventArgs);
                setTimeout(() => {
                    expect((<any>listObj).liCollections.length).toBe(1);
                    expect((<any>listObj).value).toBe(null);
                    mouseEventArgs.target = (<any>listObj).liCollections[0];
                    mouseEventArgs.type = 'click';
                    (<any>listObj).onMouseClick(mouseEventArgs);
                    expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
                    listObj.destroy();
                    done();
                }, 2000);
            }, 800);
        });
        it('allowCustomValue.- remote data with filter', (done) => {
            let status: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: remoteData, popupHeight: "auto", mode: 'Box', fields: { value: 'EmployeeID', text: 'FirstName' },
                filtering: function (e) {
                    var query = new Query().select(['FirstName', "EmployeeID"]);
                    query = (e.text !== '') ? query.where('FirstName', 'startswith', e.text, true) : query;
                    e.updateData(remoteData, query);
                }, customValueSelection: function () {
                    status = true;
                }, allowCustomValue: true, allowFiltering: true
            });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputFocus = true;
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            setTimeout(() => {
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).keyUp(keyboardEventArgs);
                setTimeout(() => {
                    expect((<any>listObj).liCollections.length).toBe(1);
                    expect((<any>listObj).value).toBe(null);
                    mouseEventArgs.target = (<any>listObj).liCollections[0];
                    mouseEventArgs.type = 'click';
                    (<any>listObj).onMouseClick(mouseEventArgs);
                    expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
                    listObj.destroy();
                    expect(status).toBe(true);
                    done();
                }, 2000);
            }, 800);
        });
        it('allowCustomValue.-remote data without filter', (done) => {
            let status: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: remoteData, popupHeight: "auto", mode: 'Box', fields: { value: 'EmployeeID', text: 'FirstName' },
                customValueSelection: function () {
                    status = true;
                    this.remoteCustomValue = true;
                }, allowCustomValue: true
            });
            listObj.appendTo(element);
            (<any>listObj).remoteCustomValue = true;
            listObj.showPopup();
            (<any>listObj).inputFocus = true;
            (<any>listObj).inputElement.value = "RUBY";
            setTimeout(() => {
                expect(status).toBe(false);
                done();
            }, 800);
        });
    });
    describe('Remote data binding', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        /**
         * remoteData binding with index
         */
        it('with initial Value ', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, fields: { value: 'EmployeeID', text: 'FirstName' }, value: [1003] });
            listObj.appendTo(element);
            setTimeout(() => {
                (<any>listObj).moveByList(1);
                let elem: HTMLElement[] = (<any>listObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips);
                expect(elem.length).toBe(1);
                listObj.destroy();
                done();
            }, 800);
        });

        it('in-built filter', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: dataSource44, allowFiltering: true });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputFocus = true;
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(0);
            expect((<any>listObj).value).toBe(null);
            mouseEventArgs.target = (<any>listObj).liCollections[0];
            listObj.destroy();
        });

        it('value update with remote datasource.', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, value: [1004], fields: { value: 'text', text: 'text' } });
            listObj.appendTo(element);
            setTimeout(() => {
                listObj.value = ['JAVA'];
                expect(isNullOrUndefined((<any>listObj).list)).toBe(false);
                listObj.dataBind();
                listObj.destroy();
                done();
            }, 2000);
        });

    });
    //Validation for public methods.
    describe('Validation for public methods.', () => {
        let listObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        /**
         * getPersistData
         */
        it('getPersistData method ', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            listObj.appendTo(element);
            let stringItems: any = listObj.getPersistData();
            expect(stringItems.search('value')).toBe(2);
        });
        it('showPopup & hidePopup Method.', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
            (<any>listObj).getFormattedValue("samples");
            listObj.appendTo(element);
            let listWarapper: HTMLElement = <HTMLElement>document.querySelector("#multiselect_popup");
            listObj.hidePopup();
            expect((<any>listObj).popupWrapper.parentElement).toBeNull();//60
            listObj.showPopup();
            listWarapper = <HTMLElement>document.querySelector("#multiselect_popup");
            expect(listWarapper.parentElement).not.toBeNull();//59
            (<any>listObj).moveByTop(true);
            (<any>listObj).selectListByKey(keyboardEventArgs);
            listObj.hidePopup();
            expect(listWarapper.parentElement).toBeNull();//60
            listObj.hidePopup();
            expect(listWarapper.parentElement).toBeNull();//60
            listObj.destroy();
        });
        /**
         * destroy
         */
        // it('destroy method ', () => {
        //     listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2 });
        //     listObj.appendTo(element);
        //     listObj.destroy();
        //     setTimeout(() => {
        //     expect((<any>listObj)).toBe(null);//61
        //     }, 100);
        // });
        /**
         * selectAll
         */
        it('selectAll method ', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" } });
            listObj.appendTo(element);
            listObj.selectAll(true);//62
            expect(listObj.value.length).toBe(datasource2.length);
            listObj.selectAll(false);//63
            expect(listObj.value.length).toBe(0);
        });

    });
    describe('templating behavior validation', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
            { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
            { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
            { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
            { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Validation for the group template', () => {
            let listObj: MultiSelect = new MultiSelect({
                hideSelectedItem: false,
                dataSource: empList,
                fields: { text: 'text', groupBy: 'country' },
                headerTemplate: '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>',
                itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
                    '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
                valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                    '<span class="tempName"> ${text} </span></span>',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px'
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            expect('<div class="head">Photo<span style="padding-left:42px"> Contact Info </span></div>').toBe((<any>listObj).header.innerHTML);
            expect('<div class="Foot"> Total Items Count: 5 </div>').toBe((<any>listObj).footer.innerHTML);
            expect('<div><img class="eimg" src="../Employees/1.png" alt="employee"><div class="ename"> Mona Sak </div><div class="temp"> USA </div></div>').toBe((<any>listObj).ulElement.querySelector("li.e-list-item").innerHTML);
            mouseEventArgs.target = (<any>listObj).ulElement.querySelector("li.e-list-item");
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector("span.e-chipcontent");
            expect('<span><img class="tempImg" src="../Employees/1.png" height="20px" width="20px" alt="employee"><span class="tempName"> Mona Sak </span></span>').toBe(elem.innerHTML);
            mouseEventArgs.target = (<any>listObj).popupWrapper.querySelector(".head");
            (<any>listObj).onMouseClick(mouseEventArgs);
            listObj.destroy();
        });
        it('Footer template applied dynamically', () => {
            let listObj: MultiSelect = new MultiSelect({
                hideSelectedItem: false,
                dataSource: empList,
                fields: { text: 'text', groupBy: 'country' },
                itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
                '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                '<span class="tempName"> ${text} </span></span>',
                footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px'
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            listObj.headerTemplate = '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>';
            listObj.dataBind();
            expect('<div class="head">Photo<span style="padding-left:42px"> Contact Info </span></div>').toBe((<any>listObj).header.innerHTML);
            listObj.footerTemplate = '<div class="Foot"> Total Items Count: 5 </div>';
            listObj.dataBind();
            expect('<div class="Foot"> Total Items Count: 5 </div>').toBe((<any>listObj).footer.innerHTML);
            listObj.destroy();
        });
        it('Header template applied dynamically', () => {
            let listObj: MultiSelect = new MultiSelect({
                hideSelectedItem: false,
                dataSource: empList,
                fields: { text: 'text', groupBy: 'country' },
                itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
                '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                '<span class="tempName"> ${text} </span></span>',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px'
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            listObj.headerTemplate = '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>';
            listObj.dataBind();
            expect('<div class="head">Photo<span style="padding-left:42px"> Contact Info </span></div>').toBe((<any>listObj).header.innerHTML);
            listObj.footerTemplate = '<div class="Foot"> Total Items Count: 5 </div>';
            listObj.dataBind();
            expect('<div class="Foot"> Total Items Count: 5 </div>').toBe((<any>listObj).footer.innerHTML);
            listObj.destroy();
           
        });
    });
    //Validation for events.
    describe('Validation for events.', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('open & close Event', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, close: function () {
                    checker = true;
                }, open: function () {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect(checker).toBe(true);
            checker = false;
            listObj.hidePopup();
            expect(checker).toBe(true);
            listObj.destroy();
        });
        it('focus & blur Event.1', (done) => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, focus: function () {
                    checker = true;
                }, blur: function () {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            (<any>listObj).escapeAction();
            listObj.value = ['JAVA'];
            listObj.dataBind();
            listObj.showPopup();
            setTimeout( function() {
                (<any>listObj).focusAtLastListItem(null);
                (<any>listObj).focusInHandler();
                expect(checker).toBe(true);//64
                checker = false;
                (<any>listObj).onBlurHandler();
                (<any>listObj).focusAtLastListItem(null);
                expect(checker).toBe(true);//65
                (<any>listObj).onListMouseDown({ preventDefault: function () { } });
                (<any>listObj).onBlurHandler({ preventDefault: function () { } });
                expect((<any>listObj).scrollFocusStatus).toBe(false);
                listObj.destroy();
                done();
            }, 800);
        });
        it('focus & blur Event.2', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, mode: 'Box', focus: function () {
                    checker = true;
                }, blur: function () {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            (<any>listObj).focus();
            expect(checker).toBe(true);//64
            checker = false;
            (<any>listObj).onBlurHandler();
            expect(checker).toBe(true);//65
            listObj.destroy();
        });
        it('blur Event on focus on popup elements.', (done) => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2,
                mode: 'Box',
            });
            listObj.appendTo(element);
            listObj.open = function (args) {
                let mouseEventArgs: any = { preventDefault: function () { }, target: null, relatedTarget: (<any>listObj).popupObj.element };
                (<any>listObj).onBlurHandler(mouseEventArgs);
                expect((<any>listObj).isPopupOpen()).toBe(false);
                listObj.open = null;
                args.cancel = true;
                listObj.destroy();
                done();
            };
            listObj.showPopup();
        });
        it('focus & blur Event.3', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, mode: 'Delimiter', focus: function () {
                    checker = true;
                }, blur: function () {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            (<any>listObj).focusInHandler();
            expect(checker).toBe(true);//64
            checker = false;
            (<any>listObj).onBlurHandler();
            expect(checker).toBe(true);//65
            listObj.destroy();
        });
        it('change Event', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, change: function () {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            listObj.value = ["JAVA"];
            listObj.dataBind();
            expect(checker).toBe(true);//66
            listObj.destroy();
        });
        it('removed and removing Event', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ["JAVA"], removed: function () {
                    checker = true;
                }, removing: function () {
                    checker1 = true;
                }
            });
            listObj.appendTo(element);
            if ((<any>listObj).selectAll) {
                (<any>listObj).selectAll(false);
                expect(checker).toBe(true);//68
                expect(checker1).toBe(true);//67
            }
            else
                expect(false).toBe(true);
            listObj.destroy();
        });
        it('filtering Event - with default mode', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, value: ["JAVA"], allowFiltering: true,
                filtering: function (e) {
                    checker = true;
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect(checker).toBe(true);//69
            (<any>listObj).keyDownStatus = false;
            (<any>listObj).onInput();
            expect((<any>listObj).isValidKey).toBe(false);
            listObj.destroy();
        });
        it('filtering Event - with default mode without content search.', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, value: ["JAVA"], allowFiltering: true,
                filtering: function (e) {
                    checker = true;
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            (<any>listObj).inputElement.value = "";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect(checker).toBe(true);//69
            listObj.destroy();
        });
    });
    describe('Floating label', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource2,
                placeholder: 'Select ...',
                floatLabelType: 'Auto'
             });
             listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('floating-Auto: check floating to bottom - initial rendering', () => {
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
        });
        it('floating-Auto: check floating to top by focusing', () => {
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            (listObj as any).focusInHandler();
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
        });
        it('floating-Auto: check floating to bottom by focus out', () => {
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = document.body;
            (listObj as any).onDocumentClick(mouseEventArgs);
            (listObj as any).onBlurHandler(mouseEventArgs);
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
        });

        it('floating-Always: check floating to top when document click', () => {
            listObj.floatLabelType = 'Always';
            listObj.dataBind();
            mouseEventArgs.target = document.body;
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            (listObj as any).onBlurHandler(mouseEventArgs);
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe(null);//35
            }
            else
                expect(true).toBe(false);
        });

        it('floating-Never: check floating to top when document click', () => {
            listObj.floatLabelType = 'Never';
            listObj.dataBind();
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe('Select ...');//35
            }
            else
                expect(true).toBe(false);

            listObj.placeholder = 'Sample Check';
            listObj.dataBind();

            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe('Sample Check')//35
            }
            else
                expect(true).toBe(false);
        });
        it('floating-Auto: checking value property', () => {
            listObj.floatLabelType = 'Auto';
            listObj.value = ['HTML'];
            listObj.dataBind();
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
            listObj.value = <string[]>[];
            listObj.dataBind();
            floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
        });
        it('floating-Always: checking value property', () => {
            listObj.floatLabelType = 'Always';
            listObj.value = ['HTML'];
            listObj.dataBind();
            let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
            listObj.value = <string[]>[];
            listObj.dataBind();
            floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.classList.contains('e-label-bottom')).toBe(false);
            expect(floatElement.classList.contains('e-label-top')).toBe(true);
        });
        describe('Floating label - Always', () => {
            let listObj: MultiSelect;
            let popupObj: any;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
            beforeAll(() => {
                document.body.innerHTML = '';
                document.body.appendChild(element);
            });
            afterAll(() => {
                if (element) {
                    element.remove();
                }
            });
            it('floating-Always: check floating to top - initial rendering', () => {
                listObj = new MultiSelect({
                    dataSource: datasource2,
                    placeholder: 'Select ...',
                    floatLabelType: 'Always'
                 });
                 listObj.appendTo(element);
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
            });
            it('floating-Always: check floating to top by focusing', () => {
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                (listObj as any).focusInHandler();
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                listObj.destroy();
            });
            it('floating-Always: check floating to top - with value property', () => {
                listObj = new MultiSelect({
                    dataSource: datasource2,
                    placeholder: 'Select ...',
                    floatLabelType: 'Always',
                    value: ['HTML']
                 });
                listObj.appendTo(element);
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
            });
            it('floating-Always: check floating to top by focusing', () => {
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                (listObj as any).focusInHandler();
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                listObj.destroy();
            });
            it('floating-Always: check floating to top by clearing the value', () => {
                listObj.value = <string[]>[];
                setTimeout(() => {
                    listObj.dataBind();
                    let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                    expect(floatElement.classList.contains('e-label-bottom')).toBe(false);
                    expect(floatElement.classList.contains('e-label-top')).toBe(true);
                }, 100);
                listObj.destroy();
            });
        });
        describe('Floating label - Never', () => {
            let listObj: MultiSelect;
            let popupObj: any;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
            beforeAll(() => {
                document.body.innerHTML = '';
                document.body.appendChild(element);
            });
            afterAll(() => {
                if (element) {
                    element.remove();
                }
            });
            it('floating-Never', () => {
                listObj = new MultiSelect({
                    dataSource: datasource2,
                    placeholder: 'Select ...',
                    floatLabelType: 'Never'
                 });
                listObj.appendTo(element);
                let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
                if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                    expect((<any>listObj).inputElement.getAttribute("placeholder")).not.toBe(null)//35
                }
                else
                    expect(true).toBe(false);
    
                listObj.placeholder = 'Sample Check';
                listObj.dataBind();
    
                if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                    expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe('Sample Check')//35
                }
                else
                    expect(true).toBe(false);
            });
        });
        describe('Floating label - Never - checking with value', () => {
            let listObj: MultiSelect;
            let popupObj: any;
            let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
            beforeAll(() => {
                document.body.innerHTML = '';
                document.body.appendChild(element);
            });
            afterAll(() => {
                if (element) {
                    element.remove();
                }
            });
            it('floating-Never', () => {
                listObj = new MultiSelect({
                    dataSource: datasource2,
                    placeholder: 'Select ...',
                    floatLabelType: 'Never',
                    value: ['HTML']
                 });
                listObj.appendTo(element);
                let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
                if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                    expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe('')//35
                }
                else
                    expect(true).toBe(false);
    
                listObj.placeholder = 'Sample Check';
                listObj.dataBind();
    
                if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                    expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe('')//35
                }
                else
                    expect(true).toBe(false);
                listObj.value = <string[]>[];
                listObj.dataBind();
            });
            it('floating-Always: check floating to top when document click', () => {
                listObj.floatLabelType = 'Always';
                listObj.dataBind();
                mouseEventArgs.target = document.body;
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                (listObj as any).onBlurHandler(mouseEventArgs);
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
                if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                    expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe(null);//35
                }
                else
                    expect(true).toBe(false);
            });
            it('floating-Always: check focus in', () => {
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                (listObj as any).focusInHandler();
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
            });
            it('floating-Auto: check floating to bottom', () => {
                listObj.floatLabelType = 'Auto';
                listObj.dataBind();
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
            });
            it('floating-Auto: check floating to top by focusing', () => {
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                (listObj as any).focusInHandler();
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = document.body;
                (listObj as any).onDocumentClick(mouseEventArgs);
                (listObj as any).onBlurHandler(mouseEventArgs);
            });
            it('floating-Auto: with value', () => {
                listObj.value = ['HTML'];
                listObj.dataBind();
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
            });
            it('floating-Auto: with value focusIn', () => {
                (listObj as any).focusInHandler();
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = document.body;
                (listObj as any).onDocumentClick(mouseEventArgs);
                (listObj as any).onBlurHandler(mouseEventArgs);
            });
            it('floating-Auto: without value', () => {
                listObj.value = <string[]>[];
                listObj.dataBind();
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
            });
            it('floating-Auto: without value focus', () => {
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                floatElement.classList.add('e-label-bottom');
                (listObj as any).focusInHandler();
                floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-top')).toBe(true);
                expect(floatElement.classList.contains('e-label-bottom')).toBe(false);
            });
            it('floating-Auto: without value focusout', () => {
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = document.body;
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                floatElement.classList.add('e-label-top');
                (listObj as any).onDocumentClick(mouseEventArgs);
                (listObj as any).onBlurHandler(mouseEventArgs);
                floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                expect(floatElement.classList.contains('e-label-bottom')).toBe(true);
                expect(floatElement.classList.contains('e-label-top')).toBe(false);
          });
            it('floating-Always: check focus in', () => {
                let floatElement = (listObj as any).componentWrapper.querySelector('.e-float-text');
                listObj.placeholder = null;
                listObj.dataBind();
                let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
                if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                    expect((<any>listObj).inputElement.getAttribute("placeholder")).toBe(null)//35
                }
                else
                    expect(true).toBe(false);
               
            });
        });
    });
    describe('Spinner support', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let listObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'id' }, allowFiltering: true,
                popupHeight: '100px',
                value: ['list42'],
                filtering: function (e: any) {
                    let query = new Query();
                    query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                    e.updateData(data, query);
                }
            });
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it(' - spinner show instead of clear icon at initial time', () => {
            listObj.showPopup();
            listObj.mouseIn();
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect(isNullOrUndefined(listObj.overAllWrapper.querySelector('e-spinner-pane'))).toBe(true);
        })
    });

    describe('selectAll method', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let listObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'id' }, allowFiltering: true,
                popupHeight: '100px',
                filtering: function (e: any) {
                    let query = new Query();
                    query = (e.text != "") ? query.where("text", "startswith", e.text, true) : query;
                    e.updateData(data, query);
                }
            });
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        // it(' hidden element check', (done) => {
        //     listObj.open  = function () {
        //         listObj.selectAll(true);
        //         expect((<any>listObj).hiddenElement.querySelectorAll('option').length > 0).toBe(true);
        //         listObj.selectAll(false);
        //         expect((<any>listObj).hiddenElement.querySelectorAll('option').length === 0).toBe(true);
        //         listObj.value = ['lit2'];
        //         listObj.dataBind();
        //         expect((<any>listObj).hiddenElement.querySelectorAll('option').length === 1).toBe(true);
        //         listObj.hidePopup();
        //         listObj.open = null;
        //         done();

        //     };
        //     listObj.showPopup();
        // });

        // it(' select all item', (done) => {
        //     setTimeout(() => {
        //     listObj.showPopup();
        //     }, 100);
        //     setTimeout(() => {
        //         listObj.selectAll(true);
        //         expect((<any>listObj).hiddenElement.querySelectorAll('option').length === 11).toBe(true);
        //         done();
        //     }, 400);
        // })
    });
    describe('allowcustomvalue with template', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
            { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
            { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
            { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
            { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('allowCustomValue text field not update', () => {
            let listObj: MultiSelect = new MultiSelect({
                hideSelectedItem: false,
                dataSource: empList,
                fields: { text: 'text' },
                headerTemplate: '<div class="head">  Photo  <span style="padding-left:42px"> Contact Info </span></div>',
                itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
                    '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                footerTemplate: '<div class="Foot"> Total Items Count: 5 </div>',
                valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                    '<span class="tempName"> ${text} </span></span>',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
                allowCustomValue: true
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect('<div class="head">Photo<span style="padding-left:42px"> Contact Info </span></div>').toBe((<any>listObj).header.innerHTML);
            expect('<div class="Foot"> Total Items Count: 5 </div>').toBe((<any>listObj).footer.innerHTML);
            expect('<div><img class="eimg" src="../Employees/1.png" alt="employee"><div class="ename"> Mona Sak </div><div class="temp"> USA </div></div>').toBe((<any>listObj).ulElement.querySelector("li.e-list-item").innerHTML);
            (<any>listObj).inputElement.value = "RUBY";
            keyboardEventArgs.keyCode = 113;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            keyboardEventArgs.altKey = false;
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect((<any>listObj).listData[0].text === "RUBY").toBe(true);            
        });
    });
    // describe('chip coloring support', () => {
    //     let ele: HTMLElement = document.createElement('input');
    //     ele.id = 'newlist';
    //     let listObj: any;
    //     let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
    //     { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
    //     { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
    //     { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
    //     let isTagging: boolean;
    //     beforeAll(() => {
    //         document.body.appendChild(ele);
    //         listObj = new MultiSelect({
    //             hideSelectedItem: false,
    //             dataSource: data, fields: { text: 'text', value: 'id' }, allowFiltering: true,
    //             popupHeight: '100px',
    //             tagging: function (e: TaggingEventArgs) {
    //                 isTagging = true;
    //                 e.setClass((e.itemData as any)[listObj.fields.value]);
    //             }
    //         });
    //         listObj.appendTo('#newlist');
    //     });
    //     afterAll(() => {
    //         if (ele) {
    //             ele.remove();
    //         }
    //     })
    //     it(' set value as class to chip element in default mode', (done) => {
    //         listObj.value = ['list1'];
    //         listObj.dataBind();
    //         let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
    //         expect(isTagging).toBe(true);
    //         let element: HTMLElement = wrapper.querySelector('.list1');
    //         expect(!isNullOrUndefined(element)).toBe(true);
    //         isTagging = false;
    //         listObj.showPopup();
    //         setTimeout(() => {
    //             let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
    //             mouseEventArgs.target = list[2];
    //             mouseEventArgs.type = 'click';
    //             (<any>listObj).onMouseClick(mouseEventArgs);
    //             expect(isTagging).toBe(true);
    //             isTagging = false;
    //             let element: HTMLElement = wrapper.querySelector('.list3');
    //             expect(!isNullOrUndefined(element)).toBe(true);
    //             listObj.hidePopup();
    //             setTimeout(() => {
    //                 listObj.selectAll(false);
    //                 done();
    //             }, 400);
    //         }, 400);
    //     });

    //     it(' set value as class to chip element in box mode', (done) => {
    //         (listObj as MultiSelect).mode = 'Box';
    //         listObj.value = ['list1'];
    //         listObj.dataBind();
    //         let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
    //         expect(isTagging).toBe(true);
    //         let element: HTMLElement = wrapper.querySelector('.list1');
    //         expect(!isNullOrUndefined(element)).toBe(true);
    //         isTagging = false;
    //         listObj.showPopup();
    //         setTimeout(() => {
    //             let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
    //             mouseEventArgs.target = list[2];
    //             mouseEventArgs.type = 'click';
    //             (<any>listObj).onMouseClick(mouseEventArgs);
    //             expect(isTagging).toBe(true);
    //             let element: HTMLElement = wrapper.querySelector('.list3');
    //             expect(!isNullOrUndefined(element)).toBe(true);
    //             isTagging = false;
    //             listObj.hidePopup();
    //             setTimeout(() => {
    //                 listObj.selectAll(false);
    //                 done();
    //             }, 400);
    //         }, 400);
    //     });
    // });
    describe('nested data binding to fields', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let list: any;
        let ele: HTMLElement;
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let complexStringData: { [key: string]: Object; }[] = [
            {
                id: '01', list: { text: 'text1' }, iconCss: 'iconClass1',
                primaryKey: { code: '001' }
            },
            {
                id: '02', list: { text: 'text2' }, iconCss: undefined,
                primaryKey: { code: '002' }
            },
            {
                id: '03', list: { text: 'text3' }, iconCss: 'iconClass3',
                primaryKey: { code: '003' }
            },
        ];
        beforeAll(() => {
            ele = createElement('input', { id: 'MultiSelect' });
            document.body.appendChild(ele);
            list = new MultiSelect({
                hideSelectedItem: false,
                dataSource: complexStringData,
                fields: { text: 'list.text', value: 'primaryKey.code' },
                value: ['001']
            });
            list.appendTo(ele);
        });
        afterAll((done) => {
            list.hidePopup();
            setTimeout(() => {
                list.destroy();
                ele.remove();
                done();
            }, 450)
        });

        it('initially select the complex data of text and value fields', () => {
            expect(list.value[0] === '001').toBe(true);
            expect(list.text === 'text1').toBe(true);
        });
        // it('select the complex data of text and value fields while click on popup list', (done) => {
        //     list.showPopup();
        //     setTimeout(() => {
        //         if (list) {
        //             let item: HTMLElement[] = list.popupObj.element.querySelectorAll('li')[1];
        //             mouseEventArgs.target = item;
        //             mouseEventArgs.type = 'click';
        //             list.onMouseClick(mouseEventArgs);
        //             expect(list.value[1] === '002').toBe(true);
        //             expect(list.text === 'text1,text2').toBe(true);
        //             list.hidePopup();
        //             setTimeout(() => {
        //                 done()
        //             }, 400);
        //         }
        //     }, 400);
        // });
        // it('chipremove right click', () => {
        //     let listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, mode: 'Box', fields: { text: "text", value: "text" }, value: ['JAVA', 'JAVA1', 'PHP'] });
        //     listObj.appendTo(ele);
        //     let which: any = null;
        //     let button: any = null;
        //     let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
        //     (<any>listObj).onChipRemove({ which: 3, button: 2, target: elem.lastElementChild, preventDefault: function () { } });
        //     expect(elem.parentElement).not.toBe(null);
        //     listObj.destroy();
        // });
    });
    describe('Add item using addItem method in existing group item', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        let data: { [key: string]: Object }[] = [
        { "Vegetable": "Cabbage", "Category": "Leafy and Salad", "Id": "item1" },
        { "Vegetable": "Chickpea", "Category": "Beans", "Id": "item2" },
        { "Vegetable": "Garlic", "Category": "Bulb and Stem", "Id": "item3" },
        { "Vegetable": "Green bean", "Category": "Beans", "Id": "item4" },
        { "Vegetable": "Horse gram", "Category": "Beans", "Id": "item5" },
        { "Vegetable": "Nopal", "Category": "Bulb and Stem", "Id": "item6" }];
        let item: { [key: string]: Object }[] = [
        { "Vegetable": "brinjal", "Category": "Leafy and Salad", "Id": "item7" },
        { "Vegetable": "green gram", "Category": "Beans", "Id": "item8" }];
        beforeAll(() => {
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('Adding item in the existing group', () => {
            multiObj = new MultiSelect({
                dataSource: data, fields: { groupBy: 'Category', text: 'Vegetable', value: 'Id' },
                popupHeight: '100px',
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
            expect(multiObj.ulElement.querySelectorAll('li').length === 9).toBe(true);
            multiObj.addItem(item);
            expect(multiObj.ulElement.querySelectorAll('li').length === 11).toBe(true);
        });
    });
    describe('Add item using addItem method in new group item', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        let data: { [key: string]: Object }[] = [
        { "Vegetable": "Cabbage", "Category": "Leafy and Salad", "Id": "item1" },
        { "Vegetable": "Chickpea", "Category": "Beans", "Id": "item2" },
        { "Vegetable": "Garlic", "Category": "Bulb and Stem", "Id": "item3" },
        { "Vegetable": "Green bean", "Category": "Beans", "Id": "item4" },
        { "Vegetable": "Horse gram", "Category": "Beans", "Id": "item5" },
        { "Vegetable": "Nopal", "Category": "Bulb and Stem", "Id": "item6" }];
        let item: { [key: string]: Object }[] = [
        { "Vegetable": "brinjal", "Category": "Leafy and Salad", "Id": "item7" },
        { "Vegetable": "green gram", "Category": "Potato", "Id": "item8" }];
        beforeAll(() => {
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('filtering basic coverage', () => {
            multiObj = new MultiSelect({
                dataSource: data, fields: { groupBy: 'Category', text: 'Vegetable', value: 'Id' },
                popupHeight: '100px',
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
            expect(multiObj.ulElement.querySelectorAll('li').length === 9).toBe(true);
            multiObj.addItem(item);
            expect(multiObj.ulElement.querySelectorAll('li').length === 12).toBe(true);
        });
    });

    describe('mulitselect enable and refresh method', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'text' },
                popupHeight: '100px',
                value: ['JAVA', 'C#', 'C++'],
                enabled: false
            });
            multiObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('enabled the component', (done) => {
            multiObj.enabled = true,
                multiObj.showPopup();
            setTimeout(() => {
                expect(multiObj.list.getElementsByClassName('e-list-item e-active').length === 3).toBe(true);
                done();
            }, 400);
            multiObj.refresh();
        });
    });

    describe('EJ2-245633-ClearIcon is enabled while setting readonly property in mutliselect', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC', 'Java'],
                value: ['Java Script','Java'],
                readonly: true,
            });
            dropDowns.appendTo(element);
        });
        afterAll(() => {
            element.remove();
        });

        it('Check whether clear icon is disabled when read only is true', () => {
           dropDowns.focusInHandler();
           expect(dropDowns.overAllClear.style.display).toBe('none');
        });
    });

    describe('mulitselect chip remove change event', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'text' },
                popupHeight: '100px',
                value: ['JAVA', 'C#', 'C++'],
                mode: 'Box',
                change: function (e: any) {
                    expect(e.name === "change").toBe(true);
                    expect(e.element).not.toBe(null);
                }
            });
            multiObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('change event trigger', () => {
            let which: any = null;
            let button: any = null;
            multiObj.onBlurHandler(mouseEventArgs);
            let elem: HTMLElement = (<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            (<any>multiObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(elem.parentElement).toBe(null);
            multiObj.onBlurHandler(mouseEventArgs);
        });
    });

    describe('add the zIndex property', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'text' },
                popupHeight: '100px',
                zIndex: 1234
            });
            multiObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('check zindex on popup open', (done) => {
            multiObj.showPopup();
            setTimeout(() => {
                expect(multiObj.popupObj.element.style.zIndex === '1234').toBe(true);
                multiObj.zIndex = 1333;
                multiObj.dataBind();
                expect(multiObj.popupObj.element.style.zIndex === '1333').toBe(true);
                done();
            }, 400);
        });
    });
    describe('mulitselect chip select event-EJ2-7802', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: data, fields: { text: 'text', value: 'text' },
                popupHeight: '100px',
                value: ['JAVA', 'C#', 'C++'],
                mode: 'Box',
                chipSelection: function (e: any) {
                    expect(e.name === "chipSelection").toBe(true);
                }
            });
            multiObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('chip select event trigger', () => {
            (<any>multiObj).dispatchEvent(multiObj.chipCollectionWrapper.firstElementChild, 'mousedown');
            expect(multiObj.value.length).toBe(3);
        });
    });
    describe('Validation for events args.cancel', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('removing Event args.cancel', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ["JAVA"],
                mode: 'Box',
                removing: function (e: any) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                }
            });
            listObj.appendTo(element);
            (<any>listObj).removeValue('JAVA', mouseEventArgs);
            listObj.destroy();
        });
        it('tagging Event args.cancel', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { text: "text", value: "text" }, value: ["JAVA"],
                mode: 'Box',
                tagging: function (e: any) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                }
            });
            listObj.appendTo(element);
            listObj.destroy();
        });
        it('filtering Event args.cancel', () => {
            let checker: boolean = false, checker1: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, value: ["JAVA"], allowFiltering: true,
                filtering: function (e: any) {
                    checker = true;
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo(element);
            (<any>listObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            listObj.destroy();
        });
        it('customvalueselection args.cancel.', () => {
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, fields: { text: 'text', value: 'text' },
                allowCustomValue: true,
                customValueSelection: function (e: any) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                }, value: ['PHP']
            });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).inputElement.value = "RUBY";
            //open action validation
            keyboardEventArgs.keyCode = 113;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(1);
            expect((<any>listObj).value.length).toBe(1);
            mouseEventArgs.target = (<any>listObj).liCollections[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            listObj.destroy();
        });
        it('open event args.cancel', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, close: function () {
                    checker = true;
                }, open: function (e) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                    checker = true;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            listObj.destroy();
        });
        it('close event args.cancel', () => {
            let checker: boolean = false;
            listObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2,
                close: function (e) {
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                    checker = true;
                }, open: function (e) {
                    checker = true;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            listObj.hidePopup();
            listObj.destroy();
        });
        it('select event args.cancel', () => {
            let selectStatus: boolean = false;
            listObj = new MultiSelect({
                dataSource: datasource2,
                select: function (e: any) {
                    selectStatus = true;
                    expect(e.cancel).toBe(false);
                    e.cancel = true;
                },
                fields: { text: "text", value: "text" }, hideSelectedItem: true
            });
            listObj.appendTo(element);
            listObj.showPopup();
            let element1: HTMLElement = <HTMLElement>(<any>listObj).ulElement.querySelector('li[data-value="PHP"]');
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 13;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(element1.classList.contains('e-hide-listitem')).toBe(false);
            listObj.destroy();
        });
    });
    describe('ignoreAccent support', () => {
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        let comboObj: any;
        let activeElement: HTMLElement[];
        let e: any = { preventDefault: function () { }, target: null };
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'autocomplete' });
        let data: string[] = ['Åland', ' à propos', 'abacá'];
        beforeAll(() => {
            document.body.appendChild(element);
            comboObj = new MultiSelect({
                dataSource: data,
                ignoreAccent: true,
                allowFiltering: true
            });
            comboObj.appendTo(element);
        });
        afterAll(() => {
            comboObj.destroy();
            element.remove();
        });

        it('search diacritics data', (done) => {
            comboObj.showPopup();
            comboObj.inputElement.value = 'ä';
            keyEventArgs.keyCode = 67;
            comboObj.onKeyDown(keyEventArgs);
            comboObj.onInput();
            comboObj.keyUp(keyEventArgs);
            setTimeout(() => {
                let item: HTMLElement[] = comboObj.popupObj.element.querySelectorAll('li');
                expect(item.length === 2).toBe(true);
                mouseEventArgs.target = item[0];
                mouseEventArgs.type = 'click';
                comboObj.onMouseClick(mouseEventArgs);
                expect(comboObj.value[0] === 'Åland').toBe(true);
                expect(comboObj.text === 'Åland').toBe(true);
                comboObj.hidePopup();
                setTimeout(() => {
                    done()
                }, 400);
            }, 400);
        });
    });
    describe('mulitselect datasource load dynamically with allowcustom value-CR-issue', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: ['c'], fields: { text: 'text', value: 'text' },
                popupHeight: '100px',
                allowCustomValue: true,
            });
            multiObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('CR-issue EJ2-7929', () => {
            expect(multiObj.dataSource.length).toBe(1);
            multiObj.dataSource = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'];
            multiObj.dataBind();
            expect(multiObj.dataSource.length).toBe(5);
            multiObj.destroy();
        });
    });
    describe('mulitselect value set null dynamically', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            multiObj = new MultiSelect({
                hideSelectedItem: false,
                dataSource: ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'], fields: { text: 'text', value: 'text' },
                popupHeight: '100px',
                value: ['Cricket', 'Golf'],
                allowCustomValue: true,
            });
            multiObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('value set null', () => {
            expect(multiObj.value.length).toBe(2);
            multiObj.value = null;
            multiObj.dataBind();
            expect(multiObj.value).toBe(null);
            multiObj.destroy();
        });
    });
    describe('mulitselect openOnClick API validation', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('openOnClick', () => {
            let multiObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, openOnClick: false, mode: 'Box', fields: { value: 'text', text: 'text' }, allowFiltering: true,
                filtering: function (e) {
                    let query: Query = new Query().select(['text', 'id']);
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            multiObj.appendTo('#newlist');
            //open action validation
            let elem: HTMLElement = (<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="JAVA"]');
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = (<any>multiObj).overAllWrapper;
            (<any>multiObj).wrapperClick(mouseEventArgs);
            (<any>multiObj).renderPopup();
            expect(document.body.contains((<any>multiObj).popupObj.element)).toBe(false);
            (<any>multiObj).inputElement.value = "JAVA";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>multiObj).keyDownStatus = true;
            (<any>multiObj).onInput();
            (<any>multiObj).keyUp(keyboardEventArgs);
            expect(document.body.contains((<any>multiObj).popupObj.element)).toBe(true);
            let element1: HTMLElement = (<any>multiObj).list.querySelector('li[data-value="JAVA"]');
            expect(element1.classList.contains(dropDownBaseClasses.selected)).toBe(false);
            (<any>multiObj).inputElement.value = "";
            keyboardEventArgs.keyCode = 70;
            (<any>multiObj).keyDownStatus = true;
            (<any>multiObj).onInput();
            (<any>multiObj).keyUp(keyboardEventArgs);
            expect(document.body.contains((<any>multiObj).popupObj.element)).toBe(false);
            multiObj.destroy();
        });
    });
    describe('Remote data binding value set dynamically', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ 
            url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
            adaptor: new WebApiAdaptor ,
            crossDomain: true
         });
        beforeAll((done) => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: 'Delimiter', fields: { text: "FirstName", value: "EmployeeID" } });
            listObj.appendTo(element);
            done();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('value set dyanamically', (done) => {
            listObj.value = [1];
            listObj.dataBind();
            setTimeout(() => {
                expect(listObj.value.length).toBe(1);
                done();
            }, 800);
        });
    });
    describe('list items focus', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('wrongly focused item', () => {
            let multiObj = new MultiSelect({
                hideSelectedItem: false, dataSource: datasource2, mode: 'Box', fields: { value: 'text', text: 'text' }
            });
            multiObj.appendTo('#newlist');
            //open action validation
            (<any>multiObj).inputElement.value = 'data';
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>multiObj).keyDownStatus = true;
            (<any>multiObj).onInput();
            (<any>multiObj).keyUp(keyboardEventArgs);
            let element1: HTMLElement = (<any>multiObj).list.querySelector('.e-list-item.e-item-focus');
            expect((<any>multiObj).list.querySelector('.e-list-item.e-item-focus')).toBe(null);
            (<any>multiObj).inputElement.focus();
            (<any>multiObj).inputElement.value = '';
            keyboardEventArgs.keyCode = 8;
            (<any>multiObj).keyDownStatus = true;
            (<any>multiObj).onKeyDown(keyboardEventArgs);
            (<any>multiObj).keyUp(keyboardEventArgs);
            multiObj.destroy();
        });
    });


    describe('dataBound event - no items selection in initial rendering', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it('Should not trigger the dataBound event when no item is set in initial rendering- local bind', () => {
            let isDataBound: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: datasource,
                fields: { value: 'id', text: 'text' },
                dataBound: () => {
                    isDataBound = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isDataBound).toBe(false);
        });
        it('Should not trigger the dataBound event when no item is set in initial rendering- remote bind', (done) => {
            let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
            let isDataBound: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: remoteData,
                fields: { value: 'FirstName' },
                dataBound: () => {
                    isDataBound = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isDataBound).toBe(false);
            setTimeout(() => {
                expect(isDataBound).toBe(false);
                done();
            }, 800);
        });
    });

    describe('dataBound event - items selection in initial rendering', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
        let dropDowns: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            dropDowns.destroy();
            element.remove();
        });

        it('trigger the dataBound event when item is set in initial rendering- local bind', () => {
            let isDataBound: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: datasource,
                fields: { value: 'id', text: 'text' },
                value: ['list1'],
                dataBound: () => {
                    isDataBound = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isDataBound).toBe(true);
        });
        it('trigger the dataBound event when item is set in initial rendering- remote bind', (done) => {
            let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
            let isDataBound: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: remoteData,
                fields: { value: 'FirstName' },
                value: ['Nancy'],
                dataBound: () => {
                    isDataBound = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isDataBound).toBe(false);
            dropDowns.showPopup();
            setTimeout(() => {
                expect(isDataBound).toBe(true);
                done();
            }, 800);
        });
    });

    describe('event args.cancel', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
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

        it(' filtering event', (done) => {
            dropDowns = new MultiSelect({
                dataSource: datasource,
                allowFiltering: true,
                fields: { value: 'id', text: 'text' },
                filtering: (e: FilteringEventArgs) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'JAVA';
            e.keyCode = 72;
            dropDowns.keyDownStatus = true;
            dropDowns.onInput();
            dropDowns.keyUp(e);
            setTimeout(() => {
                expect(dropDowns.list.querySelectorAll("li").length > 0).toBe(true);
                done();
            }, 500);
        });
    });
    describe('remote data : actionBegin event args.cancel', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
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
        it(' actionBegin event', (done) => {
            let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
            dropDowns = new MultiSelect({
                dataSource: remoteData,
                allowFiltering: true,
                fields: { value: 'FirstName' },
                actionBegin: (e: any) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'Nancy';
            e.keyCode = 72;
            dropDowns.keyDownStatus = true;
            dropDowns.onInput();
            dropDowns.keyUp(e);
            setTimeout(() => {
                expect(dropDowns.list.querySelectorAll("li").length).toBe(0);
                done();
            }, 800);
        });
    });

    describe('remote data :actionComplete event args.cancel', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
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


        it(' actionComplete event', (done) => {
            let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
            dropDowns = new MultiSelect({
                dataSource: remoteData,
                allowFiltering: true,
                fields: { value: 'FirstName' },
                actionComplete: (e: any) => {
                    e.cancel = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.inputElement.value = 'Nancy';
            e.keyCode = 72;
            dropDowns.keyDownStatus = true;
            dropDowns.onInput();
            dropDowns.keyUp(e);
            setTimeout(() => {
                expect(dropDowns.list.querySelectorAll("li").length).toBe(0);
                done();
            }, 800);
        });
    });

    describe('itemCreated fields event', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
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

        it(' set disable to first item', (done) => {
            let count: number = 0;
            dropDowns = new MultiSelect({
                dataSource: datasource,
                allowFiltering: true,
                fields: <Object>{
                    value: 'text', itemCreated: (e: any) => {
                        if (count === 0) {
                            e.item.classList.add('e-disabled');
                        }
                    }
                }
            });
            dropDowns.appendTo(element);
            dropDowns.renderPopup();
            dropDowns.inputElement.value = 'J';
            e.keyCode = 72;
            dropDowns.keyDownStatus = true;
            dropDowns.onInput();
            dropDowns.keyUp(e);
            setTimeout(() => {
                expect(dropDowns.list.querySelectorAll('li')[0].classList.contains('e-disabled')).toBe(true);
                done();
            }, 500);
        });

    });

    describe('created and destroy event', () => {
        let mouseEventArgs: any = { which: 3, button: 2, preventDefault: function () { }, target: null };
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

        it(' trigger create event after component rendering', () => {
            let isCreated: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: datasource,
                fields: {
                    value: 'text'
                },
                created: () => {
                    isCreated = true;
                }
            });
            dropDowns.appendTo(element);
            expect(isCreated).toBe(true);
        });
        it(' trigger destroyed event after component destroy', (done) => {
            let isDestroy: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: datasource,
                fields: {
                    value: 'text'
                },
                destroyed: () => {
                    isDestroy = true;
                }
            });
            dropDowns.appendTo(element);
            dropDowns.destroy();
            setTimeout(() => {
                expect(isDestroy).toBe(true);
                done();
            }, 200);
        });

    });
    describe('popupHeight changed dynamically', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
        });

        it('popupHeight changes', (done) => {
            let isCreated: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: datasource,
                fields: {
                    value: 'text'
                }
            });
            dropDowns.appendTo(element);
            dropDowns.popupHeight = '600px';
            dropDowns.dataBind();
            dropDowns.showPopup();
            setTimeout(() => {
                expect(dropDowns.popupWrapper.style.maxHeight === '600px').toBe(true);
                dropDowns.destroy();
                done();
            }, 200);
        });
    });


    describe(' bug(EJ2-9000): value with space issue in hidden element', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' check the selected value in hidden element', () => {
            let isCreated: boolean = false;
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                value: ['Java Script']
            });
            dropDowns.appendTo(element);
            expect(dropDowns.hiddenElement.value === 'Java Script').toBe(true);
            dropDowns.destroy();
        });
    });

    describe(' bug(EJ2-8805): htmlAttributes properties are set into disabled input element.', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input');
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' set the attributes to corresponding element', () => {
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                htmlAttributes: { title: "Select Multiple value", id: 'dropdown', form: "formname" }
            });
            dropDowns.appendTo(element);
            expect(dropDowns.hiddenElement.getAttribute('form') === 'formname').toBe(true);
            expect(dropDowns.element.getAttribute('id') === 'dropdown').toBe(true);
            expect(dropDowns.overAllWrapper.getAttribute('title') === 'Select Multiple value').toBe(true);
            dropDowns.destroy();
        });
        it(' set the inbuilt validation attributes in input', () => {
            element.setAttribute('required', 'true');
            element.setAttribute('form', 'formName');
            element.setAttribute('aria-required', 'required');
            let dropDowns1: any = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC']
            });
            dropDowns1.appendTo(element);
            expect(dropDowns1.hiddenElement.getAttribute('required') === 'true').toBe(true);
            expect(dropDowns1.hiddenElement.getAttribute('form') === 'formName').toBe(true);
            expect(dropDowns1.hiddenElement.getAttribute('aria-required') === 'required').toBe(true);
            dropDowns1.destroy();
        });
    });
    describe('page up first list item focus', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('first list item focus', (done) => {
            let multiObj = new MultiSelect({
                hideSelectedItem: true, dataSource: datasource2, mode: 'Box', fields: { value: 'text', text: 'text' }, value: ['PHP', 'HTML']
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
            setTimeout(() => {
                expect((<any>multiObj).isPopupOpen()).toBe(true);
                keyboardEventArgs.keyCode = 34;
                (<any>multiObj).onKeyDown(keyboardEventArgs);
                expect(multiObj.ulElement.querySelectorAll('li.e-item-focus')[0].textContent === "Oracle").toBe(true);
                keyboardEventArgs.keyCode = 33;
                (<any>multiObj).onKeyDown(keyboardEventArgs);
                expect(multiObj.ulElement.querySelectorAll('li.e-item-focus')[0].textContent === "PERL").toBe(true);
                (<any>multiObj).destroy();
                done();
            }, 450);
        });
    });
    describe('cutom value', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('custom value not added initial rendering box mode', () => {
            let multiObj = new MultiSelect({
                hideSelectedItem: true, enablePersistence: true, allowCustomValue: true, dataSource: datasource2, mode: 'Box', fields: { value: 'text', text: 'text' }, value: ['PdsadaHP', 'HTML']
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
                expect((<any>multiObj).isPopupOpen()).toBe(true);
                expect((<any>multiObj).value.length).toBe(2);
                expect((<any>multiObj).value[0] === 'PdsadaHP').toBe(true);
                (<any>multiObj).destroy();
        });
        it('custom value not added initial rendering Delimiter mode', () => {
            let multiObj = new MultiSelect({
                hideSelectedItem: true, enablePersistence: true, allowCustomValue: true, dataSource: datasource2, mode: 'Delimiter', fields: { value: 'text', text: 'text' }, value: ['PdsadaHP', 'HTML']
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
                expect((<any>multiObj).isPopupOpen()).toBe(true);
                expect((<any>multiObj).value.length).toBe(2);
                expect((<any>multiObj).value[0] === 'PdsadaHP').toBe(true);
                (<any>multiObj).destroy();
        });
        it('custom value not added initial rendering Default mode', () => {
            let multiObj = new MultiSelect({
                hideSelectedItem: true, enablePersistence: true, allowCustomValue: true, dataSource: datasource2, mode: 'Default', fields: { value: 'text', text: 'text' }, value: ['PdsadaHP', 'HTML']
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
                expect((<any>multiObj).isPopupOpen()).toBe(true);
                expect((<any>multiObj).value.length).toBe(2);
                expect((<any>multiObj).value[0] === 'PdsadaHP').toBe(true);
                (<any>multiObj).destroy();
        });
    });
    describe('dynamic change sortorder', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let multiObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it('sortorder changed', () => {
            let multiObj = new MultiSelect({
                dataSource: datasource2, mode: 'Delimiter', fields: { value: 'text', text: 'text' }, allowFiltering: true
            });
            multiObj.appendTo('#newlist');
            multiObj.showPopup();
            expect((<any>multiObj).isPopupOpen()).toBe(true);
            multiObj.hidePopup();
            expect((<any>multiObj).isPopupOpen()).toBe(false);
            multiObj.sortOrder = 'Descending';
            multiObj.dataBind();
            multiObj.showPopup();
            expect(multiObj.ulElement.querySelector('li').textContent === 'Python').toBe(true);
            multiObj.hidePopup();
            multiObj.sortOrder = 'Ascending';
            multiObj.dataBind();
            multiObj.showPopup();
            expect(multiObj.ulElement.querySelector('li').textContent === 'HTML').toBe(true);
            (<any>multiObj).destroy();
        });
    });
    
    describe(' bug(EJ2-8830): Popup is not closed  while press the tab key.', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' close the popup while press the tab key', (done) => {
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                value: ['Java Script']
            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                expect(dropDowns.isPopupOpen()).toBe(true);
                keyboardEventArgs.keyCode = 9;
                dropDowns.onKeyDown(keyboardEventArgs);
                setTimeout(() => {
                    expect(dropDowns.isPopupOpen()).toBe(false);
                    dropDowns.destroy();
                    done();
                }, 450)
            }, 450);
        });
    });

    describe(' bug(EJ2-8802): No Records data is visible after clear the selected value.', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        let dropDowns: any;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
            document.body.innerHTML='';
        });

        it(' close the popup while press the tab key', (done) => {
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            dropDowns = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                value: ['Java Script'],
                allowFiltering: true

            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                dropDowns.inputElement.value = "C#";
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 70;
                dropDowns.keyDownStatus = true;
                dropDowns.onInput();
                dropDowns.keyUp(keyboardEventArgs);
                expect(dropDowns.list.classList.contains(dropDownBaseClasses.noData)).toBe(true);
                dropDowns.clearAll(keyboardEventArgs);
                expect(dropDowns.list.classList.contains(dropDownBaseClasses.noData)).toBe(false);
                dropDowns.destroy();
                done();
            }, 450);

        });
    });

    describe(' bug(EJ2-8836): MultiSelect not focusout while double click on header and then click on document', () => {
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdown' });
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            element.remove();
        });

        it(' Close the popup while click on document', (done) => {
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            let dropDowns: any = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                value: ['Java Script'],
                allowFiltering: true
            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = document.body;
                dropDowns.inputElement.focus();
                dropDowns.onDocumentClick(mouseEventArgs);
                dropDowns.onBlurHandler(mouseEventArgs);
                setTimeout(() => {
                    expect(dropDowns.isPopupOpen()).toBe(false);
                    dropDowns.destroy();
                    done();
                }, 450);
            }, 450);

        });
        it(' Close the popup while click on inner element', (done) => {
            Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
            let keyEventArgs: any = { preventDefault: (): void => { }, action: 'down' };
            let dropDowns: any = new MultiSelect({
                dataSource: ['Java Script', 'AS.NET MVC'],
                value: ['Java Script'],
                allowFiltering: true,

            });
            dropDowns.appendTo(element);
            dropDowns.showPopup();
            setTimeout(() => {
                mouseEventArgs.type = 'click';
                mouseEventArgs.target = dropDowns.list;
                dropDowns.inputElement.focus();
                dropDowns.onDocumentClick(mouseEventArgs);
                dropDowns.onBlurHandler(mouseEventArgs);
                setTimeout(() => {
                    expect(dropDowns.isPopupOpen()).toBe(true);
                    dropDowns.destroy();
                    Browser.userAgent = navigator.userAgent;
                    done();
                }, 450)
            }, 450);
        });
    });
    describe('GetItems related bug', () => {
        let element: HTMLInputElement;
        let element1: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: MultiSelect;
        let ddl1: MultiSelect;
        let remoteData: DataManager = new DataManager({ url: '/api/Employee', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
            element1 = <HTMLInputElement>createElement('input', { id: 'multiSelect1' });
            document.body.appendChild(element1);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            ddl = new MultiSelect({
                dataSource: data
            });
            ddl.appendTo(element);
            expect(ddl.getItems().length).toBe(2);
        });
    });
    describe('Boolean value support', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: any;
        let jsonData: { [key: string]: Object; }[] = [{'id': false, 'text': 'failure'},{'id': true,
        'text': 'success'}];
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('select boolean value', () => {
            ddl = new MultiSelect({
                dataSource: data,
                value: [true]
            });
            ddl.appendTo(element);
            expect(ddl.value[0]).toBe(true);
            expect(ddl.text).toBe('true');
            expect(ddl.getDataByValue(true)).toBe(true);
        });
        it('set boolean value in dynamic way', () => {
            ddl = new MultiSelect({
                dataSource: data
            });
            ddl.appendTo(element);
            ddl.setProperties({value:[false]});
            expect(ddl.value[0]).toBe(false);
            expect(ddl.text).toBe('false');
            expect(ddl.getDataByValue(false)).toBe(false);
        });
        it('select boolean value', () => {
            ddl = new MultiSelect({
                dataSource: jsonData,
                fields: {text: 'text', value: 'id'},
                value: [true]
            });
            ddl.appendTo(element);
            expect(ddl.value[0]).toBe(true);
            expect(ddl.text).toBe('success');
            expect(ddl.getDataByValue(true).text).toBe('success');
        });
        it('set boolean value in dynamic way', () => {
            ddl= new MultiSelect({
                dataSource: jsonData,
                fields: {text: 'text', value: 'id'}
            });
            ddl.appendTo(element);
            ddl.setProperties({value:[false]});
            expect(ddl.value[0]).toBe(false);
            expect(ddl.text).toBe('failure');
            expect(ddl.getDataByValue(false).text).toBe('failure');
        });
    });
    describe('Check beforeopen event', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: MultiSelect;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the items', () => {
            ddl = new MultiSelect({
                dataSource: data,
                beforeOpen: (): void => {
                    expect(true).toBe(true);
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();
        });
    });
    describe('Disabled with showpopup public method', () => {
        let element: HTMLInputElement;
        let data: boolean[] = [ true, false ];
        let ddl: any;
        let isOpen: boolean = false;
        let jsonData: { [key: string]: Object; }[] = [{'id': false, 'text': 'failure'},{'id': true,
        'text': 'success'}];
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('check popup open', () => {
            ddl = new MultiSelect({
                dataSource: data,
                value: [true],
                enabled: false,
                open: (): void => {
                    isOpen = true;
                }
            });
            ddl.appendTo(element);
            ddl.showPopup();
            expect(isOpen).toBe(false);
        });
    });
    describe('Check SelectedAll event', () => {
        let element: HTMLInputElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' }, 
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' }
        ];
        let ddl: MultiSelect;
        let isSeleted: boolean = true;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiselect1' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check event raisedd for select and deselect', () => {
            ddl = new MultiSelect({
                dataSource: data,
                fields: { text: "text", value: "text" },
                showSelectAll: true,
                selectedAll: (args: ISelectAllEventArgs): void => {
                    if (args.isChecked) {
                        expect(isSeleted).toBe(true);
                    } else {
                        expect(isSeleted).toBe(false);
                    }
                }

            });
            ddl.appendTo(element);
            ddl.selectAll(true);
            isSeleted = false;
            ddl.selectAll(false);
            ddl.destroy();
        });
        it('Check the items count', () => {
            ddl = new MultiSelect({
                dataSource: data,
                fields: { text: "text", value: "text" },
                value: ['C#'],
                showSelectAll: true,
                selectedAll: (args: ISelectAllEventArgs): void => {
                    expect(args.itemData.length).toBe(4);
                }

            });
            ddl.appendTo(element);
            ddl.selectAll(true);
            ddl.destroy();
        });
        it('filtering with same selected value', () => {
            ddl = new MultiSelect({
                dataSource: data,
                allowFiltering: true,
                showSelectAll: true,
                fields: { text: "text", value: "text" },
                selectedAll: (args: ISelectAllEventArgs): void => {
                    expect(args.itemData.length).toBe(2);
                }

            });
            ddl.appendTo(element);
            //open action validation
            ddl.showPopup();
            (<any>ddl).inputElement.value = "C";
            //open action validation
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>ddl).keyDownStatus = true;
            (<any>ddl).onInput();
            (<any>ddl).keyUp(keyboardEventArgs);
            ddl.selectAll(true);
        });
    });
    describe('Check end of Space value select', () => {
        let element: HTMLInputElement;
        let selectElement: HTMLDivElement;
        let data: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' }, 
            { id: 'list2 ', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' }
        ];
        let ddl: MultiSelect;
        let isSeleted: boolean = true;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiselect1' });
            selectElement = <HTMLDivElement>createElement('div', { id: 'multiselect2' });
            selectElement.innerHTML = `<select id="list"> 
                <option value="0">American Football</option>
                <option value="1 ">Badminton</option>
                <option value="2">Basketball</option>
                <option value="3">Cricket</option>
                <option value="4">Football</option>
                <option value="5">Golf</option>
                <option value="6">Hockey</option>
                <option value="7">Rugby</option>
                <option value="8">Snooker</option>
                <option value="9">Tennis</option>
            </select>`;
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('Check the JSON', () => {
            ddl = new MultiSelect({
                dataSource: data,
                fields: { text: "text", value: "id" },
                value: ['list2 ']

            });
            ddl.appendTo(element);
            expect((<any>ddl).viewWrapper.innerText).toBe('C#');
        });
        it('Check the select Element', () => {
            ddl = new MultiSelect({
                value: ['1 ']

            });
            ddl.appendTo(selectElement.querySelector('#list') as HTMLElement);
            expect((<any>ddl).viewWrapper.innerText).toBe('Badminton');
        });
    });

    describe('CR issue - EJ2-17970 - UI breaking', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datamanager: DataManager = new DataManager({
            url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
            adaptor: new WebApiAdaptor,
            crossDomain: true
        });
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
            document.body.appendChild(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        // it('ensure change event', (done) => {
        //     listObj = new MultiSelect({
        //     dataSource: datamanager,
        //     query: new Query().select(['FirstName', 'EmployeeID']).take(10).requiresCount(),
        //     fields: { text: 'FirstName', value: 'EmployeeID' },
        //     placeholder: 'Select customer',
        //     sortOrder: 'Ascending',
        //     allowFiltering: true,
        //     value: [2],
        //     open: () => {
        //         if ( (<any>listObj).inputElement.value === 'c') {
        //            let len: number = (<any>listObj).ulElement.querySelectorAll('li').length;
        //             expect(len).toBeGreaterThan(1);
        //             done();
        //         } else {
        //             (<any>listObj).inputElement.value = 'c';
        //         keyboardEventArgs.keyCode = 8;
        //         (<any>listObj).onInput();
        //         (<any>listObj).onKeyUp(keyboardEventArgs);
        //         }
        //     }
        //     });
        //     listObj.appendTo(element);
        //     listObj.dataBind();
        //     (<any>listObj).inputElement.value = 'c;';
        //     keyboardEventArgs.altKey = false;
        //     keyboardEventArgs.keyCode = 186;
        //     (<any>listObj).keyDownStatus = true;
        //     (<any>listObj).onInput();
        //     (<any>listObj).keyUp(keyboardEventArgs);
        // });

    });
    describe('EJ2-13211 - remote selection not maintain', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { id: 'level1', sports: 'American Football' }, { id: 'level2', sports: 'Badminton' },
            { id: 'level3', sports: 'Basketball' }, { id: 'level4', sports: 'Cricket' },
            { id: 'level5', sports: 'Football' }, { id: 'level6', sports: 'Golf' },
            { id: 'level7', sports: 'Hockey' }, { id: 'level8', sports: 'Rugby' },
            { id: 'level9', sports: 'Snooker' }, { id: 'level10', sports: 'Tennis' },
        ];

        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: "sports", value: "id" },
                hideSelectedItem: false,
                text: 'Tennis',
                popupHeight: 100,
                showDropDownIcon: true,
                openOnClick: false
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('bug(EJ2-7967): ensure text property -  Initial assignment', () => {
            listObj.showPopup();
            expect(listObj.value.length).toBeGreaterThan(0);
        });
        it('bug(EJ2-13211): ensure list scroll', () => {
            expect((<any>listObj).list.querySelector('.e-active').innerText).toBe('Tennis');
            listObj.hidePopup();
        });

        it('bug(EJ2-7967): ensure text property', (done) => {
            listObj.change = (args: MultiSelectChangeEventArgs): void => {
                expect(args.value.length).toBeGreaterThan(0);
                expect(args.value[0]).toBe('level9');
                done();
            }
            listObj.text = 'Snooker';
        });

        it('bug(EJ2-14587): ensure showDropDownIcon - popup open', (done) => {
            listObj.open = (args: PopupEventArgs): void => {
                expect(!isNullOrUndefined(args.popup)).toBe(true);
                done();
            }
            let dropEle: HTMLElement = listObj.element.parentElement.parentElement;
            let iconEle: HTMLElement = (<HTMLElement>dropEle.querySelector('.e-ddl-icon'));
            iconEle.innerHTML = 'Icon';
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            iconEle.dispatchEvent(clickEvent);
        });

        it('bug(EJ2-14587): ensure showDropDownIcon', () => {
            let dropEle: HTMLElement = listObj.element.parentElement.parentElement;
            expect(dropEle.classList.contains('e-down-icon')).toBe(true);
            expect(!isNullOrUndefined(dropEle.querySelector('.e-ddl-icon'))).toBe(true);
        });
    });

    describe('EJ2-19659 - Custom value cant be removed when value field is integer', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { Id: 1, item: 'Fruits and Vegetables' },
            { Id: 2, item: 'Beverages' },
            { Id: 3, item: 'Beauty and Hygiene' },
            
        ];

        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: "item", value: "Id" },
                popupHeight: 100,
                allowCustomValue: true,
                value: ['2344567'],
                mode: 'Box'
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('Check Custom value remove', () => {
            (<any>listObj).removeValue('2344567', null);
            expect(listObj.value.length).toBe(0);
        });
    });
    describe('EJ2-21465 - Data attribute validation is not working in multiselect', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text", 'data-val': 'true', 'aria-disabled': 'false' } });
        let datasource: { [key: string]: Object }[] = [
            { Id: 1, item: 'Fruits and Vegetables' },
            { Id: 2, item: 'Beverages' },
            { Id: 3, item: 'Beauty and Hygiene' },
            
        ];
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: "item", value: "Id" }
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
    
        it('Check data attribute value', () => {
            expect((<any>listObj).hiddenElement.getAttribute('data-val')).not.toBe(null);
        });
        it('enabled - html attribute', () => {
            listObj.enabled = false;
            listObj.dataBind();
            expect((listObj).htmlAttributes['aria-disabled']).toEqual('true');
            listObj.enabled = true;
            listObj.dataBind();
            expect((listObj).htmlAttributes['aria-disabled']).toEqual('false');
        });
    });
    describe('EJ2-13165 - Multiselect readonly behavior changes', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] = [
            { Id: 1, item: 'Fruits and Vegetables' },
            { Id: 2, item: 'Beverages' },
            { Id: 3, item: 'Beauty and Hygiene' },
            
        ];
        let focusCount: number = 0;
        let blurCount: number = 0;
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: "item", value: "Id" },
                readonly: true,
                mode: 'CheckBox'
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('Check focus event', (done) => {
            listObj.focus = (args: FocusEventArgs): void => {
                focusCount++;
                expect(args.event.type).toBe('focus');
                setTimeout((): void => {
                    expect(focusCount).toBe(1);
                    done();
                }, 200);
            }
            (<any>listObj).inputElement.focus();
        });
        it('Check blur event', (done) => {
            listObj.blur = (): void => {
                blurCount++;
                setTimeout((): void => {
                    expect(blurCount).toBe(1);
                    done();
                }, 200);
            }
            (<any>listObj).inputElement.focus();
            (<any>listObj).inputElement.blur();
        });

        it('Check focus event through public method', (done) => {
            focusCount = 0;
            listObj.focus = (args: FocusEventArgs): void => {
                focusCount++;
                expect(args.event.type).toBe('focus');
                setTimeout((): void => {
                    expect(focusCount).toBe(1);
                    done();
                }, 200);
            }
            (<any>listObj).focusIn();
        });
        it('Check blur event through public method', (done) => {
            blurCount = 0;
            listObj.blur = (): void => {
                blurCount++;
                setTimeout((): void => {
                    expect(blurCount).toBe(1);
                    done();
                }, 200);
            }
            (<any>listObj).focusIn();
            (<any>listObj).focusOut();
        });
    });
    describe('Bootstrap model placeholder length', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] =  [
            { id: 'list1', text: 'JAVA' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET' },
            { id: 'list5', text: 'Oracle' },
            { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' },
            { id: 'list8', text: 'Racket' },
            { id: 'list8', text: 'F#' }];
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: "text", value: "id" },
                placeholder: 'My placeholder 12345566789',
                width: 100,
                showDropDownIcon: true
            });
            listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Lengthy placeholder', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, 
                placeholder: "select counties Select or search maximum 8 players" , showDropDownIcon: true , width: 300 });
            listObj.appendTo(element);
            listObj.element.parentElement.setAttribute('style','display:none');
            expect((listObj as any).searchWrapper.classList.contains('e-search-custom-width')).toBe(true);
            listObj.destroy();
        });
    });
    describe('EJ2-13148 - Multiselect key navigation is not working with Home , Endkeys', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
        let datasource: { [key: string]: Object }[] =  [
                { id: 'list1', text: 'JAVA' },
                { id: 'list2', text: 'C#' },
                { id: 'list3', text: 'C++' },
                { id: 'list4', text: '.NET' },
                { id: 'list5', text: 'Oracle' },
                { id: 'list6', text: 'GO' },
                { id: 'list7', text: 'Haskell' },
                { id: 'list8', text: 'Racket' },
                { id: 'list8', text: 'F#' }];
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
            document.body.appendChild(element);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('Check End key Navigation', (done) => {
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: "text", value: "id" },
                popupHeight: 50,
                change: (): void => {
                    (<any>listObj).onKeyDown({ keyCode: 35, preventDefault: function () { }});
                    let ele: HTMLElement = listObj.ulElement.querySelector('.e-item-focus');
                    expect(ele.innerText).toBe('F#');
                    (<any>listObj).onKeyDown({ keyCode: 36, preventDefault: function () { }});
                    ele = listObj.ulElement.querySelector('.e-item-focus');
                    expect(ele.innerText).toBe('JAVA');
                    done();
                },
                open: (): void => {
                    listObj.text = 'GO';
                }
            });
            listObj.appendTo(element);
            listObj.dataBind();
            listObj.showPopup();
        });
    });
    describe('EJ2-19524 - UI breaking when use lengthy place holder', () => {
    let listObj: MultiSelect;
    let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { type: "text" } });
    let datasource: { [key: string]: Object }[] =  [
            { id: 'list1', text: 'JAVA' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET' },
            { id: 'list5', text: 'Oracle' },
            { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' },
            { id: 'list8', text: 'Racket' },
            { id: 'list8', text: 'F#' }];
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({
                dataSource: datasource,
                fields: { text: "text", value: "id" },
                placeholder: 'My placeholder 12345566789',
                width: 100,
                showDropDownIcon: true
            });
            listObj.appendTo(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Lengthy placeholder when input is empty and focusout', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, 
                placeholder: "select counties Select or search maximum 8 playersssssssssssssssss" , showDropDownIcon: true , width: 300 });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect(getComputedStyle((<any>listObj).searchWrapper).width).toBe('calc(100% - 20px)');
            }
            else
                expect(true).toBe(false);            
            listObj.destroy();
        });
        it('Lengthy placeholder when input is empty and focusin', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, 
                placeholder: "select counties Select or search maximum 8 playersssssssssssssssss" , showDropDownIcon: true , width: 300 });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            (<any>listObj).focusInHandler();
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect(getComputedStyle((<any>listObj).searchWrapper).width).toBe('calc(100% - 20px)');
            }
            else
                expect(true).toBe(false);            
            listObj.destroy();
        });
        it('Lengthy placeholder when input given & focusout', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, 
                placeholder: "select counties Select or search maximum 8 playersssssssssssssssss" , value: ['PHP','HTML'],showDropDownIcon: true , width: 300 });
            listObj.appendTo(element);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).searchWrapper.classList.contains('e-zero-size')).toBe(true);
            }
            else
                expect(true).toBe(false);            
            listObj.destroy();
        });
        it('Lengthy placeholder when input given & focusin', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, 
                placeholder: "select counties Select or search maximum 8 playersssssssssssssssss" , value: ['PHP','HTML'],showDropDownIcon: true , width: 300 });
            listObj.appendTo(element);
            (<any>listObj).focusInHandler();
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).searchWrapper.classList.contains('e-zero-size')).toBe(false);
            }
            else
                expect(true).toBe(false);            
            listObj.destroy();
        });
        it('Dynamically changing the value through setmodel', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, 
                placeholder: "select counties Select or search maximum 8 playersssssssssssssssss" ,showDropDownIcon: true , width: 300 });
            listObj.appendTo(element);
            listObj.value = ['PHP','HTML'];
            listObj.dataBind();
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).searchWrapper.classList.contains('e-zero-size')).toBe(true);
            }
            else
                expect(true).toBe(false);            
            listObj.destroy();
        });
        it('Selecting value using enter key', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, 
                placeholder: "select counties Select or search maximum 8 playersssssssssssssssss" ,showDropDownIcon: true , width: 300 });
            listObj.appendTo(element);
            listObj.showPopup();
           (<any>listObj).focusAtFirstListItem();
           keyboardEventArgs.keyCode = 13;
           (<any>listObj).onKeyDown(keyboardEventArgs);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect((<any>listObj).searchWrapper.classList.contains('e-zero-size')).toBe(false);
            }
            else
                expect(true).toBe(false);            
            listObj.destroy();
        });
        it('Removing chip using backspace key', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, 
                placeholder: "select counties Select or search maximum 8 playersssssssssssssssss" ,showDropDownIcon: true ,value: ['PHP'], width: 300 });
            listObj.appendTo(element);
            listObj.showPopup();
           (<any>listObj).focusAtFirstListItem();
           keyboardEventArgs.keyCode = 8;
           (<any>listObj).removelastSelection(keyboardEventArgs);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect(getComputedStyle((<any>listObj).searchWrapper).width).toBe('calc(100% - 20px)');
            }
            else
                expect(true).toBe(false);            
            listObj.destroy();
        });
        it('Removing individual chip', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, 
                placeholder: "select counties Select or search maximum 8 playersssssssssssssssss" ,showDropDownIcon: true ,value: ['PHP'], width: 300 });
            listObj.appendTo(element);
           (<any>listObj).onChipRemove({
                preventDefault: function () { },
                which: 1,
                target: document.querySelector('.e-chips-collection .e-chips .e-chips-close')
           });
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect(getComputedStyle((<any>listObj).searchWrapper).width).toBe('calc(100% - 20px)');
            }
            else
                expect(true).toBe(false);            
            listObj.destroy();
        });
        it('Overall chip remove', () => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: datasource2, 
                placeholder: "select counties Select or search maximum 8 playersssssssssssssssss" ,showDropDownIcon: true ,value: ['PHP'], width: 300 });
            listObj.appendTo(element);
           keyboardEventArgs.which = 1;
           (<any>listObj).clearAll(keyboardEventArgs);
            let wrapper: HTMLElement = (<any>listObj).inputElement.parentElement.parentElement;
            if (wrapper && wrapper.firstElementChild && wrapper.firstChild.nextSibling) {
                expect(getComputedStyle((<any>listObj).searchWrapper).width).toBe('calc(100% - 20px)');
            }
            else
                expect(true).toBe(false);            
            listObj.destroy();
        });

    });
    describe('EJ2-22723 - Multiselect selected value not updated', () => {
        let listObj: MultiSelect;
        let element: HTMLSelectElement = <HTMLSelectElement>createElement('select', { id: 'license', attrs: {multiple: 'multiple'}});
        element.innerHTML = `<option value="">Choose Option</option>
        <option selected="selected" value="1">Some 1</option>
        <option selected="selected" value="2">Some 2</option>
        <option value="3">SSS</option>
        <option value="4">SHS</option>
        <option selected="selected" value="5">Yachtmaster Offshore</option>`;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('Value selection', (done) => {
            listObj = new MultiSelect({
                placeholder: "Choose Option",
                mode: "Box",
                created: (): void => {
                    expect(listObj.value.length).toBe(3);
                    expect(listObj.text).toBe('Some 1,Some 2,Yachtmaster Offshore');
                    done();
                }
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
    });
    describe('EJ2-22723 - Multiselect selected value not updated', () => {
        let listObj: MultiSelect;
        let element: HTMLSelectElement = <HTMLSelectElement>createElement('select', { id: 'license', attrs: {multiple: 'multiple'}});
        element.innerHTML = `<option value="">Choose Option</option>
        <option value="1">Some 1</option>
        <option value="2">Some 2</option>
        <option value="3">SSS</option>
        <option value="4">SHS</option>
        <option value="5">Yachtmaster Offshore</option>`;
        beforeAll(() => {
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('Value selection', (done) => {
            listObj = new MultiSelect({
                placeholder: "Choose Option",
                mode: "Box",
                created: (): void => {
                    expect(listObj.value).toBe(null);
                    expect(listObj.text).toBe(null);
                    done();
                }
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
    });
    describe('EJ2-22960 - Exception throws while use datasource string inside string', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'license', attrs: { type: 'text'}});
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: '"JAVA"', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'list6', text: 'GO' }, { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list8', text: 'F#' }];
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({
                placeholder: "Choose Option",
                dataSource: data,
                fields: { text:"text", value:"text" }
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('Value selection', (done) => {
            listObj.change = (): void => {
                expect(listObj.value.length).toBe(1);
                expect(listObj.text).toBe('"JAVA"');
                done();
            }
            listObj.open = (args: PopupEventArgs): void => {
                setTimeout((): void => {
                    let liELe: HTMLElement = args.popup.element.querySelector('li');
                    let clickEvent: MouseEvent = document.createEvent('MouseEvents');
                    clickEvent.initEvent('mouseup', true, true);
                    liELe.dispatchEvent(clickEvent);
                    (<any>listObj).onBlurHandler();
                }, 200)
            }
            listObj.showPopup();
        });
        it('remove Value selection', (done) => {
            listObj.change = (): void => {
                expect(listObj.value.length).toBe(0);
                done();
            }
            listObj.focus = (): void => {
                let closeELe: HTMLElement = document.querySelector('.e-chips .e-chips-close');
                let clickEvent: MouseEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent('mousedown', true, true);
                closeELe.dispatchEvent(clickEvent);
                (<any>listObj).onBlurHandler();
            }

            (<any>listObj).focusInHandler();
        });
    });
    describe('EJ2-23146 - floating label misplaced when it is focused', () => {
        let listObj: MultiSelect;
        let divElement: HTMLDivElement = <HTMLDivElement>createElement('div', { id: 'licensediv'});
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'license', attrs: { type: 'text'}});
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: '"JAVA"', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'list6', text: 'GO' }, { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list8', text: 'F#' }];
        beforeAll(() => {
            divElement.appendChild(element);
            document.body.appendChild(divElement);
            listObj = new MultiSelect({
                placeholder: "Choose Option",
                dataSource: data,
                floatLabelType: 'Always',
                mode: 'Box',
                fields: { text:"text", value:"text" },
                value: ['"JAVA"']
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
        afterAll(() => {
            if (divElement) {
                listObj.destroy();
                divElement.remove();
            }
        });
        it('remove Value selection', (done) => {
            listObj.removed = (): void => {
                expect(divElement.querySelector('.e-float-text.e-label-top')).not.toBe(null);
                done();
            };
            (<any>listObj).onChipRemove({
                preventDefault: function () { },
                which: 22,
                target: divElement.querySelector('.e-chips-collection .e-chips .e-chips-close')
            });
        });
    });
    describe('EJ2-23849 - Multiselect placeholder exception', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'license', attrs: { type: 'text'}});
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: '"JAVA"', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'list6', text: 'GO' }, { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list8', text: 'F#' }];
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({
                placeholder: "Choose Option",
                dataSource: data,
                width: 1,
                fields: { text:"text", value:"text" }
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('Check Placeholder issue', () => {
            expect((<any>listObj).inputElement.size).not.toBe(0);
        });
    });
    describe('bug(EJ2-21907): Dropdowns html5 validation attributes are added.', () => {
        let listObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'license', attrs: { type: 'text'}});
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: '"JAVA"', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'list6', text: 'GO' }, { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list8', text: 'F#' }];
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({
                placeholder: "Choose Option",
                dataSource: data,
                fields: { text:"text", value:"text" }
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Check attributes', () => {
            expect(listObj.hiddenElement.getAttribute('multiple')).toBe('');
        });
    });
    describe('EJ2-24251 - Multiselect placeholder not update, when remove the selected value.', () => {
        let listObj: MultiSelect;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'license', attrs: { type: 'text'}});
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'list6', text: 'GO' }, { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list8', text: 'F#' }];
        beforeAll(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({
                placeholder: "Choose Option",
                dataSource: data,
                value: ['JAVA'],
                fields: { text:"text", value:"text" }
            });
            listObj.appendTo(element);
            listObj.dataBind();
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('remove Value selection', () => {
            listObj.change = (): void => {
                expect(listObj.value.length).toBe(0);
                expect((<any>listObj).inputElement.placeholder).toBe('Choose Option');
                expect((<any>listObj).searchWrapper.classList.contains('e-zero-size')).toBe(false);
            }
            listObj.focus = (): void => {
                let closeELe: HTMLElement = document.querySelector('.e-chips .e-chips-close');
                let clickEvent: MouseEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent('mousedown', true, true);
                closeELe.dispatchEvent(clickEvent);
                (<any>listObj).onBlurHandler();
            }

            (<any>listObj).focusInHandler();
        });
    });
    describe('Checking selected item not hidden from the popup', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { group:'group1', value: 'data11'},
            { group:'group1', value: 'data12'},
            { group:'group1', value: 'data13'},
            { group:'group1', value: 'data14'},
            { group:'group2', value: 'data21'},
            { group:'group2', value: 'data22'},
            { group:'group2', value: 'data23'},
            { group:'group2', value: 'data24'},
            { group:'group3', value: 'data31'},
            { group:'group3', value: 'data32'},
            { group:'group3', value: 'data33'},
            { group:'group3', value: 'data34'},
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Validation for the grouping in CheckBox Mode with ascending order', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'value', value: 'value', groupBy: 'group' },
                enableGroupCheckBox: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select a data',
                popupWidth: '250px',
                popupHeight: '300px',
                sortOrder: "Ascending",
            });
            listObj.appendTo(element);
            listObj.showPopup();
            let keyboardEventArgs: any = { preventDefault: (): void => { }, };
            expect((<any>listObj).isPopupOpen()).toBe(true);
            keyboardEventArgs.keyCode = 40;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            keyboardEventArgs.keyCode = 32;
            keyboardEventArgs.code = 'Space';
            (<any>listObj).onKeyDown(keyboardEventArgs);
            let listElement: any = (<any>listObj).ulElement.querySelector("li.e-list-item");
            expect(listElement.classList.contains('e-active')).toBe(true);
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = document.body;
            (listObj as any).onDocumentClick(mouseEventArgs);
            (listObj as any).onBlurHandler(mouseEventArgs);
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(listElement.classList.contains('e-active')).toBe(true);
            listObj.hidePopup();
            listObj.destroy();
        });
        it('Validation for the grouping in CheckBox Mode ascending order', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'value', value: 'value', groupBy: 'group' },
                enableGroupCheckBox: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select a data',
                popupWidth: '250px',
                popupHeight: '300px',
                sortOrder: "Descending",
            });
            listObj.appendTo(element);
            listObj.showPopup();
            let keyboardEventArgs: any = { preventDefault: (): void => { }, };
            expect((<any>listObj).isPopupOpen()).toBe(true);
            keyboardEventArgs.keyCode = 40;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            (<any>listObj).onKeyDown(keyboardEventArgs);
            keyboardEventArgs.keyCode = 32;
            keyboardEventArgs.code = 'Space';
            (<any>listObj).onKeyDown(keyboardEventArgs);
            let listElement: any = (<any>listObj).ulElement.querySelector("li.e-list-item");
            expect(listElement.classList.contains('e-active')).toBe(true);
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = document.body;
            (listObj as any).onDocumentClick(mouseEventArgs);
            (listObj as any).onBlurHandler(mouseEventArgs);
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(listElement.classList.contains('e-active')).toBe(true);
            listObj.hidePopup();
            listObj.destroy();
        });
    });
    describe('Filtering API', () => {
        let ele: HTMLElement = document.createElement('input');
        ele.id = 'newlist';
        let listObj: any;
        let e: any = { preventDefault: function () { }, target: null };
        let data: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' },
        { id: 'lit2', text: 'PHP' }, { id: 'list22', text: 'Phython' }, { id: 'list32', text: 'Perl' },
        { id: 'list42', text: 'Core' }, { id: 'lis2', text: 'C' }, { id: 'list12', text: 'C##' }];
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new MultiSelect({
                dataSource: data, fields: { text: 'text', value: 'id' }, allowFiltering: true,
                popupHeight: '100px',
                filterType: 'StartsWith'
            });
            listObj.appendTo('#newlist');
        });
        afterAll(() => {
            if (ele) {
                ele.remove();
            }
        })
        it(' check the filter', () => {
            listObj.showPopup();
            listObj.inputElement.value = 'java';
            e.keyCode = 72;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect(listObj.list.classList.contains(dropDownBaseClasses.noData)).toBe(false);
            expect(listObj.liCollections[0].getAttribute('data-value') === 'list1').toBe(true);
            listObj.filterType = 'Contains';
            listObj.dataBind();
            listObj.inputElement.value = 'o';
            e.keyCode = 72;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect(listObj.list.classList.contains(dropDownBaseClasses.noData)).toBe(false);
            expect(listObj.liCollections.length >1).toBe(true);
            listObj.filterType = 'EndsWith';   
            listObj.dataBind();
            listObj.inputElement.value = 'n';
            e.keyCode = 72;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect(listObj.list.classList.contains(dropDownBaseClasses.noData)).toBe(false);
            expect(listObj.liCollections.length >=1).toBe(true);
        });
    });
    describe('Grouping in CheckBox Mode', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { "Name": "Australia", "Code": "AU", "Start": "A" },
            { "Name": "Bermuda", "Code": "BM", "Start": "B" },
            { "Name": "Canada", "Code": "CA", "Start": "C" },
            { "Name": "Cameroon", "Code": "CM", "Start": "C" },
            { "Name": "Denmark", "Code": "DK", "Start": "D" },
            { "Name": "France", "Code": "FR", "Start": "F" },
            { "Name": "Finland", "Code": "FI", "Start": "F" },
            { "Name": "Germany", "Code": "DE", "Start": "G" },
            { "Name": "Greenland", "Code": "GL", "Start": "G" },
            { "Name": "Hong Kong", "Code": "HK", "Start": "H" },
            { "Name": "India", "Code": "IN", "Start": "I" },
            { "Name": "Italy", "Code": "IT", "Start": "I" },
            { "Name": "Japan", "Code": "JP", "Start": "J" },
            { "Name": "Mexico", "Code": "MX", "Start": "M" },
            { "Name": "Norway", "Code": "NO", "Start": "N" },
            { "Name": "Poland", "Code": "PL", "Start": "P" },
            { "Name": "Switzerland", "Code": "CH", "Start": "S" },
            { "Name": "United Kingdom", "Code": "GB", "Start": "U" },
            { "Name": "United States", "Code": "US", "Start": "U" }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Validation for the grouping in CheckBox Mode', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', groupBy: 'Start' },
                enableGroupCheckBox: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
                enableSelectionOrder: false
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            mouseEventArgs.target = listObj.ulElement.querySelector("li.e-list-item");
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            let listElement: any = (<any>listObj).ulElement.querySelector("li.e-list-item");
            expect(listElement.firstElementChild.lastElementChild.classList.contains('e-check')).toBe(true);
            expect(listElement.previousElementSibling.firstElementChild.lastElementChild.classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = listObj.ulElement.querySelector("li.e-list-group-item").firstElementChild.lastElementChild;
            let groupElement = listObj.ulElement.querySelector("li.e-list-group-item");
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect(listElement.firstElementChild.lastElementChild.classList.contains('e-check')).toBe(false);
            expect(listElement.nextElementSibling.firstElementChild.lastElementChild.classList.contains('e-check')).toBe(false);
            listObj.hidePopup();
            listObj.destroy();
        });
        it('Validation for the grouping in CheckBox Mode using keys', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', groupBy: 'Start' },
                enableGroupCheckBox: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
                enableSelectionOrder: false
            });
            listObj.appendTo(element);
            listObj.showPopup();
            let keyboardEventArgs: any = { preventDefault: (): void => { }, };
                expect((<any>listObj).isPopupOpen()).toBe(true);
                keyboardEventArgs.keyCode = 40;
                (<any>listObj).onKeyDown(keyboardEventArgs);
                (<any>listObj).onKeyDown(keyboardEventArgs);
                keyboardEventArgs.keyCode = 32;
                keyboardEventArgs.code = 'Space';
                (<any>listObj).onKeyDown(keyboardEventArgs);
            let listElement: any = (<any>listObj).ulElement.querySelector("li.e-list-item");
            expect(listElement.firstElementChild.lastElementChild.classList.contains('e-check')).toBe(true);
            expect(listElement.previousElementSibling.firstElementChild.lastElementChild.classList.contains('e-check')).toBe(true);
            keyboardEventArgs.keyCode = 38;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            keyboardEventArgs.keyCode = 32;
            keyboardEventArgs.code = 'Space';
            keyboardEventArgs.target = (<any>listObj).overAllWrapper;
            (<any>listObj).onKeyDown(keyboardEventArgs);
            expect(listElement.firstElementChild.lastElementChild.classList.contains('e-check')).toBe(false);
            expect(listElement.previousElementSibling.firstElementChild.lastElementChild.classList.contains('e-check')).toBe(false);
            
            listObj.hidePopup();
            listObj.destroy();
        });
        it('Validation for clear all for grouping in CheckBox Mode', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', groupBy: 'Start' },
                enableGroupCheckBox: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
                showSelectAll: true,
                enableSelectionOrder: false
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            mouseEventArgs.target = listObj.ulElement.querySelector("li.e-list-item");
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            let listElement: any = (<any>listObj).ulElement.querySelector("li.e-list-item");
            expect(listElement.firstElementChild.lastElementChild.classList.contains('e-check')).toBe(true);
            expect(listElement.previousElementSibling.firstElementChild.lastElementChild.classList.contains('e-check')).toBe(true);
            mouseEventArgs.target = (<any>listObj).overAllClear;
            (<any>listObj).clearAll(mouseEventArgs);
            expect((<any>listObj).list.querySelector('li.e-list-group-item').firstElementChild.lastElementChild.classList.contains('e-check')).toBe(false);
            expect((<any>listObj).list.querySelector('li.e-list-item').firstElementChild.lastElementChild.classList.contains('e-check')).toBe(false);
            listObj.hidePopup();
            listObj.destroy();
        });
    });
    describe('EJ2-32125-Remote data binding', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('allowCustomValue.-remote data', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: 'Box', fields: { value: 'EmployeeID', text: 'FirstName' }, allowCustomValue: true });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).focusInHandler();
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 65;
            setTimeout(() => {
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).keyUp(keyboardEventArgs);
                setTimeout(() => {
                    expect((<any>listObj).liCollections.length > 1).toBe(true);
                    expect((<any>listObj).value).toBe(null);
                    listObj.destroy();
                    done();
                }, 2000);
            }, 800);
        });
    });
    describe('EJ2-32125-Remote data binding', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('allowCustomValue.-remote data', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: 'Box', fields: { value: 'EmployeeID', text: 'FirstName' }, allowCustomValue: true });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).focusInHandler();
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 65;
            setTimeout(() => {
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).keyUp(keyboardEventArgs);
                setTimeout(() => {
                    expect((<any>listObj).liCollections.length > 1).toBe(true);
                    expect((<any>listObj).value).toBe(null);
                    listObj.destroy();
                    done();
                }, 2000);
            }, 800);
        });
    });
    describe('Select All functionality against Maximumselection length', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { "Name": "Australia", "Code": "AU", "Start": "A" },
            { "Name": "Bermuda", "Code": "BM", "Start": "B" },
            { "Name": "Canada", "Code": "CA", "Start": "C" },
            { "Name": "Cameroon", "Code": "CM", "Start": "C" },
            { "Name": "Denmark", "Code": "DK", "Start": "D" },
            { "Name": "France", "Code": "FR", "Start": "F" },
            { "Name": "Finland", "Code": "FI", "Start": "F" },
            { "Name": "Germany", "Code": "DE", "Start": "G" },
            { "Name": "Greenland", "Code": "GL", "Start": "G" },
            { "Name": "Hong Kong", "Code": "HK", "Start": "H" },
            { "Name": "India", "Code": "IN", "Start": "I" },
            { "Name": "Italy", "Code": "IT", "Start": "I" },
            { "Name": "Japan", "Code": "JP", "Start": "J" },
            { "Name": "Mexico", "Code": "MX", "Start": "M" },
            { "Name": "Norway", "Code": "NO", "Start": "N" },
            { "Name": "Poland", "Code": "PL", "Start": "P" },
            { "Name": "Switzerland", "Code": "CH", "Start": "S" },
            { "Name": "United Kingdom", "Code": "GB", "Start": "U" },
            { "Name": "United States", "Code": "US", "Start": "U" }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Without grouping', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name' },
                showSelectAll: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
                maximumSelectionLength: 5
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            mouseEventArgs.target = (listObj as any).popupWrapper.querySelectorAll('.e-selectall-parent')[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).selectAllItem(true, mouseEventArgs);
            expect((listObj as any).list.querySelectorAll('.e-active').length == (listObj as any).maximumSelectionLength).toBe(true);
            expect((listObj as any).value.length == (listObj as any).maximumSelectionLength).toBe(true);
            listObj.hidePopup();
            listObj.destroy();
        });
        it('With grouping', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name', groupBy: 'Start' },
                showSelectAll: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
                maximumSelectionLength: 5
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            mouseEventArgs.target = (listObj as any).popupWrapper.querySelectorAll('.e-selectall-parent')[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).selectAllItem(true, mouseEventArgs);
            expect((listObj as any).list.querySelectorAll('.e-list-item.e-active').length == (listObj as any).maximumSelectionLength).toBe(true);
            expect((listObj as any).value.length == (listObj as any).maximumSelectionLength).toBe(true);
            listObj.hidePopup();
            listObj.destroy();
        });
        it('Grouping with checkbox', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name', groupBy: 'Start' },
                showSelectAll: true,
                enableGroupCheckBox: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
                maximumSelectionLength: 1
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            mouseEventArgs.target = (listObj as any).popupWrapper.querySelectorAll('.e-list-group-item')[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((listObj as any).list.querySelectorAll('.e-list-item.e-active').length == (listObj as any).maximumSelectionLength).toBe(true);
            expect((listObj as any).value.length == (listObj as any).maximumSelectionLength).toBe(true);
            listObj.hidePopup();
            listObj.destroy();
        });
    });
    describe('Select All Public method functionality', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { "Name": "Australia", "Code": "AU", "Start": "A" },
            { "Name": "Bermuda", "Code": "BM", "Start": "B" },
            { "Name": "Canada", "Code": "CA", "Start": "C" },
            { "Name": "Cameroon", "Code": "CM", "Start": "C" },
            { "Name": "Denmark", "Code": "DK", "Start": "D" },
            { "Name": "France", "Code": "FR", "Start": "F" },
            { "Name": "Finland", "Code": "FI", "Start": "F" },
            { "Name": "Germany", "Code": "DE", "Start": "G" },
            { "Name": "Greenland", "Code": "GL", "Start": "G" },
            { "Name": "Hong Kong", "Code": "HK", "Start": "H" },
            { "Name": "India", "Code": "IN", "Start": "I" },
            { "Name": "Italy", "Code": "IT", "Start": "I" },
            { "Name": "Japan", "Code": "JP", "Start": "J" },
            { "Name": "Mexico", "Code": "MX", "Start": "M" },
            { "Name": "Norway", "Code": "NO", "Start": "N" },
            { "Name": "Poland", "Code": "PL", "Start": "P" },
            { "Name": "Switzerland", "Code": "CH", "Start": "S" },
            { "Name": "United Kingdom", "Code": "GB", "Start": "U" },
            { "Name": "United States", "Code": "US", "Start": "U" }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Without grouping', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name' },
                showSelectAll: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            (<any>listObj).selectAll(true);
            expect((<any>listObj).value.length === (<any>listObj).liCollections.length).toBe(true);
            listObj.destroy();
        });
        it('With grouping', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name', groupBy: 'Start' },
                showSelectAll: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            (<any>listObj).selectAll(true);
            expect((<any>listObj).value.length === (<any>listObj).liCollections.length).toBe(true);
            listObj.destroy();
        });
        it('enableGroupCheckBox is true', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name', groupBy: 'Start' },
                showSelectAll: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
                enableGroupCheckBox: true,
            });
            listObj.appendTo(element);
            (<any>listObj).renderPopup();
            (<any>listObj).selectAll(true);
            expect((<any>listObj).value.length === (<any>listObj).liCollections.length).toBe(true);
            listObj.destroy();
        });
    });
    describe('Set Outline theme with float type always', () => {
        let listObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('Set floatlabeltype always', () => {
            listObj = new MultiSelect({ floatLabelType: 'Always' });
            listObj.appendTo(element);
            expect(listObj.overAllWrapper.classList.contains('e-valid-input')).toEqual(true);
            listObj.floatLabelType = 'Auto';
            listObj.dataBind();
            expect(listObj.overAllWrapper.classList.contains('e-valid-input')).toEqual(false);
            listObj.floatLabelType = 'Always';
            listObj.dataBind();
            expect(listObj.overAllWrapper.classList.contains('e-valid-input')).toEqual(true);
        });
    });
    describe('Multiselect- Hidepopup', () => {
        let listObj: MultiSelect;
        let divElement: HTMLElement = createElement('div', { id: 'divElement' });
        divElement.style.height = '900px';
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { "Name": "Australia", "Code": "AU", "Start": "A" },
            { "Name": "Bermuda", "Code": "BM", "Start": "B" },
            { "Name": "Canada", "Code": "CA", "Start": "C" },
            { "Name": "Cameroon", "Code": "CM", "Start": "C" },
            { "Name": "Denmark", "Code": "DK", "Start": "D" },
            { "Name": "France", "Code": "FR", "Start": "F" },
            { "Name": "Finland", "Code": "FI", "Start": "F" },
            { "Name": "Germany", "Code": "DE", "Start": "G" },
            { "Name": "Greenland", "Code": "GL", "Start": "G" },
            { "Name": "Hong Kong", "Code": "HK", "Start": "H" },
            { "Name": "India", "Code": "IN", "Start": "I" },
            { "Name": "Italy", "Code": "IT", "Start": "I" },
            { "Name": "Japan", "Code": "JP", "Start": "J" },
            { "Name": "Mexico", "Code": "MX", "Start": "M" },
            { "Name": "Norway", "Code": "NO", "Start": "N" },
            { "Name": "Poland", "Code": "PL", "Start": "P" },
            { "Name": "Switzerland", "Code": "CH", "Start": "S" },
            { "Name": "United Kingdom", "Code": "GB", "Start": "U" },
            { "Name": "United States", "Code": "US", "Start": "U" }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('when crosses view port', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name', groupBy: 'Start' },
                showSelectAll: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
                enableGroupCheckBox: true,
            });
            listObj.appendTo(element);
            listObj.showPopup();
            document.body.appendChild(divElement);
            scrollBy({top: 500, behavior: 'smooth'});
            (listObj as any).popupObj.trigger('targetExitViewport');
            listObj.destroy();
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
    })
    describe('Width value with unit em', () => {
        let listObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('Set the width to unit em', () => {
            listObj = new MultiSelect({ width: "50em" });
            listObj.appendTo(element);
            listObj.showPopup();
            expect(listObj.overAllWrapper.style.width).toEqual('50em');
            listObj.width = '100px';
            listObj.dataBind();
            expect(listObj.overAllWrapper.style.width).toEqual('100px');
            listObj.width = '90em';
            listObj.dataBind();
            expect(listObj.overAllWrapper.style.width).toEqual('90em');
            listObj.width = '100%';
            listObj.dataBind();
            expect(listObj.overAllWrapper.style.width).toEqual('100%');
            listObj.width = '30';
            listObj.dataBind();
            expect(listObj.overAllWrapper.style.width).toEqual('30px');
            listObj.width = 50;
            listObj.dataBind();
            expect(listObj.overAllWrapper.style.width).toEqual('50px');
        });
        it('Set the width to unit px', () => {
            listObj = new MultiSelect({ width: "120px" });
            listObj.appendTo(element);
            listObj.showPopup();
            expect(listObj.overAllWrapper.style.width).toEqual('120px');
            listObj.width = '40em';
            listObj.dataBind();
            expect(listObj.overAllWrapper.style.width).toEqual('40em');
            listObj.width = '90px';
            listObj.dataBind();
            expect(listObj.overAllWrapper.style.width).toEqual('90px');
        });
        it('Set the width to unit %', () => {
            listObj = new MultiSelect({ width: "120%" });
            listObj.appendTo(element);
            listObj.showPopup();
            expect(listObj.overAllWrapper.style.width).toEqual('120%');
            listObj.width = '90px';
            listObj.dataBind();
            expect(listObj.overAllWrapper.style.width).toEqual('90px');
            listObj.width = '40em';
            listObj.dataBind();
            expect(listObj.overAllWrapper.style.width).toEqual('40em');
        });
    });

    describe('BLAZ-1156 - Unable to use value binding and template at the same time.', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { text: 'Mona Sak', eimg: '1', status: 'Available', country: 'USA' },
            { text: 'Kapil Sharma', eimg: '2', status: 'Available', country: 'USA' },
            { text: 'Erik Linden', eimg: '3', status: 'Available', country: 'England' },
            { text: 'Kavi Tam', eimg: '4', status: 'Available', country: 'England' },
            { text: "Harish Sree", eimg: "5", status: "Available", country: 'USA' },
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });

        it('Checking the itemTemplate', (done) => {
            (window as any).sfBlazor={ renderComplete:()=> {return true;}};
            (window as any).Blazor = null;
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'text', groupBy: 'country' },
                value: ['Erik Linden'],
                itemTemplate: '<div><img class="eimg" src="../Employees/${eimg}.png" alt="employee"/>' +
                '<div class="ename"> ${text} </div><div class="temp"> ${country} </div></div>',
                valueTemplate: '<span><img class="tempImg" src="../Employees/${eimg}.png" height="20px" width="20px" alt="employee"/>' +
                '<span class="tempName"> ${text} </span></span>',
            });
            listObj.appendTo(element);
            (<any>listObj).showPopup();
            setTimeout(() => {
                expect((<any>listObj).ulElement.firstElementChild.innerText).not.toBe("");
                listObj.destroy();
                delete (window as any).Blazor;
                delete (window as any).sfBlazor;
                done();
            }, 100);
        });
    });
    describe('EJ2-33412', () => {
        let listObj: MultiSelect;
        let divElement: HTMLElement = createElement('div', { id: 'divElement' });
        divElement.style.height = '900px';
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { "Name": "Australia", "Code": "AU", "Start": "A" },
            { "Name": "Bermuda", "Code": "BM", "Start": "B" },
            { "Name": "Canada", "Code": "CA", "Start": "C" },
            { "Name": "Cameroon", "Code": "CM", "Start": "C" },
            { "Name": "Denmark", "Code": "DK", "Start": "D" },
            { "Name": "France", "Code": "FR", "Start": "F" },
            { "Name": "Finland", "Code": "FI", "Start": "F" },
            { "Name": "Germany", "Code": "DE", "Start": "G" },
            { "Name": "Greenland", "Code": "GL", "Start": "G" },
            { "Name": "Hong Kong", "Code": "HK", "Start": "H" },
            { "Name": "India", "Code": "IN", "Start": "I" },
            { "Name": "Italy", "Code": "IT", "Start": "I" },
            { "Name": "Japan", "Code": "JP", "Start": "J" },
            { "Name": "Mexico", "Code": "MX", "Start": "M" },
            { "Name": "Norway", "Code": "NO", "Start": "N" },
            { "Name": "Poland", "Code": "PL", "Start": "P" },
            { "Name": "Switzerland", "Code": "CH", "Start": "S" },
            { "Name": "United Kingdom", "Code": "GB", "Start": "U" },
            { "Name": "United States", "Code": "US", "Start": "U" }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Clear public method checking', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name', groupBy: 'Start' },
                showSelectAll: true,
                mode : 'CheckBox',
                width: '250px',
                placeholder: 'Select an employee',
                popupWidth: '250px',
                popupHeight: '300px',
                value: ['India'],
                enableGroupCheckBox: true,
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect(listObj.value !== null).toBe(true);
            listObj.clear();
            expect(listObj.value === null).toBe(true);
        });
    });
    describe('Update value in focus state', () => {
        let listObj: MultiSelect;
        let divElement: HTMLElement = createElement('div', { id: 'divElement' });
        divElement.style.height = '900px';
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' },
            { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Update value', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'text', value: 'text' },
                mode : 'Box',
                created: function(e) {
                    listObj.focusIn();
                    listObj.value = ['GO'];
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect((<HTMLElement>(<any>listObj).ulElement.querySelector('li[data-value="GO"]')).style.display === '').toBe(true);
        });
    });
    describe('EJ2-36604 - While giving the class name with empty space for HtmlAttributes, console error is produced.', function () {
        let listObj: any;
        beforeEach(function () {
            let inputElement: HTMLElement = createElement('input', { id: 'multiselect' });
            document.body.appendChild(inputElement);
        });
        afterEach(function () {
            if (listObj) {
                listObj.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Entering the class name without any empty space', function () {
            listObj = new MultiSelect({
                htmlAttributes: { class: 'custom-class' }
            });
            listObj.appendTo('#multiselect');
            expect(listObj.overAllWrapper.classList.contains('custom-class')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class')).toBe(true);
        });
        it('Giving empty space before and after the class name', function () {
            listObj = new MultiSelect({
                htmlAttributes: { class: ' custom-class ' }
            });
            listObj.appendTo('#multiselect');
            expect(listObj.overAllWrapper.classList.contains('custom-class')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class')).toBe(true);
        });
        it('Giving more than one empty space between two class names', function () {
            listObj = new MultiSelect({
                htmlAttributes: { class: 'custom-class-one      custom-class-two'}
            });
            listObj.appendTo('#multiselect');
            expect(listObj.overAllWrapper.classList.contains('custom-class-one')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class-one')).toBe(true);
            expect(listObj.overAllWrapper.classList.contains('custom-class-two')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving more than one empty space between two class names as well before and after the class name', function () {
            listObj = new MultiSelect({
                htmlAttributes: {  class: ' custom-class-one       custom-class-two ' }
            });
            listObj.appendTo('#multiselect');
            expect(listObj.overAllWrapper.classList.contains('custom-class-one')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class-one')).toBe(true);
            expect(listObj.overAllWrapper.classList.contains('custom-class-two')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving only empty space  without entering any class Name', function () {
            listObj = new MultiSelect({
            });
            listObj.appendTo('#multiselect');
            let beforeAddClass = listObj.popupWrapper.classList.length;
            let beforeAddClasses = listObj.overAllWrapper.classList.length;
            listObj.htmlAttributes = { class: '  ' };
            listObj.appendTo('#multiselect');
            let AfterAddClass = listObj.popupWrapper.classList.length;
            let AfterAddClasses = listObj.overAllWrapper.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
            expect(beforeAddClasses == AfterAddClasses).toBe(true);
        });
        it('Keep input as empty without entering any class Name', function () {
            listObj = new MultiSelect({
            });
            listObj.appendTo('#multiselect');
            let beforeAddClass = listObj.popupWrapper.classList.length;
            let beforeAddClasses = listObj.overAllWrapper.classList.length;
            listObj.htmlAttributes = { class: '' };
            listObj.appendTo('#multiselect');
            let AfterAddClass = listObj.popupWrapper.classList.length;
            let AfterAddClasses = listObj.overAllWrapper.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
            expect(beforeAddClasses == AfterAddClasses).toBe(true);
        });
    
        it('Entering the class name without any empty space', function () {
            listObj = new MultiSelect({
                cssClass: 'custom-class' 
            });
            listObj.appendTo('#multiselect');
            expect(listObj.overAllWrapper.classList.contains('custom-class')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class')).toBe(true);
        });
        it('Giving empty space before and after the class name', function () {
            listObj = new MultiSelect({
                 cssClass: ' custom-class ' 
            });
            listObj.appendTo('#multiselect');
            expect(listObj.overAllWrapper.classList.contains('custom-class')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class')).toBe(true);
        });
        it('Giving more than one empty space between two class names', function () {
            listObj = new MultiSelect({
                 cssClass: 'custom-class-one      custom-class-two'
            });
            listObj.appendTo('#multiselect');
            expect(listObj.overAllWrapper.classList.contains('custom-class-one')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class-one')).toBe(true);
            expect(listObj.overAllWrapper.classList.contains('custom-class-two')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving more than one empty space between two class names as well before and after the class name', function () {
            listObj = new MultiSelect({
                 cssClass: ' custom-class-one       custom-class-two ' 
            });
            listObj.appendTo('#multiselect');
            expect(listObj.overAllWrapper.classList.contains('custom-class-one')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class-one')).toBe(true);
            expect(listObj.overAllWrapper.classList.contains('custom-class-two')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class-two')).toBe(true);
        });
        it('Giving only empty space  without entering any class Name', function () {
            listObj = new MultiSelect({
            });
            listObj.appendTo('#multiselect');
            let beforeAddClass = listObj.popupWrapper.classList.length;
            let beforeAddClasses = listObj.overAllWrapper.classList.length;
            listObj.cssClass = ' ' ;
            listObj.appendTo('#multiselect');
            let AfterAddClass = listObj.popupWrapper.classList.length;
            let AfterAddClasses = listObj.overAllWrapper.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
            expect(beforeAddClasses == AfterAddClasses).toBe(true);
        });
        it('Keep input as empty without entering any class Name', function () {
            listObj = new MultiSelect({
            });
            listObj.appendTo('#multiselect');
            let beforeAddClass = listObj.popupWrapper.classList.length;
            let beforeAddClasses = listObj.overAllWrapper.classList.length;
            listObj.cssClass = '' ;
            listObj.appendTo('#multiselect');
            let AfterAddClass = listObj.popupWrapper.classList.length;
            let AfterAddClasses = listObj.overAllWrapper.classList.length;
            expect(beforeAddClass == AfterAddClass).toBe(true);
            expect(beforeAddClasses == AfterAddClasses).toBe(true);
        });
        it('Giving class name with underscore in the beginning', function () {
            listObj = new MultiSelect({
                htmlAttributes : { class : '  _custom-class-one  '},
                cssClass : '   _custom-class-two  '
            });
            listObj.appendTo('#multiselect');
            expect(listObj.overAllWrapper.classList.contains('_custom-class-one')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('_custom-class-one')).toBe(true);
            expect(listObj.overAllWrapper.classList.contains('_custom-class-two')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('_custom-class-two')).toBe(true);
        });
        it('Giving class name with empty space in both cases seperatly', function () {
            listObj = new MultiSelect({
                htmlAttributes : { class : '  custom-class-one  '},
                cssClass : '   custom-class-two  '
            });
            listObj.appendTo('#multiselect');
            expect(listObj.overAllWrapper.classList.contains('custom-class-one')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class-one')).toBe(true);
            expect(listObj.overAllWrapper.classList.contains('custom-class-two')).toBe(true);
            expect(listObj.popupWrapper.classList.contains('custom-class-two')).toBe(true);
        });   
    });
    describe('EJ2-39990 MultiSelect component in mobile mode with initial value page not scrolled', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { "Name": "Australia", "Code": "AU", "Start": "A" },
            { "Name": "Bermuda", "Code": "BM", "Start": "B" },
            { "Name": "Canada", "Code": "CA", "Start": "C" },
            { "Name": "Cameroon", "Code": "CM", "Start": "C" },
            { "Name": "Denmark", "Code": "DK", "Start": "D" },
            { "Name": "France", "Code": "FR", "Start": "F" },
            { "Name": "Finland", "Code": "FI", "Start": "F" },
            { "Name": "Germany", "Code": "DE", "Start": "G" },
            { "Name": "Greenland", "Code": "GL", "Start": "G" },
            { "Name": "Hong Kong", "Code": "HK", "Start": "H" },
            { "Name": "India", "Code": "IN", "Start": "I" },
            { "Name": "Italy", "Code": "IT", "Start": "I" },
            { "Name": "Japan", "Code": "JP", "Start": "J" },
            { "Name": "Mexico", "Code": "MX", "Start": "M" },
            { "Name": "Norway", "Code": "NO", "Start": "N" },
            { "Name": "Poland", "Code": "PL", "Start": "P" },
            { "Name": "Switzerland", "Code": "CH", "Start": "S" },
            { "Name": "United Kingdom", "Code": "GB", "Start": "U" },
            { "Name": "United States", "Code": "US", "Start": "U" }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Checkbox with allowFiltering', () => {
            let currentAgent: string = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name' },
                mode : 'CheckBox',
                placeholder: 'Select an employee',
                popupHeight: '300px',
                value: ['Australia'],
            });
            listObj.appendTo(element);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(true);
            listObj.hidePopup();
            listObj.destroy();
            Browser.userAgent = currentAgent;
        });
        it('Checkbox without allowFiltering', () => {
            let currentAgent: string = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name' },
                mode : 'CheckBox',
                placeholder: 'Select an employee',
                popupHeight: '300px',
                value: ['Australia'],
                allowFiltering : false,
            });
            listObj.appendTo(element);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
            listObj.hidePopup();
            listObj.destroy();
            Browser.userAgent = currentAgent;
        });
        it('With grouping', () => {
            let currentAgent: string = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name', groupBy: 'Start' },
                mode : 'CheckBox',
                placeholder: 'Select an employee',
                value: ['Australia'],
                popupHeight: '300px',
            });
            listObj.appendTo(element);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(true);
            listObj.hidePopup();
            listObj.destroy();
            Browser.userAgent = currentAgent;
        });
        it('With grouping without allowFiltering', () => {
            let currentAgent: string = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name', groupBy: 'Start' },
                mode : 'CheckBox',
                placeholder: 'Select an employee',
                popupHeight: '300px',
                value: ['Australia'],
                allowFiltering: false,
            });
            listObj.appendTo(element);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
            listObj.hidePopup();
            listObj.destroy();
            Browser.userAgent = currentAgent;
        });
        it('Grouping with checkbox', () => {
            let currentAgent: string = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name', groupBy: 'Start' },
                enableGroupCheckBox: true,
                mode : 'CheckBox',
                placeholder: 'Select an employee',
                value: ['Australia'],
                popupHeight: '300px',
            });
            listObj.appendTo(element);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(true);
            listObj.hidePopup();
            listObj.destroy();
            Browser.userAgent = currentAgent;
        });
        it('Grouping with checkbox without allowFiltering', () => {
            let currentAgent: string = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name', groupBy: 'Start' },
                enableGroupCheckBox: true,
                mode : 'CheckBox',
                placeholder: 'Select an employee',
                popupHeight: '300px',
                value: ['Australia'],
                allowFiltering: false,
            });
            listObj.appendTo(element);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
            listObj.hidePopup();
            listObj.destroy();
            Browser.userAgent = currentAgent;
        });
        it('Grouping with checkbox with selectAll', () => {
            let currentAgent: string = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name', groupBy: 'Start' },
                enableGroupCheckBox: true,
                showSelectAll: true,
                mode : 'CheckBox',
                placeholder: 'Select an employee',
                value: ['Australia'],
                popupHeight: '300px',
            });
            listObj.appendTo(element);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(true);
            listObj.hidePopup();
            listObj.destroy();
            Browser.userAgent = currentAgent;
        });
        it('Grouping with checkbox with selectAll without allowFiltering', () => {
            let currentAgent: string = Browser.userAgent;
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'Name', value: 'Name', groupBy: 'Start' },
                enableGroupCheckBox: true,
                mode : 'CheckBox',
                placeholder: 'Select an employee',
                popupHeight: '300px',
                value: ['Australia'],
                allowFiltering: false,
                showSelectAll: true,
            });
            listObj.appendTo(element);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
            (<any>listObj).renderPopup();
            listObj.showPopup();
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(document.body.classList.contains('e-popup-full-page')).toBe(false);
            listObj.hidePopup();
            listObj.destroy();
            Browser.userAgent = currentAgent;
        });
    });
    describe('EJ2-40111: Incorrect count in the multiselect field when multiple items are selected', () => {
        let listObj: MultiSelect;
        let divElement: HTMLElement = createElement('div', { id: 'divElement' });
        divElement.style.width = '300px';
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            {displayName: 'SMITH,- 00000001', npi: '00000001'},
            {displayName: 'JOHNSON, JAMES WILLIAM- 00000002', npi: '00000002'},
            {displayName: 'SANDERS, JASON ADAMCILGIRIST  - 00000003', npi: '00000003'},
            {displayName: 'ERICSON, VANESSA  - 00000004', npi: '00000004'},
            ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Update  with 1st value which has less length than the input element', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'displayName', value: 'npi' },
                mode : "CheckBox",
                showDropDownIcon: true,
                showSelectAll: true,
                allowFiltering: true,
                value: ['00000001'],
                width: '300px'
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect((<any>listObj).text).toBe("SMITH,- 00000001");
            listObj.hidePopup();
            listObj.destroy();
        });
        it('Update with 3rd value which has more length than the input element', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'displayName', value: 'npi' },
                mode : "CheckBox",
                showDropDownIcon: true,
                showSelectAll: true,
                allowFiltering: true,
                value: ['00000003'],
                width: '300px'
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect((<any>listObj).text).toBe("SANDERS, JASON ADAMCILGIRIST  - 00000003");
            listObj.hidePopup();
            listObj.destroy();
        });
        it('Update with 2nd and then 1st value respectively', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { text: 'displayName', value: 'npi' },
                mode : "CheckBox",
                showDropDownIcon: true,
                showSelectAll: true,
                allowFiltering: true,
                value: ['00000002', '00000001'],
            });
            listObj.appendTo(element);
            listObj.showPopup();
            expect((<any>listObj).text).toBe("JOHNSON, JAMES WILLIAM- 00000002,SMITH,- 00000001");
            listObj.hidePopup();
            listObj.destroy();
        });
    });
    describe('EJ2-41323: Not able to select the text and edit', () => {
        let listObj: MultiSelect;
        let divElement: HTMLElement = createElement('div', { id: 'divElement' });
        divElement.style.width = '300px';
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                listObj.destroy();
                element.remove();
            }
        });
        it('Check the cursor position in the filtering action', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'],
                showDropDownIcon: true,
                width: '300px'
            });
            listObj.appendTo(element);
            (<any>listObj).focusInHandler();
            (<any>listObj).inputElement.value = "syncfusion";
            (<any>listObj).inputElement.selectionStart = 2;
            (<any>listObj).inputElement.selectionEnd = 3;
            expect((<any>listObj).inputElement.selectionStart).toBe(2);
            expect((<any>listObj).inputElement.selectionEnd).toBe(3);
            listObj.destroy();
        });
        it('Check the cursor position on checkbox selection', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'],
                showDropDownIcon: true,
                width: '300px',
                mode: 'CheckBox'
            });
            listObj.appendTo(element);
            listObj.showPopup();
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "syncfusion";
            (<any>listObj).checkBoxSelectionModule.filterInput.value = "syncfusion";
            (<any>listObj).checkBoxSelectionModule.filterInput.selectionStart = 2;
            (<any>listObj).checkBoxSelectionModule.filterInput.selectionEnd = 3;
            expect((<any>listObj).checkBoxSelectionModule.filterInput.selectionStart).toBe(2);
            expect((<any>listObj).checkBoxSelectionModule.filterInput.selectionEnd).toBe(3);
            listObj.destroy();
        });       
    }); 
    describe('EJ2-41244 Pressing space key selects the first list item in the Multislect checkbox remote data', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        let empList: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA', icon: 'icon' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET', icon: 'icon' },
            { id: 'list5', text: 'Oracle' },
            { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('Checkbox mode with allowFiltering for remote data', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: "CheckBox", fields: { value: 'EmployeeID', text: 'FirstName' }, allowFiltering: true });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(() => {
                setTimeout(() => {
                    let keyboardEventArgs: any = { preventDefault: (): void => { }, };
                    (<any>listObj).inputElement.value = 'Na';
                    let listElement: any = (<any>listObj).ulElement.querySelector("li.e-list-item");
                    expect(listElement.classList.contains('e-item-focus')).toBe(false);       
                    keyboardEventArgs.keyCode = 32;
                    keyboardEventArgs.code = 'Space';
                    (<any>listObj).onKeyDown(keyboardEventArgs);
                    expect(listElement.classList.contains('e-active')).toBe(false);      
                    listObj.destroy();
                    done();
                }, 2000);
            }, 800);
        });
        it('Checkbox mode without allowFiltering for remote data', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: remoteData, mode: "CheckBox", fields: { value: 'EmployeeID', text: 'FirstName' }, allowFiltering: false });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(() => {
                setTimeout(() => {
                    let keyboardEventArgs: any = { preventDefault: (): void => { }, };
                    let listElement: any = (<any>listObj).ulElement.querySelector("li.e-list-item");
                    expect(listElement.classList.contains('e-item-focus')).toBe(false);       
                    expect(listElement.classList.contains('e-active')).toBe(false);      
                    listObj.destroy();
                    done();
                }, 2000);
            }, 800);
        });
        it('Checkbox mode with allowFiltering for local data', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: empList, mode: "CheckBox", fields: { value: 'id', text: 'text' }, allowFiltering: true });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(() => {
                setTimeout(() => {
                    let keyboardEventArgs: any = { preventDefault: (): void => { }, };
                    (<any>listObj).inputElement.value = 'JA';
                    let listElement: any = (<any>listObj).ulElement.querySelector("li.e-list-item");
                    expect(listElement.classList.contains('e-item-focus')).toBe(false);       
                    keyboardEventArgs.keyCode = 32;
                    keyboardEventArgs.code = 'Space';
                    (<any>listObj).onKeyDown(keyboardEventArgs);
                    expect(listElement.classList.contains('e-active')).toBe(false);      
                    listObj.destroy();
                    done();
                }, 2000);
            }, 800);
        });
        it('Checkbox mode without allowFiltering for local data', (done) => {
            listObj = new MultiSelect({ hideSelectedItem: false, dataSource: empList, mode: "CheckBox", fields: { value: 'id', text: 'text' }, allowFiltering: false });
            listObj.appendTo(element);
            listObj.showPopup();
            setTimeout(() => {
                setTimeout(() => {
                    let keyboardEventArgs: any = { preventDefault: (): void => { }, };
                    let listElement: any = (<any>listObj).ulElement.querySelector("li.e-list-item");
                    expect(listElement.classList.contains('e-item-focus')).toBe(false);       
                    expect(listElement.classList.contains('e-active')).toBe(false);      
                    listObj.destroy();
                    done();
                }, 2000);
            }, 800);
        });
    });
	describe('EJ2-41334 Maximum call stack size exceeded when enable allowFiltering and allowCustomValue in Mutiselect', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let  originalTimeout: number;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let remoteData: DataManager = new DataManager({ url: '/api/Employees', adaptor: new ODataV4Adaptor });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (element) {
                element.remove();
            }
        });
        it('enter custom value and focus out and focus in', (done) => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: remoteData,
                fields: { value: 'EmployeeID', text: 'FirstName' },
                query: new Query().take(4),
                width: '250px',
                popupWidth: '250px',
                popupHeight: '300px',
                sortOrder: "Ascending",
            });
            listObj.appendTo(element);
            (<any>listObj).inputFocus = true;
            (<any>listObj).showPopup();
            (<any>listObj).inputElement.value = "RUBY";
            (<any>listObj).inputFocus = false;
            (<any>listObj).inputElement.value = "";
            (<any>listObj).hidePopup();
            (<any>listObj).inputFocus = true;
            (<any>listObj).showPopup();
            setTimeout(() => {
                expect((<any>listObj).isPopupOpen()).toBe(true);
                listObj.destroy();
                done();
            }, 800);
        });
    });  
    describe('BLAZ-6160 Popup shows empty data in the MultiSelect component, while adding the template with checkbox mode', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect', attrs: { 'type': 'text' } });
        let empList: { [key: string]: Object }[] = [
            { "Name": "Australia", "Code": "AU", "Start": "A" },
            { "Name": "Bermuda", "Code": "BM", "Start": "B" },
            { "Name": "Canada", "Code": "CA", "Start": "C" },
            { "Name": "Cameroon", "Code": "CM", "Start": "C" },
            { "Name": "Denmark", "Code": "DK", "Start": "D" }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('close popup and open again to show all list item correctly', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: empList,
                fields: { value: 'EmployeeID', text: 'FirstName' },
                width: '250px',
                popupWidth: '250px',
                popupHeight: '300px',
                sortOrder: "Ascending",
            });
            listObj.appendTo(element);
            (<any>listObj).inputElement.value = "Australia";
            (<any>listObj).inputFocus = true;
            (<any>listObj).showPopup();
            (<any>listObj).inputFocus = false;
            (<any>listObj).hidePopup();
            (<any>listObj).inputFocus = true;
            (<any>listObj).showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
                expect( (<any>listObj).isPopupOpen()).toBe(true);
                expect(list[0].classList.contains('e-hide-listitem')).toBe(false);
                expect(list[0].classList.contains('e-item-focus')).toBe(true);
                for (let a=0; a<list.length; a++)
                {
                    expect(list[a].classList.contains('e-list-item')).toBe(true);
                }
        });
    });
    describe('EJ2-42061 - Preselected value is added to the control, if we provide invalid value', () => {
        let listObj: any;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let countries: { [key: string]: Object }[] = [
            { Name: "Australia", Code: "AU" },
            { Name: "Bermuda", Code: "BM" },
            { Name: "Canada", Code: "CA" },
            { Name: "Cameroon", Code: "CM" },
            { Name: "Denmark", Code: "DK" },
            { Name: "France", Code: "FR" },
            { Name: "Greenland", Code: "GL" },
            { Name: "Hong Kong", Code: "HK" },
            { Name: "India", Code: "IN" },
            { Name: "Italy", Code: "IT" },
            { Name: "Japan", Code: "JP" },
            { Name: "Mexico", Code: "MX" },
            { Name: "Norway", Code: "NO" },
            { Name: "Poland", Code: "PL" },
            { Name: "Switzerland", Code: "CH" },
            { Name: "United Kingdom", Code: "GB" },
            { Name: "United States", Code: "US" }
        ];
        beforeEach(() => {
            document.body.appendChild(mEle);
            listObj = new MultiSelect({
                dataSource: countries,
                fields: { text: 'Name', value: 'Code' },
                value: ['AU', 'CM', 'AM', 'PL'],
            });
            listObj.appendTo(mEle);
        });
        afterEach(() => {
            listObj.destroy();
            mEle.remove();
        });
        it('default mode', () => {
            listObj.mode = "Default";
            expect(listObj.value.length).toBe(3);
            expect(listObj.value[0]).toBe("AU");
            expect(listObj.value[1]).toBe("CM");
            expect(listObj.value[2]).toBe("PL");
        });
        it('delimiter mode', () => {
            listObj.mode = "Delimiter";
            expect(listObj.value.length).toBe(3);
            expect(listObj.value[0]).toBe("AU");
            expect(listObj.value[1]).toBe("CM");
            expect(listObj.value[2]).toBe("PL");
        });
        it('delimiter mode', () => {
            listObj.mode = "Box";
            expect(listObj.value.length).toBe(3);
            expect(listObj.value[0]).toBe("AU");
            expect(listObj.value[1]).toBe("CM");
            expect(listObj.value[2]).toBe("PL");
        });
    });
    describe('Preselected value is added to the control, if we provide invalid value', () => {
        let listObj: any;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        beforeAll(() => {
            document.body.appendChild(mEle);
            listObj = new MultiSelect({
                value: ['AU', 'CM', 'AM', 'PL']
            });
            listObj.appendTo(mEle);
        });
        afterAll(() => {
            listObj.destroy();
            mEle.remove();
        });
        it('without datasource', () => {
            expect(listObj.value.length).toBe(0);
            //invalid value will be prevented from adding to the control when allowcustomvalue is false
            listObj.allowCustomValue = true;
            listObj.value = ['Sync'];
            expect(listObj.value.length).toBe(1);
            expect(listObj.value[0]).toBe('Sync');
        });
    });
    describe('Invalid data allowed if invalid value is set in value property when allowcustom is true', () => {
        let listObj: any;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let originalTimeout: number;
        let remoteData: DataManager = new DataManager({ 
            url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
            adaptor: new WebApiAdaptor ,
            crossDomain: true
         });
        beforeAll((done) => {
            document.body.appendChild(mEle);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            listObj = new MultiSelect({
                dataSource: remoteData,
                fields: {text: 'FirstName', value: 'FirstName'},
                value: ['Andrew Fuller', 'Sync'],
                allowCustomValue: true
            });
            listObj.appendTo(mEle);
            done();
        });
        afterAll(() => {
           jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            listObj.destroy();
            mEle.remove();
        });
        it('value property with invalid data', (done) => {
            setTimeout(() => {
                expect(listObj.value.length).toBe(2);
                done();
            }, 800);
        });
    });
    describe('value property with disabled allowCustomValue', () => {
        let listObj: any;
        let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let originalTimeout: number;
        let remoteData: DataManager = new DataManager({ 
            url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
            adaptor: new WebApiAdaptor ,
            crossDomain: true
         });
        beforeAll((done) => {
            document.body.appendChild(mEle);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            listObj = new MultiSelect({
                dataSource: remoteData,
                fields: {text: 'FirstName', value: 'FirstName'},
                value: ['Andrew Fuller'],
            });
            listObj.appendTo(mEle);
            done();
        });
        afterAll(() => {
           jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            listObj.destroy();
            mEle.remove();
        });
        it('preselect value', (done) => {
            setTimeout(() => {
                expect(listObj.value.length).toBe(1);
                let values: string[] = [];
                values.push('Andrew Fuller');
                let checkVal: Query = (<any>listObj).getForQuery(values);
                expect(checkVal.queries[0].e.value).toBe('Andrew Fuller');
                done();
            }, 800);
        });
    });
    describe('bug(EJ2-42714): Cannot read property filter of undefined in multiselect when bind the value', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let remoteData: DataManager = new DataManager({ 
            url: 'https://ej2services.syncfusion.com/production/web-services/api/Employees',
            adaptor: new WebApiAdaptor ,
            crossDomain: true
         });
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(ele);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (ele) {
                ele.remove();
            }
        });
        // it('remoteData and value property set dyanamically', (done) => {
        //     let listObj: MultiSelect = new MultiSelect({
        //         query: new Query().select(['FirstName', 'EmployeeID']).take(10).requiresCount(),
        //         fields: { text: 'FirstName', value: 'EmployeeID' },
        //         placeholder: 'Select name',
        //         sortOrder: 'Ascending',
        //     });         
        //     listObj.appendTo('#multi');
        //     listObj.dataSource = remoteData;
        //     listObj.value = [6];
        //     listObj.dataBind();
        //     setTimeout(() => {
        //         expect((listObj as any).viewWrapper.innerText).toBe('Michael Suyama');
        //         listObj.destroy();
        //         done();
        //     }, 800);
        // });
        // it('value property alone set dyanamically', (done) => {
        //     let listObj: MultiSelect = new MultiSelect({
        //         dataSource : remoteData,
        //         query: new Query().select(['FirstName', 'EmployeeID']).take(10).requiresCount(),
        //         fields: { text: 'FirstName', value: 'EmployeeID' },
        //         placeholder: 'Select name',
        //         sortOrder: 'Ascending',
        //     });         
        //     listObj.appendTo('#multi');
        //     listObj.value = [6];
        //     listObj.dataBind();
        //     setTimeout(() => {
        //         expect((listObj as any).viewWrapper.innerText).toBe('Michael Suyama');
        //         listObj.destroy();
        //         done();
        //     }, 800);
        // });
    });
    describe('EJ2-42379 - BeforeOpen event triggers when the component is initialized with the pre-select value', () => {
        let element: HTMLInputElement;
        let empList: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET' },
            { id: 'list5', text: 'Oracle' },
            { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' }
        ];
        let ddl: any;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
            if (element) {
                element.remove();
            }
        });
        it('check beforeOpen event with value', () => {
            let isOpen: boolean = false;
            ddl = new MultiSelect({
                dataSource: empList,
                fields: { text: 'text',value:'text' },
                value: ['JAVA'],
                beforeOpen: (): void => {
                    isOpen = true;
                }
            });
            ddl.appendTo(element);
            expect(isOpen).toBe(false);
            ddl.showPopup();
            expect(isOpen).toBe(true);
            ddl.hidePopup();
            isOpen = false;
            ddl.showPopup();
            expect(isOpen).toBe(true);
            ddl.hidePopup();
            ddl.destroy();
        });
        it('check beforeOpen event without value', () => {
            let isOpen: boolean = false;
            ddl = new MultiSelect({
                dataSource: empList,
                fields: { text: 'text',value:'text' },
                beforeOpen: (): void => {
                    isOpen = true;
                }
            });
            ddl.appendTo(element);
            expect(isOpen).toBe(false);
            ddl.showPopup();
            expect(isOpen).toBe(true);
            ddl.hidePopup();
            isOpen = false;
            ddl.showPopup();
            expect(isOpen).toBe(true);
            ddl.hidePopup();
            ddl.destroy();
        });
    });
    describe('bug(EJMVC-273): EJ2 Dropdown list is preventing form submission with integer data type as value property', function () {
        let listObj: any;
        beforeEach(function () {
            let inputElement: HTMLElement = createElement('input', { id: 'multiselect' });
            document.body.appendChild(inputElement);
            inputElement.setAttribute('data-val','true');
        });
        afterEach(function () {
            if (listObj) {
                listObj.destroy();
                document.body.innerHTML = '';
            }
        });
        it('Entering the class name without any empty space', function () {
            listObj = new MultiSelect({});
            listObj.appendTo('#multiselect');
            expect(listObj.element.getAttribute('data-val')).toBe('false');
        });
    });
    describe('EJ2-44277', () => {
        let listObj: MultiSelect;
        let popupObj: any;
        let originalTimeout: number;
        let count: number = 0;
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let datasource: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET' },
            { id: 'list5', text: 'Oracle' },
            { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' },
            { id: 'list8', text: 'Racket' },
            { id: 'list9', text: 'F#' }
        ];
        beforeEach(() => {
            document.body.innerHTML = '';
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (ele) {
                ele.remove();
            }
        });
        it('Search a value and click overall clear icon to remove the entered value', (done) => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: datasource,
                allowFiltering: true,
                showClearButton: true,
                fields:{text:"text",value:"text"},
                filtering: function (e) {
                    count++;
                    let query: Query = new Query();
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo('#multi');
            (<any>listObj).wrapperClick(mouseEventArgs);
            setTimeout(()=>{
                (<any>listObj).inputElement.value = "JA";
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 65;
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).keyUp(keyboardEventArgs);
                mouseEventArgs.target = (<any>listObj).overAllClear;
                (<any>listObj).clearAll(mouseEventArgs);
                expect(count).toBe(2);
            done();
        }, 800);
        count = 0;
        });
        it('Search a value and click overall clear icon to remove the entered value after selecting values', (done) => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: datasource,
                allowFiltering: true,
                showClearButton: true,
                value: ["JAVA"],
                fields:{text:"text",value:"text"},
                filtering: function (e) {
                    count++;
                    let query: Query = new Query();
                    query = (e.text !== '') ? query.where('text', 'startswith', e.text, true) : query;
                    e.updateData(datasource, query);
                }
            });
            listObj.appendTo('#multi');
            (<any>listObj).wrapperClick(mouseEventArgs);
            setTimeout(()=>{
                (<any>listObj).inputElement.value = "Rac";
                keyboardEventArgs.altKey = false;
                keyboardEventArgs.keyCode = 67;
                (<any>listObj).keyDownStatus = true;
                (<any>listObj).onInput();
                (<any>listObj).keyUp(keyboardEventArgs);
                mouseEventArgs.target = (<any>listObj).overAllClear;
                (<any>listObj).clearAll(mouseEventArgs);
                expect(count).toBe(2);
            done();
        }, 800);
        count = 0;
        });
    });
    // describe('EJ2-40997', () => {
    //     let listObj: any;
    //     let mouseDownEvent : MouseEvent = document.createEvent('MouseEvent');
    //     mouseDownEvent.initEvent('mousedown');
    //     let mEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
    //     let dataSource: any = [];
    //     for (let i:number = 0; i<= 1000; i++) {
    //         let obj: any = {Name: "Data "+i, Code: i}
    //         dataSource.push(obj);
    //     }
    //     beforeAll(() => {
    //         document.body.appendChild(mEle);
    //     });
    //     afterAll((done) => {
    //         setTimeout(() => {
    //             listObj.destroy();
    //             mEle.remove();
    //         }, 1000);
    //         done();
    //     });
    //     it('Performance checking when clicking Select All for 1000 data', (done) => {
    //         let startTime: any;
    //         let endTime:any;
    //         listObj = new MultiSelect({
    //             dataSource: dataSource,
    //             mode: 'CheckBox',
    //             showSelectAll: true,
    //             maximumSelectionLength: 2000,
    //             popupHeight: 200,
    //             fields: { text: 'Name', value: 'Code' },
    //             selectedAll: function() {
    //                 setTimeout(() => {
    //                     while(listObj.list.querySelectorAll('.e-check').length) {
    //                         if (listObj.list.querySelectorAll('.e-check').length == 1001) {
    //                             endTime = Date.now();
    //                             expect(endTime-startTime).toBeLessThan(4000);
    //                             break;   
    //                         }
    //                     }
    //                 }, 100);
    //                 done();
    //             }
    //         });
    //         listObj.appendTo(mEle);
    //         listObj.showPopup();
    //         if (listObj.isPopupOpen()) {
    //             listObj.popupObj.element.querySelector('.e-selectall-parent').dispatchEvent(mouseDownEvent);
    //             startTime = Date.now();
    //         }
    //     });
    // });
    describe('EJ2-40997', () => {
        let listObj1: any;
        let mouseDownEvent : MouseEvent = document.createEvent('MouseEvent');
        mouseDownEvent.initEvent('mousedown');
        let mEle1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let dataSource: any = [];
        for (let i:number = 0; i<= 100; i++) {
            let obj: any = {Name: "Data "+i, Code: i}
            dataSource.push(obj);
        }
        beforeAll(() => {
            document.body.appendChild(mEle1);
        });
        afterAll((done) => {
            setTimeout(() => {
                listObj1.destroy();
                mEle1.remove();
            }, 1000);
            done();
        });
        it('Performance checking when clicking li item for larger values', (done) => {
            let startTime: any;
            let endTime:any;
            let isChanged: boolean = false;
            listObj1 = new MultiSelect({
                dataSource: dataSource,
                mode: 'CheckBox',
                showSelectAll: true,
                maximumSelectionLength: 2000,
                popupHeight: 200,
                fields: { text: 'Name', value: 'Code' },
                changeOnBlur: false,
                change : () => {
                    isChanged = true;
                },
                selectedAll: function() {
                    setTimeout(() => {
                        while(listObj1.list.querySelectorAll('.e-check').length) {
                            if (listObj1.list.querySelectorAll('.e-check').length == 101) {
                                endTime = Date.now();
                                //expect(endTime-startTime).toBeLessThan(3000);
                                let liItems: any = (<any>listObj1).list.querySelectorAll('li');
                                mouseEventArgs.target = liItems[0];
                                (<any>listObj1).onMouseClick(mouseEventArgs);
                                expect(isChanged).toBe(true);
                                break;   
                            }
                        }
                    }, 100);
                    done();
                }
            });
            listObj1.appendTo(mEle1);
            listObj1.showPopup();
            if (listObj1.isPopupOpen()) {
                listObj1.popupObj.element.querySelector('.e-selectall-parent').dispatchEvent(mouseDownEvent);
                startTime = Date.now();
            }
        });
    });
    describe(' EJ2-47405 ', () => {
        let listObj: any;
        let element: HTMLInputElement;
        let languages: { [key: string]: Object }[] = [
            { id: '1', text: 'JAVA' },
            { id: '2', text: 'C#' },
            { id: '3', text: 'C++' },
        ];
        let games: { [key: string]: Object }[] = [
            { id: 1, text: 'Game1' },
            { id: 2, text: 'Game2' },
            { id: 3, text: 'Game3' },
        ];
        function commonFun(value : any) : void {
            (<any>listObj).inputElement.value = value;
            keyboardEventArgs.keyCode = 113;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 70;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).liCollections.length).toBe(1);
            mouseEventArgs.target = (<any>listObj).liCollections[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).value && (<any>listObj).value.length).not.toBeNull();
        }
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
            if (element) {
                element.remove();
            }
        });
        it('Testing with string as dataSource field value', () => {
            let itemData: any;
            listObj = new MultiSelect({
                dataSource: languages,
                fields: { text: 'text',value:'id' },
                allowCustomValue : true,
                customValueSelection: ( e : any): void => {
                    expect(!isNullOrUndefined(e.newData)).toBe(true);
                },
                removing: ( e : any): void => {
                    itemData = e.itemData;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            commonFun('Vue');
            listObj.showPopup();
            (<any>listObj).focusAtFirstListItem();
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).removelastSelection(keyboardEventArgs);
            expect(!isNullOrUndefined(itemData)).toBe(true);
            expect(itemData.text).toBe('Vue');
            expect(itemData.id).toBe('Vue');
            listObj.hidePopup(); 
            listObj.showPopup();
            commonFun(11);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[title="11"]');
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(!isNullOrUndefined(itemData)).toBe(true);
            expect(itemData.text).toBe('11');
            expect(itemData.id).toBe('11');
            listObj.showPopup();
            commonFun('12');
            keyboardEventArgs.which = 1;
            (<any>listObj).clearAll(keyboardEventArgs);
            expect(!isNullOrUndefined(itemData)).toBe(true);
           listObj.destroy();
        });
        it('Testing with int as dataSource field value', () => {
            let itemData: any;
            listObj = new MultiSelect({
                dataSource: games,
                fields: { text: 'text',value:'id' },
                allowCustomValue : true,
                removing: ( e : any): void => {
                    itemData = e.itemData;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            commonFun('Vue');
            listObj.showPopup();
            (<any>listObj).focusAtFirstListItem();
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).removelastSelection(keyboardEventArgs);
            expect(!isNullOrUndefined(itemData)).toBe(true);
            expect(itemData.text).toBe('Vue');
            expect(itemData.id).not.toBe('Vue');
            expect(typeof itemData.id).toBe('number');
            listObj.hidePopup(); 
            listObj.showPopup();
            commonFun(11);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[title="11"]');
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(!isNullOrUndefined(itemData)).toBe(true);
            expect(itemData.text).toBe('11');
            expect(itemData.id).not.toBe('11');
            expect(typeof itemData.id).toBe('number');
            listObj.showPopup();
            commonFun('12');
            keyboardEventArgs.which = 1;
            (<any>listObj).clearAll(keyboardEventArgs);
            expect(!isNullOrUndefined(itemData)).toBe(true);
           listObj.destroy();
        });
        it('Testing with int type number array as dataSource', () => {
            let itemData: any;
            listObj = new MultiSelect({
                dataSource: [1,2,3],
                allowCustomValue : true,
                removing: ( e : any): void => {
                    itemData = e.itemData;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            commonFun('Vue');
            listObj.showPopup();
            (<any>listObj).focusAtFirstListItem();
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).removelastSelection(keyboardEventArgs);
            expect(!isNullOrUndefined(itemData)).toBe(true);
            expect(itemData).toBe('Vue');
            listObj.hidePopup(); 
            listObj.showPopup();
            commonFun(11);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[title="11"]');
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(!isNullOrUndefined(itemData)).toBe(true);
            expect(itemData).toBe(11);
            expect(typeof itemData).toBe('number');
            listObj.showPopup();
            commonFun('12');
            keyboardEventArgs.which = 1;
            (<any>listObj).clearAll(keyboardEventArgs);
            expect(!isNullOrUndefined(itemData)).toBe(true);
           listObj.destroy();
        });
        it('Testing with string type number array as dataSource', () => {
            let itemData: any;
            listObj = new MultiSelect({
                dataSource: ['1','2','3'],
                allowCustomValue : true,
                removing: ( e : any): void => {
                    itemData = e.itemData;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            commonFun('Vue');
            listObj.showPopup();
            (<any>listObj).focusAtFirstListItem();
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).removelastSelection(keyboardEventArgs);
            expect(!isNullOrUndefined(itemData)).toBe(true);
            expect(itemData).toBe('Vue');
            listObj.hidePopup(); 
            listObj.showPopup();
            commonFun(11);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[title="11"]');
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(!isNullOrUndefined(itemData)).toBe(true);
            expect(itemData).toBe('11');
            listObj.showPopup();
            commonFun('12');
            keyboardEventArgs.which = 1;
            (<any>listObj).clearAll(keyboardEventArgs);
            expect(!isNullOrUndefined(itemData)).toBe(true);
           listObj.destroy();
        });
        it('Testing with boolean values as dataSource', () => {
            let itemData: any;
            listObj = new MultiSelect({
                dataSource: [true, false],
                allowCustomValue : true,
                removing: ( e : any): void => {
                    itemData = e.itemData;
                }
            });
            listObj.appendTo(element);
            listObj.showPopup();
            commonFun('Vue');
            listObj.showPopup();
            (<any>listObj).focusAtFirstListItem();
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).removelastSelection(keyboardEventArgs);
            expect(!isNullOrUndefined(itemData)).toBe(true);
            expect(itemData).toBe('Vue');
            listObj.hidePopup(); 
            listObj.showPopup();
            commonFun(11);
            let elem: HTMLElement = (<any>listObj).chipCollectionWrapper.querySelector('span[title="11"]');
            (<any>listObj).onChipRemove({ which: 1, button: 1, target: elem.lastElementChild, preventDefault: function () { } });
            expect(!isNullOrUndefined(itemData)).toBe(true);
            expect(itemData).toBe('11');
            listObj.showPopup();
            commonFun('12');
            keyboardEventArgs.which = 1;
            (<any>listObj).clearAll(keyboardEventArgs);
            expect(!isNullOrUndefined(itemData)).toBe(true);
           listObj.destroy();
        });
    });
    // describe('EJ2-47806 - When we clear the value, the previously selected data appears in popup', () => {
    //     let listObj: MultiSelect;
    //     let originalTimeout: number;
    //     let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
    //     beforeAll((done) => {
    //         document.body.innerHTML = '';
    //         document.body.appendChild(element);
    //         originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    //         listObj = new MultiSelect({
    //             allowCustomValue: true, allowFiltering : true,
    //             dataSource: new DataManager({
    //                 url: "https://services.odata.org/V4/Northwind/Northwind.svc/Customers",
    //                 adaptor: new ODataV4Adaptor(),
    //                 crossDomain: true
    //             }),
    //             query: new Query().select(["ContactName", "CustomerID"]).take(3),
    //             fields: { text: "ContactName", value: "CustomerID" },
    //             value : ["ALFKI"],
    //         });
    //         listObj.appendTo(element);
    //         done();
    //     });
    //     afterAll(() => {
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    //         if (element) {
    //             element.remove();
    //         }
    //     });
    //     it('Testing the li element count in popup after removed the typed custom value and resolve coverage issue', (done) => {
    //         listObj.showPopup();
    //         (<any>listObj).inputFocus = true;
    //         (<any>listObj).inputElement.value = "ma";
    //         keyboardEventArgs.altKey = false;
    //         keyboardEventArgs.keyCode = 70;
    //         setTimeout(() => {
    //             (<any>listObj).keyDownStatus = true;
    //             (<any>listObj).onInput();
    //             (<any>listObj).keyUp(keyboardEventArgs);
    //             setTimeout(() => {
    //                 (<any>listObj).inputElement.value = '';
    //                 keyboardEventArgs.altKey = false;
    //                 keyboardEventArgs.keyCode = 8;
    //                 (<any>listObj).keyDownStatus = true;
    //                 (<any>listObj).onInput();
    //                 (<any>listObj).keyUp(keyboardEventArgs);
    //                 expect(listObj.ulElement.querySelectorAll("li.e-list-item").length).toBe(3);
    //                 done();
    //             }, 1000);
    //         }, 1000);        
    //     });
    // });
    describe('EJ2-48286 - When we paste the content in the MultiSelect, the pasted content gets hidden in the input', () => {
        let element: HTMLInputElement;
        let dataList: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET' },
            { id: 'list5', text: 'Oracle' },
            { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' }
        ];
        let mulObj: any;
        let PasteEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, type: "paste" };
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
            if (element) {
                element.remove();
            }
        });
        it('Check with default case with long content', (done) => {
            mulObj = new MultiSelect({
                dataSource: dataList,
                fields: { text: 'text',value:'text' },
                value: ['JAVA'],
            });
            mulObj.appendTo(element);
            expect(mulObj.inputElement.size).toBe(5);
            mulObj.showPopup();
            mulObj.inputElement.value = 'MultiSelect Dropdown';
            PasteEventArgs.target = mulObj.inputElement;
            mulObj.pasteHandler(PasteEventArgs);
            setTimeout(() => {
                expect(mulObj.inputElement.size).not.toBe(5);
                expect(mulObj.inputElement.size).toBe(20);
                let listElement: any = (<any>mulObj).ulElement.querySelectorAll("li.e-list-item");
                expect(listElement.length).toBe(7);
                mulObj.destroy();
                done();
            }, 0);
        });
        it('Check with custom value case with long content', (done) => {
            mulObj = new MultiSelect({
                dataSource: dataList,
                fields: { text: 'text',value:'text' },
                value: ['JAVA'],
                allowCustomValue : true,
            });
            mulObj.appendTo(element);
            expect(mulObj.inputElement.size).toBe(5);
            mulObj.showPopup();
            mulObj.inputElement.value = 'MultiSelect Dropdown';
            PasteEventArgs.target = mulObj.inputElement;
            mulObj.pasteHandler(PasteEventArgs);
            setTimeout(() => {
                expect(mulObj.inputElement.size).not.toBe(5);
                expect(mulObj.inputElement.size).toBe(20);
                let listElement: any = (<any>mulObj).ulElement.querySelectorAll("li.e-list-item");
                expect(listElement.length).toBe(1);
                expect(listElement[0].innerHTML).toBe('MultiSelect Dropdown')
                mulObj.destroy();
                done();
            }, 0);
        });
        it('Check with short placeholder and with long content', (done) => {
            mulObj = new MultiSelect({
                dataSource: dataList,
                fields: { text: 'text',value:'text' },
                placeholder : 'Search'
            });
            mulObj.appendTo(element);
            expect(mulObj.inputElement.size).toBe(6);
            mulObj.showPopup();
            mulObj.inputElement.value = 'MultiSelect Dropdown';
            PasteEventArgs.target = mulObj.inputElement;
            mulObj.pasteHandler(PasteEventArgs);
            setTimeout(() => {
                expect(mulObj.inputElement.size).not.toBe(6);
                expect(mulObj.inputElement.size).toBe(20);
                let listElement: any = (<any>mulObj).ulElement.querySelectorAll("li.e-list-item");
                expect(listElement.length).toBe(7);
                mulObj.destroy();
                done();
            }, 0);
        });    
        it('Check with long placeholder and with long content', (done) => {
            mulObj = new MultiSelect({
                dataSource: dataList,
                fields: { text: 'text',value:'text' },
                placeholder : 'Search any dropdown component'
            });
            mulObj.appendTo(element);
            expect(mulObj.inputElement.size).toBe(29);
            mulObj.showPopup();
            mulObj.inputElement.value = 'MultiSelect Dropdown';
            PasteEventArgs.target = mulObj.inputElement;
            mulObj.pasteHandler(PasteEventArgs);
            setTimeout(() => {
                expect(mulObj.inputElement.size).not.toBe(20);
                expect(mulObj.inputElement.size).toBe(29);
                let listElement: any = (<any>mulObj).ulElement.querySelectorAll("li.e-list-item");
                expect(listElement.length).toBe(7);
                mulObj.destroy();
                done();
            }, 0);
        });    
    });
    describe('EJ2-48220 - While scrolling headers are duplicated and overlapped with items in Multiselect with Grouping case', () => {
        let element: HTMLInputElement;
        let datasource: { [key: string]: Object }[] = [
            { vegetable: 'Cabbage', category: 'Leafy and Salad', id : 'theme1' }, { vegetable: 'Spinach', category: 'Leafy and Salad' , id : 'theme2'},
            { vegetable: 'Chickpea', category: 'Beans' , id : 'theme3'}, { vegetable: 'Green bean', category: 'Beans' , id : 'theme4'},
            { vegetable: 'Horse gram', category: 'Beans' , id : 'theme5'}, { vegetable: 'Garlic', category: 'Bulb and Stem' , id : 'theme6'},
            { vegetable: 'Nopal', category: 'Bulb and Stem' , id : 'theme7'}, { vegetable: 'Onion', category: 'Bulb and Stem' , id : 'theme8'},
          ];
        let multiObj: any;
        let multiSelectObj: any;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
            if (element) {
                element.remove();
            }
        });
        it('Testing the fixed header value updation for value select and popup close cases and resolve the coverage issue', (done) => {
            multiObj = new MultiSelect({
                dataSource: datasource,
                mode: 'Box',
                fields: { groupBy: 'category', text: 'vegetable', value : 'id'},
                popupHeight: '250px',
                placeholder: 'Select a vegetable',
            });
            multiObj.appendTo(element);
            multiObj.showPopup();
            expect(multiObj.isPopupOpen()).toBe(true);
            multiObj.list.style.overflow = 'auto';
            multiObj.list.style.height = '48px';
            multiObj.list.style.display = 'block';
            keyboardEventArgs.keyCode = 40;
            multiObj.list.scrollTop = 90;
            multiObj.onKeyDown(keyboardEventArgs);
            multiObj.onKeyDown(keyboardEventArgs);
            multiObj.onKeyDown(keyboardEventArgs);
            multiObj.onKeyDown(keyboardEventArgs);
            multiObj.onKeyDown(keyboardEventArgs);
            expect(multiObj.list.scrollTop !== 90).toBe(true);
            expect(multiObj.list.scrollTop !== 0).toBe(true);
            setTimeout(() => {
                expect(!isNullOrUndefined(multiObj.fixedHeaderElement)).toBe(true);
                let listItems: Array<HTMLElement> = (<any>multiObj).list.querySelectorAll('li' + ':not(.e-list-group-item)');
                expect(multiObj.fixedHeaderElement.innerHTML).toBe("Bulb and Stem");
                mouseEventArgs.target = listItems[0];
                mouseEventArgs.type = 'click';
                (<any>multiObj).onMouseClick(mouseEventArgs);
                mouseEventArgs.target = listItems[1];
                mouseEventArgs.type = 'click';
                (<any>multiObj).onMouseClick(mouseEventArgs);
                expect(!isNullOrUndefined(multiObj.fixedHeaderElement)).toBe(false);
                multiObj.destroy();
                done();
            }, 450);
        });

        it('Testing the fixed header value updation for value remove cases and resolve the coverage issue', (done) => {
            multiSelectObj = new MultiSelect({
                dataSource: datasource,
                mode: 'Box',
                fields: { groupBy: 'category', text: 'vegetable', value : 'id'},
                popupHeight: '250px',
                placeholder: 'Select a vegetable',
                value : ["theme1"]
            });
            multiSelectObj.appendTo(element);
            multiSelectObj.showPopup();
            expect(multiSelectObj.isPopupOpen()).toBe(true);
            multiSelectObj.list.style.overflow = 'auto';
            multiSelectObj.list.style.height = '48px';
            multiSelectObj.list.style.display = 'block';
            keyboardEventArgs.keyCode = 40;
            multiSelectObj.list.scrollTop = 90;
            multiSelectObj.onKeyDown(keyboardEventArgs);
            multiSelectObj.onKeyDown(keyboardEventArgs);
            multiSelectObj.onKeyDown(keyboardEventArgs);
            multiSelectObj.onKeyDown(keyboardEventArgs);
            multiSelectObj.onKeyDown(keyboardEventArgs);
            expect(multiSelectObj.list.scrollTop !== 90).toBe(true);
            expect(multiSelectObj.list.scrollTop !== 0).toBe(true);
            setTimeout(() => {
                expect(!isNullOrUndefined(multiSelectObj.fixedHeaderElement)).toBe(true);
                expect(multiSelectObj.fixedHeaderElement.innerHTML).toBe("Bulb and Stem");
                (<any>multiSelectObj).focusAtFirstListItem();
                keyboardEventArgs.keyCode = 8;
                (<any>multiSelectObj).removelastSelection(keyboardEventArgs);
                multiSelectObj.hidePopup();
                expect(!isNullOrUndefined(multiSelectObj.fixedHeaderElement)).toBe(false);
                multiSelectObj.destroy();
                done();
            }, 450);
        });
    });
    describe('EJ2-49608', () => {
        let multiselectInstance: any;
        let browserType: any;
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let datasource: { [key: string]: Object }[] = [
            { vegetable: 'Cabbage', category: 'Leafy and Salad', id : 'theme1' }, { vegetable: 'Spinach', category: 'Leafy and Salad' , id : 'theme2'},
            { vegetable: 'Chickpea', category: 'Beans' , id : 'theme3'}, { vegetable: 'Green bean', category: 'Beans' , id : 'theme4'},
            { vegetable: 'Horse gram', category: 'Beans' , id : 'theme5'}, { vegetable: 'Garlic', category: 'Bulb and Stem' , id : 'theme6'},
            { vegetable: 'Nopal', category: 'Bulb and Stem' , id : 'theme7'}, { vegetable: 'Onion', category: 'Bulb and Stem' , id : 'theme8'},
          ];
        beforeAll(() => {
            browserType = Browser.userAgent;
            Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
            document.body.appendChild(ele);
        });
        afterAll(() => {
            ele.remove();
            Browser.userAgent = browserType;
        });
        it('Fixed header width not applying in Firefox', (done) => {
            multiselectInstance = new MultiSelect({
                dataSource: datasource,
                mode: 'Box',
                fields: { groupBy: 'category', text: 'vegetable', value : 'id'},
                popupHeight: '100px',
                placeholder: 'Select a vegetable',
            });
            multiselectInstance.appendTo(ele);
            multiselectInstance.showPopup();
            expect(multiselectInstance.isPopupOpen()).toBe(true);
            multiselectInstance.list.style.overflow = 'auto';
            multiselectInstance.list.style.display = 'block';
            keyboardEventArgs.keyCode = 40;
            multiselectInstance.onKeyDown(keyboardEventArgs);
            multiselectInstance.onKeyDown(keyboardEventArgs);
            multiselectInstance.onKeyDown(keyboardEventArgs);
            multiselectInstance.onKeyDown(keyboardEventArgs);
            multiselectInstance.onKeyDown(keyboardEventArgs);
            setTimeout(() => {
                expect(!isNullOrUndefined(multiselectInstance.fixedHeaderElement)).toBe(true);
                expect(!isNaN(parseInt(multiselectInstance.fixedHeaderElement.style.width))).toBe(true);
                multiselectInstance.destroy();
                done();
            }, 100);
        });
    });
    describe('EJ2MVC-335 - Chip value updated incorrectly in the multiselect component.', () => {
        let element: HTMLInputElement;
        let gameList: { [key: string]: Object }[] = [
            {  Id : "Game1", Game :"22"  },
            {  Id : "22", Game : "Tennis" },
            {  Id:  "Game3", Game :"Basketball" },
        ];
        let multiObj: any;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
            if (element) {
                element.remove();
            }
        });
        it('check the value selection for issue reported case', (done) => {
            multiObj = new MultiSelect({
                dataSource: gameList,
                fields: { text: 'Game', value: 'Id'},
            });
            multiObj.appendTo(element);
            multiObj.showPopup();
            setTimeout(() => {
                let list: Array<HTMLElement> = (<any>multiObj).list.querySelectorAll('li');
                mouseEventArgs.target = list[0];
                mouseEventArgs.type = 'click';
                (<any>multiObj).onMouseClick(mouseEventArgs);
                expect(multiObj.text).toBe("22");
                expect(multiObj.value[0]).toBe("Game1");
                multiObj.hidePopup();
                multiObj.destroy();    
                done();
            }, 100);
        });
        it('check the value selection for value update in rendering case', () => {
            multiObj = new MultiSelect({
                dataSource: gameList,
                fields: { text: 'Game', value: 'Id'},
                value : ["Game1"]
            });
            multiObj.appendTo(element);
            expect(multiObj.text).toBe("22");
            expect(multiObj.value[0]).toBe("Game1");
            multiObj.destroy();    
        });
        it('check the value selection for value update in dynamic case', () => {
            multiObj = new MultiSelect({
                dataSource: gameList,
                fields: { text: 'Game', value: 'Id'},
            });
            multiObj.appendTo(element);
            multiObj.value = ["Game1"];
            multiObj.dataBind();
            expect(multiObj.text).toBe("22");
            expect(multiObj.value[0]).toBe("Game1");
            multiObj.destroy();    
        });
        it('check the value selection', (done) => {
            multiObj = new MultiSelect({
                dataSource: gameList,
                fields: { text: 'Game', value: 'Id'},
            });
            multiObj.appendTo(element);
            multiObj.showPopup();
            setTimeout(() => {
                let list: Array<HTMLElement> = (<any>multiObj).list.querySelectorAll('li');
                mouseEventArgs.target = list[1];
                mouseEventArgs.type = 'click';
                (<any>multiObj).onMouseClick(mouseEventArgs);
                expect(multiObj.text).toBe("Tennis");
                expect(multiObj.value[0]).toBe("22");
                multiObj.hidePopup();
                multiObj.destroy();    
                done();
            }, 100);
        });
    });
    describe('EJ2-51217 - Placeholder encoding in the multiselect component', () => {
        let element: HTMLInputElement;
        let gameList: { [key: string]: Object }[] = [
            {  Id : "Game1", Game :"Cricket"  },
            {  Id : "Game2", Game : "Tennis" },
            {  Id:  "Game3", Game :"Basketball" },
        ];
        let multiObj: any;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
            multiObj.destroy();
            if (element) {
                element.remove();
            }
        });
        it('Testing floatLabelType Always case', () => {
            multiObj = new MultiSelect({
                dataSource: gameList,
                fields: { text: 'Game', value: 'Id'},
                floatLabelType: 'Always',
                placeholder : '&'
            });
            multiObj.appendTo(element);
            let floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe('&');
            multiObj.placeholder = '<',
            multiObj.dataBind();
            floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe('<');
            multiObj.placeholder = 'Mask >LLL<LL (ex: SAMple)',
            multiObj.dataBind();
            floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe('Mask >LLL<LL (ex: SAMple)');
            multiObj.placeholder = "<img src='fail1' onerror='alert();' /> test",
            multiObj.dataBind();
            floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe("<img src='fail1' onerror='alert();' /> test");
            multiObj.placeholder = 'Hi&eacute;rachie article',
            multiObj.dataBind();
            floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe('Hiérachie article');
            multiObj.placeholder = '&amp;&gt;',
            multiObj.dataBind();
            floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe('&>');
            multiObj.placeholder = 'JAVA & ANGULAR',
            multiObj.dataBind();
            floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe('JAVA & ANGULAR');
        });
        it('Testing floatLabelType Auto case', () => {
            multiObj = new MultiSelect({
                dataSource: gameList,
                fields: { text: 'Game', value: 'Id'},
                floatLabelType: 'Auto',
                placeholder: '&'
            });
            multiObj.appendTo(element);
            let floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe('&');
            multiObj.placeholder = '<',
            multiObj.dataBind();
            floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe('<');
            multiObj.placeholder = 'Mask >LLL<LL (ex: SAMple)',
            multiObj.dataBind();
            floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe('Mask >LLL<LL (ex: SAMple)');
            multiObj.placeholder = "<img src='fail1' onerror='alert();' /> test",
            multiObj.dataBind();
            floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe("<img src='fail1' onerror='alert();' /> test");
            multiObj.placeholder = 'Hi&eacute;rachie article',
            multiObj.dataBind();
            floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe('Hiérachie article');
            multiObj.placeholder = '&amp;&gt;',
            multiObj.dataBind();
            floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe('&>');
            multiObj.placeholder = 'JAVA & ANGULAR',
            multiObj.dataBind();
            floatElement = (multiObj as any).componentWrapper.querySelector('.e-float-text');
            expect(floatElement.innerText).toBe('JAVA & ANGULAR');
        });
        it('Testing floatLabelType Never case', () => {
            multiObj = new MultiSelect({
                dataSource: gameList,
                fields: { text: 'Game', value: 'Id'},
                floatLabelType: 'Never',
                placeholder: '&'
            });
            multiObj.appendTo(element);
            expect((<any>multiObj).inputElement.getAttribute('placeholder')).toBe('&');
            multiObj.placeholder = '<',
            multiObj.dataBind();
            expect((<any>multiObj).inputElement.getAttribute('placeholder')).toBe('<');
            multiObj.placeholder = 'Mask >LLL<LL (ex: SAMple)',
            multiObj.dataBind();
            expect((<any>multiObj).inputElement.getAttribute('placeholder')).toBe('Mask >LLL<LL (ex: SAMple)');
            multiObj.placeholder = "<img src='fail1' onerror='alert();' /> test",
            multiObj.dataBind();
            expect((<any>multiObj).inputElement.getAttribute('placeholder')).toBe("<img src='fail1' onerror='alert();' /> test");
            multiObj.placeholder = 'Hi&eacute;rachie article',
            multiObj.dataBind();
            expect((<any>multiObj).inputElement.getAttribute('placeholder')).toBe('Hiérachie article');
            multiObj.placeholder = '&amp;&gt;',
            multiObj.dataBind();
            expect((<any>multiObj).inputElement.getAttribute('placeholder')).toBe('&>');
            multiObj.placeholder = 'JAVA & ANGULAR',
            multiObj.dataBind();
            expect((<any>multiObj).inputElement.getAttribute('placeholder')).toBe('JAVA & ANGULAR');
        });
    });
    describe('EJ2-53956 - While updating custom value as preselected data, clear icon not working in multiselect', () => {
        let element: HTMLInputElement;
        let listObj: any;
        beforeAll(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
        });
        afterAll(() => {
            document.body.innerHTML = '';
            if (element) {
                element.remove();
            }
        });
        it('Testing clear icon', () => {
            listObj = new MultiSelect({
                mode: 'Box',
                popupHeight: 200,
                value: ['list3', 'list6', 'list2'],
                changeOnBlur:true,
                allowCustomValue:true,
                cssClass:'e-outline',
            });
            listObj.appendTo(element);
            expect(listObj.value.length).toBe(3);
            (<any>listObj).clearAll({ preventDefault: function () { } });
            expect(listObj.value.length).toBe(0);
            listObj.destroy();
        });
        it('after adding custom value as preselected value and change value dynamically', () => {
            listObj = new MultiSelect({
                mode: 'Box',
                popupHeight: 200,
                value: ['list3', 'list6', 'list2'],
                changeOnBlur:true,
                allowCustomValue:true,
                cssClass:'e-outline',
            });
            listObj.appendTo(element);
            expect(listObj.value.length).toBe(3);
            (<any>listObj).value = ["abcd"];
            (<any>listObj).dataBind();
            (<any>listObj).clearAll({ preventDefault: function () { } });
            expect(listObj.value.length).toBe(0);
        });
    });
    describe('EJ2-36414 - Provide support to maintain the typed value as chip when control gets out of focus on Box mode', () => {
        let element: HTMLInputElement;
        let gameList: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'C#' }, { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET' }, { id: 'list5', text: 'Oracle' }, { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list9', text: 'F#' }
        ];
        let multiObj: any;
        function customSearch(text: string) : void {
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = element;
            multiObj.wrapperClick(mouseEventArgs);
            multiObj.inputElement.value = text;
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 74;
            multiObj.keyDownStatus = true;
            multiObj.onInput();
            multiObj.keyUp(keyboardEventArgs);
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = document.body;
            multiObj.onBlurHandler(mouseEventArgs);
        }
        beforeEach(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            document.body.innerHTML = '';
            if (element) {
                element.remove();
            }
            if (multiObj) {
                multiObj.destroy();
            }
        });
        it('Testing the custom chip creation on blur', () => {
            multiObj = new MultiSelect({
                dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Box', allowCustomValue: true
            });
            multiObj.appendTo(element);
            customSearch('j');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('j');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
            customSearch('ja');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="ja"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);
        });
        // it('Testing the chip creation on blur for non-custom case', () => {
        //     multiObj = new MultiSelect({
        //         dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Box'
        //     });
        //     multiObj.appendTo(element);
        //     customSearch('j');
        //     expect(multiObj.inputElement.value).toBe('');
        //     expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).toBe(null);
        //     expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
        //     customSearch('JAVA');
        //     expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
        //     expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
        //     customSearch('JAVA');
        //     expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
        //     customSearch('Oracle');
        //     expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list5"]')).not.toBe(null);
        //     expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
        // });
        it('Testing the custom chip creation on blur with filtering', () => {
            multiObj = new MultiSelect({
                dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Box', allowCustomValue: true, allowFiltering: true
            });
            multiObj.appendTo(element);
            customSearch('j');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('j');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
            customSearch('ja');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="ja"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);
        });
        it('Testing the chip creation on blur for non-custom case and filtering case', () => {
            multiObj = new MultiSelect({
                dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Box', allowFiltering: true
            });
            multiObj.appendTo(element);
            customSearch('j');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('Oracle');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list5"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
        });
        // it('Testing the chip creation on blur for hideSelectedItem false case', () => {
        //     multiObj = new MultiSelect({
        //         dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Box', hideSelectedItem: false, allowCustomValue : true
        //     });
        //     multiObj.appendTo(element);
        //     customSearch('j');
        //     expect(multiObj.inputElement.value).toBe('');
        //     expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
        //     expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
        //     customSearch('j');
        //     expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
        //     customSearch('JAVA');
        //     expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
        //     expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
        //     customSearch('JAVA');
        //     expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
        //     customSearch('ja');
        //     expect(multiObj.inputElement.value).toBe('');
        //     expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="ja"]')).not.toBe(null);
        //     expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);
        // });
        it('Testing the chip creation on blur for removing already selected value', () => {
            multiObj = new MultiSelect({
                dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Box', allowCustomValue: true
            });
            multiObj.appendTo(element);
            customSearch('j');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            keyboardEventArgs.which = 1;
            (<any>multiObj).clearAll(keyboardEventArgs);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
            customSearch('j');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
            keyboardEventArgs.which = 1;
            (<any>multiObj).clearAll(keyboardEventArgs);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
        });
    });
    describe('Provide support to maintain the typed value as chip when control gets out of focus for remote date on Box mode', () => {
        let element: HTMLInputElement;
        let multiObj: any;
        let originalTimeout: number;
        let remoteData : DataManager = new DataManager({ url: 'https://ej2services.syncfusion.com/js/development/api/Employees' });
        function customSearch(text: string) : void {
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = element;
            multiObj.wrapperClick(mouseEventArgs);
            multiObj.inputElement.value = text;
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 74;
            multiObj.keyDownStatus = true;
            multiObj.onInput();
            multiObj.keyUp(keyboardEventArgs);
        }
        function customDocumentClick() : void {
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = document.body;
            multiObj.onBlurHandler(mouseEventArgs);
        }
        beforeEach(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;  
        });
        afterEach(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            document.body.innerHTML = '';
            if (element) {
                element.remove();
            }
            if (multiObj) {
                multiObj.destroy();
            }
        });
        it('Testing the custom chip creation on blur', (done) => {
            multiObj = new MultiSelect({
                dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
                addTagOnBlur: true, mode: 'Box', allowCustomValue: true
            });
            multiObj.appendTo(element);
            multiObj.showPopup();
            setTimeout(() => {
                customSearch('j');
                customDocumentClick();
                expect(multiObj.inputElement.value).toBe('');
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
                customSearch('j');
                customDocumentClick();
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
                customSearch('Laura Callahan');
                customDocumentClick();
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Laura Callahan"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);   
                customSearch('Laura Callahan');
                customDocumentClick();
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);   
                customSearch('ja');
                customDocumentClick();   
                expect(multiObj.inputElement.value).toBe('');
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="ja"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);    
                done();
            }, 800);
        });
        // it('Testing the chip creation on blur for non-custom case', (done) => {
        //     multiObj = new MultiSelect({
        //         dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
        //         addTagOnBlur: true, mode: 'Box'
        //     });
        //     multiObj.appendTo(element);
        //     multiObj.showPopup();
        //     setTimeout(() => {
        //         customSearch('j');
        //         customDocumentClick();
        //         expect(multiObj.inputElement.value).toBe('');
        //         expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).toBe(null);
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
        //         customSearch('Laura Callahan');
        //         customDocumentClick();
        //         expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Laura Callahan"]')).not.toBe(null);
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);   
        //         customSearch('Laura Callahan');
        //         customDocumentClick();
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);   
        //         customSearch('Margaret Peacock');
        //         customDocumentClick();
        //         expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Margaret Peacock"]')).not.toBe(null);
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
        //         done();
        //     }, 800);
        // });
        it('Testing the chip creation on blur for removing already selected value', (done) => {
            multiObj = new MultiSelect({
                dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
                addTagOnBlur: true, mode: 'Box', allowCustomValue: true
            });
            multiObj.appendTo(element);
            multiObj.showPopup();
            setTimeout(() => {
                customSearch('j');
                customDocumentClick();
                expect(multiObj.inputElement.value).toBe('');
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
                keyboardEventArgs.which = 1;
                (<any>multiObj).clearAll(keyboardEventArgs);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
                customSearch('j');
                customDocumentClick();
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
                customSearch('Laura Callahan');
                customDocumentClick();
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Laura Callahan"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);   
                keyboardEventArgs.which = 1;
                (<any>multiObj).clearAll(keyboardEventArgs);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
                customSearch('Laura Callahan');
                customDocumentClick();
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Laura Callahan"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);   
                done();
            }, 800);
        });
        // it('Testing the chip creation on blur for hideSelectedItem false case', (done) => {
        //     multiObj = new MultiSelect({
        //         dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
        //         addTagOnBlur: true, mode: 'Box', hideSelectedItem: false
        //     });
        //     multiObj.appendTo(element);
        //     multiObj.showPopup();
        //     setTimeout(() => {
        //         customSearch('j');
        //         customDocumentClick();
        //         expect(multiObj.inputElement.value).toBe('');
        //         expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).toBe(null);
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
        //         customSearch('Laura Callahan');
        //         customDocumentClick();
        //         expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Laura Callahan"]')).not.toBe(null);
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);   
        //         customSearch('Laura Callahan');
        //         customDocumentClick();
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);   
        //         customSearch('Margaret Peacock');
        //         customDocumentClick();
        //         expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Margaret Peacock"]')).not.toBe(null);
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
        //         done();
        //     }, 800);
        // });
        // it('Testing the custom chip creation on blur with filtering', (done) => {
        //     multiObj = new MultiSelect({
        //         dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
        //         addTagOnBlur: true, mode: 'Box', allowCustomValue: true, allowFiltering: true
        //     });
        //     multiObj.appendTo(element);
        //     multiObj.showPopup();
        //     setTimeout(() => {
        //         multiObj.inputFocus = true;
        //         customSearch('j');
        //         setTimeout(() => {
        //             customDocumentClick();
        //             expect(multiObj.inputElement.value).toBe('');
        //             expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
        //             expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
        //             done();
        //         }, 1200);
        //     }, 800);
        // });
        // it('Testing the chip creation on blur for non-custom with filtering', (done) => {
        //     multiObj = new MultiSelect({
        //         dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
        //         addTagOnBlur: true, mode: 'Box', allowFiltering: true
        //     });
        //     multiObj.appendTo(element);
        //     multiObj.showPopup();
        //     setTimeout(() => {
        //         customSearch('Laura Callahan');
        //         setTimeout(() => {
        //             customDocumentClick();
        //             expect(multiObj.inputElement.value).toBe('');
        //             expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Laura Callahan"]')).not.toBe(null);
        //             expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
        //             done();
        //         }, 1200);
        //     }, 800);
        // });
        // it('Testing the chip creation on blur for non-existing in the list but newly filtered value from the dataSource', (done) => {
        //     multiObj = new MultiSelect({
        //         dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
        //         addTagOnBlur: true, mode: 'Box', allowFiltering: true
        //     });
        //     multiObj.appendTo(element);
        //     multiObj.showPopup();
        //     setTimeout(() => {
        //         customSearch('Margaret Peacock');
        //         setTimeout(() => {
        //             customDocumentClick();
        //             expect(multiObj.inputElement.value).toBe('');
        //             expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Margaret Peacock"]')).not.toBe(null);
        //             expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
        //             done();
        //         }, 1200);
        //     }, 800);
        // });
    });
    describe('EJ2-36414 - Provide support to maintain the typed value as chip when control gets out of focus on Default mode', () => {
        let element: HTMLInputElement;
        let gameList: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'C#' }, { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET' }, { id: 'list5', text: 'Oracle' }, { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list9', text: 'F#' }
        ];
        let multiObj: any;
        function customSearch(text: string) : void {
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = element;
            multiObj.wrapperClick(mouseEventArgs);
            multiObj.inputElement.value = text;
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 74;
            multiObj.keyDownStatus = true;
            multiObj.onInput();
            multiObj.keyUp(keyboardEventArgs);
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = document.body;
            multiObj.onBlurHandler(mouseEventArgs);
        }
        beforeEach(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            document.body.innerHTML = '';
            if (element) {
                element.remove();
            }
            if (multiObj) {
                multiObj.destroy();
            }
        });
        it('Testing the custom chip creation on blur', () => {
            multiObj = new MultiSelect({
                dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Default', allowCustomValue: true
            });
            multiObj.appendTo(element);
            customSearch('j');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('j');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
            customSearch('ja');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="ja"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);
        });
        it('Testing the chip creation on blur for non-custom case', () => {
            multiObj = new MultiSelect({
                dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Default'
            });
            multiObj.appendTo(element);
            customSearch('j');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('Oracle');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list5"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
        });
        it('Testing the custom chip creation on blur with filtering', () => {
            multiObj = new MultiSelect({
                dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Default', allowCustomValue: true, allowFiltering: true
            });
            multiObj.appendTo(element);
            customSearch('j');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('j');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
            customSearch('ja');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="ja"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);
        });
        it('Testing the chip creation on blur for non-custom case and filtering case', () => {
            multiObj = new MultiSelect({
                dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Default', allowFiltering: true
            });
            multiObj.appendTo(element);
            customSearch('j');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('Oracle');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list5"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
        });
        it('Testing the chip creation on blur for hideSelectedItem false case', () => {
            multiObj = new MultiSelect({
                dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Default', hideSelectedItem: false, allowCustomValue : true
            });
            multiObj.appendTo(element);
            customSearch('j');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('j');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
            customSearch('ja');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="ja"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);
        });
        it('Testing the chip creation on blur for removing already selected value', () => {
            multiObj = new MultiSelect({
                dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Default', allowCustomValue: true
            });
            multiObj.appendTo(element);
            customSearch('j');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            keyboardEventArgs.which = 1;
            (<any>multiObj).clearAll(keyboardEventArgs);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
            customSearch('j');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
            keyboardEventArgs.which = 1;
            (<any>multiObj).clearAll(keyboardEventArgs);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
            customSearch('JAVA');
            expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="list1"]')).not.toBe(null);
            expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
        });
    });
    describe('Provide support to maintain the typed value as chip when control gets out of focus for remote date on Default mode', () => {
        let element: HTMLInputElement;
        let multiObj: any;
        let originalTimeout: number;
        let remoteData : DataManager = new DataManager({ url: 'https://ej2services.syncfusion.com/js/development/api/Employees' });
        function customSearch(text: string) : void {
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = element;
            multiObj.wrapperClick(mouseEventArgs);
            multiObj.inputElement.value = text;
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 74;
            multiObj.keyDownStatus = true;
            multiObj.onInput();
            multiObj.keyUp(keyboardEventArgs);
        }
        function customDocumentClick() : void {
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = document.body;
            multiObj.onBlurHandler(mouseEventArgs);
        }
        beforeEach(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;  
        });
        afterEach(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            document.body.innerHTML = '';
            if (element) {
                element.remove();
            }
            if (multiObj) {
                multiObj.destroy();
            }
        });
        it('Testing the custom chip creation on blur', (done) => {
            multiObj = new MultiSelect({
                dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
                addTagOnBlur: true, mode: 'Default', allowCustomValue: true
            });
            multiObj.appendTo(element);
            multiObj.showPopup();
            setTimeout(() => {
                customSearch('j');
                customDocumentClick();
                expect(multiObj.inputElement.value).toBe('');
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
                customSearch('j');
                customDocumentClick();
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
                customSearch('Laura Callahan');
                customDocumentClick();
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Laura Callahan"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);   
                customSearch('Laura Callahan');
                customDocumentClick();
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);   
                customSearch('ja');
                customDocumentClick();   
                expect(multiObj.inputElement.value).toBe('');
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="ja"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(3);    
                done();
            }, 800);
        });
        // it('Testing the chip creation on blur for non-custom case', (done) => {
        //     multiObj = new MultiSelect({
        //         dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
        //         addTagOnBlur: true, mode: 'Default'
        //     });
        //     multiObj.appendTo(element);
        //     multiObj.showPopup();
        //     setTimeout(() => {
        //         customSearch('j');
        //         customDocumentClick();
        //         expect(multiObj.inputElement.value).toBe('');
        //         expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).toBe(null);
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
        //         customSearch('Laura Callahan');
        //         customDocumentClick();
        //         expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Laura Callahan"]')).not.toBe(null);
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);   
        //         customSearch('Laura Callahan');
        //         customDocumentClick();
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);   
        //         customSearch('Margaret Peacock');
        //         customDocumentClick();
        //         expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Margaret Peacock"]')).not.toBe(null);
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
        //         done();
        //     }, 800);
        // });
        it('Testing the chip creation on blur for removing already selected value', (done) => {
            multiObj = new MultiSelect({
                dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
                addTagOnBlur: true, mode: 'Default', allowCustomValue: true
            });
            multiObj.appendTo(element);
            multiObj.showPopup();
            setTimeout(() => {
                customSearch('j');
                customDocumentClick();
                expect(multiObj.inputElement.value).toBe('');
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
                keyboardEventArgs.which = 1;
                (<any>multiObj).clearAll(keyboardEventArgs);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
                customSearch('j');
                customDocumentClick();
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
                customSearch('Laura Callahan');
                customDocumentClick();
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Laura Callahan"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);   
                keyboardEventArgs.which = 1;
                (<any>multiObj).clearAll(keyboardEventArgs);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
                customSearch('Laura Callahan');
                customDocumentClick();
                expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Laura Callahan"]')).not.toBe(null);
                expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);   
                done();
            }, 800);
        });
        // it('Testing the chip creation on blur for hideSelectedItem false case', (done) => {
        //     multiObj = new MultiSelect({
        //         dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
        //         addTagOnBlur: true, mode: 'Default', hideSelectedItem: false
        //     });
        //     multiObj.appendTo(element);
        //     multiObj.showPopup();
        //     setTimeout(() => {
        //         customSearch('j');
        //         customDocumentClick();
        //         expect(multiObj.inputElement.value).toBe('');
        //         expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).toBe(null);
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(0);
        //         customSearch('Laura Callahan');
        //         customDocumentClick();
        //         expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Laura Callahan"]')).not.toBe(null);
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);   
        //         customSearch('Laura Callahan');
        //         customDocumentClick();
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);   
        //         customSearch('Margaret Peacock');
        //         customDocumentClick();
        //         expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Margaret Peacock"]')).not.toBe(null);
        //         expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(2);
        //         done();
        //     }, 800);
        // });
        // it('Testing the custom chip creation on blur with filtering', (done) => {
        //     multiObj = new MultiSelect({
        //         dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
        //         addTagOnBlur: true, mode: 'Default', allowCustomValue: true, allowFiltering: true
        //     });
        //     multiObj.appendTo(element);
        //     multiObj.showPopup();
        //     setTimeout(() => {
        //         multiObj.inputFocus = true;
        //         customSearch('j');
        //         setTimeout(() => {
        //             customDocumentClick();
        //             expect(multiObj.inputElement.value).toBe('');
        //             expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="j"]')).not.toBe(null);
        //             expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
        //             done();
        //         }, 1200);
        //     }, 800);
        // });
        // it('Testing the chip creation on blur for non-custom with filtering', (done) => {
        //     multiObj = new MultiSelect({
        //         dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
        //         addTagOnBlur: true, mode: 'Default', allowFiltering: true
        //     });
        //     multiObj.appendTo(element);
        //     multiObj.showPopup();
        //     setTimeout(() => {
        //         customSearch('Laura Callahan');
        //         setTimeout(() => {
        //             customDocumentClick();
        //             expect(multiObj.inputElement.value).toBe('');
        //             expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Laura Callahan"]')).not.toBe(null);
        //             expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
        //             done();
        //         }, 1200);
        //     }, 800);
        // });
        it('Testing the chip creation on blur for non-existing in the list but newly filtered value from the dataSource', (done) => {
            multiObj = new MultiSelect({
                dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
            });
            multiObj.appendTo(element);
            multiObj.showPopup();
            setTimeout(() => {
                customSearch('Margaret Peacock');
                setTimeout(() => {
                    customDocumentClick();
                    expect(multiObj.inputElement.value).toBe('');
                    //expect((<any>multiObj).chipCollectionWrapper.querySelector('span[data-value="Margaret Peacock"]')).not.toBe(null);
                    //expect((<any>multiObj).chipCollectionWrapper.querySelectorAll('span.' + multiSelectData.chips).length).toBe(1);
                    done();
                }, 1200);
            }, 800);
        });
    });
    describe('EJ2-36414 - Provide support to maintain the typed value as chip when control gets out of focus on Delimiter mode', () => {
        let element: HTMLInputElement;
        let gameList: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA' }, { id: 'list2', text: 'C#' }, { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET' }, { id: 'list5', text: 'Oracle' }, { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list9', text: 'F#' }
        ];
        let multiObj: any;
        function customSearch(text: string) : void {
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = element;
            multiObj.wrapperClick(mouseEventArgs);
            multiObj.inputElement.value = text;
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 74;
            multiObj.keyDownStatus = true;
            multiObj.onInput();
            multiObj.keyUp(keyboardEventArgs);
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = document.body;
            multiObj.onBlurHandler(mouseEventArgs);
        }
        beforeEach(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
        });
        afterEach(() => {
            document.body.innerHTML = '';
            if (element) {
                element.remove();
            }
            if (multiObj) {
                multiObj.destroy();
            }
        });
        it('Testing the custom chip creation on blur', () => {
            multiObj = new MultiSelect({
                dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Delimiter', allowCustomValue: true
            });
            multiObj.appendTo(element);
            customSearch('j');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toEqual('j');
            customSearch('JAVA');
            expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toEqual('j, JAVA');
            customSearch('ja');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toEqual('j, JAVA, ja');
        });
        it('Testing the chip creation on blur for non-custom case', () => {
            multiObj = new MultiSelect({
                dataSource: gameList, fields: { text: 'text', value: 'id'}, addTagOnBlur: true, mode: 'Delimiter'
            });
            multiObj.appendTo(element);
            customSearch('j');
            expect(multiObj.inputElement.value).toBe('');
            expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toBe('');
            customSearch('JAVA');
            expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toEqual('JAVA');
            customSearch('JAVA');
            expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toEqual('JAVA');
            customSearch('Oracle');
            expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toEqual('JAVA, Oracle');
        });
    });
    describe('Provide support to maintain the typed value as chip when control gets out of focus for remote date on Delimiter mode', () => {
        let element: HTMLInputElement;
        let multiObj: any;
        let originalTimeout: number;
        let remoteData : DataManager = new DataManager({ url: 'https://ej2services.syncfusion.com/js/development/api/Employees' });
        function customSearch(text: string) : void {
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = element;
            multiObj.wrapperClick(mouseEventArgs);
            multiObj.inputElement.value = text;
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 74;
            multiObj.keyDownStatus = true;
            multiObj.onInput();
            multiObj.keyUp(keyboardEventArgs);
        }
        function customDocumentClick() : void {
            mouseEventArgs.type = 'click';
            mouseEventArgs.target = document.body;
            multiObj.onBlurHandler(mouseEventArgs);
        }
        beforeEach(() => {
            element = <HTMLInputElement>createElement('input', { id: 'multiSelect' });
            document.body.appendChild(element);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;  
        });
        afterEach(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            document.body.innerHTML = '';
            if (element) {
                element.remove();
            }
            if (multiObj) {
                multiObj.destroy();
            }
        });
        it('Testing the custom value on blur', (done) => {
            multiObj = new MultiSelect({
                dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
                addTagOnBlur: true, mode: 'Delimiter', allowCustomValue: true
            });
            multiObj.appendTo(element);
            multiObj.showPopup();
            setTimeout(() => {
                customSearch('j');
                customDocumentClick();
                expect(multiObj.inputElement.value).toBe('');
                expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toEqual('j');
                customSearch('Laura Callahan');
                customDocumentClick();
                expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toEqual('j, Laura Callahan');
                customSearch('Laura Callahan');
                customDocumentClick();
                expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toEqual('j, Laura Callahan');
                customSearch('ja');
                customDocumentClick();   
                expect(multiObj.inputElement.value).toBe('');
                expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toEqual('j, Laura Callahan, ja');
                done();
            }, 800);
        });
        // it('Testing the value on blur for non-custom case', (done) => {
        //     multiObj = new MultiSelect({
        //         dataSource: remoteData, query: new Query().select('FirstName').take(6).requiresCount(), fields: { text: 'FirstName', value: 'FirstName' },
        //         addTagOnBlur: true, mode: 'Delimiter'
        //     });
        //     multiObj.appendTo(element);
        //     multiObj.showPopup();
        //     setTimeout(() => {
        //         customSearch('j');
        //         customDocumentClick();
        //         expect(multiObj.inputElement.value).toBe('');
        //         expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toBe('');
        //         customSearch('Laura Callahan');
        //         customDocumentClick();
        //         expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toEqual('Laura Callahan');
        //         customSearch('Margaret Peacock');
        //         customDocumentClick();
        //         expect((<any>multiObj).delimiterWrapper.parentElement.querySelector('.e-delim-view').innerText).toEqual('Laura Callahan, Margaret Peacock');
        //         done();
        //     }, 800);
        // });
    });
    describe('EJ2-56422-Empty header is created while typing custom value in the input.', () => {
        let listObj: any;
        let popupObj: any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multiselect' });
        let datasource: { [key: string]: Object }[] = [
            { vegetable: 'Cabbage', category: 'Leafy and Salad' , Id: "item1"}, { vegetable: 'Spinach', category: 'Leafy and Salad', Id: "item2" },
            { vegetable: 'Wheatgrass', category: 'Leafy and Salad', Id: "item3" }, { vegetable: 'Yarrow', category: 'Leafy and Salad' , Id: "item4"},
            { vegetable: 'Chickpea', category: 'Beans', Id: "item5" }, { vegetable: 'Green bean', category: 'Beans', Id: "item6" },
            { vegetable: 'Horse gram', category: 'Beans', Id: "item7" }, { vegetable: 'Garlic', category: 'Bulb and Stem', Id: "item8" },
            { vegetable: 'Nopal', category: 'Bulb and Stem', Id: "item9"}, { vegetable: 'Onion', category: 'Bulb and Stem', Id: "item10" }
        ];
        beforeAll(() => {
            document.body.innerHTML = '';
            document.body.appendChild(element);
        });
        afterAll(() => {
            if (element) {
                element.remove();
            }
        });
        it('testing allowcustom with groupby', () => {
            listObj = new MultiSelect({allowCustomValue: true,
                dataSource: datasource,
                fields: { groupBy: 'category', text: 'vegetable', value: 'ID' },});
            listObj.appendTo(element);
            (<any>listObj).inputElement.value = "t";
            keyboardEventArgs.keyCode = 13;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            keyboardEventArgs.altKey = false;
            expect(listObj.liCollections[0].classList.contains('e-list-item')).toBe(true);
            expect(listObj.liCollections[0].classList.contains('e-list-group-item')).toBe(false);
            expect((<any>listObj).ulElement.textContent === "t").toBe(true); 
        });
    });
    describe('EJ2-58650', () => {
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let datasource: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET' },
            { id: 'list5', text: 'Oracle' },
            { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' },
            { id: 'list8', text: 'Racket' },
            { id: 'list9', text: 'F#' }
        ];
        beforeEach(() => {
            document.body.innerHTML = '';
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (ele) {
                ele.remove();
            }
        });
        it('filtering does not work when item template is enabled in the multiselect component.', (done) => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: datasource,
                allowFiltering: true,
                showClearButton: true,
                fields:{text:"text",value:"text"},
                showDropDownIcon: true,
                itemTemplate: '<div><div class="ename"> ${text} </div></div>',
            });
            listObj.appendTo('#multi');
            listObj.showPopup();
            (<any>listObj).inputElement.value = "J";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 74;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect(listObj.ulElement.childElementCount === 1).toBe(true);
            setTimeout(()=>{
            mouseEventArgs.target = (<any>listObj).overAllClear;
            (<any>listObj).clearAll(mouseEventArgs);
            expect(listObj.ulElement.childElementCount === 9).toBe(true);
            done();
            },200);
        });
    });
    describe('EJ2-59153', () => {
        let count: number = 0;
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let datasource: { [key: string]: Object }[] = [
            { id: 'list1', text: 'JAVA' },
            { id: 'list2', text: 'C#' },
            { id: 'list3', text: 'C++' },
            { id: 'list4', text: '.NET' },
            { id: 'list5', text: 'Oracle' },
            { id: 'list6', text: 'GO' },
            { id: 'list7', text: 'Haskell' },
            { id: 'list8', text: 'Racket' },
            { id: 'list9', text: 'F#' }
        ];
        beforeEach(() => {
            document.body.innerHTML = '';
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (ele) {
                ele.remove();
            }
        });
        it('Multiselect Item template with allowFiltering and maximumSelectionLength property enables the filtered item in the popup from second time', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: datasource,
                allowFiltering: true,
                showClearButton: true,
                fields:{text:"text",value:"text"},
                showDropDownIcon: true,
                itemTemplate: '<div><div class="ename"> ${text} </div></div>',
                maximumSelectionLength: 1
            });
            listObj.appendTo('#multi');
            listObj.showPopup();
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[2];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            (<any>listObj).inputElement.value = "J";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 74;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect(listObj.ulElement.childElementCount === 1).toBe(true);
            expect(listObj.ulElement.children[0].classList.contains('e-disable')).toBe(true);
            (<any>listObj).inputElement.value = "";
            keyboardEventArgs.keyCode = 8;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            (<any>listObj).inputElement.value = "J";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 74;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect(listObj.ulElement.childElementCount === 1).toBe(true);
            expect(listObj.ulElement.children[0].classList.contains('e-disable')).toBe(true);
        });
    });
    describe('EJ2-60441', () => {
        let count: number = 0;
        let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'multi' });
        let datasource: ['1','2','3']
        beforeEach(() => {
            document.body.innerHTML = '';
            document.body.appendChild(ele);
        });
        afterEach(() => {
            if (ele) {
                ele.remove();
            }
        });
        it('allowCustom feature does not work for a single digit character.', () => {
            let listObj: MultiSelect = new MultiSelect({
                dataSource: datasource,
                allowCustomValue: true,
                value: ['1','2','3']
            });
            listObj.appendTo('#multi');
            (<any>listObj).inputElement.value = "4";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 52;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(listObj.ulElement.childElementCount === 1).toBe(true);
            expect(listObj.ulElement.querySelector('li').textContent === '4').toBe(true);
            (<any>listObj).inputElement.value = "45";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 53;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(listObj.ulElement.childElementCount === 1).toBe(true);
            expect(listObj.ulElement.querySelector('li').textContent === '45').toBe(true);
            let list: Array<HTMLElement> = (<any>listObj).list.querySelectorAll('li');
            mouseEventArgs.target = list[0];
            mouseEventArgs.type = 'click';
            (<any>listObj).onMouseClick(mouseEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(false);
            (<any>listObj).inputElement.value = "6";
            keyboardEventArgs.altKey = false;
            keyboardEventArgs.keyCode = 54;
            (<any>listObj).keyDownStatus = true;
            (<any>listObj).onInput();
            (<any>listObj).keyUp(keyboardEventArgs);
            expect((<any>listObj).isPopupOpen()).toBe(true);
            expect(listObj.ulElement.childElementCount === 1).toBe(true);
            expect(listObj.ulElement.querySelector('li').textContent === '6').toBe(true);
        });
    });
    describe('Provide event details in open and close event arguments in dropdown components', () => {
        let listObj: any;
        let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ } };
        let eventDetails : any;
        let element: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'dropdownlist' });
        beforeEach(() => {
            document.body.appendChild(element);
            listObj = new MultiSelect({ dataSource: datasource2,  showDropDownIcon: true, open: (e: PopupEventArgs) => {
                eventDetails = e.event;
            },
            close: (e: PopupEventArgs) => {
                eventDetails = e.event;
            }});
            listObj.appendTo(element);
        });
        afterEach(() => {
            if (element) {
                element.remove();
                document.body.innerHTML = '';
            }
        });
        it('Testing event details by keyboard action', (done) => {
            (<any>listObj).showPopup(keyEventArgs);
            setTimeout(() => {
            expect(!isNullOrUndefined(eventDetails)).toBe(true);
            eventDetails = null;
            (<any>listObj).hidePopup(keyEventArgs);
            expect(!isNullOrUndefined(eventDetails)).toBe(true);
            eventDetails = null;
            done();
            }, 450);
        });
        it('mouse click on input', (done) => {
            let dropEle: HTMLElement = listObj.element.parentElement.parentElement;
            let iconEle: HTMLElement = (<HTMLElement>dropEle.querySelector('.e-ddl-icon'));
            iconEle.innerHTML = 'Icon';
            let clickEvent: MouseEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('mousedown', true, true);
            iconEle.dispatchEvent(clickEvent);
            setTimeout(() => {
            expect(!isNullOrUndefined(eventDetails)).toBe(true);
            eventDetails = null;
            clickEvent.initEvent('mousedown', true, true);
            iconEle.dispatchEvent(clickEvent);
            expect(!isNullOrUndefined(eventDetails)).toBe(true);
            eventDetails = null;
            done();
            }, 450);
        });
    });
});
